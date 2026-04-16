const fs = require('fs');
let code = fs.readFileSync('Dashboard.jsx', 'utf8');

// 1. Fix C object (revert ink to light, set cards to light golden)
code = code.replace(/const C = \{[\s\S]*?\};/m, `const C = {
  bgDark: "#080d1c", 
  bgPanel: "rgba(197, 164, 126, 0.08)", // Light golden panel
  bgCard: "rgba(197, 164, 126, 0.04)", // Light golden card
  bgCardHover: "rgba(197, 164, 126, 0.12)",
  bgInput: "rgba(15, 23, 42, 0.6)",
  gold: "#c5a47e",
  goldBright: "#f3d299", 
  goldDim: "rgba(197, 164, 126, 0.15)",
  goldBorder: "rgba(197, 164, 126, 0.3)",
  goldBorderHot: "rgba(197, 164, 126, 0.5)",
  inkWhite: "#ffffff",
  inkSoft: "rgba(248, 250, 252, 0.95)", // Reverted to light for dark bg
  inkMuted: "rgba(203, 213, 225, 0.65)",
  inkFaint: "rgba(148, 163, 184, 0.45)",
  line: "rgba(197, 164, 126, 0.15)",
  lineStrong: "rgba(197, 164, 126, 0.28)",
  blue: "#60a5fa",
  blueDim: "rgba(96, 165, 250, 0.12)",
  green: "#34d399",
  greenDim: "rgba(52, 211, 153, 0.12)",
  greenBright: "rgba(52, 211, 153, 0.9)",
  yellow: "#fbbf24",
  yellowDim: "rgba(251, 191, 36, 0.12)",
  red: "#fb7185",
  redDim: "rgba(251, 113, 133, 0.12)",
};`);

// 2. Change all '#ffffff' backgrounds from previous script to light golden
code = code.replace(/background:\s*"#ffffff"/g, 'background: "rgba(197, 164, 126, 0.06)"');

// 3. Make Hiring Campaigns title golden
// Note: It's line 1688: <h1 style={{ ... color: C.inkWhite }}>
code = code.replace(/color: C\.inkWhite \}\}>\s*Hiring Campaigns/g, 'color: C.goldBright }}>\n              Hiring Campaigns');

// ensure we catch any other variations
code = code.replace(/<h1 style=\{\{\s*fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp\(2rem,4vw,3.2rem\)", lineHeight: 1, letterSpacing: "-0.02em", margin: 0, color: C\.inkWhite\s*\}\}>/g, '<h1 style={{ fontFamily: "\'DM Serif Display\', serif", fontStyle: "italic", fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1, letterSpacing: "-0.02em", margin: 0, color: C.goldBright }}>');

// Fix input placeholder text color for dark mode
code = code.replace(/input::placeholder \{ color: #94a3b8; \}/, 'input::placeholder { color: rgba(245,240,235,0.28); }');

fs.writeFileSync('Dashboard.jsx', code);
console.log('Golden theme applied correctly.');
