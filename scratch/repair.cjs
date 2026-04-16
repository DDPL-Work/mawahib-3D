const fs = require('fs');
let code = fs.readFileSync('Dashboard.jsx', 'utf8');

// The block to insert:
const returnBlock = `  return (
    <>
      <FontLink />
      <style>{\`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: rgba(184,149,90,0.2) transparent; }
        body {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80vw 55vh at 100% -5%, rgba(184,149,90,0.1) 0%, transparent 55%),
            radial-gradient(ellipse 60vw 45vh at -5% 95%, rgba(95,158,255,0.06) 0%, transparent 50%),
            #080d1c;
          font-family: 'Sora', sans-serif;
        }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        input::placeholder { color: rgba(245,240,235,0.28); }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .main-layout { flex-direction: column !important; }
        }
        @media (max-width: 960px) {
          .circular-kpi-grid { grid-template-columns: 1fr !important; }
          .insight-copy-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      \`}</style>
      <main style={{`;

// Fix missing return and style block
code = code.replace(/:\s*0;\s+<main style=\{\{/, ': 0;\n\n' + returnBlock);

// Remove the dashboard pill exactly
const pillBlockRegex = /<div style=\{\{\s*display: "inline-flex",[\s\S]*?Dashboard\s*<\/div>/;
code = code.replace(pillBlockRegex, '');

fs.writeFileSync('Dashboard.jsx', code);
console.log('Fixed syntax error and dashboard pill.');
