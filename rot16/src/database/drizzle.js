import { drizzle } from 'drizzle-orm/node-postgres'
import pool from './pool.js'

const db = drizzle({ client: pool })

export default db