import { Request, Response } from 'express';
import { jobService } from '../services/jobServices';

export const jobController = {
	// Get the all job datas -> api/v1/jobs/
	async getAllJobs(req: Request, res: Response) {
		try {
			const id = req.user.id;
			if (!id) {
				return res.status(401).json({ error: 'User Unauthorized' });
			}

			const [jobs, status, month] = await Promise.all([
				jobService.getAll(id),
				jobService.getJobCountByStatus(id),
				jobService.getJobByMonth(id),
			]);

			const statusCount = status.reduce((acc, job) => {
				acc[job.status] = job._count.status;
				return acc;
			}, {} as Record<string, number>);

			const total = status.reduce((acc, job) => {
				return acc + job._count.status;
			}, 0);

			const monthCount = month.reduce((acc, job) => {
				const date = new Date(job.createdAt);

				const month = date.toLocaleDateString('en-US', { month: 'long' });
				acc[month] = (acc[month] || 0) + job._count.createdAt;
				return acc;
			}, {} as Record<string, number>);

			res.status(200).json({ jobs, total, statusCount, monthCount });
		} catch (error) {
			res.status(500).json({ error: 'Server error!' });
		}
	},
	// Add new job data  -> api/v1/jobs/addjob
	async createNewJob(req: Request, res: Response) {
		try {
			const userId = req.user.id;
			if (!userId) {
				return res.status(401).json({ error: 'Unauthorized user!' });
			}
			console.log('USERID', userId);
			const body = req.body;

			if (!body) {
				return res.status(400).json({ error: 'Invalid or empty data' });
			}
			const job = await jobService.create({ ...body }, userId);

			res.status(201).json(job);
		} catch (error) {
			res.status(500).json({ error: 'Server error!' });
		}
	},
	// Get single job data using id -> api/v1/jobs/[id]
	async getSingleJob(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ error: 'Unauthorized User!' });

			const id = req.params.id;
			if (!id) return res.status(401).json({ error: 'Invalid provided id.' });

			const job = await jobService.getById(id);
			return res.status(200).json({ job });
		} catch (error) {
			res.status(500).json({ error: 'Server error!' });
		}
	},
	// Update job data -> api/v1/jobs/update/[id]
	async updateJob(req: Request, res: Response) {
		try {
			// Get the user id to check authorizaion
			const userId = req.user?.id;
			if (!userId) {
				return res.status(401).json({ error: 'Unauthorized user!' });
			}

			// Get the params id
			const id = req.params.id;
			if (!id) return res.status(400).json({ error: 'Invalid provided id!' });

			// Check if data is empty
			const body = req.body;
			if (!body) {
				return res.status(400).json({ error: 'Invalid or empty data' });
			}
			const job = await jobService.update(id, userId, { ...body });

			res.status(200).json(job);
		} catch (error) {
			res.status(500).json({ error: 'Server error!' });
		}
	},
	// Delete job data -> api/v1/jobs/delete/[id]
	async deleteJob(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return res.status(401).json({ error: 'Unauthorized user!' });
			}
			const id = req.params.id;
			if (!id) return res.status(401).json({ error: 'Invalid provided id.' });

			const job = await jobService.delete(id, userId);

			res.status(200).json(job);
		} catch (error) {
			res.status(500).json({ error: 'Server error!' });
		}
	},
};
