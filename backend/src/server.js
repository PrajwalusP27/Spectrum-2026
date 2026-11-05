import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const envPath = path.resolve(currentDirectory, '../.env');

const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.error(`Failed to load environment file: ${envPath}`);
  console.error(envResult.error.message);
  process.exit(1);
}

const { default: app } = await import('./app.js');
const { connectDB, disconnectDB } = await import('./config/db.js');

const port = Number(process.env.PORT) || 5000;

let server;

try {
  await connectDB();

  server = app.listen(port, () => {
    console.info(`Spectrum API listening on port ${port}`);
  });
} catch (error) {
  console.error(`Startup failed: ${error.message}`);
  process.exitCode = 1;
}

async function shutdown(signal) {
  console.info(`${signal} received. Closing server.`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await disconnectDB();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));