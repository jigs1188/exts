const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite DB (creates file if missing)
const dbPath = process.env.RENDER ? '/var/data/licensing.db' : path.resolve(__dirname, 'licensing.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initSchema();
    }
});

function initSchema() {
    db.serialize(() => {
        // 1. Install Sessions (The "Private Links")
        db.run(`CREATE TABLE IF NOT EXISTS install_sessions (
            token TEXT PRIMARY KEY,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            first_click_at DATETIME,
            expires_at DATETIME,
            expiry_minutes INTEGER DEFAULT 30, -- Custom expiry (new)
            is_used INTEGER DEFAULT 0,
            admin_note TEXT
        )`);

        // 2. Licenses (The "Keys")
        db.run(`CREATE TABLE IF NOT EXISTS licenses (
            license_key TEXT PRIMARY KEY,
            -- device_hash TEXT, -- Deprecated in favor of license_devices table
            max_devices INTEGER DEFAULT 1, -- Limit (new)
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active' CHECK(status IN ('active', 'banned')),
            original_session_token TEXT,
            FOREIGN KEY(original_session_token) REFERENCES install_sessions(token)
        )`);

        // 2b. License Devices (One-to-Many: Which devices are using this key?)
        db.run(`CREATE TABLE IF NOT EXISTS license_devices (
            license_key TEXT,
            device_hash TEXT,
            first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (license_key, device_hash),
            FOREIGN KEY(license_key) REFERENCES licenses(license_key)
        )`);

        // 3. Device Audit Log
        db.run(`CREATE TABLE IF NOT EXISTS access_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            license_key TEXT,
            device_hash TEXT,
            ip_address TEXT,
            user_agent TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            action TEXT,
            result TEXT
        )`);

        // Naive Migration: Check if we need to add columns to existing DB
        // (In a real app, use a migration tool. Here we just try/catch add column)
        const migrations = [
            "ALTER TABLE install_sessions ADD COLUMN expiry_minutes INTEGER DEFAULT 30",
            "ALTER TABLE licenses ADD COLUMN max_devices INTEGER DEFAULT 1"
        ];
        
        migrations.forEach(sql => {
            db.run(sql, (err) => {
                 // Ignore "duplicate column" errors
            });
        });

        console.log('Database schema initialized.');
    });
}

// Helper: database wrapper for async/await
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

module.exports = { db, query, run, get };
