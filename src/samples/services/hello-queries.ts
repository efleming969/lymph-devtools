export const handler = function ( api_gateway_request, context, sendBackToGateway ) {
    const statusCode = 200
    const body = JSON.stringify( { text: "hello, " + context.functionVersion } )
    const headers = {}

    sendBackToGateway( null, { statusCode, body, headers } )
}
