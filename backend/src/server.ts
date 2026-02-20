import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/connectDB';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes'
// import adminRoute
import { requestLogger } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

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
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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
app.use(requestLogger);

// CONNECT DATABASE
connectDB();

// ROUTES
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// fallback route
// fallback route
app.use("*", (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running at: http://localhost:${PORT}`);
  console.log(`📌 User API Base:   http://localhost:${PORT}/api/user`);
  console.log(`📌 Admin API Base:  http://localhost:${PORT}/api/admin`);
});
