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
exports.getAllSprints = exports.deleteSprint = exports.updateSprint = exports.getProjectSprints = exports.createSprint = void 0;
const sprintService = __importStar(require("./sprints.service"));
const createSprint = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const sprint = await sprintService.createSprint(projectId, req.body);
        res.status(201).json({ status: 'success', data: { sprint } });
    }
    catch (error) {
        next(error);
    }
};
exports.createSprint = createSprint;
const getProjectSprints = async (req, res, next) => {
    try {
        const sprints = await sprintService.getSprintsByProject(req.params.projectId);
        res.status(200).json({ status: 'success', data: { sprints } });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectSprints = getProjectSprints;
const updateSprint = async (req, res, next) => {
    try {
        const sprint = await sprintService.updateSprint(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: { sprint } });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSprint = updateSprint;
const deleteSprint = async (req, res, next) => {
    try {
        await sprintService.deleteSprint(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSprint = deleteSprint;
const getAllSprints = async (req, res, next) => {
    try {
        const sprints = await sprintService.getAllSprints();
        res.status(200).json({ status: 'success', data: { sprints } });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
exports.getAllSprints = getAllSprints;
