# Git Repository Setup Guide

## Current Status

✅ Git repository initialized
✅ Local commits exist (2 commits)
✅ .gitignore configured (protects .env files)
❌ No remote repository configured

---

## Option 1: Push to GitHub (Recommended)

### Step 1: Create a GitHub Repository

1. **Go to GitHub:**
   - Visit: https://github.com/new
   - Or click the "+" icon → "New repository"

2. **Repository Settings:**
   ```
   Repository name: my-chart-app
   Description: MyChart by Alera Care Collective - Patient Health Portal
   Visibility: Private ⚠️ (IMPORTANT for healthcare data)

   DO NOT initialize with:
   □ README
   □ .gitignore
   □ license
   ```

3. **Click "Create repository"**

### Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Use these:

**In your terminal, run:**

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR-USERNAME/my-chart-app.git

# Verify the remote was added
git remote -v

# Push your code
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

### Step 3: Verify

1. Refresh your GitHub repository page
2. You should see all your files
3. Verify `.env.local` is NOT visible (it should be ignored)

---

## Option 2: Push to GitLab

### Step 1: Create a GitLab Repository

1. **Go to GitLab:**
   - Visit: https://gitlab.com/projects/new
   - Click "Create blank project"

2. **Project Settings:**
   ```
   Project name: my-chart-app
   Visibility Level: Private ⚠️ (IMPORTANT)
   Initialize with README: NO (uncheck)
   ```

3. **Click "Create project"**

### Step 2: Connect Your Local Repository

```bash
# Add the remote repository
git remote add origin https://gitlab.com/YOUR-USERNAME/my-chart-app.git

# Push your code
git push -u origin main
```

---

## Option 3: Push to Bitbucket

### Step 1: Create a Bitbucket Repository

1. **Go to Bitbucket:**
   - Visit: https://bitbucket.org/repo/create

2. **Repository Settings:**
   ```
   Repository name: my-chart-app
   Access level: Private ⚠️
   Include README: No
   ```

3. **Click "Create repository"**

### Step 2: Connect Your Local Repository

```bash
# Add the remote repository
git remote add origin https://bitbucket.org/YOUR-USERNAME/my-chart-app.git

# Push your code
git push -u origin main
```

---

## Quick Commands Reference

### Add a Remote Repository

```bash
# GitHub
git remote add origin https://github.com/YOUR-USERNAME/my-chart-app.git

# GitLab
git remote add origin https://gitlab.com/YOUR-USERNAME/my-chart-app.git

# Bitbucket
git remote add origin https://bitbucket.org/YOUR-USERNAME/my-chart-app.git
```

### Check Remotes

```bash
git remote -v
```

### Push Your Code

```bash
# First time push (sets upstream)
git push -u origin main

# Subsequent pushes
git push
```

### Remove a Remote (if you made a mistake)

```bash
git remote remove origin
```

---

## ⚠️ IMPORTANT: Security Checklist

Before pushing to any remote repository:

### 1. Verify .env.local is NOT committed

```bash
# Check what will be pushed
git status

# Make sure .env.local is NOT listed
# If it is, add it to .gitignore immediately
```

### 2. Check .gitignore includes sensitive files

Your `.gitignore` already includes:
- ✅ `.env*` (all environment files)
- ✅ `node_modules/`
- ✅ `.next/`

### 3. Verify no secrets in code

```bash
# Search for potential secrets
git log --all -p | grep -i "password\|secret\|key" | head -20
```

### 4. Make Repository Private

⚠️ **CRITICAL:** Your repository MUST be private because:
- Contains healthcare application code
- May contain sensitive configuration
- HIPAA compliance requirements
- Business logic protection

---

## After Pushing to Remote

### Set Up Repository Secrets (for CI/CD)

If you're using GitHub Actions, Vercel, or other deployment platforms:

**GitHub Secrets:**
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `EMAIL_USER`
   - `EMAIL_PASS`

**Vercel/Netlify Environment Variables:**
1. Go to your project settings
2. Add all environment variables from `.env.local`
3. Redeploy your application

---

## Common Issues & Solutions

### Issue: "remote: Repository not found"
**Solution:**
- Check the repository URL is correct
- Verify you have access to the repository
- Make sure you're logged in to GitHub/GitLab/Bitbucket

### Issue: "fatal: refusing to merge unrelated histories"
**Solution:**
```bash
git pull origin main --allow-unrelated-histories
```

### Issue: ".env.local was accidentally committed"
**Solution:**
```bash
# Remove from Git but keep local file
git rm --cached .env.local

# Add to .gitignore
echo ".env.local" >> .gitignore

# Commit the removal
git add .gitignore
git commit -m "Remove .env.local from repository"

# Push changes
git push

# IMPORTANT: Rotate all secrets in .env.local
# (Firebase keys, email passwords, etc.)
```

### Issue: "src refspec main does not exist"
**Solution:**
```bash
# Check your branch name
git branch

# If it's not 'main', use the correct branch name
git push -u origin master  # if branch is 'master'
# or
git push -u origin your-branch-name
```

---

## Daily Git Workflow

Once your remote is set up:

### Making Changes

```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push
```

### Best Practices

1. **Commit often** with descriptive messages
2. **Pull before pushing** to avoid conflicts
   ```bash
   git pull
   git push
   ```
3. **Use branches** for major features
   ```bash
   git checkout -b feature-name
   # Make changes
   git push -u origin feature-name
   ```
4. **Never commit** `.env` files or secrets

---

## Collaborating with Team

### Add Collaborators

**GitHub:**
1. Repository → Settings → Collaborators
2. Click "Add people"
3. Enter their GitHub username or email

**GitLab:**
1. Project → Settings → Members
2. Invite members with appropriate roles

**Bitbucket:**
1. Repository → Settings → User and group access
2. Add users

### Recommended Team Workflow

1. **Protected main branch** - require pull requests
2. **Code reviews** before merging
3. **Branch naming:** `feature/`, `bugfix/`, `hotfix/`
4. **Commit message format:** Descriptive and clear

---

## Repository Settings Checklist

After creating your remote repository:

- [ ] Repository visibility: Private
- [ ] .gitignore configured correctly
- [ ] No .env files committed
- [ ] README.md added (optional)
- [ ] Branch protection rules (for team projects)
- [ ] Collaborators added (if needed)
- [ ] CI/CD secrets configured (if deploying)
- [ ] Repository description added

---

## Project Information

**Project Name:** MyChart by Alera Care Collective
**Local Path:** /Users/ianforde/Desktop/my-chart-app
**Current Branch:** main
**Commits:** 2 local commits
**Production URL:** https://mychart.aleracarecollective.com

---

## Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify your repository URL is correct
3. Make sure you have write access to the repository
4. Try removing and re-adding the remote
5. Contact your Git hosting platform's support
