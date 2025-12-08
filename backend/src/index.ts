import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { prisma } from './lib/db';
import aiRouter from './routes/ai';
import authRouter from './routes/auth';
import jobRouter from './routes/jobs';
import reminderRouter from './routes/reminder';
import testRouter from './routes/test';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Allow frontend
app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'https://job-applications-tracker-ten.vercel.app',
		],

		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World from Typescript + Express!');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/reminders', reminderRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/test', testRouter);
app.listen(PORT, () => {
	console.log(`Server is running in http://localhost:${PORT}`);
});
