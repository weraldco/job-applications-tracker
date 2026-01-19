import { PrismaPg } from '@prisma/adapter-pg'; // Import the Prisma adapter
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'; // Import the driver pool

// --- 1. Initialize the adapter ---
// Ensure process.env.DATABASE_URL is available (dotenv handles this in your main index file)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// --- 2. Existing Singleton Pattern ---
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// --- 3. Pass the adapter to the constructor ---
export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter, // Inject the adapter here
		log: ['query', 'info', 'warn', 'error'], // Optional: Recommended logging setup
	});

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

// // src/lib/db.ts
// import { PrismaClient } from '@prisma/client';

// // Make Prisma Client a global variable in development
// declare global {
//   var prisma: PrismaClient | undefined;
// }

// // Use existing global Prisma in development to prevent too many connections
// export const prisma =
//   global.prisma ??
//   new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'], // optional
//   });

// if (process.env.NODE_ENV !== 'production') {
//   global.prisma = prisma;
// }
