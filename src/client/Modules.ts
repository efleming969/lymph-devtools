import * as Path from "path"
import * as FS from "fs-extra"

export const readConfig = function ( config, module_name ) {
    const module_config_file = Path.join( config.source, "modules", module_name, "index.json" )

    console.log( "==================================================" )
    console.log( "reading module config" )
    console.log( "==================================================" )

    return FS.readFile( module_config_file, "utf8" )
        .then( ( raw_config ) => JSON.parse( raw_config ) )
        .then( ( module_config ) => Object.assign( {}, module_config, { name: module_name } ) )
}
