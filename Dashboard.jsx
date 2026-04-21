import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus, Search, Settings, LogOut, Clock, Copy, ExternalLink,
  BarChart2, Users, CheckCircle2, ArrowRight, MoreHorizontal,
  Sparkles, TrendingUp, FileText, MessageSquare, Brain, Gavel,
  Globe, Layers, X, Calendar, Link2, Eye,
  UserCheck, UserX, AlertCircle, Award, BarChart, PieChart,
  ChevronDown, Mail, RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CVResults from "./resume";
import InterviewResults from "./Inter";
import Interview from "./Interview";
import { getPaginationWindow, MIN_TABLE_ROWS, paginateItems } from "./tablePagination";
import DashboardCVResultsPanel from "./CVResultsPanel";

// ─── Design Tokens — Light Golden Theme ───────────────────────────────────────
const C = {
  bgDark: "#f9f5ef",               // warm off-white page background
  bgPanel: "rgba(197, 164, 126, 0.10)",  // soft golden panel
  bgCard: "rgba(197, 164, 126, 0.06)",
  bgCardHover: "rgba(197, 164, 126, 0.16)",
  bgInput: "rgba(255, 250, 242, 0.85)",
  gold: "#b8915a",
  goldBright: "#9b6f36",
  goldDim: "rgba(184, 145, 90, 0.14)",
  goldBorder: "rgba(184, 145, 90, 0.35)",
  goldBorderHot: "rgba(184, 145, 90, 0.55)",
  inkWhite: "#1c1409",             // near-black for headings on light bg
  inkSoft: "rgba(44, 30, 10, 0.90)",
  inkMuted: "rgba(80, 58, 28, 0.65)",
  inkFaint: "rgba(120, 96, 55, 0.50)",
  line: "rgba(184, 145, 90, 0.18)",
  lineStrong: "rgba(184, 145, 90, 0.32)",
  blue: "#3a7bd5",
  blueDim: "rgba(58, 123, 213, 0.10)",
  green: "#2d9e75",
  greenDim: "rgba(45, 158, 117, 0.10)",
  greenBright: "rgba(45, 158, 117, 0.85)",
  yellow: "#c48a00",
  yellowDim: "rgba(196, 138, 0, 0.10)",
  red: "#d94f6b",
  redDim: "rgba(217, 79, 107, 0.10)",
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
  "General": { bg: "rgba(58,123,213,0.10)", border: "rgba(58,123,213,0.28)", text: C.blue },
  "Stage 2": { bg: "rgba(184,145,90,0.12)", border: "rgba(184,145,90,0.30)", text: C.gold },
  "Assessment": { bg: "rgba(45,158,117,0.10)", border: "rgba(45,158,117,0.28)", text: C.green },
  "Language": { bg: "rgba(196,138,0,0.10)", border: "rgba(196,138,0,0.28)", text: C.yellow },
};

const CAMPAIGNS = [
  {
    id: "demo",
    code: "DEMO-073298",
    title: "B2B Sales Representative",
    company: "Demo Company",
    created: "Mar 30, 2026",
    status: "active",
    focus: "First Interview",
    applicants: 108,
    interviewed: 28,
    shortlisted: 12,
    intakeCode: "DEMOT-F9908C",
    cvEnd: "No end date",
    interviewEnd: "No end date",
    accessType: "Open access",
    language: "EN",
  },
  {
    id: "finops-0412",
    code: "FIN-041231",
    title: "Finance Operations Analyst",
    company: "Northstar Holdings",
    created: "Apr 02, 2026",
    status: "active",
    focus: "Problem Solving",
    applicants: 94,
    interviewed: 24,
    shortlisted: 10,
    intakeCode: "FINTK-0412A",
    cvEnd: "Apr 28, 2026",
    interviewEnd: "May 05, 2026",
    accessType: "Open access",
    language: "EN",
  },
  {
    id: "csm-emea",
    code: "CSM-114920",
    title: "Customer Success Manager",
    company: "Orbit SaaS",
    created: "Apr 01, 2026",
    status: "active",
    focus: "Situational Judgment (SJT)",
    applicants: 76,
    interviewed: 18,
    shortlisted: 7,
    intakeCode: "CSMTK-1149",
    cvEnd: "Apr 24, 2026",
    interviewEnd: "Apr 30, 2026",
    accessType: "Invite only",
    language: "EN",
  },
  {
    id: "pmm-ksa",
    code: "PMM-552018",
    title: "Product Marketing Specialist",
    company: "Sahara Cloud",
    created: "Mar 28, 2026",
    status: "paused",
    focus: "Cognitive Ability",
    applicants: 63,
    interviewed: 15,
    shortlisted: 6,
    intakeCode: "PMMTK-5520",
    cvEnd: "Paused",
    interviewEnd: "Paused",
    accessType: "Open access",
    language: "AR",
  },
  {
    id: "hrbp-gcc",
    code: "HRB-843512",
    title: "HR Business Partner",
    company: "Apex Industrial",
    created: "Mar 27, 2026",
    status: "active",
    focus: "Teamwork & Communication",
    applicants: 88,
    interviewed: 21,
    shortlisted: 8,
    intakeCode: "HRBTK-8435",
    cvEnd: "Apr 26, 2026",
    interviewEnd: "May 03, 2026",
    accessType: "Open access",
    language: "EN",
  },
];

const INITIAL_FUNNEL_DATA = [
  { label: "CV Submitted", value: 108, pct: 100, color: C.blue },
  { label: "Invited", value: 62, pct: 57, color: C.gold },
  { label: "Interviewed", value: 28, pct: 26, color: C.yellow },
  { label: "Shortlisted", value: 12, pct: 11, color: C.green },
];

