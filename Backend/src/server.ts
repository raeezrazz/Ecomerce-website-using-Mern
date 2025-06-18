import express from 'express';
import dotenv from 'dotenv';
import router from './routes/userRoutes';
import cors from 'cors'
import { connectDB } from './config/connectDB';

dotenv.config();

const app = express();
connectDB()
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.use('/user', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
