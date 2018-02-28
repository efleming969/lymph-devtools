import * as FS from "fs-extra"
import * as Path from "path"
import * as Glob from "globby"

import { multiline } from "./Utils"

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

const renderStyle = style => `<link rel="stylesheet" href="${style}">`

const renderModule = is_dev => function ( path ) {
    const type = is_dev ? "module" : "application/javascript"
    return `<script type="${type}" src="${path}"></script>`
}

const renderScript = is_dev => function ( script: TemplateScript ) {
    const path = is_dev ? script.local : script.remote
    return `<script type="application/javascript" src="${path}"></script>`
}

export const render = function ( template: Template ) {
    const { name, config, dev } = template

    const text = multiline`
        | <!DOCTYPE html>

        | <html lang="en">

        | <head>
        |     <meta charset="UTF-8">
        |     <meta http-equiv="x-ua-compatible" content="ie=edge">
        |     <meta name="viewport" content="width=device-width, initial-scale=1">
        |     <title>${config.title}</title>

        |     ${ config.styles.map( renderStyle ).join( "" ) }

        |     ${ config.scripts.map( renderScript( dev ) ).join( "" )}
        |     ${ config.modules.map( renderModule( dev ) ).join( "" )}
        | </head>

        | <body></body>

        | </html>
    `

    return { name, dev, config, text }
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
