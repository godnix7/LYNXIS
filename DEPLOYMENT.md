# Deployment Guide: Lynxis

Follow these steps to push your project to GitHub and deploy it to Vercel.

## 1. Push to GitHub

Open your terminal in the `lynxis` directory and run the following commands:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "feat: add multi-ai agent key bar and dynamic routing"

# Create a new repository on GitHub (https://github.com/new)
# Then link it to your local repo:
git remote add origin https://github.com/YOUR_USERNAME/lynxis.git

# Push to the main branch
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com).
2. Click **"New Project"**.
3. Import your `lynxis` repository from GitHub.
4. Vercel will automatically detect the **Vite** project.
5. (Optional) Add your environment variables like `VITE_ANTHROPIC_API_KEY` if you want a default key.
6. Click **Deploy**.

### Option B: Via Vercel CLI
If you have the Vercel CLI installed:
```bash
npm i -g vercel
vercel
```

## 3. Post-Deployment Setup
Once deployed, users can add their own keys via the **Settings > AI Agent Keys** section. These keys are stored in their browser's local storage and are used for all AI-powered code analysis.

---

### What's New?
- **Multi-Agent Gateway**: A premium key management bar in Settings.
- **Dynamic Routing**: The application now picks up key changes immediately without a page refresh.
- **Agent Status**: See which AI agent is active directly from your Dashboard.
