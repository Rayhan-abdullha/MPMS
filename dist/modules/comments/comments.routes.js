"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controller_1 = require("./comments.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.route('/task/:taskId').post(comments_controller_1.postComment).get(comments_controller_1.getComments);
exports.default = router;
