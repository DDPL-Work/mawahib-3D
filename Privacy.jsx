import { motion } from "framer-motion";
import { Shield, Lock, Server, Eye, Database, Clock, FileCheck, ArrowRight } from "lucide-react";

const C = {
  bg: "#f5f0eb",
  bgDark: "#0a0f1e",
  gold: "#b8955a",
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
  <style dangerouslySetInnerHTML={{
    __html:
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

const Label = ({ children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,149,90,.10)", border: "1px solid rgba(184,149,90,.22)", borderRadius: 9999, padding: "6px 16px", fontSize: 11, fontWeight: 700, color: C.goldBright, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 24 }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.goldBright, boxShadow: "0 0 8px " + C.goldBright, display: "inline-block" }} />
    {children}
  </div>
);

const Section = ({ icon: Icon, title, children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay: index * 0.1 }}
    style={{
      background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
      border: "1px solid rgba(184,149,90,0.15)",
      borderRadius: 24,
      padding: "clamp(32px, 5vw, 48px)",
      marginBottom: 32,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(10px)"
    }}
  >
    {/* Decorative blur in the corner */}
    <div style={{
      position: "absolute",
      top: -50,
      right: -50,
      width: 150,
      height: 150,
      background: "radial-gradient(circle, rgba(184, 149, 90, 0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      pointerEvents: "none"
    }} />

    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      {Icon && (
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "rgba(184,149,90,0.1)",
          color: C.goldBright,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(184,149,90,0.2)",
          flexShrink: 0
        }}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
      )}
      <h2 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        color: "#fff",
        margin: 0
      }}>
        {title}
      </h2>
    </div>
    <div style={{
      color: "rgba(255,255,255,0.7)",
      fontSize: "1.05rem",
      lineHeight: 1.8,
      paddingLeft: 0
    }}>
      {/* If children is an array or string that has bullet points, this global style helps it render nicely if needed, but we'll handle layout below */}
      <style dangerouslySetInnerHTML={{
        __html:
          ".section-content ul { padding-left: 20px; margin-top: 16px; margin-bottom: 16px; }\n" +
          ".section-content li { margin-bottom: 8px; position: relative; list-style-type: none; }\n" +
          ".section-content li::before { content: '•'; color: " + C.goldBright + "; position: absolute; left: -18px; font-weight: bold; }\n" +
          ".section-content p { margin-bottom: 16px; }\n" +
          ".section-content p:last-child { margin-bottom: 0; }\n" +
          "@media (max-width: 600px) {\n" +
          "  .mobile-padding { padding-left: 0 !important; margin-top: 16px; }\n" +
          "}"
      }} />
      <div className="section-content mobile-padding" style={{ paddingLeft: 0, transition: "padding 0.3s" }}>
        {children}
      </div>
    </div>
  </motion.div>
);

