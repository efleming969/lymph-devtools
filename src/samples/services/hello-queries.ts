import * as URL from "url"

export const handler = function ( api_gateway_request, context, sendBackToGateway ) {
    const statusCode = 200
    const body = JSON.stringify( { text: `hello, ${ context.functionVersion }` } )
    const headers = {}

    const url = URL.parse( "http://httpbin.org/get" )

    console.log( url )

    sendBackToGateway( null, { statusCode, body, headers } )
}
