import { motion } from "framer-motion";
import { CheckCircle2, Factory, Globe2, Briefcase, TrendingUp, Building2, Users, Building } from "lucide-react";

const C = {
  bg: "#f5f0eb",
  bgDark: "#0a0f1e",
  gold: "#b8955a",
  goldLight: "#d4b483",
  goldBright: "#f0c97a",
  white: "#ffffff",
};

const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
  </>
);

const GlobalStyles = () => (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:#0a0f1e;color:#f5f0eb;font-family:'Sora',sans-serif;overflow-x:hidden}
    ::-webkit-scrollbar{width:8px}
    ::-webkit-scrollbar-track{background:#0a0f1e}
    ::-webkit-scrollbar-thumb{background:#b8955a;border-radius:4px}
    .gold-shimmer{
      background:linear-gradient(90deg,#b8955a,#f0c97a,#b8955a,#d4b483,#f0c97a);
      background-size:200% auto;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      animation:shimmer-gold 3s linear infinite
    }
    @keyframes shimmer-gold{
      0%{background-position:-200% center}
      100%{background-position:200% center}
    }
  `}</style>
);

const Label = ({ children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,149,90,.10)", border: `1px solid rgba(184,149,90,.22)`, borderRadius: 9999, padding: "6px 16px", fontSize: 11, fontWeight: 700, color: C.goldBright, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 24 }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.goldBright, boxShadow: `0 0 8px ${C.goldBright}`, display: "inline-block" }} />
    {children}
  </div>
);

const InfoCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, background: "rgba(255,255,255,0.05)", borderColor: "rgba(184,149,90,0.4)" }}
    style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 24,
      padding: 32,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 16,
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
    }}
  >
    <div style={{
      width: 56,
      height: 56,
      borderRadius: 16,
      background: `linear-gradient(135deg, rgba(184,149,90,0.2), rgba(184,149,90,0.05))`,
      color: C.goldBright,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid rgba(184,149,90,0.2)`
    }}>
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>{title}</h3>
    {description && (
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{description}</p>
    )}
  </motion.div>
);

export default function Pricing() {
  return (
    <>
      <FontLink />
      <GlobalStyles />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }} style={{ position: "relative", zIndex: 10 }}>
        <main style={{ minHeight: "100vh", background: C.bgDark, color: C.bg, padding: "clamp(80px,10vw,120px) clamp(24px,5vw,40px)", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
          
          {/* subtle background glow */}
          <div style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100vw",
            height: "100vw",
            maxWidth: "1000px",
            maxHeight: "1000px",
            background: `radial-gradient(circle, rgba(184, 149, 90, 0.05) 0%, transparent 60%)`,
            pointerEvents: "none",
            zIndex: 0
          }} />

          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1000, display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            {/* Header Section */}
            <Label>Pricing</Label>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: "clamp(2.5rem,6vw,4rem)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#fff", marginBottom: 24, textAlign: "center", maxWidth: 800 }}>
              <span className="gold-shimmer">Flexible Pricing</span> Designed for Your Hiring Needs
            </h1>
            
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(16px, 1.8vw, 18px)", lineHeight: 1.8, marginBottom: 80, maxWidth: 760, textAlign: "center" }}>
              <p style={{ marginBottom: 16 }}>
                At Mawahib Talent Hub, we understand that every organization has unique hiring requirements. Recruitment volume, hiring complexity, and organizational needs can vary significantly across companies and industries.
              </p>
              <p style={{ marginBottom: 16, color: C.goldBright, fontWeight: 500 }}>
                For this reason, Mawahib does not follow a one-size-fits-all pricing model.
              </p>
              <p>
                Instead, we offer flexible and tailored pricing, designed to align with each organization’s hiring goals, operational needs, and market environment.
              </p>
            </div>

            {/* What Influences Pricing Grid */}
            <div style={{ width: "100%", marginBottom: 100 }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ textAlign: "center", marginBottom: 40 }}
              >
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: "clamp(2rem,4vw,2.5rem)", color: C.goldBright, marginBottom: 16 }}>
                  What Influences Pricing?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
                  Our pricing structure is customized based on several factors, ensuring you only pay for what you actually need.
                </p>
              </motion.div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
                gap: 24 
              }}>
                <InfoCard delay={0.1} icon={Briefcase} title="Number of Positions" description="The total volume of hiring campaigns or distinct roles you need to fill." />
                <InfoCard delay={0.2} icon={Factory} title="Video Interviews" description="The number of AI-conducted video interviews required per campaign." />
                <InfoCard delay={0.3} icon={Globe2} title="Market & Location" description="Pricing adjusts based on your geographical market or country of operation." />
                <InfoCard delay={0.4} icon={Users} title="Management Level" description="The level of hands-on recruitment campaign management or support you require." />
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                style={{ 
                  textAlign: "center", 
                  color: "rgba(255,255,255,0.7)", 
                  fontSize: 16, 
                  marginTop: 32,
                  maxWidth: 800,
                  margin: "32px auto 0",
                  lineHeight: 1.7
                }}
              >
                This approach allows organizations to benefit from a solution that is both efficient and cost-effective, while ensuring the platform is configured to match their specific hiring strategy.
              </motion.p>
            </div>

            {/* Built for Organizations Grid */}
            <div style={{ width: "100%", marginBottom: 100 }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ textAlign: "center", marginBottom: 40 }}
              >
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: "clamp(2rem,4vw,2.5rem)", color: C.goldBright, marginBottom: 16 }}>
                  Built for Organizations of All Sizes
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
                  Our platform is designed to scale with your hiring needs while maintaining a structured and efficient recruitment process for:
                </p>
              </motion.div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
                gap: 20 
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(184,149,90,0.15)", borderRadius: 20, padding: "24px", display: "flex", alignItems: "center", gap: 16 }}
                >
                  <TrendingUp color={C.goldBright} size={24} />
                  <span style={{ fontSize: 16, fontWeight: 500 }}>Growing startups</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(184,149,90,0.15)", borderRadius: 20, padding: "24px", display: "flex", alignItems: "center", gap: 16 }}
                >
                  <Building color={C.goldBright} size={24} />
                  <span style={{ fontSize: 16, fontWeight: 500 }}>Mid-sized companies</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(184,149,90,0.15)", borderRadius: 20, padding: "24px", display: "flex", alignItems: "center", gap: 16 }}
                >
                  <Building2 color={C.goldBright} size={24} />
                  <span style={{ fontSize: 16, fontWeight: 500 }}>Large enterprises</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(184,149,90,0.15)", borderRadius: 20, padding: "24px", display: "flex", alignItems: "center", gap: 16 }}
                >
                  <Users color={C.goldBright} size={24} />
                  <span style={{ fontSize: 16, fontWeight: 500 }}>High-volume recruitment</span>
                </motion.div>
              </div>
            </div>

            {/* CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ 
                width: "100%",
                background: `linear-gradient(135deg, rgba(184, 149, 90, 0.08) 0%, rgba(10, 15, 30, 0) 100%)`,
                border: `1px solid rgba(184, 149, 90, 0.2)`,
                borderRadius: 32,
                padding: "clamp(40px, 6vw, 60px) clamp(24px, 5vw, 40px)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, transparent, ${C.goldBright}, transparent)`
              }} />
              
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: "clamp(2rem,5vw,2.5rem)", color: "#fff", marginBottom: 20 }}>
                Let's Design the Right Plan for You
              </h2>
              
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px" }}>
                Because every organization’s hiring process is different, our team works closely with clients to design a pricing structure that fits their recruitment workflow.
                <br /><br />
                If you would like to learn more about Mawahib and explore how the platform can support your hiring process, we invite you to connect with our team.
              </p>

              <motion.a
                href="https://wa.me/966556919502"
                target="_blank"
                whileHover={{ scale: 1.05, boxShadow: `0 16px 40px rgba(184,149,90,.3)` }}
                whileTap={{ scale: .96 }}
                style={{ 
                  display: "inline-block",
                  background: `linear-gradient(135deg,${C.gold},${C.goldBright})`, 
                  borderRadius: 50, 
                  padding: "16px 40px", 
                  fontSize: 16, 
                  fontWeight: 600, 
                  fontFamily: "'Sora',sans-serif",
                  color: C.bgDark, 
                  textDecoration: "none", 
                  boxShadow: `0 8px 30px rgba(184,149,90,.2)` 
                }}
              >
                Request a Demo
              </motion.a>
            </motion.div>

          </div>
        </main>
      </motion.div>
    </>
  );
}
