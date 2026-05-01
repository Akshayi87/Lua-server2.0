const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log('========================================');
    console.log('  AKSHU LUA SERVER v1.0.0');
    console.log('  Running on port:', PORT);
    console.log('  Admin Panel: /admin');
    console.log('  API Endpoints: /api/access, /api/nfo');
    console.log('========================================');
});
