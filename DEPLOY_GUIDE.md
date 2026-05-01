# 🚀 AKSHU LUA SERVER - Complete Deployment Guide

## Step-by-Step: GitHub → Render.com

---

## 📦 STEP 1: Push to GitHub

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `akshu-lua-server`
3. Description: `AKSHU MODZ - Lua Script Server`
4. Choose **Public** or **Private**
5. Click **Create repository**

![GitHub New Repo](https://kimi-web-img.moonshot.cn/img/docs.github.com/cc063b5b5ba5f4cd2e2322cd314c71796d38ae8e.png)

### 1.2 Push Your Code

Open terminal in your project folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AKSHU LUA SERVER"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/akshu-lua-server.git

# Push to main branch
git branch -M main
git push -u origin main
```

![GitHub Push](https://kimi-web-img.moonshot.cn/img/proclusacademy.com/d3ddf8446b14664ba086b9baadc02689a5ea8f10.webp)

---

## 🌐 STEP 2: Deploy to Render.com

### 2.1 Sign Up
1. Go to https://dashboard.render.com
2. Sign up with **GitHub**
3. Allow Render to access your repositories

### 2.2 Create Web Service
1. Click **New +** → **Web Service**

![Render Dashboard](https://kimi-web-img.moonshot.cn/img/render.com/db154b581cde5b3818ccf0689604db6fa1e98e5b.png)

2. Select your `akshu-lua-server` repository

### 2.3 Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `akshu-lua-server` |
| **Region** | Oregon (or closest to you) |
| **Branch** | `main` |
| **Language** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

![Render Config](https://kimi-web-img.moonshot.cn/img/render.com/5bd32418f615f9bc004f5648ebf56f129cac03c5.png)

### 2.4 Add Environment Variables (CRITICAL!)

Click **Advanced** → **Environment Variables**:

| Key | Value | Description |
|-----|-------|-------------|
| `ADMIN_USERNAME` | `akshu` | Your admin login |
| `ADMIN_PASSWORD` | `your_strong_password` | Your admin password |
| `XOR_KEY` | `PQRSTU3456789...` | Same as Lua client |
| `SESSION_SECRET` | `random_secret_string` | Session encryption |
| `NODE_ENV` | `production` | Production mode |

![Render Env Vars](https://kimi-web-img.moonshot.cn/img/render.com/fc61c155555aef6eb10cefe2f28829455bd6f082.png)

> ⚠️ **IMPORTANT**: Change default credentials! Never use `akshu123` in production!

### 2.5 Deploy
1. Click **Create Web Service**
2. Wait for build to complete (2-3 minutes)
3. Your server is live at: `https://akshu-lua-server.onrender.com`

![Render Deploy](https://kimi-web-img.moonshot.cn/img/render.com/7dedd63790845eb5718dd2e2391bfd91df76ed26.png)

---

## 🔗 STEP 3: Update Lua Client

In your GameGuardian Lua script, update URLs:

```lua
local loginUrl = "https://akshu-lua-server.onrender.com/api/access"
local alertUrl = "https://akshu-lua-server.onrender.com/api/nfo"
```

---

## 👤 STEP 4: Access Admin Panel

1. Open: `https://akshu-lua-server.onrender.com/admin/login`
2. Login with your credentials
3. Manage keys, scripts, and alerts

---

## 📋 Render Free Tier Limits (2026)

- ✅ **Cost**: $0/month
- ✅ **Bandwidth**: 100 GB/month
- ⚠️ **Spin-down**: After 15 min inactivity (1 min cold start)
- ✅ **Custom domains**: 2 free
- ✅ **Auto-deploy**: On every git push
- ✅ **HTTPS**: Managed TLS certificates

> For production with no cold starts, upgrade to Starter ($7/month) [^1^]

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check `package.json` has all dependencies |
| Server won't start | Verify `PORT` env var is set |
| Admin can't login | Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` |
| Lua client fails | Ensure `XOR_KEY` matches exactly |
| 404 on admin | Check routes in `server.js` |

---

## 🔄 Auto-Deploy

Every `git push` to `main` branch automatically redeploys:

```bash
git add .
git commit -m "Update script"
git push origin main
```

Render will detect and deploy automatically! [^1^]

---

**Made with ❤️ by AKSHU MODZ**
