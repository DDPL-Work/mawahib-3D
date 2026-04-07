import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, CheckSquare, Plus, Square, Upload,
  ChevronDown, ChevronUp, Info, Sparkles, Wand2, RefreshCw,
  Trash2, GripVertical, AlertCircle, Check, ExternalLink,
  Copy, Link2, Video, Globe, Users, FileText, Settings2,
  BarChart3, X,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bgDark: "#080d1c",
  bgPanel: "rgba(11,17,34,0.90)",
  bgCard: "rgba(8,12,24,0.85)",
  bgInput: "rgba(6,10,20,0.75)",
  gold: "#b8955a",
  goldBright: "#f0c97a",
  goldDim: "rgba(240,201,122,0.14)",
  goldBorder: "rgba(184,149,90,0.28)",
  goldBorderHot: "rgba(240,201,122,0.55)",
  inkWhite: "#ffffff",
  inkSoft: "rgba(245,240,235,0.82)",
  inkMuted: "rgba(245,240,235,0.48)",
  inkFaint: "rgba(245,240,235,0.22)",
  line: "rgba(184,149,90,0.16)",
  lineStrong: "rgba(184,149,90,0.32)",
  blue: "#5f9eff",
  blueDim: "rgba(95,158,255,0.12)",
  blueBorder: "rgba(95,158,255,0.28)",
  green: "#39c98f",
  greenDim: "rgba(57,201,143,0.12)",
  greenBorder: "rgba(57,201,143,0.28)",
  yellow: "#e3c466",
  yellowDim: "rgba(227,196,102,0.12)",
  red: "#ff6b6b",
  redDim: "rgba(255,107,107,0.10)",
  redBorder: "rgba(255,107,107,0.28)",
};

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_REQUIREMENTS = [
  { id: 1, requirement: "Experience with CRM tools", weight: 40 },
  { id: 2, requirement: "Pipeline management and forecasting", weight: 35 },
  { id: 3, requirement: "Strong closing and negotiation skills", weight: 25 },
];
const INITIAL_INTAKE = [
  { id: 1, description: "Expected Salary", idealAnswer: "e.g. 8,000–12,000 SAR", type: "Text", scoring: "Preferred" },
  { id: 2, description: "Notice Period", idealAnswer: "e.g. Immediate or ≤ 30 days", type: "Text", scoring: "Preferred" },
  { id: 3, description: "Gender", idealAnswer: "Optional and role dependent", type: "Text", scoring: "Preferred" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────
const Input = ({ value, onChange, placeholder, type = "text", min, max, style = {}, ...rest }) => (
  <input
    type={type} value={value} onChange={onChange} placeholder={placeholder}
    min={min} max={max}
    style={{
      width: "100%", height: 40, padding: "0 12px",
      background: C.bgInput, border: `1px solid ${C.line}`,
      borderRadius: 10, color: C.inkSoft, fontSize: 13, outline: "none",
      fontFamily: "'Sora', sans-serif", transition: "border-color 0.18s",
      ...style,
    }}
    onFocus={e => e.target.style.borderColor = C.goldBorder}
    onBlur={e => e.target.style.borderColor = C.line}
    {...rest}
  />
);

const Select = ({ value, onChange, children, style = {} }) => (
  <select value={value} onChange={onChange} style={{
    width: "100%", height: 40, padding: "0 12px",
    background: C.bgInput, border: `1px solid ${C.line}`,
    borderRadius: 10, color: C.inkSoft, fontSize: 13, outline: "none",
    fontFamily: "'Sora', sans-serif", cursor: "pointer", appearance: "none",
    transition: "border-color 0.18s", ...style,
  }}
    onFocus={e => e.target.style.borderColor = C.goldBorder}
    onBlur={e => e.target.style.borderColor = C.line}
  >{children}</select>
);

const Textarea = ({ value, onChange, placeholder, rows = 5 }) => (
  <textarea
    value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{
      width: "100%", padding: "10px 12px",
      background: C.bgInput, border: `1px solid ${C.line}`,
      borderRadius: 10, color: C.inkSoft, fontSize: 13,
      fontFamily: "'Sora', sans-serif", outline: "none", resize: "vertical",
      lineHeight: 1.7, transition: "border-color 0.18s",
    }}
    onFocus={e => e.target.style.borderColor = C.goldBorder}
    onBlur={e => e.target.style.borderColor = C.line}
  />
);

const FieldLabel = ({ children, optional, required, hint }) => (
  <div style={{ marginBottom: 6 }}>
    <div style={{ fontSize: 12.5, fontWeight: 600, color: C.inkSoft, display: "flex", alignItems: "center", gap: 5 }}>
      {children}
      {required && <span style={{ color: "#ff9393", fontSize: 13 }}>*</span>}
      {optional && <span style={{ color: C.inkFaint, fontWeight: 400, fontSize: 11.5 }}>(optional)</span>}
    </div>
    {hint && <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 3, lineHeight: 1.5 }}>{hint}</div>}
  </div>
);

const GhostBtn = ({ children, onClick, icon: Icon, danger, primary, disabled, small }) => (
  <button
    onClick={onClick} disabled={disabled}
    style={{
      height: small ? 30 : 36, padding: small ? "0 10px" : "0 14px",
      border: `1px solid ${danger ? C.redBorder : primary ? C.blueBorder : C.line}`,
      background: danger ? C.redDim : primary ? C.blueDim : "rgba(184,149,90,0.06)",
      color: danger ? C.red : primary ? C.blue : C.inkSoft,
      borderRadius: 9, fontSize: small ? 11.5 : 12.5, fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "'Sora', sans-serif", transition: "all 0.18s", whiteSpace: "nowrap",
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = danger ? C.red : primary ? C.blue : C.lineStrong; e.currentTarget.style.color = danger ? "#ffaaaa" : primary ? "#b8d4ff" : "#fff"; } }}
    onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = danger ? C.redBorder : primary ? C.blueBorder : C.line; e.currentTarget.style.color = danger ? C.red : primary ? C.blue : C.inkSoft; } }}
  >
    {Icon && <Icon size={small ? 12 : 14} />} {children}
  </button>
);

