import { motion } from "framer-motion";
import { Zap, Clock, Target, Brain, BarChart3, Globe, Eye, Rocket } from "lucide-react";

const C = {
  bgDark: "#0a0f1e",
  gold: "#b8955a",
  goldBright: "#f0c97a",
};

const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
  </>
);

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html:
    "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n" +
    "html{scroll-behavior:smooth}\n" +
    "body{background:#0a0f1e;color:#f5f0eb;font-family:'Sora',sans-serif;overflow-x:hidden}\n" +
    "::-webkit-scrollbar{width:8px}\n" +
    "::-webkit-scrollbar-track{background:#0a0f1e}\n" +
    "::-webkit-scrollbar-thumb{background:#b8955a;border-radius:4px}\n" +
    ".gold-shimmer{\n" +
    "  background:linear-gradient(90deg,#b8955a,#f0c97a,#b8955a,#d4b483,#f0c97a);\n" +
    "  background-size:200% auto;\n" +
    "  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\n" +
    "  animation:shimmer-gold 3s linear infinite\n" +
    "}\n" +
    "@keyframes shimmer-gold{\n" +
    "  0%{background-position:-200% center}\n" +
    "  100%{background-position:200% center}\n" +
    "}"
  }} />
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.7, delay },
});

const Pill = ({ children }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(184,149,90,.10)", border: "1px solid rgba(184,149,90,.25)",
    borderRadius: 9999, padding: "6px 18px", fontSize: 11, fontWeight: 700,
    color: C.goldBright, letterSpacing: "1.6px", textTransform: "uppercase", marginBottom: 24
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.goldBright, boxShadow: "0 0 8px " + C.goldBright, display: "inline-block" }} />
    {children}
  </div>
);

const Divider = () => (
  <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg,transparent,rgba(184,149,90,0.3),transparent)", margin: "60px 0" }} />
);

const IconBox = ({ icon: Icon }) => (
  <div style={{
    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
    background: "rgba(184,149,90,0.08)", border: "1px solid rgba(184,149,90,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", color: C.goldBright
  }}>
    <Icon size={22} strokeWidth={1.5} />
  </div>
);

const Section = ({ icon, title, children, index }) => (
  <motion.div {...fadeUp(index * 0.08)} style={{
    background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))",
    border: "1px solid rgba(184,149,90,0.13)", borderRadius: 24,
    padding: "clamp(28px,4vw,44px)", position: "relative", overflow: "hidden"
  }}>
    <div style={{
      position: "absolute", top: -60, right: -60, width: 180, height: 180,
      background: "radial-gradient(circle,rgba(184,149,90,0.07) 0%,transparent 70%)",
      borderRadius: "50%", pointerEvents: "none"
    }} />
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
      {icon && <IconBox icon={icon} />}
      <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(1.4rem,2.5vw,1.85rem)", color: "#fff", margin: 0 }}>
        {title}
      </h2>
    </div>
    <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "1.05rem", lineHeight: 1.85 }}>
      {children}
    </div>
  </motion.div>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: "16px 0 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.goldBright, flexShrink: 0, marginTop: 8 }} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const PrincipleCard = ({ icon: Icon, label, desc }) => (
  <motion.div
    whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(184,149,90,0.12)" }}
    transition={{ type: "spring", stiffness: 300 }}
    style={{
      flex: "1 1 200px", background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(184,149,90,0.18)", borderRadius: 20,
      padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14, cursor: "default"
    }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: "rgba(184,149,90,0.1)", border: "1px solid rgba(184,149,90,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center", color: C.goldBright
    }}>
      <Icon size={20} strokeWidth={1.5} />
    </div>
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{desc}</div>
    </div>
  </motion.div>
);

