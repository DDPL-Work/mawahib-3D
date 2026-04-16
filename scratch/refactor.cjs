const fs = require('fs');
let code = fs.readFileSync('Dashboard.jsx', 'utf8');

// 1. Remove Navbar usage
code = code.replace(/<Navbar \/>\s*/g, '');

// 2. Adjust main padding
code = code.replace(/padding: "clamp\(84px,10vw,96px\)/g, 'padding: "clamp(32px,5vw,48px)');

// 3. Update C object
code = code.replace(/const C = \{[\s\S]*?\};/m, `const C = {
  bgDark: "#f8fafc", // Highlighting Light Slate
  bgPanel: "rgba(255, 255, 255, 0.8)", // White Glass
  bgCard: "rgba(255, 255, 255, 0.65)", // Lighter interactive cards
  bgCardHover: "rgba(255, 255, 255, 0.9)",
  bgInput: "rgba(255, 255, 255, 0.5)",
  gold: "#c5a47e",
  goldBright: "#b08554", // Darkened for contrast on light background
  goldDim: "rgba(197, 164, 126, 0.12)",
  goldBorder: "rgba(197, 164, 126, 0.4)",
  goldBorderHot: "rgba(197, 164, 126, 0.6)",
  inkWhite: "#0a0f1c", // Swap to dark text
  inkSoft: "rgba(15, 23, 42, 0.95)",
  inkMuted: "rgba(15, 23, 42, 0.65)",
  inkFaint: "rgba(15, 23, 42, 0.35)",
  line: "rgba(15, 23, 42, 0.08)",
  lineStrong: "rgba(15, 23, 42, 0.15)",
  blue: "#3b82f6",
  blueDim: "rgba(59, 130, 246, 0.12)",
  green: "#10b981",
  greenDim: "rgba(16, 185, 129, 0.12)",
  greenBright: "rgba(16, 185, 129, 0.9)",
  yellow: "#f59e0b",
  yellowDim: "rgba(245, 158, 11, 0.12)",
  red: "#ef4444",
  redDim: "rgba(239, 68, 68, 0.12)",
};`);

// 4. Update body CSS
code = code.replace(/#0f172a/g, '#f8fafc');
code = code.replace(/color: #f8fafc;/g, 'color: #0f172a;');
code = code.replace(/input::placeholder \{ color: rgba\(245,240,235,0\.28\); \}/, 'input::placeholder { color: rgba(15,23,42,0.28); }');

// 5. Replace dark backgrounds with white counterparts
code = code.replace(/rgba\(30,\s*41,\s*59,\s*([0-9.]+)\)/g, 'rgba(255, 255, 255, $1)');
code = code.replace(/rgba\(15,\s*23,\s*42,\s*([0-9.]+)\)/g, 'rgba(255, 255, 255, $1)');
code = code.replace(/rgba\(6,\s*10,\s*20,\s*([0-9.]+)\)/g, 'rgba(255, 255, 255, $1)');

// 6. Replace faint highlights
code = code.replace(/rgba\(255,\s*255,\s*255,\s*0\.03\)/g, 'rgba(0, 0, 0, 0.03)');
code = code.replace(/rgba\(255,\s*255,\s*255,\s*0\.01\)/g, 'rgba(0, 0, 0, 0.01)');

fs.writeFileSync('Dashboard.jsx', code);
console.log('Dashboard theme updated successfully.');
