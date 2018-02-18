"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseApiGatewayRequest = function (request) {
    return {
        name: request.pathParameters.proxy,
        data: JSON.parse(request.body),
        headers: request.headers
    };
};
