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
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const projectService = __importStar(require("./projects.service"));
const utils_1 = require("../../utils/utils");
const createProject = async (req, res, next) => {
    try {
        const creatorId = req.user.id;
        const project = await projectService.createNewProject(req.body, creatorId);
        res.status(201).json({ status: 'success', data: { project } });
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
const getAllProjects = async (req, res, next) => {
    try {
        const result = await projectService.fetchAllProjects(req.query);
        res.status(200).json({
            status: 'success',
            results: result.results,
            meta: result.meta,
            data: { projects: result.projects },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (req, res, next) => {
    try {
        const project = await projectService.fetchProjectById(req.params.id);
        res.status(200).json({ status: 'success', data: { project } });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res, next) => {
    try {
        const project = await projectService.updateProjectById(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: { project } });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res, next) => {
    try {
        await projectService.removeProjectById(req.params.id);
        (0, utils_1.sendResponse)(res, {
            success: true,
            message: 'Successfully deleted project',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
