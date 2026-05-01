const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { xorEncryptDecrypt } = require('../xor');

// ====== PERSISTENT STORAGE SETUP ======
const DATA_DIR = path.join(__dirname, '..', 'data');
const KEYS_FILE = path.join(DATA_DIR, 'keys.json');
const SCRIPT_FILE = path.join(DATA_DIR, 'script.lua');
const ALERT_FILE = path.join(DATA_DIR, 'alert.txt');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions
function readJsonFile(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {}
    return defaultValue;
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (e) { return false; }
}

function readTextFile(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
    } catch (e) {}
    return defaultValue;
}

function writeTextFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, data);
        return true;
    } catch (e) { return false; }
}

// Load saved data
let keys = new Set(readJsonFile(KEYS_FILE, []));
let scriptContent = readTextFile(SCRIPT_FILE, `gg.toast("✅ AKSHU MOD - Welcome!")\n-- Your Lua script here`);
let alertMessage = readTextFile(ALERT_FILE, "Welcome to AKSHU MODZ!");
let serverEnabled = readJsonFile(CONFIG_FILE, { enabled: true }).enabled;

const getXorKey = () => process.env.XOR_KEY || '';

// ====== API ENDPOINTS ======

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

// ====== ADMIN FUNCTIONS (with file save) ======

module.exports = router;
module.exports.getKeys = () => Array.from(keys);
module.exports.addKey = (key) => {
    keys.add(key);
    writeJsonFile(KEYS_FILE, Array.from(keys));
    return true;
};
module.exports.removeKey = (key) => {
    keys.delete(key);
    writeJsonFile(KEYS_FILE, Array.from(keys));
    return true;
};
module.exports.getScript = () => scriptContent;
module.exports.setScript = (script) => {
    scriptContent = script;
    writeTextFile(SCRIPT_FILE, script);
    return true;
};
module.exports.getAlert = () => alertMessage;
module.exports.setAlert = (msg) => {
    alertMessage = msg;
    writeTextFile(ALERT_FILE, msg);
    return true;
};
module.exports.toggleServer = () => {
    serverEnabled = !serverEnabled;
    writeJsonFile(CONFIG_FILE, { enabled: serverEnabled });
    return serverEnabled;
};
module.exports.isServerEnabled = () => serverEnabled;
