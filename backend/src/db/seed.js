import 'dotenv/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { pool } from './pool.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// seedData.json is a one-time export of the original frontend/src/data/
// categories.js and issues.js arrays (see gen_seed.mjs used to produce it),
// so the Postgres-backed knowledge base starts out identical to the
// bundled offline copy the frontend already ships with.
const { categories, issues } = JSON.parse(readFileSync(path.join(__dirname, 'seedData.json'), 'utf8'))

async function seed() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (const c of categories) {
      await client.query(
        `INSERT INTO categories (id, name, icon, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           icon = EXCLUDED.icon,
           description = EXCLUDED.description`,
        [c.id, c.name, c.icon, c.description],
      )
    }

    for (const i of issues) {
      await client.query(
        `INSERT INTO issues
           (id, category_id, title, description, difficulty, estimated_time, visual_guide, offline_available, symptoms, steps, solution)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           category_id = EXCLUDED.category_id,
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           difficulty = EXCLUDED.difficulty,
           estimated_time = EXCLUDED.estimated_time,
           visual_guide = EXCLUDED.visual_guide,
           offline_available = EXCLUDED.offline_available,
           symptoms = EXCLUDED.symptoms,
           steps = EXCLUDED.steps,
           solution = EXCLUDED.solution`,
        [
          i.id,
          i.category,
          i.title,
          i.description,
          i.difficulty,
          i.estimatedTime,
          i.visualGuide,
          i.offlineAvailable,
          JSON.stringify(i.symptoms || []),
          JSON.stringify(i.steps || []),
          i.solution,
        ],
      )
    }

    await client.query('COMMIT')
    console.log(`✓ Seeded ${categories.length} categories and ${issues.length} issues.`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

seed()
  .catch((err) => {
    console.error('✗ Seed failed:', err)
    process.exitCode = 1
  })
  .finally(() => pool.end())
