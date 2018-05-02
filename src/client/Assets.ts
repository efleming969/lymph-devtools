import * as FS from "fs-extra"
import * as Path from "path"

export const copy = function ( config ) {
    const assets_source_dir = Path.join( config.source, "assets" )
    const assets_target_dir = Path.join( config.target, "assets" )

    return FS.copy( assets_source_dir, assets_target_dir )
        .then( () => config )
}
