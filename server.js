const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('📁 Data directory created:', DATA_DIR);
    } else {
        console.log('📁 Data directory exists:', DATA_DIR);
    }
    
    // Check if we can write to it
    const testFile = path.join(DATA_DIR, '.test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('✅ Data directory is writable');
} catch (e) {
    console.error('❌ Data directory error:', e.message);
}

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: '*/*' }));
app.use(express.static(path.join(__dirname, 'public')));

// Session for admin panel
app.use(session({
    secret: process.env.SESSION_SECRET || 'akshu_default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Import routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        server: 'AKSHU LUA SERVER',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        storage: 'persistent (file-based)',
        dataDir: DATA_DIR
    });
});

// Start server
app.listen(PORT, () => {
    console.log('========================================');
    console.log('  AKSHU LUA SERVER v1.0.0');
    console.log('  Running on port:', PORT);
    console.log('  Admin Panel: /admin');
    console.log('  API Endpoints: /api/access, /api/nfo');
    console.log('  Storage: Persistent (File-based)');
    console.log('  Data Dir:', DATA_DIR);
    console.log('========================================');
});
