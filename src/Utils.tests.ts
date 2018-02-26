import * as Path from "path"

import { recursiveReadDir } from "./Utils"

const root_path = Path.join( process.cwd(), "src", "samples" )

describe( "utils", function () {
    xtest( "recursive file search", function () {
        return recursiveReadDir( root_path ).then( function ( files: string[] ) {
            expect( files.sort() ).toEqual( [
                Path.join( root_path, "/clients/Main.html" ),
                Path.join( root_path, "/clients/images/nodejs-logo.png" ),
                Path.join( root_path, "/clients/scripts/GreetingBuilder.ts" ),
                Path.join( root_path, "/clients/scripts/Main.ts" ),
                Path.join( root_path, "/clients/scripts/Simple.ts" ),
                Path.join( root_path, "/clients/styles/General.css" ),
                Path.join( root_path, "/clients/styles/Main.css" ),
                Path.join( root_path, "/services/common/Lambda.ts" ),
                Path.join( root_path, "/services/hello-commands.ts" ),
                Path.join( root_path, "/services/hello-queries.ts" ),
            ] )
        } )
    } )
} )