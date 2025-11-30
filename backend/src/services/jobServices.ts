import { prisma } from '../lib/db';

export const jobService = {
	// Getting the data, base on created data descending order
	getAll(userId: string) {
		return prisma.job.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		});
	},

	// Getting single data from job data using id
	getById(id: string) {
		return prisma.job.findUnique({ where: { id } });
	},

	// Creating new job
	create(data: any) {
		return prisma.job.create({
			data,
		});
	},

	// Updating jobs
	async update(id: string, userId: string, data: any) {
		const result = await prisma.job.updateMany({
			where: {
				id: id,
				userId: userId,
			},
			data,
		});
		if (result.count === 0) return null; // no rows updated
		// Return the updated job
		return prisma.job.findUnique({ where: { id } });
	},

	// Deleting jobs
	delete(id: string, userId: string) {
		return prisma.job.delete({ where: { id, userId } });
	},

	// get the count per status
	getJobCountByStatus(id: string) {
		return prisma.job.groupBy({
			by: ['status'],
			where: { userId: id },
			_count: { status: true },
		});
	},

	// get the count per months
	getJobByMonth(id: string) {
		return prisma.job.groupBy({
			by: ['createdAt'],
			where: { userId: id },
			_count: { createdAt: true },
		});
	},
};
