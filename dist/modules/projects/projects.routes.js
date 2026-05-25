"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Look at how simple routing files stay!
const express_1 = require("express");
const projects_controller_1 = require("./projects.controller");
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const projects_validation_1 = require("./projects.validation");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER), (0, validate_1.validate)(projects_validation_1.createProjectSchema), projects_controller_1.createProject);
router.get('/', auth_1.authenticate, projects_controller_1.getAllProjects);
router.get('/:id', auth_1.authenticate, projects_controller_1.getProjectById);
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN, client_1.UserRole.MANAGER), (0, validate_1.validate)(projects_validation_1.updateProjectSchema), projects_controller_1.updateProject);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.ADMIN), projects_controller_1.deleteProject);
exports.default = router;
