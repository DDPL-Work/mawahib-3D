import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── LOGO (base64 embedded — no external file needed) ──────────────────────── */
import LOGO_SRC from "./public/IMG_2041.JPG-removebg-preview.png";
/* ─── Logo component — renders on dark bg so the black surround is invisible ── */
function MawahibLogo({ height = 34 }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Mawahib"
      draggable={false}
      style={{
        height,
        width: "auto",
        display: "block",
        objectFit: "contain",
        /* The logo PNG has a black bg — on our dark surfaces it blends perfectly.
           mix-blend-mode:screen makes the black transparent everywhere. */
        mixBlendMode: "screen",
        filter: "brightness(1.15) contrast(1.05)",
        transition: "filter .3s ease",
        userSelect: "none",
      }}
    />
  );
}

/* ─── FONTS ─────────────────────────────────────────────────────────────────── */
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

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #020617;
      color: #f8fafc;
      font-family: 'Sora', sans-serif;
      overflow-x: hidden;
    }
    @media (min-width: 769px) {
      body { cursor: none; }
      a, button { cursor: none; }
    }
    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: #020617; }
    ::-webkit-scrollbar-thumb { background: #1d4ed8; border-radius: 4px; }

    .noise-overlay {
      position: fixed; inset: 0; pointer-events: none; z-index: 998; opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-size: 128px;
    }

    .grid-bg {
      background-image:
        linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
      background-size: 72px 72px;
    }

    @keyframes shimmer-slide {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .shimmer-text {
      background: linear-gradient(90deg, #93c5fd, #f0f9ff, #3b82f6, #bfdbfe, #93c5fd);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer-slide 6s linear infinite;
    }

    @keyframes scroll-line {
      0% { transform: scaleY(0); transform-origin: top; }
      49% { transform: scaleY(1); transform-origin: top; }
      50% { transform: scaleY(1); transform-origin: bottom; }
      100% { transform: scaleY(0); transform-origin: bottom; }
    }
    @keyframes border-breathe {
      0%,100% { box-shadow: 0 0 0 1px rgba(59,130,246,0.18), 0 0 18px rgba(59,130,246,0.06); }
      50% { box-shadow: 0 0 0 1px rgba(59,130,246,0.42), 0 0 32px rgba(59,130,246,0.15); }
    }
    @keyframes float-y {
      0%,100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes spin-slow { to { transform: rotate(360deg); } }
    @keyframes loader-char {
      0% { opacity: 0; transform: translateY(20px); filter: blur(4px); }
      100% { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes loader-line-in {
      0% { width: 0%; opacity: 0; }
      20% { opacity: 1; }
      100% { width: 100%; opacity: 1; }
    }
    @keyframes ticker-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes pulse-dot {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: .5; transform: scale(.8); }
    }
    /* ── Infinite carousel rows ── */
    @keyframes scroll-left {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes scroll-right {
      0%   { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
    .track-l { animation: scroll-left  40s linear infinite; }
    .track-r { animation: scroll-right 44s linear infinite; }
    .track-l:hover,
    .track-r:hover { animation-play-state: paused; }

    /* ── Card entrance when scrolled into view ── */
    @keyframes card-rise {
      0%   { opacity: 0; transform: translateY(32px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0)   scale(1); }
    }

    /* ── Card glow pulse ── */
    @keyframes card-glow {
      0%,100% { box-shadow: 0 6px 28px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.07); }
      50%      { box-shadow: 0 14px 52px rgba(0,0,0,.55), 0 0 0 1px rgba(0,182,122,.22), 0 0 24px rgba(0,182,122,.06); }
    }

    @media (max-width: 900px) {
      .two-col { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 1024px) {
      .feat-grid { grid-template-columns: repeat(2,1fr) !important; }
    }
    @media (max-width: 600px) {
      .feat-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

/* ─── LOADER ─────────────────────────────────────────────────────────────────── */
function PageLoader({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2400);
    const t2 = setTimeout(() => onDone(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={phase === 1 ? { opacity: 0, y: "-100%" } : {}}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#020617",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 36
      }}>

      {/* Actual brand logo, fades in as whole */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: "clamp(180px,38vw,300px)" }}>
        <MawahibLogo height={156} />
      </motion.div>

      {/* Progress line */}
      <div style={{
        width: "clamp(180px,30vw,320px)", height: 1,
        background: "rgba(255,255,255,0.06)", borderRadius: 1,
        overflow: "hidden", position: "relative"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg,#1d4ed8,#60a5fa)",
          animation: "loader-line-in 1.9s cubic-bezier(0.16,1,0.3,1) forwards",
          animationDelay: "0.4s", width: 0
        }} />
      </div>

      <p style={{ fontSize: 10, color: "#1e293b", letterSpacing: "0.22em", fontWeight: 600 }}>
        AI-POWERED HIRING INTELLIGENCE
      </p>

      <div style={{ position:"absolute", top:28, left:32, fontSize:10, color:"#0f172a", letterSpacing:"0.12em" }}>EST. 2024</div>
      <div style={{ position:"absolute", bottom:28, right:32, fontSize:10, color:"#0f172a", letterSpacing:"0.12em" }}>MAWAHIB.AI</div>

      {/* Spinning ring */}
      <div style={{
        position: "absolute",
        width: "clamp(120px,20vw,200px)", height: "clamp(120px,20vw,200px)",
        border: "1px solid rgba(59,130,246,0.06)",
        borderTop: "1px solid rgba(59,130,246,0.32)",
        borderRadius: "50%",
        animation: "spin-slow 2.5s linear infinite"
      }} />
    </motion.div>
  );
}

/* ─── CUSTOM CURSOR ─────────────────────────────────────────────────────────── */
function CustomCursor() {
  const outer = useRef(null), dot = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 768) return;
    setShow(true);
    const pos = { x:0,y:0 }, lag = { x:0,y:0 };
    let raf;
    const onMove = (e) => {
      pos.x = e.clientX; pos.y = e.clientY;
      if (dot.current) { dot.current.style.left = `${e.clientX}px`; dot.current.style.top = `${e.clientY}px`; }
    };
    const loop = () => {
      lag.x += (pos.x-lag.x)*.09; lag.y += (pos.y-lag.y)*.09;
      if (outer.current) { outer.current.style.left=`${lag.x}px`; outer.current.style.top=`${lag.y}px`; }
      raf = requestAnimationFrame(loop);
    };
    const onOver = (e) => {
      if (!e.target.closest("a,button,[data-hover]")) return;
      if (outer.current) { outer.current.style.width="52px"; outer.current.style.height="52px"; outer.current.style.borderColor="rgba(96,165,250,0.65)"; outer.current.style.background="rgba(59,130,246,0.06)"; }
      if (dot.current) dot.current.style.opacity="0";
    };
    const onOut = () => {
      if (outer.current) { outer.current.style.width="34px"; outer.current.style.height="34px"; outer.current.style.borderColor="rgba(59,130,246,0.35)"; outer.current.style.background="transparent"; }
      if (dot.current) dot.current.style.opacity="1";
    };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseover",onOver);
    window.addEventListener("mouseout",onOut);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseover",onOver); window.removeEventListener("mouseout",onOut); cancelAnimationFrame(raf); };
  }, []);
  if (!show) return null;
  return (
    <>
      <div ref={outer} style={{position:"fixed",pointerEvents:"none",zIndex:9999,width:34,height:34,borderRadius:"50%",border:"1px solid rgba(59,130,246,0.35)",background:"transparent",transform:"translate(-50%,-50%)",left:0,top:0,transition:"width .28s cubic-bezier(0.16,1,0.3,1),height .28s,border-color .28s,background .28s"}} />
      <div ref={dot} style={{position:"fixed",pointerEvents:"none",zIndex:9999,width:4,height:4,borderRadius:"50%",background:"#60a5fa",transform:"translate(-50%,-50%)",left:0,top:0,boxShadow:"0 0 8px rgba(96,165,250,0.9)",transition:"opacity .2s"}} />
    </>
  );
}

/* ─── SCROLL PROGRESS ───────────────────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:100, damping:30 });
  return <motion.div style={{position:"fixed",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,#1e3a8a,#3b82f6,#93c5fd)",transformOrigin:"left",scaleX,zIndex:1000,boxShadow:"0 0 10px rgba(59,130,246,0.55)"}} />;
}

/* ─── GLOBE ─────────────────────────────────────────────────────────────────── */
function GlobeScene() {
  const grp = useRef();
  const { particlePositions, linePositions, nodePositions } = useMemo(() => {
    const N=3000,pPos=new Float32Array(N*3),pCol=new Float32Array(N*3);
    for(let i=0;i<N;i++){const phi=Math.acos(2*Math.random()-1),theta=Math.random()*Math.PI*2,r=2+Math.random()*.02;pPos[i*3]=r*Math.sin(phi)*Math.cos(theta);pPos[i*3+1]=r*Math.cos(phi);pPos[i*3+2]=r*Math.sin(phi)*Math.sin(theta);const t=Math.pow(Math.random(),2);pCol[i*3]=.15+t*.35;pCol[i*3+1]=.4+t*.4;pCol[i*3+2]=.85+t*.15;}
    const linePts=[],numLines=6;
    for(let l=0;l<numLines;l++){const axis=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),perp=new THREE.Vector3(1,0,0).cross(axis).normalize();for(let i=0;i<=128;i++){const angle=(i/128)*Math.PI*2,pt=perp.clone().applyAxisAngle(axis,angle).multiplyScalar(2.06);linePts.push(pt.x,pt.y,pt.z);}}
    const nodes=[];for(let i=0;i<28;i++){const phi=Math.acos(2*Math.random()-1),theta=Math.random()*Math.PI*2;nodes.push(2.04*Math.sin(phi)*Math.cos(theta),2.04*Math.cos(phi),2.04*Math.sin(phi)*Math.sin(theta));}
    return {particlePositions:{pos:pPos,col:pCol},linePositions:new Float32Array(linePts),nodePositions:new Float32Array(nodes)};
  }, []);
  useFrame(s=>{const t=s.clock.getElapsedTime();if(grp.current){grp.current.rotation.y=t*.055;grp.current.rotation.x=Math.sin(t*.03)*.06;}});
  return (
    <group ref={grp}>
      <mesh><sphereGeometry args={[1.93,64,64]}/><meshStandardMaterial color="#020f2a" transparent opacity={0.96} roughness={0.9} metalness={0.1}/></mesh>
      <mesh><sphereGeometry args={[1.95,24,24]}/><meshStandardMaterial color="#1d4ed8" wireframe transparent opacity={0.03}/></mesh>
      <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particlePositions.pos,3]}/><bufferAttribute attach="attributes-color" args={[particlePositions.col,3]}/></bufferGeometry><pointsMaterial size={0.018} vertexColors transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/></points>
      <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[linePositions,3]}/></bufferGeometry><pointsMaterial size={0.008} color="#3b82f6" transparent opacity={0.22} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/></points>
      <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[nodePositions,3]}/></bufferGeometry><pointsMaterial size={0.04} color="#60a5fa" transparent opacity={0.65} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/></points>
      <mesh><sphereGeometry args={[2.15,32,32]}/><meshStandardMaterial color="#1d4ed8" transparent opacity={0.04} side={THREE.BackSide} blending={THREE.AdditiveBlending}/></mesh>
    </group>
  );
}

