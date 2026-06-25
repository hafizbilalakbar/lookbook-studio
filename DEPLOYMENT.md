# Deployment Guide

Step-by-step instructions for deploying Lookbook Studio to production.

---

## Step 1: Push Project to GitHub

1. Open **GitHub Desktop**
2. Click **File** > **Add Local Repository**
3. Select your `lookbook-studio` folder
4. Click **Add Repository**
5. Click **Publish Repository** in the top-right corner
6. Choose **Public** visibility for portfolio展示
7. Click **Publish**

---

## Step 2: Create GitHub Repository

If you prefer using GitHub directly:

1. Go to [github.com](https://github.com)
2. Click the **+** icon > **New repository**
3. Name: `lookbook-studio`
4. Description: `Premium fashion lookbook and color combination poster designer`
5. Select **Public**
6. Click **Create repository**

Then connect your local project:

```bash
git init
git add .
git commit -m "Initial release"
git branch -M main
git remote add origin https://github.com/your-username/lookbook-studio.git
git push -u origin main
```

---

## Step 3: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with your GitHub account
3. Click **Add New...** > **Project**
4. Find and select `lookbook-studio` repository
5. Click **Import**

---

## Step 4: Configure Vercel Settings

Configure the following settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Environment Variables (Optional)

If you want AI-powered color analysis:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Gemini API key |

Leave blank to use client-side pixel sampling only.

---

## Step 5: Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app is now live at `https://lookbook-studio.vercel.app`

---

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** > **Domains**
2. Enter your custom domain (e.g., `lookbook.studio`)
3. Follow DNS configuration instructions:
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records pointing to Vercel's IPs
4. SSL certificate is automatically provisioned

---

## Step 7: Production Checklist

Before going live, verify:

- [ ] Build succeeds without errors: `npm run build`
- [ ] No console errors in browser
- [ ] All pages load correctly
- [ ] Image upload works
- [ ] Color detection works
- [ ] Export functionality works
- [ ] Theme switching works
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Contact form validates correctly
- [ ] SEO meta tags are present

---

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### SPA Routing Issues

Vercel automatically handles SPA routing with the `vercel.json` configuration. If you experience 404 errors on page refresh, ensure the rewrite rule is configured.

### Images Not Loading

Ensure all images use HTTPS URLs or are local assets included in the build.

---

## Performance Tips

- Images are processed client-side for privacy
- 4K exports are rendered on-demand
- LocalStorage is used for project persistence
- No server-side database required
- Static hosting is sufficient for full functionality
