const Server = require( "./lib/index" )

Server.run( {
    port: 8080, root: "src/sample",
    modules: {
        main: { title: "foobar" }
    }
} )