export default function Privacy() {
  return (
    <>
      <FontLink />
      <GlobalStyles />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 10 }}
      >
        <main style={{
          minHeight: "100vh",
          background: C.bgDark,
          padding: "clamp(80px,10vw,120px) clamp(24px,5vw,40px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}>

          {/* subtle background glow */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            height: "800px",
            background: "radial-gradient(ellipse at top, rgba(184, 149, 90, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0
          }} />

          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 860, display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <Label>Privacy Policy</Label>
              <h1 style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(2.5rem,6vw,4rem)",
                lineHeight: 1.1,
                color: "#fff",
                marginBottom: 24
              }}>
                Security <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.8em", fontWeight: 300, fontStyle: "normal", color: "rgba(255,255,255,0.4)" }}>&</span> <br />
                <span className="gold-shimmer" style={{ fontStyle: "italic" }}>Data Protection</span>
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "clamp(16px, 1.8vw, 18px)",
                lineHeight: 1.8,
                maxWidth: 700,
                margin: "0 auto"
              }}>
                At Mawahib Talent Hub, protecting the privacy and security of candidate and client data is a fundamental priority. Our platform is designed with multiple security measures to ensure that sensitive recruitment information is handled responsibly and securely throughout the hiring process.
              </p>
            </div>

            {/* Sections */}
            <Section icon={Server} title="Secure Infrastructure" index={1}>
              <p>Mawahib operates on secure cloud-based infrastructure hosted on European data centers. Our platform uses trusted cloud services and modern infrastructure technologies to ensure system stability, reliability, and protection of stored data.</p>
              <p>All communication between users and the Mawahib platform is protected using HTTPS and SSL encryption, ensuring that all transmitted information remains secure and protected from unauthorized access.</p>
            </Section>

            <Section icon={Lock} title="Controlled Access to Data" index={2}>
              <p>Access to recruitment data within Mawahib is strictly controlled.</p>
              <p>Candidate information, interview recordings, and recruitment campaign data are only accessible to the owner of the recruitment campaign. This means that the hiring organization that created the campaign has full visibility and control over the candidates who apply.</p>
              <p>In cases where a company requests Mawahib to manage a recruitment campaign on its behalf, the Mawahib team may access the data strictly for the purpose of supporting the recruitment process and sharing results with the authorized representatives of the hiring organization.</p>
            </Section>

            <Section icon={Database} title="Candidate Data Handling" index={3}>
              <p>The Mawahib platform may collect and process candidate information necessary for recruitment evaluation, including:</p>
              <ul>
                <li>CV and professional profile information</li>
                <li>Candidate name and contact details (email and phone number)</li>
                <li>Video interview recordings and audio responses</li>
                <li>Any additional information requested by the hiring organization and voluntarily provided by the candidate through the platform</li>
              </ul>
              <p style={{ marginTop: 16 }}>This information is used exclusively for recruitment evaluation purposes.</p>
            </Section>

            <Section icon={Eye} title="AI Processing and Data Usage" index={4}>
              <p>Mawahib uses artificial intelligence technologies to analyze CVs and evaluate candidate interviews.</p>
              <p>Candidate data submitted through the platform is used solely for analysis and recruitment evaluation. <strong>This information is not used to train AI models</strong> and is not retained for machine learning training purposes.</p>
            </Section>

            <Section icon={Shield} title="Data Ownership and Control" index={5}>
              <p>Recruitment data belongs to the organization that created the hiring campaign.</p>
              <p>The campaign owner has full control over candidate data within the platform, including the ability to review candidate profiles, access interview recordings, and remove candidate information when necessary.</p>
            </Section>

            <Section icon={Clock} title="Video Storage and Retention" index={6}>
              <p>Interview recordings are stored securely in cloud storage environments.</p>
              <p>To protect candidate privacy and limit long-term data retention, <strong>interview videos are automatically deleted after three months.</strong> Campaign owners may also remove interview recordings earlier if required.</p>
            </Section>

            <Section icon={FileCheck} title="Data Privacy and Confidentiality" index={7}>
              <p>Mawahib does not share candidate or recruitment data with any third parties. All information submitted through the platform remains confidential and is used strictly within the context of the hiring process managed by the recruiting organization.</p>
            </Section>

            <Section icon={Server} title="Backup and Reliability" index={8}>
              <p>To ensure service reliability and data protection, Mawahib maintains secure backup systems designed to protect platform data and support recovery in the unlikely event of system failures.</p>
            </Section>

            {/* Footer Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              style={{
                marginTop: 40,
                textAlign: "center",
                padding: "40px 20px",
                borderTop: "1px solid rgba(184, 149, 90, 0.2)"
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
                If you have questions regarding security, privacy, or data handling practices, our team will be happy to provide further information.
              </p>
              <a
                href="mailto:info@mwahib.ai"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: C.goldBright,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 16,
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
                onMouseOut={(e) => e.currentTarget.style.opacity = 1}
              >
                Contact Privacy Team <ArrowRight size={18} />
              </a>
            </motion.div>

          </div>
        </main>
      </motion.div>
    </>
  );
}
