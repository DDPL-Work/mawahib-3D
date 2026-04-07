import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus, Search, Settings, LogOut, Clock, Copy, ExternalLink,
  BarChart2, Users, CheckCircle2, ArrowRight, MoreHorizontal,
  Sparkles, TrendingUp, FileText, MessageSquare, Brain, Gavel,
  Globe, Layers, X, Calendar, Link2, Eye,
  UserCheck, UserX, AlertCircle, Award, BarChart, PieChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CVResults from "./resume";
import InterviewResults from "./Inter";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bgDark: "#080d1c",
  bgPanel: "rgba(11,17,34,0.90)",
  bgCard: "rgba(8,12,24,0.85)",
  bgCardHover: "rgba(12,18,36,0.95)",
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
  green: "#39c98f",
  greenDim: "rgba(57,201,143,0.12)",
  greenBright: "rgba(57,201,143,0.9)",
  yellow: "#e3c466",
  yellowDim: "rgba(227,196,102,0.12)",
  red: "#ff6b6b",
  redDim: "rgba(255,107,107,0.12)",
};

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
  </>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const CAMPAIGN_TYPES = [
  { id: "first", icon: Users, label: "First Interview", tag: "General", desc: "CV-based screening for core qualifications." },
  { id: "second", icon: Search, label: "Second Interview", tag: "Stage 2", desc: "Strict follow-up based on Stage 1 results." },
  { id: "problem", icon: Layers, label: "Problem Solving", tag: "Assessment", desc: "Real workplace challenges under pressure." },
  { id: "judgment", icon: Gavel, label: "Situational Judgment", tag: "Assessment", desc: "Measure professional ethics and reasoning." },
  { id: "cognitive", icon: Brain, label: "Cognitive Ability", tag: "Assessment", desc: "Pattern recognition & learning agility." },
  { id: "english", icon: Globe, label: "English Communication", tag: "Language", desc: "Fluency, grammar, and expression clarity." },
];

const TAG_COLORS = {
  "General": { bg: C.blueDim, border: "rgba(95,158,255,0.3)", text: C.blue },
  "Stage 2": { bg: C.goldDim, border: C.goldBorder, text: C.goldBright },
  "Assessment": { bg: C.greenDim, border: "rgba(57,201,143,0.3)", text: C.green },
  "Language": { bg: C.yellowDim, border: "rgba(227,196,102,0.3)", text: C.yellow },
};

const CAMPAIGNS = [{
  id: "demo", code: "DEMO-073298",
  title: "B2B Sales Representative", company: "Demo Company",
  created: "Mar 30, 2026", status: "active",
  applicants: 108, interviewed: 28, shortlisted: 12,
  intakeCode: "DEMOT-F9908C",
  cvEnd: "No end date", interviewEnd: "No end date",
  accessType: "Open access", language: "EN",
}];

const FUNNEL = [
  { label: "Invited", value: 108, pct: 100, color: C.blue },
  { label: "CV Submitted", value: 62, pct: 57, color: C.goldBright },
  { label: "Interviewed", value: 28, pct: 26, color: C.yellow },
  { label: "Shortlisted", value: 12, pct: 11, color: C.green },
  { label: "Hired", value: 5, pct: 5, color: "#28a66f" },
];

// Mock CV results data
const CV_RESULTS = [
  { name: "Sarah Al-Farsi", score: 84, status: "suitable", gender: "F", exp: "5 yrs", match: "High" },
  { name: "Omar Khalid", score: 77, status: "suitable", gender: "M", exp: "3 yrs", match: "High" },
  { name: "Lina Mansoor", score: 71, status: "suitable", gender: "F", exp: "4 yrs", match: "Med" },
  { name: "Tariq Hassan", score: 68, status: "suitable", gender: "M", exp: "6 yrs", match: "Med" },
  { name: "Noor Al-Rashid", score: 62, status: "suitable", gender: "F", exp: "2 yrs", match: "Med" },
  { name: "Khalid Ibrahim", score: 44, status: "unsuitable", gender: "M", exp: "1 yr", match: "Low" },
  { name: "Fatima Zahra", score: 38, status: "unsuitable", gender: "F", exp: "0 yrs", match: "Low" },
  { name: "Yousef Al-Mutairi", score: 31, status: "unsuitable", gender: "M", exp: "2 yrs", match: "Low" },
];

const CV_STATS = {
  total: 108, suitable: 62, unsuitable: 46, threshold: 50,
  male: 58, female: 50,
  scoreRanges: [
    { range: "80–100", count: 12, color: C.green },
    { range: "60–79", count: 28, color: C.goldBright },
    { range: "40–59", count: 22, color: C.yellow },
    { range: "0–39", count: 46, color: C.red },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Tag = ({ label }) => {
  const s = TAG_COLORS[label] || TAG_COLORS["General"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      borderRadius: 999, padding: "3px 9px",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
    }}>{label}</span>
  );
};

const StatusDot = ({ status }) => {
  const color = status === "active" ? C.green : C.yellow;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.inkSoft, fontWeight: 500 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
      {status === "active" ? "Active" : "Paused"}
    </span>
  );
};

const Divider = () => (
  <div style={{ width: "100%", height: 1, background: C.line, flexShrink: 0 }} />
);

