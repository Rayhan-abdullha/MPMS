"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const env_1 = __importDefault(require("../config/env"));
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorDetails = null;
    // 🔴 Zod Validation Error
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorDetails = err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
    }
    // 🔴 Prisma Errors
    else if (err?.code?.startsWith('P')) {
        statusCode = 400;
        switch (err.code) {
            case 'P2002':
                message = 'Duplicate field value';
                break;
            case 'P2025':
                message = 'Record not found';
                break;
            default:
                message = 'Database error';
        }
    }
    // 🔴 JWT Errors
    else if (err?.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (err?.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    // 🔴 Custom App Error (optional support)
    else if (err?.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // 🚀 Response (sanitized)
    res.status(statusCode).json({
        success: false,
        message,
        ...(errorDetails && { errors: errorDetails }),
        // only show stack in dev
        ...(env_1.default.node_env === 'development' && {
            stack: err.stack,
        }),
    });
};
exports.errorHandler = errorHandler;
