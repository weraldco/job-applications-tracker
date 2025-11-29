import 'express';

declare module 'express-serve-static-core' {
	interface Request {
		user?: any; // or a specific type if you know your user shape
	}
}
