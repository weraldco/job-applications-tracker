import { prisma } from '../lib/db';

export const reminderService = {
	getAll(userId: string) {
		return prisma.reminder.findMany({
			where: {
				userId,
			},
			orderBy: { createdAt: 'desc' },
		});
	},
	create(data: any, userId: string) {
		const parsedDueDate = data.dueDate && new Date(data.dueDate);

		// Validate date
		if (data.dueDate && isNaN(parsedDueDate.getTime())) {
			throw new Error('Invalid dueDate');
		}
		const newData = { ...data, dueDate: parsedDueDate, userId };
		return prisma.reminder.create({
			data: newData,
		});
	},
	getOne(id: string, userId: string) {
		return prisma.reminder.findUnique({
			where: {
				id,
				userId,
			},
		});
	},
	async update(id: string, userId: string, data: any) {
		const result = await prisma.reminder.updateMany({
			where: {
				id,
				userId,
			},
			data,
		});

		if (result.count === 0) return null;
		return prisma.reminder.findUnique({ where: { id } });
	},
	delete(id: string, userId: string) {
		return prisma.reminder.delete({
			where: {
				id,
				userId,
			},
		});
	},
};
