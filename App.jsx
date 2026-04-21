// Scroll to top on route change
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { useRef, useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence, useMotionValue, useVelocity } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Pricing from "./Pricing";
import About from "./About";
import Privacy from "./Privacy";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import CVResults from "./resume";
import SettingsModal from "./SettingsModal";
import Interview from "./Interview";
import HowItWorks from "./HowItWorks";
import CompanyTrustSection from "./Companytrustsection";
import { Settings, LogOut, Menu, X } from "lucide-react";
import { DASHBOARD_AUTH_KEY } from "./authConfig";

import * as THREE from "three";

/* ─── Design Tokens ───────────────────────────────────────────────── */
const C = {
  bg:"#f5f0eb", bgDark:"#0a0f1e",
  ink:"#0f172a", inkMid:"#475569", inkLight:"#94a3b8",
  gold:"#b8955a", goldLight:"#d4b483", goldBright:"#f0c97a",
  goldPale:"rgba(184,149,90,.10)", goldBorder:"rgba(184,149,90,.22)",
  white:"#ffffff", border:"rgba(15,23,42,.08)", borderMid:"rgba(15,23,42,.14)",
};
const PAGE_X = {
  mobile: "clamp(14px,4vw,20px)",
  desktop: "clamp(28px,7vw,100px)"
};

const LOGO_SRC = "./IMG_2041.JPG-removebg-preview.png";
const WHATSAPP_URL = "https://wa.me/966556919502";

function MawahibLogo({ blend = true, width, height = "auto" }) {
  const resolvedWidth =
    width ?? (height === "auto" || height == null ? 167 : "auto");
  return (
    <img
      src={LOGO_SRC}
      alt="Mawahib"
      draggable={false}
      style={{
        width:
          typeof resolvedWidth === "number" ? `${resolvedWidth}px` : resolvedWidth,
        height: typeof height === "number" ? `${height}px` : height,
        objectFit: "contain",
        display: "block"
      }}
    />
  );
}
/* ─── Fonts ─────────────────────────────────────────────────────────── */
const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet"/>
  </>
);

