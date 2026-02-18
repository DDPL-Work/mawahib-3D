import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, animate, useMotionValue } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Logo from "./public/logo-m.png";
// ─── FONTS ───────────────────────────────────────────────────────────────────
const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap"
      rel="stylesheet"
    />
  </>
);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #020617;
      color: #fff;
      font-family: 'Sora', sans-serif;
      overflow-x: hidden;
      cursor: none;
    }
    a, button { cursor: none; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #020617; }
    ::-webkit-scrollbar-thumb { background: #1d4ed8; border-radius: 4px; }

    /* ── Hero orbit pulse ── */
    @keyframes pulse-ring {
      0%   { transform: scale(0.95); opacity: 0.5; }
      100% { transform: scale(1.05); opacity: 0; }
    }
    .pulse-ring::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 9999px;
      border: 1px solid #3b82f6;
      animation: pulse-ring 2s ease-out infinite;
    }

    /* ── Shimmer gradient text ── */
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    .shimmer-text {
      background: linear-gradient(90deg, #60a5fa, #e0f2fe, #3b82f6, #bfdbfe, #60a5fa);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 5s linear infinite;
    }

    /* ── Grid background ── */
    .grid-bg {
      background-image:
        linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
      background-size: 64px 64px;
    }

    /* ── Film-grain overlay ── */
    .noise-overlay {
      position: fixed; inset: 0; pointer-events: none; z-index: 998; opacity: 0.018;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-size: 128px;
    }

    /* ── Avatar section keyframes ── */
    @keyframes float-chip {
      0%,100% { transform: translateY(0) rotate(-2deg); }
      50%      { transform: translateY(-10px) rotate(2deg); }
    }
    @keyframes wave-eq {
      0%,100% { height: 8px; }
      25%     { height: 22px; }
      50%     { height: 14px; }
      75%     { height: 28px; }
    }
  `}</style>
);

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const posX = useRef(0), posY = useRef(0);
  const ringX = useRef(0), ringY = useRef(0);
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      posX.current = e.clientX; posY.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };
    const loop = () => {
      ringX.current += (posX.current - ringX.current) * 0.1;
      ringY.current += (posY.current - ringY.current) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX.current}px`;
        ringRef.current.style.top  = `${ringY.current}px`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    const handleOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor="hover"]');
      if (el && ringRef.current && dotRef.current) {
        isHovering.current = true;
        ringRef.current.style.width       = "52px";
        ringRef.current.style.height      = "52px";
        ringRef.current.style.borderColor = "rgba(96,165,250,0.75)";
        ringRef.current.style.background  = "rgba(59,130,246,0.07)";
        dotRef.current.style.opacity      = "0";
      }
    };
    const handleOut = () => {
      isHovering.current = false;
      if (ringRef.current && dotRef.current) {
        ringRef.current.style.width       = "36px";
        ringRef.current.style.height      = "36px";
        ringRef.current.style.borderColor = "rgba(59,130,246,0.45)";
        ringRef.current.style.background  = "transparent";
        dotRef.current.style.opacity      = "1";
      }
    };
    const handleDown = () => {
      isClicking.current = true;
      if (ringRef.current) ringRef.current.style.transform = "translate(-50%,-50%) scale(0.85)";
    };
    const handleUp = () => {
      isClicking.current = false;
      if (ringRef.current) ringRef.current.style.transform = "translate(-50%,-50%) scale(1)";
    };
    window.addEventListener("mousemove",  move);
    window.addEventListener("mouseover",  handleOver);
    window.addEventListener("mouseout",   handleOut);
    window.addEventListener("mousedown",  handleDown);
    window.addEventListener("mouseup",    handleUp);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove",  move);
      window.removeEventListener("mouseover",  handleOver);
      window.removeEventListener("mouseout",   handleOut);
      window.removeEventListener("mousedown",  handleDown);
      window.removeEventListener("mouseup",    handleUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: 36, height: 36, borderRadius: "50%",
        border: "1px solid rgba(59,130,246,0.45)", background: "transparent",
        transform: "translate(-50%,-50%)",
        transition: "width .3s ease, height .3s ease, border-color .3s ease, background .3s ease, transform .15s ease",
        left: 0, top: 0,
      }} />
      <div ref={dotRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: 5, height: 5, borderRadius: "50%",
        background: "#60a5fa", transform: "translate(-50%,-50%)",
        boxShadow: "0 0 10px rgba(96,165,250,0.9)",
        transition: "opacity .25s ease", left: 0, top: 0,
      }} />
    </>
  );
}

// ─── SCROLL PROGRESS BAR ─────────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 1000,
      background: "linear-gradient(90deg, #1d4ed8, #60a5fa, #818cf8)",
      transformOrigin: "left", scaleX,
      boxShadow: "0 0 14px rgba(59,130,246,0.7)",
    }} />
  );
}

