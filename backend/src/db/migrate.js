import 'dotenv/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { pool } from './pool.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function migrate() {
  const sql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(sql)
  console.log('✓ Migration complete — schema is up to date.')
}

migrate()
  .catch((err) => {
    console.error('✗ Migration failed:', err)
    process.exitCode = 1
  })
  .finally(() => pool.end())
