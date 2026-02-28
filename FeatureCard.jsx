import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
} from "framer-motion";

/* ─── 3D FEATURE CARD COMPONENT ────────────────────────────────────────── */
function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });
  
  // Mouse tracking motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the 3D tilt effect
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    mouseX.set((e.clientX - centerX) / width);
    mouseY.set((e.clientY - centerY) / height);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50, rotateX: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      style={{
        perspective: "1000px", // Enables 3D space
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          height: "100%",
          padding: "40px 30px",
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(12px)",
          borderRadius: 24,
          border: "1px solid rgba(59, 130, 246, 0.15)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Animated Background Gradient Pulse */}
        <motion.div 
           style={{
             position: "absolute", inset: 0,
             background: "radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)",
             zIndex: -1
           }}
           animate={{ opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 4, repeat: Infinity }}
        />

        <div style={{ 
          width: 40, height: 40, borderRadius: 12, 
          background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, color: "white", fontWeight: "bold",
          transform: "translateZ(30px)" // Push icon forward in 3D space
        }}>
          {index + 1}
        </div>

        <h3 style={{ 
          fontSize: 20, fontWeight: 700, color: "#f8fafc",
          transform: "translateZ(20px)" 
        }}>
          {feature.title}
        </h3>
        
        <p style={{ 
          color: "#94a3b8", fontSize: 14, lineHeight: 1.6,
          transform: "translateZ(10px)"
        }}>
          {feature.desc}
        </p>

        {/* Glossy reflection overlay */}
        <div style={{
          position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
          transform: "skewX(-25deg)",
          transition: "0.75s"
        }} className="card-shine" />
      </motion.div>
    </motion.div>
  );
}

/* ─── MAIN FEATURES SECTION ─────────────────────────────────────────────── */
function FeaturesSection() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  // Header Parallax & 3D Tilt
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const headerRotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);

  const features = [
    { title: "AI Candidate Matching", desc: "Neural matching across skills, culture fit, and growth trajectory. Surfaces the best candidates your keyword search would miss." },
    { title: "Automated Screening", desc: "AI-powered async interviews that screen hundreds simultaneously. Structured insights without scheduling overhead." },
    { title: "Global Talent Intelligence", desc: "Real-time market data on compensation, availability, and skill distribution across 190+ countries." },
    { title: "Bias-Reduced Evaluation", desc: "Structured rubrics and anonymized profiles ensure every candidate is assessed on merit, not impression." },
    { title: "Interview Intelligence", desc: "Transcription, sentiment analysis, and scoring. Every interview becomes a structured dataset." },
    { title: "Workforce Analytics", desc: "Hiring funnel metrics, diversity dashboards, and predictive retention signals in one command center." },
  ];

  return (
    <section ref={ref} style={{
      position: "relative",
      padding: "clamp(100px,14vw,160px) clamp(24px,6vw,96px)",
      background: "#020617",
      overflow: "hidden",
      perspective: "1500px" // Global section perspective
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        
        <motion.div style={{ 
          opacity: headerOpacity, 
          scale: headerScale,
          rotateX: headerRotateX,
          textAlign: "center", 
          marginBottom: "clamp(60px,10vw,90px)" 
        }}>
          <Label>PLATFORM FEATURES</Label>
          <h2 style={{
            fontSize: "clamp(28px,4.5vw,54px)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 1.08,
            color: "#f8fafc", marginBottom: 18
          }}>
            Everything you need to hire<br />
            <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontWeight: 400, color: "#93c5fd" }}>with confidence.</span>
          </h2>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(20px,3vw,30px)"
        }} className="feature-grid">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        .feature-grid { display: grid; }
        @media (max-width: 1024px) {
          .feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .feature-grid { grid-template-columns: 1fr !important; }
        }
        /* Shine effect on hover */
        div:hover > .card-shine {
          left: 200%;
        }
      `}</style>
    </section>
  );
}
