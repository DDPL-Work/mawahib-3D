
/**
 * CompaniesTrustSection.jsx
 * Drop this component anywhere in App.jsx's <main> section.
 *
 * Usage:
 *   import CompaniesTrustSection from "./CompaniesTrustSection";
 *   // then place <CompaniesTrustSection /> in your route element
 *
 * The section uses only packages already present in the project:
 *   framer-motion, react (useRef, useEffect, useState, useInView)
 *
 * IMPORTANT — logo images:
 *   Replace the four LOGO_SRCS entries with your actual company logo paths/URLs.
 *   The src values below are placeholders that render as text-based SVG logos.
 */

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ─── Design tokens (mirror App.jsx) ─────────────────────────────── */
const C = {
  bgDark: "#0a0f1e",
  gold: "#b8955a",
  goldLight: "#d4b483",
  goldBright: "#f0c97a",
  goldPale: "rgba(184,149,90,.10)",
  goldBorder: "rgba(184,149,90,.22)",
};

/* ─── Company data ────────────────────────────────────────────────── */
/* Replace `logo` with your actual image paths, e.g. "./logos/google.png"  */
/* Replace `name` with real company names                                   */
const COMPANIES = [
  {
    id: 1,
    name: "HIGH ROCK",
    sector: "Enterprise Software",
    employees: "12,000+",
    hires: "340 hires",
    quote: "Cut time-to-hire by 60%",
    color: "#4A90E2",
    logo: "./HIGH ROCK LOGO.png", // set to image path when available
  },
  {
    id: 2,
    name: "Holy Rock",
    sector: "Financial Services",
    employees: "80,000+",
    hires: "1,200 hires",
    quote: "Screening 10× faster",
    color: "#2ECC8A",
    logo: "Holy rock Logo-01.png",
  },
  {
    id: 3,
    name: "RetailGroup",
    sector: "Retail & E-Commerce",
    employees: "35,000+",
    hires: "870 hires",
    quote: "Bias-free evaluations",
    color: "#E07B39",
    logo: "IMG_30701.PNG",
  },
  {
    id: 4,
    name: "MediCare",
    sector: "Healthcare",
    employees: "50,000+",
    hires: "620 hires",
    quote: "World-class candidate quality",
    color: "#9B6EDB",
    logo: "MAHAWHIB.jpeg",
  },
];

/* ─── Floating particle (CSS keyframe, inline style) ─────────────── */
const PARTICLE_STYLE = `
  @keyframes ctm-float-up {
    0%   { transform: translateY(0)   scale(1);   opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: .6; }
    100% { transform: translateY(-110px) scale(.4); opacity: 0; }
  }
  @keyframes ctm-orbit {
    from { transform: rotate(0deg)   translateX(var(--r)) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); }
  }
  @keyframes ctm-pulse-ring {
    0%   { transform: scale(.9); opacity: .7; }
    100% { transform: scale(1.7); opacity: 0; }
  }
  @keyframes ctm-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ctm-scan {
    0%   { top: 0%; }
    100% { top: 100%; }
  }
  @keyframes ctm-glow-border {
    0%,100% { border-color: rgba(184,149,90,.2); box-shadow: 0 0 0 rgba(184,149,90,0); }
    50%     { border-color: rgba(184,149,90,.6); box-shadow: 0 0 28px rgba(184,149,90,.25); }
  }
`;

/* ─── Logo placeholder (SVG text logo when no image provided) ──────── */
function LogoPlaceholder({ name, color }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`lg-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="52" height="52" rx="14"
        fill={`url(#lg-${name})`} stroke={color} strokeWidth="0.8" strokeOpacity="0.5"/>
      <text x="28" y="36" textAnchor="middle"
        fontFamily="'Sora',sans-serif" fontSize="18" fontWeight="800"
        fill="white" opacity="0.95">
        {initials}
      </text>
    </svg>
  );
}

