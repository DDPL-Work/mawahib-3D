# 📚 Installation & Setup Guide

Complete step-by-step guide to get your Apriora landing page up and running.

## 🎯 What You'll Need

- **Node.js** version 18 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- A code editor (VS Code recommended)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## ✅ Step 1: Verify Node.js Installation

Open your terminal and run:

```bash
node --version
```

You should see v18.0.0 or higher. If not, download and install Node.js from [nodejs.org](https://nodejs.org/).

## 📥 Step 2: Install Dependencies

Navigate to the project directory in your terminal:

```bash
cd apriora-landing-page
```

Then install all required packages:

### Using npm (recommended)
```bash
npm install
```

### Using yarn
```bash
yarn install
```

### Using pnpm
```bash
pnpm install
```

This will install:
- React and React DOM
- Framer Motion (for animations)
- GSAP with ScrollTrigger (for scroll effects)
- TailwindCSS (for styling)
- Vite (build tool)
- All development dependencies

**Installation time**: ~2-3 minutes depending on your internet speed.

## 🚀 Step 3: Start Development Server

After installation completes, start the development server:

```bash
npm run dev
```

You should see output like:

```
  VITE v5.0.8  ready in 543 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## 🌐 Step 4: View in Browser

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the animated landing page! 🎉

The page will automatically reload when you save changes to any files.

## 🛠️ Common Commands

### Development
```bash
npm run dev          # Start dev server
```

### Production Build
```bash
npm run build        # Create optimized production build
npm run preview      # Preview production build locally
```

## 🔧 Troubleshooting

### Issue: Port 3000 already in use

**Solution**: Kill the process using port 3000 or change the port in `vite.config.js`:

```javascript
server: {
  port: 3001, // Change to any available port
}
```

### Issue: Module not found errors

**Solution**: Delete `node_modules` and reinstall:

```bash
rm -rf node_modules
npm install
```

### Issue: Styles not loading

**Solution**: Make sure Tailwind is properly configured. Check that these files exist:
- `tailwind.config.js`
- `postcss.config.js`
- `index.css` has `@tailwind` directives

### Issue: Animations not smooth

**Solution**: 
1. Make sure you're using a modern browser
2. Enable hardware acceleration in browser settings
3. Close other tabs/applications
4. On lower-end devices, reduce particle count in `App.jsx`:

```javascript
const particleCount = 50; // Reduce from 100
```

### Issue: GSAP ScrollTrigger not working

**Solution**: Make sure GSAP is properly registered:

```javascript
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

This is already done in `App.jsx`.

## 📱 Testing on Mobile

To test on mobile devices on the same network:

1. Start dev server with host flag:
```bash
npm run dev -- --host
```

2. Look for the Network URL in the terminal:
```
➜  Network: http://192.168.1.5:3000/
```

3. Open that URL on your mobile device

## 🏗️ Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `dist` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps

### Test Production Build Locally

```bash
npm run preview
```

Opens the production build at `http://localhost:4173`

### Deploy to Hosting

**Vercel** (Recommended):
```bash
npm install -g vercel
vercel deploy
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages**, **Cloudflare Pages**, or any static hosting:
- Upload the contents of the `dist` folder

## 🎨 Customization Quick Start

### Change Brand Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
      },
    },
  },
},
```

### Modify Hero Text

Edit `App.jsx`, find the Hero component:

```javascript
<motion.h1>
  <span>Your Custom Headline</span>
  <br />
  <span>Your Subheadline</span>
</motion.h1>
```

### Change Avatar Count

In `App.jsx`, modify the avatars array:

```javascript
const avatars = [
  { id: 1, name: 'Your Name', role: 'Role' },
  // Add or remove entries
];
```

### Adjust Animation Speed

Find ScrollTrigger configuration:

```javascript
end: "+=150%", // Increase for longer animation
scrub: 1,      // Lower for faster response (0.5)
                // Higher for slower (2)
```

## 📚 Learning Resources

### Framer Motion
- [Official Docs](https://www.framer.com/motion/)
- [Animation Controls](https://www.framer.com/motion/animation/)
- [Scroll Animations](https://www.framer.com/motion/scroll-animations/)

### GSAP
- [GSAP Docs](https://greensock.com/docs/)
- [ScrollTrigger](https://greensock.com/scrolltrigger/)
- [Easing Visualizer](https://greensock.com/ease-visualizer/)

### TailwindCSS
- [Documentation](https://tailwindcss.com/docs)
- [Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

### React
- [React Docs](https://react.dev/)
- [Hooks Reference](https://react.dev/reference/react)

## 🎓 Next Steps

1. **Customize the design** to match your brand
2. **Add more sections** (testimonials, pricing, etc.)
3. **Integrate with backend** for email capture
4. **Add analytics** (Google Analytics, Plausible)
5. **Optimize images** using Next.js Image or similar
6. **Add SEO metadata** in `index.html`
7. **Set up A/B testing** for conversions

## 💡 Pro Tips

1. **Use browser DevTools** to inspect animations and performance
2. **Test on multiple devices** and browsers before deploying
3. **Monitor Core Web Vitals** using Lighthouse
4. **Keep dependencies updated** regularly
5. **Use environment variables** for API keys
6. **Enable gzip compression** on your hosting platform
7. **Add error boundaries** for production resilience

## 🆘 Getting Help

- Check the README.md for detailed documentation
- Open browser console to see error messages
- Search GitHub issues for similar problems
- Review the code comments in App.jsx

## ✅ Checklist Before Launch

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Verify all animations work smoothly
- [ ] Check email form validation
- [ ] Test with slow network speed
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Add analytics tracking
- [ ] Set up error monitoring
- [ ] Configure CDN for assets
- [ ] Add meta tags for social sharing

---

Happy coding! 🚀 If you create something awesome with this template, we'd love to see it!
