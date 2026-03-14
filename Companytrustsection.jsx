/**
 * CompanyTrustSection.jsx
 * Infinite horizontal logo carousel scrolling right-to-left.
 * Logos are styled with dark theme — no white backgrounds.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Design tokens ──────────────────────────────────────────────── */
const C = {
  gold: "#b8955a",
  goldBright: "#f0c97a",
};

/* ─── Company logos ──────────────────────────────────────────────── */
const LOGOS = [
  { name: "High Rock", src: "./HIGH ROCK LOGO.png" },
  { name: "RetailGroup", src: "./IMG_30701.PNG" },
  { name: "Holy Rock", src: "./Holy rock Logo-01.png" },
  { name: "MediCare", src: "./MAHAWHIB.jpeg" },
];

/* ─── Keyframes ──────────────────────────────────────────────────── */
const CAROUSEL_CSS = `
  @keyframes logo-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

/* ─── Single logo item ───────────────────────────────────────────── */
function LogoItem({ logo }) {
  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 100,
        margin: "0 clamp(14px, 2.5vw, 28px)",
        borderRadius: 14,
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.07)",
        backdropFilter: "blur(12px)",
        transition: "all .35s ease",
        cursor: "default",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,.08)";
        e.currentTarget.style.borderColor = "rgba(184,149,90,.35)";
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(184,149,90,.12)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        style={{
          maxWidth: "88%",
          maxHeight: "80%",
          objectFit: "contain",
          filter: "brightness(.85) contrast(1.1) saturate(.9)",
          transition: "filter .3s",
          borderRadius: 8,
          /* Dark blend so white-bg logos look dark-themed */
          mixBlendMode: "lighten",
        }}
      />
    </div>
  );
}

/* ─── Main section ────────────────────────────────────────────────── */
export default function CompanyTrustSection() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.15 });

  // Duplicate logos for seamless infinite loop
  const doubled = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <>
      <style>{CAROUSEL_CSS}</style>

      <section
        ref={ref}
        style={{
          position: "relative",
          zIndex: 10,
          padding: "clamp(32px, 5vw, 56px) 0",
          background: "linear-gradient(180deg, rgba(3,6,16,.5) 0%, rgba(8,12,28,.7) 50%, rgba(3,6,16,.5) 100%)",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold}33, transparent)`,
          }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            textAlign: "center",
            marginBottom: "clamp(20px, 3vw, 32px)",
            padding: "0 24px",
          }}
        >
          {/* Label pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(184,149,90,.10)",
              border: "1px solid rgba(184,149,90,.22)",
              borderRadius: 9999,
              padding: "5px 16px",
              fontSize: 10,
              fontWeight: 800,
              color: C.gold,
              letterSpacing: ".14em",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: C.gold,
                boxShadow: `0 0 8px ${C.goldBright}`,
                display: "inline-block",
              }}
            />
            TRUSTED BY INDUSTRY LEADERS
          </div>

          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 400,
              letterSpacing: "-.02em",
              lineHeight: 1.08,
              color: "rgba(255,255,255,.92)",
              margin: 0,
            }}
          >
            Companies that trust{" "}
            <span
              style={{
                background: `linear-gradient(90deg,${C.gold},${C.goldBright},${C.gold})`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Mawahib.
            </span>
          </h2>
        </motion.div>

        {/* Logo carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ position: "relative" }}
        >
          {/* Left fade */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "clamp(30px, 6vw, 100px)",
              background: "linear-gradient(90deg, rgba(6,10,22,1) 0%, transparent 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          {/* Right fade */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: "clamp(30px, 6vw, 100px)",
              background: "linear-gradient(270deg, rgba(6,10,22,1) 0%, transparent 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* Scrolling track */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "max-content",
              animation: "logo-scroll 25s linear infinite",
            }}
          >
            {doubled.map((logo, i) => (
              <LogoItem key={`${logo.name}-${i}`} logo={logo} />
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}