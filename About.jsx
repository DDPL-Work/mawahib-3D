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

export default function About() {
  return (
    <>
      <FontLink />
      <GlobalStyles />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }} style={{ minHeight: "100vh", background: C.bgDark, color: "#fff", padding: "clamp(80px,10vw,120px) clamp(28px,7vw,100px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: "clamp(2.6rem,7vw,4rem)", color: C.goldBright, marginBottom: 18 }}>About Mawahib</h1>
        <p style={{ maxWidth: 800, fontSize: 18, lineHeight: 1.8, marginBottom: 40, color: "rgba(255,255,255,.7)" }}>
          Mawahib is a pioneering technology company dedicated to transforming the way organizations discover, assess, and hire talent. Our mission is to empower businesses with cutting-edge AI-driven solutions that streamline recruitment, reduce bias, and unlock the full potential of global talent pools. We believe that hiring should be efficient, fair, and data-driven—enabling every organization to build exceptional teams.
        </p>
        <section style={{ maxWidth: 900, marginBottom: 60 }}>
          <h2 style={{ color: C.gold, fontSize: 28, marginBottom: 16 }}>Our Story</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,.6)" }}>
            Founded in 2023 by a diverse team of engineers, recruiters, and data scientists, Mawahib was born out of a shared frustration with outdated, manual, and often biased hiring processes. Our founders recognized that technology could bridge the gap between talent and opportunity, making recruitment faster, more transparent, and more equitable. Since our inception, we have helped hundreds of organizations modernize their hiring workflows and achieve better outcomes.
          </p>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 60 }}>
          <h2 style={{ color: C.gold, fontSize: 28, marginBottom: 16 }}>Our Vision & Values</h2>
          <ul style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 2, marginBottom: 10 }}>
            <li><strong>Innovation:</strong> We continuously push the boundaries of what’s possible in HR technology, leveraging AI and data science to deliver smarter solutions.</li>
            <li><strong>Integrity:</strong> We are committed to fairness, transparency, and ethical practices in all aspects of our business and technology.</li>
            <li><strong>Customer Success:</strong> Our clients’ goals are our top priority. We partner closely to ensure every organization achieves measurable hiring improvements.</li>
            <li><strong>Diversity & Inclusion:</strong> We believe diverse teams drive better results. Our platform is designed to reduce bias and promote equal opportunity for all candidates.</li>
            <li><strong>Continuous Learning:</strong> We foster a culture of growth, curiosity, and knowledge sharing—both within our team and for our clients.</li>
          </ul>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 60 }}>
          <h2 style={{ color: C.gold, fontSize: 28, marginBottom: 16 }}>What We Do</h2>
          <ul style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 2, marginBottom: 10 }}>
            <li>AI-powered candidate screening and ranking</li>
            <li>Automated, structured video interviews</li>
            <li>Comprehensive analytics and reporting for hiring teams</li>
            <li>Bias-reduction tools and fair evaluation frameworks</li>
            <li>Seamless integration with leading HR platforms</li>
            <li>Global reach—supporting clients and candidates in 190+ countries</li>
          </ul>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 60 }}>
          <h2 style={{ color: C.gold, fontSize: 28, marginBottom: 16 }}>Leadership & Team</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", marginBottom: 10 }}>
            Our leadership team brings together decades of experience in technology, human resources, and business strategy. We are passionate about building a workplace that values creativity, collaboration, and impact. Every member of Mawahib is dedicated to our mission of making hiring smarter and more human.
          </p>
          <ul style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 2 }}>
            <li>Engineers and product designers focused on scalable, secure, and user-friendly solutions</li>
            <li>Recruitment experts who understand the challenges of modern talent acquisition</li>
            <li>Data scientists and AI specialists committed to fairness and accuracy</li>
            <li>Customer success and support teams dedicated to your growth</li>
          </ul>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 60 }}>
          <h2 style={{ color: C.gold, fontSize: 28, marginBottom: 16 }}>Our Impact</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)" }}>
            Mawahib has enabled organizations to reduce time-to-hire by up to 60%, improve candidate experience, and increase workforce diversity. Our clients range from fast-growing startups to global enterprises, all united by a desire to hire better, faster, and more fairly.
          </p>
        </section>
        <section style={{ maxWidth: 900, marginBottom: 60 }}>
          <h2 style={{ color: C.gold, fontSize: 28, marginBottom: 16 }}>Contact Us</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)" }}>
            We’d love to hear from you. For partnership opportunities, media inquiries, or support, email <a href="mailto:info@mawahib.ai" style={{ color: C.goldBright, textDecoration: "underline" }}>info@mawahib.ai</a> or visit our website.
          </p>
        </section>
      </motion.div>
    </>
  );
}
