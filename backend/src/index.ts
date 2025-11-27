import dotenv from 'dotenv';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { prisma } from './lib/db';
import userRoutes from './routes/users';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World from Typescript + Express!');
});
app.use('/users', userRoutes);
app.listen(PORT, () => {
	console.log(`Server is running in http://localhost:${PORT}`);
});