/* ─── Single company card ─────────────────────────────────────────── */
function CompanyCard({ company, index, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: 0.2 + index * 0.13,
        duration: 0.9,
        type: "spring",
        stiffness: 100,
        damping: 18,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 22,
        padding: "clamp(20px,2.5vw,30px)",
        background: "linear-gradient(145deg,rgba(255,255,255,.055) 0%,rgba(255,255,255,.02) 100%)",
        border: "1px solid rgba(184,149,90,.18)",
        backdropFilter: "blur(20px) saturate(1.3)",
        cursor: "default",
        overflow: "hidden",
        animation: "ctm-glow-border 4s ease-in-out infinite",
        animationDelay: `${index * 0.8}s`,
        transition: "transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s",
        transform: hovered ? "translateY(-10px) scale(1.025)" : "none",
        boxShadow: hovered
          ? "0 30px 80px rgba(0,0,0,.55), 0 0 60px rgba(184,149,90,.12)"
          : "0 10px 40px rgba(0,0,0,.3)",
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: "12%", right: "12%", height: 2,
        background: `linear-gradient(90deg,transparent,${company.color},${C.goldBright},transparent)`,
        boxShadow: `0 0 12px ${company.color}`,
        opacity: hovered ? 1 : 0.7,
        transition: "opacity .3s",
      }}/>

      {/* Scan line effect */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: "35%",
        background: `linear-gradient(180deg,transparent,rgba(255,255,255,.025),transparent)`,
        animation: "ctm-scan 3s ease-in-out infinite",
        animationDelay: `${index * 0.6}s`,
        pointerEvents: "none",
        zIndex: 0,
      }}/>

      {/* Corner glow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", top: -40, right: -40,
          width: 120, height: 120, borderRadius: "50%",
          background: `radial-gradient(circle,${company.color}22 0%,transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Logo row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
        }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            {/* Pulse ring */}
            <motion.div
              animate={hovered ? { scale: [1, 1.6], opacity: [0.6, 0] } : {}}
              transition={{ duration: 0.8, repeat: hovered ? Infinity : 0 }}
              style={{
                position: "absolute", inset: -4, borderRadius: 18,
                border: `1px solid ${company.color}`,
                pointerEvents: "none",
              }}
            />
            {company.logo
              ? <img src={company.logo} alt={company.name}
                  style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 14, display: "block" }}/>
              : <LogoPlaceholder name={company.name} color={company.color}/>
            }
          </div>
          <div>
            <div style={{
              fontSize: "clamp(15px,1.4vw,17px)", fontWeight: 800,
              color: "rgba(255,255,255,.92)", letterSpacing: "-.02em",
              fontFamily: "'Sora',sans-serif",
            }}>{company.name}</div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,.35)", fontWeight: 600,
              letterSpacing: ".07em", marginTop: 2,
            }}>{company.sector}</div>
          </div>
        </div>

        {/* Quote */}
        <div style={{
          fontSize: "clamp(12px,1.15vw,13px)",
          color: C.gold, fontWeight: 700, fontStyle: "italic",
          letterSpacing: ".02em", lineHeight: 1.5,
          marginBottom: 18, fontFamily: "'DM Serif Display',serif",
          fontSize: "clamp(14px,1.3vw,15px)",
        }}>
          "{company.quote}"
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg,${company.color}44,transparent)`,
          marginBottom: 16,
        }}/>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          {[
            { label: "Employees", val: company.employees },
            { label: "Via Mawahib", val: company.hires },
          ].map(({ label, val }) => (
            <div key={label} style={{
              flex: 1, textAlign: "center", padding: "10px 8px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.06)",
              borderRadius: 10,
            }}>
              <div style={{
                fontSize: "clamp(12px,1.1vw,14px)", fontWeight: 800,
                color: "#fff", letterSpacing: "-.02em",
              }}>{val}</div>
              <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: ".1em", marginTop: 2 }}>
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Ambient floating particles ─────────────────────────────────── */
function AmbientParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: `${8 + Math.random() * 84}%`,
    size: 1.5 + Math.random() * 2.5,
    delay: Math.random() * 5,
    dur: 4 + Math.random() * 4,
    color: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.goldBright : "rgba(255,255,255,.4)",
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          bottom: "-10px",
          left: p.x,
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          background: p.color,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          animation: `ctm-float-up ${p.dur}s ease-in-out ${p.delay}s infinite`,
        }}/>
      ))}
    </div>
  );
}

/* ─── Orbital ring decoration ─────────────────────────────────────── */
function OrbitalRing({ r, speed, opacity, dotColor }) {
  return (
    <div style={{
      position: "absolute",
      top: "50%", left: "50%",
      width: r * 2, height: r * 2,
      marginLeft: -r, marginTop: -r,
      borderRadius: "50%",
      border: `1px dashed rgba(184,149,90,${opacity})`,
      pointerEvents: "none",
    }}>
      {/* orbiting dot */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        "--r": `${r}px`,
        width: 6, height: 6,
        borderRadius: "50%",
        background: dotColor,
        boxShadow: `0 0 10px ${dotColor}`,
        marginLeft: -3, marginTop: -3,
        animation: `ctm-orbit ${speed}s linear infinite`,
      }}/>
    </div>
  );
}

/* ─── Main section ────────────────────────────────────────────────── */
export default function CompanyTrustSection() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.06 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Animated counter for the header stat */
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const target = 400;
    const dur = 1800;
    const start = Date.now();
    const step = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView]);

  return (
    <>
      {/* Inject keyframes once */}
      <style>{PARTICLE_STYLE}</style>

      <section
        ref={ref}
        style={{
          position: "relative",
          zIndex: 10,
          padding: "clamp(90px,13vw,150px) clamp(20px,6vw,80px)",
          background:
            "linear-gradient(180deg,rgba(3,6,16,.7) 0%,rgba(8,12,28,.92) 50%,rgba(3,6,16,.7) 100%)",
          overflow: "hidden",
        }}
      >
        {/* ── Ambient particles ── */}
        <AmbientParticles/>

        {/* ── Background orbital rings (decorative) ── */}
        {!isMobile && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none", opacity: 0.35,
          }}>
            <OrbitalRing r={520} speed={60} opacity={0.08} dotColor={C.gold}/>
            <OrbitalRing r={380} speed={38} opacity={0.12} dotColor={C.goldBright}/>
            <OrbitalRing r={260} speed={24} opacity={0.18} dotColor={C.goldLight}/>
          </div>
        )}

        {/* ── Central radial glow ── */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "80vw", height: "80vw", maxWidth: 900, maxHeight: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(184,149,90,.07) 0%,transparent 65%)",
          pointerEvents: "none",
        }}/>

        <div style={{ maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 2 }}>

          {/* ── Header block ── */}
          <motion.div
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textAlign: "center",
              marginBottom: "clamp(52px,8vw,80px)",
              y: titleY,
            }}
          >
            {/* Label pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(184,149,90,.10)", border: "1px solid rgba(184,149,90,.28)",
              borderRadius: 9999, padding: "5px 16px",
              fontSize: 10, fontWeight: 800, color: C.gold,
              letterSpacing: ".14em", marginBottom: 24,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: C.gold, boxShadow: `0 0 8px ${C.goldBright}`,
                display: "inline-block", animation: "ctm-pulse-ring 2s ease-out infinite",
              }}/>
              TRUSTED BY INDUSTRY LEADERS
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(2.4rem,5.5vw,5rem)",
              fontWeight: 400,
              letterSpacing: "-.02em",
              lineHeight: 1.06,
              color: "rgba(255,255,255,.95)",
              marginBottom: 16,
            }}>
              Companies that trust{" "}
              <span style={{
                background: `linear-gradient(90deg,${C.gold},${C.goldBright},${C.gold},${C.goldLight},${C.goldBright})`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "ctm-shimmer 3s linear infinite",
                display: "inline",
              }}>Mawahib.</span>
            </h2>

            <p style={{
              color: "rgba(255,255,255,.4)",
              fontSize: "clamp(14px,1.6vw,17px)",
              lineHeight: 1.85,
              maxWidth: 560,
              margin: "0 auto 36px",
            }}>
              From early-stage startups to Fortune 500 enterprises — leading
              organisations worldwide rely on Mawahib to find and hire exceptional talent.
            </p>

            {/* Stat pills row */}
            <div style={{
              display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
            }}>
              {[
                { val: `${count}+`, label: "Global Clients" },
                { val: "190+", label: "Countries" },
                { val: "4.9★", label: "Trustpilot" },
              ].map(({ val, label }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.55, duration: 0.6, type: "spring" }}
                  style={{
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(184,149,90,.2)",
                    borderRadius: 12, padding: "10px 22px",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div style={{ fontSize: "clamp(18px,2vw,22px)", fontWeight: 800, color: "#fff", letterSpacing: "-.04em" }}>
                    {val}
                  </div>
                  <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: ".1em", marginTop: 2 }}>
                    {label.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── 4 company cards ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(4, 1fr)",
            gap: "clamp(14px,2vw,22px)",
          }}>
            {COMPANIES.map((company, i) => (
              <CompanyCard
                key={company.id}
                company={company}
                index={i}
                inView={inView}
              />
            ))}
          </div>

          {/* ── Bottom flourish ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{
              textAlign: "center",
              marginTop: "clamp(44px,6vw,64px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            {/* Divider line */}
            <div style={{
              width: "clamp(120px,20vw,240px)", height: 1,
              background: `linear-gradient(90deg,transparent,${C.goldBorder},transparent)`,
            }}/>

            <p style={{
              fontSize: "clamp(12px,1.2vw,13px)",
              color: "rgba(255,255,255,.25)",
              letterSpacing: ".06em",
              fontWeight: 600,
            }}>
              Join 400+ companies transforming their hiring with AI
            </p>

            {/* CTA */}
            <motion.a
              href="https://wa.me/966556919502"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.06,
                boxShadow: `0 14px 44px rgba(184,149,90,.45)`,
              }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
                borderRadius: 13,
                padding: "13px clamp(28px,3vw,42px)",
                fontSize: "clamp(13px,1.3vw,15px)",
                fontWeight: 800,
                color: "#0a0f1e",
                textDecoration: "none",
                letterSpacing: ".03em",
                boxShadow: `0 8px 30px rgba(184,149,90,.3)`,
              }}
            >
              Join Them — Get Started Free
            </motion.a>
          </motion.div>

        </div>
      </section>
    </>
  );
}