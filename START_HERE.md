# 🏁 START HERE — Run on Windows, push to Git, and deploy

A step-by-step guide for opening this project on a Windows PC, getting it running,
then publishing it. (For the Vercel environment variables, see **`VERCEL_SETUP.md`**.)

---

## A) Run it locally on Windows

### 1. Install the tools (one time)
- **Node.js 20 LTS** (or 22): https://nodejs.org → download the **LTS** installer → next-next-finish.
- **Git**: https://git-scm.com/download/win
- **VS Code**: https://code.visualstudio.com

> After installing, close and reopen any terminals so they pick up Node/Git.

### 2. Unzip & open
- Unzip the project somewhere simple, e.g. `C:\titan-clash`.
- Open **VS Code → File → Open Folder →** select that folder.

### 3. Create the `.env.local` file (REQUIRED — the app won't connect to the database without it)
- In VS Code, right-click in the file list → **New File** → name it exactly **`.env.local`**.
- Paste this in (these are your real values — copy them from `VERCEL_SETUP.md` too):

```
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dfd812a30dedb3d5cf6ca3e02799ad4dd37638e0e30d1260d5d4587b8a5d352d"
MONGODB_URI="mongodb://akraj25085_db_user:ZkEk6o4f1xdHIXyQ@ac-ff1rpg9-shard-00-00.pl1lthi.mongodb.net:27017,ac-ff1rpg9-shard-00-01.pl1lthi.mongodb.net:27017,ac-ff1rpg9-shard-00-02.pl1lthi.mongodb.net:27017/armwrestling?ssl=true&replicaSet=atlas-vyr3in-shard-0&authSource=admin&retryWrites=true&w=majority"
NEXT_PUBLIC_WHATSAPP_NUMBER="923278625085"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```
> Make sure the name is `.env.local` — **not** `.env.local.txt`.
> ℹ️ The `MONGODB_URI` above is the **standard** connection string (lists the servers directly).
> We use it instead of the shorter `mongodb+srv://...` one because some Windows networks/Wi-Fi
> block the special DNS lookup that `+srv` needs (the `querySrv ECONNREFUSED` error).

### 4. Install dependencies (fresh — important on a new PC)
1. In the VS Code file list, **delete the `node_modules` folder** if it exists (right-click → Delete).
   This avoids broken/wrong-platform files left over from the zip.
2. Open a terminal: **Terminal → New Terminal**, then run:

```bash
npm install
```
> This downloads the correct Windows versions of everything (takes a couple of minutes).

### 5. Allow your PC to reach the database
In **MongoDB Atlas → Network Access → Add IP Address → “Allow Access from Anywhere” (`0.0.0.0/0`) → Confirm.**
(Without this you'll see *“Database error”* on login.)

### 6. Run it
```bash
npm run dev
```
Open **http://localhost:3000** in your browser. 🎉

- Admin login: **http://localhost:3000/login** → `admin@test.com` / `password123`
- (If login says no user found, run `npm run seed:users` once to create the accounts.)

> Note: registration **photo/payment uploads** only work once you fill the `CLOUDINARY_*`
> values in `.env.local` (free account at cloudinary.com — see `VERCEL_SETUP.md` step 3).

---

## B) Push to GitHub

### 1. Create an empty repo
Go to https://github.com/new → give it a name → **Create repository** (don't add a README).

### 2. From the VS Code terminal, in the project folder:
```bash
git init
git add .
git commit -m "Titan Clash armwrestling platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```
> Your secrets are safe: `.env.local` and `VERCEL_SETUP.md` are **git-ignored**, so they are
> **not** uploaded to GitHub. You'll add those values directly in Vercel instead.

---

## C) Deploy to Vercel

Follow **`VERCEL_SETUP.md`** (in this folder). In short:
1. https://vercel.com → **Add New → Project → import your GitHub repo**.
2. Add the **Environment Variables** from `VERCEL_SETUP.md`.
3. **Deploy.** After you get your URL, set `NEXTAUTH_URL` to it and **Redeploy**.
4. **Change the admin password** (`npm run seed:users` with your own email/password).

---

## Quick troubleshooting
| Problem | Fix |
|---|---|
| “Database error” on login | Create `.env.local` (step A3) **and** allow `0.0.0.0/0` in Atlas (A5). |
| `npm install` errors | Make sure Node 20+ is installed; delete `node_modules` and try again. |
| Photos won't upload | Fill the `CLOUDINARY_*` values in `.env.local` / Vercel. |
| Login doesn't ask for password | You're already logged in — that's normal. Use the **Sign Out** button or an incognito window. |
| Can't log in / no accounts | Run `npm run seed:users` once. |

That's everything — run locally, push, deploy. 🏆
