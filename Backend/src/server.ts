
import 'reflect-metadata';
import express from 'express';
import cors from 'cors'
import { connectDB } from './config/connectDB';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))

connectDB()
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});