// ─── YOUR APRIORA HERO (unchanged) ───────────────────────────────────────────
const candidates = [
  { id: 1, img: "https://i.pravatar.cc/150?u=1", r: 210, s: 28, d: 0 },
  { id: 2, img: "https://i.pravatar.cc/150?u=2", r: 210, s: 28, d: -8 },
  { id: 3, img: "https://i.pravatar.cc/150?u=3", r: 295, s: 38, d: -5 },
  { id: 4, img: "https://i.pravatar.cc/150?u=4", r: 295, s: 38, d: -22 },
  { id: 5, img: "https://i.pravatar.cc/150?u=5", r: 385, s: 48, d: -12 },
  { id: 6, img: "https://i.pravatar.cc/150?u=6", r: 385, s: 48, d: -35 },
  { id: 7, img: "https://i.pravatar.cc/150?u=7", r: 210, s: 28, d: -18 },
  { id: 8, img: "https://i.pravatar.cc/150?u=8", r: 385, s: 48, d: -4 },
];

function AprioraHero() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y           = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div ref={ref} className="relative min-h-screen w-full bg-[#020617] text-white overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(29,78,216,0.08) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" />

      {/* Orbital system */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute rounded-full" style={{ width: 360, height: 360, background: "radial-gradient(circle, rgba(29,78,216,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        {[210, 295, 385].map((r, i) => (
          <motion.div key={r} className="absolute rounded-full"
            style={{ width: r * 2, height: r * 2, border: `1px solid rgba(59,130,246,${0.12 - i * 0.03})` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 120 + i * 40, repeat: Infinity, ease: "linear" }}
          />
        ))}
        {candidates.map((p) => (
          <motion.div key={p.id} className="absolute" style={{ width: p.r * 2, height: p.r * 2 }}
            animate={{ rotate: 360 }} transition={{ duration: p.s, repeat: Infinity, ease: "linear", delay: p.d }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -top-7">
              <motion.div animate={{ rotate: -360 }} transition={{ duration: p.s, repeat: Infinity, ease: "linear", delay: p.d }}
                className="relative pulse-ring"
                style={{ padding: 2, borderRadius: "9999px", background: "linear-gradient(135deg, rgba(59,130,246,0.8), transparent)" }}
              >
                <div style={{ borderRadius: "9999px", border: "2px solid #020617", overflow: "hidden", width: 44, height: 44, background: "#0f172a" }}>
                  <img src={p.img} alt="candidate" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div style={{ y, opacity: heroOpacity }}
        className="relative z-10 text-center flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
          style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 8, borderRadius: 9999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", padding: "6px 18px", fontSize: 11, letterSpacing: "0.08em" }}
        >
          <span style={{ color: "#94a3b8" }}>Backed by</span>
          <span style={{ fontWeight: 700, color: "#ff6600", borderBottom: "1px solid #ff6600" }}>Y Combinator</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 24, padding: "0 24px" }}
        >
          Hire the best<br />
          <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", fontWeight: 400, opacity: 0.75 }}>candidates</span>{" "}
          <span className="shimmer-text">faster⁺</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          style={{ color: "#94a3b8", fontSize: "clamp(15px, 2vw, 18px)", maxWidth: 520, marginBottom: 44, lineHeight: 1.7, padding: "0 24px" }}
        >
          Reduce recruiting overhead, interview more candidates, and make better hiring decisions with Apriora AI.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }}
          style={{ display: "flex", alignItems: "center", gap: 8, width: "calc(100% - 48px)", maxWidth: 440, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: 6, backdropFilter: "blur(20px)" }}
        >
          <input type="email" placeholder="Enter your work email"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "10px 16px", fontSize: 14, color: "#e2e8f0", fontFamily: "'Sora', sans-serif" }}
          />
          <motion.button whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59,130,246,0.45)" }} whileTap={{ scale: 0.97 }}
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 12, padding: "10px 24px", fontSize: 14, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", fontFamily: "'Sora', sans-serif", boxShadow: "0 4px 20px rgba(29,78,216,0.35)", letterSpacing: "-0.01em" }}
          >
            Get Started →
          </motion.button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.8 }}
          style={{ color: "#475569", fontSize: 12, marginTop: 16, letterSpacing: "0.02em" }}
        >
          No credit card required · Free 14-day trial
        </motion.p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}
        style={{ position: "absolute", bottom: 32, left: 32, zIndex: 20 }}
      >
        <motion.button whileHover={{ borderColor: "rgba(59,130,246,0.5)", background: "rgba(29,78,216,0.15)", scale: 1.04 }}
          style={{ background: "rgba(29,78,216,0.08)", border: "1px solid rgba(59,130,246,0.2)", padding: "8px 20px", borderRadius: 9999, fontSize: 11, fontWeight: 600, color: "#94a3b8", backdropFilter: "blur(20px)", fontFamily: "'Sora', sans-serif", letterSpacing: "0.04em" }}
        >
          WATCH DEMO ↗
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}
        style={{ position: "absolute", bottom: 36, right: "50%", transform: "translateX(50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
      >
        <span style={{ fontSize: 10, color: "#334155", letterSpacing: "0.1em" }}>SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 24, background: "linear-gradient(to bottom, #1d4ed8, transparent)" }}
        />
      </motion.div>
    </div>
  );
}

