const express = require('express');
const router = express.Router();
const { xorEncryptDecrypt } = require('../xor');

// In-memory storage (use database in production)
let keys = new Set();
let scriptContent = `gg.toast("✅ AKSHU MOD - Welcome!")
-- Your Lua script here
-- This is the default script that runs after key validation`;

let alertMessage = "Welcome to AKSHU MODZ! Stay updated on Telegram.";
let serverEnabled = true;

// Get XOR key from environment
const getXorKey = () => process.env.XOR_KEY || '';

// POST /api/access - Main login endpoint (matches Access.php)
router.post('/access', (req, res) => {
    try {
        if (!serverEnabled) {
            return res.status(503).send('Server maintenance');
        }

        const encryptedKey = req.body;
        const xorKey = getXorKey();

        if (!encryptedKey || !xorKey) {
            return res.status(400).send('Bad Request');
        }

        // Decrypt the received key
        const decryptedKey = xorEncryptDecrypt(encryptedKey, xorKey);

        if (!decryptedKey) {
            return res.status(400).send('Invalid data');
        }

        // Validate key
        if (!keys.has(decryptedKey)) {
            // Return short response for invalid key
            return res.status(200).send(xorEncryptDecrypt('INVALID', xorKey));
        }

        // Valid key - return encrypted script
        const encryptedScript = xorEncryptDecrypt(scriptContent, xorKey);
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(encryptedScript);

    } catch (error) {
        console.error('Access error:', error);
        res.status(500).send('Server Error');
    }
});

// POST /api/nfo - Alert/notification endpoint
router.post('/nfo', (req, res) => {
    try {
        const encryptedKey = req.body;
        const xorKey = getXorKey();

        if (!encryptedKey || !xorKey) {
            return res.status(400).send('Bad Request');
        }

        // Decrypt key (optional validation)
        const decryptedKey = xorEncryptDecrypt(encryptedKey, xorKey);

        // Return encrypted alert message
        const encryptedAlert = xorEncryptDecrypt(alertMessage, xorKey);
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(encryptedAlert);

    } catch (error) {
        console.error('NFO error:', error);
        res.status(500).send('Server Error');
    }
});

// GET /api/status - Server status
router.get('/status', (req, res) => {
    res.json({
        status: serverEnabled ? 'online' : 'maintenance',
        totalKeys: keys.size,
        scriptLength: scriptContent.length,
        alertLength: alertMessage.length
    });
});

// Admin functions (exported for admin routes)
module.exports = router;
module.exports.getKeys = () => Array.from(keys);
module.exports.addKey = (key) => keys.add(key);
module.exports.removeKey = (key) => keys.delete(key);
module.exports.getScript = () => scriptContent;
module.exports.setScript = (script) => { scriptContent = script; };
module.exports.getAlert = () => alertMessage;
module.exports.setAlert = (msg) => { alertMessage = msg; };
module.exports.toggleServer = () => { serverEnabled = !serverEnabled; return serverEnabled; };
module.exports.isServerEnabled = () => serverEnabled;
