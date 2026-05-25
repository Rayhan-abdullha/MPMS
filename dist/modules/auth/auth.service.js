"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const env_1 = __importDefault(require("../../config/env"));
const registerUser = async (data) => {
    const { name, email, password, role, department } = data;
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        const error = new Error('Email already registered');
        error.statusCode = 400;
        throw error;
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'MEMBER',
            department,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
        },
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    if (!user.isActive) {
        const error = new Error('Account has been deactivated');
        error.statusCode = 403;
        throw error;
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.default.access_token_secret, // Make sure this matches your environment key configuration!
    { expiresIn: '1d' });
    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
exports.loginUser = loginUser;
