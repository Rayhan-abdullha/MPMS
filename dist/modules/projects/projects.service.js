"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProjectById = exports.updateProjectById = exports.fetchProjectById = exports.fetchAllProjects = exports.createNewProject = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const createNewProject = async (data, creatorId) => {
    return await prisma_1.default.project.create({
        data: {
            title: data.title,
            client: data.client,
            description: data.description,
            budget: data.budget,
            thumbnail: data.thumbnail,
            status: data.status || client_1.ProjectStatus.PLANNED,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            createdById: creatorId,
        },
    });
};
exports.createNewProject = createNewProject;
const fetchAllProjects = async (query) => {
    const { status, client, search, page = '1', limit = '10' } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    // Build Dynamic Queries safely
    const whereClause = {};
    if (status)
        whereClause.status = status;
    if (client)
        whereClause.client = { contains: client, mode: 'insensitive' };
    if (search) {
        whereClause.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    const [projects, total] = await prisma_1.default.$transaction([
        prisma_1.default.project.findMany({
            where: whereClause,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                _count: { select: { tasks: true, sprints: true } },
            },
        }),
        prisma_1.default.project.count({ where: whereClause }),
    ]);
    return {
        results: projects.length,
        meta: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
        },
        projects,
    };
};
exports.fetchAllProjects = fetchAllProjects;
const fetchProjectById = async (id) => {
    const project = await prisma_1.default.project.findUnique({
        where: { id },
        include: {
            createdBy: { select: { id: true, name: true, email: true } },
            sprints: true,
            tasks: true,
        },
    });
    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        throw error;
    }
    return project;
};
exports.fetchProjectById = fetchProjectById;
const updateProjectById = async (id, updateData) => {
    const existingProject = await prisma_1.default.project.findUnique({ where: { id } });
    if (!existingProject) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        throw error;
    }
    return await prisma_1.default.project.update({
        where: { id },
        data: {
            ...updateData,
            startDate: updateData.startDate
                ? new Date(updateData.startDate)
                : undefined,
            endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
        },
    });
};
exports.updateProjectById = updateProjectById;
const removeProjectById = async (id) => {
    await prisma_1.default.$transaction(async (tx) => {
        const existingProject = await tx.project.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existingProject) {
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error;
        }
        // Delete all activity logs related to tasks in this project
        await tx.activityLog.deleteMany({
            where: {
                task: {
                    projectId: id,
                },
            },
        });
        // Delete project
        await tx.project.delete({
            where: { id },
        });
    });
};
exports.removeProjectById = removeProjectById;
