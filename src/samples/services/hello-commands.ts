import { S3 } from "aws-sdk"
import { parseApiGatewayRequest } from "./common/Lambda"

export const handler = function ( api_gateway_request, context, sendBackToGateway ) {
    const request = parseApiGatewayRequest( api_gateway_request )

    const s3 = new S3( { region: "us-east-1" } )

    s3.listBuckets( function ( error, data ) {
        console.log( data )
        console.log( request )

        const statusCode = 200
        const body = JSON.stringify( { text: "Whatup, World!" } )
        const headers = {}

        sendBackToGateway( null, { statusCode, body, headers } )
    } )
}
