import * as Handlebars from "handlebars"
import * as FS from "fs-extra"
import * as Path from "path"

import { Config } from "./index"

const compileTemplate = function ( module_name, dependencies, raw_template ) {
    Handlebars.registerHelper( "module", function () {
        const dependencies_script = `<script src="/static/dependencies/${ dependencies }.js"></script>`
        const module_style = `<link rel="stylesheet" href="/static/styles/${ module_name }.css">`
        const module_script = `<script src="/static/scripts/${ module_name }.js" defer></script>`

        return new Handlebars.SafeString(
            dependencies_script + module_style + module_script )
    } )

    return Handlebars.compile( raw_template )
}

export const build = function ( config: Config, module_config ) {

}

export const render = ( config ) => function ( module_config ) {
    const template_file = Path.join(
        config.source, "templates", `${ module_config.template }.html` )

    return FS.readFile( template_file, "utf8" )
        .then( ( raw_template ) => compileTemplate( module_config.name, module_config.dependencies, raw_template ) )
        .then( ( compiled_template ) => compiled_template( module_config.data ) )
}

