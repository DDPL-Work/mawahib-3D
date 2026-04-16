const fs = require('fs');
let code = fs.readFileSync('Dashboard.jsx', 'utf8');

// Update C object
code = code.replace(/const C = \{[\s\S]*?\};/m, `const C = {
  bgDark: "#f4f7fa", // Professional light grey background
  bgPanel: "#ffffff",
  bgCard: "#ffffff",
  bgCardHover: "#f8fafc",
  bgInput: "#ffffff",
  gold: "#c5a47e",
  goldBright: "#a8865c", // Darker gold for text contrast
  goldDim: "rgba(197, 164, 126, 0.15)",
  goldBorder: "rgba(197, 164, 126, 0.3)",
  goldBorderHot: "rgba(197, 164, 126, 0.5)",
  inkWhite: "#000000",
  inkSoft: "#1e293b",
  inkMuted: "#64748b",
  inkFaint: "#94a3b8",
  line: "#e2e8f0",
  lineStrong: "#cbd5e1",
  blue: "#3b82f6",
  blueDim: "rgba(59, 130, 246, 0.15)",
  green: "#10b981",
  greenDim: "rgba(16, 185, 129, 0.15)",
  greenBright: "rgba(16, 185, 129, 0.9)",
  yellow: "#eab308",
  yellowDim: "rgba(234, 179, 8, 0.15)",
  red: "#ef4444",
  redDim: "rgba(239, 68, 68, 0.15)",
};`);

// Update body CSS
code = code.replace(/#0f172a;/g, '#f4f7fa;');
code = code.replace(/color: #f8fafc;/g, 'color: #0f172a;');
code = code.replace(/input::placeholder \{ color: rgba\(245,240,235,0\.28\); \}/, 'input::placeholder { color: #94a3b8; }');
code = code.replace(/boxShadow: `0 4px 20px rgba\(184,149,90,0\.35\)`/, "boxShadow: `0 4px 15px rgba(0,0,0,0.06)`");

// Change dark card backgrounds to white
code = code.replace(/background: "rgba\(30,\s*41,\s*59,\s*[0-9.]+\)"/g, 'background: "#ffffff"');
code = code.replace(/background: "rgba\(15,\s*23,\s*42,\s*[0-9.]+\)"/g, 'background: "#ffffff"');
code = code.replace(/background: "rgba\(6,\s*10,\s*20,\s*[0-9.]+\)"/g, 'background: "#ffffff"');

// Fix gradients and transparent panels
code = code.replace(/background: `linear-gradient\(135deg, \$\{C\.gold\}, \$\{C\.goldBright\}\)`/g, 'background: `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`');
code = code.replace(/background: "rgba\(255,255,255,0\.03\)"/g, 'background: "rgba(0,0,0,0.02)"');
code = code.replace(/background: "rgba\(255,255,255,0\.01\)"/g, 'background: "rgba(0,0,0,0.01)"');
code = code.replace(/background: "transparent"/g, 'background: "transparent"');

// Minor drop shadow fixes to feel premium
code = code.replace(/boxShadow: "0 20px 50px -12px rgba\(0,0,0,0\.4\)"/g, 'boxShadow: "0 20px 40px -12px rgba(0,0,0,0.08)"');
code = code.replace(/boxShadow: "inset 0 0 40px rgba\(0,0,0,0\.1\)"/g, 'boxShadow: "inset 0 0 20px rgba(0,0,0,0.02)"');
code = code.replace(/boxShadow: "0 10px 30px -10px rgba\(0,0,0,0\.3\)"/g, 'boxShadow: "0 10px 20px -10px rgba(0,0,0,0.06)"');

fs.writeFileSync('Dashboard.jsx', code);
console.log('Dashboard professional light-grey theme applied.');
