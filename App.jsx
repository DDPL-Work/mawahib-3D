import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
  useMotionValue,
} from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  </>
);

const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #020617; color: #fff; font-family: 'Sora', sans-serif; overflow-x: hidden; cursor: none; }
    a, button { cursor: none; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #020617; }
    ::-webkit-scrollbar-thumb { background: #1d4ed8; border-radius: 4px; }
    @media (max-width: 768px) { body { cursor: default; } a, button { cursor: pointer; } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    .shimmer-text { background: linear-gradient(90deg, #60a5fa, #e0f2fe, #3b82f6, #bfdbfe, #60a5fa); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 5s linear infinite; }
    .grid-bg { background-image: linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px); background-size: 64px 64px; }
    .noise-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 998; opacity: 0.018; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 128px; }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 40px rgba(59,130,246,0.6); } }
    @keyframes float-chip { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
    @keyframes wave-eq { 0% { height: 4px; } 50% { height: 24px; } 100% { height: 4px; } }
  `}</style>
);

// Custom Cursor
function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const posX = { current: 0 }, posY = { current: 0 };
    const ringX = { current: 0 }, ringY = { current: 0 };
    let rafRef = null;
    const move = (e) => {
      posX.current = e.clientX;
      posY.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };
    const loop = () => {
      ringX.current += (posX.current - ringX.current) * 0.1;
      ringY.current += (posY.current - ringY.current) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX.current}px`;
        ringRef.current.style.top = `${ringY.current}px`;
      }
      rafRef = requestAnimationFrame(loop);
    };
    const over = (e) => {
      if (e.target.closest('a, button, [data-cursor="hover"]') && ringRef.current && dotRef.current) {
        ringRef.current.style.width = "52px";
        ringRef.current.style.height = "52px";
        ringRef.current.style.borderColor = "rgba(96,165,250,0.75)";
        ringRef.current.style.background = "rgba(59,130,246,0.07)";
        dotRef.current.style.opacity = "0";
      }
    };
    const out = () => {
      if (ringRef.current && dotRef.current) {
        ringRef.current.style.width = "36px";
        ringRef.current.style.height = "36px";
        ringRef.current.style.borderColor = "rgba(59,130,246,0.45)";
        ringRef.current.style.background = "transparent";
        dotRef.current.style.opacity = "1";
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    rafRef = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      if (rafRef) cancelAnimationFrame(rafRef);
    };
  }, [isMobile]);

  if (isMobile) return null;
  return (
    <>
      <div ref={ringRef} style={{ position: "fixed", pointerEvents: "none", zIndex: 9999, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(59,130,246,0.45)", background: "transparent", transform: "translate(-50%,-50%)", transition: "width .3s, height .3s, border-color .3s, background .3s", left: 0, top: 0 }} />
      <div ref={dotRef} style={{ position: "fixed", pointerEvents: "none", zIndex: 9999, width: 5, height: 5, borderRadius: "50%", background: "#60a5fa", transform: "translate(-50%,-50%)", boxShadow: "0 0 10px rgba(96,165,250,0.9)", transition: "opacity .25s", left: 0, top: 0 }} />
    </>
  );
}

// Scroll Progress Bar
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 1000, background: "linear-gradient(90deg, #1d4ed8, #60a5fa, #818cf8)", transformOrigin: "left", scaleX, boxShadow: "0 0 14px rgba(59,130,246,0.7)" }} />;
}

// 3D Floating Particles Background
function FloatingParticles({ scrollY }) {
  const particlesRef = useRef();
  const particleCount = 100;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    const posArray = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1] + Math.sin(time + i) * 0.001;
      posArray[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(posArray[i * 3]) > 25) velocities[i * 3] *= -1;
      if (Math.abs(posArray[i * 3 + 1]) > 25) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posArray[i * 3 + 2]) > 15) velocities[i * 3 + 2] *= -1;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.position.y = scrollY * 0.5;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#3b82f6" transparent opacity={0.3} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// 3D Geometric Shapes Background
