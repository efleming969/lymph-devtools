import * as Typescript from "typescript"
import * as Path from "path"
import * as Glob from "globby"
import * as FS from "fs-extra"
import * as Rollup from "rollup"
import * as RollupUglify from "rollup-plugin-uglify"

export type Script = {
    name: string,
    script: string,
    bundle: string
}

export const compile = function ( modules: Script[] ) {
    const compile_options = {
        noEmitOnError: true,
        noImplicitAny: false,
        target: Typescript.ScriptTarget.ES2015,
        module: Typescript.ModuleKind.ES2015,
        moduleResolution: Typescript.ModuleResolutionKind.NodeJs,
        inlineSourceMap: true,
        inlineSources: true,
    }

    const module_scripts = modules.map( m => m.script )

    const program = Typescript.createProgram( module_scripts, compile_options )

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

        results.length > 0 ? reject( results ) : resolve( modules )
    } )
}

export const bundle = function ( modules: Script[] ) {
    return Promise.all( modules.map( function ( module ) {
        const rollup_input_options: Rollup.InputOptions = {
            input: module.script,
            onwarn: function ( warning ) {
            },
            plugins: [
                RollupUglify()
            ]
        }

        const rollup_output_options: Rollup.OutputOptions = {
            file: module.bundle,
            format: "iife",
            name: module.name,
            globals: {}
        }

        return Rollup.rollup( rollup_input_options )
            .then( bundle => bundle.write( rollup_output_options ) )

    } ) ).then( () => modules )
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
