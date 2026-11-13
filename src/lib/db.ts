import mongoose from 'mongoose';

/**
 * Cached connection to avoid re-connecting on every hot-reload in dev.
 * The URI is validated lazily (inside connectDB) rather than at module load,
 * so routes that don't use the database (and `next build`'s static analysis)
 * do not crash when MONGODB_URI is not configured.
 */
let cached = (global as any).__mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

if (!cached) {
  cached = (global as any).__mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Please define it inside .env.local (or your hosting provider env vars) to use database-backed features like the quiz.');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .catch((err) => {
        // Reset the cached promise so a failed connection can be retried
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
