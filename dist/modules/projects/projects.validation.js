"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
        client: zod_1.z.string().min(2, 'Client name is required'),
        description: zod_1.z.string().optional(),
        startDate: zod_1.z.string().datetime({ message: 'Invalid ISO date string' }),
        endDate: zod_1.z.string().datetime().optional(),
        budget: zod_1.z.number().nonnegative().optional(),
        thumbnail: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        status: zod_1.z.nativeEnum(client_1.ProjectStatus).optional(),
    }),
});
exports.updateProjectSchema = zod_1.z.object({
    body: exports.createProjectSchema.shape.body.partial(),
});