// ─── YOUR TALENT GLOBE (unchanged) ───────────────────────────────────────────
function GlobeParticles() {
  const meshRef = useRef();
  const { positions, colors } = (() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r     = 2 + Math.random() * 0.04;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.cos(phi);
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
      const t    = Math.random();
      col[i*3]   = 0.2 + t * 0.3;
      col[i*3+1] = 0.4 + t * 0.4;
      col[i*3+2] = 0.9 + t * 0.1;
    }
    return { positions: pos, colors: col };
  })();

  const arcPositions = (() => {
    const arcs = [];
    for (let i = 0; i < 12; i++) {
      const p1  = new THREE.Vector3(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2).normalize().multiplyScalar(2);
      const p2  = new THREE.Vector3(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2).normalize().multiplyScalar(2);
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(2.6);
      arcs.push(new THREE.QuadraticBezierCurve3(p1, mid, p2).getPoints(40));
    }
    return arcs;
  })();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.07;
      meshRef.current.rotation.x = Math.sin(t * 0.04) * 0.08;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh><sphereGeometry args={[1.97, 32, 32]} /><meshBasicMaterial color="#1d4ed8" wireframe transparent opacity={0.03} /></mesh>
      <mesh><sphereGeometry args={[2.12, 32, 32]} /><meshBasicMaterial color="#1e40af" transparent opacity={0.04} side={THREE.BackSide} /></mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} vertexColors transparent opacity={0.7} sizeAttenuation />
      </points>
      {arcPositions.map((pts, i) => {
        const arcPos = new Float32Array(pts.length * 3);
        pts.forEach((p, j) => { arcPos[j*3]=p.x; arcPos[j*3+1]=p.y; arcPos[j*3+2]=p.z; });
        return (
          <line key={i}>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[arcPos, 3]} /></bufferGeometry>
            <lineBasicMaterial color="#3b82f6" transparent opacity={0.12} />
          </line>
        );
      })}
      {Array.from({ length: 18 }).map((_, i) => {
        const phi   = Math.acos(2 * (i / 18) - 1);
        const theta = (i / 18) * Math.PI * 2 * 3.7;
        const r     = 2;
        return (
          <mesh key={i} position={[r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta)]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

function GlobeScene({ scrollY }) {
  const { camera } = useThree();
  const progress = useRef(0);
  useFrame(() => {
    progress.current += (scrollY.current - progress.current) * 0.05;
    const p = Math.min(progress.current, 1);
    camera.position.x = Math.sin(p * 0.8) * 3;
    camera.position.y = p * 1.2 - 0.5;
    camera.position.z = 7 - p * 2;
    camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]}   intensity={1.2} color="#3b82f6" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#1d4ed8" />
      <GlobeParticles />
    </>
  );
}

function GlobeSection() {
  const sectionRef    = useRef();
  const scrollProgress = useRef(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  useEffect(() => scrollYProgress.onChange(v => { scrollProgress.current = v; }), [scrollYProgress]);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#020617" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 60% 50%, rgba(29,78,216,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }} style={{ background: "transparent" }}>
          <GlobeScene scrollY={scrollProgress} />
        </Canvas>
      </div>
      <div style={{ position: "relative", zIndex: 10, maxWidth: 520, padding: "0 0 0 80px" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: 11, fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            GLOBAL INTELLIGENCE
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20, color: "#f8fafc" }}>
            Talent mapped<br />
            <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>across every</span>
            <br />corner of earth
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.75, marginBottom: 40, maxWidth: 420 }}>
            Our AI indexes talent pipelines from 190+ countries. Real-time signals surface the right candidate before your competitors even begin their search.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ label: "Countries covered", value: "190+" }, { label: "Candidates indexed", value: "2.4M+" }, { label: "Avg. time to hire", value: "6 days" }].map((stat) => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 14 }}>
                <span style={{ color: "#64748b", fontSize: 13 }}>{stat.label}</span>
                <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 3D AI AVATAR ─────────────────────────────────────────────────────────────