function Globe() {
  const { scrollYProgress } = useScroll();
  const rawY = useTransform(scrollYProgress,[0,1],[0,900]);
  const y = useSpring(rawY,{stiffness:60,damping:20});
  const scale = useTransform(scrollYProgress,[0,.2,.5,.8,1],[.9,1.15,1.05,1.1,.75]);
  const opacity = useTransform(scrollYProgress,[0,.06,.2,.78,.93,1],[0,.5,1,1,.4,0]);
  const [ok,setOk]=useState(false);
  useEffect(()=>{const fn=()=>setOk(window.innerWidth>900);fn();window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  if(!ok)return null;
  return (
    <motion.div style={{position:"fixed",top:"10%",right:"2%",width:"clamp(280px,38vw,560px)",height:"clamp(280px,38vw,560px)",zIndex:1,pointerEvents:"none",y,scale,opacity}}>
      <div style={{position:"absolute",inset:"-20%",borderRadius:"50%",background:"radial-gradient(circle,rgba(29,78,216,.2) 0%,transparent 65%)",filter:"blur(80px)"}}/>
      <Canvas camera={{position:[0,0,6.5],fov:42}} style={{width:"100%",height:"100%"}}>
        <ambientLight intensity={0.35}/>
        <pointLight position={[5,4,5]} intensity={1.2} color="#3b82f6"/>
        <pointLight position={[-4,-3,-4]} intensity={0.6} color="#1e3a8a"/>
        <pointLight position={[0,5,2]} intensity={0.4} color="#93c5fd"/>
        <GlobeScene/>
      </Canvas>
    </motion.div>
  );
}

/* ─── AMBIENT BG ─────────────────────────────────────────────────────────────── */
function AmbientBg() {
  const { scrollYProgress } = useScroll();
  const bg = useTransform(scrollYProgress,[0,.2,.4,.6,.8,1],[
    "radial-gradient(ellipse 75% 55% at 55% 15%,rgba(29,78,216,.12) 0%,transparent 60%)",
    "radial-gradient(ellipse 65% 60% at 20% 38%,rgba(37,99,235,.09) 0%,transparent 65%)",
    "radial-gradient(ellipse 85% 50% at 68% 28%,rgba(29,78,216,.08) 0%,transparent 62%)",
    "radial-gradient(ellipse 60% 65% at 32% 52%,rgba(30,58,138,.11) 0%,transparent 68%)",
    "radial-gradient(ellipse 75% 55% at 58% 38%,rgba(37,99,235,.09) 0%,transparent 62%)",
    "radial-gradient(ellipse 70% 50% at 50% 28%,rgba(29,78,216,.07) 0%,transparent 60%)",
  ]);
  return <motion.div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:bg}}/>;
}