// Mock CV results data
const CV_RESULTS = [
  {
    id: "cv-ahmad-al-saleh",
    name: "Ahmad Al-Saleh",
    email: "ahmad.saleh@example.com",
    submittedAt: "2026-04-16",
    submittedAtLabel: "16/04/26",
    detailsLabel: "View details",
    cvFile: "Ahmad_AlSaleh_CV.pdf",
    reviewStatus: "Pending",
    gender: "Male",
    country: "Saudi Arabia",
    city: "Riyadh",
    phone: "+966501234567",
    jdScore: 84,
    penalty: 0,
    overqualificationPenalty: 0,
    finalScore: 84,
    disqualified: "NO",
    suitable: true,
    summary: "Senior Sales Representative with 6+ years of experience in B2B technology sales across the GCC. Proven track record of exceeding quotas and building long-term strategic partnerships with enterprise clients in Riyadh and Dubai.",
    experience: [
      {
        title: "Senior Sales Account Manager",
        company: "GlobalTech Solutions",
        period: "2021 — Present",
        points: [
          "Exceeded annual sales targets by average of 15% for three consecutive years.",
          "Managed a portfolio of 40+ enterprise accounts in the manufacturing sector.",
          "Led the implementation of a new CRM workflow that improved lead conversion by 22%."
        ]
      },
      {
        title: "B2B Sales Representative",
        company: "Innovate Middle East",
        period: "2018 — 2021",
        points: [
          "Developed new business opportunities in the untapped SME market in Riyadh.",
          "Conducted over 200 technical product demonstrations to C-level executives.",
          "Reduced sales cycle time by 30% through effective qualifying techniques."
        ]
      }
    ],
    education: [
      { degree: "B.Sc. in Business Administration", institution: "King Saud University", year: "2017" }
    ],
    skills: ["B2B Sales", "Strategic Negotiating", "CRM (Salesforce)", "Market Analysis", "Fluent Arabic & English"]
  },
  {
    id: "cv-mona-haddad",
    name: "Mona Haddad",
    email: "mona.haddad@example.com",
    submittedAt: "2026-04-16",
    submittedAtLabel: "16/04/26",
    detailsLabel: "View details",
    cvFile: "Mona_Haddad_CV.pdf",
    reviewStatus: "Pending",
    gender: "Female",
    country: "Jordan",
    city: "Amman",
    phone: "+962790001122",
    jdScore: 73,
    penalty: 0,
    overqualificationPenalty: 0,
    finalScore: 73,
    disqualified: "NO",
    suitable: true,
    summary: "Detail-oriented Finance Analyst with experience in revenue operations and financial modeling. Specialized in the SaaS sector with a focus on EMEA markets and compliance tracking.",
    experience: [
      {
        title: "Junior Finance Analyst",
        company: "Skyline Ventures",
        period: "2022 — Present",
        points: [
          "Maintained financial records for cross-border transactions in 5 currencies.",
          "Assisted in the preparation of quarterly revenue reports for board members.",
          "Optimized the accounts receivable process, reducing DTO by 5 days."
        ]
      }
    ],
    education: [
      { degree: "B.A. in Finance & Accounting", institution: "University of Jordan", year: "2021" }
    ],
    skills: ["Financial Modeling", "QuickBooks", "Multi-currency Accounting", "Data Analytics (Python)"]
  },
  {
    id: "cv-yousef-nasser",
    name: "Yousef Nasser",
    email: "y.nasser@example.com",
    submittedAt: "2026-04-15",
    submittedAtLabel: "15/04/26",
    detailsLabel: "View details",
    cvFile: "Yousef_Nasser_CV.pdf",
    reviewStatus: "Pending",
    gender: "Male",
    country: "UAE",
    city: "Dubai",
    phone: "+971551112233",
    jdScore: 66,
    penalty: 0,
    overqualificationPenalty: 0,
    finalScore: 66,
    disqualified: "NO",
    suitable: true,
  },
  {
    id: "cv-layla-rahman",
    name: "Layla Rahman",
    email: "layla.rahman@example.com",
    submittedAt: "2026-04-14",
    submittedAtLabel: "14/04/26",
    detailsLabel: "View details",
    cvFile: "Layla_Rahman_CV.pdf",
    reviewStatus: "Reviewed",
    gender: "Female",
    country: "Qatar",
    city: "Doha",
    phone: "+97433123456",
    jdScore: 58,
    penalty: 2,
    overqualificationPenalty: 0,
    finalScore: 56,
    disqualified: "NO",
    suitable: true,
  },
  {
    id: "cv-khaled-ibrahim",
    name: "Khaled Ibrahim",
    email: "khaled.ibrahim@example.com",
    submittedAt: "2026-04-13",
    submittedAtLabel: "13/04/26",
    detailsLabel: "View details",
    cvFile: "Khaled_Ibrahim_CV.pdf",
    reviewStatus: "Contacted",
    gender: "Male",
    country: "Bahrain",
    city: "Manama",
    phone: "+97336667788",
    jdScore: 51,
    penalty: 4,
    overqualificationPenalty: 0,
    finalScore: 47,
    disqualified: "NO",
    suitable: false,
  },
  {
    id: "cv-noor-abbas",
    name: "Noor Abbas",
    email: "noor.abbas@example.com",
    submittedAt: "2026-04-12",
    submittedAtLabel: "12/04/26",
    detailsLabel: "View details",
    cvFile: "Noor_Abbas_CV.pdf",
    reviewStatus: "Pending",
    gender: "Female",
    country: "Kuwait",
    city: "Kuwait City",
    phone: "+96594445566",
    jdScore: 42,
    penalty: 0,
    overqualificationPenalty: 3,
    finalScore: 39,
    disqualified: "YES",
    suitable: false,
  },
];

const CV_STATS = {
  total: 108, suitable: 62, unsuitable: 46, threshold: 50,
  male: 58, female: 50,
  scoreRanges: [
    { range: "80–100", count: 12, color: C.green },
    { range: "60–79", count: 28, color: C.gold },
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
  const statusMap = {
    active: { color: C.green, label: "Active" },
    paused: { color: C.yellow, label: "Paused" },
    suitable: { color: C.green, label: "Suitable" },
    unsuitable: { color: C.red, label: "Unsuitable" },
  };
  const { color, label } = statusMap[status] || { color: C.inkFaint, label: status };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.inkSoft, fontWeight: 500 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
      {label}
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
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: "rgba(197, 164, 126, 0.06)", padding: "12px 12px 8px" }}>
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
              <rect x={x} y={y} width={barWidth} height={Math.max(4, barHeight)} rx={6} fill={point.color} opacity={0.85} />
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

const getViewportState = () => {
  if (typeof window === "undefined") {
    return { width: 1440, isMobile: false, isTablet: false };
  }

  const width = window.innerWidth;
  return {
    width,
    isMobile: width < 768,
    isTablet: width < 1180,
  };
};

const useViewportState = () => {
  const [viewport, setViewport] = useState(getViewportState);

  useEffect(() => {
    let frameId = null;

    const handleResize = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setViewport(getViewportState());
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return viewport;
};

const useModalLifecycle = ({ onClose, initialFocusRef }) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEscape);
    requestAnimationFrame(() => initialFocusRef?.current?.focus?.());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, initialFocusRef]);
};

const ModalBackdrop = ({ children, onClose, zIndex = 1100, ariaLabel = "Modal", padding = 24 }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label={ariaLabel}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose?.();
    }}
    style={{
      position: "fixed",
      inset: 0,
      zIndex,
      background: "rgba(255, 250, 242, 0.55)",
      backdropFilter: "saturate(1.12) blur(22px)",
      display: "grid",
      placeItems: "center",
      padding,
      overflowY: "auto",
    }}
  >
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
      background: "rgba(255, 250, 242, 0.75)",
      border: `1px solid ${C.line}`,
      borderRadius: 16,
      padding: "16px 14px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      minHeight: 252,
      boxShadow: "0 2px 12px rgba(184,145,90,0.08)",
    }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: 148, height: 148, overflow: "visible" }} role="img" aria-label={`${label} ${safeValue}%`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.line} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.45s ease" }}
        />
        <text
          x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
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

