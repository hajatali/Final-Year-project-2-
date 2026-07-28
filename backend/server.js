const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { encrypt, decrypt } = require('./crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dataguard_secret';

app.use(cors());
app.use(express.json());

// 🧪 Test Route
app.get('/', (req, res) => {
  res.json({ message: "Data-Guard Cloud Security Backend Running 🔥" });
});

// ==========================================
// 👤 1. USER AUTHENTICATION APIS
// ==========================================

// 📝 Register New User
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
      [email, hashedPassword, role || 'Analyst']
    );

    // Security Audit Log
    await pool.query(
      "INSERT INTO security_logs (event_type, severity, message) VALUES ($1, $2, $3)",
      ["USER_REGISTRATION", "Low", `New user registered: ${email}`]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') { // Unique constraint violation (email duplicate)
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Server error during registration", details: err.message });
  }
});

// 🔑 Login User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '24h'
    });

    // Security Audit Log
    await pool.query(
      "INSERT INTO security_logs (event_type, severity, message) VALUES ($1, $2, $3)",
      ["USER_LOGIN", "Low", `User logged in: ${email}`]
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role, risk_score: user.risk_score }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login", details: err.message });
  }
});

// ==========================================
// 🔐 2. AES-256 VAULT APIS (Encrypted Storage)
// ==========================================

// 📥 Save Data in Encrypted Vault (Encrypts on insertion)
app.post('/api/vault/add', async (req, res) => {
  const { userId, title, sensitiveData } = req.body;
  if (!title || !sensitiveData) {
    return res.status(400).json({ error: "Title and sensitiveData are required" });
  }

  try {
    // AES-256 Encryption
    const encryptedData = encrypt(sensitiveData);

    const newVaultEntry = await pool.query(
      "INSERT INTO encrypted_vault (user_id, original_title, encrypted_data) VALUES ($1, $2, $3) RETURNING *",
      [userId || null, title, encryptedData]
    );

    // Security Audit Log
    await pool.query(
      "INSERT INTO security_logs (event_type, severity, message) VALUES ($1, $2, $3)",
      ["VAULT_DATA_ENCRYPTED", "Medium", `Encrypted item saved: ${title}`]
    );

    res.status(201).json({
      message: "Data encrypted and stored successfully in PostgreSQL Cloud",
      vaultEntry: {
        id: newVaultEntry.rows[0].id,
        title: newVaultEntry.rows[0].original_title,
        encryptedCipher: newVaultEntry.rows[0].encrypted_data
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to encrypt and store data", details: err.message });
  }
});

// 📤 Fetch All Vault Data (Decrypts dynamically for response)
app.get('/api/vault/list', async (req, res) => {
  try {
    const vaultItems = await pool.query("SELECT * FROM encrypted_vault ORDER BY created_at DESC");

    // Decrypt each item before returning
    const decryptedItems = vaultItems.rows.map(item => ({
      id: item.id,
      title: item.original_title,
      encryptedCipher: item.encrypted_data,
      decryptedData: decrypt(item.encrypted_data),
      createdAt: item.created_at
    }));

    res.json({ vault: decryptedItems });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve vault data", details: err.message });
  }
});

// ==========================================
// 📊 3. SECURITY LOGS API
// ==========================================
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await pool.query("SELECT * FROM security_logs ORDER BY timestamp DESC LIMIT 20");
    res.json({ logs: logs.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch security logs", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🛡️ Data-Guard Backend running on http://localhost:${PORT}`);
});