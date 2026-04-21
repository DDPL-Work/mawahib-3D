import { useState, useEffect } from "react";
import { LogOut, FileText, HelpCircle, Settings, X, Sparkles, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DASHBOARD_AUTH_KEY } from "./authConfig";
import { useNavigate } from "react-router-dom";

const C = {
  gold: "#b8955a",
  goldBright: "#f0c97a",
  goldDim: "rgba(184,149,90,0.12)",
  goldBorder: "rgba(184,149,90,0.22)",
  inkWhite: "#ffffff",
  inkSoft: "rgba(245,240,235,0.85)",
  inkMuted: "rgba(245,240,235,0.5)",
  line: "rgba(184,149,90,0.12)",
  bgPanel: "rgba(11,16,29,0.95)",
  redDim: "rgba(255,107,107,0.1)",
  red: "#ff6b6b",
};

export default function SettingsModal({ onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleLogout = () => {
    sessionStorage.removeItem(DASHBOARD_AUTH_KEY);
    onClose();
    navigate("/login");
  };

  const Option = ({ icon: Icon, label, danger, onClick }) => (
    <button onClick={onClick} style={{
      width: "100%", border: "none", background: "transparent",
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 16px", cursor: "pointer",
      color: danger ? C.red : C.inkSoft,
      fontSize: 14, fontWeight: 500, fontFamily: "'Sora', sans-serif",
      transition: "all 0.2s ease"
    }}
      onMouseEnter={e => {
        if(danger) {
          e.currentTarget.style.background = C.redDim;
        } else {
          e.currentTarget.style.background = `linear-gradient(135deg, ${C.goldDim}, rgba(240,201,122,0.03))`;
        }
      }}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <Icon size={16} color={danger ? C.red : C.inkMuted} style={{ transition: "all 0.2s ease" }} />
      {label}
    </button>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1010 }} />

      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.96 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 72, right: "max(16px, 2.5vw)",
          zIndex: 1020, width: 265,
          background: C.bgPanel,
          backdropFilter: "blur(24px) saturate(1.2)",
          WebkitBackdropFilter: "blur(24px) saturate(1.2)",
          borderRadius: 14,
          boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(184,149,90,0.15)",
          border: `1px solid ${C.goldBorder}`,
          fontFamily: "'Sora', sans-serif",
          overflow: "hidden"
        }}
      >
        {/* Header Region */}
        <div style={{ padding: "18px 16px" }}>
          <div style={{ fontSize: 13, color: C.inkMuted, marginBottom: 4, letterSpacing: "0.02em" }}>Signed in as</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.inkWhite, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.goldBright, boxShadow: `0 0 6px ${C.goldBright}` }} />
            ddpldeveloper@gmail.com
          </div>
        </div>

        <div style={{ height: 1, background: C.line }} />

        <div style={{ padding: "12px 16px 4px", fontSize: 11, fontWeight: 600, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Account Menu
        </div>

        <div style={{ padding: "6px 0" }}>
          <Option icon={Calendar} label="My Calendar" onClick={onClose} />
          <Option icon={FileText} label="Statement" onClick={onClose} />
          <Option icon={Sparkles} label="Start Tour" onClick={onClose} />
          <Option icon={Settings} label="Change Password" onClick={onClose} />
        </div>

        <div style={{ height: 1, background: C.line, margin: "2px 0" }} />

        <div style={{ padding: "6px 0 10px 0" }}>
          <Option icon={LogOut} label="Sign out" danger onClick={handleLogout} />
        </div>
      </motion.div>
    </>
  );
}