function GeometricShapes({ scrollY }) {
  const group = useRef();
  
  const shapes = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      type: ['box', 'sphere', 'torus'][Math.floor(Math.random() * 3)],
      position: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      child.rotation.x = shapes[i].rotation[0] + time * 0.1;
      child.rotation.y = shapes[i].rotation[1] + time * 0.15;
      child.position.y = shapes[i].position[1] + Math.sin(time + i) * 0.5;
    });
    group.current.position.y = scrollY * 0.3;
  });

  return (
    <group ref={group}>
      {shapes.map((shape, i) => {
        const Geometry = shape.type === 'box' ? 'boxGeometry' : shape.type === 'sphere' ? 'sphereGeometry' : 'torusGeometry';
        const args = shape.type === 'box' ? [1, 1, 1] : shape.type === 'sphere' ? [0.5, 16, 16] : [0.5, 0.2, 16, 32];
        
        return (
          <mesh key={i} position={shape.position} scale={shape.scale}>
            {Geometry === 'boxGeometry' && <boxGeometry args={args} />}
            {Geometry === 'sphereGeometry' && <sphereGeometry args={args} />}
            {Geometry === 'torusGeometry' && <torusGeometry args={args} />}
            <meshStandardMaterial
              color="#1d4ed8"
              wireframe
              transparent
              opacity={0.1}
              emissive="#3b82f6"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D Background Scene Component
function Background3DScene() {
  const { scrollY } = useScroll();
  const scrollYValue = useRef(0);

  useEffect(() => {
    return scrollY.onChange((v) => {
      scrollYValue.current = v * 10;
    });
  }, [scrollY]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#3b82f6" />
        <FloatingParticles scrollY={scrollYValue.current} />
        <GeometricShapes scrollY={scrollYValue.current} />
      </Canvas>
    </div>
  );
}

// Enhanced Hero Section with Parallax
function CVFlowHero() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <div ref={ref} style={{ position: "relative", minHeight: "100vh", width: "100%", background: "#020617", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
      
      {/* Layered Parallax Backgrounds */}
      <motion.div style={{ y: yFast, position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(29,78,216,0.12) 0%, transparent 70%)", pointerEvents: "none", opacity: 0.5 }} />
      <motion.div style={{ y: ySlow, position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(59,130,246,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
      
      <div className="grid-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      
      {/* Animated AI Engine with Parallax */}
      <motion.div style={{ y, position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <motion.div style={{ scale, rotate }} className="relative" style={{ width: "clamp(180px, 25vw, 280px)", height: "clamp(180px, 25vw, 280px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 70%)", border: "2px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-glow 3s ease-in-out infinite" }}>
          <div style={{ fontSize: "clamp(40px, 6vw, 72px)", filter: "drop-shadow(0 0 20px rgba(59,130,246,0.8))" }}>🤖</div>
          <div style={{ position: "absolute", inset: "-40px", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: "-70px", border: "1px solid rgba(59,130,246,0.08)", borderRadius: "50%" }} />
        </motion.div>

        {/* Flowing CVs */}
        {[...Array(3)].map((_, i) => (
          <motion.div key={`cv-in-${i}`} style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50 * (i + 1)]), position: "absolute", left: "clamp(10%, 15%, 20%)", top: `${30 + i * 15}%`, width: "clamp(60px, 8vw, 90px)", height: "clamp(80px, 10vw, 110px)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, padding: "clamp(6px, 1vw, 10px)", backdropFilter: "blur(10px)", fontSize: "clamp(20px, 3vw, 28px)", display: "flex", alignItems: "center", justifyContent: "center" }} animate={{ x: ["0%", "180%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" }}>
            📄
            <div style={{ position: "absolute", bottom: "clamp(4px, 1vw, 8px)", left: "clamp(4px, 1vw, 8px)", right: "clamp(4px, 1vw, 8px)", height: "2px", background: "rgba(59,130,246,0.3)", borderRadius: 1 }} />
            <div style={{ position: "absolute", bottom: "clamp(8px, 2vw, 14px)", left: "clamp(4px, 1vw, 8px)", right: "clamp(12px, 3vw, 20px)", height: "2px", background: "rgba(59,130,246,0.2)", borderRadius: 1 }} />
          </motion.div>
        ))}

        {/* Flowing Results */}
        {[...Array(3)].map((_, i) => (
          <motion.div key={`result-${i}`} style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50 * (i + 1)]), position: "absolute", right: "clamp(10%, 15%, 20%)", top: `${30 + i * 15}%`, width: "clamp(70px, 9vw, 100px)", height: "clamp(80px, 10vw, 110px)", background: "linear-gradient(135deg, rgba(29,78,216,0.15), rgba(59,130,246,0.08))", border: "1px solid rgba(59,130,246,0.4)", borderRadius: 10, padding: "clamp(8px, 1.5vw, 12px)", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "clamp(4px, 0.8vw, 6px)" }} animate={{ x: ["0%", "-180%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 + 2, ease: "easeInOut" }}>
            <div style={{ fontSize: "clamp(18px, 2.5vw, 24px)" }}>✓</div>
            <div style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 700, color: "#60a5fa" }}>{90 + i * 3}%</div>
            <div style={{ width: "100%", height: "clamp(3px, 0.5vw, 5px)", background: "rgba(59,130,246,0.3)", borderRadius: 2 }}>
              <div style={{ width: `${85 + i * 5}%`, height: "100%", background: "#3b82f6", borderRadius: 2 }} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content with Parallax */}
      <motion.div style={{ y, opacity: heroOpacity, position: "relative", zIndex: 10, textAlign: "center", maxWidth: "900px", width: "100%" }}>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ fontSize: "clamp(32px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "clamp(16px, 3vw, 24px)" }}>
          Professional Hiring Engine
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8 }} style={{ display: "flex", gap: "clamp(16px, 3vw, 32px)", justifyContent: "center", flexWrap: "wrap", marginBottom: "clamp(20px, 4vw, 32px)" }}>
          {["Automated", "Faster", "More Accurate"].map((word, i) => (
            <span key={i} style={{ fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 600, color: "#60a5fa" }}>{word}</span>
          ))}
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }} style={{ color: "#94a3b8", fontSize: "clamp(14px, 2vw, 17px)", maxWidth: "680px", margin: "0 auto", marginBottom: "clamp(32px, 5vw, 44px)", lineHeight: 1.75, padding: "0 16px" }}>
          Mawahib automates candidate screening and interviews using intelligent AI avatars and structured scoring models. Evaluate more applicants, reduce manual effort, and hire with measurable accuracy.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }} style={{ display: "flex", gap: "clamp(10px, 2vw, 16px)", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.a href="https://mawahib.ai/request-campaign" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(59,130,246,0.5)" }} whileTap={{ scale: 0.97 }} style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 12, padding: "clamp(12px, 2vw, 16px) clamp(24px, 4vw, 36px)", fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 700, color: "#fff", textDecoration: "none", display: "inline-block", fontFamily: "'Sora', sans-serif", boxShadow: "0 4px 24px rgba(29,78,216,0.4)", letterSpacing: "-0.01em" }}>
            Request Quotation →
          </motion.a>
          <motion.a href="https://wa.me/962798056152" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04, borderColor: "rgba(59,130,246,0.5)", background: "rgba(59,130,246,0.08)" }} whileTap={{ scale: 0.97 }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)", fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 600, color: "#94a3b8", textDecoration: "none", display: "inline-block", fontFamily: "'Sora', sans-serif", backdropFilter: "blur(10px)" }}>
            Request a Demo
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }} style={{ position: "absolute", bottom: "clamp(24px, 4vw, 36px)", right: "50%", transform: "translateX(50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: "clamp(8px, 1.5vw, 10px)", color: "#334155", letterSpacing: "0.1em" }}>SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ width: 1, height: "clamp(18px, 3vw, 24px)", background: "linear-gradient(to bottom, #1d4ed8, transparent)" }} />
      </motion.div>
    </div>
  );
}

// Enhanced Globe with Parallax
function GlobeParticles() {
  const meshRef = useRef();
  const { positions, colors } = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 0.04;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const t = Math.random();
      col[i * 3] = 0.2 + t * 0.3;
      col[i * 3 + 1] = 0.4 + t * 0.4;
      col[i * 3 + 2] = 0.9 + t * 0.1;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.07;
      meshRef.current.rotation.x = Math.sin(t * 0.04) * 0.08;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[1.97, 32, 32]} />
        <meshStandardMaterial color="#1d4ed8" wireframe transparent opacity={0.05} emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.025} vertexColors transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#3b82f6" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#1d4ed8" />
      <GlobeParticles />
    </>
  );
}

function GlobeSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  const globeY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#020617", padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 80px)" }}>
      <motion.div style={{ opacity, position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 40% 50%, rgba(29,78,216,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(40px, 8vw, 80px)", alignItems: "center" }}>
        
        <motion.div style={{ y: textY }} initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} style={{ order: window.innerWidth <= 768 ? 2 : 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: "clamp(20px, 3vw, 28px)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            GLOBAL REACH
          </div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "clamp(16px, 2vw, 20px)", color: "#f8fafc" }}>
            From Discovery to Decision — <span style={{ fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>Instantly.</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.75, marginBottom: "clamp(24px, 4vw, 40px)" }}>
            Mawahib doesn't just find talent worldwide.<br />It evaluates, ranks, and presents the best candidates in minutes — not weeks.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 16px)" }}>
            {[{ icon: "🎯", label: "Smart AI Screening" }, { icon: "📊", label: "Structured Scoring Model" }, { icon: "🛡️", label: "Risk & Stability Analysis" }, { icon: "🤖", label: "Interview Automation Built-In" }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(10px, 2vw, 14px) clamp(12px, 2vw, 16px)", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 10 }}>
                <span style={{ fontSize: "clamp(18px, 3vw, 22px)" }}>{item.icon}</span>
                <span style={{ color: "#cbd5e1", fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 500 }}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ y: globeY }} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} style={{ position: "relative", height: "clamp(300px, 50vw, 560px)", order: window.innerWidth <= 768 ? 1 : 2 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "80%", height: "80%", borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.25) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }} style={{ background: "transparent", width: "100%", height: "100%" }}>
            <GlobeScene />
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}


