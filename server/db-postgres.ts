import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// PostgreSQL connection for Docker environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://vietin_user:vietin_password@localhost:5432/vietinbank_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
export { pool };