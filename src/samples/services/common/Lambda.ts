export const parseApiGatewayRequest = function( request ) {
    return {
        name: request.pathParameters.proxy,
        data: JSON.parse( request.body ),
        headers: request.headers
    }
}
