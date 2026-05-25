"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: Missing token' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: Missing token' });
        return;
    }
    if (!env_1.default.access_token_secret) {
        res.status(500).json({ message: 'Server error: Missing token secret' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.access_token_secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
