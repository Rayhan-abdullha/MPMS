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
exports.getComments = exports.postComment = void 0;
const commentService = __importStar(require("./comments.service"));
const postComment = async (req, res, next) => {
    try {
        const comment = await commentService.addCommentToTask(req.params.taskId, req.user.id, req.body);
        res.status(201).json({ status: 'success', data: { comment } });
    }
    catch (error) {
        next(error);
    }
};
exports.postComment = postComment;
const getComments = async (req, res, next) => {
    try {
        const comments = await commentService.getTaskCommentsTree(req.params.taskId);
        res.status(200).json({ status: 'success', data: { comments } });
    }
    catch (error) {
        next(error);
    }
};
exports.getComments = getComments;
