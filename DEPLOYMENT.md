# GitHub Pages Setup Instructions

## ✅ Completed Setup

The following has been configured for GitHub Pages deployment:

### 1. Vite Configuration (vite.config.ts)
- ✅ Base path set to /wizualizacja/
- ✅ Build output configured for dist directory
- ✅ Assets directory configured

### 2. Package.json
- ✅ Added deploy script: npm run deploy
- ✅ Installed gh-pages package

### 3. GitHub Actions Workflow (.github/workflows/deploy.yml)
- ✅ Automatic deployment on push to main branch
- ✅ Node.js 18 environment
- ✅ Build and deploy to gh-pages branch

### 4. Project Files
- ✅ Updated README.md with project documentation
- ✅ Build tested successfully

## 🚀 Next Steps to Complete Setup

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### 2. Enable GitHub Pages in Repository Settings
1. Go to your GitHub repository
2. Navigate to Settings > Pages
3. Set Source to: Deploy from a branch
4. Select Branch: gh-pages
5. Select Folder: / (root)
6. Click Save

### 3. Update Repository Name (if needed)
If you want the URL to be wizualizacja.github.io:
1. Make sure your repository is named exactly: wizualizacja
2. Go to repository Settings > General
3. Scroll to Repository name section
4. Rename to wizualizacja if different

### 4. Wait for Deployment
- First deployment may take 5-10 minutes
- Check the Actions tab to monitor deployment progress
- Your site will be available at: https://[username].github.io/wizualizacja/

## 🔧 Deployment Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Manual deployment (alternative to GitHub Actions)
npm run deploy

# Preview production build locally
npm run preview
```

## 📝 Important Notes

1. Base Path: The app is configured for /wizualizacja/ base path
2. CSV Files: Make sure CSV files are in the public directory
3. Automatic Deployment: Every push to main branch triggers deployment
4. Manual Deployment: Use npm run deploy if needed

## 🐛 Troubleshooting

If deployment fails:
1. Check the Actions tab for error logs
2. Ensure all CSV files are committed to the repository
3. Verify the build passes locally with npm run build
4. Check that GitHub Pages is enabled in repository settings
