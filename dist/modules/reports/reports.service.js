"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectDashboardMetrics = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const getProjectDashboardMetrics = async (projectId) => {
    const project = await prisma_1.default.project.findUnique({ where: { id: projectId } });
    if (!project) {
        const error = new Error('Project calculations failed: target not found');
        error.statusCode = 404;
        throw error;
    }
    const tasksGroup = await prisma_1.default.task.groupBy({
        by: ['status'],
        where: { projectId },
        _count: { id: true },
        _sum: { estimateHours: true },
    });
    const totalTimeLogs = await prisma_1.default.timeLog.aggregate({
        where: { task: { projectId } },
        _sum: { hours: true },
    });
    // Structural mapping calculations calculations
    let totalTasks = 0;
    let doneTasks = 0;
    tasksGroup.forEach((group) => {
        totalTasks += group._count.id;
        if (group.status === client_1.TaskStatus.DONE) {
            doneTasks = group._count.id;
        }
    });
    const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    return {
        projectId,
        title: project.title,
        completionPercentage,
        totalTasksCount: totalTasks,
        breakdown: tasksGroup.map((g) => ({
            status: g.status,
            count: g._count.id,
        })),
        hoursLoggedSummary: totalTimeLogs._sum.hours || 0,
    };
};
exports.getProjectDashboardMetrics = getProjectDashboardMetrics;
