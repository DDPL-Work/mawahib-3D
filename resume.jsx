import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Search, Download, Mail, X, Eye, ChevronDown,
  ChevronUp, CheckSquare, Square,
  ArrowUpDown, FileText, Users, TrendingUp, Award,
  MapPin, Phone, Briefcase, GraduationCap, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPaginationWindow, MIN_TABLE_ROWS, paginateItems } from "./tablePagination";

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
  {
    id: 9, name: "Huda Al-Shamri", email: "huda.shamri@example.com", date: "28/03/26",
    cv: "Huda_AlShamri_CV.pdf", status: "Reviewed", country: "Saudi Arabia", city: "Riyadh",
    phone: "+966561112233", score: 69, jdScore: 69, penalty: 0, overqualPenalty: 0,
    finalScore: 69, disqualified: false,
  },
  {
    id: 10, name: "Bilal Rahman", email: "bilal.rahman@example.com", date: "27/03/26",
    cv: "Bilal_Rahman_CV.pdf", status: "Pending", country: "Qatar", city: "Doha",
    phone: "+97455123456", score: 81, jdScore: 81, penalty: 0, overqualPenalty: 0,
    finalScore: 81, disqualified: false,
  },
  {
    id: 11, name: "Noura Kareem", email: "noura.kareem@example.com", date: "27/03/26",
    cv: "Noura_Kareem_CV.pdf", status: "Shortlisted", country: "UAE", city: "Abu Dhabi",
    phone: "+971501234567", score: 75, jdScore: 75, penalty: 0, overqualPenalty: 0,
    finalScore: 75, disqualified: false,
  },
  {
    id: 12, name: "Majed Salem", email: "majed.salem@example.com", date: "26/03/26",
    cv: "Majed_Salem_CV.pdf", status: "Reviewed", country: "Oman", city: "Muscat",
    phone: "+96891112233", score: 52, jdScore: 58, penalty: 4, overqualPenalty: 2,
    finalScore: 52, disqualified: false,
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
      grid-template-columns: ${embedded ? "repeat(2, 1fr)" : "repeat(4, 1fr)"};
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
      min-width: ${embedded ? "100%" : "1000px"};
    }
    .cv-table thead tr th {
      padding: ${embedded ? "10px 12px" : "12px 16px"};
      text-align: left;
      font-size: ${embedded ? "9.5px" : "10.5px"};
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
    .cv-table tbody tr.cv-row-clickable:focus-visible td {
      outline: 1px solid rgba(184,149,90,0.42);
      outline-offset: -1px;
      background: rgba(184,149,90,0.06);
    }
    .cv-td { padding: ${embedded ? "12px 10px" : "16px"}; }

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
    .cv-table-empty td {
      padding: 18px 16px;
      background: rgba(7,11,22,0.6);
      text-align: center;
      color: ${C.inkMuted};
      font-size: 13px;
    }
    .cv-table-placeholder td {
      padding: 0;
      background: rgba(7,11,22,0.6);
    }
    .cv-table-placeholder:hover td {
      background: rgba(7,11,22,0.6);
    }
    .cv-placeholder-td {
      padding: ${embedded ? "12px 10px" : "16px"};
    }
    .cv-placeholder-bar {
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.04);
    }
    .cv-pagination-footer {
      padding: 14px 18px;
      border-top: 1px solid ${C.line};
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      background: rgba(255,255,255,0.015);
    }
    .cv-pagination-summary {
      font-size: 12.5px;
      color: ${C.inkMuted};
    }
    .cv-pagination-controls {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .cv-pagination-btn {
      min-width: 36px;
      height: 34px;
      padding: 0 12px;
      border-radius: 9px;
      border: 1px solid ${C.line};
      background: transparent;
      color: ${C.inkMuted};
      font-size: 12.5px;
      font-weight: 600;
      font-family: 'Sora', sans-serif;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .cv-pagination-btn:hover {
      border-color: ${C.goldBright};
      background: rgba(184,149,90,0.12);
      color: #fff;
    }
    .cv-pagination-btn.active {
      border-color: rgba(184,149,90,0.45);
      background: rgba(184,149,90,0.14);
      color: ${C.goldBright};
    }
    .cv-pagination-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .cv-pagination-btn:disabled:hover {
      border-color: ${C.line};
      background: transparent;
      color: ${C.inkMuted};
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
  if (s === "Invited") return "cv-status-reviewed";
  if (s === "Rejected") return "cv-status-rejected";
  return "cv-status-pending";
}

function statusDotColor(s) {
  if (s === "Shortlisted") return C.green;
  if (s === "Invited") return C.blue;
  if (s === "Rejected") return C.red;
  return C.yellow;
}

function buildResumePreview(candidate) {
  const yearsOfExperience = Math.max(2, Math.round(candidate.finalScore / 14));
  const targetRole = candidate.finalScore >= 85
    ? "Senior B2B Sales Representative"
    : candidate.finalScore >= 70
      ? "B2B Sales Representative"
      : "Business Development Associate";
  const summary = `${candidate.name} is a ${candidate.city}-based commercial profile with ${yearsOfExperience}+ years of experience in outbound prospecting, account growth, and pipeline coordination. AI screening marked this candidate as ${candidate.disqualified ? "currently unsuitable" : "interview-ready"} with a final score of ${candidate.finalScore}/100 for the current ${targetRole.toLowerCase()} campaign.`;
  const strengths = [
    candidate.finalScore >= 80 ? "Enterprise pipeline management" : "Structured lead follow-up",
    candidate.jdScore >= 75 ? "Strong job-description fit" : "Transferable commercial foundation",
    candidate.status === "Shortlisted" ? "Decision-ready profile" : "Coachability and growth potential",
    candidate.country === "UAE" || candidate.country === "Saudi Arabia" ? "GCC market familiarity" : "Regional customer communication",
  ];

  return {
    targetRole,
    summary,
    strengths,
    experience: [
      {
        title: targetRole,
        company: `${candidate.city} Growth Partners`,
        period: `2023 - Present`,
        bullets: [
          `Managed a live pipeline of ${Math.max(18, Math.round(candidate.finalScore / 3))}+ opportunities with weekly forecast updates.`,
          `Collaborated with marketing and operations to improve qualification accuracy and response times.`,
        ],
      },
      {
        title: "Sales Executive",
        company: `${candidate.country} Commercial Group`,
        period: `2020 - 2023`,
        bullets: [
          "Handled outbound outreach, discovery calls, and CRM hygiene across mid-market accounts.",
          `Supported proposal creation and follow-up sequencing for ${candidate.city}-region prospects.`,
        ],
      },
    ],
    education: {
      degree: candidate.finalScore >= 75 ? "Bachelor of Business Administration" : "Bachelor of Marketing",
      institution: `${candidate.country} National University`,
      year: "2019",
    },
    skills: [
      "Pipeline management",
      "Client communication",
      "CRM discipline",
      "Lead qualification",
      "Discovery calls",
      candidate.finalScore >= 80 ? "Enterprise closing support" : "Sales coordination",
    ],
    languages: candidate.country === "Jordan" || candidate.country === "Palestine"
      ? ["Arabic", "English"]
      : ["English", "Arabic"],
  };
}

const ResumePreviewModal = ({ candidate, embedded, onClose }) => {
  if (!candidate) return null;

  const preview = buildResumePreview(candidate);
  const resumeUrl = `/demo/cv/${encodeURIComponent(candidate.cv)}`;
  const suitabilityTone = candidate.disqualified
    ? { bg: C.redDim, border: "rgba(255,107,107,0.24)", text: C.red, label: "Needs Attention" }
    : candidate.finalScore >= 75
      ? { bg: C.greenDim, border: "rgba(57,201,143,0.24)", text: C.green, label: "Strong Fit" }
      : { bg: "rgba(240,201,122,0.09)", border: "rgba(240,201,122,0.24)", text: C.goldBright, label: "Review Recommended" };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Resume preview for ${candidate.name}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background: "linear-gradient(270deg, rgba(4,7,16,0.86) 0%, rgba(4,7,16,0.48) 34%, rgba(4,7,16,0.08) 100%)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: embedded ? "16px" : "20px",
      }}
    >
      <section
        onClick={(event) => event.stopPropagation()}
        style={{
          width: embedded ? "min(720px, calc(100vw - 32px))" : "min(780px, calc(100vw - 40px))",
          height: "min(88vh, 920px)",
          background: "linear-gradient(180deg, rgba(10,15,28,0.995), rgba(7,11,22,0.99))",
          border: `1px solid ${C.lineStrong}`,
          borderRadius: 24,
          boxShadow: "-20px 24px 80px rgba(0,0,0,0.46)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{
          padding: "18px 20px 16px",
          borderBottom: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkMuted, marginBottom: 8 }}>
              Resume Preview
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", color: "#fff", lineHeight: 1.05, marginBottom: 6 }}>
              {candidate.name}
            </div>
            <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10 }}>{preview.targetRole}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 11px",
                borderRadius: 999,
                background: suitabilityTone.bg,
                border: `1px solid ${suitabilityTone.border}`,
                color: suitabilityTone.text,
                fontSize: 11.5,
                fontWeight: 700,
              }}>
                <Sparkles size={12} />
                {suitabilityTone.label}
              </span>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 11px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.line}`,
                color: C.inkMuted,
                fontSize: 11.5,
                fontWeight: 700,
              }}>
                <FileText size={12} />
                {candidate.cv}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close resume preview"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${C.line}`,
              background: "rgba(255,255,255,0.03)",
              color: C.inkMuted,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            borderRadius: 20,
            border: `1px solid ${C.line}`,
            background: "rgba(255,255,255,0.02)",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontSize: 11, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.13em", fontWeight: 700, marginBottom: 4 }}>
                  Uploaded Resume
                </div>
                <div style={{ fontSize: 13, color: C.inkSoft }}>{candidate.cv}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    height: 34,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: `1px solid ${C.line}`,
                    background: "rgba(255,255,255,0.03)",
                    color: C.inkSoft,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    textDecoration: "none",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  <Eye size={14} />
                  Open File
                </a>
                <a
                  href={resumeUrl}
                  download={candidate.cv}
                  style={{
                    height: 34,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: `1px solid ${C.line}`,
                    background: "rgba(184,149,90,0.10)",
                    color: C.goldBright,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    textDecoration: "none",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            </div>

            <div style={{
              height: embedded ? 360 : 410,
              background: "linear-gradient(180deg, rgba(8,12,24,0.95), rgba(5,8,18,0.95))",
            }}>
              <iframe
                title={`Uploaded resume for ${candidate.name}`}
                src={resumeUrl}
                style={{ width: "100%", height: "100%", border: "none", display: "block", background: "#0b1120" }}
              />
            </div>

            <div style={{
              padding: "10px 14px",
              borderTop: `1px solid ${C.line}`,
              background: "rgba(255,255,255,0.015)",
              fontSize: 12,
              color: C.inkMuted,
              lineHeight: 1.6,
            }}>
              The uploaded resume is rendered here when the document is available at <code style={{ color: C.goldBright }}>{resumeUrl}</code>. The profile summary below stays available as a fallback review view.
            </div>
          </div>

          <div style={{
            borderRadius: 20,
            border: `1px solid ${C.line}`,
            background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))",
            padding: 18,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.55rem", color: "#fff", marginBottom: 4 }}>
                  {candidate.name}
                </div>
                <div style={{ fontSize: 13, color: C.inkSoft }}>{preview.targetRole}</div>
              </div>
              <div style={{
                minWidth: 92,
                padding: "10px 12px",
                borderRadius: 14,
                border: `1px solid ${scoreClass(candidate.finalScore) === "cv-score-high" ? "rgba(57,201,143,0.32)" : scoreClass(candidate.finalScore) === "cv-score-mid" ? "rgba(240,201,122,0.32)" : "rgba(255,107,107,0.24)"}`,
                background: scoreClass(candidate.finalScore) === "cv-score-high" ? C.greenDim : scoreClass(candidate.finalScore) === "cv-score-mid" ? "rgba(240,201,122,0.08)" : C.redDim,
                textAlign: "center",
              }}>
                <div style={{ fontSize: 10, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>AI Score</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: scoreClass(candidate.finalScore) === "cv-score-high" ? C.green : scoreClass(candidate.finalScore) === "cv-score-mid" ? C.goldBright : C.red }}>
                  {candidate.finalScore}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { icon: Mail, label: candidate.email },
                { icon: Phone, label: candidate.phone },
                { icon: MapPin, label: `${candidate.city}, ${candidate.country}` },
                { icon: Briefcase, label: `${Math.max(2, Math.round(candidate.finalScore / 14))}+ years experience` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  minWidth: 0,
                  padding: "11px 12px",
                  borderRadius: 14,
                  border: `1px solid ${C.line}`,
                  background: "rgba(255,255,255,0.02)",
                }}>
                  <Icon size={14} color={C.goldBright} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: C.inkSoft, overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>
              Professional Summary
            </div>
            <p style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.72 }}>
              {preview.summary}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: embedded ? "1fr" : "1.08fr 0.92fr", gap: 14 }}>
            <section style={{ borderRadius: 18, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.02)", padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Briefcase size={15} color={C.goldBright} />
                <div style={{ fontSize: 11, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.13em", fontWeight: 700 }}>
                  Experience
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {preview.experience.map((item) => (
                  <div key={`${item.company}-${item.title}`} style={{ paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12.5, color: C.goldBright, marginBottom: 4 }}>{item.company}</div>
                    <div style={{ fontSize: 11.5, color: C.inkMuted, marginBottom: 8 }}>{item.period}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {item.bullets.map((bullet) => (
                        <div key={bullet} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ width: 6, height: 6, borderRadius: 999, background: C.goldBright, marginTop: 7, flexShrink: 0 }} />
                          <span style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.65 }}>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <section style={{ borderRadius: 18, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.02)", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Sparkles size={15} color={C.goldBright} />
                  <div style={{ fontSize: 11, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.13em", fontWeight: 700 }}>
                    Core Strengths
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {preview.strengths.map((item) => (
                    <span key={item} style={{
                      padding: "7px 10px",
                      borderRadius: 999,
                      border: `1px solid ${C.line}`,
                      background: "rgba(255,255,255,0.025)",
                      fontSize: 11.5,
                      color: C.inkSoft,
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </section>

              <section style={{ borderRadius: 18, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.02)", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <GraduationCap size={15} color={C.goldBright} />
                  <div style={{ fontSize: 11, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.13em", fontWeight: 700 }}>
                    Education
                  </div>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{preview.education.degree}</div>
                <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 4 }}>{preview.education.institution}</div>
                <div style={{ fontSize: 11.5, color: C.inkMuted }}>{preview.education.year}</div>
              </section>

              <section style={{ borderRadius: 18, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.02)", padding: 16 }}>
                <div style={{ fontSize: 11, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.13em", fontWeight: 700, marginBottom: 12 }}>
                  Skills & Languages
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11.5, color: C.goldBright, marginBottom: 8 }}>Skills</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {preview.skills.map((skill) => (
                        <span key={skill} style={{ fontSize: 11.5, color: C.inkSoft, padding: "6px 9px", borderRadius: 999, background: "rgba(95,158,255,0.08)", border: "1px solid rgba(95,158,255,0.18)" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, color: C.goldBright, marginBottom: 8 }}>Languages</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {preview.languages.map((language) => (
                        <span key={language} style={{ fontSize: 11.5, color: C.inkSoft, padding: "6px 9px", borderRadius: 999, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.line}` }}>
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div style={{
            borderRadius: 18,
            border: `1px solid ${C.line}`,
            background: "rgba(255,255,255,0.02)",
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontSize: 11, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.13em", fontWeight: 700, marginBottom: 6 }}>
                Review Notes
              </div>
              <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.6 }}>
                This side modal keeps the original CV results modal visible behind it while giving the recruiter both the uploaded document view and a structured fallback summary for faster screening.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 10,
                border: `1px solid ${C.line}`,
                background: "rgba(255,255,255,0.03)",
                color: C.inkSoft,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontFamily: "'Sora', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              <X size={14} />
              Close Preview
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

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
  const [page, setPage] = useState(1);
  const [previewCandidateId, setPreviewCandidateId] = useState(null);

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
  const pagination = useMemo(
    () => paginateItems(filtered, page, MIN_TABLE_ROWS),
    [filtered, page]
  );
  const previewCandidate = useMemo(
    () => CANDIDATES.find((candidate) => candidate.id === previewCandidateId) || null,
    [previewCandidateId]
  );

  const suitable = filtered.filter((c) => !c.disqualified && c.finalScore >= 50);
  const avgScore = filtered.length
    ? Math.round(filtered.reduce((s, c) => s + c.finalScore, 0) / filtered.length)
    : 0;

  useEffect(() => {
    if (page !== pagination.currentPage) {
      setPage(pagination.currentPage);
    }
  }, [page, pagination.currentPage]);

  useEffect(() => {
    if (!previewCandidate) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setPreviewCandidateId(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewCandidate]);

  const toggleSort = (field) => {
    setPage(1);
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const allChecked = pagination.pageItems.length > 0 && pagination.pageItems.every((candidate) => selected.has(candidate.id));
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allChecked) pagination.pageItems.forEach((candidate) => next.delete(candidate.id));
      else pagination.pageItems.forEach((candidate) => next.add(candidate.id));
      return next;
    });

  const toggleExpand = (id) =>
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const openPreview = (candidate) => setPreviewCandidateId(candidate.id);

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
          {!embedded && (
            <header className="cv-top">
              <div className="cv-breadcrumb">
                <button type="button" className="cv-crumb-link" onClick={() => navigate("/dashboard")}>Dashboard</button>
                <span>/</span>
                <span>CvResults</span>
              </div>
              <h1>Resume Results</h1>
              <p className="cv-desc">Review submitted CVs, compare scores, and shortlist the right candidates.</p>
            </header>
          )}

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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="cv-filter-divider" />
            <select
              className="cv-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Status</option>
              <option>Pending</option>
              <option>Invited</option>
              <option>Rejected</option>
              <option>Shortlisted</option>
            </select>
            <select
              className="cv-filter-select"
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                setPage(1);
              }}
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
                setPage(1);
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
                  Showing {pagination.startIndex}-{pagination.endIndex} of {filtered.length} filtered candidates, 10 rows per page, threshold 50
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
                        className={`cv-checkbox ${allChecked ? "checked" : ""}`}
                        onClick={toggleAll}
                        aria-label="Select all"
                      >
                        {allChecked
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
                    {!embedded && (
                      <th className="sortable" onClick={() => toggleSort("country")}>
                        <span className="cv-th-inner">Location <SortIcon field="country" /></span>
                      </th>
                    )}
                    {!embedded && <th>Phone</th>}
                    <th className="sortable" onClick={() => toggleSort("finalScore")}>
                      <span className="cv-th-inner">Score <SortIcon field="finalScore" /></span>
                    </th>
                    <th>Suitable</th>
                    <th style={{ width: 110 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.pageItems.map((c) => (
                    <Fragment key={c.id}>
                      <tr
                        className={`${selected.has(c.id) ? "cv-row-selected " : ""}cv-row-clickable`}
                        role="button"
                        tabIndex={0}
                        onClick={() => openPreview(c)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openPreview(c);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Checkbox */}
                        <td>
                          <div className="cv-td" style={{ paddingRight: 4 }}>
                            <button
                              className={`cv-checkbox ${selected.has(c.id) ? "checked" : ""}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleSelect(c.id);
                              }}
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
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleExpand(c.id);
                              }}
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
                            <button
                              type="button"
                              className="cv-file-link"
                              onClick={(event) => {
                                event.stopPropagation();
                                openPreview(c);
                              }}
                              aria-label={`Open CV preview for ${c.name}`}
                              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                            >
                              <FileText size={13} />
                              {c.cv}
                            </button>
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
                        {!embedded && (
                          <td>
                            <div className="cv-td">
                              <div className="cv-location-country">{c.country}</div>
                              <div className="cv-location-city">{c.city}</div>
                            </div>
                          </td>
                        )}

                        {/* Phone */}
                        {!embedded && (
                          <td>
                            <div className="cv-td">
                              <span className="cv-phone">{c.phone}</span>
                            </div>
                          </td>
                        )}

                        {/* Score */}
                        <td>
                          <div className="cv-td">
                            <div className="cv-score-wrap">
                              <span className={`cv-score-badge ${scoreClass(c.finalScore)}`}>
                                {c.finalScore}/100
                              </span>
                              <div className="cv-score-threshold">Score ≥ 50</div>
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
                              <button className="cv-action-btn" title="View CV preview" type="button" onClick={(event) => { event.stopPropagation(); openPreview(c); }}>
                                <Eye size={15} />
                              </button>
                              <button className="cv-action-btn cv-action-btn-mail" title="Send email" type="button" onClick={(event) => event.stopPropagation()}>
                                <Mail size={15} />
                              </button>
                              <button className="cv-action-btn cv-action-btn-reject" title="Reject" type="button" onClick={(event) => event.stopPropagation()}>
                                <X size={15} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {expanded.has(c.id) && (
                        <tr className="cv-expanded-row">
                          <td colSpan={embedded ? 8 : 10}>
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
                    </Fragment>
                  ))}
                  {pagination.totalItems === 0 && (
                    <tr className="cv-table-empty">
                      <td colSpan={embedded ? 8 : 10}>No candidates match the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination.totalItems > 0 && (
              <div className="cv-pagination-footer">
                <div className="cv-pagination-summary">
                  Showing {pagination.startIndex}-{pagination.endIndex} of {pagination.totalItems} candidates
                </div>
                <div className="cv-pagination-controls">
                  <button type="button" className="cv-pagination-btn" disabled={pagination.currentPage === 1} onClick={() => setPage(pagination.currentPage - 1)}>Prev</button>
                  {getPaginationWindow(pagination.currentPage, pagination.totalPages).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`cv-pagination-btn ${pageNumber === pagination.currentPage ? "active" : ""}`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button type="button" className="cv-pagination-btn" disabled={pagination.currentPage === pagination.totalPages} onClick={() => setPage(pagination.currentPage + 1)}>Next</button>
                </div>
              </div>
            )}

            {/* Demo note */}
            <div className="cv-demo-note">
              Demo note: CV links are placeholders (e.g. <code>/demo/cv/ahmad.pdf</code>). Add files under your backend/static to serve them.
            </div>
          </div>

        </div>
      </div>
      <ResumePreviewModal candidate={previewCandidate} embedded={embedded} onClose={() => setPreviewCandidateId(null)} />
    </>
  );
}
