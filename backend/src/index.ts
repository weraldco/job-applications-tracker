import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { prisma } from './lib/db';
import jobRoutes from './routes/jobs';
import userRoutes from './routes/users';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Allow frontend
app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

// Middleware
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World from Typescript + Express!');
});
app.use('/users', userRoutes);
app.use('/api', jobRoutes);
app.listen(PORT, () => {
	console.log(`Server is running in http://localhost:${PORT}`);
});
