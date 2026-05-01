const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { xorEncryptDecrypt } = require('../xor');

// Simple in-memory + file backup
const DATA_DIR = path.join(__dirname, '..', 'data');

// Create dir if not exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const KEYS_FILE = path.join(DATA_DIR, 'keys.json');
const SCRIPT_FILE = path.join(DATA_DIR, 'script.lua');
const ALERT_FILE = path.join(DATA_DIR, 'alert.txt');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Load data
let keys = new Set();
let scriptContent = `gg.toast("✅ AKSHU MOD - Welcome!")`;
let alertMessage = "Welcome to AKSHU MODZ!";
let serverEnabled = true;

try {
    if (fs.existsSync(KEYS_FILE)) {
        keys = new Set(JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8')));
    }
    if (fs.existsSync(SCRIPT_FILE)) {
        scriptContent = fs.readFileSync(SCRIPT_FILE, 'utf8');
    }
    if (fs.existsSync(ALERT_FILE)) {
        alertMessage = fs.readFileSync(ALERT_FILE, 'utf8');
    }
    if (fs.existsSync(CONFIG_FILE)) {
        serverEnabled = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')).enabled;
    }
} catch (e) {
    console.log('No previous data found, starting fresh');
}

const getXorKey = () => process.env.XOR_KEY || '';

router.post('/access', (req, res) => {
    try {
        if (!serverEnabled) return res.status(503).send('Server maintenance');
        
        const encryptedKey = req.body;
        const xorKey = getXorKey();
        
        if (!encryptedKey || !xorKey) return res.status(400).send('Bad Request');
        
        const decryptedKey = xorEncryptDecrypt(encryptedKey, xorKey);
        if (!decryptedKey) return res.status(400).send('Invalid data');
        
        if (!keys.has(decryptedKey)) {
            return res.status(200).send(xorEncryptDecrypt('INVALID', xorKey));
        }
        
        const encryptedScript = xorEncryptDecrypt(scriptContent, xorKey);
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(encryptedScript);
        
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.post('/nfo', (req, res) => {
    try {
        const encryptedKey = req.body;
        const xorKey = getXorKey();
        
        if (!encryptedKey || !xorKey) return res.status(400).send('Bad Request');
        
        const encryptedAlert = xorEncryptDecrypt(alertMessage, xorKey);
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(encryptedAlert);
        
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/status', (req, res) => {
    res.json({
        status: serverEnabled ? 'online' : 'maintenance',
        totalKeys: keys.size,
        scriptLength: scriptContent.length,
        alertLength: alertMessage.length
    });
});

module.exports = router;
module.exports.getKeys = () => Array.from(keys);
module.exports.addKey = (key) => {
    keys.add(key);
    fs.writeFileSync(KEYS_FILE, JSON.stringify(Array.from(keys), null, 2));
    return true;
};
module.exports.removeKey = (key) => {
    keys.delete(key);
    fs.writeFileSync(KEYS_FILE, JSON.stringify(Array.from(keys), null, 2));
    return true;
};
module.exports.getScript = () => scriptContent;
module.exports.setScript = (script) => {
    scriptContent = script;
    fs.writeFileSync(SCRIPT_FILE, script);
    return true;
};
module.exports.getAlert = () => alertMessage;
module.exports.setAlert = (msg) => {
    alertMessage = msg;
    fs.writeFileSync(ALERT_FILE, msg);
    return true;
};
module.exports.toggleServer = () => {
    serverEnabled = !serverEnabled;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ enabled: serverEnabled }));
    return serverEnabled;
};
module.exports.isServerEnabled = () => serverEnabled;
