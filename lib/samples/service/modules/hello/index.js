"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = function (api_gateway_request, context, sendBackToGateway) {
    console.log(api_gateway_request);
    const statusCode = 200;
    const body = JSON.stringify({ text: "hello, world" });
    const headers = { "Access-Control-Allow-Origin": "*" };
    sendBackToGateway(null, { statusCode, body, headers });
};
