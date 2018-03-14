import * as AWS from "aws-sdk"
import * as JWT from "jsonwebtoken"

import { parseApiGatewayRequest } from "./common/Lambda"

export const handler = function ( api_gateway_request, context, sendBackToGateway ) {
    const request = parseApiGatewayRequest( api_gateway_request )

    const s3 = new AWS.S3( { region: "us-east-1" } )

    const token = JWT.sign({foo:"bar"}, "secret")

    s3.listBuckets( function ( error, data ) {
        console.log( data )
        console.log( request )

        const statusCode = 200
        const body = JSON.stringify( { text: "whatup, " + token } )
        const headers = {}

        sendBackToGateway( null, { statusCode, body, headers } )
    } )
}
