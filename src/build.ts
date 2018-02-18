const Typescript = require( "typescript" )
const FS = require( "fs-extra" )
const Path = require( "path" )
const Rollup = require( "rollup" )
const RollupResolve = require( "rollup-plugin-node-resolve" )
const Mustache = require( "mustache" )
const PostCSS = require( "postcss" )

const cwd = process.cwd()
const modules_src_dir = Path.join( cwd, "src", "modules" )
const build_dir = Path.join( cwd, "build", "modules" )
const modules_dist_dir = Path.join( cwd, "dist", "modules" )

const compileCommonStyles = function () {
    FS.ensureDirSync( Path.join( cwd, "dist", "common" ) )
    const common_dir = Path.join( cwd, "src", "common" )
    FS.readdir( common_dir, function ( err, files ) {
        files.filter( f => f.endsWith( "css" ) ).forEach( function ( file_name ) {
            const src_path = Path.join( common_dir, file_name )
            FS.readFile( src_path, "utf8", function ( err, style_src ) {
                const dist_path = Path.join( cwd, "dist", "common", file_name )
                const post_css_config = { from: src_path, to: dist_path }
                PostCSS( [] ).process( style_src, post_css_config ).then( function ( result ) {
                    FS.writeFile( dist_path, result.css, function ( err ) {
                        console.log( "created common style:", dist_path )
                    } )
                } )
            } )
        } )
    } )
}

export const buildModules = function () {
    const compileScript = function ( module_name ) {
        const compile_options = {
            noEmitOnError: true,
            noImplicitAny: false,
            target: Typescript.ScriptTarget.ES2015,
            rootDir: "src",
            module: Typescript.ModuleKind.ES2015,
            moduleResolution: Typescript.ModuleResolutionKind.NodeJs,
            outDir: "build"
        }

        const file_names = [ Path.join( modules_src_dir, module_name, "index.ts" ) ]

        let program = Typescript.createProgram( file_names, compile_options )
        let emitResult = program.emit()

        let allDiagnostics = Typescript.getPreEmitDiagnostics( program )
            .concat( emitResult.diagnostics )

        allDiagnostics.forEach( diagnostic => {
            if ( diagnostic.file ) {
                let { line, character } =
                    diagnostic.file.getLineAndCharacterOfPosition( diagnostic.start )

                let message =
                    Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )

                console.log( `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}` )
            }
            else {
                console.log( `${Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )}` )
            }
        } )
    }

    const buildScript = function ( module_name ) {
        const rollup_input_options = {
            input: Path.join( build_dir, module_name, "index.js" ),
            plugins: [ RollupResolve() ]
        }

        const rollup_output_options = {
            file: Path.join( modules_dist_dir, module_name, "index.js" ),
            format: "iife"
        }

        return Rollup.rollup( rollup_input_options ).then( function ( bundle ) {
            return bundle.write( rollup_output_options )
        } ).then( function () {
            console.log( "done bundling" )
        } ).catch( function ( err ) {
            console.log( "there was an error" )
        } )
    }

    const compileTemplate = function ( module_name ) {
        const src_path = Path.join( modules_src_dir, module_name, "index.html" )
        FS.readFile( src_path, "utf8", function ( err, src_template ) {
            const compiled_template = Mustache.render( src_template, { title: "main" } )
            const dist_path = Path.join( modules_dist_dir, module_name, "index.html" )
            FS.writeFile( dist_path, compiled_template, "utf8", function ( err ) {
                console.log( "created module template:", dist_path )
            } )
        } )
    }

    const compileStyle = function ( module_name ) {
        const src_path = Path.join( modules_src_dir, module_name, "index.css" )
        const dist_path = Path.join( modules_dist_dir, module_name, "index.css" )

        FS.readFile( src_path, "utf8", function ( err, style_src ) {
            const post_css_config = { from: src_path, to: dist_path }
            PostCSS( [] ).process( style_src, post_css_config ).then( function ( result ) {
                FS.writeFile( dist_path, result.css, function ( err ) {
                    console.log( "created module style:", dist_path )
                } )
            } )
        } )
    }

    FS.readdir( modules_src_dir, function ( err, modules ) {
        modules.forEach( function ( module_name ) {
            FS.ensureDirSync( Path.join( modules_dist_dir, module_name ) )
            compileScript( module_name )
            buildScript( module_name )
            compileTemplate( module_name )
            compileStyle( module_name )
        } )
    } )
}

const copyCommonImages = function () {
    FS.copySync(
        Path.join( cwd, "src", "common", "images" ),
        Path.join( cwd, "dist", "common", "images" ) )
}

export const run = function () {
    compileCommonStyles()
    copyCommonImages()
    buildModules()
}
