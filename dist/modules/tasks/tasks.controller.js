"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignedToMeTasks = exports.deleteTask = exports.updateTaskDetails = exports.updateTaskStatus = exports.getProjectTasks = exports.createTask = void 0;
const taskService = __importStar(require("./tasks.service"));
const utils_1 = require("../../utils/utils");
const createTask = async (req, res, next) => {
    try {
        const { sprintId } = req.params;
        const operatorId = req.user.id;
        const task = await taskService.createTask(sprintId, operatorId, req.body);
        (0, utils_1.sendResponse)(res, {
            success: true,
            message: 'Task has been created successfully.',
            data: task,
        }, 201);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const getProjectTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getTasksBySprintId(req.params.sprintId, req.query);
        (0, utils_1.sendResponse)(res, { success: true, message: 'Get all tasks', data: { tasks } }, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectTasks = getProjectTasks;
const updateTaskStatus = async (req, res, next) => {
    const taskId = req.params?.taskId;
    if (!taskId) {
        (0, utils_1.sendResponse)(res, { success: false, message: 'Task id required' }, 400);
        return;
    }
    try {
        const operatorId = req.user.id;
        const task = await taskService.updateTaskStatus(taskId, operatorId, req.body.status);
        (0, utils_1.sendResponse)(res, {
            success: true,
            message: 'Successfully updated task',
            data: { task },
        }, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.updateTaskStatus = updateTaskStatus;
const updateTaskDetails = async (req, res, next) => {
    const taskId = req.params?.taskId;
    if (!taskId) {
        res.status(200).json({ success: false, message: 'Task id required' });
        return;
    }
    try {
        const operatorId = req.user.id;
        const task = await taskService.updateTaskDetails(taskId, operatorId, req.body);
        (0, utils_1.sendResponse)(res, {
            success: true,
            message: 'Successfully updated task',
            data: { task },
        }, 200);
    }
    catch (error) {
        // console.log(error);
        next(error);
    }
};
exports.updateTaskDetails = updateTaskDetails;
const deleteTask = async (req, res, next) => {
    const taskId = req.params.taskId;
    if (!taskId) {
        (0, utils_1.sendResponse)(res, {
            success: false,
            message: 'Task id required',
        }, 400);
        return;
    }
    try {
        await taskService.deleteTask(taskId);
        (0, utils_1.sendResponse)(res, {
            success: true,
            message: 'Successfully deleted task',
        }, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
const getAssignedToMeTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getAssignedToMeTasks(req.user.id);
        (0, utils_1.sendResponse)(res, { success: true, message: 'Get all assigned tasks', data: { tasks } }, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.getAssignedToMeTasks = getAssignedToMeTasks;
// export const getActivities = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const activities = await taskService.getActivities(req.params.id);
//     res.status(200).json({ status: 'success', data: { activities } });
//   } catch (error) {
//     next(error);
//   }
// };
