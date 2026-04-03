import { useState, useMemo } from "react";
import {
  Search, Download, Mail, X, Eye, ChevronDown,
  ChevronUp, CheckSquare, Square,
  ArrowUpDown, FileText, Users, TrendingUp, Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// â”€â”€â”€ Design Tokens (same as Dashboard) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const C = {
  bgDark: "#080d1c",
  bgPanel: "rgba(11,17,34,0.88)",
  bgPanelSoft: "rgba(10,15,30,0.72)",
  bgCard: "rgba(8,12,24,0.82)",
  gold: "#b8955a",
  goldBright: "#f0c97a",
  inkSoft: "rgba(245,240,235,0.78)",
  inkMuted: "rgba(245,240,235,0.46)",
  line: "rgba(184,149,90,0.18)",
  lineStrong: "rgba(184,149,90,0.35)",
  blue: "#5f9eff",
  green: "#39c98f",
  greenDim: "rgba(57,201,143,0.12)",
  yellow: "#e3c466",
  red: "#ff6b6b",
  redDim: "rgba(255,107,107,0.1)",
};

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CANDIDATES = [
  {
    id: 1, name: "Ahmad Saleh", email: "ahmad.saleh@example.com", date: "30/03/26",
    cv: "Ahmad_Saleh_CV.pdf", status: "Pending", country: "Jordan", city: "Amman",
    phone: "+96279001122", score: 84, jdScore: 84, penalty: 0, overqualPenalty: 0,
    finalScore: 84, disqualified: false,
  },
  {
    id: 2, name: "Mona Haddad", email: "mona.haddad@example.com", date: "30/03/26",
    cv: "Mona_Haddad_CV.pdf", status: "Pending", country: "Jordan", city: "Amman",
    phone: "+962790001122", score: 73, jdScore: 73, penalty: 0, overqualPenalty: 0,
    finalScore: 73, disqualified: false,
  },
  {
    id: 3, name: "Yousef Nasser", email: "y.nasser@example.com", date: "30/03/26",
    cv: "Yousef_Nasser_CV.pdf", status: "Pending", country: "UAE", city: "Dubai",
    phone: "+971551112233", score: 66, jdScore: 66, penalty: 0, overqualPenalty: 0,
    finalScore: 66, disqualified: false,
  },
  {
    id: 4, name: "Sara Al-Mutairi", email: "sara.mutairi@example.com", date: "29/03/26",
    cv: "Sara_AlMutairi_CV.pdf", status: "Pending", country: "Saudi Arabia", city: "Jeddah",
    phone: "+966559998877", score: 91, jdScore: 91, penalty: 0, overqualPenalty: 0,
    finalScore: 91, disqualified: false,
  },
  {
    id: 5, name: "Omar Faris", email: "omar.faris@example.com", date: "29/03/26",
    cv: "Omar_Faris_CV.pdf", status: "Pending", country: "Egypt", city: "Cairo",
    phone: "+201001234567", score: 58, jdScore: 58, penalty: 0, overqualPenalty: 0,
    finalScore: 58, disqualified: false,
  },
  {
    id: 6, name: "Lina Mansour", email: "lina.mansour@example.com", date: "29/03/26",
    cv: "Lina_Mansour_CV.pdf", status: "Pending", country: "Palestine", city: "Ramallah",
    phone: "+970599123456", score: 77, jdScore: 77, penalty: 0, overqualPenalty: 0,
    finalScore: 77, disqualified: false,
  },
  {
    id: 7, name: "Khalid Mahmoud", email: "k.mahmoud@example.com", date: "28/03/26",
    cv: "Khalid_Mahmoud_CV.pdf", status: "Reviewed", country: "Kuwait", city: "Kuwait City",
    phone: "+96550001234", score: 45, jdScore: 45, penalty: 5, overqualPenalty: 0,
    finalScore: 40, disqualified: true,
  },
  {
    id: 8, name: "Reem Al-Dosari", email: "reem.dosari@example.com", date: "28/03/26",
    cv: "Reem_AlDosari_CV.pdf", status: "Shortlisted", country: "Bahrain", city: "Manama",
    phone: "+97333221100", score: 88, jdScore: 88, penalty: 0, overqualPenalty: 0,
    finalScore: 88, disqualified: false,
  },
];

