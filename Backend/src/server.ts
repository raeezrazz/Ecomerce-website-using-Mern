import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/connectDB';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes'
// import adminRoute
import { requestLogger } from './middleware/loggerMiddleware';

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'],
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
app.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running at: http://localhost:${PORT}`);
  console.log(`📌 User API Base:   http://localhost:${PORT}/api/user`);
  console.log(`📌 Admin API Base:  http://localhost:${PORT}/api/admin`);
});
