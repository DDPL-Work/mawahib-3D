# 🚀 Apriora - Premium Animated Hiring Platform Landing Page

A cinematic, production-ready landing page with orbital avatar animations, scroll-triggered effects, and Apple-level polish. Built with React, Framer Motion, GSAP, and TailwindCSS.

## ✨ Features

### 🎬 Cinematic Animations
- **Orbital Avatar System**: Avatars rotate in a solar-system pattern around the hero content
- **Scroll-Triggered Effects**: GSAP ScrollTrigger controls rotation based on scroll progress
- **Smooth Parallax**: Content fades and scales elegantly during scroll
- **Particle Field**: Animated background particles with Canvas API
- **Micro-interactions**: Hover effects, 3D tilts, and pulse animations

### 🎨 Premium Design
- **Glassmorphism**: Backdrop blur effects and translucent surfaces
- **Gradient Meshes**: Multi-layered radial gradients for depth
- **Dark Theme**: Professional dark blue gradient background
- **Responsive**: Fully responsive design from mobile to desktop
- **Accessibility**: Respects reduced motion preferences

### ⚡ Performance
- **Optimized Animations**: Hardware-accelerated CSS transforms
- **Lazy Loading**: Avatar images load progressively
- **Smooth 60fps**: GSAP and Framer Motion ensure buttery smooth animations
- **Code Splitting**: Vite's automatic optimization

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Framer Motion** - Declarative animations
- **GSAP + ScrollTrigger** - Advanced scroll-based animations
- **TailwindCSS** - Utility-first styling
- **Vite** - Build tool and dev server
- **Canvas API** - Particle system

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Quick Start

1. **Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. **Start Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. **Open Browser**
Navigate to `http://localhost:3000`

The page will automatically reload when you make changes.

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The optimized build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
apriora-landing-page/
├── App.jsx                 # Main application component
├── main.jsx               # React entry point
├── index.html             # HTML template
├── index.css              # Global styles and Tailwind imports
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind customization
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## 🎯 Key Components

### Hero Section
The main viewport with:
- Animated gradient background
- Glassmorphism container
- Email capture form
- Scroll indicator

### Orbital Avatars
- 8 avatars positioned using polar coordinates
- Rotation controlled by scroll progress
- Individual hover effects with 3D tilt
- Pulse animations staggered by delay

### Particle Field
- Canvas-based floating particles
- Responsive to viewport size
- Subtle purple glow effect

### Feature Section
- Grid layout with 3 features
- Scroll-triggered fade-in animations
- Hover lift effects

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Avatars
Replace avatar URLs in `App.jsx`:

```javascript
const getAvatarUrl = (id) => {
  return `your-avatar-url-${id}.jpg`;
};
```

### Animation Timing
Adjust scroll animation parameters:

```javascript
ScrollTrigger.create({
  trigger: heroRef.current,
  start: "top top",
  end: "+=150%", // Change this for longer/shorter scroll
  scrub: 1,      // Change for faster/slower response
});
```

### Orbit Radius
Modify the orbital distance:

```javascript
const radius = window.innerWidth > 768 ? 320 : 180; // Adjust these values
```

## 🎬 Animation Details

### Scroll Behavior
1. **0-50% scroll**: Hero content fades out and scales down
2. **Throughout scroll**: Avatars rotate continuously (720° total)
3. **Section pinning**: Hero stays fixed during animation
4. **Smooth easing**: power3.out for premium feel

### Performance Optimization
- Uses `will-change` CSS property on animated elements
- Hardware-accelerated transforms (translate3d, rotate)
- RequestAnimationFrame for particle system
- Debounced resize handlers

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📱 Responsive Design

- **Mobile** (< 768px): Smaller orbit radius, stacked layout
- **Tablet** (768px - 1024px): Medium orbit, adjusted spacing
- **Desktop** (> 1024px): Full orbit radius, maximum visual impact

## 🎓 Code Quality

- **Functional Components**: Modern React with hooks
- **Clean Separation**: Logic, UI, and animations separated
- **Type Safety Ready**: Easy to add TypeScript
- **ESLint Compatible**: Follows React best practices
- **No Class Components**: Fully modern React approach

## 🚀 Deployment

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod
```

### GitHub Pages
```bash
npm run build
# Deploy dist folder
```

## 💡 Tips for Customization

1. **Change the tagline**: Edit the text in the Hero component
2. **Add more features**: Duplicate the feature card in FeatureSection
3. **Modify orbit pattern**: Adjust the angle calculation in OrbitAvatar
4. **Change particle count**: Modify `particleCount` in ParticleField
5. **Adjust scroll speed**: Change the ScrollTrigger `end` value

## 🐛 Troubleshooting

### Animations not smooth?
- Check browser hardware acceleration is enabled
- Reduce particle count for lower-end devices
- Disable particle field on mobile

### Avatars not appearing?
- Check console for CORS errors
- Verify avatar URLs are accessible
- Try using local images instead

### Build errors?
- Clear node_modules and reinstall
- Update Node.js to latest LTS
- Check for peer dependency conflicts

## 📄 License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Contributing

This is a template project. Feel free to fork and customize!

## 📞 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ using React, Framer Motion, and GSAP
