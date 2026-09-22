import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  console.warn(
    'DATABASE_URL is not set. Copy backend/.env.example to backend/.env and set it, ' +
      'or run via docker-compose which sets it for you.',
  )
}

// Enable SSL when in production or when connecting to Render Postgres
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})

pool.on('error', (err) => {
  // A background/idle client error should not crash the whole server.
  console.error('Unexpected error on idle Postgres client:', err)
})