/* ─── TICKER ─────────────────────────────────────────────────────────────────── */
function Ticker() {
  const items=["AI-Powered Hiring","190+ Countries","92% Accuracy","24/7 AI Interviews","Structured Scoring","Instant Ranking","Bias-Reduced","Global Talent"];
  const doubled=[...items,...items];
  return (
    <div style={{overflow:"hidden",borderTop:"1px solid rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)",background:"rgba(15,23,42,0.6)",padding:"13px 0",zIndex:10}}>
      <div style={{display:"flex",animation:"ticker-scroll 22s linear infinite",width:"max-content"}}>
        {doubled.map((t,i)=>(
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:14,padding:"0 28px",fontSize:10,fontWeight:600,color:"#334155",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>
            <span style={{width:4,height:4,borderRadius:"50%",background:"#1d4ed8",display:"inline-block"}}/>
            {t.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── NAV ────────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  return (
    <motion.nav
      initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:.9,ease:[.16,1,.3,1]}}
      style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        height:64, padding:"0 clamp(20px,5vw,52px)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(2,6,23,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(32px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition:"all .5s cubic-bezier(.16,1,.3,1)"
      }}>

      {/* ── Logo ── */}
      <a href="/" style={{display:"flex",alignItems:"center",textDecoration:"none",lineHeight:1}}
         onMouseEnter={e=>e.currentTarget.querySelector("img").style.filter="brightness(1.3) contrast(1.08)"}
         onMouseLeave={e=>e.currentTarget.querySelector("img").style.filter="brightness(1.15) contrast(1.05)"}>
        {/* Wrap in a small dark pill so on any bg the logo reads cleanly */}
        <div style={{
          // background:"rgba(2,8,23,0.55)",
          // backdropFilter:"blur(22px)",
          borderRadius:10,
          padding:"3px 8px 3px 4px",
          // border:"1px solid rgba(255,255,255,0.06)"
        }}>
          <MawahibLogo height={180} width={120}/>
        </div>
      </a>

      {/* ── CTA ── */}
      <div style={{display:"flex",alignItems:"center",gap:"clamp(14px,2.5vw,28px)"}}>
        <motion.a
          href="https://mawahib.ai/request-campaign"
          target="_blank" rel="noopener noreferrer"
          whileHover={{scale:1.04,boxShadow:"0 0 28px rgba(59,130,246,.45)"}}
          whileTap={{scale:.97}}
          style={{background:"linear-gradient(145deg,#2563eb,#1d4ed8)",borderRadius:9,padding:"7px 18px",fontSize:13,fontWeight:700,color:"#fff",textDecoration:"none",display:"inline-block",boxShadow:"0 4px 14px rgba(29,78,216,.4)"}}>
          Get Started
        </motion.a>
      </div>
    </motion.nav>
  );
}

/* ─── LABEL ──────────────────────────────────────────────────────────────────── */
function Label({children,color="#60a5fa",bg="rgba(29,78,216,0.1)",border="rgba(59,130,246,0.22)"}) {
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:8,background:bg,border:`1px solid ${border}`,borderRadius:9999,padding:"5px 16px",fontSize:11,fontWeight:600,color,letterSpacing:"0.1em",marginBottom:26}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:color,display:"inline-block",boxShadow:`0 0 8px ${color}`}}/>
      {children}
    </div>
  );
}

/* ─── ANIMATED COUNT ─────────────────────────────────────────────────────────── */
function AnimatedCount({value,suffix=""}) {
  const ref=useRef();
  const inView=useInView(ref,{once:true});
  const [disp,setDisp]=useState("0");
  useEffect(()=>{
    if(!inView)return;
    const num=parseFloat(value);
    if(isNaN(num)){setDisp(value);return;}
    const dur=1800,start=Date.now();
    const step=()=>{const p=Math.min((Date.now()-start)/dur,1),ease=1-Math.pow(1-p,3),cur=Math.round(ease*num);setDisp(cur+suffix);if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  },[inView,value,suffix]);
  return <span ref={ref}>{disp}</span>;
}

/* ─── HERO ───────────────────────────────────────────────────────────────────── */
function HeroSection() {
  const ref=useRef();
  const {scrollYProgress}=useScroll({target:ref,offset:["start start","end start"]});
  const textY=useTransform(scrollYProgress,[0,1],[0,90]);
  const bgScale=useTransform(scrollYProgress,[0,1],[1,1.08]);
  const opacity=useTransform(scrollYProgress,[0,.6],[1,0]);
  return (
    <section ref={ref} style={{position:"relative",minHeight:"100vh",width:"100%",display:"flex",alignItems:"center",justifyContent:"flex-start",overflow:"hidden"}}>
      <motion.div style={{scale:bgScale,position:"absolute",inset:0,zIndex:0}}>
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&q=80" alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(55%) brightness(0.17)"}}/>
      </motion.div>
      <div style={{position:"absolute",inset:0,zIndex:1,background:"linear-gradient(105deg,rgba(2,6,23,.94) 0%,rgba(2,6,23,.55) 55%,rgba(2,6,23,.18) 100%)"}}/>
      <div className="grid-bg" style={{position:"absolute",inset:0,zIndex:2,opacity:.35}}/>
      <div style={{position:"absolute",inset:0,zIndex:3,pointerEvents:"none",background:"radial-gradient(ellipse 100% 80% at 25% 50%,transparent 40%,rgba(2,6,23,.65) 100%)"}}/>

      <motion.div style={{y:textY,opacity,position:"relative",zIndex:10,padding:"0 clamp(24px,6vw,96px)",maxWidth:"clamp(400px,52vw,700px)",paddingTop:80}}>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.16,1,.3,1]}}>
          <Label>AI-POWERED HIRING INTELLIGENCE</Label>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:1,delay:.12,ease:[.16,1,.3,1]}}
          style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(3.2rem,6.5vw,6.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.04,marginBottom:8,color:"#f8fafc"}}>
          Hiring.
        </motion.h1>
        <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:1,delay:.22,ease:[.16,1,.3,1]}}
          style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(3.2rem,6.5vw,6.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.04,marginBottom:32}}>
          <span className="shimmer-text" style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic"}}>Re-engineered.</span>
        </motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.36,ease:[.16,1,.3,1]}}
          style={{color:"#64748b",fontSize:"clamp(15px,1.8vw,18px)",lineHeight:1.78,marginBottom:44,maxWidth:520}}>
          AI-powered candidate intelligence for modern teams. Automate screening, conduct structured interviews, and surface your best candidates — all without manual effort.
        </motion.p>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.5,ease:[.16,1,.3,1]}}
          style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <motion.a href="https://mawahib.ai/request-campaign" target="_blank"
            whileHover={{scale:1.04,boxShadow:"0 0 50px rgba(37,99,235,.5)"}} whileTap={{scale:.97}}
            style={{background:"linear-gradient(145deg,#2563eb,#1d4ed8)",padding:"14px 30px",borderRadius:12,fontSize:14,fontWeight:700,color:"#fff",textDecoration:"none",display:"inline-block",boxShadow:"0 0 28px rgba(37,99,235,.3)"}}>
            Request Demo
          </motion.a>
          <motion.a href="https://wa.me/962798056152" target="_blank"
            whileHover={{scale:1.04,background:"rgba(255,255,255,.08)"}} whileTap={{scale:.97}}
            style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",backdropFilter:"blur(16px)",padding:"14px 30px",borderRadius:12,fontSize:14,fontWeight:600,color:"#94a3b8",textDecoration:"none",display:"inline-block"}}>
            See How It Works
          </motion.a>
        </motion.div>
      </motion.div>

      <div style={{position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,zIndex:10}}>
        <span style={{fontSize:9,color:"#1e293b",letterSpacing:"0.14em"}}>SCROLL</span>
        <div style={{width:1,height:52,background:"#0f172a",overflow:"hidden",borderRadius:1}}>
          <div style={{width:"100%",height:"100%",background:"linear-gradient(to bottom,#3b82f6,transparent)",animation:"scroll-line 2.4s ease-in-out infinite"}}/>
        </div>
      </div>
    </section>
  );
}

