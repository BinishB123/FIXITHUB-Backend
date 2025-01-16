"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./express/routes/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Errorhandler_1 = __importDefault(require("./express/middleware/Errorhandler"));
const express_session_1 = __importDefault(require("express-session"));
require("../entities/services/session");
const socketIo_1 = require("./webSocket/socketIo");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
(0, socketIo_1.SocketIntalization)(server);
app.use((0, express_session_1.default)({
    secret: "y1r13t1t3rt77t7g8y3e67",
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    console.log(req.method, req.hostname, req.path, req.body, req.params);
    next();
});
app.use((0, cors_1.default)({
    origin: process.env.ORGIN,
    methods: "GET,PUT,POST,PATCH,OPTIONS,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    credentials: true,
}));
// Use the routes
(0, routes_1.default)(app);
app.use(Errorhandler_1.default);
exports.default = server;
