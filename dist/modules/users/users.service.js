"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamDirectory = exports.updateProfile = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const updateProfile = async (userId, data) => {
    return await prisma_1.default.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            department: true,
            role: true,
            avatar: true,
        },
    });
};
exports.updateProfile = updateProfile;
const getTeamDirectory = async (filters) => {
    return await prisma_1.default.user.findMany({
        where: {
            department: filters.department || undefined,
            role: filters.role || undefined,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            avatar: true,
            isActive: true,
        },
    });
};
exports.getTeamDirectory = getTeamDirectory;