const AxisBarChart = ({ data }) => {
  const svgWidth = 720;
  const svgHeight = 280;
  const margin = { top: 14, right: 20, bottom: 64, left: 58 };
  const plotWidth = svgWidth - margin.left - margin.right;
  const plotHeight = svgHeight - margin.top - margin.bottom;

  const rawMax = Math.max(...data.map((d) => d.value), 1);
  const roundedMax = Math.ceil(rawMax / 10) * 10;
  const yMax = roundedMax === 0 ? 10 : roundedMax;
  const tickCount = 5;
  const slotWidth = plotWidth / data.length;
  const barWidth = Math.min(76, slotWidth * 0.56);

  const yForValue = (value) => margin.top + plotHeight - (value / yMax) * plotHeight;

  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: "rgba(6,10,20,0.65)", padding: "12px 12px 8px" }}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} role="img" aria-label="Recruitment funnel chart" style={{ width: "100%", height: "auto", display: "block" }}>
        {[...Array(tickCount + 1)].map((_, i) => {
          const tickValue = (yMax / tickCount) * i;
          const y = yForValue(tickValue);
          return (
            <g key={`tick-${i}`}>
              <line x1={margin.left} x2={svgWidth - margin.right} y1={y} y2={y} stroke={i === 0 ? C.lineStrong : C.line} strokeWidth={1} />
              <text x={margin.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill={C.inkMuted}>
                {tickValue}
              </text>
            </g>
          );
        })}

        <line x1={margin.left} x2={margin.left} y1={margin.top} y2={margin.top + plotHeight} stroke={C.lineStrong} strokeWidth={1.2} />
        <line x1={margin.left} x2={svgWidth - margin.right} y1={margin.top + plotHeight} y2={margin.top + plotHeight} stroke={C.lineStrong} strokeWidth={1.2} />

        {data.map((point, index) => {
          const x = margin.left + slotWidth * index + (slotWidth - barWidth) / 2;
          const y = yForValue(point.value);
          const barHeight = margin.top + plotHeight - y;
          const xCenter = x + barWidth / 2;
          return (
            <g key={point.label}>
              <rect x={x} y={y} width={barWidth} height={Math.max(4, barHeight)} rx={6} fill={point.color} opacity={0.9} />
              <text x={xCenter} y={y - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill={C.inkSoft}>
                {point.value}
              </text>
              <text x={xCenter} y={margin.top + plotHeight + 18} textAnchor="middle" fontSize="10.5" fill={C.inkMuted}>
                {point.label}
              </text>
              <text x={xCenter} y={margin.top + plotHeight + 32} textAnchor="middle" fontSize="10" fill={C.inkFaint}>
                {point.pct}%
              </text>
            </g>
          );
        })}

        <text x={svgWidth / 2} y={svgHeight - 8} textAnchor="middle" fontSize="11.5" fill={C.inkFaint}>
          X-axis: Recruitment Stages
        </text>
        <text
          x={16}
          y={svgHeight / 2}
          transform={`rotate(-90 16 ${svgHeight / 2})`}
          textAnchor="middle"
          fontSize="11.5"
          fill={C.inkFaint}
        >
          Y-axis: Candidate Count
        </text>
      </svg>
    </div>
  );
};
const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.17em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 10 }}>
    {children}
  </div>
);

