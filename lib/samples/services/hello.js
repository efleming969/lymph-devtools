"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lambda_1 = require("./common/Lambda");
exports.handler = function (api_gateway_request, context, sendBackToGateway) {
    const request = Lambda_1.parseApiGatewayRequest(api_gateway_request);
    console.log(request);
    const statusCode = 200;
    const body = JSON.stringify({ text: "hello, world" });
    const headers = { "Access-Control-Allow-Origin": "*" };
    sendBackToGateway(null, { statusCode, body, headers });
};
