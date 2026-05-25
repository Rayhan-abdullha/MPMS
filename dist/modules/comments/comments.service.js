"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskCommentsTree = exports.addCommentToTask = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const addCommentToTask = async (taskId, userId, data) => {
    const task = await prisma_1.default.task.findUnique({ where: { id: taskId } });
    if (!task) {
        const error = new Error('Target task context missing');
        error.statusCode = 404;
        throw error;
    }
    if (data.parentCommentId) {
        const parent = await prisma_1.default.comment.findUnique({
            where: { id: data.parentCommentId },
        });
        if (!parent) {
            const error = new Error('Parent thread item missing');
            error.statusCode = 404;
            throw error;
        }
    }
    return await prisma_1.default.$transaction(async (tx) => {
        const comment = await tx.comment.create({
            data: {
                content: data.content,
                taskId,
                userId,
                parentCommentId: data.parentCommentId || null,
            },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                replies: true,
            },
        });
        await tx.activityLog.create({
            data: {
                type: client_1.ActivityType.COMMENT_CREATED,
                description: `New comment added to task.`,
                taskId,
                userId,
            },
        });
        return comment;
    });
};
exports.addCommentToTask = addCommentToTask;
const getTaskCommentsTree = async (taskId) => {
    // Fetch root comments and deeply map their recursive child relations
    return await prisma_1.default.comment.findMany({
        where: { taskId, parentCommentId: null },
        include: {
            user: { select: { id: true, name: true, avatar: true } },
            replies: {
                include: {
                    user: { select: { id: true, name: true, avatar: true } },
                    replies: true, // Support deep levels
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });
};
exports.getTaskCommentsTree = getTaskCommentsTree;
