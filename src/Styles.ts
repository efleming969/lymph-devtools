import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"
import * as PostCSS from "postcss"

import { Config } from "./Clients"

export type RenderOptions = {
    name: string,
    directory: string
}

const map = fn => list => list.map( fn )
const waitForAll = list_of_promises => Promise.all( list_of_promises )

export const render = function ( options: RenderOptions ) {
    const style_file = Path.join( options.directory, `${ options.name }.css` )
    const process_option = { from: style_file, to: style_file }

    return FS.readFile( style_file, "utf8" )
        .then( css => PostCSS( [] ).process( css, process_option ) )
        .then( result => result.css )
}

const process = function ( option: PostCSS.ProcessOptions ) {
    return FS.readFile( option.from, "utf8" )
        .then( css => PostCSS( [] ).process( css, option ) )
        .then( result => FS.writeFile( option.to, result.css ) )
}

const toProcessOption = ( target: string ) => function ( css_file: string ): PostCSS.ProcessOptions {
    return {
        from: css_file,
        to: Path.join( target, "styles", Path.basename( css_file ) )
    }
}

export const build = function ( config: Config ) {
    const css_file_pattern = Path.join( config.source, "**", "*.css" )

    return FS.ensureDir( Path.join( config.target, "styles" ) )
        .then( () => Glob( css_file_pattern ) )
        .then( map( toProcessOption( config.target ) ) )
        .then( map( process ) )
        .then( waitForAll )
}

