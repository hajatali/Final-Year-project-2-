const { Pool } = require('pg');
require('dotenv').config();

// Cloud PostgreSQL (Neon) Connection Pool Setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon.tech SSL requirement
  }
});

pool.on('connect', () => {
  console.log('🗄️ Connected to Cloud PostgreSQL (Neon) Successfully!');
});

module.exports = pool;