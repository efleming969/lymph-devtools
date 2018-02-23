const helpers = {
    module: function ( ctx, module_uri ) {
        const type = ctx.dev ? "module" : "application/javascript"
        const src = ctx.dev ? module_uri : module_uri + ".js"
        return `<script type="${type}" src="${src}"></script>`
    }
}

export const render = function ( template_string: string, context: any ) {
    return template_string.replace( /@([a-zA-Z\.]*)\((.*)\)/g, function ( _, name, args ) {
        try {
            const fn = `return helpers.${ name }( ctx, ${ args })`
            return new Function( "helpers", "ctx", fn ).apply( null, [ helpers, context ] )
        } catch ( e ) {
            return ''
        }
    } )
}

