"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSprints = exports.deleteSprint = exports.updateSprint = exports.getSprintsByProject = exports.createSprint = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const createSprint = async (projectId, data) => {
    // Check if project exists
    const project = await prisma_1.default.project.findUnique({ where: { id: projectId } });
    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        throw error;
    }
    // Auto-increment sprint number per project using an aggregate query
    const aggregate = await prisma_1.default.sprint.aggregate({
        where: { projectId },
        _max: { sprintNumber: true },
    });
    const nextSprintNumber = (aggregate._max.sprintNumber || 0) + 1;
    return await prisma_1.default.sprint.create({
        data: {
            title: data.title,
            sprintNumber: nextSprintNumber,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            order: data.order || 0,
            projectId,
        },
    });
};
exports.createSprint = createSprint;
const getSprintsByProject = async (projectId) => {
    return await prisma_1.default.sprint.findMany({
        where: { projectId },
        orderBy: { order: 'asc' },
        include: { _count: { select: { tasks: true } } },
    });
};
exports.getSprintsByProject = getSprintsByProject;
const updateSprint = async (sprintId, data) => {
    const sprint = await prisma_1.default.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
        const error = new Error('Sprint not found');
        error.statusCode = 404;
        throw error;
    }
    return await prisma_1.default.sprint.update({
        where: { id: sprintId },
        data: {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
        },
    });
};
exports.updateSprint = updateSprint;
const deleteSprint = async (sprintId) => {
    const sprint = await prisma_1.default.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
        const error = new Error('Sprint not found');
        error.statusCode = 404;
        throw error;
    }
    await prisma_1.default.sprint.delete({ where: { id: sprintId } });
};
exports.deleteSprint = deleteSprint;
const getAllSprints = async () => {
    const sprints = await prisma_1.default.sprint.findMany({
        orderBy: {
            order: 'asc',
        },
        include: {
            project: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                },
            },
            _count: {
                select: {
                    tasks: true,
                },
            },
        },
    });
    return sprints.map((sprint) => ({
        id: sprint.id,
        title: sprint.title,
        sprintNumber: sprint.sprintNumber,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        order: sprint.order,
        project: sprint.project,
        taskCount: sprint._count.tasks,
        status: sprint.status,
        createdAt: sprint.createdAt,
        updatedAt: sprint.updatedAt,
    }));
};
exports.getAllSprints = getAllSprints;
