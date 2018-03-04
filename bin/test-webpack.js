const Path = require( "path" )
const Webpack = require( "webpack" )

const options = {
    entry: "./src/samples/services/hello-commands.js",
    output: {
        path: Path.join( process.cwd(), "build" ),
        libraryTarget: "commonjs",
        filename: "index.js"
    },
    target: "node",
    externals: [ "aws-sdk" ]
}

Webpack( options, function ( err, stats ) {
    if ( err ) {
        console.log( err )
        return
    }

    if ( stats.hasErrors() ) {
        console.log( stats.toString() )
    }

    console.log( "done" )
} )