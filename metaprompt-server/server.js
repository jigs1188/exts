const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_SECRET = 'admin123'; // Simple protection for demo

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- ADMIN ROUTES ---

// Generate a new 1-time Install Link
app.post('/api/admin/generate-link', async (req, res) => {
    const { secret, note, expiryMinutes = 30, maxActivations = 1 } = req.body;
    if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Forbidden' });

    const token = uuidv4();
    try {
        await db.run(
            `INSERT INTO install_sessions (token, admin_note, expiry_minutes) VALUES (?, ?, ?)`,
            [token, JSON.stringify({ note, max: maxActivations }), expiryMinutes]
        );
        
        res.json({ success: true, link: `http://localhost:${PORT}/install.html?token=${token}`, token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Extend a Session (Re-open link for 5 mins)
app.post('/api/admin/extend-session', async (req, res) => {
    const { secret, token } = req.body;
    if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Forbidden' });

    try {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 5 * 60000); // +5 mins
        
        // Reset used status and update expiry
        await db.run(
            `UPDATE install_sessions SET is_used = 0, expires_at = ? WHERE token = ?`,
            [expiresAt.toISOString(), token]
        );
        res.json({ success: true, new_expiry: expiresAt.toISOString() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Ban/Unban License
app.post('/api/admin/license-status', async (req, res) => {
    const { secret, license_key, status } = req.body; // status: 'active' or 'banned'
    if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Forbidden' });

    try {
        await db.run(`UPDATE licenses SET status = ? WHERE license_key = ?`, [status, license_key]);
        res.json({ success: true, status });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// View all licenses
app.get('/api/admin/licenses', async (req, res) => {
    const { secret } = req.query;
    if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Forbidden' });

    try {
        // Updated Query to show device counts
        const licenses = await db.query(`
            SELECT l.*, COUNT(ld.device_hash) as used_count 
            FROM licenses l 
            LEFT JOIN license_devices ld ON l.license_key = ld.license_key
            GROUP BY l.license_key 
            ORDER BY l.created_at DESC
        `);
        res.json({ licenses });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- INSTALLATION ROUTES ---

// 1. Check Session (Called when user clicks link)
app.get('/api/install/session/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const session = await db.get(`SELECT * FROM install_sessions WHERE token = ?`, [token]);
        
        if (!session) return res.status(404).json({ error: 'Invalid Link' });
        if (session.is_used) return res.status(410).json({ error: 'Link already used' });

        const now = new Date();
        const expiryMins = session.expiry_minutes || 30;
        
        // If first click, start the Timer!
        if (!session.first_click_at) {
            console.log(`[Session] Starting timer for token: ${token} (Duration: ${expiryMins}m)`);
            const expiresAt = new Date(now.getTime() + expiryMins * 60000); 
            await db.run(
                `UPDATE install_sessions SET first_click_at = ?, expires_at = ? WHERE token = ?`,
                [now.toISOString(), expiresAt.toISOString(), token]
            );
            return res.json({ valid: true, expires_at: expiresAt.toISOString() });
        } else {
             // If expiry is NULL (re-opened session), use existing logic or check expires_at
             if (session.expires_at && new Date(session.expires_at) < now) {
                return res.status(410).json({ error: 'Link expired' });
             }
        }

        // Check Expiry
        if (new Date(session.expires_at) < now) {
            return res.status(410).json({ error: 'Link expired' });
        }

        res.json({ valid: true, expires_at: session.expires_at });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. Register Device
app.post('/api/install/register', async (req, res) => {
    const { token, device_hash } = req.body;

    if (!token || !device_hash) return res.status(400).json({ error: 'Missing data' });

    try {
        const session = await db.get(`SELECT * FROM install_sessions WHERE token = ?`, [token]);
        if (!session || session.is_used) return res.status(403).json({ error: 'Invalid session' });
        if (new Date(session.expires_at) < new Date()) return res.status(403).json({ error: 'Expired' });

        // Extract settings from note (hacky but works without migration)
        let maxDevices = 1;
        try {
            const meta = JSON.parse(session.admin_note || '{}');
            if (meta.max) maxDevices = meta.max;
        } catch(e) {}

        const licenseKey = uuidv4();

        // 1. Create License (With Max Devices)
        await db.run(
            `INSERT INTO licenses (license_key, max_devices, original_session_token) VALUES (?, ?, ?)`,
            [licenseKey, maxDevices, token]
        );
        
        // 2. Add THIS device as the first valid one
        await db.run(
            `INSERT INTO license_devices (license_key, device_hash) VALUES (?, ?)`,
            [licenseKey, device_hash]
        );

        // 3. Burn Token (One-time use)
        await db.run(`UPDATE install_sessions SET is_used = 1 WHERE token = ?`, [token]);

        res.json({ success: true, license_key: licenseKey });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- DOWNLOAD ROUTE ---
app.get('/api/download/extension.zip', (req, res) => {
    const file = path.join(__dirname, 'extension.zip');
    res.download(file, 'MetaPrompt_Extension.zip', (err) => {
        if (err) {
            res.status(404).json({error: "Extension ZIP not found on server."});
        }
    });
});

// --- EXTENSION VALIDATION ---

app.post('/api/validate', async (req, res) => {
    const { license_key, device_hash } = req.body;
    const ip = req.ip;
    const ua = req.headers['user-agent'];

    if (!license_key || !device_hash) return res.status(400).json({ valid: false });

    try {
        const license = await db.get(`SELECT * FROM licenses WHERE license_key = ?`, [license_key]);
        if (!license) return res.json({ valid: false, reason: 'Invalid Key' });
        if (license.status === 'banned') return res.json({ valid: false, reason: 'License BANNED by Admin' });

        // 3. Multi-Device Logic
        // Check if THIS device is already allowed
        const deviceEntry = await db.get(
            `SELECT * FROM license_devices WHERE license_key = ? AND device_hash = ?`, 
            [license_key, device_hash]
        );

        if (deviceEntry) {
            // ALREADY ALLOWED -> Success
            await logAccess(license_key, device_hash, ip, ua, 'validate', 'success');
            return res.json({ valid: true });
        } else {
            // NEW DEVICE -> Check capacity
            const countRes = await db.get(
                `SELECT COUNT(*) as c FROM license_devices WHERE license_key = ?`, 
                [license_key]
            );
            const currentCount = countRes.c;

            if (currentCount < license.max_devices) {
                // CAPACITY AVAILABLE -> Auto-Add this device
                await db.run(
                    `INSERT INTO license_devices (license_key, device_hash) VALUES (?, ?)`,
                    [license_key, device_hash]
                );
                await logAccess(license_key, device_hash, ip, ua, 'validate', 'new_device_authorized');
                return res.json({ valid: true });
            } else {
                // STRICT MODE: BAN LICENSE IMMEDIATELY
                await db.run(`UPDATE licenses SET status = 'banned' WHERE license_key = ?`, [license_key]);
                await logAccess(license_key, device_hash, ip, ua, 'validate', 'banned_limit_exceeded');
                
                return res.json({ 
                    valid: false, 
                    reason: `SECURITY ALERT: Device Limit Exceeded. License has been PERMANENTLY BANNED. Contact Support.` 
                });
            }
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({ valid: false, error: 'Server Error' });
    }
});

async function logAccess(key, hash, ip, ua, action, result) {
    try {
        await db.run(
            `INSERT INTO access_logs (license_key, device_hash, ip_address, user_agent, action, result) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [key, hash, ip, ua, action, result]
        );
    } catch (e) { console.error('Log error', e); }
}

app.listen(PORT, () => {
    console.log(`Licensing Server running on http://localhost:${PORT}`);
    console.log(`Admin Secret: ${ADMIN_SECRET}`);
});
