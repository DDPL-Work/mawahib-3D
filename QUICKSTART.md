# ⚡ Quick Start (60 seconds)

Get the landing page running in under a minute!

## 🏃‍♂️ Fast Track

```bash
# 1. Install dependencies (2-3 min)
npm install

# 2. Start dev server
npm run dev

# 3. Open browser to http://localhost:3000
```

That's it! 🎉

## 🎯 What You'll See

✨ **Animated hero section** with:
- Orbital avatars rotating on scroll
- Glassmorphism design
- Floating particles background
- Smooth scroll-triggered animations
- Email capture form with gradient button

## 📦 What Gets Installed

| Package | Purpose |
|---------|---------|
| React 18 | UI framework |
| Framer Motion | Smooth animations |
| GSAP + ScrollTrigger | Scroll effects |
| TailwindCSS | Styling |
| Vite | Dev server & build |

## 🎨 Customize Fast

### Change headline (30 seconds)
File: `App.jsx` → Line ~420

```javascript
<motion.h1>
  <span>YOUR HEADLINE</span>
  <br />
  <span>YOUR SUBHEADLINE</span>
</motion.h1>
```

### Change colors (1 minute)
File: `tailwind.config.js`

```javascript
from-cyan-500 to-blue-600  // Find and replace with your colors
```

### Add more avatars (2 minutes)
File: `App.jsx` → Line ~10

```javascript
const avatars = [
  { id: 1, name: 'Your Name', role: 'Title' },
  // Add more...
];
```

## 🚀 Deploy Fast

**Vercel** (Fastest):
```bash
npx vercel
```

**Netlify**:
```bash
npx netlify-cli deploy --prod
```

## 💡 Tips

- Press `Ctrl + C` to stop dev server
- Changes auto-reload in browser
- Check browser console for any errors
- Use Chrome DevTools to inspect animations

## ⚠️ Troubleshooting

**Port 3000 in use?**
```bash
# Use different port
PORT=3001 npm run dev
```

**Installation fails?**
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm install
```

**Styles not loading?**
- Hard refresh browser (Ctrl+Shift+R)
- Check terminal for errors

## 📚 Full Documentation

- `README.md` - Complete features & customization
- `INSTALLATION_GUIDE.md` - Detailed setup & troubleshooting

---

**Need help?** Check the browser console for error messages.
