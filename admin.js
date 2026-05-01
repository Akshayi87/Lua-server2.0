const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Import API module functions
const apiModule = require('./api');

// Admin credentials from environment
const ADMIN_USER = process.env.ADMIN_USERNAME || 'akshu';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'akshu123';

// Middleware to check if admin is logged in
function requireAuth(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin/login');
}

// Login page
router.get('/login', (req, res) => {
    if (req.session.isAdmin) {
        return res.redirect('/admin/panel');
    }
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Login POST
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.isAdmin = true;
        req.session.adminUser = username;
        return res.redirect('/admin/panel');
    }

    res.send(`
        <html>
        <head><title>Login Failed</title></head>
        <body style="background:#1a1a2e;color:#fff;font-family:sans-serif;text-align:center;padding:50px;">
            <h2>❌ Invalid Credentials</h2>
            <a href="/admin/login" style="color:#00d4ff;">Try Again</a>
        </body>
        </html>
    `);
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Admin Panel
router.get('/panel', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// API: Get all keys
router.get('/api/keys', requireAuth, (req, res) => {
    res.json({ keys: apiModule.getKeys() });
});

// API: Add key
router.post('/api/keys', requireAuth, (req, res) => {
    const { key } = req.body;
    if (!key || key.trim() === '') {
        return res.status(400).json({ error: 'Key required' });
    }
    apiModule.addKey(key.trim());
    res.json({ success: true, message: 'Key added' });
});

// API: Remove key
router.delete('/api/keys/:key', requireAuth, (req, res) => {
    apiModule.removeKey(req.params.key);
    res.json({ success: true, message: 'Key removed' });
});

// API: Get script
router.get('/api/script', requireAuth, (req, res) => {
    res.json({ script: apiModule.getScript() });
});

// API: Update script
router.post('/api/script', requireAuth, (req, res) => {
    const { script } = req.body;
    if (!script) {
        return res.status(400).json({ error: 'Script required' });
    }
    apiModule.setScript(script);
    res.json({ success: true, message: 'Script updated' });
});

// API: Get alert
router.get('/api/alert', requireAuth, (req, res) => {
    res.json({ alert: apiModule.getAlert() });
});

// API: Update alert
router.post('/api/alert', requireAuth, (req, res) => {
    const { alert } = req.body;
    if (!alert) {
        return res.status(400).json({ error: 'Alert required' });
    }
    apiModule.setAlert(alert);
    res.json({ success: true, message: 'Alert updated' });
});

// API: Toggle server
router.post('/api/toggle', requireAuth, (req, res) => {
    const status = apiModule.toggleServer();
    res.json({ enabled: status });
});

// API: Server status
router.get('/api/status', requireAuth, (req, res) => {
    res.json({
        enabled: apiModule.isServerEnabled(),
        totalKeys: apiModule.getKeys().length,
        scriptLength: apiModule.getScript().length
    });
});

module.exports = router;
