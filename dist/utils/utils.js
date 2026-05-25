"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = sendResponse;
function sendResponse(res, apiResponse, status = 200) {
    return res.status(status).json({
        status,
        ...apiResponse,
    });
}
