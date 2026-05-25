"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Cannot find matching route for [${req.method}] ${req.originalUrl} on this server.`);
    error.statusCode = 404;
    // Forwarding to the global error boundary below
    next(error);
};
exports.notFoundHandler = notFoundHandler;
