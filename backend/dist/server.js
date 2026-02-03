"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connectDB_1 = require("./config/connectDB");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
// import adminRoute
const loggerMiddleware_1 = require("./middleware/loggerMiddleware");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowedOrigins = [
    'https://ecomerce-website-using-mern.vercel.app',
    'https://ecomerce-website-using-mern-git-main-rahees-projects-cbd8887d.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
];
// Add FRONTEND_URL from environment if it exists
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Authorization']
// }));
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("❌ CORS BLOCKED:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization']
}));
// 🔥 Log every incoming API request
app.use(loggerMiddleware_1.requestLogger);
// CONNECT DATABASE
(0, connectDB_1.connectDB)();
// ROUTES
app.use('/api/user', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// fallback route
// fallback route
app.use("*", (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server!`);
    error.statusCode = 404;
    next(error);
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at: http://localhost:${PORT}`);
    console.log(`📌 User API Base:   http://localhost:${PORT}/api/user`);
    console.log(`📌 Admin API Base:  http://localhost:${PORT}/api/admin`);
});
