const pool = require('./db');

const createTablesQuery = `
  -- 1. Users Table
  CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'Analyst',
      risk_score INT DEFAULT 15,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- 2. Encrypted Vault Table
  CREATE TABLE IF NOT EXISTS encrypted_vault (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      original_title VARCHAR(255) NOT NULL,
      encrypted_data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- 3. Security Logs Table
  CREATE TABLE IF NOT EXISTS security_logs (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(100) NOT NULL,
      severity VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function initializeDatabase() {
  try {
    console.log("⏳ Initializing Cloud Database Tables...");
    await pool.query(createTablesQuery);
    console.log("✅ All Tables (users, encrypted_vault, security_logs) Created Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Database Initialization Error:", err);
    process.exit(1);
  }
}

initializeDatabase();