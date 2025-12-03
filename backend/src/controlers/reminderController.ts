import { Request, Response } from 'express';
import { reminderService } from '../services/reminderServices';

export const reminderController = {
	// Get the reminder data
	async getAllReminders(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ error: 'Unauthorized user!' });

			const reminders = await reminderService.getAll(userId);
			if (!reminders)
				return res
					.status(400)
					.json({ error: 'No reminders fetch from db, something went wrong!' });
			if (reminders.length == 0)
				return res
					.status(200)
					.json({ message: 'No data in database.', reminders: [] });
			return res
				.status(200)
				.json({ message: 'Successfully fetch all the reminders.', reminders });
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error.' });
		}
	},
	// create reminder
	async createReminder(req: Request, res: Response) {
		try {
			const userId = req.user.id;
			if (!userId) return res.status(401).json({ error: 'Unauthorized user!' });
			console.log('ID', userId);
			const body = req.body;

			const reminders = await reminderService.create({ ...body }, userId);
			if (!reminders)
				return res
					.status(400)
					.json({ error: 'No reminders created, something went wrong!' });
			return res
				.status(201)
				.json({ message: 'Successfully create new reminder!', reminders });
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error.' });
		}
	},
	// Get single reminder data
	async getReminder(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ error: 'Unauthorized user!' });

			const id = req.params.id;
			if (!id) return res.status(400).json({ error: 'Invalid id provided!' });
			console.log('ID', id);

			const reminders = await reminderService.getOne(id, userId);
			if (!reminders)
				return res.status(404).json({ error: 'No data found in database.' });
			return res
				.status(201)
				.json({ message: 'Successfully get the data!', reminders });
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error.' });
		}
	},
	// Update reminder
	async updateReminder(req: Request, res: Response) {
		console.log('test');
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ error: 'Unauthorized user!' });

			const id = req.params.id;
			if (!id) return res.status(400).json({ error: 'Invalid id provided!' });

			const body = req.body;
			const reminders = await reminderService.update(id, userId, { ...body });
			if (!reminders)
				return res.status(400).json({
					error: 'No reminders updated in database, something went wrong!',
				});
			return res
				.status(201)
				.json({ message: 'Successfully updated the reminder', reminders });
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error.' });
		}
	},
	// Delete reminder
	async deleteReminder(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ error: 'Unauthorized user!' });

			const id = req.params.id;
			if (!id) return res.status(400).json({ error: 'Invalid id provided!' });

			const reminders = await reminderService.delete(id, userId);
			if (!reminders)
				return res.status(400).json({
					error: 'No reminders deleted from database, something went wrong!',
				});
			return res.status(201).json({
				message: `Successfully deleted reminder with id ${reminders.id}`,
				reminders,
			});
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error.' });
		}
	},
};
