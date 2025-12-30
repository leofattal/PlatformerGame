# Deployment Guide - Adventure Quest

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

   For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial platformer game"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it as a static site
   - Click "Deploy"

3. **Done!** Your game will be live at `https://your-project.vercel.app`

### Option 3: Deploy via Git Integration

Vercel will automatically deploy when you push to your repository:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Every push to `main` triggers a production deployment.

## Environment Configuration

No environment variables are needed for this static game. All configuration is in the code.

## Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Performance Optimizations

The current build includes:

✅ **Cache Headers**: Static assets cached for 1 year
✅ **HTML Revalidation**: Index.html always fresh
✅ **Minimal Bundle**: Pure HTML5/Canvas, no dependencies
✅ **Pixel-Perfect Rendering**: Optimized for performance
✅ **60 FPS Target**: Smooth gameplay

## Build Output

Since this is a static HTML5 game, there's no build step required. The files are served as-is:

```
Production Files:
├── index.html          # Entry point
├── js/
│   ├── main.js
│   ├── game.js
│   ├── player.js
│   ├── level.js
│   ├── physics.js
│   ├── input.js
│   └── utils.js
└── vercel.json         # Deployment config
```

## Monitoring

After deployment, you can monitor:
- **Analytics**: Vercel Dashboard → Analytics
- **Performance**: Vercel Dashboard → Speed Insights
- **Logs**: Vercel Dashboard → Logs (though minimal for static sites)

## Troubleshooting

### Game Not Loading

1. Check browser console for errors
2. Ensure all JS files are loading correctly
3. Verify Canvas API is supported in browser

### Performance Issues

1. Check if running in 60 FPS mode
2. Open DevTools → Performance tab
3. Ensure hardware acceleration is enabled in browser

### Deployment Failures

1. Check `vercel.json` syntax
2. Ensure all files are committed to git
3. Review Vercel deployment logs

## Rollback

If you need to rollback to a previous version:

```bash
vercel rollback
```

Or use the Vercel dashboard to select a previous deployment.

## Next Steps After Deployment

1. **Test the live site** on different devices and browsers
2. **Share the URL** with testers for feedback
3. **Monitor analytics** to see player engagement
4. **Iterate** based on feedback

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Project Issues: Check GitHub Issues tab
