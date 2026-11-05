import mongoose from 'mongoose';

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured.');
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.info(`MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDB() { await mongoose.disconnect(); }