// â”€â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GlobalStyles = ({ embedded = false }) => {
  const rootBackground = embedded
    ? "transparent"
    : `radial-gradient(ellipse 80vw 55vh at 100% -5%, rgba(184,149,90,0.11) 0%, transparent 55%),
       radial-gradient(ellipse 55vw 45vh at -5% 95%, rgba(95,158,255,0.06) 0%, transparent 50%),
       ${C.bgDark}`;

  return (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    ${embedded ? "" : `
    html, body { scrollbar-width: none; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
    `}

    .cv-root {
      min-height: ${embedded ? "auto" : "100vh"};
      background: ${rootBackground};
      color: #f5f0eb;
      font-family: 'Sora', sans-serif;
      padding: ${embedded ? "0" : "clamp(16px, 2.5vw, 32px)"};
    }

    .cv-shell {
      max-width: ${embedded ? "100%" : "1220px"};
      margin: 0 auto;
    }
    .cv-top {
      display: flex;
      flex-direction: column;
      align-items: ${embedded ? "flex-start" : "center"};
      text-align: ${embedded ? "left" : "center"};
      gap: 8px;
      margin-bottom: ${embedded ? "12px" : "14px"};
    }
    .cv-breadcrumb {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
      color: ${C.inkMuted};
    }
    .cv-crumb-link {
      border: none;
      background: none;
      color: ${C.blue};
      font: inherit;
      cursor: pointer;
      padding: 0;
    }
    .cv-top h1 {
      margin: 0;
      font-family: 'DM Serif Display', serif;
      font-size: clamp(2rem, 4.2vw, 2.8rem);
      line-height: 1;
      color: #fff;
    }
    .cv-desc {
      margin: ${embedded ? "2px 0 0" : "2px auto 0"};
      font-size: 13px;
      color: ${C.inkSoft};
      max-width: ${embedded ? "none" : "760px"};
    }

    /* â”€â”€ Summary Cards â”€â”€ */
    .cv-summary-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 18px;
    }
    .cv-summary-card {
      background: ${C.bgPanel};
      border: 1px solid ${C.line};
      border-radius: 20px;
      padding: 18px 20px;
      backdrop-filter: blur(16px);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      transition: border-color 0.2s ease;
    }
    .cv-summary-card:hover { border-color: ${C.lineStrong}; }
    .cv-summary-icon {
      width: 40px; height: 40px;
      border-radius: 11px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .cv-summary-val {
      font-family: 'DM Serif Display', serif;
      font-size: 2.4rem;
      font-weight: 400;
      color: #fff;
      line-height: 1;
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }
    .cv-summary-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: ${C.inkMuted};
      font-weight: 700;
    }

    /* â”€â”€ Filters Bar â”€â”€ */
    .cv-filters-bar {
      background: ${C.bgPanel};
      border: 1px solid ${C.line};
      border-radius: 20px;
      padding: 14px 18px;
      margin-bottom: 14px;
      backdrop-filter: blur(16px);
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .cv-search-wrap {
      position: relative;
      flex: 1;
      min-width: 200px;
    }
    .cv-search-wrap svg {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: ${C.inkMuted};
      pointer-events: none;
    }
    .cv-search {
      width: 100%;
      height: 40px;
      border-radius: 11px;
      border: 1px solid ${C.line};
      background: rgba(6,10,20,0.72);
      color: #f5f0eb;
      font-size: 13px;
      font-family: 'Sora', sans-serif;
      padding: 0 12px 0 38px;
      outline: none;
      transition: border-color 0.2s;
    }
    .cv-search:focus { border-color: rgba(184,149,90,0.45); }
    .cv-search::placeholder { color: ${C.inkMuted}; }
    .cv-filter-select {
      height: 40px;
      border-radius: 11px;
      border: 1px solid ${C.line};
      background: rgba(6,10,20,0.72);
      color: ${C.inkSoft};
      font-size: 13px;
      font-family: 'Sora', sans-serif;
      padding: 0 12px;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .cv-filter-select:focus { border-color: rgba(184,149,90,0.45); }
    .cv-filter-divider {
      width: 1px;
      height: 28px;
      background: ${C.line};
      flex-shrink: 0;
    }

    /* â”€â”€ Main Table Panel â”€â”€ */
    .cv-panel {
      background: ${C.bgPanel};
      border: 1px solid ${C.line};
      border-radius: 24px;
      backdrop-filter: blur(16px);
      box-shadow: ${embedded ? "none" : "0 16px 48px rgba(0,0,0,0.32)"};
      overflow: hidden;
    }
    .cv-panel-head {
      padding: 18px 20px 14px;
      border-bottom: 1px solid ${C.line};
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .cv-panel-title {
      font-family: 'DM Serif Display', serif;
      font-size: 1.4rem;
      font-weight: 400;
      color: #fff;
    }
    .cv-panel-meta {
      font-size: 12px;
      color: ${C.inkMuted};
      margin-top: 2px;
    }
    .cv-badge {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 3px 11px;
      font-size: 11.5px;
      font-weight: 700;
      white-space: nowrap;
    }
    .cv-badge-neutral {
      border: 1px solid ${C.line};
      background: rgba(255,255,255,0.04);
      color: ${C.inkMuted};
    }

    /* â”€â”€ Bulk Actions â”€â”€ */
    .cv-bulk-bar {
      padding: 10px 20px;
      background: rgba(95,158,255,0.07);
      border-bottom: 1px solid rgba(95,158,255,0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .cv-bulk-text {
      font-size: 13px;
      color: ${C.blue};
      font-weight: 600;
      flex: 1;
    }
    .cv-bulk-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 34px;
      padding: 0 13px;
      border-radius: 9px;
      font-size: 12px;
      font-weight: 700;
      font-family: 'Sora', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.05);
      color: ${C.inkSoft};
    }
    .cv-bulk-btn:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    .cv-bulk-btn-danger {
      border-color: rgba(255,107,107,0.3);
      background: rgba(255,107,107,0.07);
      color: ${C.red};
    }
    .cv-bulk-btn-danger:hover {
      background: rgba(255,107,107,0.15);
    }

    /* â”€â”€ Table â”€â”€ */
    .cv-table-scroll { overflow-x: auto; }
    .cv-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 1000px;
    }
    .cv-table thead tr th {
      padding: 12px 16px;
      text-align: left;
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: ${C.inkMuted};
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid ${C.line};
      white-space: nowrap;
      user-select: none;
    }
    .cv-table thead tr th.sortable { cursor: pointer; }
    .cv-table thead tr th.sortable:hover { color: ${C.inkSoft}; }
    .cv-th-inner {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .cv-table tbody tr td {
      padding: 0;
      border-bottom: 1px solid rgba(184,149,90,0.09);
      background: rgba(7,11,22,0.6);
      vertical-align: top;
      transition: background 0.15s ease;
    }
    .cv-table tbody tr:last-child td { border-bottom: none; }
    .cv-table tbody tr:hover td { background: rgba(184,149,90,0.05); }
    .cv-table tbody tr.cv-row-selected td { background: rgba(95,158,255,0.06); }
    .cv-table tbody tr.cv-row-selected td:first-child {
      box-shadow: inset 3px 0 0 ${C.blue};
    }
    .cv-td { padding: 16px; }

    /* â”€â”€ Candidate Cell â”€â”€ */
    .cv-candidate-name {
      font-size: 14.5px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.01em;
      margin-bottom: 3px;
    }
    .cv-candidate-email {
      font-size: 12px;
      color: ${C.inkMuted};
      margin-bottom: 2px;
    }
    .cv-candidate-date {
      font-size: 11px;
      color: rgba(245,240,235,0.3);
    }

    /* â”€â”€ CV Link â”€â”€ */
    .cv-file-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12.5px;
      color: ${C.blue};
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    .cv-file-link:hover { color: #8fbfff; }

    /* â”€â”€ Status Badge â”€â”€ */
    .cv-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      border-radius: 999px;
      padding: 5px 11px;
      font-size: 11.5px;
      font-weight: 700;
      white-space: nowrap;
    }
    .cv-status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .cv-status-pending {
      border: 1px solid rgba(227,196,102,0.35);
      background: rgba(227,196,102,0.08);
      color: ${C.yellow};
    }
    .cv-status-reviewed {
      border: 1px solid rgba(95,158,255,0.3);
      background: rgba(95,158,255,0.08);
      color: ${C.blue};
    }
    .cv-status-shortlisted {
      border: 1px solid rgba(57,201,143,0.35);
      background: rgba(57,201,143,0.08);
      color: ${C.green};
    }

    /* â”€â”€ Location Cell â”€â”€ */
    .cv-location-country {
      font-size: 13.5px;
      font-weight: 600;
      color: ${C.inkSoft};
      margin-bottom: 2px;
    }
    .cv-location-city {
      font-size: 12px;
      color: ${C.inkMuted};
    }

    /* â”€â”€ Phone â”€â”€ */
    .cv-phone {
      font-size: 13px;
      color: ${C.inkSoft};
      font-family: 'Sora', monospace;
      white-space: nowrap;
    }

    /* â”€â”€ Score Cell â”€â”€ */
    .cv-score-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cv-score-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      padding: 5px 14px;
      font-size: 13px;
      font-weight: 800;
      min-width: 72px;
      text-align: center;
      letter-spacing: -0.01em;
    }
    .cv-score-high {
      border: 1px solid rgba(57,201,143,0.45);
      background: rgba(57,201,143,0.1);
      color: #5df5b8;
    }
    .cv-score-mid {
      border: 1px solid rgba(240,201,122,0.45);
      background: rgba(240,201,122,0.08);
      color: ${C.goldBright};
    }
    .cv-score-low {
      border: 1px solid rgba(255,107,107,0.35);
      background: rgba(255,107,107,0.07);
      color: ${C.red};
    }
    .cv-score-threshold {
      font-size: 10.5px;
      color: ${C.inkMuted};
      letter-spacing: 0.04em;
    }

    /* â”€â”€ Score Breakdown â”€â”€ */
    .cv-score-breakdown {
      margin-top: 4px;
    }
    .cv-breakdown-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: ${C.inkMuted};
      line-height: 1.7;
    }
    .cv-breakdown-row strong {
      color: ${C.inkSoft};
      font-weight: 600;
    }

    /* â”€â”€ Suitable Badge â”€â”€ */
    .cv-suitable-yes {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 11.5px;
      font-weight: 800;
      border: 1px solid rgba(57,201,143,0.4);
      background: rgba(57,201,143,0.1);
      color: ${C.green};
      letter-spacing: 0.04em;
    }
    .cv-suitable-no {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 11.5px;
      font-weight: 800;
      border: 1px solid rgba(255,107,107,0.3);
      background: rgba(255,107,107,0.07);
      color: ${C.red};
      letter-spacing: 0.04em;
    }
    .cv-disq-tag {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${C.red};
      font-weight: 700;
      margin-top: 4px;
    }

    /* â”€â”€ Action Buttons â”€â”€ */
    .cv-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cv-action-btn {
      width: 34px; height: 34px;
      border-radius: 10px;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: all 0.18s ease;
      border: 1px solid ${C.line};
      background: rgba(255,255,255,0.03);
      color: ${C.inkMuted};
      flex-shrink: 0;
    }
    .cv-action-btn:hover {
      border-color: ${C.lineStrong};
      background: rgba(184,149,90,0.1);
      color: ${C.inkSoft};
      transform: translateY(-1px);
    }
    .cv-action-btn-mail:hover {
      border-color: rgba(57,201,143,0.4);
      background: rgba(57,201,143,0.1);
      color: ${C.green};
    }
    .cv-action-btn-reject:hover {
      border-color: rgba(255,107,107,0.3);
      background: rgba(255,107,107,0.08);
      color: ${C.red};
    }

    /* â”€â”€ Checkbox â”€â”€ */
    .cv-checkbox {
      background: none;
      border: none;
      cursor: pointer;
      color: ${C.inkMuted};
      padding: 0;
      display: grid;
      place-items: center;
      transition: color 0.15s;
    }
    .cv-checkbox:hover { color: ${C.blue}; }
    .cv-checkbox.checked { color: ${C.blue}; }

    /* â”€â”€ Expand Row â”€â”€ */
    .cv-expand-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: ${C.inkMuted};
      padding: 2px;
      display: grid;
      place-items: center;
      transition: color 0.15s;
    }
    .cv-expand-btn:hover { color: ${C.inkSoft}; }
    .cv-expanded-row td {
      padding: 0 !important;
      background: rgba(95,158,255,0.04) !important;
      border-bottom: 1px solid rgba(95,158,255,0.15) !important;
    }
    .cv-expanded-inner {
      padding: 16px 20px 16px 56px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 10px 24px;
    }
    .cv-expanded-item label {
      display: block;
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: ${C.inkMuted};
      font-weight: 700;
      margin-bottom: 3px;
    }
    .cv-expanded-item span {
      font-size: 13.5px;
      color: ${C.inkSoft};
      font-weight: 600;
    }

    /* â”€â”€ Demo Note â”€â”€ */
    .cv-demo-note {
      padding: 12px 20px;
      border-top: 1px solid ${C.line};
      font-size: 12px;
      color: ${C.inkMuted};
      font-family: monospace;
      background: rgba(255,255,255,0.01);
    }
    .cv-demo-note code {
      color: ${C.goldBright};
      background: rgba(240,201,122,0.1);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 11px;
    }

    /* â”€â”€ Responsive â”€â”€ */
    @media (max-width: 1100px) {
      .cv-summary-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 700px) {
      .cv-summary-row { grid-template-columns: 1fr 1fr; }
      .cv-filters-bar { gap: 8px; }
      .cv-search-wrap { min-width: 100%; }
    }
    @media (max-width: 480px) {
      .cv-summary-row { grid-template-columns: 1fr; }
    }
  `}</style>
  );
};

// â”€â”€â”€ Score color helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function scoreClass(s) {
  if (s >= 75) return "cv-score-high";
  if (s >= 50) return "cv-score-mid";
  return "cv-score-low";
}

function statusClass(s) {
  if (s === "Shortlisted") return "cv-status-shortlisted";
  if (s === "Reviewed") return "cv-status-reviewed";
  return "cv-status-pending";
}

function statusDotColor(s) {
  if (s === "Shortlisted") return C.green;
  if (s === "Reviewed") return C.blue;
  return C.yellow;
}

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function CVResults({ embedded = false }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [sortField, setSortField] = useState("score");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(new Set());
  const [expanded, setExpanded] = useState(new Set());

  const countries = useMemo(
    () => ["All", ...Array.from(new Set(CANDIDATES.map((c) => c.country)))],
    []
  );

  const filtered = useMemo(() => {
    let list = [...CANDIDATES];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") list = list.filter((c) => c.status === statusFilter);
    if (countryFilter !== "All") list = list.filter((c) => c.country === countryFilter);
    list.sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [search, statusFilter, countryFilter, sortField, sortDir]);

  const suitable = filtered.filter((c) => !c.disqualified && c.finalScore >= 50);
  const avgScore = filtered.length
    ? Math.round(filtered.reduce((s, c) => s + c.finalScore, 0) / filtered.length)
    : 0;

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () =>
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((c) => c.id)));

  const toggleExpand = (id) =>
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const SortIcon = ({ field }) => (
    <span style={{ opacity: sortField === field ? 1 : 0.3, display: "inline-flex" }}>
      <ArrowUpDown size={11} />
    </span>
  );

  return (
    <>
      <GlobalStyles embedded={embedded} />
      <div className="cv-root">
        <div className="cv-shell">
          <header className="cv-top">
            {!embedded && (
              <div className="cv-breadcrumb">
                <button type="button" className="cv-crumb-link" onClick={() => navigate("/dashboard")}>Dashboard</button>
                <span>/</span>
                <span>CvResults</span>
              </div>
            )}
            <h1>Resume Results</h1>
            <p className="cv-desc">Review submitted CVs, compare scores, and shortlist the right candidates.</p>
          </header>

          {/* â”€â”€ Summary Cards â”€â”€ */}
          <div className="cv-summary-row">
          <div className="cv-summary-card">
            <div>
              <div className="cv-summary-val">{CANDIDATES.length}</div>
              <div className="cv-summary-label">Total Submitted</div>
            </div>
            <div className="cv-summary-icon" style={{ background: "rgba(95,158,255,0.12)", border: "1px solid rgba(95,158,255,0.2)" }}>
              <Users size={19} color={C.blue} />
            </div>
          </div>
          <div className="cv-summary-card">
            <div>
              <div className="cv-summary-val" style={{ color: "#5df5b8" }}>{suitable.length}</div>
              <div className="cv-summary-label">Suitable</div>
            </div>
            <div className="cv-summary-icon" style={{ background: "rgba(57,201,143,0.1)", border: "1px solid rgba(57,201,143,0.22)" }}>
              <Award size={19} color={C.green} />
            </div>
          </div>
          <div className="cv-summary-card">
            <div>
              <div className="cv-summary-val" style={{ color: C.goldBright }}>{avgScore}</div>
              <div className="cv-summary-label">Avg. Final Score</div>
            </div>
            <div className="cv-summary-icon" style={{ background: "rgba(184,149,90,0.1)", border: "1px solid rgba(184,149,90,0.25)" }}>
              <TrendingUp size={19} color={C.goldBright} />
            </div>
          </div>
          <div className="cv-summary-card">
            <div>
              <div className="cv-summary-val">{filtered.filter((c) => c.status === "Pending").length}</div>
              <div className="cv-summary-label">Pending Review</div>
            </div>
            <div className="cv-summary-icon" style={{ background: "rgba(227,196,102,0.08)", border: "1px solid rgba(227,196,102,0.2)" }}>
              <FileText size={19} color={C.yellow} />
            </div>
          </div>
        </div>

        {/* â”€â”€ Filters Bar â”€â”€ */}
        <div className="cv-filters-bar">
          <div className="cv-search-wrap">
            <Search size={14} />
            <input
              className="cv-search"
              placeholder="Search by name, email, country!"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="cv-filter-divider" />
          <select
            className="cv-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option>Pending</option>
            <option>Reviewed</option>
            <option>Shortlisted</option>
          </select>
          <select
            className="cv-filter-select"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="cv-filter-select"
            value={`${sortField}-${sortDir}`}
            onChange={(e) => {
              const [f, d] = e.target.value.split("-");
              setSortField(f);
              setSortDir(d);
            }}
          >
            <option value="score-desc">Score: High to Low</option>
            <option value="score-asc">Score: Low to High</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="date-desc">Date: Newest</option>
          </select>
        </div>

        {/* â”€â”€ Table Panel â”€â”€ */}
        <div className="cv-panel">
          <div className="cv-panel-head">
            <div>
              <div className="cv-panel-title">CV Submissions</div>
              <div className="cv-panel-meta">
                Showing {filtered.length} of {CANDIDATES.length} candidates Threshold 50
              </div>
            </div>
            <span className="cv-badge cv-badge-neutral">
              {suitable.length} suitable
            </span>
          </div>

          {/* Bulk bar */}
          {selected.size > 0 && (
            <div className="cv-bulk-bar">
              <span className="cv-bulk-text">{selected.size} selected</span>
              <button className="cv-bulk-btn">
                <Mail size={13} /> Send Invite
              </button>
              <button className="cv-bulk-btn">
                <Download size={13} /> Export
              </button>
              <button className="cv-bulk-btn cv-bulk-btn-danger">
                <X size={13} /> Reject
              </button>
            </div>
          )}

          <div className="cv-table-scroll">
            <table className="cv-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>
                    <button
                      className={`cv-checkbox ${selected.size === filtered.length && filtered.length > 0 ? "checked" : ""}`}
                      onClick={toggleAll}
                      aria-label="Select all"
                    >
                      {selected.size === filtered.length && filtered.length > 0
                        ? <CheckSquare size={16} />
                        : <Square size={16} />}
                    </button>
                  </th>
                  <th style={{ width: 22 }} />
                  <th className="sortable" onClick={() => toggleSort("name")}>
                    <span className="cv-th-inner">Candidate <SortIcon field="name" /></span>
                  </th>
                  <th>CV File</th>
                  <th>Status</th>
                  <th className="sortable" onClick={() => toggleSort("country")}>
                    <span className="cv-th-inner">Location <SortIcon field="country" /></span>
                  </th>
                  <th>Phone</th>
                  <th className="sortable" onClick={() => toggleSort("finalScore")}>
                    <span className="cv-th-inner">Score <SortIcon field="finalScore" /></span>
                  </th>
                  <th>Suitable</th>
                  <th style={{ width: 110 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <>
                    <tr
                      key={c.id}
                      className={selected.has(c.id) ? "cv-row-selected" : ""}
                    >
                      {/* Checkbox */}
                      <td>
                        <div className="cv-td" style={{ paddingRight: 4 }}>
                          <button
                            className={`cv-checkbox ${selected.has(c.id) ? "checked" : ""}`}
                            onClick={() => toggleSelect(c.id)}
                            aria-label={`Select ${c.name}`}
                          >
                            {selected.has(c.id)
                              ? <CheckSquare size={15} />
                              : <Square size={15} />}
                          </button>
                        </div>
                      </td>

                      {/* Expand */}
                      <td>
                        <div className="cv-td" style={{ paddingLeft: 4, paddingRight: 4 }}>
                          <button
                            className="cv-expand-btn"
                            onClick={() => toggleExpand(c.id)}
                            aria-label="Expand row"
                          >
                            {expanded.has(c.id)
                              ? <ChevronUp size={14} />
                              : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </td>

                      {/* Candidate */}
                      <td>
                        <div className="cv-td">
                          <div className="cv-candidate-name">{c.name}</div>
                          <div className="cv-candidate-email">{c.email}</div>
                          <div className="cv-candidate-date">{c.date}</div>
                        </div>
                      </td>

                      {/* CV */}
                      <td>
                        <div className="cv-td">
                          <a href={`/demo/cv/${c.cv}`} className="cv-file-link" target="_blank" rel="noreferrer">
                            <FileText size={13} />
                            {c.cv}
                          </a>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <div className="cv-td">
                          <span className={`cv-status ${statusClass(c.status)}`}>
                            <span className="cv-status-dot" style={{ background: statusDotColor(c.status) }} />
                            {c.status}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td>
                        <div className="cv-td">
                          <div className="cv-location-country">{c.country}</div>
                          <div className="cv-location-city">{c.city}</div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td>
                        <div className="cv-td">
                          <span className="cv-phone">{c.phone}</span>
                        </div>
                      </td>

                      {/* Score */}
                      <td>
                        <div className="cv-td">
                          <div className="cv-score-wrap">
                            <span className={`cv-score-badge ${scoreClass(c.finalScore)}`}>
                              {c.finalScore}/100
                            </span>
                            <div className="cv-score-threshold">Score â‰¥ 50</div>
                            <div className="cv-score-breakdown">
                              <div className="cv-breakdown-row">
                                <span>JD Score</span>
                                <strong>{c.jdScore}</strong>
                              </div>
                              <div className="cv-breakdown-row">
                                <span>Penalty</span>
                                <strong>{c.penalty}</strong>
                              </div>
                              <div className="cv-breakdown-row">
                                <span>Overqual.</span>
                                <strong>{c.overqualPenalty}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Suitable */}
                      <td>
                        <div className="cv-td">
                          {c.disqualified ? (
                            <div>
                              <span className="cv-suitable-no">NO</span>
                              <div className="cv-disq-tag">Disqualified</div>
                            </div>
                          ) : (
                            <span className={c.finalScore >= 50 ? "cv-suitable-yes" : "cv-suitable-no"}>
                              {c.finalScore >= 50 ? "YES" : "NO"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="cv-td">
                          <div className="cv-actions">
                            <button className="cv-action-btn" title="View details">
                              <Eye size={15} />
                            </button>
                            <button className="cv-action-btn cv-action-btn-mail" title="Send email">
                              <Mail size={15} />
                            </button>
                            <button className="cv-action-btn cv-action-btn-reject" title="Reject">
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expanded.has(c.id) && (
                      <tr key={`${c.id}-exp`} className="cv-expanded-row">
                        <td colSpan={10}>
                          <div className="cv-expanded-inner">
                            <div className="cv-expanded-item">
                              <label>Full Name</label>
                              <span>{c.name}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>Email</label>
                              <span>{c.email}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>Phone</label>
                              <span>{c.phone}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>Country</label>
                              <span>{c.country}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>City</label>
                              <span>{c.city}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>Submitted</label>
                              <span>{c.date}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>JD Score</label>
                              <span>{c.jdScore}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>Penalty</label>
                              <span>{c.penalty}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>Overqual Penalty</label>
                              <span>{c.overqualPenalty}</span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>Final Score</label>
                              <span style={{ color: scoreClass(c.finalScore) === "cv-score-high" ? "#5df5b8" : scoreClass(c.finalScore) === "cv-score-mid" ? C.goldBright : C.red }}>
                                {c.finalScore}
                              </span>
                            </div>
                            <div className="cv-expanded-item">
                              <label>Disqualified</label>
                              <span style={{ color: c.disqualified ? C.red : C.green }}>
                                {c.disqualified ? "YES" : "NO"}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Demo note */}
          <div className="cv-demo-note">
            Demo note: CV links are placeholders (e.g. <code>/demo/cv/ahmad.pdf</code>). Add files under your backend/static to serve them.
          </div>
        </div>

        </div>
      </div>
    </>
  );
}