const DashboardCircularInsights = ({ campaign, onCreateCampaign, isMobile = false, isTablet = false }) => {
  const totalApplicants = Math.max(campaign.applicants || 0, 1);
  const interviewRate = Math.round(((campaign.interviewed || 0) / totalApplicants) * 100);
  const shortlistRate = Math.round(((campaign.shortlisted || 0) / totalApplicants) * 100);
  const shortlistFromInterviewRate = campaign.interviewed
    ? Math.round(((campaign.shortlisted || 0) / campaign.interviewed) * 100)
    : 0;

  return (
    <section style={{
      background: "rgba(255, 250, 242, 0.80)",
      border: `1px solid ${C.line}`,
      borderRadius: 22,
      padding: isMobile ? "18px 16px 16px" : "24px 24px 20px",
      backdropFilter: "blur(12px)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      boxShadow: "0 4px 24px rgba(184,145,90,0.08)",
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
            height: 40, padding: "0 16px", borderRadius: 11,
            border: `1px solid ${C.goldBorder}`,
            background: C.goldDim,
            color: C.gold,
            fontSize: 12.5, fontWeight: 700, fontFamily: "'Sora', sans-serif",
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg,${C.gold},${C.goldBright})`;
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.goldDim;
            e.currentTarget.style.color = C.gold;
          }}
        >
          <Plus size={14} /> Create Campaign
        </button>
      </div>

      <div className="circular-kpi-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, minmax(220px, 1fr))" : "repeat(3, minmax(210px, 1fr))", gap: 12 }}>
        <CircularKpi label="Interview Reach" value={interviewRate} color={C.blue} description="Share of total applicants who progressed into the interview stage." />
        <CircularKpi label="Shortlist Yield" value={shortlistRate} color={C.green} description="Total pipeline conversion from applicants into shortlist-ready candidates." />
        <CircularKpi label="Quality Pass Rate" value={shortlistFromInterviewRate} color={C.gold} description="Percent of interviewed candidates who met quality criteria for shortlist." />
      </div>

      <div className="insight-copy-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, minmax(180px, 1fr))" : "repeat(3, minmax(180px, 1fr))", gap: 10 }}>
        {[
          { title: "Executive Summary", body: `${campaign.shortlisted} shortlisted from ${campaign.applicants} total applicants indicates a focused, quality-first screening flow.` },
          { title: "Operational Insight", body: `${campaign.interviewed} candidates interviewed so far. Continue cadence to preserve decision velocity and avoid bottlenecks.` },
          { title: "Strategic Recommendation", body: "Use this circular KPI block in weekly hiring reviews to track conversion health and drive evidence-based hiring decisions." },
        ].map((card) => (
          <div key={card.title} style={{
            background: "rgba(255, 250, 242, 0.60)",
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            padding: "12px 13px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>
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

const ModernSelect = ({ value, onChange, options, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value) || options[0];

  return (
    <div ref={containerRef} style={{ position: "relative", minWidth: 160 }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          height: 40,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          background: "#fff",
          border: `1px solid ${isOpen ? C.goldBorder : C.line}`,
          borderRadius: 12,
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? "0 4px 12px rgba(184,145,90,0.08)" : "none",
        }}
      >
        <span style={{ fontSize: 13, color: C.inkSoft, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedOption.label}
        </span>
        <ChevronDown size={14} color={C.inkMuted} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          right: 0,
          zIndex: 100,
          background: "#fff",
          border: `1px solid ${C.lineStrong}`,
          borderRadius: 14,
          padding: "6px",
          boxShadow: "0 12px 30px rgba(28,20,9,0.12)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: value === option.id ? C.goldDim : "transparent",
                color: value === option.id ? C.gold : C.inkSoft,
                fontSize: 13,
                fontWeight: value === option.id ? 700 : 500,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                if (value !== option.id) e.currentTarget.style.background = "rgba(184,145,90,0.05)";
              }}
              onMouseLeave={e => {
                if (value !== option.id) e.currentTarget.style.background = "transparent";
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const IconBtn = ({ children, onClick, title, active, buttonRef }) => (
  <button
    ref={buttonRef}
    type="button" title={title}
    onClick={(e) => { e.preventDefault(); onClick?.(e); }}
    style={{
      width: 32, height: 32, borderRadius: 8,
      border: `1px solid ${active ? C.goldBorder : C.line}`,
      background: active ? C.goldDim : "transparent",
      color: active ? C.gold : C.inkMuted,
      display: "grid", placeItems: "center", cursor: "pointer", transition: "all 0.18s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = C.goldDim; e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.color = C.inkSoft; }}
    onMouseLeave={e => {
      e.currentTarget.style.background = active ? C.goldDim : "transparent";
      e.currentTarget.style.borderColor = active ? C.goldBorder : C.line;
      e.currentTarget.style.color = active ? C.gold : C.inkMuted;
    }}
  >{children}</button>
);

const DashboardTablePagination = ({ page, totalPages, startIndex, endIndex, totalItems, itemLabel, onPageChange }) => {
  const pageNumbers = getPaginationWindow(page, totalPages);
  const summary = totalItems
    ? `Showing ${startIndex}-${endIndex} of ${totalItems} ${itemLabel}`
    : `No ${itemLabel} available`;

  return (
    <div style={{
      padding: "14px 18px",
      borderTop: `1px solid ${C.line}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap",
      background: "rgba(255,250,242,0.50)",
    }}>
      <div style={{ fontSize: 12.5, color: C.inkMuted }}>{summary}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {[
          { key: "prev", label: "Prev", disabled: page === 1, targetPage: page - 1 },
          ...pageNumbers.map((pageNumber) => ({
            key: `page-${pageNumber}`,
            label: String(pageNumber),
            disabled: false,
            targetPage: pageNumber,
            active: pageNumber === page,
          })),
          { key: "next", label: "Next", disabled: page === totalPages, targetPage: page + 1 },
        ].map(({ key, label, disabled, targetPage, active }) => (
          <button
            key={key} type="button" disabled={disabled}
            aria-label={active ? `Current page, page ${label}` : `Go to page ${label}`}
            onClick={() => onPageChange(targetPage)}
            style={{
              minWidth: 36, height: 34, padding: "0 12px", borderRadius: 9,
              border: `1px solid ${active ? C.goldBorder : C.line}`,
              background: active ? C.goldDim : "transparent",
              color: active ? C.gold : disabled ? C.inkFaint : C.inkMuted,
              cursor: disabled ? "not-allowed" : "pointer",
              fontSize: 12.5, fontWeight: 600, fontFamily: "'Sora', sans-serif",
              opacity: disabled ? 0.45 : 1, transition: "all 0.18s ease",
            }}
            onMouseEnter={(e) => {
              if (disabled || active) return;
              e.currentTarget.style.borderColor = C.goldBorder;
              e.currentTarget.style.color = C.inkSoft;
              e.currentTarget.style.background = C.goldDim;
            }}
            onMouseLeave={(e) => {
              if (disabled || active) return;
              e.currentTarget.style.borderColor = C.line;
              e.currentTarget.style.color = C.inkMuted;
              e.currentTarget.style.background = "transparent";
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};



// ─── CV Results Panel ─────────────────────────────────────────────────────────
// ✅ BUG FIX: Removed stray JSX (h1, p, button) that was accidentally pasted
//    inside the candidatePagination.pageItems.map() callback, which caused
//    "Adjacent JSX elements must be wrapped in an enclosing tag" error.
const LegacyCVResultsPanel = ({ campaign }) => {
  const [view, setView] = useState("overview");
  const [candidatePage, setCandidatePage] = useState(1);

  const maxBarCount = Math.max(...CV_STATS.scoreRanges.map(r => r.count));
  const candidatePagination = useMemo(
    () => paginateItems(CV_RESULTS, candidatePage, MIN_TABLE_ROWS),
    [candidatePage]
  );

  useEffect(() => {
    if (candidatePage !== candidatePagination.currentPage) {
      setCandidatePage(candidatePagination.currentPage);
    }
  }, [candidatePage, candidatePagination.currentPage]);

  useEffect(() => {
    if (view === "candidates") {
      setCandidatePage(1);
    }
  }, [view]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, background: "rgba(255,250,242,0.70)", border: `1px solid ${C.line}`, borderRadius: 12, padding: 4 }}>
        {[
          { id: "overview", label: "Overview", icon: PieChart },
          { id: "candidates", label: "Candidates", icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setView(id)} style={{
            flex: 1, height: 32, borderRadius: 9,
            border: `1px solid ${view === id ? C.goldBorder : "transparent"}`,
            background: view === id ? `linear-gradient(135deg,rgba(184,145,90,0.18),rgba(184,145,90,0.08))` : "transparent",
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
              { label: "Total CVs", value: CV_STATS.total, sub: "Uploaded", color: C.blue, border: "rgba(58,123,213,0.22)" },
              { label: "Suitable", value: CV_STATS.suitable, sub: `Score ≥ ${CV_STATS.threshold}`, color: C.green, border: "rgba(45,158,117,0.25)" },
              { label: "Unsuitable", value: CV_STATS.unsuitable, sub: "Below threshold", color: C.red, border: "rgba(217,79,107,0.22)" },
              { label: "Pass Rate", value: `${Math.round(CV_STATS.suitable / CV_STATS.total * 100)}%`, sub: "Of reviewed", color: C.gold, border: C.goldBorder },
            ].map(({ label, value, sub, color, border }) => (
              <div key={label} style={{
                background: "rgba(255, 250, 242, 0.75)", border: `1px solid ${border}`,
                borderRadius: 14, padding: "14px 16px",
                boxShadow: "0 2px 8px rgba(184,145,90,0.06)",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11.5, color: C.inkMuted }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Gender breakdown */}
          <div style={{ background: "rgba(255, 250, 242, 0.75)", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px" }}>
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
                  <div style={{ height: "100%", width: `${Math.round(CV_STATS.female / CV_STATS.total * 100)}%`, borderRadius: 99, background: "#d4608a" }} />
                </div>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 99, overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${Math.round(CV_STATS.male / CV_STATS.total * 100)}%`, background: C.blue }} />
              <div style={{ flex: 1, background: "#d4608a" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: C.inkFaint }}>♂ {Math.round(CV_STATS.male / CV_STATS.total * 100)}% Male</span>
              <span style={{ fontSize: 11, color: C.inkFaint }}>{Math.round(CV_STATS.female / CV_STATS.total * 100)}% Female ♀</span>
            </div>
          </div>

          {/* Score distribution bar chart */}
          <div style={{ background: "rgba(255, 250, 242, 0.75)", border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px" }}>
            <SectionLabel>Score Distribution</SectionLabel>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {CV_STATS.scoreRanges.map(({ range, count, color }) => (
                <div key={range} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ fontSize: 11, color: C.inkMuted, fontWeight: 600 }}>{count}</div>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    height: `${Math.round(count / maxBarCount * 64)}px`,
                    background: color, opacity: 0.80,
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
            background: "linear-gradient(135deg,rgba(184,145,90,0.08),rgba(184,145,90,0.04))",
            border: `1px solid ${C.goldBorder}`, borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <AlertCircle size={16} color={C.gold} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 12.5, color: C.inkMuted, lineHeight: 1.6 }}>
              <span style={{ color: C.inkSoft, fontWeight: 600 }}>Suitability threshold set to {CV_STATS.threshold}.</span>{" "}
              Candidates scoring above this are marked suitable and eligible for interview.
            </div>
          </div>
        </>
      ) : (
        /* ✅ FIXED: Candidates list — stray JSX removed from inside .map() */
        <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "rgba(255, 250, 242, 0.75)", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
          {/* List header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 52px 50px 50px",
            padding: "10px 14px", borderBottom: `1px solid ${C.line}`,
            background: "rgba(184,145,90,0.05)",
          }}>
            {["Candidate", "Score", "Match", "Status"].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint }}>{h}</div>
            ))}
          </div>

          {/* ✅ FIXED: Only the candidate row JSX is inside this .map() */}
          {candidatePagination.pageItems.map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 52px 50px 50px",
              padding: "11px 14px",
              borderBottom: i < candidatePagination.pageItems.length - 1 ? `1px solid ${C.line}` : "none",
              background: r.status === "suitable" ? "rgba(45,158,117,0.04)" : "transparent",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.inkWhite }}>{r.name}</div>
                <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 1 }}>{r.gender === "M" ? "Male" : "Female"} · {r.exp}</div>
              </div>
              {/* Score pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "3px 8px", borderRadius: 8,
                background: r.score >= 70 ? "rgba(45,158,117,0.12)" : r.score >= 50 ? "rgba(196,138,0,0.12)" : "rgba(217,79,107,0.12)",
                color: r.score >= 70 ? C.green : r.score >= 50 ? C.yellow : C.red,
                fontSize: 12, fontWeight: 700,
              }}>
                {r.score}
              </div>
              {/* Match badge */}
              <div style={{ fontSize: 12, color: C.inkMuted, fontWeight: 500 }}>{r.match}</div>
              {/* Status dot */}
              <StatusDot status={r.status} />
            </div>
          ))}

          <DashboardTablePagination
            page={candidatePagination.currentPage}
            totalPages={candidatePagination.totalPages}
            startIndex={candidatePagination.startIndex}
            endIndex={candidatePagination.endIndex}
            totalItems={CV_RESULTS.length}
            itemLabel="candidates"
            onPageChange={setCandidatePage}
          />
        </div>
      )}
    </div>
  );
};

const CampaignTable = ({ onSelect, selected, onInterviewResults, isMobile = false, isTablet = false }) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [focusFilter, setFocusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");
  const [campaignPage, setCampaignPage] = useState(1);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const tableColumns = isTablet
    ? "minmax(220px, 2fr) minmax(120px, 0.8fr) minmax(110px, 0.8fr) minmax(130px, 0.9fr) minmax(150px, 0.9fr) minmax(180px, 1fr)"
    : "minmax(220px, 2.1fr) minmax(120px, 0.8fr) minmax(130px, 0.9fr) minmax(140px, 0.9fr) minmax(170px, 1fr) minmax(200px, 1.1fr)";

  const filteredCampaigns = useMemo(() => {
    const search = query.trim().toLowerCase();

    const parseDate = (d) => {
      if (!d || d === "No end date" || d === "Paused") return Infinity;
      return new Date(d).getTime();
    };

    let list = CAMPAIGNS.filter((campaign) => {
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      const matchesFocus = focusFilter === "all" || campaign.focus === focusFilter;
      const matchesSearch = !search || [
        campaign.title,
        campaign.company,
        campaign.code,
        campaign.intakeCode,
      ].some((value) => value.toLowerCase().includes(search));

      return matchesStatus && matchesFocus && matchesSearch;
    });

    // Sorting
    list.sort((a, b) => {
      switch (sortFilter) {
        case "oldest":
          return new Date(a.created).getTime() - new Date(b.created).getTime();
        case "mostInvited":
          return b.applicants - a.applicants;
        case "mostCompleted":
          return b.shortlisted - a.shortlisted;
        case "cvEndSoonest":
          return parseDate(a.cvEnd) - parseDate(b.cvEnd);
        case "interviewEndSoonest":
          return parseDate(a.interviewEnd) - parseDate(b.interviewEnd);
        case "newest":
        default:
          return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
    });

    return list;
  }, [query, statusFilter, focusFilter, sortFilter]);

  const campaignPagination = useMemo(
    () => paginateItems(filteredCampaigns, campaignPage, MIN_TABLE_ROWS),
    [filteredCampaigns, campaignPage]
  );

  useEffect(() => {
    if (campaignPage !== campaignPagination.currentPage) {
      setCampaignPage(campaignPagination.currentPage);
    }
  }, [campaignPage, campaignPagination.currentPage]);

  useEffect(() => {
    setCampaignPage(1);
  }, [query, statusFilter, focusFilter, sortFilter]);

  return (
    <section style={{
      background: "rgba(255, 250, 242, 0.82)",
      border: `1px solid ${C.line}`,
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: "0 6px 24px rgba(184,145,90,0.08)",
      backdropFilter: "blur(14px)",
    }}>
      <div style={{
        padding: "18px 18px 16px",
        borderBottom: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint }}>
            Campaign Overview
          </div>
          <div style={{ fontSize: 22, color: C.inkWhite, fontFamily: "'DM Serif Display', serif", marginTop: 4 }}>
            Active hiring pipeline
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", flex: isMobile ? "1 1 100%" : "0 1 auto" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: isMobile ? "100%" : 280,
            height: 40,
            padding: "0 14px",
            borderRadius: 12,
            border: `1px solid ${C.line}`,
            background: "#fff",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)",
          }}>
            <Search size={15} color={C.inkFaint} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, company, or code…"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                color: C.inkSoft,
                fontSize: 13,
                width: "100%",
                fontFamily: "'Sora', sans-serif",
              }}
            />
          </div>

          <ModernSelect
            value={focusFilter}
            onChange={setFocusFilter}
            options={[
              { id: "all", label: "All campaign focus" },
              { id: "First Interview", label: "First Interview" },
              { id: "Second Interview", label: "Second Interview" },
              { id: "Problem Solving", label: "Problem Solving" },
              { id: "Situational Judgment (SJT)", label: "Situational Judgment (SJT)" },
              { id: "Cognitive Ability", label: "Cognitive Ability" },
              { id: "English Communication", label: "English Communication" },
              { id: "Work Ethics & Reliability", label: "Work Ethics & Reliability" },
              { id: "Teamwork & Communication", label: "Teamwork & Communication" },
            ]}
          />

          <ModernSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { id: "all", label: "All status" },
              { id: "active", label: "Active" },
              { id: "paused", label: "Non-active" },
            ]}
          />

          <ModernSelect
            value={sortFilter}
            onChange={setSortFilter}
            options={[
              { id: "newest", label: "Sort: Newest" },
              { id: "oldest", label: "Sort: Oldest" },
              { id: "mostInvited", label: "Sort: Most invited" },
              { id: "mostCompleted", label: "Sort: Most completed" },
              { id: "cvEndSoonest", label: "Sort: CV end (soonest)" },
              { id: "interviewEndSoonest", label: "Sort: Interview end (soonest)" },
            ]}
          />
        </div>
      </div>

      {!isMobile && (
        <div style={{ overflowX: "auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: tableColumns,
            minWidth: isTablet ? 980 : undefined,
            padding: "12px 18px",
            gap: 12,
            borderBottom: `1px solid ${C.line}`,
            background: "rgba(184,145,90,0.05)",
          }}>
            {["Campaign", "Status", "Applicants", "Shortlisted", "Language", "Actions"].map((heading) => (
              <div
                key={heading}
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: C.inkFaint,
                  textAlign: heading === "Actions" ? "center" : "left"
                }}
              >
                {heading}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", overflowX: isMobile ? "visible" : "auto" }}>
        {campaignPagination.pageItems.map((campaign, index) => {
          const isSelected = selected === campaign.id;

          return (
            <div
              key={campaign.id}
              onClick={() => onSelect?.(isSelected ? null : campaign.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(isSelected ? null : campaign.id);
                }
              }}
              role="button"
              tabIndex={0}
              style={{
                display: isMobile ? "flex" : "grid",
                gridTemplateColumns: isMobile ? undefined : tableColumns,
                flexDirection: isMobile ? "column" : undefined,
                gap: isMobile ? 14 : 12,
                alignItems: isMobile ? "stretch" : "center",
                padding: "16px 18px",
                borderBottom: index < campaignPagination.pageItems.length - 1 ? `1px solid ${C.line}` : "none",
                background: isSelected ? "rgba(184,145,90,0.10)" : "transparent",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "'Sora', sans-serif",
                transition: "background 0.18s ease",
                minWidth: isMobile ? undefined : (isTablet ? 980 : undefined),
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = "rgba(184,145,90,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isSelected ? "rgba(184,145,90,0.10)" : "transparent";
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.inkWhite }}>{campaign.title}</div>
                  <Tag label={campaign.status === "active" ? "General" : "Stage 2"} />
                </div>
                <div style={{ fontSize: 12.5, color: C.inkMuted, marginTop: 4 }}>
                  {campaign.company} · {campaign.code}
                </div>
                <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 4 }}>
                  Created {campaign.created}
                </div>
              </div>

              {isMobile ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <StatusDot status={campaign.status} />
                    <div style={{ fontSize: 12.5, color: C.inkMuted }}>
                      {campaign.language} · {campaign.accessType}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    {[
                      { label: "Applicants", value: campaign.applicants, tone: C.inkWhite, sub: "total applicants" },
                      { label: "Shortlisted", value: campaign.shortlisted, tone: C.green, sub: `${campaign.interviewed} interviewed` },
                    ].map((item) => (
                      <div key={item.label} style={{ background: "rgba(255,250,242,0.72)", border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 13px" }}>
                        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.inkFaint }}>{item.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: item.tone, fontFamily: "'DM Serif Display', serif", marginTop: 6 }}>{item.value}</div>
                        <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 4 }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <StatusDot status={campaign.status} />

                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.inkWhite, fontFamily: "'DM Serif Display', serif" }}>
                      {campaign.applicants}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.inkFaint }}>total applicants</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.green, fontFamily: "'DM Serif Display', serif" }}>
                      {campaign.shortlisted}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.inkFaint }}>
                      {campaign.interviewed} interviewed
                    </div>
                  </div>

                  <div style={{ fontSize: 12.5, color: C.inkMuted }}>
                    {campaign.language} · {campaign.accessType}
                  </div>
                </>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveActionMenuId(activeActionMenuId === campaign.id ? null : campaign.id);
                  }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    border: `1px solid ${activeActionMenuId === campaign.id ? C.goldBorder : C.line}`,
                    background: activeActionMenuId === campaign.id ? C.goldDim : "rgba(255,250,242,0.65)",
                    color: activeActionMenuId === campaign.id ? C.gold : C.inkMuted,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (activeActionMenuId !== campaign.id) {
                      e.currentTarget.style.borderColor = C.goldBorder;
                      e.currentTarget.style.background = C.goldDim;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeActionMenuId !== campaign.id) {
                      e.currentTarget.style.borderColor = C.line;
                      e.currentTarget.style.background = "rgba(255,250,242,0.65)";
                    }
                  }}
                >
                  <MoreHorizontal size={18} />
                </button>

                {activeActionMenuId === campaign.id && (
                  <>
                    <div
                      onClick={(e) => { e.stopPropagation(); setActiveActionMenuId(null); }}
                      style={{ position: "fixed", inset: 0, zIndex: 1000 }}
                    />
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      zIndex: 1001,
                      minWidth: 220,
                      background: "rgba(255, 255, 255, 0.98)",
                      backdropFilter: "blur(25px) saturate(180%)",
                      border: "1px solid rgba(184, 145, 90, 0.25)",
                      borderRadius: 18,
                      padding: "10px",
                      boxShadow: "0 20px 50px rgba(10, 18, 32, 0.22)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}>
                      {[
                        { id: "EDIT", label: "Edit Campaign", onClick: () => console.log("Edit") },
                        { id: "DUP", label: "Duplicate", onClick: () => console.log("Duplicate") },
                        {
                          id: "SHR", label: "Share Campaign", onClick: () => {
                            navigator?.clipboard?.writeText(campaign.intakeCode);
                            alert("Intake code copied to clipboard!");
                          }
                        },
                        { id: "AI", label: "Consultation Session", onClick: () => console.log("AI") },
                        { id: "PDF", label: "Download Report", onClick: () => console.log("PDF") },
                        { id: "DEL", label: "Delete Campaign", color: "#d94f6b", onClick: () => console.log("Delete") },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onClick();
                            setActiveActionMenuId(null);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "11px 14px",
                            borderRadius: 12,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = item.color ? `${item.color}15` : "rgba(184, 145, 90, 0.08)";
                            e.currentTarget.style.transform = "translateX(4px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          <span style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            color: item.color || "rgba(28, 20, 9, 0.5)",
                            width: 38,
                            flexShrink: 0,
                            fontFamily: "'Sora', sans-serif"
                          }}>
                            {item.id}
                          </span>
                          <span style={{
                            fontSize: 13.5,
                            fontWeight: 500,
                            color: item.color || C.inkSoft,
                            fontFamily: "'Sora', sans-serif"
                          }}>
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {!campaignPagination.pageItems.length && (
          <div style={{ padding: "34px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 18, color: C.inkWhite, fontFamily: "'DM Serif Display', serif" }}>
              No campaigns found
            </div>
            <div style={{ fontSize: 13, color: C.inkMuted, marginTop: 8 }}>
              Try a different keyword or status filter.
            </div>
          </div>
        )}
      </div>

      <DashboardTablePagination
        page={campaignPagination.currentPage}
        totalPages={campaignPagination.totalPages}
        startIndex={campaignPagination.startIndex}
        endIndex={campaignPagination.endIndex}
        totalItems={filteredCampaigns.length}
        itemLabel="campaigns"
        onPageChange={setCampaignPage}
      />
    </section>
  );
};

const CampaignDetail = ({ campaign, onClose, modal = false, closeRef, isMobile = false, isTablet = false }) => {
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    setTab("overview");
  }, [campaign?.id]);

  const funnelData = useMemo(() => {
    const applicants = Math.max(campaign?.applicants || 0, 1);
    const invited = Math.max(Math.round(applicants * 0.58), campaign?.interviewed || 0);
    const interviewed = campaign?.interviewed || 0;
    const shortlisted = campaign?.shortlisted || 0;

    return [
      { label: "CV Submitted", value: applicants, pct: 100, color: C.blue },
      { label: "Invited", value: invited, pct: Math.round((invited / applicants) * 100), color: C.gold },
      { label: "Interviewed", value: interviewed, pct: Math.round((interviewed / applicants) * 100), color: C.yellow },
      { label: "Shortlisted", value: shortlisted, pct: Math.round((shortlisted / applicants) * 100), color: C.green },
    ];
  }, [campaign]);

  if (!campaign) return null;

  const content = (
    <aside style={{
      background: "rgba(255, 250, 242, 0.86)",
      border: `1px solid ${C.line}`,
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: "0 8px 28px rgba(184,145,90,0.10)",
      backdropFilter: "blur(16px)",
      position: modal ? "relative" : "sticky",
      top: modal ? undefined : 88,
    }}>
      <div style={{ padding: "18px 18px 16px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 8 }}>
              Campaign Detail
            </div>
            <div style={{ fontSize: 24, color: C.inkWhite, fontFamily: "'DM Serif Display', serif", lineHeight: 1.05 }}>
              {campaign.title}
            </div>
            <div style={{ fontSize: 13, color: C.inkMuted, marginTop: 6 }}>
              {campaign.company} · {campaign.code}
            </div>

            {isMobile && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
                {[
                  { label: "Campaign Created", value: campaign.created },
                  { label: "CV Intake Ends", value: campaign.cvEnd || "No end date" },
                  { label: "Interview Window Ends", value: campaign.interviewEnd || "No end date" },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.inkFaint }}>{item.label}</div>
                    <div style={{ fontSize: 11.5, color: C.inkWhite, fontWeight: 500, marginTop: 2 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isMobile && (
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 9, paddingRight: 10 }}>
              {[
                { label: "Campaign Created", value: campaign.created },
                { label: "CV Intake Ends", value: campaign.cvEnd || "No end date" },
                { label: "Interview Window Ends", value: campaign.interviewEnd || "No end date" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkFaint }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: C.inkWhite, fontWeight: 500, marginTop: 1 }}>{item.value}</div>
                </div>
              ))}
            </div>
          )}

          <IconBtn title="Close details" onClick={onClose} buttonRef={modal ? closeRef : undefined}>
            <X size={15} />
          </IconBtn>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <StatusDot status={campaign.status} />
          <Tag label={campaign.accessType === "Invite only" ? "Stage 2" : "General"} />
          <span style={{ fontSize: 12, color: C.inkFaint }}>Intake code {campaign.intakeCode}</span>
        </div>
      </div>

      <div style={{ padding: isMobile ? 14 : 16, display: "flex", flexDirection: "column", gap: 16, maxHeight: "calc(100vh - 130px)", overflow: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 10 }}>
          {[
            { label: "Applicants", value: campaign.applicants, color: C.blue },
            { label: "Interviewed", value: campaign.interviewed, color: C.yellow },
            { label: "Shortlisted", value: campaign.shortlisted, color: C.green },
            { label: "Language", value: campaign.language, color: C.gold },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: "rgba(255,250,242,0.70)",
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: "12px 13px",
            }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.inkFaint }}>
                {label}
              </div>
              <div style={{ fontSize: 26, color, fontFamily: "'DM Serif Display', serif", lineHeight: 1, marginTop: 8 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { id: "overview", label: "Overview", icon: Layers, theme: { base: C.blue, border: "rgba(58,123,213,0.45)", bg1: C.blueDim, bg2: "rgba(58,123,213,0.02)", hover: "rgba(58,123,213,0.08)", shadow: "rgba(58,123,213,0.22)" } },
            { id: "cv", label: "CV Results", icon: FileText, theme: { base: C.goldBright, border: C.goldBorderHot, bg1: C.goldDim, bg2: "rgba(184,145,90,0.04)", hover: "rgba(184,145,90,0.10)", shadow: "rgba(184,145,90,0.20)" } },
            { id: "results", label: "Results", icon: Award, theme: { base: C.green, border: "rgba(45,158,117,0.45)", bg1: C.greenDim, bg2: "rgba(45,158,117,0.02)", hover: "rgba(45,158,117,0.08)", shadow: "rgba(45,158,117,0.22)" } },
          ].map(({ id, label, icon: Icon, theme: t }) => {
            const active = tab === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                style={{
                  height: 84,
                  borderRadius: 18,
                  border: `1px solid ${active ? t.border : `rgba(${id === "overview" ? "58,123,213" : id === "cv" ? "184,145,90" : "45,158,117"}, 0.22)`}`,
                  background: active
                    ? `linear-gradient(135deg, ${t.bg1}, ${t.bg2})`
                    : `rgba(${id === "overview" ? "58,123,213" : id === "cv" ? "184,145,90" : "45,158,117"}, 0.10)`,
                  color: active ? C.inkWhite : `rgba(${id === "overview" ? "58,123,213" : id === "cv" ? "184,145,90" : "45,158,117"}, 0.95)`,
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontWeight: 700,
                  fontFamily: "'Sora', sans-serif",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: active
                    ? `0 12px 28px ${t.shadow}`
                    : `0 2px 8px rgba(${id === "overview" ? "58,123,213" : id === "cv" ? "184,145,90" : "45,158,117"}, 0.06)`,
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={!active ? e => {
                  e.currentTarget.style.background = t.hover;
                  e.currentTarget.style.borderColor = t.border;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 10px 20px ${t.shadow}`;
                  e.currentTarget.style.color = C.inkWhite;
                } : undefined}
                onMouseLeave={!active ? e => {
                  e.currentTarget.style.background = `rgba(${id === "overview" ? "58,123,213" : id === "cv" ? "184,145,90" : "45,158,117"}, 0.10)`;
                  e.currentTarget.style.borderColor = `rgba(${id === "overview" ? "58,123,213" : id === "cv" ? "184,145,90" : "45,158,117"}, 0.22)`;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 2px 8px rgba(${id === "overview" ? "58,123,213" : id === "cv" ? "184,145,90" : "45,158,117"}, 0.06)`;
                  e.currentTarget.style.color = `rgba(${id === "overview" ? "58,123,213" : id === "cv" ? "184,145,90" : "45,158,117"}, 0.95)`;

                } : undefined}
              >
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: active ? "#fff" : "rgba(255,255,255,0.5)",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: active ? `0 4px 12px ${t.shadow}` : "none",
                  transition: "all 0.2s"
                }}>
                  <Icon size={20} color={t.base} style={{ opacity: active ? 1 : 0.7 }} />
                </div>
                {label}
              </button>
            );
          })}
        </div>

        {tab === "overview" ? (
          <>
            <div style={{ background: "rgba(255,250,242,0.70)", border: `1px solid ${C.line}`, borderRadius: 16, padding: 14 }}>
              <SectionLabel>Funnel Performance</SectionLabel>
              <AxisBarChart data={funnelData} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: 14 }}>
              <div style={{ background: "rgba(255,250,242,0.76)", border: `1px solid ${C.line}`, borderRadius: 18, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.inkFaint }}>CV Submission</div>
                    <div style={{ fontSize: 22, color: C.blue, fontWeight: 700, marginTop: 6 }}>Enabled</div>
                  </div>
                  <button type="button" onClick={() => navigate("/interview", { state: { editMode: true } })} style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: "rgba(255,250,242,0.98)", color: C.inkMuted, height: 36, padding: "0 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkMuted; }}>
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.6 }}>
                  Ends: {campaign.cvEnd || "No end date"}
                </div>
              </div>

              <div style={{ background: "rgba(255,250,242,0.76)", border: `1px solid ${C.line}`, borderRadius: 18, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.inkFaint }}>Interview</div>
                    <div style={{ fontSize: 22, color: C.yellow, fontWeight: 700, marginTop: 6 }}>Enabled</div>
                  </div>
                  <button type="button" onClick={() => navigate("/interview", { state: { editMode: true } })} style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: "rgba(255,250,242,0.98)", color: C.inkMuted, height: 36, padding: "0 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkMuted; }}>
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.6 }}>
                  Ends: {campaign.interviewEnd || "No end date"}
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(255,250,242,0.70)", border: `1px solid ${C.line}`, borderRadius: 16, padding: 14, display: "grid", gap: 14 }}>
              <SectionLabel>Campaign Links</SectionLabel>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { label: "CV submission link", value: `https://mawahib.ai/apply/${campaign.intakeCode}` },
                  { label: "Avatar interview link", value: `https://mawahib.ai/interview?code=${campaign.code}` },
                ].map((item) => (
                  <div key={item.label} style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.inkFaint }}>{item.label}</div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <input readOnly value={item.value} style={{ flex: 1, minWidth: 0, borderRadius: 12, border: `1px solid ${C.line}`, background: "rgba(255,250,242,0.98)", color: C.inkSoft, padding: "10px 12px", fontSize: 13, fontFamily: "'Sora', sans-serif" }} />
                      <button type="button" style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "0 16px", height: 40, background: "rgba(255,250,242,0.98)", color: C.blue, fontWeight: 700, cursor: "pointer" }}>
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { label: "Edit end date" },
                  { label: "Extend 7d" },
                  { label: "Extend 30d" },
                ].map((action) => (
                  <button key={action.label} type="button" style={{ flex: "1 1 auto", minWidth: 120, borderRadius: 12, border: `1px solid ${C.line}`, background: "rgba(255,250,242,0.98)", color: C.inkMuted, height: 40, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg,rgba(184,145,90,0.10),rgba(184,145,90,0.04))",
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 16,
              padding: "14px 15px",
            }}>
              <SectionLabel>Hiring Notes</SectionLabel>
              <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.75 }}>
                {campaign.shortlisted} candidates are shortlist-ready from {campaign.applicants} applicants. Focus next on interviewer calibration and timely follow-up to preserve momentum through the final decision stage.
              </div>
            </div>
          </>
        ) : tab === "cv" ? (
          <DashboardCVResultsPanel campaign={campaign} candidates={CV_RESULTS} theme={C} />
        ) : (
          <InterviewResults inline />
        )}
      </div>
    </aside>
  );

  return modal ? (
    <div style={{ width: "100%", maxWidth: isMobile ? "100%" : isTablet ? 1200 : 1700, maxHeight: isMobile ? "calc(100vh - 20px)" : "calc(100vh - 36px)", margin: "0 auto" }}>
      {content}
    </div>
  ) : content;
};

const CampaignDetailModal = ({ campaign, onClose, isMobile = false, isTablet = false }) => {
  const closeRef = useRef(null);

  useModalLifecycle({ onClose, initialFocusRef: closeRef });

  if (!campaign) return null;

  return (
    <ModalBackdrop onClose={onClose} ariaLabel={`${campaign.title} details`} padding={isMobile ? 10 : isTablet ? 16 : 24}>
      <div style={{
        width: isMobile ? "100%" : isTablet ? "min(1200px, calc(100vw - 32px))" : "min(1700px, calc(100vw - 48px))",
        maxWidth: isMobile ? "100%" : isTablet ? 1200 : 1700,
        maxHeight: isMobile ? "calc(100vh - 20px)" : "calc(100vh - 48px)",
        overflow: "auto",
        borderRadius: isMobile ? 18 : 24,
        boxSizing: "border-box",
        margin: "0 auto",
      }}>
        <CampaignDetail campaign={campaign} onClose={onClose} modal closeRef={closeRef} isMobile={isMobile} isTablet={isTablet} />
      </div>
    </ModalBackdrop>
  );
};

const CreateModal = ({ onClose, onOpenInterviewPage, isMobile = false, isTablet = false }) => {
  const [campaignType, setCampaignType] = useState(CAMPAIGN_TYPES[0].id);
  const initialFocusRef = useRef(null);

  useModalLifecycle({ onClose, initialFocusRef });

  const selectedType = CAMPAIGN_TYPES.find((type) => type.id === campaignType) || CAMPAIGN_TYPES[0];

  return (
    <ModalBackdrop onClose={onClose} ariaLabel="Create campaign" padding={isMobile ? 10 : isTablet ? 16 : 24}>
      <div style={{
        width: isMobile ? "100%" : "min(820px, 100%)",
        maxHeight: isMobile ? "calc(100vh - 20px)" : "calc(100vh - 36px)",
        overflow: "auto",
        background: "rgba(249,245,239,0.98)",
        border: `1px solid ${C.lineStrong}`,
        borderRadius: isMobile ? 18 : 24,
        boxShadow: "0 18px 60px rgba(28,20,9,0.16)",
      }}>
        <div style={{
          padding: "20px 22px 16px",
          borderBottom: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 7 }}>
              Create Campaign
            </div>
            <div style={{ fontSize: 28, color: C.inkWhite, fontFamily: "'DM Serif Display', serif", lineHeight: 1.05 }}>
              Launch a new hiring workflow
            </div>
            <div style={{ fontSize: 13, color: C.inkMuted, marginTop: 8, maxWidth: 620 }}>
              This modal prepares the campaign structure and interview flow. The current page is a UI shell, so save closes the modal without persisting data yet.
            </div>
          </div>

          <IconBtn title="Close modal" onClick={onClose}>
            <X size={16} />
          </IconBtn>
        </div>

        <div style={{ padding: isMobile ? 16 : 22, display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.04em", marginBottom: 10 }}>Assessment Focus</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                {CAMPAIGN_TYPES.map(({ id, icon: Icon, label, desc, tag }) => {
                  const active = campaignType === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setCampaignType(id);
                        if (id === "first") {
                          onOpenInterviewPage?.();
                          onClose?.();
                        }
                      }}
                      style={{
                        padding: "12px 13px",
                        borderRadius: 14,
                        border: `1px solid ${active ? C.goldBorder : C.line}`,
                        background: active ? "rgba(184,145,90,0.12)" : "rgba(255,250,242,0.65)",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{
                            width: 30,
                            height: 30,
                            borderRadius: 10,
                            display: "grid",
                            placeItems: "center",
                            background: active ? C.goldDim : "rgba(184,145,90,0.06)",
                            color: active ? C.gold : C.inkMuted,
                          }}>
                            <Icon size={15} />
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.inkWhite }}>{label}</span>
                        </div>
                        <Tag label={tag} />
                      </div>
                      <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.55 }}>{desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        <div style={{
          padding: "16px 22px 20px",
          borderTop: `1px solid ${C.line}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 40,
              padding: "0 16px",
              borderRadius: 11,
              border: `1px solid ${C.line}`,
              background: "transparent",
              color: C.inkMuted,
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 700,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 40,
              padding: "0 18px",
              borderRadius: 11,
              border: "none",
              background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
              color: "#fff",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 700,
              fontFamily: "'Sora', sans-serif",
              boxShadow: "0 8px 24px rgba(184,145,90,0.22)",
            }}
          >
            Save Draft
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInterModal, setShowInterModal] = useState(false);
  const navigate = useNavigate();
  const { isMobile, isTablet } = useViewportState();

  const selectedCampaign = CAMPAIGNS.find(c => c.id === selectedId) || null;

  const handleOpenInterviewPage = () => {
    setShowModal(false);
    navigate("/interview");
  };

  const dashboardTotals = useMemo(() => ({
    campaigns: CAMPAIGNS.length,
    activeCampaigns: CAMPAIGNS.filter(c => c.status === "active").length,
    applicants: CAMPAIGNS.reduce((s, c) => s + c.applicants, 0),
    interviewed: CAMPAIGNS.reduce((s, c) => s + c.interviewed, 0),
    shortlisted: CAMPAIGNS.reduce((s, c) => s + c.shortlisted, 0),
  }), []);

  const interviewRate = Math.round((dashboardTotals.interviewed / Math.max(dashboardTotals.applicants, 1)) * 100);
  const shortlistRate = Math.round((dashboardTotals.shortlisted / Math.max(dashboardTotals.applicants, 1)) * 100);

  return (
    <>
      <FontLink />

      <main style={{
        minHeight: "100vh",
        background: C.bgDark,
        paddingTop: 80,
        padding: isMobile ? "76px 14px 32px" : "80px clamp(16px,3vw,40px) 48px",
        fontFamily: "'Sora', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1, letterSpacing: "-0.02em", margin: 0, color: C.gold }}>
              Hiring Campaigns
            </h1>
            <p style={{ fontSize: 14, color: C.inkMuted, marginTop: 8, marginBottom: 0 }}>Manage and track all your AI-powered interview campaigns.</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            height: 46, padding: "0 22px",
            background: `linear-gradient(135deg,${C.gold},${C.goldBright})`,
            border: "none", borderRadius: 13,
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Sora', sans-serif",
            boxShadow: `0 4px 15px rgba(184,145,90,0.28)`, transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px rgba(184,145,90,0.40)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 15px rgba(184,145,90,0.28)`; }}
          >
            <Plus size={17} strokeWidth={2.5} /> Create Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, minmax(0, 1fr))" : "repeat(4,1fr)", gap: 12 }}>
          {[
            { label: "Total Campaigns", value: String(dashboardTotals.campaigns), sub: `${dashboardTotals.activeCampaigns} active`, icon: FileText, color: C.blue },
            { label: "Total Applicants", value: String(dashboardTotals.applicants), sub: "Across all campaigns", icon: Users, color: C.gold },
            { label: "Interviewed", value: String(dashboardTotals.interviewed), sub: `${interviewRate}% of total`, icon: MessageSquare, color: C.green },
            { label: "Shortlisted", value: String(dashboardTotals.shortlisted), sub: `${shortlistRate}% of total`, icon: TrendingUp, color: C.yellow },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} style={{
              background: "rgba(255, 250, 242, 0.85)", border: `1px solid ${C.line}`,
              borderRadius: 18, padding: "18px 20px",
              display: "flex", alignItems: "center", gap: 14,
              backdropFilter: "blur(12px)",
              boxShadow: "0 2px 12px rgba(184,145,90,0.08)",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: `${color}18`, border: `1px solid ${color}38`,
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
        <div className="main-layout" style={{ minWidth: 0 }}>
          <CampaignTable onSelect={setSelectedId} selected={selectedId} onInterviewResults={() => setShowInterModal(true)} isMobile={isMobile} isTablet={isTablet} />
        </div>

        {/* Circular Dashboard Insights */}
        <DashboardCircularInsights campaign={CAMPAIGNS[0]} onCreateCampaign={() => setShowModal(true)} isMobile={isMobile} isTablet={isTablet} />
      </main>

      {selectedCampaign && <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedId(null)} isMobile={isMobile} isTablet={isTablet} />}
      {showModal && <CreateModal onClose={() => setShowModal(false)} onOpenInterviewPage={handleOpenInterviewPage} isMobile={isMobile} isTablet={isTablet} />}
      {showInterModal && <InterviewResults onClose={() => setShowInterModal(false)} />}
    </>
  );
}