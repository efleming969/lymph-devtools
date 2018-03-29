import * as Path from "path"
import * as FS from "fs-extra"
import * as Rollup from "rollup"
import * as RollupUglify from "rollup-plugin-uglify"

import { Config } from "./index"

const createBundle = ( config: Config ) => function ( bundle_name: string ) {
    const bundle_root_script = Path.join( config.target, "scripts", `${ bundle_name }.js` )
    const bundle_target_script = Path.join( config.target, "bundles", `${ bundle_name }.js` )

    const rollup_input_options: Rollup.InputOptions = {
        input: bundle_root_script,
        onwarn: function ( warning ) {
            // this suppresses warnings from rollup
        },
        plugins: [
            RollupUglify()
        ]
    }

    const rollup_output_options: Rollup.OutputOptions = {
        file: bundle_target_script,
        format: "iife",
        name: bundle_name,
        globals: {}
    }

    return Rollup.rollup( rollup_input_options )
        .then( rollup_bundle => rollup_bundle.write( rollup_output_options ) )
}

export const build = function ( config: Config ) {
    return FS.ensureDir( Path.join( config.target, "bundles" ) ).then( function () {
        return config.bundles.map( createBundle( config ) )
    } )
}