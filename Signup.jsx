import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
    .auth-container{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0f1e;}
    .auth-card{background:rgba(10,15,30,.98);border-radius:22px;box-shadow:0 8px 40px rgba(0,0,0,.45);padding:clamp(32px,6vw,54px) clamp(18px,5vw,44px);width:100%;max-width:400px;display:flex;flex-direction:column;align-items:center;}
    .auth-logo{margin-bottom:32px;}
    .auth-title{font-family:'DM Serif Display',serif;font-size:2.2rem;color:${C.goldBright};margin-bottom:18px;}
    .auth-form{width:100%;display:flex;flex-direction:column;gap:18px;}
    .auth-input{padding:12px 16px;border-radius:10px;border:1px solid #222;background:#181c24;color:#fff;font-size:1rem;outline:none;transition:border .2s;}
    .auth-input:focus{border:1.5px solid ${C.goldBright};}
    .auth-btn{background:linear-gradient(135deg,${C.gold},${C.goldBright});color:${C.bgDark};font-weight:700;font-size:1.1rem;padding:12px 0;border:none;border-radius:10px;cursor:pointer;box-shadow:0 2px 12px rgba(184,149,90,.13);transition:box-shadow .2s;}
    .auth-btn:hover{box-shadow:0 4px 24px rgba(184,149,90,.22);}
    .auth-link{color:${C.goldBright};text-decoration:underline;font-size:.98rem;}
    @media(max-width:600px){.auth-card{padding:28px 8px;max-width:98vw;}}
  `}</style>
);

function MawahibLogo() {
  return (
    <img src="/logo-m.png" alt="Mawahib" height={44} className="auth-logo" style={{height:140,marginBottom:18}} />
  );
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    // Simulate signup
    alert("Account created! (Demo)");
  };

  return (
    <>
      <FontLink />
      <GlobalStyles />
      <div className="auth-container">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <MawahibLogo />
          <div className="auth-title">Create My Account</div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input className="auth-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
            <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <input className="auth-input" type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            {error && <div style={{ color: '#f87171', fontSize: 14, marginBottom: 6 }}>{error}</div>}
            <button className="auth-btn" type="submit">Create my Account</button>
          </form>
          <div style={{ marginTop: 18, fontSize: 15, color: '#aaa' }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Log In</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
