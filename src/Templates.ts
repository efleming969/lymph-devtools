import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"

import { multiline } from "./Utils"
import { Module } from "./Clients"

export type TemplateScript = {
    name: string,
    local: string,
    remote: string
}

export type TemplateConfig = {
    title: string,
    styles: string[],
    scripts: TemplateScript[],
    modules: string[]
}

export type Template = {
    name: string,
    config: TemplateConfig,
    text: string,
    dev: boolean
}

const renderStyle = style => `<link rel="stylesheet" href="${ style }">`

const renderModule = is_dev => function ( path ) {
    const type = is_dev ? "module" : "application/javascript"
    const src = path + (is_dev ? "" : ".js")
    return `<script type="${type}" src="${src}" defer></script>`
}

const renderScript = is_dev => function ( script: TemplateScript ) {
    const path = is_dev ? script.local : script.remote
    return `<script type="application/javascript" src="${path}"></script>`
}

export const render = ( dev: boolean ) => function ( module: Module ) {
    const text = multiline`
        | <!DOCTYPE html>

        | <html lang="en">

        | <head>
        |     <meta charset="UTF-8">
        |     <meta http-equiv="x-ua-compatible" content="ie=edge">
        |     <meta name="viewport" content="width=device-width, initial-scale=1">
        |     <title>${ module.title }</title>
        |     <link rel="icon" href="statics/images/favicon.ico">

        |     ${ module.styles.map( s => (dev) ? s.source : s.target ).map( renderStyle ).join( "" ) }

        |     ${ module.scripts.map( renderScript( dev ) ).join( "" )}
        |     ${ renderModule( dev )( module.main ) }
        | </head>

        | <body></body>

        | </html>
    `

    return module
}

export const read = function ( config_file_path: string ): Promise<Template> {
    const name = Path.basename( config_file_path, ".json" )
    return FS.readFile( config_file_path, "utf8" )
        .then( config_string => JSON.parse( config_string ) as TemplateConfig )
        .then( config => ({ name, config, text: "" }) )
}

export const detect = function ( source_dir: string ): Promise<Template[]> {
    const config_file_pattern = Path.join( source_dir, "*.json" )

    const parseToTemplateConfig = config_string => JSON.parse( config_string ) as TemplateConfig

    return Glob( config_file_pattern ).then( function ( config_file_paths ) {
        return config_file_paths.map( function ( config_file_path ) {
            const name = Path.basename( config_file_path, ".json" )
            return FS.readFile( config_file_path, "utf8" )
                .then( parseToTemplateConfig )
                .then( config => ({ name, config, text: "" }) )
        } )
    } ).then( parse_config_promises => Promise.all( parse_config_promises ) )
}

export const write = ( target: string ) => function ( template: Template ): Promise<void> {
    const file_name = Path.join( target, template.name + ".html" )
    return FS.ensureDir( target )
        .then( () => FS.writeFile( file_name, template.text, "utf8" ) )
}

export const build = ( dev: boolean ) => function ( modules: Module[] ): Promise<Module[]> {
    return Promise.all( modules.map( function ( module ) {
        return FS.writeFile( module, "utf8", render( dev )( module ) )
    } ) )
}
