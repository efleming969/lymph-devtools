import * as Typescript from "typescript"
import * as Path from "path"
import * as Glob from "globby"
import * as Rollup from "rollup"
import * as FS from "fs-extra"
import * as RollupUglify from "rollup-plugin-uglify"
import { Config, Module, } from "./Clients"

export type Script = {
    name: string,
    script: string,
    bundle: string
}

export type ScriptOptions = {
    name: string,
    directory: string
}

export const render = function ( options: ScriptOptions ) {
    const source_file = Path.join( options.directory, `${ options.name }.ts` )
    const import_regex = /import .* from "(\.{1,2}\/[a-zA-Z\-]*)"/g

    return FS.readFile( source_file, "utf8" ).then( function ( typescript_source ) {
        const result = Typescript.transpileModule( typescript_source, {
            compilerOptions: {
                module: Typescript.ModuleKind.ES2015,
                inlineSources: true,
                inlineSourceMap: true
            },
            fileName: source_file
        } )
        return result.outputText.replace( import_regex, function ( match, p1 ) {
            return match.replace( p1, p1 + ".js" )
        } )
    } )
}

export const compile = ( config: Config ) => function ( module: Module ): Promise<Module> {
    const compile_options = {
        noEmitOnError: true,
        noImplicitAny: false,
        target: Typescript.ScriptTarget.ES2015,
        module: Typescript.ModuleKind.ES2015,
        moduleResolution: Typescript.ModuleResolutionKind.NodeJs,
        inlineSourceMap: true,
        inlineSources: true,
    }

    console.log( "compiling", module.name )

    const main_script = Path.join( config.source, "scripts", module.name + ".ts" )
    const program = Typescript.createProgram( [ main_script ], compile_options )

    return new Promise( function ( resolve, reject ) {
        const emitResult = program.emit()

        const allDiagnostics = Typescript.getPreEmitDiagnostics( program )
            .concat( emitResult.diagnostics )

        const results = allDiagnostics.map( function ( diagnostic ) {
            if ( diagnostic.file ) {
                let { line, character } =
                    diagnostic.file.getLineAndCharacterOfPosition( diagnostic.start )

                let message =
                    Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )

                return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
            }
            else {
                return `${Typescript.flattenDiagnosticMessageText( diagnostic.messageText, '\n' )}`
            }
        } )

        results.length > 0 ? reject( results ) : resolve( module )
    } )
}

export const bundle = ( config: Config ) => function ( module: Module ): Promise<Module> {
    const main_script = Path.join( config.source, "scripts", module.name + ".js" )
    const main_bundle = Path.join( config.target, "scripts", module.name + ".js" )

    const rollup_input_options: Rollup.InputOptions = {
        input: main_script,
        onwarn: function ( warning ) {
            // this suppresses warnings from rollup
        },
        plugins: [
            RollupUglify()
        ]
    }

    const rollup_output_options: Rollup.OutputOptions = {
        file: main_bundle,
        format: "iife",
        name: module.name,
        globals: module.globals
    }

    return Rollup.rollup( rollup_input_options )
        .then( bundle => bundle.write( rollup_output_options ) )
        .then( () => module )
}

export const detect = function ( source_dir: string, target_dir: string ): Promise<Script[]> {
    const config_file_pattern = Path.join( source_dir, "*.json" )

    return Glob( config_file_pattern ).then( function ( config_file_paths ) {
        return config_file_paths.map( function ( config_file_path ) {
            const name = Path.basename( config_file_path, ".json" )
            const script = Path.join( source_dir, "scripts", name + ".ts" )
            const bundle = Path.join( target_dir, "scripts", name + ".js" )
            return { name, bundle, script }
        } )
    } ).then( parse_config_promises => Promise.all( parse_config_promises ) )
}
