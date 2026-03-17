import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const C = {
  bgDark: "#0a0f1e",
  gold: "#b8955a",
  goldBright: "#f0c97a",
  goldPale: "rgba(184,149,90,.12)",
  goldBorder: "rgba(184,149,90,.24)",
};

const WHATSAPP_URL = "https://wa.me/966556919502";

const STEPS = [
  {
    n: "01",
    title: "Define Hiring Requirements",
    desc:
      "Create a recruitment campaign and define the role details so the system can structure the process from day one.",
    bullets: ["Job description", "Required skills and qualifications", "Evaluation criteria"],
  },
  {
    n: "02",
    title: "Candidates Submit Applications",
    desc:
      "Candidates apply directly through Mawahib. Applications are automatically organized and structured for scale.",
  },
  {
    n: "03",
    title: "AI-Assisted CV Analysis",
    desc:
      "The platform normalizes CV data and evaluates profiles against your predefined criteria to surface the best fits.",
  },
  {
    n: "04",
    title: "AI Video Interviews",
    desc:
      "Shortlisted candidates complete AI-led video interviews. Responses are recorded and securely stored for review.",
  },
  {
    n: "05",
    title: "Structured Candidate Insights",
    desc:
      "Hiring teams receive a complete, organized view of every candidate, including structured evaluations.",
    bullets: [
      "CV analysis results",
      "Recorded video interviews",
      "Structured evaluation data",
      "Strengths and potential gaps",
    ],
  },
  {
    n: "06",
    title: "Confident Hiring Decisions",
    desc:
      "Compare candidates in one place and make faster, more objective hiring decisions with less manual effort.",
  },
];

function Label({ children }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: C.goldPale,
        border: `1px solid ${C.goldBorder}`,
        borderRadius: 9999,
        padding: "6px 16px",
        fontSize: 10,
        fontWeight: 800,
        color: C.gold,
        letterSpacing: ".14em",
        textTransform: "uppercase",
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
      {children}
    </div>
  );
}

function StepCard({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 18,
        padding: "20px 22px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 16px 40px rgba(0,0,0,.35)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "12%",
          right: "12%",
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          boxShadow: `0 0 10px ${C.gold}`,
        }}
      />
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: C.gold,
          letterSpacing: ".12em",
          marginBottom: 10,
        }}
      >
        {step.n}
      </div>
      <h3
        style={{
          fontSize: "clamp(16px,2.4vw,20px)",
          fontWeight: 700,
          color: "rgba(255,255,255,.92)",
          marginBottom: 10,
          letterSpacing: "-.01em",
        }}
      >
        {step.title}
      </h3>
      <p
        style={{
          fontSize: "clamp(12px,1.6vw,14px)",
          color: "rgba(255,255,255,.45)",
          lineHeight: 1.75,
          marginBottom: step.bullets ? 14 : 0,
        }}
      >
        {step.desc}
      </p>
      {step.bullets && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {step.bullets.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.gold,
                  boxShadow: `0 0 8px ${C.goldBright}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,.7)",
                }}
              >
                {b}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 860);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "clamp(96px, 12vh, 130px) clamp(16px, 5vw, 90px) 80px",
        background:
          "radial-gradient(120% 80% at 50% 0%, rgba(184,149,90,.08) 0%, transparent 55%), linear-gradient(180deg, rgba(3,6,16,.95) 0%, rgba(6,10,22,.95) 100%)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 4vw, 40px)" }}
        >
          <Label>How Mawahib Works</Label>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 400,
              letterSpacing: "-.02em",
              lineHeight: 1.08,
              color: "rgba(255,255,255,.95)",
              margin: "16px 0 12px",
            }}
          >
            A Structured and Automated Hiring Process
          </h1>
          <p
            style={{
              maxWidth: 760,
              margin: "0 auto",
              color: "rgba(255,255,255,.45)",
              fontSize: "clamp(14px, 1.9vw, 16px)",
              lineHeight: 1.9,
            }}
          >
            Mawahib Talent Hub transforms recruitment into a structured, automated, and data-driven workflow that helps teams identify the most suitable candidates faster and more accurately.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
            gap: "clamp(14px, 2.2vw, 22px)",
          }}
        >
          {STEPS.map((s, i) => (
            <StepCard key={s.title} step={s} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            marginTop: "clamp(36px, 5vw, 56px)",
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(184,149,90,.22)",
            borderRadius: 18,
            padding: "clamp(18px, 3vw, 28px)",
            textAlign: "center",
            backdropFilter: "blur(16px)",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(18px, 2.6vw, 24px)",
              fontWeight: 700,
              color: "rgba(255,255,255,.92)",
              marginBottom: 10,
            }}
          >
            Request a Demo on WhatsApp
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,.45)",
              fontSize: "clamp(12px, 1.6vw, 14px)",
              marginBottom: 18,
            }}
          >
            If you would like to see how Mawahib can support your hiring process, our team will be happy to walk you through the platform.
          </p>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
              color: C.bgDark,
              textDecoration: "none",
              borderRadius: 12,
              padding: "12px 26px",
              fontSize: 14,
              fontWeight: 800,
              boxShadow: "0 10px 30px rgba(184,149,90,.35)",
            }}
          >
            Request a Demo
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
