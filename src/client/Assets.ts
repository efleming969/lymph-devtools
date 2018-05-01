import * as FS from "fs-extra"
import * as Path from "path"

export const copy = function ( config ) {
    const assets_source_dir = Path.join( config.source, "assets" )
    const assets_target_dir = Path.join( config.target, "assets" )

    const index_source_file = Path.join( config.source, "index.html" )
    const index_target_file = Path.join( config.target, "index.html" )

    return FS.copy( assets_source_dir, assets_target_dir )
        .then( () => FS.copy( index_source_file, index_target_file ) )
        .then( () => config )
}