function AvatarHead() {
  const groupRef = useRef();
  const eyeL = useRef(), eyeR = useRef();
  const mouthRef = useRef();
  const ring1 = useRef(), ring2 = useRef(), ring3 = useRef();
  const particleRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const count = 80;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 1.8 + Math.random() * 1.2;
      const h     = (Math.random() - 0.5) * 2.5;
      pos[i*3]   = Math.cos(angle) * dist;
      pos[i*3+1] = h;
      pos[i*3+2] = Math.sin(angle) * dist;
      const t    = Math.random();
      col[i*3]   = 0.2 + t * 0.6;
      col[i*3+1] = 0.3 + t * 0.5;
      col[i*3+2] = 0.9;
    }
    return { pos, col };
  }, []);

  useEffect(() => {
    const move = (e) => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += (mouse.current.x * 0.3 - groupRef.current.rotation.y) * 0.06;
      groupRef.current.rotation.x += (-mouse.current.y * 0.15 - groupRef.current.rotation.x) * 0.06;
      groupRef.current.position.y  = Math.sin(t * 0.8) * 0.06;
    }
    // Eye glow pulse
    if (eyeL.current) eyeL.current.material.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.4;
    if (eyeR.current) eyeR.current.material.emissiveIntensity = 0.8 + Math.sin(t * 2 + 0.3) * 0.4;
    // Blink
    const blink = Math.floor(t * 0.4) % 7 === 0 && (t % 2.5) < 0.12;
    if (eyeL.current) eyeL.current.scale.y = blink ? 0.1 : 1;
    if (eyeR.current) eyeR.current.scale.y = blink ? 0.1 : 1;
    // Talking
    if (mouthRef.current) {
      mouthRef.current.scale.x = 1 + Math.sin(t * 4) * 0.15;
      mouthRef.current.scale.y = 0.6 + Math.abs(Math.sin(t * 5)) * 0.7;
    }
    // Rings
    if (ring1.current) ring1.current.rotation.z = t * 0.4;
    if (ring2.current) ring2.current.rotation.z = -t * 0.3;
    if (ring3.current) ring3.current.rotation.y = t * 0.5;
    // Particles
    if (particleRef.current) particleRef.current.rotation.y = t * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Particle halo */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.pos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[particles.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} vertexColors transparent opacity={0.75} sizeAttenuation />
      </points>

      {/* Orbital rings */}
      {[
        { ref: ring1, rx: 1.3,  ry: 0,   r: 1.6, tube: 0.008, col: "#3b82f6", op: 0.55 },
        { ref: ring2, rx: 0.5,  ry: 0.3, r: 1.9, tube: 0.006, col: "#60a5fa", op: 0.40 },
        { ref: ring3, rx: 0,    ry: 0,   r: 2.2, tube: 0.005, col: "#93c5fd", op: 0.25 },
      ].map(({ ref, rx, ry, r, tube, col, op }, i) => (
        <mesh key={i} ref={ref} rotation={[rx, ry, 0]}>
          <torusGeometry args={[r, tube, 16, 100]} />
          <meshBasicMaterial color={col} transparent opacity={op} />
        </mesh>
      ))}

      {/* Head sphere */}
      <mesh>
        <sphereGeometry args={[0.72, 64, 64]} />
        <meshStandardMaterial color="#050e1a" roughness={0.12} metalness={0.9} emissive="#061830" emissiveIntensity={0.4} />
      </mesh>
      {/* Glass overlay */}
      <mesh>
        <sphereGeometry args={[0.735, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.06} roughness={0} metalness={1} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 0.55, 32]} />
        <meshStandardMaterial color="#060f1e" roughness={0.2} metalness={0.8} emissive="#061830" emissiveIntensity={0.3} />
      </mesh>
      {/* Shoulder */}
      <mesh position={[0, -1.28, 0]}>
        <cylinderGeometry args={[0.6, 0.72, 0.22, 32]} />
        <meshStandardMaterial color="#050e1a" roughness={0.1} metalness={0.9} emissive="#0a1e3a" emissiveIntensity={0.2} />
      </mesh>
      {/* Chest glow strip */}
      <mesh position={[0, -1.28, 0.55]}>
        <boxGeometry args={[0.85, 0.18, 0.12]} />
        <meshStandardMaterial color="#1d4ed8" transparent opacity={0.6} roughness={0} metalness={1} emissive="#1d4ed8" emissiveIntensity={0.9} />
      </mesh>

      {/* Eyes */}
      {[[-0.22, 0.1, 0.69], [0.22, 0.1, 0.69]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.11, 20, 20]} />
            <meshStandardMaterial color="#020a14" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh ref={i === 0 ? eyeL : eyeR} position={[0, 0, 0.06]}>
            <circleGeometry args={[0.065, 32]} />
            <meshStandardMaterial color="#2563eb" emissive="#60a5fa" emissiveIntensity={1.2} roughness={0} />
          </mesh>
          <mesh position={[0, 0, 0.075]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color="#000" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <ringGeometry args={[0.07, 0.09, 32]} />
            <meshBasicMaterial color="#93c5fd" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Nose */}
      <mesh position={[0, -0.06, 0.7]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#0a1e3a" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>

      {/* Mouth / speaker grille */}
      <group ref={mouthRef} position={[0, -0.22, 0.68]}>
        {[-0.1, -0.05, 0, 0.05, 0.1].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.03, 0.05, 0.02]} />
            <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" emissiveIntensity={1.5} roughness={0} />
          </mesh>
        ))}
      </group>

      {/* Ear panels */}
      {[[-0.72, 0.05, 0], [0.72, 0.05, 0]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[0, i === 0 ? -Math.PI/2 : Math.PI/2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 20]} />
            <meshStandardMaterial color="#080f1e" roughness={0.2} metalness={0.9} emissive="#0a1e3a" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[i === 0 ? -0.04 : 0.04, 0, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#2563eb" emissive="#60a5fa" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}

      {/* Crown sensor */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.04, 0.07, 0.18, 16]} />
        <meshStandardMaterial color="#1d4ed8" emissive="#93c5fd" emissiveIntensity={1.5} roughness={0} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.84, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#93c5fd" emissive="#ffffff" emissiveIntensity={2} roughness={0} />
      </mesh>

      {/* Forehead circuit lines */}
      <mesh position={[0, 0.38, 0.67]}>
        <boxGeometry args={[0.3, 0.008, 0.01]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.32, 0.67]}>
        <boxGeometry args={[0.18, 0.006, 0.01]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
      </mesh>

      {/* Ambient glow bubble */}
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#1e3a8a" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* Lights */}
      <pointLight position={[2, 2, 2]}   intensity={3}   color="#3b82f6" />
      <pointLight position={[-2, -1, 1]} intensity={1.5} color="#1d4ed8" />
      <pointLight position={[0, 3, 0]}   intensity={1}   color="#93c5fd" />
      <ambientLight intensity={0.4} />
      <spotLight   position={[0, 4, 3]}  intensity={4} color="#ffffff" angle={0.4} penumbra={0.8} />
    </group>
  );
}

