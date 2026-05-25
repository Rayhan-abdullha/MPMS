"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignedToMeTasks = exports.deleteTask = exports.updateTaskDetails = exports.updateTaskStatus = exports.getTasksBySprintId = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const client_2 = require("@prisma/client");
const createTask = async (sprintId, userId, // creator (ADMIN / MANAGER)
data) => {
    const { assignedIds, projectId, dueDate, parentTaskId, ...taskData } = data;
    // 1. Check sprint exists
    const sprint = await prisma.sprint.findUnique({
        where: { id: sprintId },
    });
    if (!sprint) {
        const error = new Error('Sprint not found');
        error.statusCode = 404;
        throw error;
    }
    // 2. Validate sprint belongs to project
    if (sprint.projectId !== projectId) {
        const error = new Error('Sprint does not belong to this project');
        error.statusCode = 400;
        throw error;
    }
    // 3. Validate parent task
    if (parentTaskId) {
        const parentTask = await prisma.task.findUnique({
            where: { id: parentTaskId },
        });
        if (!parentTask) {
            const error = new Error('Parent task not found');
            error.statusCode = 404;
            throw error;
        }
    }
    // 4. Validate assignees
    if (assignedIds?.length) {
        const users = await prisma.user.findMany({
            where: { id: { in: assignedIds } },
            select: { id: true },
        });
        if (users.length !== assignedIds.length) {
            const error = new Error('Some assignees are invalid');
            error.statusCode = 400;
            throw error;
        }
    }
    // 5. Create task transaction
    return await prisma.$transaction(async (tx) => {
        const task = await tx.task.create({
            data: {
                ...taskData,
                projectId,
                sprintId,
                parentTaskId: parentTaskId || null,
                dueDate: dueDate ? new Date(dueDate) : null,
                // Default status from schema
                status: 'TODO',
                // Assign users
                assignees: assignedIds?.length
                    ? {
                        create: assignedIds.map((id) => ({
                            userId: id,
                        })),
                    }
                    : undefined,
            },
            include: {
                assignees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
                subTasks: true,
            },
        });
        // 6. Activity log
        await tx.activityLog.create({
            data: {
                type: client_2.ActivityType.TASK_CREATED,
                description: `Task "${task.title}" created successfully.`,
                taskId: task.id,
                userId,
            },
        });
        return task;
    });
};
exports.createTask = createTask;
const getTasksBySprintId = async (sprintId, filters) => {
    const { status, priority, search } = filters;
    const whereClause = {
        sprintId,
    };
    if (status) {
        whereClause.status = status;
    }
    if (priority) {
        whereClause.priority = priority;
    }
    if (sprintId) {
        whereClause.sprintId = sprintId;
    }
    if (search?.trim()) {
        whereClause.OR = [
            {
                title: {
                    contains: search.trim(),
                    mode: 'insensitive',
                },
            },
            {
                description: {
                    contains: search.trim(),
                    mode: 'insensitive',
                },
            },
        ];
    }
    return prisma.task.findMany({
        where: whereClause,
        include: {
            assignees: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true,
                        },
                    },
                },
            },
            activities: {
                select: {
                    id: true,
                    type: true,
                    description: true,
                    createdAt: true,
                    taskId: true,
                    userId: true,
                    // Include the related User model fields needed for the frontend view
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            subTasks: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                },
            },
            _count: {
                select: {
                    comments: true,
                    attachments: true,
                    timeLogs: true,
                },
            },
            project: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                },
            },
            sprint: {
                select: {
                    id: true,
                    title: true,
                    sprintNumber: true,
                },
            },
        },
        orderBy: [
            { priority: 'desc' }, // HIGH first (better UX)
            { createdAt: 'desc' },
        ],
    });
};
exports.getTasksBySprintId = getTasksBySprintId;
const updateTaskStatus = async (taskId, userId, status) => {
    // 1. Enforce validation check on target task entity existence
    const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
    });
    if (!existingTask) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }
    // 2. Execute isolated database write operations inside a strict transaction block
    return await prisma.$transaction(async (tx) => {
        // Perform status modification mutation path
        const updatedTask = await tx.task.update({
            where: { id: taskId },
            data: { status },
        });
        // 3. Document evolutionary transition footprints if state fields do not align
        if (status !== existingTask.status) {
            await tx.activityLog.create({
                data: {
                    type: client_2.ActivityType.TASK_STATUS_CHANGED,
                    description: `Status evolved from ${existingTask.status} -> ${status}`,
                    taskId,
                    userId,
                },
            });
        }
        // // if all task is completed, sprint status will be completed
        // TODO must
        const sprint = await tx.sprint.findUnique({
            where: { id: existingTask.sprintId },
        });
        if (sprint) {
            const tasks = await tx.task.findMany({ where: { sprintId: sprint.id } });
            if (tasks.every((task) => task.status === 'DONE')) {
                await tx.sprint.update({
                    where: { id: sprint.id },
                    data: { status: 'COMPLETED' },
                });
            }
        }
        return updatedTask;
    });
};
exports.updateTaskStatus = updateTaskStatus;
const updateTaskDetails = async (taskId, userId, data) => {
    const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existingTask) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }
    await prisma.$transaction(async (tx) => {
        const task = await tx.task.update({
            where: { id: taskId },
            data,
        });
        await tx.activityLog.create({
            data: {
                type: client_2.ActivityType.TASK_UPDATED,
                description: 'Task details updated successfully.',
                taskId,
                userId,
            },
        });
        // if all task is completed, sprint status will be completed
        // TODO must
        const sprint = await tx.sprint.findUnique({
            where: { id: existingTask.sprintId },
        });
        if (sprint) {
            const tasks = await tx.task.findMany({ where: { sprintId: sprint.id } });
            if (tasks.every((task) => task.status === 'DONE')) {
                await tx.sprint.update({
                    where: { id: sprint.id },
                    data: { status: 'COMPLETED' },
                });
            }
        }
        return task;
    });
};
exports.updateTaskDetails = updateTaskDetails;
const deleteTask = async (taskId) => {
    const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existingTask) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }
    await prisma.task.delete({ where: { id: taskId } });
};
exports.deleteTask = deleteTask;
const getAssignedToMeTasks = async (userId) => {
    const assignments = await prisma.taskAssignee.findMany({
        where: { userId },
        include: {
            task: {
                include: {
                    project: {
                        select: { id: true, title: true },
                    },
                    sprint: {
                        select: { id: true, title: true, sprintNumber: true },
                    },
                },
            },
        },
    });
    const taskIds = assignments.map((a) => a.taskId);
    const [activityLogs, comments] = await Promise.all([
        prisma.activityLog.findMany({
            where: { taskId: { in: taskIds } },
            select: {
                taskId: true,
                createdAt: true,
                type: true,
                description: true,
                user: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.comment.findMany({
            where: { taskId: { in: taskIds } },
            select: {
                taskId: true,
                createdAt: true,
                user: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ]);
    const logsMap = new Map();
    for (const log of activityLogs) {
        if (!logsMap.has(log.taskId))
            logsMap.set(log.taskId, []);
        logsMap.get(log.taskId).push(log);
    }
    const commentsMap = new Map();
    for (const c of comments) {
        if (!commentsMap.has(c.taskId))
            commentsMap.set(c.taskId, []);
        commentsMap.get(c.taskId).push(c);
    }
    return assignments.map((assignment) => {
        const task = assignment.task;
        return {
            ...task,
            // keep only THIS user’s assignment info
            assignee: {
                id: assignment.id,
                taskId: assignment.taskId,
                userId: assignment.userId,
                assignedAt: assignment.assignedAt,
            },
            activityLogs: logsMap.get(task.id) ?? [],
            comments: commentsMap.get(task.id) ?? [],
        };
    });
};
exports.getAssignedToMeTasks = getAssignedToMeTasks;
// export const getActivities = async (taskId: string) => {
//   return await prisma.activityLog.findMany({
//     where: {
//       taskId
//     },
//     select: {
//       id: true,
//       type: true,
//       description: true,
//       createdAt: true,
//       taskId: true,
//       userId: true,
//       // Include the related User model fields needed for the frontend view
//       user: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc", // Sorts logically so the newest activity logs appear first
//     },
//   });
// };