const CircularKpi = ({ label, value, color, description }) => {
  const size = 148;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.max(0, Math.min(100, value));
  const progress = circumference * (safeValue / 100);
  const dashOffset = circumference - progress;

  return (
    <div style={{
      background: "rgba(6,10,20,0.62)",
      border: `1px solid ${C.line}`,
      borderRadius: 16,
      padding: "16px 14px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      minHeight: 252,
    }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: 148, height: 148, overflow: "visible" }} role="img" aria-label={`${label} ${safeValue}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.line}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.45s ease" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={C.inkWhite}
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32 }}
        >
          {safeValue}%
        </text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkSoft, marginBottom: 5 }}>
          {label}
        </div>
        <div style={{ fontSize: 12.5, color: C.inkMuted, lineHeight: 1.55 }}>
          {description}
        </div>
      </div>
    </div>
  );
};

const DashboardCircularInsights = ({ campaign, onCreateCampaign }) => {
  const totalApplicants = Math.max(campaign.applicants || 0, 1);
  const interviewRate = Math.round(((campaign.interviewed || 0) / totalApplicants) * 100);
  const shortlistRate = Math.round(((campaign.shortlisted || 0) / totalApplicants) * 100);
  const shortlistFromInterviewRate = campaign.interviewed
    ? Math.round(((campaign.shortlisted || 0) / campaign.interviewed) * 100)
    : 0;

  return (
    <section style={{
      background: C.bgPanel,
      border: `1px solid ${C.line}`,
      borderRadius: 22,
      padding: "24px 24px 20px",
      backdropFilter: "blur(12px)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 7 }}>
            Performance Dashboard
          </div>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.45rem", fontWeight: 400, color: C.inkWhite, margin: "0 0 8px" }}>
            Hiring Funnel Circular Analytics
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: C.inkMuted, maxWidth: 760, lineHeight: 1.7 }}>
            This view highlights recruitment efficiency from intake to shortlist with executive-level clarity. The circular charts are designed for quick stakeholder reporting and alignment across HR, recruiters, and hiring managers.
          </p>
        </div>
        <button
          onClick={onCreateCampaign}
          style={{
            height: 40,
            padding: "0 16px",
            borderRadius: 11,
            border: `1px solid ${C.goldBorder}`,
            background: C.goldDim,
            color: C.goldBright,
            fontSize: 12.5,
            fontWeight: 700,
            fontFamily: "'Sora', sans-serif",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg,${C.gold},${C.goldBright})`;
            e.currentTarget.style.color = "#1a1006";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.goldDim;
            e.currentTarget.style.color = C.goldBright;
          }}
        >
          <Plus size={14} /> Create Campaign
        </button>
      </div>

      <div className="circular-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(210px, 1fr))", gap: 12 }}>
        <CircularKpi
          label="Interview Reach"
          value={interviewRate}
          color={C.blue}
          description="Share of total applicants who progressed into the interview stage."
        />
        <CircularKpi
          label="Shortlist Yield"
          value={shortlistRate}
          color={C.green}
          description="Total pipeline conversion from applicants into shortlist-ready candidates."
        />
        <CircularKpi
          label="Quality Pass Rate"
          value={shortlistFromInterviewRate}
          color={C.goldBright}
          description="Percent of interviewed candidates who met quality criteria for shortlist."
        />
      </div>

      <div className="insight-copy-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(180px, 1fr))", gap: 10 }}>
        {[
          {
            title: "Executive Summary",
            body: `${campaign.shortlisted} shortlisted from ${campaign.applicants} total applicants indicates a focused, quality-first screening flow.`,
          },
          {
            title: "Operational Insight",
            body: `${campaign.interviewed} candidates interviewed so far. Continue cadence to preserve decision velocity and avoid bottlenecks.`,
          },
          {
            title: "Strategic Recommendation",
            body: "Use this circular KPI block in weekly hiring reviews to track conversion health and drive evidence-based hiring decisions.",
          },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${C.line}`,
              borderRadius: 12,
              padding: "12px 13px",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.goldBright, marginBottom: 6 }}>
              {card.title}
            </div>
            <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.65 }}>
              {card.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.04em" }}>{label}</label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        height: 40, padding: "0 12px",
        background: C.bgInput, border: `1px solid ${C.line}`,
        borderRadius: 10, color: C.inkSoft, fontSize: 13, outline: "none",
        fontFamily: "'Sora', sans-serif", transition: "border-color 0.18s",
      }}
      onFocus={e => e.target.style.borderColor = C.goldBorder}
      onBlur={e => e.target.style.borderColor = C.line}
    />
  </div>
);

const SelectField = ({ label, value, onChange, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.04em" }}>{label}</label>
    <select
      value={value} onChange={onChange}
      style={{
        height: 40, padding: "0 12px",
        background: C.bgInput, border: `1px solid ${C.line}`,
        borderRadius: 10, color: C.inkSoft, fontSize: 13, outline: "none",
        fontFamily: "'Sora', sans-serif", cursor: "pointer", appearance: "none",
        transition: "border-color 0.18s",
      }}
      onFocus={e => e.target.style.borderColor = C.goldBorder}
      onBlur={e => e.target.style.borderColor = C.line}
    >
      {children}
    </select>
  </div>
);

const IconBtn = ({ children, onClick, title, active }) => (
  <button
    type="button"
    title={title}
    onClick={(e) => {
      e.preventDefault();
      onClick?.(e);
    }}
    style={{
      width: 32, height: 32, borderRadius: 8,
      border: `1px solid ${active ? C.goldBorder : C.line}`,
      background: active ? C.goldDim : "transparent",
      color: active ? C.goldBright : C.inkMuted,
      display: "grid", placeItems: "center", cursor: "pointer", transition: "all 0.18s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = C.goldDim; e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.color = C.inkSoft; }}
    onMouseLeave={e => {
      e.currentTarget.style.background = active ? C.goldDim : "transparent";
      e.currentTarget.style.borderColor = active ? C.goldBorder : C.line;
      e.currentTarget.style.color = active ? C.goldBright : C.inkMuted;
    }}
  >{children}</button>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => (
  <nav style={{
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "0 clamp(16px,2.5vw,32px)", height: 64,
    background: "rgba(8,13,26,0.88)", borderBottom: `1px solid ${C.line}`,
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontFamily: "'Sora', sans-serif",
  }}>
  </nav>
);

// ─── CV Results Panel ─────────────────────────────────────────────────────────
const CVResultsPanel = ({ campaign }) => {
  const [view, setView] = useState("overview"); // overview | candidates

  const maxBarCount = Math.max(...CV_STATS.scoreRanges.map(r => r.count));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, background: "rgba(6,10,20,0.7)", border: `1px solid ${C.line}`, borderRadius: 12, padding: 4 }}>
        {[
          { id: "overview", label: "Overview", icon: PieChart },
          { id: "candidates", label: "Candidates", icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setView(id)} style={{
            flex: 1, height: 32, borderRadius: 9,
            border: `1px solid ${view === id ? "rgba(240,201,122,0.55)" : "transparent"}`,
            background: view === id ? "linear-gradient(135deg,rgba(184,149,90,0.25),rgba(240,201,122,0.14))" : "transparent",
            color: view === id ? C.inkWhite : C.inkMuted,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
          }}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {view === "overview" ? (
        <>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Total CVs", value: CV_STATS.total, sub: "Uploaded", color: C.blue, border: "rgba(95,158,255,0.25)" },
              { label: "Suitable", value: CV_STATS.suitable, sub: `Score ≥ ${CV_STATS.threshold}`, color: C.green, border: "rgba(57,201,143,0.3)" },
              { label: "Unsuitable", value: CV_STATS.unsuitable, sub: "Below threshold", color: C.red, border: "rgba(255,107,107,0.25)" },
              { label: "Pass Rate", value: `${Math.round(CV_STATS.suitable / CV_STATS.total * 100)}%`, sub: "Of reviewed", color: C.goldBright, border: C.goldBorder },
            ].map(({ label, value, sub, color, border }) => (
              <div key={label} style={{
                background: "rgba(6,10,20,0.65)", border: `1px solid ${border}`,
                borderRadius: 14, padding: "14px 16px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11.5, color: C.inkMuted }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Gender breakdown */}
          <div style={{ background: "rgba(6,10,20,0.65)", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px" }}>
            <SectionLabel>Gender Breakdown</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: C.inkMuted }}>Male</span>
                  <span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600 }}>{CV_STATS.male}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: C.line, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.round(CV_STATS.male / CV_STATS.total * 100)}%`, borderRadius: 99, background: C.blue }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: C.inkMuted }}>Female</span>
                  <span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600 }}>{CV_STATS.female}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: C.line, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.round(CV_STATS.female / CV_STATS.total * 100)}%`, borderRadius: 99, background: "#e06fa5" }} />
                </div>
              </div>
            </div>
            {/* Visual split bar */}
            <div style={{ height: 8, borderRadius: 99, overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${Math.round(CV_STATS.male / CV_STATS.total * 100)}%`, background: C.blue }} />
              <div style={{ flex: 1, background: "#e06fa5" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: C.inkFaint }}>♂ {Math.round(CV_STATS.male / CV_STATS.total * 100)}% Male</span>
              <span style={{ fontSize: 11, color: C.inkFaint }}>{Math.round(CV_STATS.female / CV_STATS.total * 100)}% Female ♀</span>
            </div>
          </div>

          {/* Score distribution bar chart */}
          <div style={{ background: "rgba(6,10,20,0.65)", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px" }}>
            <SectionLabel>Score Distribution</SectionLabel>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {CV_STATS.scoreRanges.map(({ range, count, color }) => (
                <div key={range} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ fontSize: 11, color: C.inkMuted, fontWeight: 600 }}>{count}</div>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    height: `${Math.round(count / maxBarCount * 64)}px`,
                    background: color, opacity: 0.85,
                    transition: "height 0.4s ease",
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {CV_STATS.scoreRanges.map(({ range, color }) => (
                <div key={range} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: 10, color: C.inkFaint, textAlign: "center" }}>{range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Threshold info */}
          <div style={{
            background: "linear-gradient(135deg,rgba(184,149,90,0.08),rgba(184,149,90,0.03))",
            border: `1px solid ${C.goldBorder}`, borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <AlertCircle size={16} color={C.goldBright} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 12.5, color: C.inkMuted, lineHeight: 1.6 }}>
              <span style={{ color: C.inkSoft, fontWeight: 600 }}>Suitability threshold set to {CV_STATS.threshold}.</span>{" "}
              Candidates scoring above this are marked suitable and eligible for interview.
            </div>
          </div>
        </>
      ) : (
        /* Candidates list */
        <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "rgba(6,10,20,0.65)", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
          {/* List header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 52px 50px 50px",
            padding: "10px 14px", borderBottom: `1px solid ${C.line}`,
            background: "rgba(255,255,255,0.015)",
          }}>
            {["Candidate", "Score", "Match", "Status"].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint }}>{h}</div>
            ))}
          </div>

          {CV_RESULTS.map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 52px 50px 50px",
              padding: "11px 14px",
              borderBottom: i < CV_RESULTS.length - 1 ? `1px solid ${C.line}` : "none",
              background: r.status === "suitable" ? "rgba(57,201,143,0.03)" : "transparent",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.inkWhite }}>{r.name}</div>
                <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 1 }}>{r.gender === "M" ? "Male" : "Female"} · {r.exp}</div>
              </div>
              {/* Score pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 26, width: 44, borderRadius: 8,
                background: r.score >= 80 ? C.greenDim : r.score >= 60 ? C.goldDim : r.score >= 50 ? C.yellowDim : C.redDim,
                border: `1px solid ${r.score >= 80 ? "rgba(57,201,143,0.3)" : r.score >= 60 ? C.goldBorder : r.score >= 50 ? "rgba(227,196,102,0.3)" : "rgba(255,107,107,0.25)"}`,
                fontSize: 12, fontWeight: 700,
                color: r.score >= 80 ? C.green : r.score >= 60 ? C.goldBright : r.score >= 50 ? C.yellow : C.red,
              }}>{r.score}</div>
              {/* Match */}
              <div style={{ fontSize: 11.5, fontWeight: 600, color: r.match === "High" ? C.green : r.match === "Med" ? C.yellow : C.inkMuted }}>{r.match}</div>
              {/* Status icon */}
              <div>
                {r.status === "suitable"
                  ? <UserCheck size={14} color={C.green} />
                  : <UserX size={14} color={C.red} />}
              </div>
            </div>
          ))}

          <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.line}`, background: "rgba(255,255,255,0.01)" }}>
            <span style={{ fontSize: 11.5, color: C.inkFaint }}>Showing 8 of {CV_STATS.total} candidates · </span>
            <span style={{ fontSize: 11.5, color: C.goldBright, cursor: "pointer", fontWeight: 600 }}>View all →</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Interview Results Panel ──────────────────────────────────────────────────
const InterviewResultsPanel = ({ campaign }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    {/* Funnel */}
    <div>
      <SectionLabel>Recruitment Funnel (X/Y Axis)</SectionLabel>
      <AxisBarChart data={FUNNEL} />
    </div>

    <Divider />

    {/* Interview stage stats */}
    <div>
      <SectionLabel>Stage Breakdown</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Avg Score", value: "74", sub: "Interview score", color: C.goldBright },
          { label: "Completion Rate", value: "91%", sub: "Started → Finished", color: C.green },
          { label: "Top Scorers", value: "9", sub: "Score ≥ 80", color: C.blue },
          { label: "Red Flags", value: "4", sub: "Flagged for review", color: C.red },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{
            background: "rgba(6,10,20,0.65)", border: `1px solid ${C.line}`,
            borderRadius: 14, padding: "13px 14px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 5 }}>{label}</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color, lineHeight: 1, marginBottom: 3 }}>{value}</div>
            <div style={{ fontSize: 11.5, color: C.inkMuted }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Campaign Detail Panel ────────────────────────────────────────────────────
const CampaignDetail = ({ campaign, onClose }) => {
  const [resultView, setResultView] = useState("interview");
  const [copied, setCopied] = useState(null);
  const copyRef = useRef(null);

  const copy = (text, key) => {
    navigator.clipboard?.writeText(text).catch(() => { });
    setCopied(key);
    clearTimeout(copyRef.current);
    copyRef.current = setTimeout(() => setCopied(null), 1800);
  };

  const links = [
    { key: "cv", label: "CV Submission Link", url: `https://mawahib.ai/apply/${campaign.intakeCode}`, hint: "Share with candidates to submit their CV" },
    { key: "interview", label: "Avatar Interview Link", url: `https://mawahib.ai/interview?code=${campaign.code}`, hint: "Qualified candidates complete interview here" },
  ];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(copyRef.current);
    };
  }, [onClose]);

  const handleCvTabClick = () => setResultView("cv");

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 190,
        background: "rgba(4,7,16,0.8)", backdropFilter: "blur(7px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%", maxWidth: 980, maxHeight: "88vh",
        background: "rgba(10,15,28,0.98)", border: `1px solid ${C.lineStrong}`,
        borderRadius: 24, boxShadow: "0 32px 80px rgba(0,0,0,0.65)",
        backdropFilter: "blur(16px)", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Panel header */}
        <div style={{
          padding: "18px 20px 16px", borderBottom: `1px solid ${C.line}`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 6 }}>Campaign Details</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", fontWeight: 400, color: C.inkWhite, margin: "0 0 3px", lineHeight: 1.2 }}>{campaign.title}</h3>
            <p style={{ fontSize: 12.5, color: C.inkMuted, margin: "0 0 8px" }}>{campaign.company}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: C.inkMuted, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.line}`, borderRadius: 999, padding: "3px 9px" }}>
                <Award size={10} /> {campaign.accessType}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: C.inkMuted, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.line}`, borderRadius: 999, padding: "3px 9px" }}>
                <Globe size={10} /> {campaign.language}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: C.inkMuted, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.line}`, borderRadius: 999, padding: "3px 9px" }}>
                <Calendar size={10} /> No end date
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.line}`,
            background: "transparent", color: C.inkMuted, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0,
          }}
            onMouseEnter={e => { e.currentTarget.style.color = C.inkSoft; e.currentTarget.style.borderColor = C.lineStrong; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.inkMuted; e.currentTarget.style.borderColor = C.line; }}
          ><X size={14} /></button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 18, scrollbarWidth: "thin", scrollbarColor: `${C.goldBorder} transparent` }}>

          {/* Result view tabs */}
          <div style={{ display: "flex", gap: 4, background: "rgba(6,10,20,0.7)", border: `1px solid ${C.line}`, borderRadius: 12, padding: 4 }}>
            <button onClick={() => setResultView("interview")} style={{
              flex: 1, height: 34, borderRadius: 9,
              border: `1px solid ${resultView === "interview" ? "rgba(240,201,122,0.55)" : "transparent"}`,
              background: resultView === "interview" ? "linear-gradient(135deg,rgba(184,149,90,0.28),rgba(240,201,122,0.16))" : "transparent",
              color: resultView === "interview" ? C.inkWhite : C.inkMuted,
              fontSize: 12.5, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
            }}>
              <BarChart size={13} /> Analytics
            </button>
            <button onClick={handleCvTabClick} style={{
              flex: 1, height: 34, borderRadius: 9,
              border: `1px solid ${resultView === "cv" ? "rgba(240,201,122,0.55)" : C.line}`,
              background: resultView === "cv" ? "linear-gradient(135deg,rgba(184,149,90,0.28),rgba(240,201,122,0.16))" : "transparent",
              color: resultView === "cv" ? C.inkWhite : C.inkMuted,
              fontSize: 12.5, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.color = C.inkSoft; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkMuted; }}
            >
              <FileText size={13} /> CV Results
            </button>
          </div>

          {/* Results content */}
          {resultView === "interview" ? (
            <InterviewResultsPanel campaign={campaign} />
          ) : (
            <div style={{
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: 12,
              background: "rgba(6,10,20,0.55)",
            }}>
              <CVResults embedded />
            </div>
          )}

          <Divider />

          {/* CV & Interview Status cards */}
          <div>
            <SectionLabel>Campaign Status</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { title: "CV Submission", status: "Enabled", end: campaign.cvEnd, key: "cvSubmission" },
                { title: "Interview", status: "Enabled", end: campaign.interviewEnd, key: "interview" },
              ].map(({ title, status, end, key }) => (
                <div key={key} style={{
                  background: "rgba(6,10,20,0.65)", border: `1px solid ${C.line}`,
                  borderRadius: 13, padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft }}>{title}</span>
                    <button style={{
                      height: 24, padding: "0 10px", borderRadius: 7,
                      border: `1px solid ${C.line}`, background: "rgba(184,149,90,0.07)",
                      color: C.inkMuted, fontSize: 11, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Sora', sans-serif",
                    }}>Edit</button>
                  </div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: C.green, lineHeight: 1, marginBottom: 4 }}>{status}</div>
                  <div style={{ fontSize: 11.5, color: C.inkFaint }}>Ends: {end}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Extend actions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Edit end date", "Extend 7d", "Extend 30d"].map(label => (
              <button key={label} style={{
                height: 36, padding: "0 14px", borderRadius: 10,
                border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.03)",
                color: C.inkSoft, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.goldDim; e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkSoft; }}
              >{label}</button>
            ))}
          </div>

          <Divider />

          {/* Campaign Links */}
          <div>
            <SectionLabel>Campaign Links</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(({ key, label, url, hint }) => (
                <div key={key} style={{
                  background: C.bgInput, border: `1px solid ${C.line}`,
                  borderRadius: 12, padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Link2 size={12} color={C.goldBright} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.inkSoft }}>{label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => copy(url, key)} style={{
                        height: 26, padding: "0 10px", border: `1px solid ${C.line}`, borderRadius: 7,
                        background: copied === key ? C.greenDim : "transparent",
                        color: copied === key ? C.green : C.inkMuted,
                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5,
                        fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
                      }}>
                        <Copy size={10} /> {copied === key ? "Copied!" : "Copy"}
                      </button>
                      <button onClick={() => window.open(url, "_blank", "noopener,noreferrer")} style={{
                        height: 26, width: 26, border: `1px solid ${C.line}`, borderRadius: 7,
                        background: "transparent", color: C.inkMuted,
                        display: "grid", placeItems: "center", cursor: "pointer",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = C.inkSoft; e.currentTarget.style.borderColor = C.goldBorder; }}
                        onMouseLeave={e => { e.currentTarget.style.color = C.inkMuted; e.currentTarget.style.borderColor = C.line; }}
                      ><ExternalLink size={10} /></button>
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.blue, fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.5, marginBottom: 4 }}>{url}</div>
                  <div style={{ fontSize: 11, color: C.inkFaint }}>{hint}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Codes */}
          <div style={{ background: "rgba(6,10,20,0.65)", border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" }}>
            <SectionLabel>Campaign Codes</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Interview Code", value: campaign.code },
                { label: "Intake Code", value: campaign.intakeCode },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: C.inkMuted }}>{label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: C.inkSoft }}>{value}</span>
                    <button onClick={() => copy(value, label)} style={{
                      height: 22, padding: "0 8px", borderRadius: 6,
                      border: `1px solid ${C.line}`, background: "transparent",
                      color: copied === label ? C.green : C.inkFaint,
                      fontSize: 10, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Sora', sans-serif", transition: "all 0.15s",
                    }}>{copied === label ? "✓" : "Copy"}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Create Campaign Modal ─────────────────────────────────────────────────────