function AvatarScene() {
  return (
    <Canvas camera={{ position: [0, 0, 3.6], fov: 42 }} style={{ background: "transparent" }}>
      <AvatarHead />
    </Canvas>
  );
}

// Floating UI chips around the avatar
function FloatingChip({ top, left, right, delay, icon, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8 + delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute", top, left, right,
        background: "rgba(3,10,25,0.88)",
        border: "1px solid rgba(59,130,246,0.28)",
        borderRadius: 12, padding: "8px 14px",
        display: "flex", alignItems: "center", gap: 8,
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.08)",
        animation: `float-chip ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        whiteSpace: "nowrap", zIndex: 20,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#93c5fd", letterSpacing: "0.03em" }}>{label}</span>
    </motion.div>
  );
}

// ─── AVATAR SPOTLIGHT SECTION ─────────────────────────────────────────────────
function AvatarSpotlightSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const avatarY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} style={{ background: "#020617", padding: "140px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 65% 50%, rgba(29,78,216,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent)" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 80px", display: "flex", alignItems: "center", gap: 80 }}>

        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: "0 0 44%", maxWidth: 480 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 9999, padding: "5px 16px", fontSize: 11, fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            AI AVATAR INTERVIEWS
          </div>

          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc", marginBottom: 20 }}>
            AI Avatar Interviews<br />
            <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>
              that scale with your hiring
            </span>
          </h2>

          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
            Candidates complete structured voice interviews with an AI Avatar — anytime, from anywhere. The interview follows your job requirements and produces a clear evaluation summary.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
            {[
              "Available 24/7 — no scheduling delays",
              "Standardized questions aligned to the job",
              "Faster screening without exhausting HR teams",
              "Professional candidate experience",
            ].map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -12 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 9 9"><polyline points="1,4.5 3.5,7 8,1.5" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ color: "#94a3b8", fontSize: 14 }}>{t}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(59,130,246,0.45)" }} whileTap={{ scale: 0.97 }}
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'Sora', sans-serif", boxShadow: "0 4px 20px rgba(29,78,216,0.4)", letterSpacing: "-0.01em" }}
          >
            Request Sample Interview →
          </motion.button>
        </motion.div>

        {/* Right — 3D Avatar */}
        <motion.div
          style={{ y: avatarY, flex: 1, height: 560, position: "relative" }}
          initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {/* Glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />

          <AvatarScene />

          {/* Floating chips */}
          <FloatingChip top="18%" left="-8%"  delay={0}   icon="📊" label="Scoring Model" />
          <FloatingChip top="60%" left="-12%" delay={0.5} icon="🎯" label="92% Accuracy" />
          <FloatingChip top="20%" right="-4%" delay={0.3} icon="🌐" label="24/7 Available" />
          <FloatingChip top="65%" right="-6%" delay={0.8} icon="⚡" label="Instant Ranking" />

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, y: 20, x: 30 }} animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{ position: "absolute", bottom: "12%", right: "-4%", background: "rgba(3,8,20,0.92)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 16, padding: "16px 20px", backdropFilter: "blur(20px)", minWidth: 200, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
          >
            <p style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>CANDIDATE SCORE</p>
            {[["Technical Skills", "92%"], ["Communication", "87%"], ["Culture Fit", "94%"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 24 }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa" }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#64748b" }}>Overall</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc" }}>91/100</span>
            </div>
          </motion.div>

          {/* Speaking wave */}
          <div style={{ position: "absolute", bottom: "14%", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
              {[1,2,3,4,5].map((_, i) => (
                <div key={i} style={{ width: 3, background: "#3b82f6", borderRadius: 2, animation: `wave-eq ${0.4 + i * 0.1}s ease-in-out infinite alternate`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, letterSpacing: "0.06em" }}>AI SPEAKING</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
              {[5,4,3,4,5].map((_, i) => (
                <div key={i} style={{ width: 3, background: "#3b82f6", borderRadius: 2, animation: `wave-eq ${0.4 + i * 0.12}s ease-in-out infinite alternate`, animationDelay: `${i * 0.1 + 0.4}s` }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



// ─── AI AVATAR VIDEO SECTION ────────────────────────────────────────────────
function AvatarVideoSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      style={{
        background: "#020617",
        padding: "140px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)",
        }}
      />

      <div
        style={{
          maxWidth: 621,
          margin: "0 auto",
          padding: "0 40px",
          textAlign: "center",
        }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(29,78,216,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: 9999,
              padding: "5px 16px",
              fontSize: 11,
              fontWeight: 600,
              color: "#60a5fa",
              letterSpacing: "0.08em",
              marginBottom: 28,
            }}
          >
            LIVE DEMO
          </div>

          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#f8fafc",
              marginBottom: 20,
            }}
          >
            See the AI Avatar<br />
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#93c5fd",
              }}
            >
              in action
            </span>
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              maxWidth: 420,
              margin: "0 auto 60px",
              lineHeight: 1.7,
            }}
          >
            Watch how the AI Avatar conducts structured interviews,
            evaluates responses, and generates hiring-ready insights.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(20px)",
          }}
        >
          <video
            src="./public/videos/mawahib-v.mp4"
            controls
            preload="metadata"
            style={{
              width: "100%",
              height: "50%",
              display: "block",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── PROBLEM SECTION ──────────────────────────────────────────────────────────
function ProblemSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const problems = [
    { icon: "📂", title: "Too many CVs, not enough time",  desc: "Shortlisting takes days, while top candidates move on quickly." },
    { icon: "⚖️", title: "Subjective decisions",           desc: "Different reviewers, different standards — no consistent scoring." },
    { icon: "⏳", title: "Interviews consume resources",   desc: "Scheduling and repetitive screening drain HR and managers." },
  ];
  return (
    <section ref={ref} style={{ background: "#020617", padding: "120px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent)" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 80px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }} style={{ marginBottom: 72, maxWidth: 600 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: 11, fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            THE PROBLEM
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc" }}>
            Hiring shouldn't{" "}
            <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>feel like chaos.</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.75, marginTop: 16, maxWidth: 500 }}>
            Most teams lose valuable time reviewing CVs manually, repeating interviews, and making decisions based on mixed opinions.
          </p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {problems.map((p, i) => (
            <motion.div key={p.title}
              initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
              whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.2)" }}
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "36px 32px", transition: "all .4s ease" }}
            >
              <div style={{ fontSize: 32, marginBottom: 20 }}>{p.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, letterSpacing: "-0.02em" }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const steps = [
    { n: 1, title: "Create a job and define skills + weights (out of 100)",           col: "#3b82f6" },
    { n: 2, title: "Collect applications through a shareable job link",               col: "#2563eb" },
    { n: 3, title: "Initial scoring for each candidate based on your table",          col: "#1d4ed8" },
    { n: 4, title: "Group qualifiers to rank candidates against the job requirements", col: "#1e40af" },
    { n: 5, title: "AI Avatar interview for deeper evaluation",                       col: "#3b82f6" },
    { n: 6, title: "Final ranking + summary report ready for decision makers",        col: "#60a5fa" },
  ];
  return (
    <section ref={ref} style={{ background: "#020617", padding: "120px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(29,78,216,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 80px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: 11, fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            HOW IT WORKS
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc" }}>
            From job post to final{" "}
            <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>hire in 6 steps</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "16px auto 0", lineHeight: 1.7 }}>
            Designed to be simple for HR teams and powerful for leadership decisions.
          </p>
        </motion.div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 24, left: 23, width: 2, height: "calc(100% - 48px)", background: "linear-gradient(to bottom, #3b82f6, transparent)", opacity: 0.2, borderRadius: 2 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {steps.map((s, i) => (
              <motion.div key={s.n}
                initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                whileHover={{ x: 8, transition: { duration: 0.3 } }}
                style={{ display: "flex", alignItems: "center", gap: 24, background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 32px", position: "relative" }}
              >
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${s.col}20`, border: `1px solid ${s.col}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: s.col, flexShrink: 0, boxShadow: `0 0 20px ${s.col}22` }}>
                  {s.n}
                </div>
                <p style={{ fontSize: 15, color: "#cbd5e1", fontWeight: 500, letterSpacing: "-0.01em" }}>{s.title}</p>
                <div style={{ position: "absolute", right: 28, top: "50%", transform: "translateY(-50%)", color: "rgba(59,130,246,0.25)", fontSize: 18 }}>→</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3D TILT FEATURE CARDS ────────────────────────────────────────────────────
const features = [
  { icon: "⬡", title: "AI Candidate Matching",  desc: "Neural matching across skills, culture fit, and trajectory—not just keywords. Surfaces hidden gems your search would miss.",        accent: "#3b82f6", delay: 0 },
  { icon: "◈", title: "Automated Screening",     desc: "AI-powered async interviews that screen hundreds simultaneously. Get structured insights without the scheduling overhead.",        accent: "#6366f1", delay: 0.07 },
  { icon: "◎", title: "Global Talent Insights",  desc: "Market intelligence on compensation, availability, and skill distribution—updated in real time across 190 markets.",             accent: "#0ea5e9", delay: 0.14 },
  { icon: "⬖", title: "Bias-Reduced Hiring",     desc: "Structured evaluation rubrics and anonymized profiles ensure every candidate is assessed on merit, not background.",             accent: "#14b8a6", delay: 0.21 },
  { icon: "◇", title: "Interview Intelligence",  desc: "Real-time transcription, sentiment analysis, and scoring. Every interview becomes a structured dataset for better decisions.",   accent: "#8b5cf6", delay: 0.28 },
  { icon: "◻", title: "Workforce Analytics",     desc: "Hiring funnel metrics, diversity dashboards, and predictive retention signals in one unified command center.",                   accent: "#f59e0b", delay: 0.35 },
];

function TiltCard({ feature, index }) {
  const cardRef   = useRef(null);
  const glowRef   = useRef(null);
  const revealRef = useRef(null);
  const isInView  = useInView(revealRef, { once: true, amount: 0.15 });

  const rotateX   = useMotionValue(0);
  const rotateY   = useMotionValue(0);
  const springCfg = { stiffness: 180, damping: 18, mass: 0.7 };
  const springRX  = useSpring(rotateX, springCfg);
  const springRY  = useSpring(rotateY, springCfg);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    rotateX.set((-( e.clientY - cy) / (rect.height / 2)) * 13);
    rotateY.set((   e.clientX - cx) / (rect.width  / 2)  * 13);
    const px = ((e.clientX - rect.left) / rect.width)  * 100;
    const py = ((e.clientY - rect.top)  / rect.height) * 100;
    if (glowRef.current) glowRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, ${feature.accent}30 0%, transparent 58%)`;
  }, [rotateX, rotateY, feature.accent]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0); rotateY.set(0);
    if (glowRef.current) glowRef.current.style.background = "transparent";
  }, [rotateX, rotateY]);

  return (
    <motion.div ref={revealRef}
      initial={{ opacity: 0, y: 52, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: feature.delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div ref={cardRef}
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
        data-cursor="hover"
        style={{
          rotateX: springRX, rotateY: springRY,
          transformStyle: "preserve-3d",
          position: "relative", borderRadius: 22,
          padding: "40px 32px 36px",
          background: "rgba(255,255,255,0.024)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(28px)", overflow: "hidden",
          willChange: "transform",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.055)",
        }}
        whileHover={{ boxShadow: `0 28px 70px rgba(0,0,0,0.55), 0 0 0 1px ${feature.accent}40, inset 0 1px 0 rgba(255,255,255,0.09)`, transition: { duration: 0.35 } }}
      >
        {/* Mouse-tracked glow */}
        <div ref={glowRef} style={{ position: "absolute", inset: 0, borderRadius: 22, pointerEvents: "none", transition: "background 0.05s linear" }} />
        {/* Bevel edge */}
        <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, ${feature.accent}55, rgba(255,255,255,0.12), ${feature.accent}55, transparent)`, pointerEvents: "none" }} />
        {/* Depth gradient */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(150deg, rgba(255,255,255,0.035) 0%, transparent 45%, rgba(0,0,0,0.18) 100%)", pointerEvents: "none" }} />
        {/* Corner glow */}
        <div style={{ position: "absolute", top: -2, right: -2, width: 90, height: 90, background: `radial-gradient(circle at top right, ${feature.accent}22 0%, transparent 65%)`, borderRadius: "0 22px 0 0", pointerEvents: "none" }} />

        {/* Icon */}
        <motion.div
          style={{ width: 54, height: 54, borderRadius: 15, background: `linear-gradient(145deg, ${feature.accent}22, ${feature.accent}08)`, border: `1px solid ${feature.accent}38`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23, color: feature.accent, marginBottom: 28, boxShadow: `0 4px 24px ${feature.accent}22, inset 0 1px 0 ${feature.accent}35`, position: "relative", transform: "translateZ(20px)" }}
          whileHover={{ scale: 1.12, boxShadow: `0 10px 32px ${feature.accent}40`, transition: { type: "spring", stiffness: 280, damping: 18 } }}
        >
          {feature.icon}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", borderRadius: "15px 15px 0 0", background: "linear-gradient(to bottom, rgba(255,255,255,0.09), transparent)", pointerEvents: "none" }} />
        </motion.div>

        <div style={{ position: "absolute", top: 30, right: 28, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.07)", letterSpacing: "0.12em", fontFamily: "monospace" }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 12, letterSpacing: "-0.02em", lineHeight: 1.3, position: "relative", transform: "translateZ(10px)" }}>{feature.title}</h3>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, position: "relative", transform: "translateZ(8px)" }}>{feature.desc}</p>

        <motion.div initial={{ scaleX: 0, opacity: 0 }} whileHover={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${feature.accent}85, transparent)`, transformOrigin: "left" }}
        />
        <motion.div initial={{ opacity: 0, y: 6 }} whileHover={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: feature.accent, letterSpacing: "0.03em", position: "relative" }}
        >
          Explore feature
          <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function FeaturesSection() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.4], [50, 0]);
  const headerO = useTransform(scrollYProgress, [0, 0.28], [0, 1]);

  return (
    <section ref={ref} style={{ background: "#020617", padding: "130px 0 150px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(29,78,216,0.05) 0%, transparent 55%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.18), transparent)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent)" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <motion.div style={{ y: headerY, opacity: headerO }}>
          <div style={{ textAlign: "center", marginBottom: 90 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: 11, fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
              PLATFORM CAPABILITIES
            </div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc", marginBottom: 20 }}>
              Everything you need to hire<br />
              <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>with confidence</span>
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              A unified platform that replaces your ATS, sourcing tools, and interview infrastructure—all powered by AI.
            </p>
          </div>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 22 }}>
          {features.map((f, i) => <TiltCard key={f.title} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.8 });
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const c = animate(0, target, { duration: 2.2, ease: [0.16,1,0.3,1], onUpdate: v => setValue(Math.round(v)) });
      return c.stop;
    }
  }, [isInView, target]);
  return <span ref={ref}>{value}{suffix}</span>;
}