function ScrollingGlobeBackground() {
  const { scrollYProgress } = useScroll();
  const globeY = useTransform(scrollYProgress, [0, 1], [-200, 1200]);
  const globeX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -100, 0]);
  const globeRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const globeScale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 1.2, 1, 1.1, 0.7]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.7, 0.9, 1], [0, 0.5, 1, 1, 0.5, 0]);

  return (
    <motion.div style={{
        y: globeY,
        x: globeX,
        scale: globeScale,
        opacity: globeOpacity,
        position: "fixed",
        top: "15%",
        right: "5%",
        width: "clamp(350px, 45vw, 650px)",
        height: "clamp(350px, 45vw, 650px)",
        zIndex: 1,
        pointerEvents: "none",
      }}>
      {/* Globe Canvas */}
    </motion.div>
  );
}


// Rest of the components remain the same but with added parallax effects...
// (ProblemSection, HowItWorksSection, TiltCard, FeaturesSection, etc.)

function ProblemSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  const problems = [
    { icon: "📊", title: "Overloaded pipelines", desc: "Hundreds of CVs. No clear prioritization." },
    { icon: "🎭", title: "Subjective evaluation", desc: "Personal opinions replace structured scoring." },
    { icon: "⏱️", title: "Time-consuming interviews", desc: "Repetitive screening drains time from real business growth." }
  ];

  return (
    <section ref={ref} style={{ background: "#020617", padding: "clamp(80px, 12vw, 140px) clamp(20px, 5vw, 80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)" }} />
      <motion.div style={{ y, position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(239,68,68,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />
      
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ marginBottom: "clamp(50px, 8vw, 80px)", maxWidth: "700px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 600, color: "#f87171", letterSpacing: "0.08em", marginBottom: "clamp(20px, 3vw, 28px)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            THE PROBLEM
          </div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc", marginBottom: "clamp(16px, 2vw, 20px)" }}>
            Hiring shouldn't feel like <span style={{ fontStyle: "italic", fontWeight: 400, color: "#f87171" }}>chaos.</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.8 }}>
            Yet most companies still rely on manual reviews, subjective opinions, and fragmented processes.<br />Without structure, hiring becomes slow, risky, and unpredictable.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(20px, 3vw, 28px)" }}>
          {problems.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.25)" }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "clamp(28px, 4vw, 40px) clamp(24px, 3vw, 32px)", transition: "all .4s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "40%", background: "radial-gradient(circle at top right, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ width: "clamp(48px, 8vw, 64px)", height: "clamp(48px, 8vw, 64px)", borderRadius: 16, background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "clamp(16px, 2vw, 24px)", fontSize: "clamp(24px, 4vw, 32px)" }}>{p.icon}</div>
              <h3 style={{ fontSize: "clamp(16px, 2.5vw, 18px)", fontWeight: 700, color: "#f1f5f9", marginBottom: "clamp(10px, 1.5vw, 14px)", letterSpacing: "-0.02em" }}>{p.title}</h3>
              <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: "#64748b", lineHeight: 1.75 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  
  const steps = [
    { n: 1, title: "Create a job and define skills + weights (out of 100)", col: "#3b82f6", special: false },
    { n: 2, title: "Collect applications through a shareable job link", col: "#2563eb", special: false },
    { n: 3, title: "Initial scoring for each candidate based on your table", col: "#1d4ed8", special: false },
    { n: 4, title: "Group qualifiers to rank candidates against requirements", col: "#1e40af", special: false },
    { n: 5, title: "AI Avatar Interview — Deep Evaluation", col: "#7c3aed", special: true },
    { n: 6, title: "Final ranking + summary report ready for decision makers", col: "#60a5fa", special: false }
  ];

  return (
    <section ref={ref} style={{ background: "#020617", padding: "clamp(80px, 12vw, 140px) clamp(20px, 5vw, 80px)", position: "relative", overflow: "hidden" }}>
      <motion.div style={{ y, position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(29,78,216,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: "clamp(60px, 10vw, 100px)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: "clamp(20px, 3vw, 28px)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            SIMPLE PROCESS
          </div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc", marginBottom: "clamp(12px, 2vw, 16px)" }}>
            From job post to final <span style={{ fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>hire in 6 steps</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: "clamp(14px, 2vw, 16px)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.75 }}>
            Designed to be simple for HR teams and powerful for leadership decisions.
          </p>
        </motion.div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 24, left: 23, width: 2, height: "calc(100% - 48px)", background: "linear-gradient(to bottom, #3b82f6, transparent)", opacity: 0.2, borderRadius: 2, display: window.innerWidth > 768 ? "block" : "none" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 2vw, 20px)" }}>
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }} whileHover={{ x: 8, scale: s.special ? 1.03 : 1, transition: { duration: 0.3 } }} style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 24px)", background: s.special ? "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.08))" : "rgba(255,255,255,0.022)", border: s.special ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)", position: "relative", boxShadow: s.special ? "0 8px 32px rgba(124,58,237,0.2)" : "none" }}>
                {s.special && (<div style={{ position: "absolute", top: -1, right: -1, background: "#7c3aed", color: "#fff", fontSize: "clamp(8px, 1.2vw, 10px)", fontWeight: 700, padding: "4px 12px", borderRadius: "0 16px 0 8px", letterSpacing: "0.05em" }}>KEY FEATURE</div>)}
                <div style={{ width: "clamp(40px, 7vw, 52px)", height: "clamp(40px, 7vw, 52px)", borderRadius: "50%", background: s.special ? `linear-gradient(135deg, ${s.col}40, ${s.col}20)` : `${s.col}20`, border: `2px solid ${s.col}${s.special ? "60" : "45"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(16px, 3vw, 20px)", fontWeight: 800, color: s.col, flexShrink: 0, boxShadow: s.special ? `0 0 24px ${s.col}35` : `0 0 20px ${s.col}22` }}>{s.special ? "🤖" : s.n}</div>
                <p style={{ fontSize: "clamp(13px, 2vw, 15px)", color: s.special ? "#e2e8f0" : "#cbd5e1", fontWeight: s.special ? 600 : 500, letterSpacing: "-0.01em", flex: 1 }}>{s.title}</p>
                {!s.special && (<div style={{ color: "rgba(59,130,246,0.25)", fontSize: "clamp(14px, 2vw, 18px)", display: window.innerWidth > 480 ? "block" : "none" }}>→</div>)}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TiltCard({ feature, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const revealRef = useRef(null);
  const isInView = useInView(revealRef, { once: true, amount: 0.15 });
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springRY = useSpring(rotateY, { stiffness: 180, damping: 18 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || window.innerWidth <= 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set((-(e.clientY - cy) / (rect.height / 2)) * 13);
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 13);
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    if (glowRef.current) glowRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, ${feature.accent}30 0%, transparent 58%)`;
  }, [rotateX, rotateY, feature.accent]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    if (glowRef.current) glowRef.current.style.background = "transparent";
  }, [rotateX, rotateY]);

  return (
    <motion.div ref={revealRef} initial={{ opacity: 0, y: 52, scale: 0.95 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.8, delay: feature.delay, ease: [0.16, 1, 0.3, 1] }} style={{ perspective: 900 }}>
      <motion.div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX: springRX, rotateY: springRY, transformStyle: "preserve-3d", position: "relative", borderRadius: 22, padding: "clamp(32px, 5vw, 40px) clamp(24px, 4vw, 32px)", background: "rgba(255,255,255,0.024)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(28px)", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.055)" }} whileHover={{ boxShadow: `0 28px 70px rgba(0,0,0,0.55), 0 0 0 1px ${feature.accent}40` }}>
        <div ref={glowRef} style={{ position: "absolute", inset: 0, borderRadius: 22, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, ${feature.accent}55, rgba(255,255,255,0.12), ${feature.accent}55, transparent)`, pointerEvents: "none" }} />
        <motion.div style={{ width: "clamp(48px, 8vw, 54px)", height: "clamp(48px, 8vw, 54px)", borderRadius: 15, background: `linear-gradient(145deg, ${feature.accent}22, ${feature.accent}08)`, border: `1px solid ${feature.accent}38`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(20px, 3vw, 23px)", color: feature.accent, marginBottom: "clamp(20px, 3vw, 28px)", boxShadow: `0 4px 24px ${feature.accent}22`, position: "relative", transform: "translateZ(20px)" }} whileHover={{ scale: 1.12, boxShadow: `0 10px 32px ${feature.accent}40` }}>{feature.icon}</motion.div>
        <h3 style={{ fontSize: "clamp(15px, 2.5vw, 17px)", fontWeight: 700, color: "#f1f5f9", marginBottom: "clamp(10px, 1.5vw, 12px)", letterSpacing: "-0.02em", position: "relative", transform: "translateZ(10px)" }}>{feature.title}</h3>
        <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: "#64748b", lineHeight: 1.8, position: "relative", transform: "translateZ(8px)" }}>{feature.desc}</p>
      </motion.div>
    </motion.div>
  );
}

function FeaturesSection() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.4], [50, 0]);
  const headerO = useTransform(scrollYProgress, [0, 0.28], [0, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const features = [
    { icon: "⬡", title: "AI Candidate Matching", desc: "Neural matching across skills, culture fit, and trajectory—not just keywords. Surfaces hidden gems your search would miss.", accent: "#3b82f6", delay: 0 },
    { icon: "◈", title: "Automated Screening", desc: "AI-powered async interviews that screen hundreds simultaneously. Get structured insights without the scheduling overhead.", accent: "#6366f1", delay: 0.07 },
    { icon: "◎", title: "Global Talent Insights", desc: "Market intelligence on compensation, availability, and skill distribution—updated in real time across 190 markets.", accent: "#0ea5e9", delay: 0.14 },
    { icon: "⬖", title: "Bias-Reduced Hiring", desc: "Structured evaluation rubrics and anonymized profiles ensure every candidate is assessed on merit, not background.", accent: "#14b8a6", delay: 0.21 },
    { icon: "◇", title: "Interview Intelligence", desc: "Real-time transcription, sentiment analysis, and scoring. Every interview becomes a structured dataset for better decisions.", accent: "#8b5cf6", delay: 0.28 },
    { icon: "◻", title: "Workforce Analytics", desc: "Hiring funnel metrics, diversity dashboards, and predictive retention signals in one unified command center.", accent: "#f59e0b", delay: 0.35 }
  ];

  return (
    <section ref={ref} style={{ background: "#020617", padding: "clamp(100px, 15vw, 150px) clamp(20px, 5vw, 40px)", position: "relative", overflow: "hidden" }}>
      <motion.div style={{ y: bgY, position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(29,78,216,0.06) 0%, transparent 55%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div style={{ y: headerY, opacity: headerO }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(60px, 10vw, 90px)" }}>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 54px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc", marginBottom: "clamp(12px, 2vw, 20px)" }}>
              Everything you need to hire<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>with confidence</span>
            </h2>
            <p style={{ color: "#64748b", fontSize: "clamp(14px, 2vw, 17px)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
              A unified platform that replaces your ATS, sourcing tools, and interview infrastructure—all powered by AI.
            </p>
          </div>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(18px, 3vw, 22px)" }}>
          {features.map((f, i) => <TiltCard key={f.title} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function FloatingChip({ top, left, right, delay, icon, label }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.6 }} style={{ position: "absolute", top, left, right, background: "rgba(3,8,20,0.85)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#60a5fa", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", animation: "float-chip 3s ease-in-out infinite", animationDelay: `${delay * 1000}ms` }}>
      <span>{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
}

function AvatarSpotlightSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const avatarY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={ref} style={{ background: "#020617", padding: "140px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 65% 50%, rgba(29,78,216,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent)" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 80px", display: "flex", alignItems: "center", gap: 80 }}>
        <motion.div style={{ y: textY }} initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} style={{ flex: "0 0 44%", maxWidth: 480 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 9999, padding: "5px 16px", fontSize: 11, fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />AI AVATAR INTERVIEWS
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f8fafc", marginBottom: 20 }}>
            AI Avatar Interviews<br /><span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>that scale with your hiring</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
            Candidates complete structured voice interviews with an AI Avatar — anytime, from anywhere. The interview follows your job requirements and produces a clear evaluation summary.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
            {["Available 24/7 — no scheduling delays", "Standardized questions aligned to the job", "Faster screening without exhausting HR teams", "Professional candidate experience"].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 9 9"><polyline points="1,4.5 3.5,7 8,1.5" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ color: "#94a3b8", fontSize: 14 }}>{t}</span>
              </motion.div>
            ))}
          </div>
          <motion.a href="https://mawahib.ai/request-campaign" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(59,130,246,0.45)" }} whileTap={{ scale: 0.97 }} style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'Sora', sans-serif", boxShadow: "0 4px 20px rgba(29,78,216,0.4)", letterSpacing: "-0.01em", textDecoration: "none", display: "inline-block" }}>
            Request Quotation →
          </motion.a>
        </motion.div>

        <motion.div style={{ y: avatarY, flex: 1, height: 560, position: "relative" }} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(59,130,246,0.25)", boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}>
            <video src="/videos/mawahib-v.mp4" controls preload="metadata" style={{ width: "100%", borderRadius: 24 }} />
          </div>
          <FloatingChip top="18%" left="-8%" delay={0} icon="📊" label="Scoring Model" />
          <FloatingChip top="60%" left="-12%" delay={0.5} icon="🎯" label="92% Accuracy" />
          <FloatingChip top="20%" right="-4%" delay={0.3} icon="🌐" label="24/7 Available" />
          <FloatingChip top="65%" right="-6%" delay={0.8} icon="⚡" label="Instant Ranking" />
          <motion.div initial={{ opacity: 0, y: 20, x: 30 }} animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}} transition={{ delay: 0.9, duration: 0.7 }} style={{ position: "absolute", bottom: "12%", right: "-4%", background: "rgba(3,8,20,0.92)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 16, padding: "16px 20px", backdropFilter: "blur(20px)", minWidth: 200, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
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
          <div style={{ position: "absolute", bottom: "14%", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} style={{ width: 3, background: "#3b82f6", borderRadius: 2, animation: `wave-eq ${0.4 + i * 0.1}s ease-in-out infinite alternate`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, letterSpacing: "0.06em" }}>AI SPEAKING</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
              {[5, 4, 3, 4, 5].map((_, i) => (
                <div key={i} style={{ width: 3, background: "#3b82f6", borderRadius: 2, animation: `wave-eq ${0.4 + i * 0.12}s ease-in-out infinite alternate`, animationDelay: `${i * 0.1 + 0.4}s` }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustpilotSection() {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reviews = [
    { name: "Sarah Johnson", role: "HR Director, TechCorp", rating: 5, text: "Mawahib transformed our hiring process. We cut time-to-hire by 60% and found better candidates." },
    { name: "Michael Chen", role: "Founder, StartupXYZ", rating: 5, text: "The AI interviews are incredibly efficient. Candidates love the flexibility and we get better data." },
    { name: "Emma Williams", role: "Talent Lead, FinanceHub", rating: 5, text: "Finally, a hiring platform that actually delivers on its promises. The scoring system is game-changing." }
  ];
  return (
    <section ref={ref} style={{ background: "#020617", padding: "clamp(80px, 12vw, 120px) clamp(20px, 5vw, 40px)", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: "clamp(50px, 8vw, 70px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <img src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-white.svg" alt="Trustpilot" style={{ height: "clamp(20px, 3vw, 28px)" }} />
            <div style={{ display: "flex", gap: 4 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="clamp(18px, 3vw, 24px)" height="clamp(18px, 3vw, 24px)" viewBox="0 0 24 24" fill="#00b67a">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>
          <p style={{ color: "#64748b", fontSize: "clamp(13px, 2vw, 15px)" }}>
            Rated <strong style={{ color: "#00b67a" }}>Excellent</strong> by our customers
          </p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(20px, 3vw, 24px)", marginBottom: "clamp(40px, 6vw, 50px)" }}>
          {reviews.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15, duration: 0.7 }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "clamp(24px, 4vw, 32px)", position: "relative" }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[...Array(r.rating)].map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#00b67a">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "clamp(13px, 2vw, 14px)", lineHeight: 1.7, marginBottom: 16 }}>"{r.text}"</p>
              <div>
                <p style={{ fontWeight: 600, fontSize: "clamp(13px, 2vw, 14px)", color: "#f1f5f9" }}>{r.name}</p>
                <p style={{ fontSize: "clamp(11px, 1.8vw, 12px)", color: "#64748b" }}>{r.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8, duration: 0.8 }} style={{ textAlign: "center" }}>
          <motion.a href="https://www.trustpilot.com/review/mawahib.ai" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(0,182,122,0.3)" }} whileTap={{ scale: 0.97 }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,182,122,0.1)", border: "1px solid rgba(0,182,122,0.3)", borderRadius: 10, padding: "clamp(10px, 2vw, 12px) clamp(20px, 3vw, 24px)", fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 600, color: "#00b67a", textDecoration: "none", fontFamily: "'Sora', sans-serif" }}>
            View all reviews on Trustpilot
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.94, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section ref={ref} style={{ background: "#020617", padding: "clamp(100px, 15vw, 120px) clamp(20px, 5vw, 40px)", position: "relative", overflow: "hidden" }}>
      <motion.div style={{ y: bgY, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "clamp(400px, 60vw, 600px)", height: "clamp(400px, 60vw, 600px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 65%)", pointerEvents: "none", filter: "blur(40px)" }} />
      <motion.div style={{ scale, opacity: ctaOpacity, maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,78,216,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 9999, padding: "5px 16px", fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 600, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: "clamp(20px, 3vw, 28px)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block" }} />NOW ACCEPTING TEAMS
        </div>
        <h2 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#f8fafc", marginBottom: "clamp(16px, 3vw, 24px)" }}>
          Start hiring smarter<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>from day one</span>
        </h2>
        <p style={{ color: "#64748b", fontSize: "clamp(15px, 2.5vw, 18px)", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto clamp(36px, 6vw, 48px)" }}>
          Join thousands of teams using Mawahib to transform their hiring process. Simple setup. Transparent pricing.
        </p>
        <div style={{ display: "flex", gap: "clamp(10px, 2vw, 12px)", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.a href="https://mawahib.ai/request-campaign" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(59,130,246,0.5)" }} whileTap={{ scale: 0.97 }} style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 14, padding: "clamp(14px, 2vw, 16px) clamp(28px, 4vw, 36px)", fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 700, color: "#fff", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em", boxShadow: "0 4px 24px rgba(29,78,216,0.4)", textDecoration: "none", display: "inline-block" }}>Request Quotation →</motion.a>
          <motion.a href="https://wa.me/962798056152" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04, borderColor: "rgba(59,130,246,0.4)", background: "rgba(59,130,246,0.08)" }} whileTap={{ scale: 0.97 }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "clamp(14px, 2vw, 16px) clamp(28px, 4vw, 32px)", fontSize: "clamp(13px, 2vw, 15px)", fontWeight: 600, color: "#94a3b8", fontFamily: "'Sora', sans-serif", backdropFilter: "blur(10px)", transition: "all 0.3s ease", textDecoration: "none", display: "inline-block" }}>Contact Sales</motion.a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  const links = {
    Product: ["Features", "How It Works", "Pricing"],
    Company: ["About", "Blog", "Careers"],
    Legal: ["Privacy", "Terms", "Security"],
    Resources: ["Docs", "Sample Report", "Support"]
  };
  return (
    <footer style={{ background: "#020617", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(60px, 10vw, 80px) clamp(20px, 5vw, 40px) clamp(30px, 5vw, 40px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "clamp(30px, 5vw, 40px)", marginBottom: "clamp(40px, 8vw, 64px)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
  <img
    src="/logo-m.png"
    alt="Mawahib"
    style={{
      height: "clamp(132px, 5vw, 148px)",   // control size here
      width: "auto",
      objectFit: "contain",
    }}
  />
</div>
            <p style={{ color: "#475569", fontSize: "clamp(12px, 2vw, 13px)", lineHeight: 1.75, maxWidth: 240 }}>AI-powered hiring intelligence. Shortlist, interview, and rank candidates with confidence and speed.</p>
          </div>
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p style={{ fontSize: "clamp(10px, 1.5vw, 11px)", fontWeight: 700, color: "#475569", letterSpacing: "0.1em", marginBottom: "clamp(16px, 3vw, 20px)" }}>{section.toUpperCase()}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(10px, 2vw, 12px)" }}>
                {items.map(item => (
                  <a key={item} href="#" style={{ color: "#64748b", fontSize: "clamp(12px, 2vw, 13px)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#94a3b8"} onMouseLeave={e => e.target.style.color = "#64748b"}>{item}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "clamp(24px, 4vw, 32px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "#334155", fontSize: "clamp(11px, 2vw, 13px)" }}>© 2026 Mawahib LLC. All rights reserved.</p>
          <div style={{ display: "flex", gap: 8 }}>
            {["AI-Powered", "SOC 2 Type II", "GDPR Ready"].map(badge => (
              <span key={badge} style={{ fontSize: "clamp(9px, 1.5vw, 10px)", color: "#475569", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9999, padding: "clamp(3px, 0.5vw, 4px) clamp(8px, 1.5vw, 10px)", letterSpacing: "0.04em" }}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 clamp(20px, 5vw, 40px)", display: "flex", alignItems: "center", justifyContent: "space-between", height: "clamp(56px, 10vw, 64px)", background: scrolled ? "rgba(2,6,23,0.88)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "all 0.4s ease" }}>
   <div style={{ display: "flex", alignItems: "center" }}>
  <img
    src="/logo-m.png"
    alt="Mawahib"
    style={{
      height: "clamp(132px, 5vw, 148px)",   // control size here
      width: "auto",
      objectFit: "contain",
    }}
  />
</div>
      <div style={{ display: "flex", gap: "clamp(20px, 4vw, 36px)", alignItems: "center" }}>
        <div style={{ display: window.innerWidth > 768 ? "flex" : "none", gap: "clamp(20px, 4vw, 36px)" }}>
          {["Product", "How It Works", "Pricing"].map(item => (
            <a key={item} href="#" style={{ color: "#64748b", fontSize: "clamp(12px, 2vw, 13px)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#e2e8f0"} onMouseLeave={e => e.target.style.color = "#64748b"}>{item}</a>
          ))}
        </div>
        <motion.a href="https://mawahib.ai/request-campaign" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.97 }} style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 10, padding: "clamp(6px, 1.5vw, 8px) clamp(16px, 3vw, 20px)", fontSize: "clamp(11px, 2vw, 13px)", fontWeight: 700, color: "#fff", fontFamily: "'Sora', sans-serif", boxShadow: "0 2px 12px rgba(29,78,216,0.3)", textDecoration: "none", display: "inline-block" }}>Get Started</motion.a>
      </div>
    </motion.nav>
  );
}

export default function App() {
  return (
    <>
      <FontLink />
      <ScrollingGlobeBackground />
      <GlobalStyles />
      <div className="noise-overlay" />
      <Background3DScene />
      <CustomCursor />
      <ScrollProgressBar />
      <Nav />
      <CVFlowHero />
      <GlobeSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <AvatarSpotlightSection />
      <TrustpilotSection />
      <CTASection />
      <Footer />
    </>
  );
}