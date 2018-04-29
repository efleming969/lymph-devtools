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

export const compile = ( config ) => function ( module_config ) {
    const template_source_file = Path.join(
        config.source, "templates", `${ module_config.template }.html` )

    const template_target_file = Path.join(
        config.target, module_config.name, "index.html" )

    console.log( "compiling", template_target_file )

    return FS.readFile( template_source_file, "utf8" )
        .then( ( raw_template ) => compileTemplate( module_config.name, module_config.dependencies, raw_template ) )
        .then( ( compiled_template ) => compiled_template( module_config.data ) )
        .then( ( rendered_template ) => FS.writeFile( template_target_file, rendered_template, "utf8" ) )
        .then( () => module_config )
}