/* ─── Global Styles ─────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    html,body{width:100%;overflow-x:hidden}
    body{background:#0a0f1e;color:#f5f0eb;font-family:'Sora',sans-serif}
    #root{width:100%;overflow-x:hidden}
    img,svg{max-width:100%;height:auto}
    body, a, button, input, select, textarea, [role="button"] { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><path fill='%23b8955a' stroke='white' stroke-width='1.5' stroke-linejoin='round' d='M5 4 L5 20 L9 15 L13 21 L16 19 L12 13 L18 13 Z'/></svg>") 5 4, auto !important; }
    ::-webkit-scrollbar{width:2px}
    ::-webkit-scrollbar-track{background:#0a0f1e}
    ::-webkit-scrollbar-thumb{background:#b8955a;border-radius:2px}

    @keyframes shimmer-gold{
      0%{background-position:-200% center}
      100%{background-position:200% center}
    }
    .gold-shimmer{
      background:linear-gradient(90deg,#b8955a,#f0c97a,#b8955a,#d4b483,#f0c97a);
      background-size:200% auto;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      animation:shimmer-gold 3s linear infinite
    }
    /* ── KEYWORD BADGE SPECIAL STYLE ── */
    .keyword-badge{
      display:inline-flex;
      align-items:center;
      gap:6px;
      font-size:11px;
      letter-spacing:.13em;
      font-weight:800;
      text-transform:uppercase;
      padding:7px 14px;
      border-radius:999px;
      border:1px solid rgba(184,149,90,.5);
      background:linear-gradient(135deg,rgba(184,149,90,.18),rgba(240,201,122,.08));
      position:relative;
      overflow:hidden;
      white-space:nowrap;
      background-clip:padding-box;
    }
    .keyword-badge .kw-text{
      background:linear-gradient(90deg,#b8955a,#f0c97a,#b8955a,#d4b483,#f0c97a);
      background-size:200% auto;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      animation:shimmer-gold 3s linear infinite;
    }
    .keyword-badge::before{
      content:'';
      position:absolute;
      inset:0;
      background:linear-gradient(135deg,rgba(240,201,122,.08) 0%,transparent 60%);
      pointer-events:none;
    }

    @keyframes ticker-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes spin-slow{to{transform:rotate(360deg)}}
    @keyframes spin-slow-rev{to{transform:rotate(-360deg)}}
    @keyframes loader-in{0%{width:0%;opacity:0}10%{opacity:1}100%{width:100%}}
    @keyframes scroll-left {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes scroll-right{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
    .track-l{animation:scroll-left  36s linear infinite}
    .track-r{animation:scroll-right 40s linear infinite}
    .track-l:hover,.track-r:hover{animation-play-state:paused}

    @keyframes float-1{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-12px) rotate(1deg)}}
    @keyframes float-2{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-8px) rotate(-1deg)}}
    @keyframes pulse-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.5);opacity:0}}
    @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
    @keyframes glow-pulse{0%,100%{box-shadow:0 0 20px rgba(184,149,90,.2)}50%{box-shadow:0 0 40px rgba(184,149,90,.5),0 0 80px rgba(184,149,90,.2)}}

    @media(max-width:900px){.two-col{grid-template-columns:1fr!important}}
    @media(max-width:1024px){.feat-grid{grid-template-columns:repeat(2,1fr)!important}}
    @media(max-width:600px){.feat-grid{grid-template-columns:1fr!important}}

    .section-dark{background:rgba(10,15,30,.75);backdrop-filter:blur(0px)}
    .section-mid{background:rgba(10,15,30,.55)}
    .section-light{background:rgba(10,15,30,.35)}
    .glass-card{
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.08);
      backdrop-filter:blur(16px) saturate(1.4);
    }
    .glass-card-gold{
      background:rgba(184,149,90,.06);
      border:1px solid rgba(184,149,90,.18);
      backdrop-filter:blur(16px) saturate(1.4);
    }

    /* CTA Strip */
    @keyframes cta-glow{
      0%,100%{box-shadow:0 0 30px rgba(184,149,90,.15)}
      50%{box-shadow:0 0 60px rgba(184,149,90,.35),0 0 120px rgba(184,149,90,.1)}
    }
  `}</style>
);

/* ══════════════════════════════════════════════════════════════════════
   INLINE CTA STRIP — placed after every 2 sections
══════════════════════════════════════════════════════════════════════ */
function CTAStrip({ variant = 0 }) {
  const configs = [
    {
      label: "READY TO TRANSFORM HIRING?",
      button: { text: "🚀 Start Now", primary: true }
    },
    {
      label: "JOIN 400+ COMPANIES HIRING SMARTER",
      button: { text: "Get Free Demo", primary: true }
    },
    {
      label: "SEE MAWAHIB IN ACTION",
      button: { text: "Contact Us", primary: true }
    },
  ];
  const cfg = configs[variant % configs.length];
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        zIndex: 10,
        padding: "clamp(18px,2.5vw,28px) clamp(16px,4.5vw,80px)",
        background: "linear-gradient(135deg,rgba(184,149,90,.07) 0%,rgba(3,6,16,.9) 50%,rgba(184,149,90,.05) 100%)",
        borderTop: "1px solid rgba(184,149,90,.15)",
        borderBottom: "1px solid rgba(184,149,90,.15)",
        animation: "cta-glow 4s ease-in-out infinite",
        overflow: "hidden",
      }}
    >
      {/* Background accent */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 100% at 50% 50%,rgba(184,149,90,.06) 0%,transparent 70%)",
        pointerEvents: "none"
      }}/>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        position: "relative",
        zIndex: 2,
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: ".18em",
          color: C.gold,
          opacity: 0.8,
        }}>{cfg.label}</span>

        <div style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
              color: C.bgDark,
              borderRadius: 11,
              padding: "11px clamp(18px,2.5vw,28px)",
              fontSize: "clamp(12px,1.2vw,14px)",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: `0 6px 24px rgba(184,149,90,.35)`,
              border: "none",
              whiteSpace: "nowrap",
            }}
          >
            {cfg.button.text}
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WEBGL GLOBE
══════════════════════════════════════════════════════════════════════ */
function makePlanetTexture(size = 2048) {
  const w = size, h = size / 2;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0,   "#071220");
  oceanGrad.addColorStop(0.5, "#0a1a2e");
  oceanGrad.addColorStop(1,   "#061018");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);
  const lands = [
    {cx:.15,cy:.28,rx:.10,ry:.19,rot:.25,c:"#1a3520",c2:"#0f2214"},
    {cx:.20,cy:.58,rx:.065,ry:.18,rot:.08,c:"#1e3d20",c2:"#123018"},
    {cx:.50,cy:.30,rx:.055,ry:.13,rot:.05,c:"#1e3d22",c2:"#163020"},
    {cx:.50,cy:.56,rx:.075,ry:.20,rot:.0,c:"#22441e",c2:"#16341a"},
    {cx:.68,cy:.28,rx:.17,ry:.17,rot:-.08,c:"#1a3d20",c2:"#0f2a18"},
    {cx:.75,cy:.46,rx:.06,ry:.08,rot:.15,c:"#1e4020",c2:"#123018"},
    {cx:.78,cy:.64,rx:.055,ry:.045,rot:.18,c:"#243820",c2:"#182c18"},
    {cx:.24,cy:.12,rx:.038,ry:.052,rot:.1,c:"#c8dde8",c2:"#a0c0d0"},
    {cx:.5,cy:.97,rx:.5,ry:.06,rot:0,c:"#ddeeff",c2:"#c8d8e8"},
    {cx:.5,cy:.02,rx:.3,ry:.035,rot:0,c:"#c8d8e8",c2:"#a8c0d0"},
  ];
  lands.forEach(({cx,cy,rx,ry,rot,c,c2}) => {
    ctx.save();
    ctx.translate(cx*w, cy*h);
    ctx.rotate(rot);
    const maxR = Math.max(rx*w, ry*h);
    const grd = ctx.createRadialGradient(0,0,0,0,0,maxR);
    grd.addColorStop(0, c);
    grd.addColorStop(0.6, c2);
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.scale(rx*w/maxR*1.6, ry*h/maxR*1.6);
    ctx.beginPath();
    ctx.arc(0, 0, maxR * 0.72, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  });
  ctx.globalAlpha = 0.15;
  for(let i = 0; i < 40; i++){
    const x = Math.random()*w, y = Math.random()*h;
    const grd = ctx.createRadialGradient(x,y,0,x,y,Math.random()*30+8);
    grd.addColorStop(0, "#3a6030");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x,y, Math.random()*22+5, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalAlpha = 0.14;
  for(let i = 0; i < 25; i++){
    const y = Math.random()*h, thick = 4+Math.random()*14;
    const xl = Math.random()*w, xr = xl + Math.random()*w*.4 + 60;
    const grd = ctx.createLinearGradient(xl,y,xr,y+thick);
    grd.addColorStop(0,"transparent");
    grd.addColorStop(0.35,"#c8d8e8");
    grd.addColorStop(0.65,"#c8d8e8");
    grd.addColorStop(1,"transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(xl, y-thick/2, xr-xl, thick);
  }
  ctx.globalAlpha = 1;
  const cityZones = [
    [.12,.30],[.14,.34],[.18,.30],[.22,.34],[.15,.38],
    [.48,.32],[.50,.28],[.52,.34],[.54,.30],[.51,.36],
    [.65,.28],[.68,.24],[.72,.30],[.75,.26],[.70,.34],
    [.60,.30],[.63,.26],[.66,.32],[.58,.28],
    [.78,.64],[.80,.62],
  ];
  cityZones.forEach(([cx,cy]) => {
    const jitter = (n=1) => (Math.random()-.5)*n;
    for(let k=0;k<12;k++){
      const px = (cx + jitter(.08))*w, py = (cy + jitter(.06))*h;
      const r = Math.random()*1.8+0.4;
      const bright = 0.5+Math.random()*.7;
      ctx.globalAlpha = bright;
      ctx.beginPath();
      ctx.arc(px,py,r,0,Math.PI*2);
      ctx.fillStyle = `rgb(${220+Math.random()*35|0},${185+Math.random()*35|0},${90+Math.random()*60|0})`;
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
  ctx.globalAlpha = 0.7;
  for(let i = 0; i < 380; i++){
    const px = Math.random()*w, py = Math.random()*h;
    ctx.beginPath();
    ctx.arc(px,py,Math.random()*.9+.2,0,Math.PI*2);
    ctx.fillStyle = `rgba(${200+Math.random()*55|0},${160+Math.random()*55|0},${80+Math.random()*80|0},${.3+Math.random()*.7})`;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return new THREE.CanvasTexture(canvas);
}

function Stars() {
  const mesh = useRef();
  const geo = useMemo(() => {
    const N = 6000, pos = new Float32Array(N*3), col = new Float32Array(N*3);
    for(let i = 0; i < N; i++){
      const r = 80 + Math.random()*40;
      const phi = Math.acos(2*Math.random()-1);
      const theta = Math.random()*Math.PI*2;
      pos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
      pos[i*3+1] = r*Math.cos(phi);
      pos[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
      const warm = Math.random();
      col[i*3]   = 0.7+warm*.3;
      col[i*3+1] = 0.7+warm*.15;
      col[i*3+2] = 0.7-warm*.2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos,3));
    g.setAttribute("color",    new THREE.BufferAttribute(col,3));
    return g;
  },[]);
  useFrame(s => { if(mesh.current) mesh.current.rotation.y = s.clock.getElapsedTime()*0.0015; });
  return(
    <points ref={mesh} geometry={geo}>
      <pointsMaterial size={.15} vertexColors transparent opacity={.9}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/>
    </points>
  );
}

function Atmosphere() {
  return(
    <mesh scale={[1.18,1.18,1.18]}>
      <sphereGeometry args={[1,64,64]}/>
      <meshStandardMaterial color="#1a4a8a" transparent opacity={.12} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false}/>
    </mesh>
  );
}

function AtmosphereRim() {
  return(
    <mesh scale={[1.08,1.08,1.08]}>
      <sphereGeometry args={[1,64,64]}/>
      <meshStandardMaterial color="#b8955a" transparent opacity={.055} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false}/>
    </mesh>
  );
}

function CloudLayer() {
  const mesh = useRef();
  const geo = useMemo(() => {
    const N = 4000, pos = new Float32Array(N*3), col = new Float32Array(N*3);
    for(let i = 0; i < N; i++){
      const phi   = Math.acos(2*Math.random()-1);
      const theta = Math.random()*Math.PI*2;
      const r     = 1.02 + Math.random()*.035;
      pos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
      pos[i*3+1] = r*Math.cos(phi);
      pos[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
      const warm = .4+Math.random()*.6;
      col[i*3]   = warm*.85; col[i*3+1] = warm*.75; col[i*3+2] = warm*.55;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos,3));
    g.setAttribute("color",    new THREE.BufferAttribute(col,3));
    return g;
  },[]);
  useFrame(s => { if(mesh.current) mesh.current.rotation.y = s.clock.getElapsedTime()*-.03; });
  return(
    <points ref={mesh} geometry={geo}>
      <pointsMaterial size={.009} vertexColors transparent opacity={.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/>
    </points>
  );
}

function OrbitRings() {
  const refs = useRef([]);
  const ringData = [
    {s:1.32,rx:Math.PI/2.1,ry:.5,  sp:.28, op:.35, w:.006},
    {s:1.48,rx:Math.PI/3.2,ry:-.9, sp:-.17,op:.20, w:.004},
    {s:1.66,rx:Math.PI/5,  ry:.25, sp:.11, op:.12, w:.003},
    {s:1.85,rx:Math.PI/7,  ry:.9,  sp:-.07,op:.07, w:.002},
  ];
  useFrame(s => {
    const t = s.clock.getElapsedTime();
    refs.current.forEach((m,i) => { if(m) m.rotation.z = t*ringData[i].sp; });
  });
  return(
    <>
      {ringData.map((r,i) => (
        <mesh key={i} ref={el=>refs.current[i]=el} scale={r.s} rotation={[r.rx,r.ry,0]}>
          <torusGeometry args={[1,r.w,8,200]}/>
          <meshBasicMaterial color="#b8955a" transparent opacity={r.op} blending={THREE.AdditiveBlending} depthWrite={false}/>
        </mesh>
      ))}
    </>
  );
}

function Satellites() {
  const sats = useRef([]);
  const data = useMemo(() => [
    {r:1.34, sp:1.0,  tX:Math.PI/2.1,tY:.5,   sz:.03,  c:"#b8955a"},
    {r:1.50, sp:-.62, tX:Math.PI/3.2,tY:-.9,  sz:.022, c:"#d4b483"},
    {r:1.68, sp:.38,  tX:Math.PI/5,  tY:.25,  sz:.016, c:"#f0c97a"},
    {r:1.87, sp:-.22, tX:Math.PI/7,  tY:.9,   sz:.012, c:"#b8955a"},
  ],[]);
  useFrame(s => {
    const t = s.clock.getElapsedTime();
    data.forEach((d,i) => {
      if(!sats.current[i]) return;
      const a = t*d.sp;
      const cosT = Math.cos(d.tX), sinT = Math.sin(d.tX);
      sats.current[i].position.set(d.r*Math.cos(a), d.r*Math.sin(a)*cosT, d.r*Math.sin(a)*sinT);
    });
  });
  return(
    <>
      {data.map((d,i) => (
        <mesh key={i} ref={el=>sats.current[i]=el}>
          <sphereGeometry args={[d.sz,8,8]}/>
          <meshBasicMaterial color={d.c}/>
          <pointLight color={d.c} intensity={1.2} distance={.5} decay={2}/>
        </mesh>
      ))}
    </>
  );
}

function PlanetScene() {
  const { camera, gl } = useThree();
  const planetRef = useRef();
  const texture = useMemo(() => makePlanetTexture(2048), []);
  const scroll = useRef(0);
  const smoothS = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      scroll.current = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useFrame((state, delta) => {
    const target = scroll.current;
    smoothS.current += (target - smoothS.current) * 0.035;
    const t = smoothS.current;
    const time = state.clock.getElapsedTime();
    if(planetRef.current) {
      planetRef.current.rotation.y += delta * 0.06;
      planetRef.current.rotation.x = Math.sin(time * .12) * 0.04 + 0.15;
      planetRef.current.rotation.z = Math.sin(time * .08) * 0.01;
    }
    let cx, cy, cz, fov, lookX=0, lookY=0, lookZ=0;
    const lerp = THREE.MathUtils.lerp;
    const easeOut3 = p => 1 - Math.pow(1-p, 3);
    const easeInOut = p => p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
    const easeIn2 = p => p*p;
    if(t < 0.06) {
      const p = t/0.06;
      cz = lerp(5.5, 4.4, easeOut3(p));
      cx = lerp(1.4, 1.1, p);
      cy = lerp(.3,  .2,  p);
      fov = lerp(44, 40, p);
      cx += Math.sin(time*.18)*.04;
      cy += Math.cos(time*.14)*.03;
    } else if(t < 0.20) {
      const p = (t-.06)/.14;
      const e = easeOut3(p);
      cz = lerp(4.4, 1.4, e); cx = lerp(1.1, .15, e); cy = lerp(.2, -.25, e);
      fov = lerp(40, 22, e); lookX = lerp(0,  .1, e); lookY = lerp(0, -.1, e);
    } else if(t < 0.38) {
      const p = (t-.20)/.18;
      const angle = p * Math.PI * 1.1;
      cz = 1.42 + Math.sin(p*Math.PI)*.18;
      cx = Math.sin(angle) * .65; cy = Math.cos(angle*.55)*.28 - .2;
      fov = 22 + Math.sin(p*Math.PI)*5 + Math.sin(time*1.2)*.8;
      lookX = Math.sin(angle*.4)*.1; lookY = -.08;
    } else if(t < 0.52) {
      const p = (t-.38)/.14;
      const e = easeInOut(p);
      cz = lerp(1.6, 3.6, e); cx = lerp(.5, -.55, e); cy = lerp(-.1, .35, e);
      fov = lerp(26, 46, e); lookX = lerp(.05, -.05, e); lookY = lerp(-.05, .1, e);
    } else if(t < 0.66) {
      const p = (t-.52)/.14;
      const angle = p * Math.PI * .8 - .4;
      cz = 3.6 - Math.sin(p*Math.PI)*.6; cx = Math.cos(angle) * .55 - .55;
      cy = Math.sin(angle*.7)*.2 + .35; fov = 46 + Math.sin(p*Math.PI)*6;
      lookX = Math.cos(angle*.5)*.06;
    } else if(t < 0.82) {
      const p = (t-.66)/.16;
      const e = easeInOut(p);
      cz = lerp(3.1, 4.2, e); cx = lerp(-.55, -1.2, e); cy = lerp(.35, .5, e);
      fov = lerp(46, 42, e);
      cx += Math.sin(time*.22)*.05; cy += Math.cos(time*.18)*.04;
    } else {
      const p = (t-.82)/.18;
      const e = easeIn2(p);
      cz = lerp(4.2, 7.5, e); cx = lerp(-1.2, -.8, e); cy = lerp(.5, .6, e);
      fov = lerp(42, 55, e);
    }
    camera.position.set(cx, cy, cz);
    camera.fov = fov;
    camera.updateProjectionMatrix();
    camera.lookAt(lookX, lookY, lookZ);
  });
  return (
    <>
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 128, 128]}/>
        <meshStandardMaterial map={texture} roughness={0.82} metalness={0.02}
          emissive={new THREE.Color(0.04, 0.07, 0.03)} emissiveIntensity={0.5}/>
      </mesh>
      <Atmosphere/><AtmosphereRim/><OrbitRings/><Satellites/><CloudLayer/><Stars/>
    </>
  );
}

function Lights() {
  return(
    <>
      <ambientLight intensity={0.12}/>
      <directionalLight position={[-4, 2.5, 3.5]} intensity={2.8} color="#fff6e0"/>
      <pointLight position={[5, -1, -3]} intensity={0.5} color="#2255aa" distance={12}/>
      <pointLight position={[0, -4, 2]} intensity={0.4} color="#b8955a" distance={8}/>
    </>
  );
}

function GlobeBackground() {
  const [show, setShow] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const fn = () => setShow(window.innerWidth > 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  if(!show || location.pathname === "/dashboard" || location.pathname === "/interview") return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}>
      <Canvas
        gl={{ antialias:true, alpha:false, powerPreference:"high-performance", toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:.9 }}
        style={{ width:"100%", height:"100%", background:"#030610" }}
        camera={{ fov:44, near:0.05, far:200, position:[1.4,.3,5.5] }}
        dpr={[1,1.5]}
      >
        <Lights/>
        <Suspense fallback={null}><PlanetScene/></Suspense>
      </Canvas>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE LOADER
══════════════════════════════════════════════════════════════════════ */
function PageLoader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setPct(p => {
        if(p >= 100) { clearInterval(interval); setTimeout(() => { setDone(true); setTimeout(onDone, 600); }, 300); return 100; }
        return p + Math.random()*8+2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onDone]);
  return(
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity:0, y:"-100%" }}
          transition={{ duration:.8, ease:[.76,0,.24,1] }}
          style={{position:"fixed",inset:0,zIndex:99999,background:"#030610",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28}}>
          <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",border:"1px solid rgba(184,149,90,.08)",borderTop:"1px solid rgba(184,149,90,.4)",animation:"spin-slow 2.4s linear infinite"}}/>
          <div style={{position:"absolute",width:160,height:160,borderRadius:"50%",border:"1px solid rgba(184,149,90,.06)",borderBottom:"1px solid rgba(184,149,90,.3)",animation:"spin-slow-rev 1.8s linear infinite"}}/>
          <motion.div initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{duration:.8,ease:[.16,1,.3,1]}}>
            <MawahibLogo height={200} blend={false}/>
          </motion.div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
            <div style={{width:220,height:1,background:"rgba(255,255,255,.06)",position:"relative",overflow:"hidden"}}>
              <motion.div animate={{width:`${Math.min(pct,100)}%`}} transition={{duration:.3,ease:"linear"}}
                style={{position:"absolute",inset:0,background:`linear-gradient(90deg,${C.gold},${C.goldBright})`,boxShadow:`0 0 12px ${C.gold}`}}/>
            </div>
            <span style={{fontSize:9,color:"rgba(184,149,90,.6)",letterSpacing:".22em",fontWeight:700}}>
              LOADING PLANET... {Math.min(Math.round(pct),100)}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════════════════════════ */
// CustomCursor removed — golden pointer cursor is applied globally via CSS

/* ══════════════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:100,damping:30 });
  return(
    <motion.div style={{position:"fixed",top:0,left:0,right:0,height:2,
      background:`linear-gradient(90deg,${C.gold},${C.goldBright})`,
      transformOrigin:"left",scaleX,zIndex:1000,
      boxShadow:`0 0 8px ${C.gold}`}}/>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   LABEL PILL
══════════════════════════════════════════════════════════════════════ */
function Label({ children, color=C.gold, bg="rgba(184,149,90,.10)", border=C.goldBorder }) {
  return(
    <div style={{display:"inline-flex",alignItems:"center",gap:7,background:bg,border:`1px solid ${border}`,borderRadius:9999,padding:"5px 14px",fontSize:10,fontWeight:700,color,letterSpacing:".11em",marginBottom:20}}>
      <span style={{width:4,height:4,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`,display:"inline-block"}}/>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════════════════════════ */
