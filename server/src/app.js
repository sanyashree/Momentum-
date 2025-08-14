import express from 'express';
// Cross-Origin Resource Sharing
import cors from 'cors'; 

import authRoutes from './routes/auth.routes.js';
import habitRoutes from './routes/habits.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import statsRoutes from './routes/stats.routes.js';
import streakRoutes from './routes/streaks.routes.js';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'momentum-api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/streaks', streakRoutes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

export default app;