const Toggle = ({ checked, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
    <div
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: checked ? C.green : "rgba(255,255,255,0.1)",
        border: `1px solid ${checked ? C.greenBorder : C.line}`,
        position: "relative", transition: "all 0.22s", cursor: "pointer",
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: checked ? 23 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: checked ? "#fff" : C.inkFaint,
        transition: "left 0.22s, background 0.22s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
    {label && <span style={{ fontSize: 13.5, color: checked ? C.inkSoft : C.inkMuted, fontWeight: checked ? 600 : 400, transition: "all 0.18s" }}>{label}</span>}
  </label>
);

const SectionCard = ({ icon: Icon, iconColor, title, subtitle, badge, children, collapsible, defaultOpen = true, rightSlot }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: C.bgPanel, border: `1px solid ${C.line}`,
      borderRadius: 22, backdropFilter: "blur(16px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.28)", overflow: "hidden",
    }}>
      <div
        style={{
          padding: "18px 22px", borderBottom: open ? `1px solid ${C.line}` : "none",
          display: "flex", alignItems: "center", gap: 14,
          cursor: collapsible ? "pointer" : "default",
          transition: "background 0.18s",
        }}
        onClick={collapsible ? () => setOpen(o => !o) : undefined}
        onMouseEnter={e => { if (collapsible) e.currentTarget.style.background = "rgba(184,149,90,0.03)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        {Icon && (
          <div style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: `${iconColor || C.goldBright}18`,
            border: `1px solid ${iconColor || C.goldBright}35`,
            display: "grid", placeItems: "center",
          }}>
            <Icon size={18} color={iconColor || C.goldBright} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", fontWeight: 400, color: C.inkWhite, margin: 0 }}>{title}</h2>
            {badge && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "3px 9px", borderRadius: 999,
                background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color,
              }}>{badge.label}</span>
            )}
          </div>
          {subtitle && <div style={{ fontSize: 12.5, color: C.inkFaint, marginTop: 3 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {rightSlot}
          {collapsible && (open ? <ChevronUp size={16} color={C.inkFaint} /> : <ChevronDown size={16} color={C.inkFaint} />)}
        </div>
      </div>
      {open && <div style={{ padding: "20px 22px" }}>{children}</div>}
    </div>
  );
};

const InfoBox = ({ children, color = C.blue, dimColor = C.blueDim, borderColor = C.blueBorder }) => (
  <div style={{
    display: "flex", gap: 10, padding: "12px 14px",
    background: dimColor, border: `1px solid ${borderColor}`,
    borderRadius: 12, alignItems: "flex-start",
  }}>
    <Info size={14} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
    <div style={{ fontSize: 12.5, color: C.inkMuted, lineHeight: 1.65 }}>{children}</div>
  </div>
);

const WeightBadge = ({ total }) => {
  const ok = total === 100;
  const over = total > 100;
  const color = ok ? C.green : over ? C.red : C.yellow;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 999,
      background: ok ? C.greenDim : over ? C.redDim : C.yellowDim,
      border: `1px solid ${ok ? C.greenBorder : over ? C.redBorder : "rgba(227,196,102,0.3)"}`,
      fontSize: 12, fontWeight: 700, color,
    }}>
      {ok ? <Check size={12} /> : <AlertCircle size={12} />}
      Total: {total}%
      {!ok && <span style={{ fontWeight: 400, fontSize: 11 }}>{over ? " — reduce weights" : ` — need ${100 - total}% more`}</span>}
    </div>
  );
};

// ─── Step Progress ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Company & Role", icon: FileText },
  { id: 2, label: "CV Submission", icon: Upload },
  { id: 3, label: "Interview Setup", icon: Video },
  { id: 4, label: "Review & Launch", icon: Link2 },
];