/* ─── PROBLEM SECTION ────────────────────────────────────────────────────────── */
function ProblemSection() {
  const ref=useRef();
  const inView=useInView(ref,{once:true,amount:.08});
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const imgY=useTransform(scrollYProgress,[0,1],[40,-60]);
  const blocks=[
    {title:"Manual CV screening",desc:"Hundreds of applications. No signal. Recruiters spend 70% of their time reading, sorting, and discarding — without a clear framework."},
    {title:"Subjective decisions",desc:"Gut feelings replace structured evaluation. Bias compounds. The best candidate often isn't who you think they are without data."},
    {title:"Slow interview cycles",desc:"Scheduling, rescheduling, repetitive questions. A process that should take days stretches into weeks — and you lose candidates along the way."},
  ];
  return (
    <section ref={ref} style={{position:"relative",padding:"clamp(80px,12vw,140px) clamp(24px,6vw,96px)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(239,68,68,.1),transparent)"}}/>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(40px,7vw,90px)",alignItems:"center"}} className="two-col">
        <motion.div style={{y:imgY,position:"relative"}} initial={{opacity:0,x:-40}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:1.1,ease:[.16,1,.3,1]}}>
          <div style={{borderRadius:28,overflow:"hidden",aspectRatio:"3/4",boxShadow:"0 60px 120px rgba(0,0,0,.7)",position:"relative"}}>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80" alt="Recruiter" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.65) saturate(.7)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(239,68,68,.15) 0%,rgba(2,6,23,.6) 60%,rgba(2,6,23,.95) 100%)"}}/>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"rgba(239,68,68,.25)"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"rgba(239,68,68,.25)"}}/>
          </div>
          <motion.div initial={{opacity:0,x:30,y:20}} animate={inView?{opacity:1,x:0,y:0}:{}} transition={{delay:.4,duration:.9,ease:[.16,1,.3,1]}}
            style={{position:"absolute",bottom:"-8%",right:"-12%",width:"55%",aspectRatio:"4/3",borderRadius:20,overflow:"hidden",boxShadow:"0 30px 80px rgba(0,0,0,.6)",border:"2px solid rgba(255,255,255,.06)"}}>
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80" alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.6) saturate(.6)"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(2,6,23,.45)"}}/>
          </motion.div>
        </motion.div>

        <motion.div initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:1,delay:.1,ease:[.16,1,.3,1]}}>
          <Label color="#f87171" bg="rgba(239,68,68,.08)" border="rgba(239,68,68,.2)">THE PROBLEM</Label>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2.2rem,4vw,4.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.08,color:"#f8fafc",marginBottom:20}}>
            Hiring is <span style={{color:"#f87171"}}>broken.</span>
          </h2>
          <p style={{color:"#475569",fontSize:"clamp(14px,1.6vw,16px)",lineHeight:1.82,marginBottom:48}}>
            Most companies rely on manual reviews, subjective opinions, and fragmented processes. The cost isn't just efficiency — it's the best candidates slipping through the cracks.
          </p>
          <div style={{display:"flex",flexDirection:"column"}}>
            {blocks.map((b,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.25+i*.15,duration:.7,ease:[.16,1,.3,1]}}
                style={{padding:"24px 0",borderBottom:i<blocks.length-1?"1px solid rgba(255,255,255,.05)":"none"}}>
                <div style={{display:"flex",alignItems:"baseline",gap:16,marginBottom:8}}>
                  <span style={{fontSize:11,color:"#1e3a8a",fontWeight:700,letterSpacing:".06em",minWidth:24}}>0{i+1}</span>
                  <h3 style={{fontSize:"clamp(14px,1.7vw,17px)",fontWeight:700,color:"#e2e8f0",letterSpacing:"-.02em"}}>{b.title}</h3>
                </div>
                <p style={{color:"#475569",fontSize:"clamp(12px,1.3vw,14px)",lineHeight:1.78,paddingLeft:40}}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── GLOBAL SECTION ─────────────────────────────────────────────────────────── */
function GlobalSection() {
  const ref=useRef();
  const inView=useInView(ref,{once:true,amount:.08});
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const textY=useTransform(scrollYProgress,[0,1],[30,-30]);
  const stats=[{val:190,suffix:"+",label:"Countries"},{val:92,suffix:"%",label:"Accuracy"},{val:10,suffix:"x",label:"Faster Hiring"}];
  return (
    <section ref={ref} style={{position:"relative",padding:"clamp(80px,12vw,140px) clamp(24px,6vw,96px)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(59,130,246,.14),transparent)"}}/>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(50px,9vw,110px)",alignItems:"center"}} className="two-col">
        <motion.div style={{y:textY}} initial={{opacity:0,x:-30}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:1,ease:[.16,1,.3,1]}}>
          <Label>GLOBAL REACH</Label>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2.2rem,4vw,4.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.08,color:"#f8fafc",marginBottom:20}}>
            Global Talent. <span style={{color:"#93c5fd"}}>Structured Insight.</span>
          </h2>
          <p style={{color:"#475569",fontSize:"clamp(14px,1.6vw,16px)",lineHeight:1.82,marginBottom:48}}>
            Mawahib evaluates, ranks, and presents the best candidates in minutes — not weeks. Every decision backed by structured data.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24,marginBottom:48}}>
            {stats.map((s,i)=>(
              <motion.div key={s.label} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.2+i*.12,duration:.7,ease:[.16,1,.3,1]}} style={{padding:"18px 0",borderTop:"1px solid rgba(59,130,246,.15)"}}>
                <div style={{fontSize:"clamp(24px,3vw,36px)",fontWeight:800,letterSpacing:"-.04em",color:"#f8fafc",lineHeight:1,marginBottom:6}}><AnimatedCount value={s.val} suffix={s.suffix}/></div>
                <div style={{fontSize:11,color:"#475569",fontWeight:600,letterSpacing:".04em"}}>{s.label}</div>
              </motion.div>
            ))}
          </div>
          {["Smart AI Screening & Matching","Structured Scoring Model","Risk & Stability Analysis","Interview Automation Built-In"].map((item,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-12}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.4+i*.1,duration:.6,ease:[.16,1,.3,1]}}
              style={{display:"flex",alignItems:"center",gap:14,padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <div style={{width:24,height:1,background:"#1d4ed8",flexShrink:0}}/>
              <span style={{color:"#94a3b8",fontSize:"clamp(12px,1.4vw,14px)",fontWeight:500}}>{item}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{opacity:0,x:40}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:1.2,delay:.15,ease:[.16,1,.3,1]}} style={{position:"relative"}}>
          <div style={{borderRadius:28,overflow:"hidden",aspectRatio:"4/5",boxShadow:"0 80px 160px rgba(0,0,0,.65)",position:"relative"}}>
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80" alt="Team" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.6) saturate(.65)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(29,78,216,.3) 0%,transparent 50%,rgba(2,6,23,.7) 100%)"}}/>
            {[{val:"190+",lbl:"Countries",pos:{top:"14%",left:"clamp(12px,2.5vw,20px)"}},{val:"92%",lbl:"AI Accuracy",pos:{top:"46%",right:"clamp(12px,2.5vw,20px)"}},{val:"AI",lbl:"Ranked Shortlists",pos:{bottom:"14%",left:"clamp(12px,2.5vw,20px)"}}].map(({val,lbl,pos},i)=>(
              <motion.div key={lbl} initial={{opacity:0,scale:.85}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.6+i*.18,duration:.7,ease:[.16,1,.3,1]}}
                style={{position:"absolute",...pos,background:"rgba(2,6,23,.9)",border:"1px solid rgba(59,130,246,.28)",borderRadius:14,padding:"14px 20px",backdropFilter:"blur(24px)",boxShadow:"0 14px 40px rgba(0,0,0,.5)",animation:"border-breathe 4s ease-in-out infinite",animationDelay:`${i*1.3}s`}}>
                <div style={{fontSize:"clamp(20px,2.5vw,28px)",fontWeight:800,color:"#f8fafc",letterSpacing:"-.04em",lineHeight:1}}>{val}</div>
                <div style={{fontSize:11,color:"#3b82f6",fontWeight:600,marginTop:4,letterSpacing:".04em"}}>{lbl}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── VIDEO SECTION ──────────────────────────────────────────────────────────── */
function VideoSection() {
  const ref=useRef(),videoRef=useRef();
  const inView=useInView(ref,{once:false,amount:.55});
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const scale=useTransform(scrollYProgress,[0,.3,.7,1],[.92,1,1,.92]);
  const [muted,setMuted]=useState(true);
  useEffect(()=>{if(!videoRef.current)return;if(inView){videoRef.current.play().catch(()=>{});}else{videoRef.current.pause();}},[inView]);
  return (
    <section ref={ref} style={{position:"relative",padding:"clamp(60px,10vw,120px) clamp(24px,6vw,96px)",overflow:"hidden",background:"rgba(15,23,42,.45)"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(59,130,246,.12),transparent)"}}/>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.9,ease:[.16,1,.3,1]}} style={{textAlign:"center",marginBottom:48}}>
          <Label>AI AVATAR IN ACTION</Label>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2.2rem,4vw,4.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.08,color:"#f8fafc",marginBottom:16}}>
            Interviews that <span style={{color:"#93c5fd"}}>scale with you.</span>
          </h2>
          <p style={{color:"#475569",fontSize:"clamp(14px,1.6vw,16px)",lineHeight:1.8,maxWidth:520,margin:"0 auto"}}>
            Watch the AI avatar conduct a real structured interview. Available 24/7, no scheduling required.
          </p>
        </motion.div>
        <motion.div style={{scale}} initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:1,delay:.2,ease:[.16,1,.3,1]}}>
          <div style={{borderRadius:28,overflow:"hidden",position:"relative",boxShadow:"0 60px 140px rgba(0,0,0,.7)",border:"1px solid rgba(59,130,246,.18)"}}>
            <video ref={videoRef} src="./videos/mawahib-v.mp4" loop muted={muted} playsInline
              style={{width:"100%",display:"block"}}
              poster="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80"/>
            <div style={{position:"absolute",top:16,left:16,background:"rgba(2,6,23,.85)",border:"1px solid rgba(59,130,246,.28)",borderRadius:10,padding:"7px 14px",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 10px #22c55e",display:"inline-block",animation:"pulse-dot 1.8s ease-in-out infinite"}}/>
              <span style={{fontSize:11,fontWeight:700,color:"#60a5fa",letterSpacing:".08em"}}>AI INTERVIEW LIVE</span>
            </div>
            <motion.button whileHover={{scale:1.06}} whileTap={{scale:.95}}
              onClick={()=>{if(!videoRef.current)return;const n=!muted;videoRef.current.muted=n;setMuted(n);}}
              style={{position:"absolute",top:16,right:16,background:"rgba(2,6,23,.85)",border:"1px solid rgba(255,255,255,.12)",borderRadius:10,padding:"7px 14px",backdropFilter:"blur(20px)",fontSize:11,fontWeight:700,color:"#94a3b8",display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
              {muted?"🔇 Unmute":"🔊 Mute"}
            </motion.button>
            <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(to bottom,transparent 60%,rgba(2,6,23,.3) 100%)"}}/>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.5,duration:.8,ease:[.16,1,.3,1]}}
          style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginTop:28}}>
          {["24/7 Available","Structured Scoring","92% Accuracy","Auto Ranking","Multilingual"].map((t,i)=>(
            <span key={i} style={{fontSize:11,fontWeight:600,color:"#475569",border:"1px solid rgba(255,255,255,.07)",borderRadius:9999,padding:"6px 14px",letterSpacing:".06em"}}>{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── INTERVIEW SECTION ──────────────────────────────────────────────────────── */
function InterviewSection() {
  const ref=useRef();
  const inView=useInView(ref,{once:true,amount:.08});
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const imgY=useTransform(scrollYProgress,[0,1],[50,-50]);
  const features=[
    {label:"24/7 AI Interviews",val:98,desc:"Available around the clock. No scheduling required."},
    {label:"Structured Scoring",val:92,desc:"Every answer evaluated against a consistent rubric."},
    {label:"Auto Ranking",val:88,desc:"Candidates ranked by fit, not impression."},
  ];
  return (
    <section ref={ref} style={{position:"relative",padding:"clamp(80px,12vw,140px) clamp(24px,6vw,96px)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(59,130,246,.12),transparent)"}}/>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(50px,9vw,110px)",alignItems:"center"}} className="two-col">
        <motion.div style={{y:imgY,position:"relative"}} initial={{opacity:0,scale:.94}} animate={inView?{opacity:1,scale:1}:{}} transition={{duration:1.1,ease:[.16,1,.3,1]}}>
          <div style={{borderRadius:28,overflow:"hidden",aspectRatio:"3/4",boxShadow:"0 60px 140px rgba(0,0,0,.7)",position:"relative"}}>
            <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80" alt="Candidate" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.7) saturate(.6)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(2,6,23,.9) 100%)"}}/>
            <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.7,duration:.8,ease:[.16,1,.3,1]}}
              style={{position:"absolute",bottom:20,left:20,right:20,background:"rgba(2,6,23,.92)",border:"1px solid rgba(59,130,246,.22)",borderRadius:16,padding:"18px 20px",backdropFilter:"blur(24px)"}}>
              <div style={{fontSize:10,color:"#3b82f6",fontWeight:700,letterSpacing:".12em",marginBottom:12}}>CANDIDATE EVALUATION</div>
              {[["Technical Skills",92],["Communication",87],["Culture Fit",94]].map(([k,v])=>(
                <div key={k} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:11,color:"#64748b"}}>{k}</span>
                    <span style={{fontSize:11,fontWeight:700,color:"#93c5fd"}}>{v}%</span>
                  </div>
                  <div style={{height:1.5,background:"rgba(255,255,255,.06)",borderRadius:1}}>
                    <motion.div initial={{width:"0%"}} animate={inView?{width:`${v}%`}:{}} transition={{delay:.9,duration:1.2,ease:[.16,1,.3,1]}} style={{height:"100%",background:"linear-gradient(90deg,#1d4ed8,#60a5fa)",borderRadius:1}}/>
                  </div>
                </div>
              ))}
              <div style={{paddingTop:10,borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#475569"}}>Overall Score</span>
                <span style={{fontSize:16,fontWeight:800,color:"#f8fafc"}}>91 / 100</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:1,delay:.1,ease:[.16,1,.3,1]}}>
          <Label>AI INTERVIEW SYSTEM</Label>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2.2rem,4vw,4.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.08,color:"#f8fafc",marginBottom:20}}>
            Interviews that <span style={{color:"#93c5fd"}}>scale with you.</span>
          </h2>
          <p style={{color:"#475569",fontSize:"clamp(14px,1.6vw,16px)",lineHeight:1.82,marginBottom:44}}>
            Candidates complete structured voice interviews with an AI avatar — anytime, from anywhere. Produces a clear, comparable evaluation summary.
          </p>
          <div style={{display:"flex",flexDirection:"column"}}>
            {features.map((f,i)=>(
              <motion.div key={f.label} initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.3+i*.14,duration:.7,ease:[.16,1,.3,1]}}
                style={{padding:"22px 0",borderBottom:i<features.length-1?"1px solid rgba(255,255,255,.05)":"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                  <span style={{fontSize:"clamp(14px,1.6vw,16px)",fontWeight:700,color:"#e2e8f0",letterSpacing:"-.02em"}}>{f.label}</span>
                  <span style={{fontSize:12,color:"#3b82f6",fontWeight:700}}>{f.val}%</span>
                </div>
                <p style={{color:"#475569",fontSize:"clamp(12px,1.3vw,13px)",lineHeight:1.7,marginBottom:10}}>{f.desc}</p>
                <div style={{height:1,background:"rgba(255,255,255,.06)",borderRadius:1}}>
                  <motion.div initial={{width:"0%"}} animate={inView?{width:`${f.val}%`}:{}} transition={{delay:.6+i*.14,duration:1.4,ease:[.16,1,.3,1]}} style={{height:"100%",background:"linear-gradient(90deg,#1d4ed8,#3b82f6)",borderRadius:1}}/>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PHOTO STRIP ────────────────────────────────────────────────────────────── */
function PhotoStrip() {
  const ref=useRef();
  const inView=useInView(ref,{once:true,amount:.1});
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const x=useTransform(scrollYProgress,[0,1],[80,-80]);
  const photos=[
    {src:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",h:"clamp(200px,25vw,320px)",delay:0},
    {src:"https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",h:"clamp(260px,32vw,420px)",delay:.08},
    {src:"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",h:"clamp(200px,25vw,320px)",delay:.16},
    {src:"https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",h:"clamp(260px,32vw,420px)",delay:.24},
    {src:"https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",h:"clamp(200px,25vw,320px)",delay:.32},
  ];
  return (
    <section ref={ref} style={{padding:"clamp(40px,8vw,80px) 0",overflow:"hidden"}}>
      <motion.div style={{display:"flex",gap:"clamp(10px,1.5vw,18px)",paddingLeft:"clamp(24px,6vw,96px)",alignItems:"flex-end",x}}>
        {photos.map((p,i)=>(
          <motion.div key={i} initial={{opacity:0,y:50,scale:.94}} animate={inView?{opacity:1,y:0,scale:1}:{}} transition={{delay:p.delay,duration:.9,ease:[.16,1,.3,1]}}
            style={{flexShrink:0,width:"clamp(180px,20vw,280px)",height:p.h,borderRadius:20,overflow:"hidden",boxShadow:"0 40px 80px rgba(0,0,0,.5)",position:"relative"}}>
            <img src={p.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.65) saturate(.7)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 55%,rgba(2,6,23,.65) 100%)"}}/>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── FEATURES ───────────────────────────────────────────────────────────────── */
function FeatureCard({feature,index}) {
  const ref=useRef();
  const inView=useInView(ref,{once:true,amount:.1});
  const rotX=useMotionValue(0),rotY=useMotionValue(0);
  const sRX=useSpring(rotX,{stiffness:200,damping:22}),sRY=useSpring(rotY,{stiffness:200,damping:22});
  const glowRef=useRef();
  const onMove=useCallback((e)=>{
    if(window.innerWidth<=768||!ref.current)return;
    const rect=ref.current.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    rotX.set((-(e.clientY-cy)/(rect.height/2))*9);rotY.set(((e.clientX-cx)/(rect.width/2))*9);
    const px=((e.clientX-rect.left)/rect.width)*100,py=((e.clientY-rect.top)/rect.height)*100;
    if(glowRef.current)glowRef.current.style.background=`radial-gradient(circle at ${px}% ${py}%,rgba(59,130,246,.13) 0%,transparent 60%)`;
  },[rotX,rotY]);
  const onLeave=useCallback(()=>{rotX.set(0);rotY.set(0);if(glowRef.current)glowRef.current.style.background="transparent";},[rotX,rotY]);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.8,delay:feature.delay,ease:[.16,1,.3,1]}} style={{perspective:800}}>
      <motion.div onMouseMove={onMove} onMouseLeave={onLeave}
        style={{rotateX:sRX,rotateY:sRY,transformStyle:"preserve-3d",position:"relative",borderRadius:22,padding:"clamp(26px,3.5vw,36px) clamp(22px,3vw,30px)",background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(20px)",overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.06)"}}
        whileHover={{boxShadow:"0 24px 70px rgba(0,0,0,.55),0 0 0 1px rgba(59,130,246,.35),inset 0 1px 0 rgba(255,255,255,.1)",scale:1.015}} transition={{duration:.35,ease:[.16,1,.3,1]}}>
        <div ref={glowRef} style={{position:"absolute",inset:0,borderRadius:22,pointerEvents:"none",transition:"background .25s"}}/>
        <div style={{position:"absolute",top:0,left:"8%",right:"8%",height:1,background:"linear-gradient(90deg,transparent,rgba(59,130,246,.4),rgba(255,255,255,.08),rgba(59,130,246,.4),transparent)"}}/>
        <div style={{fontSize:11,color:"#1e3a8a",fontWeight:700,letterSpacing:".08em",marginBottom:18}}>0{index+1}</div>
        <h3 style={{fontSize:"clamp(14px,1.6vw,17px)",fontWeight:700,color:"#e2e8f0",marginBottom:12,letterSpacing:"-.025em",transform:"translateZ(12px)",position:"relative"}}>{feature.title}</h3>
        <p style={{fontSize:"clamp(12px,1.3vw,13.5px)",color:"#475569",lineHeight:1.78,transform:"translateZ(8px)",position:"relative"}}>{feature.desc}</p>
      </motion.div>
    </motion.div>
  );
}

function FeaturesSection() {
  const ref=useRef();
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const headerO=useTransform(scrollYProgress,[0,.3],[0,1]);
  const headerY=useTransform(scrollYProgress,[0,.3],[40,0]);
  const features=[
    {title:"AI Candidate Matching",desc:"Neural matching across skills, culture fit, and growth trajectory.",delay:0},
    {title:"Automated Screening",desc:"AI-powered async interviews that screen hundreds simultaneously.",delay:.06},
    {title:"Global Talent Intelligence",desc:"Real-time market data across 190+ countries.",delay:.12},
    {title:"Bias-Reduced Evaluation",desc:"Structured rubrics ensure every candidate is assessed on merit.",delay:.18},
    {title:"Interview Intelligence",desc:"Transcription, sentiment analysis, and scoring in one dataset.",delay:.24},
    {title:"Workforce Analytics",desc:"Hiring funnel metrics, diversity dashboards, predictive retention.",delay:.30},
  ];
  return (
    <section ref={ref} style={{position:"relative",padding:"clamp(80px,12vw,140px) clamp(24px,6vw,96px)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(59,130,246,.1),transparent)"}}/>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <motion.div style={{y:headerY,opacity:headerO,textAlign:"center",marginBottom:"clamp(50px,9vw,80px)"}}>
          <Label>PLATFORM FEATURES</Label>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2.2rem,4vw,4.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.08,color:"#f8fafc",marginBottom:18}}>
            Everything you need to hire <span style={{color:"#93c5fd"}}>with confidence.</span>
          </h2>
          <p style={{color:"#475569",fontSize:"clamp(14px,1.6vw,17px)",maxWidth:520,margin:"0 auto",lineHeight:1.72}}>
            A unified platform replacing your ATS, sourcing tools, and interview infrastructure.
          </p>
        </motion.div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"clamp(12px,2vw,18px)"}} className="feat-grid">
          {features.map((f,i)=><FeatureCard key={f.title} feature={f} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

/* ─── TRUST / REVIEWS (ANIMATED CAROUSEL) ────────────────────────────────────── */
const StarRating = ({n=5,size=14}) => (
  <div style={{display:"flex",gap:2}}>
    {[...Array(n)].map((_,i)=>(
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#00b67a">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

const TrustpilotWordmark = () => (
  <svg viewBox="0 0 110 22" style={{height:18,width:"auto",display:"block",flexShrink:0}}>
    <text x="0" y="17" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="17" fill="#ffffff" letterSpacing="-0.3">Trustpilot</text>
    <rect x="95" y="2" width="14" height="17" rx="2" fill="#00b67a"/>
    <path d="M102 5.5l1.2 2.4 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="white"/>
  </svg>
);

/* Individual card — used in carousel rows */
function ReviewCard({r}) {
  return (
    <div style={{
      flexShrink:0,
      width:"clamp(260px,26vw,340px)",
      background:"rgba(255,255,255,0.032)",
      border:"1px solid rgba(255,255,255,0.09)",
      borderRadius:20,
      padding:"clamp(18px,2.5vw,26px)",
      backdropFilter:"blur(22px)",
      position:"relative",
      overflow:"hidden",
      animation:"card-glow 6s ease-in-out infinite",
      transition:"transform .4s cubic-bezier(.16,1,.3,1)",
    }}
    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-8px) scale(1.015)"}
    onMouseLeave={e=>e.currentTarget.style.transform="translateY(0) scale(1)"}
    >
      {/* top accent */}
      <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,182,122,.32),transparent)"}}/>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <StarRating n={r.rating} size={13}/>
        <span style={{fontSize:9,color:"#334155",letterSpacing:".06em",fontWeight:600}}>{r.date}</span>
      </div>
      <p style={{color:"#94a3b8",fontSize:"clamp(11px,1.15vw,12.5px)",lineHeight:1.74,marginBottom:16,minHeight:60}}>"{r.text}"</p>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(145deg,#1d4ed8,#1e3a8a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>
          {r.name.charAt(0)}
        </div>
        <div>
          <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",lineHeight:1.3}}>{r.name}</p>
          <p style={{fontSize:10,color:"#475569",lineHeight:1.3}}>{r.role}</p>
        </div>
      </div>
    </div>
  );
}

function TrustSection() {
  const ref=useRef();
  const inView=useInView(ref,{once:true,amount:.06});
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const bgY=useTransform(scrollYProgress,[0,1],[30,-30]);
  const bgSc=useTransform(scrollYProgress,[0,1],[1,1.06]);

  const allReviews=[
    {name:"Sarah Johnson",role:"HR Director, TechCorp",rating:5,date:"Dec 2024",text:"Mawahib transformed our hiring process completely. We cut time-to-hire by 60% and the AI interviews are surprisingly natural. Candidates enjoy the experience."},
    {name:"Michael Chen",role:"Founder, StartupXYZ",rating:5,date:"Jan 2025",text:"We screened 400 applicants in a weekend. The structured scoring model is a game-changer for early-stage hiring decisions."},
    {name:"Emma Williams",role:"Talent Lead, FinanceHub",rating:5,date:"Feb 2025",text:"Finally a hiring platform that delivers on its promises. Our team spends 80% less time on initial screening."},
    {name:"Khalid Al-Rashid",role:"COO, RetailGroup MENA",rating:5,date:"Mar 2025",text:"We hired 12 regional managers across 6 countries. What used to take 3 months took 3 weeks with Mawahib."},
    {name:"Priya Sharma",role:"VP People, FinTech Scale",rating:5,date:"Apr 2025",text:"Bias-reduced scoring gave us confidence our decisions were merit-based. Diversity in our hires improved significantly."},
    {name:"James O'Brien",role:"Head of Recruitment, Agency",rating:5,date:"May 2025",text:"Mawahib lets us present ranked shortlists the same day. Our clients think we're wizards now."},
    {name:"Nour Hassan",role:"CHRO, Logistics Corp",rating:5,date:"Jun 2025",text:"Seamless onboarding, crystal-clear candidate reports, and massive time savings from day one."},
    {name:"David Park",role:"Talent Ops, Series B Startup",rating:5,date:"Jul 2025",text:"The multilingual AI interviewer handled Arabic and English flawlessly. Perfect for our MENA expansion."},
    {name:"Layla Ahmed",role:"Recruiting Manager, Retail",rating:5,date:"Aug 2025",text:"The auto-ranking feature alone saves us hours every week. The platform is beautifully designed too."},
    {name:"Tom Fischer",role:"CEO, SaaS Company",rating:5,date:"Sep 2025",text:"We scaled from 20 to 80 employees in 6 months. Mawahib was central to our hiring infrastructure."},
  ];

  /* Row 1: items 0-4 doubled, Row 2: items 5-9 doubled (slightly different content) */
  const row1 = [...allReviews.slice(0,6), ...allReviews.slice(0,6)];
  const row2 = [...allReviews.slice(4), ...allReviews.slice(4)];

  return (
    <section ref={ref} style={{position:"relative",padding:"clamp(80px,12vw,140px) 0",overflow:"hidden"}}>
      {/* Parallax bg */}
      <motion.div style={{y:bgY,scale:bgSc,position:"absolute",inset:0,zIndex:0}}>
        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80" alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(.65) brightness(.07)",objectPosition:"center 30%"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,#020617 0%,rgba(2,6,23,.58) 28%,rgba(2,6,23,.58) 72%,#020617 100%)"}}/>
      </motion.div>

      <div style={{position:"relative",zIndex:5}}>
        {/* ── Header ── */}
        <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.9,ease:[.16,1,.3,1]}}
          style={{textAlign:"center",padding:"0 clamp(24px,6vw,96px)",marginBottom:"clamp(48px,7vw,68px)"}}>
          <Label>TRUSTED BY TEAMS WORLDWIDE</Label>

          {/* Trustpilot badge */}
          <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:10,background:"rgba(0,182,122,.05)",border:"1px solid rgba(0,182,122,.18)",borderRadius:20,padding:"18px 28px",marginBottom:28}}>
            <TrustpilotWordmark/>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <StarRating n={5} size={20}/>
              <span style={{fontSize:14,fontWeight:700,color:"#f8fafc"}}>4.9 / 5</span>
            </div>
            <p style={{fontSize:12,color:"#475569"}}>Rated <strong style={{color:"#00b67a"}}>Excellent</strong> · 200+ verified reviews</p>
          </div>

          {/* Big italic quote */}
          <blockquote style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(2rem,5vw,4.4rem)",fontWeight:400,color:"#f8fafc",lineHeight:1.1,letterSpacing:"-.02em",marginBottom:18}}>
            "Reduced time-to-hire<br/>by 60%."
          </blockquote>
          <p style={{color:"#475569",fontSize:"clamp(12px,1.4vw,14px)",fontWeight:600,letterSpacing:".08em"}}>
            HR Director, Global Tech Company
          </p>
        </motion.div>

        {/* ── CAROUSEL ROW 1 → scrolls left ── */}
        <div style={{overflow:"hidden",marginBottom:14,paddingTop:4,paddingBottom:4}}>
          <div className="track-l"
            style={{display:"flex",gap:"clamp(12px,1.6vw,16px)",width:"max-content",paddingLeft:"clamp(12px,1.6vw,16px)"}}>
            {row1.map((r,i)=><ReviewCard key={i} r={r}/>)}
          </div>
        </div>

        {/* ── CAROUSEL ROW 2 → scrolls right ── */}
        <div style={{overflow:"hidden",paddingTop:4,paddingBottom:4}}>
          <div className="track-r"
            style={{display:"flex",gap:"clamp(12px,1.6vw,16px)",width:"max-content",paddingLeft:"clamp(12px,1.6vw,16px)"}}>
            {row2.map((r,i)=><ReviewCard key={i} r={r}/>)}
          </div>
        </div>

        {/* ── CTA ── */}
        <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:.8,duration:.8}}
          style={{textAlign:"center",marginTop:"clamp(40px,6vw,56px)",padding:"0 clamp(24px,6vw,96px)"}}>
          <motion.a href="https://www.trustpilot.com/review/mawahib.ai" target="_blank" rel="noopener noreferrer"
            whileHover={{scale:1.04,boxShadow:"0 0 35px rgba(0,182,122,.3)"}} whileTap={{scale:.97}}
            style={{display:"inline-flex",alignItems:"center",gap:12,background:"rgba(0,182,122,.08)",border:"1px solid rgba(0,182,122,.28)",borderRadius:12,padding:"14px 28px",fontSize:13,fontWeight:700,color:"#00b67a",textDecoration:"none"}}>
            <TrustpilotWordmark/>
            <span style={{height:16,width:1,background:"rgba(0,182,122,.22)"}}/>
            Read all reviews on Trustpilot
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA SECTION ────────────────────────────────────────────────────────────── */
function CTASection() {
  const ref=useRef();
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const scale=useTransform(scrollYProgress,[0,.45],[.94,1]);
  const opacity=useTransform(scrollYProgress,[0,.28],[0,1]);
  const inView=useInView(ref,{once:true,amount:.2});
  const lY=useTransform(scrollYProgress,[0,1],[30,-30]);
  const rY=useTransform(scrollYProgress,[0,1],[-30,30]);
  return (
    <section ref={ref} style={{position:"relative",padding:"clamp(100px,14vw,160px) clamp(24px,6vw,96px)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"clamp(400px,65vw,750px)",height:"clamp(400px,65vw,750px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(29,78,216,.1) 0%,transparent 65%)",filter:"blur(80px)",pointerEvents:"none"}}/>
      <motion.div style={{y:lY,position:"absolute",left:"-2%",top:"10%",width:"clamp(150px,16vw,240px)",aspectRatio:"2/3",borderRadius:20,overflow:"hidden"}}
        initial={{opacity:0}} animate={inView?{opacity:.22}:{}} transition={{duration:1.2}}>
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80" alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.6) saturate(.5)"}}/>
      </motion.div>
      <motion.div style={{y:rY,position:"absolute",right:"-2%",top:"15%",width:"clamp(130px,14vw,200px)",aspectRatio:"2/3",borderRadius:20,overflow:"hidden"}}
        initial={{opacity:0}} animate={inView?{opacity:.18}:{}} transition={{duration:1.2,delay:.2}}>
        <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80" alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.6) saturate(.5)"}}/>
      </motion.div>
      <motion.div style={{scale,opacity,maxWidth:680,margin:"0 auto",textAlign:"center",position:"relative",zIndex:5}}>
        <Label>NOW ACCEPTING TEAMS</Label>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(3rem,6vw,6.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.04,color:"#f8fafc",marginBottom:10}}>
          Start hiring
        </h2>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:"clamp(3rem,6vw,6.2rem)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.04,marginBottom:32}}>
          <span className="shimmer-text" style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic"}}>smarter.</span>
        </h2>
        <p style={{color:"#475569",fontSize:"clamp(15px,1.8vw,17px)",lineHeight:1.74,maxWidth:460,margin:"0 auto clamp(36px,5vw,48px)"}}>
          Join thousands of teams using Mawahib to transform their hiring process. Simple setup. Real results.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <motion.a href="https://mawahib.ai/request-campaign" target="_blank"
            whileHover={{scale:1.04,boxShadow:"0 0 55px rgba(59,130,246,.5)"}} whileTap={{scale:.97}}
            style={{background:"linear-gradient(145deg,#2563eb,#1d4ed8)",borderRadius:13,padding:"clamp(13px,2vw,15px) clamp(26px,4vw,38px)",fontSize:"clamp(13px,1.5vw,15px)",fontWeight:700,color:"#fff",boxShadow:"0 8px 32px rgba(29,78,216,.5)",textDecoration:"none",display:"inline-block"}}>
            Request Demo
          </motion.a>
          <motion.a href="https://wa.me/962798056152" target="_blank"
            whileHover={{scale:1.04,borderColor:"rgba(59,130,246,.45)",background:"rgba(59,130,246,.07)"}} whileTap={{scale:.97}}
            style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",borderRadius:13,padding:"clamp(13px,2vw,15px) clamp(26px,4vw,34px)",fontSize:"clamp(13px,1.5vw,15px)",fontWeight:600,color:"#94a3b8",backdropFilter:"blur(12px)",transition:"all .4s cubic-bezier(.16,1,.3,1)",textDecoration:"none",display:"inline-block"}}>
            Contact Sales
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      borderTop:"1px solid rgba(255,255,255,.04)",
      padding:"clamp(48px,8vw,64px) clamp(24px,6vw,96px) clamp(28px,4vw,36px)",
      background:"#020617"
    }}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:32,marginBottom:"clamp(36px,6vw,48px)"}}>

          {/* ── Brand column ── */}
          <div style={{maxWidth:240}}>
            {/* Logo on footer dark bg — just render the img, black bg blends with #020617 */}
            <div style={{marginBottom:18,display:"flex",alignItems:"center"}}>
              <MawahibLogo height={140}/>
            </div>
            <p style={{color:"#334155",fontSize:12,lineHeight:1.8,marginBottom:20}}>
              AI-powered hiring intelligence for modern recruitment teams worldwide.
            </p>
            {/* Trustpilot mini strip */}
            <a href="https://www.trustpilot.com/review/mawahib.ai" target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none",borderBottom:"1px solid rgba(0,182,122,.12)",paddingBottom:4}}>
              <TrustpilotWordmark/>
              <div style={{display:"flex",gap:2}}>
                {[...Array(5)].map((_,i)=>(
                  <svg key={i} width={10} height={10} viewBox="0 0 24 24" fill="#00b67a">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span style={{fontSize:10,color:"#475569",fontWeight:600}}>4.9/5</span>
            </a>
          </div>

          {/* ── Link columns ── */}
          <div style={{display:"flex",gap:"clamp(24px,5vw,64px)",flexWrap:"wrap"}}>
            {[
              ["Product",["Features","How It Works","Pricing"]],
              ["Company",["About","Blog","Careers"]],
              ["Legal",["Privacy","Terms","Security"]],
            ].map(([sect,items])=>(
              <div key={sect}>
                <p style={{fontSize:10,fontWeight:700,color:"#1e3a8a",letterSpacing:".14em",marginBottom:16,textTransform:"uppercase"}}>{sect}</p>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {items.map(item=>(
                    <a key={item} href="#" style={{color:"#334155",fontSize:13,textDecoration:"none",transition:"color .2s"}}
                      onMouseEnter={e=>e.target.style.color="#94a3b8"} onMouseLeave={e=>e.target.style.color="#334155"}>{item}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{borderTop:"1px solid rgba(255,255,255,.04)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <p style={{color:"#1e293b",fontSize:11}}>© 2026 Mawahib LLC. All rights reserved.</p>
          <div style={{display:"flex",gap:6}}>
            {["AI-Powered","SOC 2 Type II","GDPR Ready"].map(badge=>(
              <span key={badge} style={{fontSize:10,color:"#1e293b",border:"1px solid rgba(255,255,255,.05)",borderRadius:9999,padding:"3px 10px",letterSpacing:".04em"}}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <FontLink/>
      <GlobalStyles/>
      <AnimatePresence>
        {!loaded && <PageLoader key="loader" onDone={()=>setLoaded(true)}/>}
      </AnimatePresence>
      <motion.div initial={{opacity:0}} animate={loaded?{opacity:1}:{}} transition={{duration:.6,delay:.1}}>
        <div className="noise-overlay"/>
        <AmbientBg/>
        <Globe/>
        <CustomCursor/>
        <ScrollProgress/>
        <Nav/>
        <main style={{position:"relative",zIndex:10}}>
          <HeroSection/>
          <Ticker/>
          <ProblemSection/>
          <GlobalSection/>
          <VideoSection/>
          <InterviewSection/>
          <PhotoStrip/>
          <FeaturesSection/>
          <TrustSection/>
          <CTASection/>
        </main>
        <Footer/>
      </motion.div>
    </>
  );
}