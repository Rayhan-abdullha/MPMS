"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.login = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const utils_1 = require("../../utils/utils");
const register = async (req, res, next) => {
    try {
        const newUser = await authService.registerUser(req.body);
        return (0, utils_1.sendResponse)(res, {
            success: true,
            data: newUser,
        }, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const authData = await authService.loginUser(req.body);
        // res.cookie('mpms_auth_token', authData.accessToken, {
        //   httpOnly: true,
        //   secure: true, // REQUIRED on Render (HTTPS)
        //   sameSite: 'none', // REQUIRED for cross-site (Vercel/localhost ↔ Render)
        //   maxAge: 24 * 60 * 60 * 1000,
        // });
        // res.cookie('mpms_user', JSON.stringify(authData.user), {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: 'none',
        //   maxAge: 24 * 60 * 60 * 1000,
        // });
        return (0, utils_1.sendResponse)(res, {
            success: true,
            data: authData,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logoutController = async (req, res, next) => {
    console.log('Logging out...');
    try {
        // res.clearCookie('mpms_auth_token', {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: 'none',
        //   path: '/',
        // });
        // res.clearCookie('mpms_user', {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: 'none',
        //   path: '/',
        // });
        return (0, utils_1.sendResponse)(res, {
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutController = logoutController;
