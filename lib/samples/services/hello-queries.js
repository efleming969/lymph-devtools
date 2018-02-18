"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = function (api_gateway_request, context, sendBackToGateway) {
    const statusCode = 200;
    const body = JSON.stringify({ text: "hello, world" });
    const headers = {};
    sendBackToGateway(null, { statusCode, body, headers });
};
