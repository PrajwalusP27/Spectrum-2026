
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const envPath = path.resolve(currentDirectory, '../../.env');

dotenv.config({ path: envPath });

const { connectDB, disconnectDB } = await import('../config/db.js');
const { default: Admin } = await import('../models/Admin.js');

try {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first.');
  }

  if (process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error('ADMIN_PASSWORD must contain at least 12 characters.');
  }

  await connectDB();

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

  await Admin.updateOne(
    { email },
    { $set: { passwordHash } },
    { upsert: true, runValidators: true }
  );

  console.info(`Admin account ready for ${email}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