export default function About() {
  return (
    <>
      <FontLink />
      <GlobalStyles />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <main style={{
          minHeight: "100vh", background: C.bgDark,
          padding: "clamp(80px,10vw,120px) clamp(24px,5vw,48px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          position: "relative", overflow: "hidden"
        }}>

          {/* Background ambient glow */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "120%", height: "900px",
            background: "radial-gradient(ellipse at top,rgba(184,149,90,0.07) 0%,transparent 65%)",
            pointerEvents: "none", zIndex: 0
          }} />

          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", gap: 32 }}>

            {/* ── Hero ── */}
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <motion.div {...fadeUp(0)}>
                <Pill>About Mawahib</Pill>
                <h1 style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: "clamp(2.6rem,6vw,4.2rem)", lineHeight: 1.08, color: "#fff", marginBottom: 20
                }}>
                  Automated.{" "}
                  <span className="gold-shimmer" style={{ fontStyle: "italic" }}>Faster.</span>
                  <br />More Accurate.
                </h1>
                <p style={{
                  color: "rgba(255,255,255,0.75)", fontSize: "clamp(16px,1.8vw,18px)",
                  lineHeight: 1.8, maxWidth: 680, margin: "0 auto 36px"
                }}>
                  A Jordanian recruitment technology company founded in 2023, built to transform the hiring process through intelligent automation, speed, and accuracy.
                </p>
              </motion.div>

              {/* Core principles strip */}
              <motion.div {...fadeUp(0.15)} style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                <PrincipleCard icon={Zap} label="Automation" desc="Replaces fragmented manual steps with an intelligent hiring engine." />
                <PrincipleCard icon={Clock} label="Speed" desc="Move from job opening to qualified candidate evaluation faster than ever." />
                <PrincipleCard icon={Target} label="Accuracy" desc="Structured AI evaluation delivers more objective, consistent outcomes." />
              </motion.div>
            </div>

            <Divider />

            {/* ── A New Generation ── */}
            <Section icon={Rocket} title="A New Generation of Hiring" index={1}>
              <p>Traditional recruitment processes often require significant manual effort in screening CVs, scheduling interviews, and evaluating candidates. This approach is time-consuming, inconsistent, and difficult to scale.</p>
              <p style={{ marginTop: 14 }}>Mawahib replaces these fragmented steps with an automated hiring engine that structures and accelerates the entire recruitment workflow. Organizations can move from job opening to qualified candidate evaluation far more efficiently, while maintaining a high level of objectivity and consistency.</p>
            </Section>

            {/* ── End-to-End Process ── */}
            <Section icon={BarChart3} title="End-to-End Recruitment Process" index={2}>
              <p>Mawahib provides a fully integrated recruitment workflow designed to help companies manage hiring from start to finish.</p>
              <p style={{ marginTop: 14 }}>The process begins with collecting the job description and hiring requirements from the client. Based on this, the platform configures a structured recruitment campaign that defines evaluation criteria, required competencies, and candidate assessment methods.</p>
              <p style={{ marginTop: 14 }}>Candidates submit their applications directly through the platform. The system performs AI-assisted CV parsing and analysis, evaluating profiles against predefined criteria — enabling hiring teams to quickly identify the most relevant candidates without manually reviewing hundreds of CVs.</p>
            </Section>

            {/* ── AI Video Interviews ── */}
            <Section icon={Brain} title="AI-Powered Video Interviews" index={3}>
              <p>A key innovation introduced by Mawahib is the use of AI-driven video interviews.</p>
              <p style={{ marginTop: 14 }}>Shortlisted candidates are invited to complete a structured interview conducted by an AI interviewer trained to discuss job requirements, ask targeted questions, and evaluate candidate responses.</p>
              <p style={{ marginTop: 14 }}>The system records the interview, analyzes responses, and generates structured insights that help hiring managers better understand candidate suitability — allowing decision makers to review interviews and make informed hiring decisions with significantly less time investment.</p>
            </Section>

            {/* ── Recruitment Intelligence ── */}
            <Section icon={Eye} title="Recruitment Intelligence for Decision Makers" index={4}>
              <p>Mawahib provides hiring teams with organized, structured information about each candidate, including:</p>
              <BulletList items={[
                "AI-analyzed CV profiles",
                "Structured candidate evaluation data",
                "Recorded AI interview sessions",
                "Candidate strengths and skill insights",
                "Role-specific evaluation criteria"
              ]} />
              <p style={{ marginTop: 18 }}>These insights help hiring managers and executives make more accurate decisions supported by data rather than intuition alone.</p>
            </Section>

            {/* ── Innovation ── */}
            <Section icon={Globe} title="Innovation in the Middle East Recruitment Market" index={5}>
              <p>Mawahib is among the first companies in the Middle East to introduce AI-powered video interviewing combined with structured CV analysis within a unified recruitment platform.</p>
              <p style={{ marginTop: 14 }}>By integrating automation and artificial intelligence into recruitment workflows, Mawahib helps organizations reduce hiring effort, accelerate candidate evaluation, and maintain higher hiring quality.</p>
            </Section>

            <Divider />

            {/* ── Vision & Mission ── */}
            <motion.div {...fadeUp(0.1)} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>

              {/* Vision */}
              <div style={{
                background: "linear-gradient(145deg,rgba(184,149,90,0.09),rgba(184,149,90,0.04))",
                border: "1px solid rgba(184,149,90,0.25)", borderRadius: 24, padding: "36px 32px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: "rgba(184,149,90,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: C.goldBright
                  }}>
                    <Rocket size={18} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.6rem", color: C.goldBright, margin: 0 }}>Vision</h3>
                </div>
                <p style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.85, fontSize: "1rem" }}>
                  To become the leading AI-powered hiring platform that redefines how talent is discovered, evaluated, and developed — enabling <strong style={{ color: "#fff" }}>Automated, Faster, and Accurate</strong> hiring decisions that are fair, transparent, and based on true potential, not impressions.
                </p>
              </div>

              {/* Mission */}
              <div style={{
                background: "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
                border: "1px solid rgba(184,149,90,0.15)", borderRadius: 24, padding: "36px 32px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: "rgba(184,149,90,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: C.goldBright
                  }}>
                    <Target size={18} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.6rem", color: C.goldBright, margin: 0 }}>Mission</h3>
                </div>
                <p style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.85, fontSize: "1rem" }}>
                  To transform hiring into a structured, fair, and data-driven process by empowering organizations to evaluate, interview, and select talent through intelligent AI solutions — removing bias, saving time, and enabling better people decisions.
                </p>
              </div>

            </motion.div>

          </div>
        </main>
      </motion.div>
    </>
  );
}