const stats = [
  { value: 73,   suffix: "%", label: "Reduction in time-to-hire",      desc: "From months to days" },
  { value: 91,   suffix: "%", label: "Candidate satisfaction",          desc: "vs 62% industry avg" },
  { value: 2400, suffix: "+", label: "Enterprises trust Apriora",      desc: "Across 50+ industries" },
  { value: 4,    suffix: "×", label: "More interviews screened",        desc: "Same team, same budget" },
];

function StatsSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <section ref={ref} style={{ background: "#020617", padding: "120px 0", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ color: "#64748b", fontSize: 12, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 20 }}>TRUSTED BY THE WORLD'S FASTEST-GROWING COMPANIES</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", opacity: 0.3 }}>
            {["Accel", "Sequoia", "a16z", "Stripe", "Notion", "Linear"].map(name => (
              <span key={name} style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em", color: "#94a3b8" }}>{name}</span>
            ))}
          </div>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "rgba(255,255,255,0.05)", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ background: "rgba(29,78,216,0.06)" }}
              style={{ padding: "52px 40px", background: "#020617", display: "flex", flexDirection: "column", gap: 8, position: "relative", transition: "background 0.3s ease" }}
            >
              <div style={{ fontSize: "clamp(40px, 4vw, 56px)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.04em", lineHeight: 1 }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", marginTop: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: "#334155" }}>{stat.desc}</div>
              {i < stats.length - 1 && <div style={{ position: "absolute", top: "20%", right: 0, height: "60%", width: 1, background: "rgba(255,255,255,0.05)" }} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale      = useTransform(scrollYProgress, [0, 0.45], [0.94, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.3],  [0, 1]);
  return (
    <section ref={ref} style={{ background: "#020617", padding: "120px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 65%)", pointerEvents: "none", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "90%", maxWidth: 900, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)" }} />
      <motion.div style={{ scale, opacity: ctaOpacity, maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: 11, fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block" }} />
          NOW ACCEPTING TEAMS
        </div>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#f8fafc", marginBottom: 24 }}>
          Start hiring smarter<br />
          <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>from day one</span>
        </h2>
        <p style={{ color: "#64748b", fontSize: 18, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 48px" }}>
          Join 2,400+ teams that replaced their entire hiring stack with Apriora. No setup fees. No lock-in.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(59,130,246,0.5)" }} whileTap={{ scale: 0.97 }}
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 14, padding: "16px 36px", fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em", boxShadow: "0 4px 24px rgba(29,78,216,0.4)" }}>
            Start Free Trial →
          </motion.button>
          <motion.button whileHover={{ scale: 1.04, borderColor: "rgba(59,130,246,0.4)", background: "rgba(59,130,246,0.08)" }} whileTap={{ scale: 0.97 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 36px", fontSize: 15, fontWeight: 600, color: "#94a3b8", fontFamily: "'Sora', sans-serif", backdropFilter: "blur(10px)", transition: "all 0.3s ease" }}>
            Talk to Sales
          </motion.button>
        </div>
        <p style={{ color: "#334155", fontSize: 12, marginTop: 24, letterSpacing: "0.02em" }}>14-day free trial · No credit card · Cancel anytime</p>
      </motion.div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    Product:   ["Features", "Pricing", "Changelog", "Roadmap"],
    Company:   ["About", "Blog", "Careers", "Press"],
    Legal:     ["Privacy", "Terms", "Security", "DPA"],
    Resources: ["Docs", "API", "Status", "Support"],
  };
  return (
    <footer style={{ background: "#020617", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 40px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <img
    src={Logo}
    alt="Asspriora Logo"
    style={{
      height: 200,
      width: "auto",
      objectFit: "contain"
    }}
  />
</div>

            </div>
            <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.75, maxWidth: 240 }}>AI-powered hiring intelligence for the modern enterprise. Hire faster, hire better.</p>
          </div>
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", marginBottom: 20 }}>{section.toUpperCase()}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map(item => (
                  <a key={item} href="#" style={{ color: "#64748b", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#94a3b8"} onMouseLeave={e => e.target.style.color = "#64748b"}>{item}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "#334155", fontSize: 13 }}>© 2025 Apriora, Inc. All rights reserved.</p>
          <div style={{ display: "flex", gap: 8 }}>
            {["Backed by YC", "SOC 2 Type II", "GDPR Ready"].map(badge => (
              <span key={badge} style={{ fontSize: 10, color: "#475569", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9999, padding: "4px 10px", letterSpacing: "0.04em" }}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, background: scrolled ? "rgba(2,6,23,0.88)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "all 0.4s ease" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <img
    src={Logo}
    alt="Asspriora Logo"
    style={{
      height: 200,
      width: "auto",
      objectFit: "contain"
    }}
  />
</div>

      </div>
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {["Product", "Solutions", "Pricing", "Docs"].map(item => (
          <a key={item} href="#" style={{ color: "#64748b", fontSize: 13, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#e2e8f0"} onMouseLeave={e => e.target.style.color = "#64748b"}>{item}</a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <a href="#" style={{ color: "#64748b", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>Sign in</a>
        <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.97 }}
          style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Sora', sans-serif", boxShadow: "0 2px 12px rgba(29,78,216,0.3)" }}
        >Get Started</motion.button>
      </div>
    </motion.nav>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <FontLink />
      <GlobalStyles />
      <div className="noise-overlay" />
      <CustomCursor />
      <ScrollProgressBar />
      <Nav />
      <AprioraHero />
      <GlobeSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <AvatarSpotlightSection />
<AvatarVideoSection />   {/* NEW SECTION */}
<StatsSection />

      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
}