function AnimCount({ val, suffix="" }) {
  const ref = useRef(); const inView = useInView(ref,{once:true}); const [d,setD]=useState("0");
  useEffect(()=>{
    if(!inView)return;
    const n=parseFloat(val);if(isNaN(n)){setD(val);return;}
    const dur=1600,start=Date.now();
    const step=()=>{const p=Math.min((Date.now()-start)/dur,1),e=1-Math.pow(1-p,3);setD(Math.round(e*n)+suffix);if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  },[inView,val,suffix]);
  return <span ref={ref}>{d}</span>;
}

/* ══════════════════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════════════════ */
function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { pathname } = useLocation();
  const isLoggedIn = sessionStorage.getItem(DASHBOARD_AUTH_KEY) === "true";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "How It Works", path: "/how-mawahib-works" },
    { name: "Pricing", path: "/pricing" },
    { name: "Privacy", path: "/privacy" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem(DASHBOARD_AUTH_KEY);
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .8, ease: [.16, 1, .3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: isMobile ? 64 : 74,
          padding: isMobile ? `0 ${PAGE_X.mobile}` : `0 ${PAGE_X.desktop}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled || isOpen || pathname !== "/" ? "rgba(10,15,30,.98)" : "transparent",
          backdropFilter: scrolled || isOpen || pathname !== "/" ? "blur(24px) saturate(1.4)" : "none",
          borderBottom: scrolled || isOpen || pathname !== "/" ? "1px solid rgba(184,149,90,.15)" : "none",
          transition: "all .4s cubic-bezier(.16,1,.3,1)"
        }}>
        
        {/* Logo */}
        <motion.a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}>
          <MawahibLogo width={isMobile ? 124 : 156} blend={false} />
        </motion.a>

        {/* Desktop Links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {links.map(l => (
              <Link key={l.name} to={l.path} style={{
                color: pathname === l.path ? C.gold : "rgba(255,255,255,.65)",
                textDecoration: "none", fontSize: 13, fontWeight: 600, letterSpacing: ".02em", transition: "color .2s"
              }} className="nav-link-hover">
                {l.name}
              </Link>
            ))}
          </div>
        )}

        {/* Action Buttons / Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isMobile && (
            <>
              {!isLoggedIn ? (
                <>
                  <motion.a href="https://mawahib.ai/request-campaign" target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, boxShadow: `0 8px 28px rgba(184,149,90,.35)` }} whileTap={{ scale: .96 }}
                    style={{ background: `linear-gradient(135deg,${C.gold},${C.goldBright})`, borderRadius: 10, padding: "9px 22px", fontSize: 13, fontWeight: 700, color: C.bgDark, textDecoration: "none", boxShadow: `0 4px 18px rgba(184,149,90,.25)`, lineHeight: 1, whiteSpace: "nowrap" }}>
                    Request Campaign
                  </motion.a>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/login" style={{
                      background: "rgba(255,255,255,.05)",
                      border: "1px solid rgba(255,255,255,.18)",
                      borderRadius: 10, padding: "9px 22px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.82)", textDecoration: "none", display: "inline-flex", alignItems: "center", lineHeight: 1, whiteSpace: "nowrap"
                    }}>Log In</Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: 8, justifyContent: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.gold, letterSpacing: "0.06em", lineHeight: 1.3 }}>Mawahib</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 500, lineHeight: 1.2 }}>Welcome, Rohan</span>
                  </div>
                  <motion.button
                    onClick={() => setShowSettings(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    aria-label="Settings"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      border: "1px solid rgba(184,149,90,.28)",
                      background: "rgba(184,149,90,.10)",
                      color: "rgba(255,255,255,.9)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Settings size={18} />
                  </motion.button>
                </>
              )}
            </>
          )}

          {isMobile && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              style={{
                background: "rgba(184,149,90,.08)", border: "1px solid rgba(184,149,90,.22)",
                borderRadius: 9, padding: 7, color: C.gold, cursor: "pointer", display: "flex", alignItems: "center"
              }}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [.16, 1, .3, 1] }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "radial-gradient(110% 90% at 50% 10%, rgba(184,149,90,.08) 0%, transparent 55%), linear-gradient(180deg, rgba(3,6,16,.98) 0%, rgba(3,6,16,.98) 100%)",
              backdropFilter: "blur(22px) saturate(1.2)",
              zIndex: 900, paddingTop: isMobile ? 88 : 110, paddingInline: 20
            }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "min(92vw, 360px)",
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(184,149,90,.18)",
                borderRadius: 16,
                padding: "18px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxShadow: "0 18px 60px rgba(0,0,0,.45)"
              }}>
                {links.map(l => (
                  <Link key={l.name} to={l.path} onClick={() => setIsOpen(false)} style={{
                    color: "rgba(255,255,255,.92)",
                    textDecoration: "none",
                    fontSize: 18,
                    fontWeight: 600,
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    letterSpacing: ".01em",
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,.02)",
                    border: "1px solid rgba(255,255,255,.06)"
                  }}>
                    {l.name}
                  </Link>
                ))}
                <div style={{ width: "100%", height: 1, background: "rgba(184,149,90,.18)" }} />
                {!isLoggedIn ? (
                  <>
                    <motion.a href="https://mawahib.ai/request-campaign" target="_blank" rel="noopener noreferrer"
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
                        borderRadius: 12,
                        padding: "12px 18px",
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.bgDark,
                        textDecoration: "none",
                        width: "100%",
                        textAlign: "center",
                        boxShadow: "0 10px 24px rgba(184,149,90,.3)"
                      }}>
                      Request Campaign
                    </motion.a>
                    <Link to="/login" onClick={() => setIsOpen(false)} style={{
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.12)",
                      borderRadius: 12,
                      padding: "12px 18px",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "rgba(255,255,255,.9)",
                      textDecoration: "none",
                      width: "100%",
                      textAlign: "center"
                    }}>Log In</Link>
                  </>
                ) : (
                  <div style={{
                    background: `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: 14,
                    padding: "12px 18px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(10,15,30,0.6)", letterSpacing: "0.08em" }}>
                      BALANCE ($)
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#0a0f1e", fontFamily: "'Sora', sans-serif" }}>
                      $5000.00
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO SECTION
   Changes: heading on ONE line, bigger description, planet graphic pushed right,
   reduce gap between text and visual