const StepProgress = ({ current }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 0, flexWrap: "nowrap", overflowX: "auto",
    padding: "0 4px",
  }}>
    {STEPS.map((step, i) => {
      const done = step.id < current;
      const active = step.id === current;
      const Icon = step.icon;
      return (
        <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "0 8px" }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              display: "grid", placeItems: "center",
              background: done ? C.greenDim : active ? `linear-gradient(135deg,${C.gold},${C.goldBright})` : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${done ? C.greenBorder : active ? C.goldBright : C.line}`,
              transition: "all 0.3s ease",
              flexShrink: 0,
            }}>
              {done
                ? <Check size={16} color={C.green} />
                : <Icon size={15} color={active ? "#1a1006" : C.inkFaint} />}
            </div>
            <span style={{
              fontSize: 11, fontWeight: active ? 700 : 400,
              color: done ? C.green : active ? C.goldBright : C.inkFaint,
              whiteSpace: "nowrap", transition: "all 0.3s",
            }}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: "clamp(24px,4vw,48px)", height: 1.5, flexShrink: 0,
              background: done ? C.green : C.line,
              marginBottom: 22, transition: "background 0.3s",
            }} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Interview() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [enableCV, setEnableCV] = useState(true);
  const [enableInterview, setEnableInterview] = useState(true);
  const [allowEveryone, setAllowEveryone] = useState(true);
  const [requirements, setRequirements] = useState(INITIAL_REQUIREMENTS);
  const [intakeItems, setIntakeItems] = useState(INITIAL_INTAKE);
  const [specificTags, setSpecificTags] = useState(["Expected salary", "Years of experience"]);
  const [tagInput, setTagInput] = useState("");
  const [mandatoryQ, setMandatoryQ] = useState("");
  const [mandatoryQList, setMandatoryQList] = useState([]);
  const [showLinks, setShowLinks] = useState(false);
  const [copied, setCopied] = useState(null);
  const copyRef = { current: null };

  const [form, setForm] = useState({
    company: "Demo Company", jobTitle: "Sales Executive", department: "Sales",
    plan: "Standard", jd: "We are hiring a Sales Executive to drive pipeline growth and manage key accounts. The role focuses on consultative selling, product demos, and closing.",
    maxCVs: "50", cvEndDate: "2026-04-03",
    interviewLevel: "Mid Level", questionCount: "10", interviewEndDate: "2026-04-07",
    language: "English",
  });
  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const totalWeight = useMemo(() => requirements.reduce((s, r) => s + (Number(r.weight) || 0), 0), [requirements]);

  const updateReq = (id, key, val) => setRequirements(p => p.map(r => r.id === id ? { ...r, [key]: val } : r));
  const addReq = () => setRequirements(p => [...p, { id: Date.now(), requirement: "", weight: 0 }]);
  const removeReq = (id) => setRequirements(p => p.filter(r => r.id !== id));
  const normalizeWeights = () => {
    if (!requirements.length) return;
    const base = Math.floor(100 / requirements.length);
    const extra = 100 - base * requirements.length;
    setRequirements(p => p.map((r, i) => ({ ...r, weight: i < extra ? base + 1 : base })));
  };
  const suggestFromJD = () => {
    const isSales = /sales|pipeline|account|crm/i.test(form.jd);
    setRequirements(isSales ? INITIAL_REQUIREMENTS : [
      { id: 1, requirement: "Role-specific technical skills", weight: 45 },
      { id: 2, requirement: "Communication and stakeholder management", weight: 30 },
      { id: 3, requirement: "Problem solving and ownership", weight: 25 },
    ]);
  };
  const improveJD = () => {
    if (/KPIs|outcomes/i.test(form.jd)) return;
    setF("jd", form.jd + " Success will be measured by monthly pipeline value, win-rate, and client retention KPIs.");
  };

  const updateIntake = (id, key, val) => setIntakeItems(p => p.map(r => r.id === id ? { ...r, [key]: val } : r));
  const addIntake = () => setIntakeItems(p => [...p, { id: Date.now(), description: "", idealAnswer: "", type: "Text", scoring: "Preferred" }]);
  const removeIntake = (id) => setIntakeItems(p => p.filter(r => r.id !== id));

  const addTag = () => {
    const clean = tagInput.trim();
    if (!clean || specificTags.some(t => t.toLowerCase() === clean.toLowerCase())) { setTagInput(""); return; }
    setSpecificTags(p => [...p, clean]); setTagInput("");
  };
  const removeTag = (t) => setSpecificTags(p => p.filter(x => x !== t));

  const addMandatoryQ = () => {
    const q = mandatoryQ.trim();
    if (!q) return;
    setMandatoryQList(p => [...p, q]); setMandatoryQ("");
  };

  const doCopy = (text, key) => {
    navigator.clipboard?.writeText(text).catch(() => { });
    setCopied(key);
    clearTimeout(copyRef.current);
    copyRef.current = setTimeout(() => setCopied(null), 1800);
  };

  const generatedLinks = {
    cv: "https://mawahib.ai/apply/DEMOT-F9908C",
    interview: "https://mawahib.ai/interview?code=DEMO-073298",
    cvCode: "DEMOT-F9908C",
    intCode: "DEMO-073298",
  };

  const canProceed = {
    1: form.company && form.jobTitle && form.jd && totalWeight === 100,
    2: true,
    3: true,
  };

  const stepErrors = {
    1: totalWeight !== 100 ? `Weights total ${totalWeight}% — must be 100%` : (!form.company || !form.jobTitle || !form.jd) ? "Fill all required fields" : null,
  };

  // Always scroll to top when changing steps
  const goToStep = (n) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setStep(n);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: rgba(184,149,90,0.2) transparent; }
        body {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80vw 56vh at 100% -8%, rgba(184,149,90,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 60vw 46vh at -8% 100%, rgba(95,158,255,0.06) 0%, transparent 52%),
            #080d1c;
          color: #f5f0eb; font-family: 'Sora', sans-serif;
        }
        input::placeholder, textarea::placeholder { color: rgba(245,240,235,0.28); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        input[type="range"] { accent-color: #f0c97a; cursor: pointer; }
        select option { background: #0d1528; color: #f5f0eb; }
        @media (max-width: 720px) {
          .iv-grid-2 { grid-template-columns: 1fr !important; }
          .iv-req-row { grid-template-columns: 1fr 80px 32px !important; }
          .iv-intake-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", padding: "clamp(16px,3vw,32px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Top Nav ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => step > 1 ? goToStep(step - 1) : navigate("/dashboard")}
              style={{
                height: 38, padding: "0 14px", borderRadius: 10,
                border: `1px solid ${C.line}`, background: "rgba(184,149,90,0.06)",
                color: C.inkMuted, fontSize: 12.5, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
                fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.lineStrong; e.currentTarget.style.color = C.inkSoft; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkMuted; }}
            >
              <ArrowLeft size={14} /> {step > 1 ? "Back" : "Dashboard"}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.inkFaint, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <span style={{ color: C.blue }}>Dashboard</span> / Create Interview
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                padding: "4px 12px", borderRadius: 999,
                background: C.blueDim, border: `1px solid ${C.blueBorder}`,
                fontSize: 10.5, fontWeight: 700, color: C.blue,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>General</div>
              <div style={{ fontSize: 12, fontFamily: "monospace", color: C.inkFaint }}>first_interview</div>
            </div>
          </div>

          {/* ── Page title ── */}
          <div style={{ textAlign: "center", padding: "0 0 4px" }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif", fontStyle: "italic",
              fontSize: "clamp(1.8rem,4vw,2.8rem)", color: C.inkWhite,
              margin: "0 0 8px", lineHeight: 1,
            }}>
              Create New Interview
            </h1>
            <p style={{ fontSize: 13.5, color: C.inkMuted, margin: 0 }}>
              Fill your job campaign details and generate CV submission and interview links.
            </p>
          </div>

          {/* ── Step Progress ── */}
          <div style={{
            background: C.bgPanel, border: `1px solid ${C.line}`,
            borderRadius: 18, padding: "18px 12px",
            backdropFilter: "blur(12px)",
          }}>
            <StepProgress current={step} />
          </div>

          {/* ══════════════════════════════════════════════════════════
              STEP 1 — Company & Role
          ══════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* What happens next */}
              <div style={{
                background: C.bgPanel, border: `1px solid ${C.line}`,
                borderRadius: 18, padding: "16px 20px",
                backdropFilter: "blur(12px)",
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: C.goldDim, border: `1px solid ${C.goldBorder}`,
                    display: "grid", placeItems: "center",
                  }}>
                    <Sparkles size={16} color={C.goldBright} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.inkWhite, marginBottom: 6 }}>What happens next</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {[
                        "Shareable links will be generated for all enabled services.",
                        "Copy and send these links directly to candidates.",
                        "Links automatically stop working after the set end date.",
                      ].map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: C.goldBright, fontSize: 13, lineHeight: 1.5, flexShrink: 0 }}>→</span>
                          <span style={{ fontSize: 13, color: C.inkMuted, lineHeight: 1.5 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company & Role card */}
              <SectionCard icon={FileText} iconColor={C.goldBright} title="Company & Role" subtitle="Basic information about the position being hired for.">
                <div className="iv-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <FieldLabel required>Company Name</FieldLabel>
                    <Input value={form.company} onChange={e => setF("company", e.target.value)} placeholder="e.g. Acme Corp" />
                  </div>
                  <div>
                    <FieldLabel required>Job Position</FieldLabel>
                    <Input value={form.jobTitle} onChange={e => setF("jobTitle", e.target.value)} placeholder="e.g. Sales Executive" />
                  </div>
                  <div>
                    <FieldLabel optional>Department</FieldLabel>
                    <Input value={form.department} onChange={e => setF("department", e.target.value)} placeholder="e.g. Sales" />
                  </div>
                  <div>
                    <FieldLabel hint="Standard: 45-day retention · Premium: 90-day retention">Campaign Plan</FieldLabel>
                    <Select value={form.plan} onChange={e => setF("plan", e.target.value)}>
                      <option>Standard</option>
                      <option>Premium</option>
                      <option>Enterprise</option>
                    </Select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                      <FieldLabel required>Role Description (Job Description)</FieldLabel>
                      <GhostBtn icon={Wand2} onClick={improveJD} small>Improve with AI</GhostBtn>
                    </div>
                    <Textarea
                      value={form.jd}
                      onChange={e => setF("jd", e.target.value)}
                      placeholder="Describe the role, responsibilities, and what success looks like…"
                      rows={5}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* JD Requirements */}
              <SectionCard
                icon={BarChart3} iconColor={C.blue}
                title="JD Requirements & Weights"
                subtitle="Define scoring criteria — weights drive both CV and interview scoring."
                rightSlot={<WeightBadge total={totalWeight} />}
              >
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  <GhostBtn icon={Wand2} onClick={suggestFromJD} primary>Suggest from JD</GhostBtn>
                  <GhostBtn icon={RefreshCw} onClick={normalizeWeights}>Normalize to 100%</GhostBtn>
                  <GhostBtn icon={Plus} onClick={addReq}>Add requirement</GhostBtn>
                </div>

                {/* Requirements table */}
                <div style={{ background: "rgba(6,10,20,0.4)", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
                  {/* Header */}
                  <div className="iv-req-row" style={{
                    display: "grid", gridTemplateColumns: "1fr 110px 36px",
                    padding: "10px 14px", borderBottom: `1px solid ${C.line}`,
                    background: "rgba(255,255,255,0.02)",
                  }}>
                    {["Requirement", "Weight %", ""].map(h => (
                      <div key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint }}>{h}</div>
                    ))}
                  </div>

                  {requirements.map((r, i) => (
                    <div key={r.id} className="iv-req-row" style={{
                      display: "grid", gridTemplateColumns: "1fr 110px 36px",
                      padding: "10px 14px", gap: 10, alignItems: "center",
                      borderBottom: i < requirements.length - 1 ? `1px solid ${C.line}` : "none",
                    }}>
                      <Input
                        value={r.requirement}
                        onChange={e => updateReq(r.id, "requirement", e.target.value)}
                        placeholder="e.g. Strong communication skills"
                      />
                      <div style={{ position: "relative" }}>
                        <Input
                          type="number" min="0" max="100" value={r.weight}
                          onChange={e => updateReq(r.id, "weight", Number(e.target.value))}
                          style={{ paddingRight: 28 }}
                        />
                        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: C.inkFaint, fontSize: 12, pointerEvents: "none" }}>%</span>
                      </div>
                      <button onClick={() => removeReq(r.id)} style={{
                        width: 32, height: 32, borderRadius: 8,
                        border: `1px solid ${C.line}`, background: "transparent",
                        color: C.inkFaint, cursor: "pointer", display: "grid", placeItems: "center",
                        transition: "all 0.18s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.redDim; e.currentTarget.style.borderColor = C.redBorder; e.currentTarget.style.color = C.red; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkFaint; }}
                      ><Trash2 size={13} /></button>
                    </div>
                  ))}

                  {requirements.length === 0 && (
                    <div style={{ padding: "24px", textAlign: "center", color: C.inkFaint, fontSize: 13.5 }}>
                      No requirements yet. Click "Suggest from JD" or add manually.
                    </div>
                  )}
                </div>

                {totalWeight !== 100 && requirements.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <InfoBox color={C.yellow} dimColor={C.yellowDim} borderColor="rgba(227,196,102,0.3)">
                      Weights currently total <strong style={{ color: C.yellow }}>{totalWeight}%</strong>.
                      Click <em>Normalize to 100%</em> to auto-distribute evenly, or adjust manually.
                    </InfoBox>
                  </div>
                )}
              </SectionCard>

              {/* Step 1 nav */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                {stepErrors[1] && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.red }}>
                    <AlertCircle size={13} /> {stepErrors[1]}
                  </div>
                )}
                <button
                  onClick={() => canProceed[1] && goToStep(2)}
                  disabled={!canProceed[1]}
                  style={{
                    height: 44, padding: "0 28px", borderRadius: 12, border: "none",
                    background: canProceed[1] ? `linear-gradient(135deg,${C.gold},${C.goldBright})` : "rgba(255,255,255,0.06)",
                    color: canProceed[1] ? "#1a1006" : C.inkFaint,
                    fontSize: 14, fontWeight: 700, cursor: canProceed[1] ? "pointer" : "not-allowed",
                    fontFamily: "'Sora', sans-serif", transition: "all 0.2s",
                    boxShadow: canProceed[1] ? `0 4px 20px rgba(184,149,90,0.3)` : "none",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                  onMouseEnter={e => { if (canProceed[1]) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 28px rgba(184,149,90,0.4)`; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = canProceed[1] ? `0 4px 20px rgba(184,149,90,0.3)` : "none"; }}
                >
                  Continue to CV Setup <ChevronDown size={15} style={{ transform: "rotate(-90deg)" }} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 2 — CV Submission
          ══════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <SectionCard
                icon={Upload} iconColor={C.green}
                title="CV Submission"
                subtitle="Configure how candidates submit their CVs and what intake questions to ask."
                rightSlot={<Toggle checked={enableCV} onChange={() => setEnableCV(v => !v)} />}
              >
                <div style={{ opacity: enableCV ? 1 : 0.42, transition: "opacity 0.25s", pointerEvents: enableCV ? "auto" : "none" }}>

                  <div className="iv-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                    <div>
                      <FieldLabel optional hint="Limits how many CVs can be submitted through the intake link.">Max CVs Allowed</FieldLabel>
                      <Input
                        type="number" min="1" value={form.maxCVs}
                        onChange={e => setF("maxCVs", e.target.value)}
                        placeholder="Leave empty for unlimited (e.g. 100)"
                      />
                    </div>
                  </div>

                  {/* Require Sample */}
                  <div style={{
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                    gap: 14, padding: "14px 16px", marginBottom: 20,
                    background: "rgba(6,10,20,0.45)", border: `1px solid ${C.line}`,
                    borderRadius: 12,
                  }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.inkWhite, marginBottom: 4 }}>Require Sample</div>
                      <div style={{ fontSize: 12.5, color: C.inkFaint, lineHeight: 1.55 }}>If enabled, candidates must upload a portfolio/sample file with their CV.</div>
                    </div>
                    <div
                      onClick={() => setF("requireSample", !form.requireSample)}
                      style={{
                        width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 2,
                        border: `1.5px solid ${form.requireSample ? C.goldBright : C.line}`,
                        background: form.requireSample ? `linear-gradient(135deg,${C.gold},${C.goldBright})` : "transparent",
                        display: "grid", placeItems: "center", cursor: "pointer",
                        transition: "all 0.18s",
                      }}
                    >
                      {form.requireSample && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#1a1006" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* CV End Date */}
                  <div style={{ marginBottom: 20 }}>
                    <FieldLabel hint="After this date, the CV submission link will stop accepting new submissions.">CV Submission End Date</FieldLabel>
                    <div style={{ position: "relative", maxWidth: 320 }}>
                      <Input
                        type="date" value={form.cvEndDate}
                        onChange={e => setF("cvEndDate", e.target.value)}
                        style={{ paddingRight: 38 }}
                      />
                      <Calendar size={15} color={C.inkFaint} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.inkWhite, marginBottom: 3 }}>CV Intake Requirements</div>
                        <div style={{ fontSize: 12, color: C.inkFaint }}>Optional fields shown to candidates during CV submission.</div>
                      </div>
                      <GhostBtn icon={Plus} onClick={addIntake} primary>Add requirement</GhostBtn>
                    </div>

                    {/* Intake table */}
                    <div style={{ background: "rgba(6,10,20,0.4)", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
                      <div className="iv-intake-row" style={{
                        display: "grid", gridTemplateColumns: "1.3fr 1.3fr 100px 100px 36px",
                        padding: "10px 14px", borderBottom: `1px solid ${C.line}`,
                        background: "rgba(255,255,255,0.02)",
                      }}>
                        {["Question", "Ideal Answer", "Type", "Scoring", ""].map(h => (
                          <div key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.inkFaint }}>{h}</div>
                        ))}
                      </div>

                      {intakeItems.map((item, i) => (
                        <div key={item.id} className="iv-intake-row" style={{
                          display: "grid", gridTemplateColumns: "1.3fr 1.3fr 100px 100px 36px",
                          padding: "10px 14px", gap: 10, alignItems: "center",
                          borderBottom: i < intakeItems.length - 1 ? `1px solid ${C.line}` : "none",
                        }}>
                          <Input value={item.description} onChange={e => updateIntake(item.id, "description", e.target.value)} placeholder="e.g. Work permit" />
                          <Input value={item.idealAnswer} onChange={e => updateIntake(item.id, "idealAnswer", e.target.value)} placeholder="e.g. Yes, valid" />
                          <Select value={item.type} onChange={e => updateIntake(item.id, "type", e.target.value)}>
                            <option>Text</option>
                            <option>Single Select</option>
                          </Select>
                          <Select
                            value={item.scoring}
                            onChange={e => updateIntake(item.id, "scoring", e.target.value)}
                            style={{ borderColor: item.scoring === "Must" ? C.redBorder : C.line, color: item.scoring === "Must" ? C.red : C.inkSoft }}
                          >
                            <option>Preferred</option>
                            <option>Must</option>
                          </Select>
                          <button onClick={() => removeIntake(item.id)} style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: `1px solid ${C.line}`, background: "transparent",
                            color: C.inkFaint, cursor: "pointer", display: "grid", placeItems: "center",
                            transition: "all 0.18s",
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = C.redDim; e.currentTarget.style.borderColor = C.redBorder; e.currentTarget.style.color = C.red; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkFaint; }}
                          ><Trash2 size={13} /></button>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <InfoBox>
                        <strong style={{ color: C.inkSoft }}>Must</strong> = candidate is marked unsuitable if answered No.{" "}
                        <strong style={{ color: C.inkSoft }}>Preferred</strong> = −10 score per incorrect answer. Text answers require a free-text response.
                      </InfoBox>
                    </div>
                  </div>
                </div>

                {!enableCV && (
                  <div style={{ marginTop: 4 }}>
                    <InfoBox color={C.yellow} dimColor={C.yellowDim} borderColor="rgba(227,196,102,0.3)">
                      CV submission is disabled. Candidates will go directly to the interview.
                    </InfoBox>
                  </div>
                )}
              </SectionCard>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <GhostBtn icon={ArrowLeft} onClick={() => goToStep(1)}>Back</GhostBtn>
                <button onClick={() => goToStep(3)} style={{
                  height: 44, padding: "0 28px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
                  color: "#1a1006", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Sora', sans-serif", boxShadow: `0 4px 20px rgba(184,149,90,0.3)`,
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 28px rgba(184,149,90,0.4)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px rgba(184,149,90,0.3)`; }}
                >
                  Continue to Interview Setup <ChevronDown size={15} style={{ transform: "rotate(-90deg)" }} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 3 — Interview Setup
          ══════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <SectionCard
                icon={Video} iconColor={C.blue}
                title="Interview Configuration"
                subtitle="Set difficulty, language, questions, and access control."
                rightSlot={<Toggle checked={enableInterview} onChange={() => setEnableInterview(v => !v)} />}
              >
                <div style={{ opacity: enableInterview ? 1 : 0.42, transition: "opacity 0.25s", pointerEvents: enableInterview ? "auto" : "none" }}>

                  {/* Core settings */}
                  <div className="iv-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                    <div>
                      <FieldLabel>Interview Level</FieldLabel>
                      <Select value={form.interviewLevel} onChange={e => setF("interviewLevel", e.target.value)}>
                        <option>Junior Level</option>
                        <option>Mid Level</option>
                        <option>Senior Level</option>
                      </Select>
                    </div>
                    <div>
                      <FieldLabel hint="Number of questions the AI will ask each candidate.">Number of Questions</FieldLabel>
                      <Input
                        type="number" min="1" max="30" value={form.questionCount}
                        onChange={e => setF("questionCount", e.target.value)}
                      />
                    </div>
                    <div>
                      <FieldLabel hint="After this date, the interview link will stop accepting new entries.">Interview End Date</FieldLabel>
                      <div style={{ position: "relative" }}>
                        <Input
                          type="date" value={form.interviewEndDate}
                          onChange={e => setF("interviewEndDate", e.target.value)}
                          style={{ paddingRight: 38 }}
                        />
                        <Calendar size={15} color={C.inkFaint} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Interview Language</FieldLabel>
                      <Select value={form.language} onChange={e => setF("language", e.target.value)}>
                        <option>English</option>
                        <option>Arabic</option>
                        <option>Bilingual (English + Arabic)</option>
                      </Select>
                    </div>
                  </div>

                  {/* Recording info */}
                  <div style={{ marginBottom: 20 }}>
                    <InfoBox color={C.blue} dimColor={C.blueDim} borderColor={C.blueBorder}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Video size={13} color={C.blue} />
                        <strong style={{ color: C.inkSoft }}>Video interview (camera + voice)</strong>
                      </div>
                      <div style={{ marginTop: 3 }}>Recording is required for all interviews. Videos are stored per your campaign plan retention rules.</div>
                    </InfoBox>
                  </div>

                  {/* Specific info tags */}
                  <div style={{ marginBottom: 20 }}>
                    <FieldLabel optional hint="Topics the AI will probe the candidate on during the interview.">
                      Specific Information Needed
                    </FieldLabel>
                    <div style={{
                      borderRadius: 10, border: `1px solid ${C.line}`, background: C.bgInput,
                      minHeight: 44, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
                      padding: "7px 8px",
                    }}>
                      {specificTags.map(tag => (
                        <span key={tag} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          background: C.blueDim, border: `1px solid ${C.blueBorder}`,
                          color: "#cfe2ff", borderRadius: 999, padding: "4px 10px",
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {tag}
                          <button onClick={() => removeTag(tag)} style={{
                            border: "none", background: "none", color: "inherit",
                            cursor: "pointer", padding: 0, fontSize: 12, lineHeight: 1,
                            display: "flex", alignItems: "center",
                          }}><X size={11} /></button>
                        </span>
                      ))}
                      <input
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                        onBlur={addTag}
                        placeholder='Type and press Enter (e.g. "Years of experience")'
                        style={{
                          flex: 1, minWidth: 200, border: "none", outline: "none",
                          background: "transparent", color: C.inkSoft, fontSize: 13,
                          fontFamily: "'Sora', sans-serif",
                        }}
                      />
                    </div>
                  </div>

                  {/* Mandatory questions */}
                  <div style={{ marginBottom: 20 }}>
                    <FieldLabel optional hint="These exact questions will be asked to every candidate, in order.">
                      Mandatory Interview Questions
                    </FieldLabel>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Input
                        value={mandatoryQ}
                        onChange={e => setMandatoryQ(e.target.value)}
                        placeholder='e.g. "Tell me about your last role"'
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addMandatoryQ(); } }}
                        style={{ flex: 1 }}
                      />
                      <GhostBtn icon={Plus} onClick={addMandatoryQ} primary>Add</GhostBtn>
                    </div>
                    {mandatoryQList.length > 0 && (
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                        {mandatoryQList.map((q, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 12px", background: "rgba(6,10,20,0.5)",
                            border: `1px solid ${C.line}`, borderRadius: 9,
                          }}>
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: C.inkFaint, minWidth: 18 }}>{i + 1}.</span>
                            <span style={{ flex: 1, fontSize: 13, color: C.inkSoft }}>{q}</span>
                            <button onClick={() => setMandatoryQList(p => p.filter((_, j) => j !== i))} style={{
                              border: "none", background: "none", color: C.inkFaint, cursor: "pointer",
                              display: "flex", alignItems: "center", padding: 2,
                              transition: "color 0.15s",
                            }}
                              onMouseEnter={e => e.currentTarget.style.color = C.red}
                              onMouseLeave={e => e.currentTarget.style.color = C.inkFaint}
                            ><X size={13} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Access Control */}
                  <div style={{
                    background: "rgba(6,10,20,0.5)", border: `1px solid ${C.line}`,
                    borderRadius: 14, overflow: "hidden",
                  }}>
                    <div style={{
                      padding: "14px 16px", borderBottom: `1px solid ${C.line}`,
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <Settings2 size={15} color={C.goldBright} />
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.inkWhite }}>Access Control</div>
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 12, padding: "12px 14px",
                        background: allowEveryone ? "rgba(57,201,143,0.04)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${allowEveryone ? C.greenBorder : C.line}`,
                        borderRadius: 12, transition: "all 0.2s",
                      }}>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.inkWhite, marginBottom: 3 }}>Allow everyone</div>
                          <div style={{ fontSize: 12.5, color: C.inkFaint }}>
                            Any candidate can enter using the interview code — no email restriction required.
                          </div>
                        </div>
                        <Toggle checked={allowEveryone} onChange={() => setAllowEveryone(v => !v)} />
                      </div>

                      {/* Invite by email */}
                      <div style={{
                        marginTop: 12, padding: "14px 16px",
                        background: "rgba(6,10,20,0.4)", border: `1px solid ${C.line}`,
                        borderRadius: 12, opacity: allowEveryone ? 0.45 : 1,
                        transition: "opacity 0.25s",
                        pointerEvents: allowEveryone ? "none" : "auto",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.inkWhite, marginBottom: 3 }}>Import Invited Emails</div>
                            <div style={{ fontSize: 12, color: C.inkFaint }}>Upload an Excel file with candidate name, email, and phone columns.</div>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <GhostBtn disabled small>Download Template</GhostBtn>
                            <GhostBtn disabled small>Download Current</GhostBtn>
                          </div>
                        </div>

                        {/* Upload area */}
                        <div style={{
                          border: `1.5px dashed ${C.line}`, borderRadius: 10,
                          padding: "20px", textAlign: "center", cursor: "pointer",
                          transition: "all 0.18s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.background = "rgba(184,149,90,0.04)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = "transparent"; }}
                        >
                          <Upload size={22} color={C.inkFaint} style={{ marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                          <div style={{ fontSize: 13, color: C.inkMuted, marginBottom: 4 }}>Drop your Excel file here, or click to browse</div>
                          <div style={{ fontSize: 11.5, color: C.inkFaint }}>Supported: .xlsx, .xls</div>
                        </div>

                        {/* Candidate list placeholder */}
                        <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 2 }}>Invited candidates</div>
                            <div style={{ fontSize: 12, color: C.inkFaint }}>No candidates loaded yet.</div>
                          </div>
                          <GhostBtn disabled small icon={Plus}>Add row</GhostBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!enableInterview && (
                  <div style={{ marginTop: 12 }}>
                    <InfoBox color={C.yellow} dimColor={C.yellowDim} borderColor="rgba(227,196,102,0.3)">
                      Interview is disabled. Only CV submission will be active for this campaign.
                    </InfoBox>
                  </div>
                )}
              </SectionCard>

              {/* Tip */}
              {enableInterview && !allowEveryone && (
                <InfoBox color={C.yellow} dimColor={C.yellowDim} borderColor="rgba(227,196,102,0.3)">
                  <strong style={{ color: C.yellow }}>Tip:</strong> Since "Allow everyone" is disabled, make sure invited emails are loaded from the intake form or Excel upload before sharing the interview link.
                </InfoBox>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <GhostBtn icon={ArrowLeft} onClick={() => goToStep(2)}>Back</GhostBtn>
                <button onClick={() => goToStep(4)} style={{
                  height: 44, padding: "0 28px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
                  color: "#1a1006", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Sora', sans-serif", boxShadow: `0 4px 20px rgba(184,149,90,0.3)`,
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Review & Launch <ChevronDown size={15} style={{ transform: "rotate(-90deg)" }} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 4 — Review & Launch
          ══════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Summary */}
              <div style={{
                background: C.bgPanel, border: `1px solid ${C.line}`,
                borderRadius: 22, padding: "20px 22px", backdropFilter: "blur(12px)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 14 }}>Campaign Summary</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
                  {[
                    { label: "Job Title", value: form.jobTitle, icon: FileText },
                    { label: "Company", value: form.company, icon: Users },
                    { label: "Plan", value: form.plan, icon: Settings2 },
                    { label: "Language", value: form.language, icon: Globe },
                    { label: "Questions", value: form.questionCount, icon: BarChart3 },
                    { label: "Level", value: form.interviewLevel, icon: BarChart3 },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} style={{
                      background: "rgba(6,10,20,0.5)", border: `1px solid ${C.line}`,
                      borderRadius: 12, padding: "12px 14px",
                    }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 5 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.inkSoft }}>{value || "—"}</div>
                    </div>
                  ))}
                </div>

                {/* Stages enabled */}
                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  {[
                    { label: "CV Submission", enabled: enableCV, color: C.green },
                    { label: "AI Interview", enabled: enableInterview, color: C.blue },
                  ].map(({ label, enabled, color }) => (
                    <span key={label} style={{
                      display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
                      borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: enabled ? `${color}18` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${enabled ? `${color}35` : C.line}`,
                      color: enabled ? color : C.inkFaint,
                    }}>
                      {enabled ? <Check size={12} /> : <X size={12} />} {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generate links CTA */}
              {!showLinks ? (
                <button
                  onClick={() => setShowLinks(true)}
                  style={{
                    width: "100%", height: 56, borderRadius: 14, border: "none",
                    background: `linear-gradient(135deg,${C.blue},#4f87ff)`,
                    color: "#fff", fontSize: 18,
                    fontFamily: "'DM Serif Display', serif",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    boxShadow: "0 6px 24px rgba(95,158,255,0.3)", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(95,158,255,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(95,158,255,0.3)"; }}
                >
                  <Link2 size={20} /> Generate Campaign Links
                </button>
              ) : (
                <div style={{
                  background: C.bgPanel, border: `1px solid ${C.greenBorder}`,
                  borderRadius: 22, padding: "22px", backdropFilter: "blur(12px)",
                  boxShadow: `0 8px 32px rgba(57,201,143,0.1)`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: C.greenDim, border: `1px solid ${C.greenBorder}`,
                      display: "grid", placeItems: "center",
                    }}>
                      <Check size={18} color={C.green} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.inkWhite }}>Campaign is live!</div>
                      <div style={{ fontSize: 12.5, color: C.inkFaint }}>Share the links below with candidates.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { key: "cv", label: "CV Submission Link", url: generatedLinks.cv, hint: "Share with candidates to submit their CV.", codeLabel: "Intake Code", code: generatedLinks.cvCode },
                      { key: "interview", label: "Avatar Interview Link", url: generatedLinks.interview, hint: "Send to shortlisted candidates after CV screening.", codeLabel: "Interview Code", code: generatedLinks.intCode },
                    ].map(({ key, label, url, hint, codeLabel, code }) => (
                      <div key={key} style={{
                        background: C.bgInput, border: `1px solid ${C.line}`,
                        borderRadius: 14, padding: "14px 16px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <Link2 size={13} color={C.goldBright} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft }}>{label}</span>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => doCopy(url, key)}
                              style={{
                                height: 28, padding: "0 12px", borderRadius: 8,
                                border: `1px solid ${copied === key ? C.greenBorder : C.line}`,
                                background: copied === key ? C.greenDim : "transparent",
                                color: copied === key ? C.green : C.inkMuted,
                                fontSize: 12, fontWeight: 600, cursor: "pointer",
                                display: "flex", alignItems: "center", gap: 5,
                                fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
                              }}
                            >
                              <Copy size={11} /> {copied === key ? "Copied!" : "Copy Link"}
                            </button>
                            <button style={{
                              height: 28, width: 28, borderRadius: 8,
                              border: `1px solid ${C.line}`, background: "transparent",
                              color: C.inkMuted, cursor: "pointer", display: "grid", placeItems: "center",
                              transition: "all 0.18s",
                            }}
                              onMouseEnter={e => { e.currentTarget.style.color = C.inkSoft; e.currentTarget.style.borderColor = C.goldBorder; }}
                              onMouseLeave={e => { e.currentTarget.style.color = C.inkMuted; e.currentTarget.style.borderColor = C.line; }}
                            ><ExternalLink size={11} /></button>
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: C.blue, fontFamily: "monospace", wordBreak: "break-all", marginBottom: 6, lineHeight: 1.5 }}>{url}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                          <div style={{ fontSize: 11.5, color: C.inkFaint }}>{hint}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11.5, color: C.inkFaint }}>{codeLabel}:</span>
                            <span style={{ fontSize: 12, fontFamily: "monospace", color: C.inkMuted }}>{code}</span>
                            <button onClick={() => doCopy(code, `code-${key}`)} style={{
                              height: 20, padding: "0 8px", borderRadius: 5,
                              border: `1px solid ${C.line}`, background: "transparent",
                              color: copied === `code-${key}` ? C.green : C.inkFaint,
                              fontSize: 10, fontWeight: 600, cursor: "pointer",
                              fontFamily: "'Sora', sans-serif", transition: "all 0.15s",
                            }}>{copied === `code-${key}` ? "✓" : "Copy"}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <GhostBtn icon={ArrowLeft} onClick={() => goToStep(3)}>Back</GhostBtn>
                {showLinks && (
                  <GhostBtn icon={Check} primary onClick={() => navigate("/dashboard")}>Go to Dashboard</GhostBtn>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}