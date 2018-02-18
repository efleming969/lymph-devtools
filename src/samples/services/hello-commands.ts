import { parseApiGatewayRequest } from "./common/Lambda"

export const handler = function ( api_gateway_request, context, sendBackToGateway ) {
    const request = parseApiGatewayRequest( api_gateway_request )

    console.log( request )

    const statusCode = 200
    const body = JSON.stringify( { text: "hello, world" } )
    const headers = {}

    sendBackToGateway( null, { statusCode, body, headers } )
}
