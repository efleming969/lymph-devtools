import * as Handlebars from "handlebars"
import * as FS from "fs-extra"
import * as Path from "path"

import { Config } from "./index"

const compileTemplate = function ( module_name, dependencies, raw_template ) {
    Handlebars.registerHelper( "module", function () {
        const dependencies_script = `<script src="/assets/scripts/${ dependencies }.js"></script>`
        const module_style = `<link rel="stylesheet" href="/${ module_name }/index.css">`
        const module_script = `<script src="/${ module_name }/index.js" defer></script>`

        return new Handlebars.SafeString(
            dependencies_script + module_style + module_script )
    } )

    return Handlebars.compile( raw_template )
}

export const build = function ( config: Config, module_config ) {

}

export const compile = ( config ) => function ( module_config ) {
    console.log( "" )
    console.log( "Compiling module template" )
    console.log( "==================================================" )

    const template_source_file = Path.join(
        config.source, "templates", `${ module_config.template }.html` )

    const template_target_file = Path.join(
        config.target, module_config.name, "index.html" )

    console.log( template_source_file )

    return FS.readFile( template_source_file, "utf8" )
        .then( ( raw_template ) => compileTemplate( module_config.name, module_config.dependencies, raw_template ) )
        .then( ( compiled_template ) => compiled_template( module_config.data ) )
        .then( ( rendered_template ) => FS.writeFile( template_target_file, rendered_template, "utf8" ) )
        .then( () => module_config )
}

