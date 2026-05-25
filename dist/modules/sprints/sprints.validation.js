"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSprintSchema = exports.createSprintSchema = void 0;
const zod_1 = require("zod");
exports.createSprintSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2, 'Sprint title must be at least 2 characters'),
        startDate: zod_1.z
            .string()
            .datetime({ message: 'Invalid ISO start date string' }),
        endDate: zod_1.z.string().datetime({ message: 'Invalid ISO end date string' }),
        order: zod_1.z.number().int().nonnegative().optional(),
    }),
});
exports.updateSprintSchema = zod_1.z.object({
    body: exports.createSprintSchema.shape.body.partial(),
});
