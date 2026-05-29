"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const projects_routes_1 = __importDefault(require("../modules/projects/projects.routes"));
const sprints_routes_1 = __importDefault(require("../modules/sprints/sprints.routes"));
const tasks_routes_1 = __importDefault(require("../modules/tasks/tasks.routes"));
const comments_routes_1 = __importDefault(require("../modules/comments/comments.routes"));
const users_routes_1 = __importDefault(require("../modules/users/users.routes"));
const reports_routes_1 = __importDefault(require("../modules/reports/reports.routes"));
const nofound_1 = require("../middlewares/nofound");
const errorHandler_1 = require("../middlewares/errorHandler");
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['http://localhost:3000', 'https://task-mpms.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// health
app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy..' });
});
// Complete API Registration
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/projects', projects_routes_1.default);
app.use('/api/v1/users', users_routes_1.default);
app.use('/api/v1/sprints', sprints_routes_1.default);
app.use('/api/v1/tasks', tasks_routes_1.default);
app.use('/api/v1/comments', comments_routes_1.default);
app.use('/api/v1/reports', reports_routes_1.default);
app.use(nofound_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
