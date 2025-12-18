# FinAlogica Deployment Guide

This guide details how to deploy your FinAlogica application to **Render** (Backend, ML, Database) and **Vercel** (Frontend).

## Prerequisites

- GitHub account with your code pushed to a repository.
- Accounts on [Render](https://render.com) and [Vercel](https://vercel.com).

---

## Part 1: Backend, ML, and Database (on Render)

We have configured a `render.yaml` file to automate this stack setup.

1.  **Log in to Render**.
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository `FinAlogica`.
4.  Render will auto-detect the `render.yaml` config which defines:
    - **Postgres DB** (`finalogica-db`)
    - **Node Backend** (`finalogica-backend`)
    - **Python ML Service** (`finalogica-ml`)
5.  **Review & Apply**. Accept the defaults (Free tier). Render will start deploying all three services.

**Wait for Deployment**:
- The Database takes a minute.
- The ML Service might take 3-5 minutes to build (installing torch).
- The Backend will wait for the DB to be ready.

**IMPORTANT**:
Once the Database is live, you must seed it!
1.  Go to the **Dashboard** -> **finalogica-db**.
2.  Click **Connect** -> **Internal Connection** (copy the string).
3.  Or use the **Shell** tab in the database view to run SQL commands directly if available, OR:
4.  More easily: Go to your **Backend Service** -> **Shell** (SSH console) and run:
    ```bash
    # Set the DB connection string from environment or manual input
    # Since we are inside the internal network, we can likely rely on process.env.DATABASE_URL if configured.
    
    # Note: The easiest way to seed in production without local psql is 
    # ensuring your backend has a migration script or running psql in the shell if available.
    # For now, you can manually run the seed SQL via the Render Dashboard's "Connect" external command line on your local machine if you have psql installed:
    # psql "postgres://user:password@hostname/database" -f db/schema.sql
    # psql "postgres://user:password@hostname/database" -f db/seed.sql
    ```

---

## Part 2: Frontend (on Vercel)

1.  **Log in to Vercel**.
2.  Click **Add New...** -> **Project**.
3.  Import the same `FinAlogica` Git repository.
4.  **Framework Preset**: Select **Vite**.
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your Render Backend (e.g., `https://finalogica-backend.onrender.com`).
    - `VITE_ML_URL`: The URL of your Render ML Service (e.g., `https://finalogica-ml.onrender.com`).
    *Note: If you don't set these, the frontend might try to look at localhost or hardcoded paths.*
7.  Click **Deploy**.

---

## Troubleshooting

- **ML Service Timeout/OOM**: The free tier on Render has 512MB RAM. PyTorch is heavy. If it crashes, consider upgrading to a paid instance or swapping to a lighter model framework (ONNX/TFLite) in the code.
- **CORS**: If frontend requests fail, check the browser console. You might need to add your Vercel domain to the `cors` configuration in `backend/src/index.js` if it's restrictive (currently it likely allows all or localhost).

---

## Git Operations

To push your changes to GitHub (which triggers deployments on Render and Vercel):

```bash
# 1. Initialize git if not already done (skip if already a repo)
git init

# 2. Add all files
git add .

# 3. Commit your changes
git commit -m "Deploy: Updated configurations and enhanced frontend"

# 4. Rename branch to main (if using master)
git branch -M main

# 5. Add remote (if not linked)
# git remote add origin https://github.com/YOUR_USERNAME/FinAlogica.git

# 6. Push to GitHub
git push -u origin main
```

**Enjoy your deployed AI Fish App!** 🐟
