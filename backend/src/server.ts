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

app.use(cors({
  origin: ['https://ecomerce-website-using-mern.onrender.com','ecomerce-website-using-mern-git-main-rahees-projects-cbd8887d.vercel.app','ecomerce-website-using-mern-git-main-rahees-projects-cbd8887d.vercel.app'],
  credentials: true
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
