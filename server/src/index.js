import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectToDatabase } from './config/db.js';

const PORT = process.env.PORT || 4000;

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});


