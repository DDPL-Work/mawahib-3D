import { motion } from "framer-motion";

const C = {
  gold: "#b8955a",
  goldBright: "#f0c97a",
  bgDark: "#0a0f1e",
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
    body{background:#0a0f1e;color:#f5f0eb;font-family:'Sora',sans-serif;}
  `}</style>
);

export default function Privacy() {
  return (
    <>
      <FontLink />
      <GlobalStyles />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }} style={{ minHeight: "100vh", background: C.bgDark, color: "#fff", padding: "clamp(80px,10vw,120px) clamp(28px,7vw,100px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: "clamp(2.6rem,7vw,4rem)", color: C.goldBright, marginBottom: 18 }}>Privacy Policy</h1>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>Your Privacy Matters</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            At Mawahib, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform and services. We adhere to the highest standards of data protection and comply with all applicable privacy laws and regulations.
          </p>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>Information We Collect</h2>
          <ul style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 2 }}>
            <li><strong>Personal Information:</strong> Name, email address, contact details, and other identifiers you provide when creating an account or applying for a job.</li>
            <li><strong>Professional Data:</strong> Resumes, employment history, education, skills, and other information relevant to recruitment and hiring.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our platform, including log data, device information, and analytics.</li>
            <li><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to enhance your experience and analyze usage patterns.</li>
          </ul>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>How We Use Your Data</h2>
          <ul style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 2 }}>
            <li>To provide, operate, and improve our platform and services</li>
            <li>To process job applications and facilitate recruitment</li>
            <li>To communicate with you regarding your account, applications, or support requests</li>
            <li>To ensure security, prevent fraud, and comply with legal obligations</li>
            <li>To analyze trends and enhance user experience</li>
            <li>For marketing and promotional purposes (with your consent)</li>
          </ul>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>How We Share Your Data</h2>
          <ul style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 2 }}>
            <li>With employers and recruiters for the purpose of recruitment and hiring</li>
            <li>With trusted service providers who assist us in operating our platform</li>
            <li>With regulatory authorities when required by law</li>
            <li>In connection with business transfers, mergers, or acquisitions</li>
            <li>Only with your explicit consent for any other sharing</li>
          </ul>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>Data Security & Retention</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            We implement robust technical and organizational measures to protect your data from unauthorized access, loss, or misuse. Your information is retained only as long as necessary to fulfill the purposes outlined in this policy or as required by law. We regularly review our security practices to ensure your data remains safe.
          </p>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>Your Rights & Choices</h2>
          <ul style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 2 }}>
            <li>Access, update, or delete your personal information</li>
            <li>Object to or restrict certain data processing activities</li>
            <li>Withdraw consent for marketing communications at any time</li>
            <li>Request data portability</li>
            <li>File a complaint with a supervisory authority if you believe your rights have been violated</li>
          </ul>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>International Data Transfers</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            Mawahib operates globally. Your information may be transferred to and processed in countries outside your own, where data protection laws may differ. We ensure that appropriate safeguards are in place to protect your data, in accordance with applicable legal requirements.
          </p>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>Children’s Privacy</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            Our platform is not intended for children under the age of 16. We do not knowingly collect or solicit personal information from minors. If you believe a child has provided us with personal data, please contact us immediately so we can take appropriate action.
          </p>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>Changes to This Policy</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We encourage you to review this page periodically for the latest information. Your continued use of our platform constitutes acceptance of any changes.
          </p>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 40 }}>
          <h2 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>Contact Us</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at <a href="mailto:info@mawahib.ai" style={{ color: C.goldBright, textDecoration: "underline" }}>info@mawahib.ai</a>.
          </p>
        </section>
      </motion.div>
    </>
  );
}