══════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25], [1, 0.94]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const stats = [
    { val: "190+", sub: "Countries" },
    { val: "20+", sub: "Languages" },
    { val: "All", sub: "Industries" },
    { val: "Any", sub: "Job Role" }
  ];

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      zIndex: 10,
      overflow: "hidden",
      /* Push planet graphic more to the right with a narrower gradient */
      background: "linear-gradient(90deg,rgba(3,6,16,.88) 0%,rgba(3,6,16,.72) 38%,rgba(3,6,16,.18) 62%,transparent 100%)"
    }}>
      <motion.div style={{
        y, opacity, scale,
        padding: isMobile ? `0 ${PAGE_X.mobile}` : `0 ${PAGE_X.desktop}`,
        paddingTop: isMobile ? "clamp(90px, 12vh, 110px)" : 90,
        paddingBottom: isMobile ? "clamp(48px, 8vh, 72px)" : 90,
        width: "100%"
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          minHeight: isMobile ? "auto" : "calc(100vh - 180px)",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.05fr) minmax(300px, 360px)",
          gap: isMobile ? 32 : "clamp(40px, 6vw, 88px)",
          alignItems: "center"
        }}>
          <div style={{ width: "100%", maxWidth: "clamp(340px,44vw,580px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
          <Label>AI-POWERED HIRING INTELLIGENCE</Label>
        </motion.div>

        {/* ── Heading on ONE line ── */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42 }}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "clamp(2.6rem,6.5vw,5.8rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            marginBottom: isMobile ? 18 : 30,
            whiteSpace: isMobile ? "normal" : "nowrap",
            color: "rgba(255,255,255,.95)",
          }}
        >
          Hiring.{" "}
          <span className="gold-shimmer">Re-engineered.</span>
        </motion.h1>

        {/* Description — slightly larger */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.66 }}
          style={{
            color: "rgba(255,255,255,.55)",
            fontSize: "clamp(15px,1.7vw,19px)",
            lineHeight: 1.8,
            marginBottom: isMobile ? 24 : 38,
            maxWidth: 460,
            fontWeight: 400,
          }}
        >
          AI-powered candidate intelligence for modern teams. Automate
          screening, conduct structured interviews, and surface your best
          candidates — without manual effort.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.8 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <motion.a href={WHATSAPP_URL} target="_blank"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            style={{
              background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
              padding: "13px 30px", borderRadius: 12, fontSize: 14, fontWeight: 700,
              color: C.bgDark, textDecoration: "none",
              boxShadow: `0 6px 24px rgba(184,149,90,.3)`
            }}>
            Request Demo
          </motion.a>
        </motion.div>

        {/* Mobile Stats */}
        {isMobile && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
            marginTop: 36
          }}>
            {stats.map(({ val, sub }) => (
              <div key={val} style={{
                background: "linear-gradient(180deg, rgba(6,10,22,.85), rgba(3,6,16,.7))",
                border: "1px solid rgba(184,149,90,.28)",
                borderRadius: 14,
                padding: "14px 12px",
                textAlign: "center",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 24px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.04)"
              }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>{val}</div>
                <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: ".08em", marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        )}
          </div>

          {!isMobile && (
            <div style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 16,
              alignSelf: "center",
              justifySelf: "end",
              transform: "translate(clamp(10px, 1vw, 18px), clamp(18px, 2vh, 28px))"
            }}>
              {stats.map(({ val, sub }) => (
                <motion.div key={val}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  style={{
                    minHeight: 128,
                    background: "linear-gradient(180deg, rgba(6,10,22,.85), rgba(3,6,16,.7))",
                    border: "1px solid rgba(184,149,90,.28)",
                    borderRadius: 18,
                    padding: "18px 16px",
                    backdropFilter: "blur(22px)",
                    boxShadow: "0 12px 36px rgba(0,0,0,.38), inset 0 0 0 1px rgba(255,255,255,.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                  }}>
                  <div style={{ fontSize: "clamp(22px,2.6vw,32px)", fontWeight: 800, color: "#fff", letterSpacing: "-.03em" }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: ".08em", marginTop: 6 }}>{sub}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TICKER
══════════════════════════════════════════════════════════════════════ */
function Ticker() {
  const items = ["AI-Powered Hiring","190+ Countries","92% Accuracy","24/7 AI Interviews","Structured Scoring","Instant Ranking","Bias-Reduced","Global Talent"];
  const doubled = [...items,...items];
  return(
    <div style={{overflow:"hidden",borderTop:"1px solid rgba(184,149,90,.14)",borderBottom:"1px solid rgba(184,149,90,.14)",background:"rgba(3,6,16,.7)",backdropFilter:"blur(20px)",padding:"12px 0",zIndex:10,position:"relative"}}>
      <div style={{display:"flex",animation:"ticker-scroll 24s linear infinite",width:"max-content"}}>
        {doubled.map((t,i)=>(
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:12,padding:"0 28px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.3)",letterSpacing:".14em",whiteSpace:"nowrap"}}>
            <span style={{width:4,height:4,borderRadius:"50%",background:C.gold,boxShadow:`0 0 6px ${C.gold}`,display:"inline-block"}}/>
            {t.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPANIES TRUST MAWAHIB SECTION
   (moved here — ABOVE ProblemSection)
══════════════════════════════════════════════════════════════════════ */
const StarRating=({n=5,size=13})=>(
  <div style={{display:"flex",gap:2}}>
    {[...Array(n)].map((_,i)=>(
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#00b67a">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);
const TrustpilotMark=()=>(
  <svg viewBox="0 0 110 22" style={{height:15,width:"auto",display:"block",flexShrink:0}}>
    <text x="0" y="17" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="17" fill="white" letterSpacing="-0.3">Trustpilot</text>
    <rect x="95" y="2" width="14" height="17" rx="2" fill="#00b67a"/>
    <path d="M102 5.5l1.2 2.4 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="white"/>
  </svg>
);

function ReviewCard({ r }) {
  return(
    <motion.div
      whileHover={{y:-8,scale:1.02,borderColor:"rgba(184,149,90,.3)",boxShadow:"0 20px 60px rgba(0,0,0,.4)"}}
      transition={{duration:.3}}
      style={{
        width:"100%",
        background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",
        borderRadius:18,padding:"clamp(16px,2.2vw,22px)",
        position:"relative",overflow:"hidden",backdropFilter:"blur(12px)",cursor:"default"
      }}>
      <div style={{position:"absolute",top:0,left:"12%",right:"12%",height:1.5,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,boxShadow:`0 0 8px ${C.gold}`}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
        <StarRating n={r.rating} size={11}/>
      </div>
      <p style={{color:"rgba(255,255,255,.45)",fontSize:"clamp(11px,1.05vw,12px)",lineHeight:1.75,marginBottom:14,minHeight:54}}>"{r.text}"</p>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(145deg,${C.gold},${C.goldBright})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:C.bgDark,flexShrink:0}}>
          {r.name.charAt(0)}
        </div>
        <div>
          <p style={{fontWeight:700,fontSize:11,color:"rgba(255,255,255,.7)",lineHeight:1.3}}>{r.name}</p>
          <p style={{fontSize:9,color:"rgba(255,255,255,.28)",lineHeight:1.3}}>{r.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

const ALL_REVIEWS = [
  {name:"Sarah Johnson",role:"HR Director, TechCorp",rating:5,date:"Dec 2024",text:"Mawahib transformed our hiring completely. We cut time-to-hire by 60% and the AI interviews are surprisingly natural."},
  {name:"Michael Chen",role:"Founder, StartupXYZ",rating:5,date:"Jan 2025",text:"We screened 400 applicants in a weekend. The structured scoring model is a game-changer for early-stage hiring."},
  {name:"Emma Williams",role:"Talent Lead, FinanceHub",rating:5,date:"Feb 2025",text:"Finally a hiring platform that delivers on its promises. Our team spends 80% less time on initial screening."},
  {name:"Khalid Al-Rashid",role:"COO, RetailGroup MENA",rating:5,date:"Mar 2025",text:"We hired 12 regional managers across 6 countries. What used to take 3 months took 3 weeks."},
  {name:"Priya Sharma",role:"VP People, FinTech",rating:5,date:"Apr 2025",text:"Bias-reduced scoring gave us confidence our decisions were merit-based. Diversity improved significantly."},
  {name:"James O'Brien",role:"Head of Recruitment",rating:5,date:"May 2025",text:"Mawahib lets us present ranked shortlists same day. Our clients think we're wizards now."},
  {name:"Nour Hassan",role:"CHRO, Logistics Corp",rating:5,date:"Jun 2025",text:"Seamless onboarding, crystal-clear reports, and massive time savings from day one."},
  {name:"David Park",role:"Talent Ops, Series B",rating:5,date:"Jul 2025",text:"The multilingual AI interviewer handled Arabic and English flawlessly. Perfect for MENA."},
  {name:"Layla Ahmed",role:"Recruiting Manager",rating:5,date:"Aug 2025",text:"The auto-ranking feature alone saves us hours every week. Beautiful platform too."},
  {name:"Tom Fischer",role:"CEO, SaaS Company",rating:5,date:"Sep 2025",text:"We scaled from 20 to 80 employees in 6 months. Mawahib was central to our infrastructure."},
];

function CompaniesTrustSection() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const VISIBLE = 4;
  const visibleReviews = ALL_REVIEWS.slice(0, VISIBLE);

  return (
    <section ref={ref} style={{
      position: "relative", zIndex: 10,
      padding: isMobile ? `clamp(30px,6vw,50px) ${PAGE_X.mobile}` : `clamp(50px,7vw,80px) ${PAGE_X.desktop}`,
      background: "rgba(3,6,16,.75)", backdropFilter: "blur(2px)", overflow: "hidden"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: .85 }}
        style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,40px)" }}
      >
        {/* <Label>COMPANIES TRUST MAWAHIB</Label> */}
        <div style={{
          display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 9,
          background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 18, padding: "16px 28px", marginBottom: 24, backdropFilter: "blur(16px)"
        }}>
          <TrustpilotMark/>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <StarRating n={5} size={18}/>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>4.9 / 5</span>
          </div>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,.28)" }}>Rated <strong style={{color:"#00b67a"}}>Excellent</strong> · 200+ verified reviews</p>
        </div>
        <blockquote style={{
          fontFamily: "'DM Serif Display',serif", fontStyle: "italic",
          fontSize: "clamp(2rem,4.8vw,4.4rem)", fontWeight: 400,
          color: "rgba(255,255,255,.92)", lineHeight: 1.08, letterSpacing: "-.02em", marginBottom: 12
        }}>
          "Reduced time-to-hire<br/>by 60%."
        </blockquote>
        <p style={{ color: "rgba(255,255,255,.22)", fontSize: "clamp(11px,1.2vw,12px)", fontWeight: 700, letterSpacing: ".1em" }}>
          HR Director, Global Tech Company
        </p>
      </motion.div>

      {/* 4 cards in a row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(4,1fr)",
        gap: "clamp(12px,1.5vw,18px)",
        maxWidth: 1280, margin: "0 auto",
        marginBottom: 32,
      }}>
        {visibleReviews.map((r, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.7 }}>
            <ReviewCard r={r}/>
          </motion.div>
        ))}
      </div>



      <motion.div
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .7, duration: .7 }}
        style={{ textAlign: "center", marginTop: "clamp(36px,5vw,52px)" }}
      >
        <motion.a href="https://www.trustpilot.com/review/mawahib.ai" target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.04, borderColor: "rgba(0,182,122,.4)" }} whileTap={{ scale: .97 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.6)", textDecoration: "none", backdropFilter: "blur(16px)" }}>
          <TrustpilotMark/>
          <span style={{ height: 14, width: 1, background: "rgba(255,255,255,.1)" }}/>
          Read all reviews
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </motion.a>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PROBLEM SECTION
   Changes: keywords get .keyword-badge style, Label color = C.gold
══════════════════════════════════════════════════════════════════════ */
function ProblemSection() {
  const ref = useRef();
  const inView = useInView(ref,{once:true,amount:.08});
  const { scrollYProgress } = useScroll({target:ref,offset:["start end","end start"]});
  const parallaxY = useTransform(scrollYProgress,[0,1],[50,-50]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const problems = [
    {n:"01",title:"Manual CV Screening",desc:"Recruiters spend 70% of time reading hundreds of applications with no structured framework to surface real signal."},
    {n:"02",title:"Subjective Decisions",desc:"Gut feelings replace structured evaluation. Bias compounds. The best candidate often isn't who you think they are."},
    {n:"03",title:"Slow Interview Cycles",desc:"Scheduling, rescheduling, repetitive questions — a process that should take days stretches into weeks."},
  ];

  return(
    <section ref={ref} style={{position:"relative",zIndex:10,padding: isMobile ? `clamp(30px,6vw,50px) ${PAGE_X.mobile}` : `clamp(50px,7vw,80px) ${PAGE_X.desktop}`,background:"linear-gradient(180deg,rgba(3,6,16,.6) 0%,rgba(10,15,30,.85) 100%)",overflow:"hidden"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(50px,8vw,100px)",alignItems:"center"}} className="two-col">
        {/* Left */}
        <motion.div style={{y:parallaxY,position:"relative"}} initial={{opacity:0,x:-40}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:1,ease:[.16,1,.3,1]}}>

          {/* ── KEYWORD BADGES with special shimmer style ── */}
          <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
            {["Automated","Faster","More Accurate"].map((k,i)=>(
              <motion.span
                key={i}
                className="keyword-badge"
                initial={{ opacity:0, scale:.85 }}
                animate={inView ? { opacity:1, scale:1 } : {}}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.55 }}
                whileHover={{ scale:1.06, y:-2 }}
              >
                <span className="kw-text">{k}</span>
              </motion.span>
            ))}
          </div>

          <div style={{borderRadius:24,overflow:"hidden",aspectRatio:"3/4",boxShadow:"0 40px 100px rgba(0,0,0,.6)",border:"1px solid rgba(255,255,255,.06)",position:"relative"}}>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=90"
              alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.7) saturate(.7)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,transparent 45%,rgba(3,6,16,.9) 100%)"}}/>
            {!isMobile && (
              <motion.div
                initial={{opacity:0,scale:.8}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.6,duration:.7}}
                style={{
                  position:"absolute", bottom:"clamp(14px,3vw,26px)", right:"clamp(14px,3vw,26px)",
                  background:"rgba(3,6,16,.9)", border:"1px solid rgba(184,149,90,.34)",
                  borderRadius:16, padding:"16px 20px", minWidth:200, backdropFilter:"blur(24px)",
                  boxShadow:"0 20px 60px rgba(0,0,0,.45)", animation:"glow-pulse 3s ease-in-out infinite"
                }}>
                <div style={{fontSize:34,fontWeight:800,color:"#fff",letterSpacing:"-.05em",lineHeight:1}}>70%</div>
                <div style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:".1em",marginTop:6,whiteSpace:"nowrap"}}>TIME WASTED ON CVs</div>
              </motion.div>
            )}
          </div>
          {isMobile && (
            <motion.div
              initial={{opacity:0,y:14}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.55,duration:.65}}
              style={{marginTop:12,background:"linear-gradient(135deg,rgba(3,6,16,.95),rgba(9,15,28,.92))",border:"1px solid rgba(184,149,90,.34)",borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,boxShadow:"0 14px 36px rgba(0,0,0,.35)"}}>
              <div style={{fontSize:32,fontWeight:800,color:"#fff",letterSpacing:"-.04em",lineHeight:1}}>70%</div>
              <div style={{fontSize:11,color:C.gold,fontWeight:800,letterSpacing:".1em",textAlign:"right",whiteSpace:"nowrap"}}>TIME WASTED ON CVs</div>
            </motion.div>
          )}
          <div style={{position:"absolute",inset:"-10%",background:"radial-gradient(ellipse,rgba(184,149,90,.06) 0%,transparent 60%)",zIndex:-1,pointerEvents:"none"}}/>
        </motion.div>

        {/* Right: problems — Label color = C.gold */}
        <motion.div initial={{opacity:0,x:40}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.9,delay:.15,ease:[.16,1,.3,1]}}>
          {/* ── Label color changed to C.gold ── */}
          <Label color={C.gold} bg={C.goldPale} border={C.goldBorder}>THE PROBLEM</Label>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2.4rem,4.5vw,4.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.08,color:"rgba(255,255,255,.95)",marginBottom:18}}>
            Hiring Today is a <span className="gold-shimmer">Challenge.</span>
          </h2>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:"clamp(14px,1.5vw,16px)",lineHeight:1.85,marginBottom:44}}>
            Most companies rely on manual reviews, subjective opinions, and fragmented processes. The cost isn't just efficiency — it's the best candidates slipping through.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {problems.map((p,i)=>(
              <motion.div key={i}
                initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.35+i*.15,duration:.65}}
                whileHover={{x:6,background:"rgba(184,149,90,.04)"}}
                style={{padding:"20px 0",borderBottom:"1px solid rgba(255,255,255,.05)",cursor:"default",transition:"all .3s",borderRadius:8,paddingInline:12}}>
                <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <span style={{fontSize:10,color:C.gold,fontWeight:800,letterSpacing:".08em",minWidth:22,paddingTop:2}}>{p.n}</span>
                  <div>
                    <h3 style={{fontSize:"clamp(14px,1.5vw,16px)",fontWeight:700,color:"rgba(255,255,255,.85)",marginBottom:7}}>{p.title}</h3>
                    <p style={{color:"rgba(255,255,255,.38)",fontSize:"clamp(12px,1.2vw,13px)",lineHeight:1.78}}>{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   GLOBAL REACH SECTION
══════════════════════════════════════════════════════════════════════ */
function GlobalSection() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const stats = [
    { val: 190, s: "+", lbl: "Countries" },
    { val: 92, s: "%", lbl: "AI Accuracy" },
    { val: 10, s: "×", lbl: "Faster Hiring" },
    { val: 400, s: "+", lbl: "Clients" }
  ];

  return (
    <section ref={ref} style={{
      position: "relative", zIndex: 10,
      padding: isMobile ? `clamp(30px,6vw,50px) ${PAGE_X.mobile}` : `clamp(50px,7vw,80px) ${PAGE_X.desktop}`,
      background: "linear-gradient(180deg,rgba(10,15,30,.85) 0%,rgba(3,6,16,.6) 100%)", overflow: "hidden"
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: "clamp(60px,8vw,100px)", alignItems: "center"
      }}>
        <motion.div style={{ y: textY }}
          initial={{ opacity: 0, x: -60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <Label>GLOBAL REACH</Label>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontStyle: "italic",
            fontSize: "clamp(2.4rem,6vw,4.5rem)", fontWeight: 400, letterSpacing: "-.02em",
            lineHeight: 1.08, color: "rgba(255,255,255,.95)", marginBottom: 22
          }}>
            Global Talent.<br/><span className="gold-shimmer">Structured Insight.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.9, marginBottom: 50, maxWidth: 520 }}>
            Mawahib evaluates, ranks, and presents the best candidates in minutes — not weeks. Every decision backed by structured AI data.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
            gap: 20, marginBottom: isMobile ? 60 : 0
          }}>
            {stats.map((s, i) => (
              <motion.div key={s.lbl}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.25 + i * 0.12, duration: 0.8, type: "spring", stiffness: 120 }}
                whileHover={{ scale: 1.08, y: -6 }}
                style={{
                  position: "relative", padding: "24px 16px", borderRadius: 18,
                  background: "linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",
                  border: "1px solid rgba(184,149,90,.18)", textAlign: "center",
                  backdropFilter: "blur(18px)", overflow: "hidden", cursor: "default",
                  boxShadow: "0 10px 40px rgba(0,0,0,.4)"
                }}>
                <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", inset: "-30%", background: "radial-gradient(circle, rgba(184,149,90,.15) 0%, transparent 60%)", zIndex: 0 }}/>
                <div style={{ position: "relative", zIndex: 2, fontSize: "clamp(22px,4vw,30px)", fontWeight: 800, letterSpacing: "-.04em", color: "#fff", marginBottom: 6 }}>
                  <AnimCount val={s.val} suffix={s.s}/>
                </div>
                <div style={{ position: "relative", zIndex: 2, fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: ".08em" }}>{s.lbl}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : 60, y: isMobile ? 40 : 0 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: 1 }}
          style={{ position: "relative", width: "100%" }}>
          <div style={{
            borderRadius: 28, overflow: "hidden",
            aspectRatio: isMobile ? "4/3" : "4/5",
            boxShadow: "0 50px 120px rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.06)"
          }}>
            <img src="./hiring.jpeg"
              alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.75) saturate(.75)" }}/>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   VIDEO SECTION
   "See How It Works" now links to /how-mawahib-works
══════════════════════════════════════════════════════════════════════ */
function VideoSection() {
  const ref = useRef();
  const videoRef = useRef();
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.93, 1, 1, 0.93]);
  const [muted, setMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (inView) {
      video.muted = false;
      video.play().catch(() => { video.muted = true; setMuted(true); video.play().catch(() => {}); });
    } else { video.pause(); }
  }, [inView]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section ref={ref} style={{
      position: "relative", zIndex: 10,
      padding: isMobile ? `clamp(30px,6vw,50px) ${PAGE_X.mobile}` : `clamp(50px,7vw,80px) ${PAGE_X.desktop}`,
      background: "rgba(3,6,16,.72)", backdropFilter: "blur(2px)"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 44 }}>
          <Label>AI AVATAR IN ACTION</Label>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontStyle: "italic",
            fontSize: "clamp(2.4rem,4.5vw,4.2rem)", fontWeight: 400, letterSpacing: "-.02em",
            lineHeight: 1.08, color: "rgba(255,255,255,.95)", marginBottom: 14
          }}>
            Interviews that <span className="gold-shimmer">scale with you.</span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ background: "rgba(3,6,16,.9)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 9, padding: "6px 13px", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulse-dot 1.8s ease-in-out infinite" }}/>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#93c5fd", letterSpacing: ".1em" }}>AI INTERVIEW LIVE</span>
          </div>
          <button onClick={toggleMute} style={{ background: "rgba(3,6,16,.9)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 9, padding: "6px 13px", fontSize: 10, fontWeight: 700, color: "#94a3b8", cursor: "pointer" }}>
            {muted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
        </div>

        <motion.div style={{ scale }} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.14 }}>
          <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.06)" }}>
            <video ref={videoRef} src="./videos/IMG_2900.MOV" loop playsInline
              style={{ width: "100%", display: "block" }}
              poster="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1400&q=90"/>
          </div>
        </motion.div>

        {/* ── "See How It Works" → links to /how-mawahib-works ── */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ display: "inline-block" }}>
            <Link to="/how-mawahib-works" style={{
              display: "inline-block",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.12)",
              padding: "13px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600,
              color: "rgba(255,255,255,.7)", textDecoration: "none"
            }}>
              See How It Works ↓
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   INTERVIEW SECTION
══════════════════════════════════════════════════════════════════════ */
function InterviewSection() {
  const ref = useRef();
  const inView = useInView(ref,{once:true,amount:.08});
  const { scrollYProgress } = useScroll({target:ref,offset:["start end","end start"]});
  const imgY = useTransform(scrollYProgress,[0,1],[40,-40]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const features=[
    {lbl:"24/7 AI Interviews",val:98,desc:"Available around the clock. No scheduling required."},
    {lbl:"Structured Scoring",val:92,desc:"Every answer evaluated against a consistent rubric."},
    {lbl:"Auto Ranking",val:88,desc:"Candidates ranked by fit, not impression."},
  ];
  return(
    <section ref={ref} style={{position:"relative",zIndex:10,padding: isMobile ? `clamp(30px,6vw,50px) ${PAGE_X.mobile}` : `clamp(50px,7vw,80px) ${PAGE_X.desktop}`,background:"linear-gradient(180deg,rgba(3,6,16,.6) 0%,rgba(10,15,30,.9) 100%)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(50px,8vw,100px)",alignItems:"center"}} className="two-col">
        <motion.div style={{y:imgY,position:"relative"}} initial={{opacity:0,scale:.94}} animate={inView?{opacity:1,scale:1}:{}} transition={{duration:1,ease:[.16,1,.3,1]}}>
          <div style={{borderRadius:24,overflow:"hidden",aspectRatio:"3/4",boxShadow:"0 40px 100px rgba(0,0,0,.55)",border:"1px solid rgba(255,255,255,.06)",position:"relative"}}>
            <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=90"
              alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.7) saturate(.65)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(3,6,16,.95) 100%)"}}/>
            <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.65,duration:.7}}
              style={{position:"absolute",bottom:18,left:18,right:18,background:"rgba(3,6,16,.9)",border:"1px solid rgba(184,149,90,.2)",borderRadius:16,padding:"16px 18px",backdropFilter:"blur(20px)"}}>
              <div style={{fontSize:9,color:C.gold,fontWeight:800,letterSpacing:".14em",marginBottom:12}}>CANDIDATE EVALUATION</div>
              {[["Technical Skills",92],["Communication",87],["Culture Fit",94]].map(([k,v])=>(
                <div key={k} style={{marginBottom:9}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>{k}</span>
                    <span style={{fontSize:11,fontWeight:700,color:C.gold}}>{v}%</span>
                  </div>
                  <div style={{height:2,background:"rgba(255,255,255,.08)",borderRadius:1}}>
                    <motion.div initial={{width:"0%"}} animate={inView?{width:`${v}%`}:{}} transition={{delay:.9,duration:1.2,ease:[.16,1,.3,1]}}
                      style={{height:"100%",background:`linear-gradient(90deg,${C.gold},${C.goldBright})`,borderRadius:1,boxShadow:`0 0 6px ${C.gold}`}}/>
                  </div>
                </div>
              ))}
              <div style={{paddingTop:10,borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>Overall Score</span>
                <span style={{fontSize:16,fontWeight:800,color:"#fff"}}>91 / 100</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,x:40}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.95,delay:.12,ease:[.16,1,.3,1]}}>
          <Label>AI INTERVIEW SYSTEM</Label>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2.4rem,4.5vw,4.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.08,color:"rgba(255,255,255,.95)",marginBottom:18}}>
            Interviews that <span className="gold-shimmer" style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic"}}>scale with you.</span>
          </h2>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:"clamp(14px,1.5vw,16px)",lineHeight:1.85,marginBottom:38}}>
            Candidates complete structured voice interviews with an AI avatar — anytime, from anywhere.
          </p>
          {features.map((f,i)=>(
            <motion.div key={f.lbl}
              initial={{opacity:0,y:14}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.3+i*.14,duration:.65}}
              style={{padding:"20px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,.82)"}}>{f.lbl}</span>
                <span style={{fontSize:12,color:C.gold,fontWeight:700}}>{f.val}%</span>
              </div>
              <p style={{color:"rgba(255,255,255,.35)",fontSize:"clamp(12px,1.2vw,13px)",lineHeight:1.75,marginBottom:10}}>{f.desc}</p>
              <div style={{height:2,background:"rgba(255,255,255,.07)",borderRadius:1}}>
                <motion.div initial={{width:"0%"}} animate={inView?{width:`${f.val}%`}:{}} transition={{delay:.55+i*.14,duration:1.3,ease:[.16,1,.3,1]}}
                  style={{height:"100%",background:`linear-gradient(90deg,${C.gold},${C.goldBright})`,borderRadius:1,boxShadow:`0 0 6px ${C.gold}`}}/>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FEATURES SECTION
══════════════════════════════════════════════════════════════════════ */
function FeatureCard({ f, i }) {
  const ref = useRef();
  const inView = useInView(ref,{once:true,amount:.1});
  return(
    <motion.div ref={ref}
      initial={{opacity:0,y:28,scale:.96}} animate={inView?{opacity:1,y:0,scale:1}:{}}
      transition={{duration:.7,delay:f.delay,ease:[.16,1,.3,1]}}>
      <motion.div
        whileHover={{y:-6,borderColor:"rgba(184,149,90,.4)",background:"rgba(184,149,90,.06)",boxShadow:`0 20px 60px rgba(0,0,0,.4),0 0 40px rgba(184,149,90,.08)`}}
        transition={{duration:.3}}
        style={{position:"relative",borderRadius:18,padding:"clamp(22px,3vw,32px)",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",overflow:"hidden",backdropFilter:"blur(12px)",cursor:"default"}}>
        <div style={{position:"absolute",top:0,left:"15%",right:"15%",height:2,background:`linear-gradient(90deg,transparent,${C.gold},${C.goldBright},transparent)`,boxShadow:`0 0 10px ${C.gold}`}}/>
        <div style={{fontSize:10,color:"rgba(184,149,90,.5)",fontWeight:800,letterSpacing:".1em",marginBottom:14}}>0{i+1}</div>
        <h3 style={{fontSize:"clamp(14px,1.5vw,16px)",fontWeight:700,color:"rgba(255,255,255,.85)",marginBottom:10,letterSpacing:"-.02em"}}>{f.title}</h3>
        <p style={{fontSize:"clamp(12px,1.2vw,13px)",color:"rgba(255,255,255,.32)",lineHeight:1.8}}>{f.desc}</p>
      </motion.div>
    </motion.div>
  );
}

function FeaturesSection() {
  const ref = useRef();
  const inView = useInView(ref,{once:true,amount:.06});
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const features=[
    {title:"AI Candidate Matching",desc:"Neural matching across skills, culture fit, and growth trajectory.",delay:0},
    {title:"Automated Screening",desc:"AI-powered async interviews that screen hundreds simultaneously.",delay:.07},
    {title:"Global Talent Intelligence",desc:"Real-time market data across 190+ countries.",delay:.14},
    {title:"Bias-Reduced Evaluation",desc:"Structured rubrics ensure every candidate is assessed on merit.",delay:.21},
    {title:"Interview Intelligence",desc:"Transcription, sentiment analysis, and scoring in one dataset.",delay:.28},
    {title:"Workforce Analytics",desc:"Hiring funnel metrics, diversity dashboards, predictive retention.",delay:.35},
  ];
  return(
    <section ref={ref} style={{position:"relative",zIndex:10,padding: isMobile ? `clamp(30px,6vw,50px) ${PAGE_X.mobile}` : `clamp(50px,7vw,80px) ${PAGE_X.desktop}`,background:"rgba(10,15,30,.8)",backdropFilter:"blur(2px)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.8}} style={{textAlign:"center",marginBottom:"clamp(28px,4vw,44px)"}}>
          <Label>PLATFORM FEATURES</Label>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2.4rem,4.5vw,4.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.08,color:"rgba(255,255,255,.95)",marginBottom:14}}>
            Everything you need to hire<br/><span className="gold-shimmer" style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic"}}>with confidence.</span>
          </h2>
        </motion.div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"clamp(10px,1.6vw,18px)"}} className="feat-grid">
          {features.map((f,i)=><FeatureCard key={f.title} f={f} i={i}/>)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({target:ref,offset:["start end","end start"]});
  const scale = useTransform(scrollYProgress,[0,.5],[.94,1]);
  const opacity = useTransform(scrollYProgress,[0,.25],[0,1]);
  const inView = useInView(ref,{once:true,amount:.1});
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return(
    <section ref={ref} style={{position:"relative",zIndex:10,padding: isMobile ? `clamp(30px,6vw,50px) ${PAGE_X.mobile}` : `clamp(60px,8vw,90px) ${PAGE_X.desktop}`,background:"rgba(3,6,16,.88)",backdropFilter:"blur(4px)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:"5%",right:"5%",height:1,background:`linear-gradient(90deg,transparent,${C.gold},${C.goldBright},transparent)`,boxShadow:`0 0 20px ${C.gold}`}}/>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"70vw",height:"70vw",maxWidth:700,maxHeight:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(184,149,90,.055) 0%,transparent 60%)",pointerEvents:"none"}}/>
      <motion.div style={{scale,opacity,maxWidth:700,margin:"0 auto",textAlign:"center",position:"relative",zIndex:5}}>
        <Label>NOW ACCEPTING TEAMS</Label>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(3rem,6.5vw,6.5rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.04,color:"rgba(255,255,255,.95)",marginBottom:6}}>
          Start hiring
        </h2>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(3rem,6.5vw,6.5rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.04,marginBottom:30}}>
          <span className="gold-shimmer" style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic"}}>smarter.</span>
        </h2>
        <p style={{color:"rgba(255,255,255,.32)",fontSize:"clamp(15px,1.7vw,18px)",lineHeight:1.78,maxWidth:460,margin:"0 auto clamp(32px,5vw,48px)"}}>
          Join thousands of teams using Mawahib to transform their hiring. Simple setup. Real results.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <motion.a href={WHATSAPP_URL} target="_blank"
            whileHover={{scale:1.05,boxShadow:`0 16px 50px rgba(184,149,90,.5)`}} whileTap={{scale:.96}}
            style={{background:`linear-gradient(135deg,${C.gold},${C.goldBright})`,borderRadius:14,padding:"14px clamp(26px,3.5vw,40px)",fontSize:"clamp(14px,1.4vw,16px)",fontWeight:700,color:C.bgDark,textDecoration:"none",boxShadow:`0 8px 30px rgba(184,149,90,.35)`}}>
            Request Demo
          </motion.a>
          <motion.a href={WHATSAPP_URL} target="_blank"
            whileHover={{scale:1.05,borderColor:"rgba(255,255,255,.22)"}} whileTap={{scale:.96}}
            style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.12)",borderRadius:14,padding:"14px clamp(24px,3vw,36px)",fontSize:"clamp(14px,1.4vw,16px)",fontWeight:600,color:"rgba(255,255,255,.42)",textDecoration:"none"}}>
            Contact Sales
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════════ */
function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const sections = [
    ["Product", ["Pricing"]],
    ["Company", ["About"]],
    ["Legal", ["Privacy"]]
  ];
  return (
    <footer style={{
      position: "relative", zIndex: 10,
      background: "rgba(2,4,12,.95)",
      padding: isMobile ? `clamp(24px,4vw,36px) ${PAGE_X.mobile} clamp(18px,3vw,24px)` : `clamp(36px,5vw,50px) ${PAGE_X.desktop} clamp(24px,3vw,36px)`,
      borderTop: "1px solid rgba(184,149,90,.1)"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "auto 1fr",
          gap: isMobile ? 50 : 80, marginBottom: "clamp(40px,6vw,60px)"
        }}>
          <div style={{ maxWidth: isMobile ? "100%" : 240, textAlign: isMobile ? "center" : "left", margin: isMobile ? "0 auto" : 0 }}>
            <div style={{ display: "flex", justifyContent: isMobile ? "center" : "flex-start", marginBottom: 16 }}>
              <MawahibLogo height={180} blend={false}/>
            </div>
            <p style={{ color: "rgba(255,255,255,.25)", fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
              AI-powered hiring intelligence for modern recruitment teams worldwide.
            </p>
            <a href="https://www.trustpilot.com/review/mawahib.ai" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "8px 14px" }}>
              <TrustpilotMark/>
              <div style={{ display: "flex", gap: 1 }}>
                {[...Array(5)].map((_,i) => <svg key={i} width={10} height={10} viewBox="0 0 24 24" fill="#00b67a"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>4.9/5</span>
            </a>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(3,auto)",
            gap: isMobile ? 40 : 80, justifyContent: isMobile ? "center" : "flex-end"
          }}>
            {sections.map(([sect, items]) => (
              <div key={sect}>
                <p style={{ fontSize: 10, fontWeight: 800, color: C.gold, letterSpacing: ".15em", marginBottom: 16, textTransform: "uppercase" }}>{sect}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((item) => {
                    const paths = { Pricing: "/pricing", About: "/about", Privacy: "/privacy" };
                    return paths[item] ? (
                      <motion.div key={item} whileHover={{ color: "rgba(255,255,255,.7)", x: 4 }} transition={{ duration: 0.25 }}>
                        <Link to={paths[item]} style={{ color: "rgba(255,255,255,.3)", fontSize: 14, textDecoration: "none" }}>{item}</Link>
                      </motion.div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          marginTop: isMobile ? 0 : -20,
          marginBottom: 30,
          textAlign: isMobile ? "center" : "right"
        }}>
          <a href="mailto:info@mawahib.ai" style={{
            color: "rgba(255,255,255,.3)",
            fontSize: 14,
            textDecoration: "none",
            transition: "color .25s"
          }}
          onMouseOver={(e) => e.target.style.color = "rgba(255,255,255,.7)"}
          onMouseOut={(e) => e.target.style.color = "rgba(255,255,255,.3)"}
          >
            info@mawahib.ai
          </a>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 22,
          display: "flex", flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", alignItems: "center",
          gap: 16, textAlign: isMobile ? "center" : "left"
        }}>
          <p style={{ color: "rgba(255,255,255,.18)", fontSize: 12 }}>© 2026 Mawahib LLC. All rights reserved.</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {["AI-Powered", "SOC 2 Type II", "GDPR Ready"].map((b) => (
              <span key={b} style={{ fontSize: 11, color: "rgba(255,255,255,.22)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9999, padding: "5px 12px", letterSpacing: ".05em" }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT APP
   Section order:
   1. HeroSection
   2. Ticker
   — CTA Strip 0 —
   3. CompaniesTrustSection  ← moved above ProblemSection
   4. ProblemSection
   — CTA Strip 1 —
   5. GlobalSection
   6. VideoSection
   — CTA Strip 2 —
   7. InterviewSection
   8. FeaturesSection
   — CTA Strip 3 —
   9. CTASection
══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  function AppChrome() {
    const { pathname } = useLocation();
    if (pathname === "/resume" || pathname === "/interview") return null;
    return <Nav />;
  }

  return (
    <Router>
      <FontLink/>
      <GlobalStyles/>
      <GlobeBackground/>
      <ScrollToTop/>
      <PageLoader onDone={handleDone}/>
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: .5 }}
        style={{ position: "relative", zIndex: 10 }}>
        <ScrollProgress/>
        <AppChrome/>
        <Routes>
          <Route path="/" element={
            <main>
              <HeroSection/>
              <Ticker/>

              {/* ── CTA 0 ── */}
              <CTAStrip variant={0}/>

              <CompanyTrustSection/>
              <CompaniesTrustSection/>

              {/* ── CTA 1 ── */}
              <CTAStrip variant={1}/>

              <ProblemSection/>
              <GlobalSection/>

              {/* ── CTA 2 ── */}
              <CTAStrip variant={2}/>

              <VideoSection/>
              <InterviewSection/>

              {/* ── CTA 3 ── */}
              <CTAStrip variant={0}/>

              <FeaturesSection/>
              <CTASection/>
            </main>
          }/>
          <Route path="/pricing" element={<Pricing/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/privacy" element={<Privacy/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/> 
          <Route path="/resume" element={<CVResults/>}/>
          <Route path="/interview" element={<Interview/>}/>
          <Route path="/how-mawahib-works" element={<HowItWorks/>}/>
        </Routes>
        <Footer/>
      </motion.div>
    </Router>
  );
}

