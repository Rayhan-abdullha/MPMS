"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2, 'Task title must be at least 2 characters'),
        description: zod_1.z.string().optional(),
        estimateHours: zod_1.z.number().nonnegative().optional(),
        dueDate: zod_1.z.string().datetime().optional(),
        priority: zod_1.z.nativeEnum(client_1.TaskPriority).optional(),
        status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
        sprintId: zod_1.z.string().cuid().optional(),
        parentTaskId: zod_1.z.string().cuid().optional(),
        assigneeIds: zod_1.z.array(zod_1.z.string().cuid()).optional(),
    }),
});
exports.updateTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
    }),
});
