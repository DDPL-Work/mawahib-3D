with open('Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Upgrade Navbar signature and body to include logo + settings button
old_navbar = '''const Navbar = () => (
  <nav style={{
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "0 clamp(16px,2.5vw,32px)", height: 64,
    background: "rgba(8,13,26,0.88)", borderBottom: `1px solid ${C.line}`,
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontFamily: "'Sora', sans-serif",
  }}>
  </nav>
);'''

new_navbar = '''const Navbar = ({ onSettings }) => (
  <nav style={{
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "0 clamp(16px,2.5vw,32px)", height: 64,
    background: "rgba(8,13,26,0.88)", borderBottom: `1px solid ${C.line}`,
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontFamily: "'Sora', sans-serif",
  }}>
    {/* Logo */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${C.gold},${C.goldBright})`, display: "grid", placeItems: "center", boxShadow: `0 4px 14px rgba(184,149,90,0.4)` }}>
        <Sparkles size={16} color="#1a1006" />
      </div>
      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", color: C.inkWhite, letterSpacing: "0.01em" }}>Mawahib</span>
    </div>
    {/* Right actions */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={onSettings} title="Settings"
        style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${C.line}`, background: "transparent", color: C.inkMuted, display: "grid", placeItems: "center", cursor: "pointer", transition: "all 0.18s" }}
        onMouseEnter={e => { e.currentTarget.style.background = C.goldDim; e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.color = C.goldBright; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkMuted; }}
      ><Settings size={16} /></button>
      <div style={{ width: 1, height: 22, background: C.line, margin: "0 2px" }} />
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,rgba(184,149,90,0.3),rgba(240,201,122,0.15))`, border: `1px solid ${C.goldBorder}`, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, color: C.goldBright, fontFamily: "'Sora', sans-serif", cursor: "default" }}>HR</div>
    </div>
  </nav>
);'''

if old_navbar in content:
    content = content.replace(old_navbar, new_navbar, 1)
    print('Navbar upgraded')
else:
    print('ERROR: Navbar pattern not found exactly')
    # Print what we find around line 614
    lines = content.split('\n')
    for i in range(610, min(630, len(lines))):
        print(f'{i+1}: {repr(lines[i])}')

with open('Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
