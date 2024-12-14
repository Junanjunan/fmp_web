import { Pool } from 'pg';


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const response = await client.query(text, params);
    return response;
  } finally {
    client.release();
  }
};