//local.ts
import app from './app';
const PORT = process.env.PORT || 8080;
const RAILWAY_URL = process.env.RAILWAY_STATIC_URL; // automatically set by Railway

app.listen(PORT, () => {
	if (RAILWAY_URL) {
		console.log(`API running at ${RAILWAY_URL}`);
	} else {
		console.log(`Server running on http://localhost:${PORT}`);
	}
});
