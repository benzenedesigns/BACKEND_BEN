// viviana-backend/config/db.js
const mysql = require("mysql2/promise"); // promise-based mysql2
const fs = require("fs");
require("dotenv").config();

// Basic connection values
const host = process.env.DB_HOST;
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const user = process.env.DB_USER;
const database = process.env.DB_NAME;
const socketPath = process.env.DB_SOCKET_PATH; // optional

// Validate presence of minimal env vars (no secrets printed)
const missing = [];
if (!socketPath && !host) missing.push("DB_HOST or DB_SOCKET_PATH");
if (!user) missing.push("DB_USER");
if (!database) missing.push("DB_NAME");
if (missing.length) {
  console.error("❌ Missing DB env vars:", missing.join(", "));
}

// SSL/TLS options
// If DB_SSL isn't explicitly set, enable SSL by default for common managed DB hosts
const hostLooksLikeManaged = typeof host === 'string' && /aivencloud\.com|tidbcloud|rds\.amazonaws\.com|database\.azure\.com/i.test(host);
const sslEnv = (process.env.DB_SSL || process.env.DB_SSL === '1');
const sslEnabled = (process.env.DB_SSL === "true" || process.env.DB_SSL === "1") || (!process.env.DB_SSL && hostLooksLikeManaged);
let ssl = undefined;
if (sslEnabled) {
  ssl = {};
  if (process.env.DB_SSL_CA_PATH) {
    try {
      ssl.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH);
    } catch (e) {
      console.error("❌ Failed to read DB_SSL_CA_PATH:", process.env.DB_SSL_CA_PATH, e.message);
    }
  }
  if (process.env.DB_SSL_CERT_PATH) {
    try {
      ssl.cert = fs.readFileSync(process.env.DB_SSL_CERT_PATH);
    } catch (e) {
      console.error("❌ Failed to read DB_SSL_CERT_PATH:", process.env.DB_SSL_CERT_PATH, e.message);
    }
  }
  if (process.env.DB_SSL_KEY_PATH) {
    try {
      ssl.key = fs.readFileSync(process.env.DB_SSL_KEY_PATH);
    } catch (e) {
      console.error("❌ Failed to read DB_SSL_KEY_PATH:", process.env.DB_SSL_KEY_PATH, e.message);
    }
  }
  if (process.env.DB_SSL_MIN_VERSION) {
    // e.g. 'TLSv1.2'
    ssl.minVersion = process.env.DB_SSL_MIN_VERSION;
  }
  // If CA is not provided, allow an insecure fallback only when explicitly configured
  if (!ssl.ca && ssl) {
    if (process.env.DB_SSL_ALLOW_INSECURE === "true") {
      console.warn("⚠️ DB_SSL_ALLOW_INSECURE=true — connecting with SSL but skipping CA verification. This is insecure and only for temporary testing.");
      ssl.rejectUnauthorized = false;
    } else {
      // keep verification enabled; this will likely fail until DB_SSL_CA_PATH is provided
      ssl.rejectUnauthorized = true;
    }
  }
}

const poolConfig = {
  ...(socketPath ? { socketPath } : { host, port }),
  user,
  password: process.env.DB_PASSWORD,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: process.env.DB_CONNECT_TIMEOUT ? parseInt(process.env.DB_CONNECT_TIMEOUT, 10) : 15000,
  ...(ssl ? { ssl } : {}),
};

const db = mysql.createPool(poolConfig);

// Test connection once on startup to provide clear errors/hints
db.getConnection()
  .then((conn) => {
    return conn
      .ping()
      .then(() => {
        console.log(`✅ Connected to MySQL ${socketPath ? `(socket:${socketPath})` : `${host}:${port}`} (db=${database})`);
      })
      .finally(() => conn.release());
  })
  .catch((err) => {
    // Helpful, non-sensitive logs
    console.error("❌ Database connection failed:");
    if (err && err.message) console.error("  message:", err.message);
    if (err && err.code) console.error("  code:", err.code);
    if (err && err.errno) console.error("  errno:", err.errno);

    // Specific hint for providers that reject insecure transport
    if (err && /insecure transport/i.test(err.message)) {
      console.error("Hint: the server requires SSL/TLS. Set DB_SSL=true and DB_SSL_CA_PATH to the provider CA file in your .env.");
    }

    console.error(err.stack || err);
  });

module.exports = db;
