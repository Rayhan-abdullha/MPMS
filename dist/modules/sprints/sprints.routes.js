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
const sprintController = __importStar(require("./sprints.controller"));
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const sprints_validation_1 = require("./sprints.validation");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router
    .route('/project/:projectId')
    .post((0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER), (0, validate_1.validate)(sprints_validation_1.createSprintSchema), sprintController.createSprint)
    .get(sprintController.getProjectSprints);
router
    .route('/:id')
    .patch((0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER), (0, validate_1.validate)(sprints_validation_1.updateSprintSchema), sprintController.updateSprint)
    .delete((0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER), sprintController.deleteSprint);
router.get('/', sprintController.getAllSprints);
exports.default = router;