const CreateModal = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1 = pick type, 2 = configure
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState({
    jobTitle: "", company: "", language: "English",
    accessType: "open", cvEndDate: "", interviewEndDate: "",
    cvEnabled: true, interviewEnabled: true,
    threshold: "50",
  });
  const [created, setCreated] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState(null);

  const tabs = ["All", "General", "Stage 2", "Assessment", "Language"];
  const filtered = activeTab === "All" ? CAMPAIGN_TYPES : CAMPAIGN_TYPES.filter(c => c.tag === activeTab);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleCreate = () => {
    const code = `CAMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const intake = `INT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setGeneratedLinks({
      cvLink: `https://mawahib.ai/apply/${intake}`,
      interviewLink: `https://mawahib.ai/interview?code=${code}`,
      code, intake,
    });
    setCreated(true);
  };

  const [copied, setCopied] = useState(null);
  const copy = (text, key) => {
    navigator.clipboard?.writeText(text).catch(() => { });
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleTypeSelect = ({ id, label, tag, icon }) => {
    if (id === "first") {
      onClose();
      navigate("/interview");
      return;
    }
    setSelectedType({ id, label, tag, icon });
    setStep(2);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(4,7,16,0.8)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        fontFamily: "'Sora', sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%", maxWidth: created ? 540 : step === 2 ? 620 : 740,
        background: "rgba(10,15,28,0.98)", border: `1px solid ${C.lineStrong}`,
        borderRadius: 24, boxShadow: "0 32px 80px rgba(0,0,0,0.65)", overflow: "hidden",
        transition: "max-width 0.3s ease",
      }}>

        {/* Modal header */}
        <div style={{
          padding: "22px 26px 18px", borderBottom: `1px solid ${C.line}`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.65rem", fontWeight: 400, color: C.inkWhite, margin: "0 0 4px" }}>
              {created ? "Campaign Created!" : step === 1 ? "Create Interview Campaign" : `Configure: ${selectedType?.label}`}
            </h2>
            <p style={{ fontSize: 13, color: C.inkMuted, margin: 0 }}>
              {created ? "Your campaign is live. Share the links below." : step === 1 ? "Select a template to continue." : "Fill in the details for your new campaign."}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.line}`,
            background: "transparent", color: C.inkMuted, cursor: "pointer", display: "grid", placeItems: "center",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = C.inkSoft; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.inkMuted; }}
          ><X size={15} /></button>
        </div>

        {/* ── Step 1: Pick type ── */}
        {!created && step === 1 && (
          <>
            <div style={{ padding: "14px 26px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  height: 30, padding: "0 13px",
                  border: `1px solid ${activeTab === t ? C.goldBorderHot : C.goldBorder}`,
                  background: activeTab === t ? "linear-gradient(135deg,rgba(184,149,90,0.25),rgba(240,201,122,0.14))" : "transparent",
                  color: activeTab === t ? C.inkWhite : C.inkMuted,
                  borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
                }}>{t}</button>
              ))}
            </div>
            <div style={{
              padding: "16px 26px 24px",
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10,
              maxHeight: "52vh", overflowY: "auto",
            }}>
              {filtered.map(({ id, icon: Icon, label, tag, desc }) => (
                <button key={id} onClick={() => handleTypeSelect({ id, label, tag, icon: Icon })} style={{
                  background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 14,
                  padding: "15px 17px", display: "flex", flexDirection: "column",
                  alignItems: "flex-start", gap: 10, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s ease", fontFamily: "'Sora', sans-serif",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.goldBorderHot; e.currentTarget.style.background = C.bgCardHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = C.bgCard; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: "grid", placeItems: "center" }}>
                      <Icon size={17} color={C.goldBright} />
                    </div>
                    <Tag label={tag} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.inkWhite, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.goldBright, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                    Select <ArrowRight size={11} />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Step 2: Configure ── */}
        {!created && step === 2 && (
          <div style={{ padding: "20px 26px 24px", display: "flex", flexDirection: "column", gap: 18, maxHeight: "70vh", overflowY: "auto" }}>

            {/* Selected type badge */}
            {selectedType && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                background: C.goldDim, border: `1px solid ${C.goldBorder}`, borderRadius: 12,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(240,201,122,0.15)", border: `1px solid ${C.goldBorder}`, display: "grid", placeItems: "center" }}>
                  <selectedType.icon size={15} color={C.goldBright} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.inkWhite }}>{selectedType.label}</div>
                  <Tag label={selectedType.tag} />
                </div>
                <button onClick={() => setStep(1)} style={{
                  marginLeft: "auto", fontSize: 11.5, color: C.goldBright, fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif",
                }}>Change →</button>
              </div>
            )}

            {/* Job details */}
            <div>
              <SectionLabel>Job Details</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <InputField label="Job Title *" value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} placeholder="e.g. B2B Sales Representative" />
                <InputField label="Company Name *" value={form.company} onChange={e => set("company", e.target.value)} placeholder="e.g. Acme Corp" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <SelectField label="Interview Language" value={form.language} onChange={e => set("language", e.target.value)}>
                    <option>English</option>
                    <option>Arabic</option>
                    <option>French</option>
                  </SelectField>
                  <SelectField label="Access Type" value={form.accessType} onChange={e => set("accessType", e.target.value)}>
                    <option value="open">Open Access</option>
                    <option value="invite">Invite Only</option>
                    <option value="code">Code Required</option>
                  </SelectField>
                </div>
              </div>
            </div>

            <Divider />

            {/* Stages */}
            <div>
              <SectionLabel>Campaign Stages</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { key: "cvEnabled", label: "CV Submission", desc: "Candidates upload their CV for AI screening.", dateKey: "cvEndDate" },
                  { key: "interviewEnabled", label: "AI Interview", desc: "Shortlisted candidates complete an avatar interview.", dateKey: "interviewEndDate" },
                ].map(({ key, label, desc, dateKey }) => (
                  <div key={key} style={{
                    background: form[key] ? "rgba(57,201,143,0.04)" : "rgba(6,10,20,0.5)",
                    border: `1px solid ${form[key] ? "rgba(57,201,143,0.25)" : C.line}`,
                    borderRadius: 12, padding: "13px 14px",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: form[key] ? 10 : 0 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: form[key] ? C.inkWhite : C.inkMuted, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 11.5, color: C.inkFaint }}>{desc}</div>
                      </div>
                      {/* Toggle */}
                      <div
                        onClick={() => set(key, !form[key])}
                        style={{
                          width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                          background: form[key] ? C.green : "rgba(255,255,255,0.1)",
                          position: "relative", transition: "background 0.2s", flexShrink: 0,
                        }}
                      >
                        <div style={{
                          position: "absolute", top: 3,
                          left: form[key] ? 21 : 3,
                          width: 16, height: 16, borderRadius: "50%",
                          background: "#fff", transition: "left 0.2s",
                        }} />
                      </div>
                    </div>
                    {form[key] && (
                      <InputField label="End Date (optional)" value={form[dateKey]} onChange={e => set(dateKey, e.target.value)} type="date" placeholder="Leave blank for no end date" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* CV Threshold (only if CV enabled) */}
            {form.cvEnabled && (
              <div>
                <SectionLabel>CV Scoring</SectionLabel>
                <div style={{ background: "rgba(6,10,20,0.6)", border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 2 }}>Suitability Threshold</div>
                      <div style={{ fontSize: 11.5, color: C.inkFaint }}>Candidates scoring above this are marked suitable.</div>
                    </div>
                    <div style={{
                      fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem",
                      color: C.goldBright, minWidth: 48, textAlign: "right",
                    }}>{form.threshold}</div>
                  </div>
                  <input type="range" min="0" max="100" step="5" value={form.threshold}
                    onChange={e => set("threshold", e.target.value)}
                    style={{ width: "100%", accentColor: C.goldBright, cursor: "pointer", height: 4 }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10.5, color: C.inkFaint }}>Lenient (0)</span>
                    <span style={{ fontSize: 10.5, color: C.inkFaint }}>Strict (100)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, height: 44, borderRadius: 12,
                border: `1px solid ${C.line}`, background: "transparent",
                color: C.inkMuted, fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.lineStrong; e.currentTarget.style.color = C.inkSoft; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkMuted; }}
              >← Back</button>
              <button
                onClick={handleCreate}
                disabled={!form.jobTitle || !form.company}
                style={{
                  flex: 2, height: 44, borderRadius: 12, border: "none",
                  background: form.jobTitle && form.company
                    ? `linear-gradient(135deg,${C.gold},${C.goldBright})`
                    : "rgba(255,255,255,0.06)",
                  color: form.jobTitle && form.company ? "#1a1006" : C.inkFaint,
                  fontSize: 14, fontWeight: 700, cursor: form.jobTitle && form.company ? "pointer" : "not-allowed",
                  fontFamily: "'Sora', sans-serif",
                  boxShadow: form.jobTitle && form.company ? `0 4px 20px rgba(184,149,90,0.3)` : "none",
                  transition: "all 0.2s",
                }}
              >
                <Plus size={15} style={{ display: "inline", marginRight: 7, verticalAlign: "middle" }} />
                Create Campaign
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Created! ── */}
        {created && generatedLinks && (
          <div style={{ padding: "24px 26px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Success icon */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingBottom: 4 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: C.greenDim, border: `1px solid rgba(57,201,143,0.35)`,
                display: "grid", placeItems: "center",
              }}>
                <CheckCircle2 size={26} color={C.green} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.inkSoft, marginBottom: 2 }}>{form.jobTitle}</div>
                <div style={{ fontSize: 12.5, color: C.inkMuted }}>{form.company} · {selectedType?.label}</div>
              </div>
            </div>

            <Divider />

            {/* Generated links */}
            <div>
              <SectionLabel>Your Campaign Links</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { key: "cv", label: "CV Submission Link", url: generatedLinks.cvLink, hint: "Share this with candidates to collect CVs." },
                  { key: "interview", label: "Avatar Interview Link", url: generatedLinks.interviewLink, hint: "Send this to shortlisted candidates." },
                ].map(({ key, label, url, hint }) => (
                  <div key={key} style={{ background: C.bgInput, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Link2 size={12} color={C.goldBright} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.inkSoft }}>{label}</span>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => copy(url, key)} style={{
                          height: 26, padding: "0 10px", borderRadius: 7,
                          border: `1px solid ${C.line}`,
                          background: copied === key ? C.greenDim : "transparent",
                          color: copied === key ? C.green : C.inkMuted,
                          fontSize: 11, fontWeight: 600, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 5,
                          fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
                        }}>
                          <Copy size={10} /> {copied === key ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 11.5, color: C.blue, fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.5, marginBottom: 3 }}>{url}</div>
                    <div style={{ fontSize: 11, color: C.inkFaint }}>{hint}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Codes */}
            <div style={{ background: "rgba(6,10,20,0.65)", border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Interview Code", value: generatedLinks.code },
                  { label: "Intake Code", value: generatedLinks.intake },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: C.inkMuted }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: C.inkSoft }}>{value}</span>
                      <button onClick={() => copy(value, `code-${label}`)} style={{
                        height: 22, padding: "0 8px", borderRadius: 6,
                        border: `1px solid ${C.line}`, background: "transparent",
                        color: copied === `code-${label}` ? C.green : C.inkFaint,
                        fontSize: 10, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Sora', sans-serif",
                      }}>{copied === `code-${label}` ? "✓" : "Copy"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onClose} style={{
              height: 44, borderRadius: 12, border: "none",
              background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
              color: "#1a1006", fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
              boxShadow: `0 4px 20px rgba(184,149,90,0.3)`,
            }}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Campaign Table ───────────────────────────────────────────────────────────
const CampaignTable = ({ onSelect, selected, onInterviewResults }) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => CAMPAIGNS.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  return (
    <div style={{ background: C.bgPanel, border: `1px solid ${C.line}`, borderRadius: 22, overflow: "hidden", backdropFilter: "blur(12px)" }}>
      <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", fontWeight: 400, color: C.inkWhite, margin: 0 }}>Active Campaigns</h2>
          <p style={{ fontSize: 12.5, color: C.inkMuted, margin: "3px 0 0" }}>Click a row to view details and analytics.</p>
        </div>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Search size={14} color={C.inkFaint} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns…" style={{
            height: 36, width: 220, paddingLeft: 32, paddingRight: 12,
            background: C.bgInput, border: `1px solid ${C.line}`, borderRadius: 10,
            color: C.inkSoft, fontSize: 13, outline: "none", fontFamily: "'Sora', sans-serif", transition: "border-color 0.18s",
          }}
            onFocus={e => e.target.style.borderColor = C.goldBorder}
            onBlur={e => e.target.style.borderColor = C.line}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 0.9fr 0.9fr 0.9fr 0.9fr 90px", padding: "10px 22px", borderBottom: `1px solid ${C.line}`, background: "rgba(255,255,255,0.015)" }}>
        {["Campaign", "Status", "Applicants", "Interviewed", "Shortlisted", "Actions"].map(h => (
          <div key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint }}>{h}</div>
        ))}
      </div>
      {filtered.map(c => {
        const isSel = selected === c.id;
        return (
          <div key={c.id} onClick={() => onSelect(c.id)} style={{
            display: "grid", gridTemplateColumns: "2.2fr 0.9fr 0.9fr 0.9fr 0.9fr 90px",
            padding: "16px 22px", borderBottom: `1px solid ${C.line}`, cursor: "pointer",
            background: isSel ? "rgba(95,158,255,0.05)" : "transparent",
            borderLeft: `2px solid ${isSel ? C.blue : "transparent"}`, transition: "all 0.18s ease",
            alignItems: "center",
          }}
            onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "rgba(184,149,90,0.04)"; }}
            onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.inkWhite, marginBottom: 3 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: C.inkMuted }}>{c.company} · <span style={{ fontFamily: "monospace" }}>{c.code}</span></div>
              <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={9} /> Created {c.created}
              </div>
            </div>
            <div><StatusDot status={c.status} /></div>
            {[c.applicants, c.interviewed, c.shortlisted].map((val, i) => (
              <div key={i}>
                <span style={{ fontSize: 16, fontWeight: 600, color: C.inkSoft, fontFamily: "'DM Serif Display', serif" }}>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
              <IconBtn title="Interview Results" onClick={() => onInterviewResults && onInterviewResults(c.id)}><BarChart2 size={14} /></IconBtn>
              <IconBtn title="More" onClick={() => onSelect(c.id)}><MoreHorizontal size={14} /></IconBtn>
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div style={{ padding: "40px 22px", textAlign: "center", color: C.inkMuted, fontSize: 14 }}>No campaigns match your search.</div>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showInterModal, setShowInterModal] = useState(false);
  const selectedCampaign = CAMPAIGNS.find(c => c.id === selectedId);

  return (
    <>
      <FontLink />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: rgba(184,149,90,0.2) transparent; }
        body {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80vw 55vh at 100% -5%, rgba(184,149,90,0.1) 0%, transparent 55%),
            radial-gradient(ellipse 60vw 45vh at -5% 95%, rgba(95,158,255,0.06) 0%, transparent 50%),
            #080d1c;
          font-family: 'Sora', sans-serif;
        }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        input::placeholder { color: rgba(245,240,235,0.28); }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .main-layout { flex-direction: column !important; }
        }
        @media (max-width: 960px) {
          .circular-kpi-grid { grid-template-columns: 1fr !important; }
          .insight-copy-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />

      <main style={{
        maxWidth: 1360, margin: "0 auto",
        padding: "clamp(84px,10vw,96px) clamp(16px,2.5vw,32px) 56px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: C.goldDim, border: `1px solid ${C.goldBorder}`,
              borderRadius: 999, padding: "5px 12px",
              fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: C.goldBright, marginBottom: 12,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
              Dashboard
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1, letterSpacing: "-0.02em", margin: 0, color: C.inkWhite }}>
              Hiring Campaigns
            </h1>
            <p style={{ fontSize: 14, color: C.inkMuted, marginTop: 8, marginBottom: 0 }}>Manage and track all your AI-powered interview campaigns.</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            height: 46, padding: "0 22px",
            background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
            border: "none", borderRadius: 13,
            color: "#1a1006", fontSize: 14, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Sora', sans-serif",
            boxShadow: `0 4px 20px rgba(184,149,90,0.35)`, transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px rgba(184,149,90,0.45)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px rgba(184,149,90,0.35)`; }}
          >
            <Plus size={17} strokeWidth={2.5} /> New Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { label: "Total Campaigns", value: "1", sub: "1 active", icon: FileText, color: C.blue },
            { label: "Total Applicants", value: "108", sub: "This month", icon: Users, color: C.goldBright },
            { label: "Interviewed", value: "28", sub: "26% of total", icon: MessageSquare, color: C.green },
            { label: "Shortlisted", value: "12", sub: "11% of total", icon: TrendingUp, color: C.yellow },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} style={{
              background: C.bgPanel, border: `1px solid ${C.line}`,
              borderRadius: 18, padding: "18px 20px",
              display: "flex", alignItems: "center", gap: 14, backdropFilter: "blur(12px)",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: `${color}1a`, border: `1px solid ${color}40`,
                display: "grid", placeItems: "center",
              }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.inkWhite, lineHeight: 1, fontFamily: "'DM Serif Display', serif" }}>{value}</div>
                <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 3 }}>{label}</div>
                <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div className="main-layout" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{
            flex: selectedCampaign ? "0 0 auto" : "1 1 100%",
            width: selectedCampaign ? "calc(100% - 420px - 16px)" : "100%",
            minWidth: 0, transition: "width 0.3s ease",
          }}>
            <CampaignTable onSelect={setSelectedId} selected={selectedId} onInterviewResults={() => setShowInterModal(true)} />
          </div>

          {selectedCampaign && (
            <div style={{ flexShrink: 0, width: 420 }}>
              <CampaignDetail campaign={selectedCampaign} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>

        {/* Circular Dashboard Insights */}
        {!selectedCampaign && (
          <DashboardCircularInsights campaign={CAMPAIGNS[0]} onCreateCampaign={() => setShowModal(true)} />
        )}
      </main>

      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
      {showInterModal && <InterviewResults onClose={() => setShowInterModal(false)} />}
    </>
  );
}


