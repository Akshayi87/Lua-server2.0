const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { xorEncryptDecrypt } = require('../xor');

// File paths for persistent storage
const DATA_DIR = path.join(__dirname, '..', 'data');
const KEYS_FILE = path.join(DATA_DIR, 'keys.json');
const SCRIPT_FILE = path.join(DATA_DIR, 'script.lua');
const ALERT_FILE = path.join(DATA_DIR, 'alert.txt');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('✅ Data directory created:', DATA_DIR);
    } else {
        console.log('✅ Data directory exists:', DATA_DIR);
    }
} catch (e) {
    console.error('❌ Error creating data directory:', e.message);
}

// Helper: Read JSON file
function readJsonFile(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('❌ Error reading JSON:', filePath, e.message);
    }
    return defaultValue;
}

// Helper: Write JSON file with logging
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('✅ Saved to:', filePath);
        return true;
    } catch (e) {
        console.error('❌ Error writing JSON:', filePath, e.message);
        return false;
    }
}

// Helper: Read text file
function readTextFile(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
    } catch (e) {
        console.error('❌ Error reading text:', filePath, e.message);
    }
    return defaultValue;
}

// Helper: Write text file with logging
function writeTextFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, data);
        console.log('✅ Saved to:', filePath);
        return true;
    } catch (e) {
        console.error('❌ Error writing text:', filePath, e.message);
        return false;
    }
}

// Load data from files
let keys = new Set(readJsonFile(KEYS_FILE, []));
let scriptContent = readTextFile(SCRIPT_FILE, `gg.toast("✅ AKSHU MOD - Welcome!")\n-- Your Lua script here\n-- This is the default script that runs after key validation`);
let alertMessage = readTextFile(ALERT_FILE, "Welcome to AKSHU MODZ! Stay updated on Telegram.");
let serverEnabled = readJsonFile(CONFIG_FILE, { enabled: true }).enabled;

console.log('📊 Loaded', keys.size, 'keys from file');
console.log('📊 Script length:', scriptContent.length, 'chars');

// Get XOR key from environment
const getXorKey = () => process.env.XOR_KEY || '';

// POST /api/access - Main login endpoint
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

        const decryptedKey = xorEncryptDecrypt(encryptedKey, xorKey);
        
        if (!decryptedKey) {
            return res.status(400).send('Invalid data');
        }

        if (!keys.has(decryptedKey)) {
            return res.status(200).send(xorEncryptDecrypt('INVALID', xorKey));
        }

        const encryptedScript = xorEncryptDecrypt(scriptContent, xorKey);
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(encryptedScript);

    } catch (error) {
        console.error('Access error:', error);
        res.status(500).send('Server Error');
    }
});

// POST /api/nfo - Alert endpoint
router.post('/nfo', (req, res) => {
    try {
        const encryptedKey = req.body;
        const xorKey = getXorKey();
        
        if (!encryptedKey || !xorKey) {
            return res.status(400).send('Bad Request');
        }

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

// Admin functions with file persistence
module.exports = router;

module.exports.getKeys = () => Array.from(keys);

module.exports.addKey = (key) => {
    keys.add(key);
    const success = writeJsonFile(KEYS_FILE, Array.from(keys));
    if (success) {
        console.log('🔑 Key added:', key);
    }
    return success;
};

module.exports.removeKey = (key) => {
    keys.delete(key);
    const success = writeJsonFile(KEYS_FILE, Array.from(keys));
    if (success) {
        console.log('🔑 Key removed:', key);
    }
    return success;
};

module.exports.getScript = () => scriptContent;

module.exports.setScript = (script) => {
    scriptContent = script;
    const success = writeTextFile(SCRIPT_FILE, script);
    if (success) {
        console.log('📝 Script saved, length:', script.length);
    }
    return success;
};

module.exports.getAlert = () => alertMessage;

module.exports.setAlert = (msg) => {
    alertMessage = msg;
    const success = writeTextFile(ALERT_FILE, msg);
    if (success) {
        console.log('🔔 Alert saved');
    }
    return success;
};

module.exports.toggleServer = () => {
    serverEnabled = !serverEnabled;
    const success = writeJsonFile(CONFIG_FILE, { enabled: serverEnabled });
    return serverEnabled;
};

module.exports.isServerEnabled = () => serverEnabled;
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
