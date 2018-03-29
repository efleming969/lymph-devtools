import * as FS from "fs-extra"
import * as Path from "path"
import { Config } from "./index"

export const build = function ( config: Config ) {
    console.log( `copying ${ config.source }/statics to ${ config.target }` )
    return FS.copy( Path.join( config.source, "statics" ), config.target )
}
