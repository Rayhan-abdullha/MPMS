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
const express_1 = require("express");
const taskController = __importStar(require("./tasks.controller"));
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const tasks_validation_1 = require("./tasks.validation");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/sprints/:sprintId', (0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER), (0, validate_1.validate)(tasks_validation_1.createTaskSchema), taskController.createTask);
router.get('/sprints/:sprintId', (0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER, client_1.UserRole.MEMBER), taskController.getProjectTasks);
router.patch('/:taskId/status', (0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER, client_1.UserRole.MEMBER), (0, validate_1.validate)(tasks_validation_1.updateTaskSchema), taskController.updateTaskStatus);
router.put('/:taskId', (0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER, client_1.UserRole.MEMBER), (0, validate_1.validate)(tasks_validation_1.updateTaskSchema), taskController.updateTaskDetails);
router.delete('/:taskId', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER), taskController.deleteTask);
router.get('/assigned-to-me', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER, client_1.UserRole.MEMBER), taskController.getAssignedToMeTasks);
// router.get("/activities", taskController.getActivities);
exports.default = router;
