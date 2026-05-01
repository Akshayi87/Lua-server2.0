# 🔐 AKSHU LUA SERVER

**AKSHU MODZ - Lua Script Server with XOR Encryption**

A complete Node.js/Express server for hosting and serving encrypted Lua scripts to GameGuardian clients. Features XOR encryption, key validation, admin panel, and full Render.com deployment support.

---

## ✨ Features

- 🔒 **XOR Encryption** - Matches client-side Lua encryption exactly
- 🔑 **Key Management** - Add/remove keys via admin panel
- 📝 **Script Editor** - Edit Lua scripts directly in browser
- 🔔 **Alert System** - Send notifications to clients
- 👤 **Admin Panel** - Secure login with username/password
- 🌐 **Render Ready** - Deploy to Render.com in minutes
- 📱 **Client Compatible** - Works with GameGuardian Lua scripts

---

## 📁 Project Structure

```
akshu-lua-server/
├── server.js           # Main server file
├── xor.js              # XOR encryption module
├── package.json        # Dependencies
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── routes/
│   ├── api.js          # API endpoints (/api/access, /api/nfo)
│   └── admin.js        # Admin routes & auth
├── public/
│   ├── login.html      # Admin login page
│   └── admin.html      # Admin dashboard
└── scripts/
    └── default.lua     # Sample Lua script
```

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd akshu-lua-server

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Edit .env file with your credentials

# 4. Start the server
npm start

# Server runs on http://localhost:3000
```

---

## 🔧 Environment Variables

Create a `.env` file with these variables:

```env
PORT=3000
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
XOR_KEY=your_xor_encryption_key
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

> ⚠️ **IMPORTANT**: Change default credentials before deploying!

---

## 🌐 Deploy to Render.com

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/akshu-lua-server.git
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New +** → **Web Service**

### Step 3: Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `akshu-lua-server` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Language** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Step 4: Add Environment Variables

Click **Advanced** and add:

| Key | Value |
|-----|-------|
| `ADMIN_USERNAME` | `your_username` |
| `ADMIN_PASSWORD` | `your_password` |
| `XOR_KEY` | `your_xor_key` |
| `SESSION_SECRET` | `your_secret_key` |
| `NODE_ENV` | `production` |

### Step 5: Deploy

Click **Create Web Service** and wait for deployment!

Your server will be live at: `https://akshu-lua-server.onrender.com`

---

## 📡 API Endpoints

### Client Endpoints (for Lua script)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/access` | Validate key & get encrypted script |
| `POST` | `/api/nfo` | Get encrypted alert message |
| `GET`  | `/api/status` | Check server status |

### Admin Endpoints (requires login)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/admin/panel` | Admin dashboard |
| `GET`  | `/admin/api/keys` | List all keys |
| `POST` | `/admin/api/keys` | Add new key |
| `DELETE`| `/admin/api/keys/:key` | Remove key |
| `GET`  | `/admin/api/script` | Get current script |
| `POST` | `/admin/api/script` | Update script |
| `GET`  | `/admin/api/alert` | Get alert message |
| `POST` | `/admin/api/alert` | Update alert |
| `POST` | `/admin/api/toggle` | Toggle server on/off |

---

## 🔗 Client Configuration

Update your Lua client script with these URLs:

```lua
local loginUrl = "https://your-server.onrender.com/api/access"
local alertUrl = "https://your-server.onrender.com/api/nfo"
```

Make sure the `xorKey` in your Lua script matches the server's `XOR_KEY` environment variable.

---

## 🛡️ Security Notes

- Change default admin credentials immediately
- Use a strong, unique XOR key
- Never commit `.env` to GitHub
- Use HTTPS in production
- Consider adding rate limiting for production use

---

## 📞 Support

- Telegram: @your_telegram
- Server: AKSHU MODZ

---

**Made with ❤️ by AKSHU**
