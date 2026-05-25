"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWorkTime = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const logWorkTime = async (taskId, userId, hours, description) => {
    const task = await prisma_1.default.task.findUnique({ where: { id: taskId } });
    if (!task) {
        const error = new Error('Task context not found');
        error.statusCode = 404;
        throw error;
    }
    return await prisma_1.default.timeLog.create({
        data: {
            hours,
            description,
            taskId,
            userId,
        },
    });
};
exports.logWorkTime = logWorkTime;
