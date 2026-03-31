import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CircleEllipsis,
  Clock3,
  LogOut,
  Plus,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { MdPerson, MdSearch as MdSearchIcon, MdExtension, MdGavel, MdMemory, MdChat } from "react-icons/md";
import { DASHBOARD_AUTH_KEY } from "./authConfig";

// â”€â”€â”€ Design Tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const C = {
  bgDark: "#080d1c",
  bgPanel: "rgba(11,17,34,0.88)",
  bgPanelSoft: "rgba(10,15,30,0.72)",
  bgCard: "rgba(8,12,24,0.82)",
  gold: "#b8955a",
  goldBright: "#f0c97a",
  goldDim: "rgba(240,201,122,0.18)",
  inkSoft: "rgba(245,240,235,0.78)",
  inkMuted: "rgba(245,240,235,0.46)",
  line: "rgba(184,149,90,0.18)",
  lineStrong: "rgba(184,149,90,0.35)",
  blue: "#5f9eff",
  blueGlow: "rgba(95,158,255,0.15)",
  green: "#39c98f",
  greenDim: "rgba(57,201,143,0.15)",
  yellow: "#e3c466",
  red: "#ff6b6b",
};

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CREATE_TABS = ["All", "General", "Stage 2", "Assessment", "Language", "Behavior"];

const CREATE_CARDS = [
  {
    title: "First Interview",
    category: "General",
    description: "CV-based screening interview to evaluate core qualifications and cultural fit.",
    icon: MdPerson,
  },
  {
    title: "Second Interview",
    category: "Stage 2",
    description: "Strict follow-up interview based on Stage 1 performance and red flags.",
    icon: MdSearchIcon,
  },
  {
    title: "Problem Solving",
    category: "Assessment",
    description: "Real workplace challenges and decision-making under pressure scenarios.",
    icon: MdExtension,
  },
  {
    title: "Situational Judgment",
    category: "Assessment",
    description: "Workplace scenarios measuring professional judgment and ethics.",
    icon: MdGavel,
  },
  {
    title: "Cognitive Ability",
    category: "Assessment",
    description: "General reasoning, pattern recognition and learning agility tests.",
    icon: MdMemory,
  },
  {
    title: "English Communication",
    category: "Language",
    description: "Conversation fluency, grammar accuracy, and expression clarity.",
    icon: MdChat,
  },
];

const TABLE_ROW = {
  focus: "demo",
  code: "DEMO-073298",
  job: "B2B Sales Representative",
  company: "Demo Company",
  created: "3/30/2026",
  cvEnd: "No end date",
  interviewEnd: "No end date",
};

const INTAKE_CODE = "DEMOT-F9908C";
const CAMPAIGN_LINKS = {
  cvSubmission: `https://mawahib.ai/apply/${INTAKE_CODE}`,
  avatarInterview: `https://mawahib.ai/interview?code=${TABLE_ROW.code}`,
};

const FUNNEL_STEPS = [
  { label: "Invited", value: 108, color: C.blue },
  { label: "Submitted CV", value: 62, color: "#4f87e8" },
  { label: "Interviewed", value: 28, color: C.yellow },
  { label: "Shortlisted", value: 12, color: C.green },
  { label: "Hired", value: 5, color: "#28a66f" },
];

// â”€â”€â”€ Font & Global Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap"
      rel="stylesheet"
    />
  </>
);

const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }

    /* â”€â”€ Root â”€â”€ */
    .db-root {
      min-height: 100vh;
      background:
        radial-gradient(ellipse 80vw 60vh at 100% -10%, rgba(184,149,90,0.12) 0%, transparent 55%),
        radial-gradient(ellipse 60vw 50vh at -5% 90%, rgba(95,158,255,0.07) 0%, transparent 50%),
        radial-gradient(ellipse 40vw 40vh at 50% 50%, rgba(184,149,90,0.04) 0%, transparent 60%),
        ${C.bgDark};
      color: #f5f0eb;
      font-family: 'Sora', sans-serif;
      padding: 100px clamp(16px, 2.5vw, 32px) clamp(24px, 3vw, 40px);
    }

    .db-frame {
      max-width: 1480px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* â”€â”€ Navbar â”€â”€ */
    .db-navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 12px clamp(16px, 2.5vw, 32px);
      background: rgba(8,13,26,0.82);
      border-bottom: 1px solid ${C.line};
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .db-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .db-logo-chip {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid ${C.lineStrong};
      background: linear-gradient(140deg, rgba(184,149,90,0.28), rgba(184,149,90,0.06));
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .db-brand-text {}
    .db-brand-name {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      letter-spacing: -0.01em;
    }
    .db-brand-sub {
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: ${C.inkMuted};
      font-weight: 600;
      margin-top: 2px;
    }
    .db-nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .db-icon-btn {
      width: 42px;
      height: 42px;
      border: 1px solid ${C.line};
      background: rgba(184,149,90,0.06);
      color: #f5f0eb;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .db-icon-btn .dot {
      position: absolute;
      top: 9px; right: 9px;
      width: 7px; height: 7px;
      border-radius: 50%;
      background: ${C.goldBright};
      box-shadow: 0 0 8px ${C.goldBright};
    }
    .db-logout-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 0 16px;
      height: 42px;
      border: 1px solid ${C.line};
      background: rgba(184,149,90,0.06);
      color: #f5f0eb;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 13px;
      font-weight: 600;
      font-family: 'Sora', sans-serif;
      white-space: nowrap;
    }
    .db-icon-btn:hover, .db-logout-btn:hover {
      background: rgba(184,149,90,0.14);
      border-color: ${C.lineStrong};
      transform: translateY(-1px);
    }

    /* â”€â”€ Hero â”€â”€ */
    .db-hero {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 20px;
      padding: clamp(24px, 3vw, 36px);
      background: ${C.bgPanel};
      border: 1px solid ${C.line};
      border-radius: 28px;
      backdrop-filter: blur(16px);
      box-shadow: 0 24px 64px rgba(0,0,0,0.36);
    }
    .db-hero-content {}
    .db-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      border-radius: 999px;
      border: 1px solid rgba(184,149,90,0.4);
      background: rgba(184,149,90,0.1);
      color: ${C.goldBright};
      letter-spacing: 0.13em;
      text-transform: uppercase;
      font-size: 10.5px;
      font-weight: 700;
      padding: 7px 13px;
      margin-bottom: 18px;
    }
    .db-hero h1 {
      font-family: 'DM Serif Display', serif;
      font-style: italic;
      font-size: clamp(2.4rem, 4.8vw, 4.8rem);
      line-height: 0.97;
      letter-spacing: -0.025em;
      margin: 0 0 18px;
      color: #fff;
    }
    .db-hero h1 span { color: ${C.goldBright}; }
    .db-hero-desc {
      color: ${C.inkSoft};
      font-size: clamp(13px, 1.4vw, 15.5px);
      line-height: 1.8;
      max-width: 560px;
      margin: 0 0 28px;
    }
    .db-hero-stats {
      display: flex;
      gap: 28px;
      flex-wrap: wrap;
    }
    .db-hero-stat {}
    .db-hero-stat-val {
      font-family: 'DM Serif Display', serif;
      font-size: 28px;
      color: #fff;
      line-height: 1;
    }
    .db-hero-stat-label {
      font-size: 12px;
      color: ${C.inkMuted};
      margin-top: 4px;
      letter-spacing: 0.04em;
    }
    .db-hero-stat-divider {
      width: 1px;
      background: ${C.line};
      align-self: stretch;
    }
    .db-hero-image {
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(184,149,90,0.22);
      min-height: 260px;
      max-height: 360px;
      position: relative;
      background: linear-gradient(135deg, #0d1427, #081020);
    }
    .db-hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.88;
    }
    .db-hero-image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(8,13,28,0.25), transparent);
    }

    /* â”€â”€ Section Wrapper â”€â”€ */
    .db-section {
      background: ${C.bgPanel};
      border: 1px solid ${C.line};
      border-radius: 28px;
      backdrop-filter: blur(16px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.28);
      overflow: hidden;
    }
    .db-section-inner {
      padding: clamp(20px, 2.5vw, 28px);
    }
    .db-section-head {
      margin-bottom: 20px;
    }
    .db-section-head h2 {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(1.6rem, 2.8vw, 2.2rem);
      font-weight: 400;
      color: #fff;
      margin: 0 0 6px;
      letter-spacing: -0.015em;
    }
    .db-section-head p {
      color: ${C.inkMuted};
      font-size: 13.5px;
      line-height: 1.6;
      margin: 0;
    }

    /* â”€â”€ Tabs â”€â”€ */
    .db-tab-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;
      margin-bottom: 20px;
    }
    .db-tab {
      border: 1px solid rgba(184,149,90,0.2);
      background: rgba(255,255,255,0.03);
      color: ${C.inkMuted};
      border-radius: 999px;
      padding: 7px 16px;
      font-size: 13px;
      font-weight: 600;
      font-family: 'Sora', sans-serif;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.22s ease;
    }
    .db-tab:hover {
      border-color: rgba(184,149,90,0.4);
      color: ${C.inkSoft};
    }
    .db-tab.active {
      background: linear-gradient(135deg, rgba(184,149,90,0.28), rgba(240,201,122,0.16));
      border-color: rgba(240,201,122,0.6);
      color: #fff;
    }

    /* â”€â”€ Carousel â”€â”€ */
    .db-carousel-wrapper {
      position: relative;
    }
    .db-carousel-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid ${C.lineStrong};
      background: rgba(8,12,24,0.92);
      color: ${C.inkSoft};
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(8px);
    }
    .db-carousel-nav:hover {
      background: rgba(184,149,90,0.2);
      border-color: ${C.goldBright};
      color: #fff;
    }
    .db-carousel-nav.prev { left: -14px; }
    .db-carousel-nav.next { right: -14px; }
    .db-carousel-viewport {
      overflow: hidden;
      width: 100%;
      border-radius: 18px;
    }
    .db-create-track {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: calc((100% - 36px) / 4);
      gap: 12px;
      transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* â”€â”€ Campaign Cards â€” FIXED UNIFORM SIZING â”€â”€ */
    .db-create-card {
      height: 220px;
      border: 1px solid rgba(184,149,90,0.18);
      background: linear-gradient(160deg, rgba(10,14,28,0.9), rgba(7,11,22,0.72));
      border-radius: 18px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.24s ease;
      overflow: hidden;
      position: relative;
    }
    .db-create-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(240,201,122,0.3), transparent);
      opacity: 0;
      transition: opacity 0.24s ease;
    }
    .db-create-card:hover {
      transform: translateY(-3px);
      border-color: rgba(240,201,122,0.45);
      box-shadow: 0 20px 40px rgba(0,0,0,0.36), 0 0 0 1px rgba(240,201,122,0.1);
    }
    .db-create-card:hover::before { opacity: 1; }

    .db-create-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }
    .db-card-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: ${C.goldBright};
      flex-shrink: 0;
    }
    .db-card-icon svg { display: block; }
    .db-category {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-radius: 999px;
      padding: 5px 11px;
      border: 1px solid rgba(184,149,90,0.38);
      color: ${C.goldBright};
      background: rgba(184,149,90,0.1);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .db-create-card h3 {
      font-family: 'DM Serif Display', serif;
      font-size: 1.45rem;
      font-weight: 400;
      color: #fff;
      margin: 0 0 8px;
      line-height: 1.15;
      letter-spacing: -0.01em;
    }
    .db-create-card p {
      color: ${C.inkMuted};
      font-size: 12.5px;
      line-height: 1.6;
      flex: 1;
      margin: 0 0 14px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .db-create-btn {
      border: none;
      background: none;
      color: ${C.goldBright};
      font-size: 13px;
      font-weight: 700;
      font-family: 'Sora', sans-serif;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      padding: 0;
      transition: gap 0.2s ease;
    }
    .db-create-btn:hover { gap: 9px; }

    /* â”€â”€ Carousel Dots â”€â”€ */
    .db-carousel-dots {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 16px;
    }
    .db-carousel-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(184,149,90,0.3);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .db-carousel-dot.active {
      background: ${C.goldBright};
      width: 20px;
      border-radius: 3px;
    }

    /* â”€â”€ Main Grid â”€â”€ */
    .db-main-grid {
      display: grid;
      grid-template-columns: 1.18fr 0.82fr;
      gap: 16px;
    }
    .db-pane {
      background: ${C.bgPanel};
      border: 1px solid ${C.line};
      border-radius: 28px;
      overflow: hidden;
      backdrop-filter: blur(16px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.28);
    }
    .db-pane-head {
      padding: 20px 20px 16px;
      border-bottom: 1px solid ${C.line};
    }
    .db-pane-head-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 14px;
    }
    .db-pane h3 {
      font-family: 'DM Serif Display', serif;
      font-size: 1.5rem;
      font-weight: 400;
      color: #fff;
      margin: 0;
    }
    .db-count-badge {
      font-size: 12px;
      color: ${C.inkMuted};
      border: 1px solid ${C.line};
      border-radius: 999px;
      padding: 3px 10px;
      font-weight: 600;
    }

    /* â”€â”€ Filters â”€â”€ */
    .db-filters {
      display: grid;
      grid-template-columns: 1.5fr repeat(3, 1fr);
      gap: 8px;
    }
    .db-input-wrap { position: relative; }
    .db-input-wrap svg {
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translateY(-50%);
      color: ${C.inkMuted};
      pointer-events: none;
    }
    .db-input, .db-select {
      width: 100%;
      height: 40px;
      border-radius: 11px;
      border: 1px solid rgba(184,149,90,0.18);
      background: rgba(6,10,20,0.72);
      color: #f5f0eb;
      font-size: 13px;
      outline: none;
      font-family: 'Sora', sans-serif;
      transition: border-color 0.2s ease;
    }
    .db-input { padding: 0 12px 0 36px; }
    .db-select { padding: 0 12px; cursor: pointer; appearance: none; }
    .db-input:focus, .db-select:focus {
      border-color: rgba(184,149,90,0.45);
    }
    .db-input::placeholder { color: ${C.inkMuted}; }

    /* â”€â”€ Table â”€â”€ */
    .db-table-wrap { overflow-x: auto; }
    .db-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 760px;
    }
    .db-table th {
      text-transform: uppercase;
      letter-spacing: 0.11em;
      font-size: 11px;
      color: ${C.inkMuted};
      font-weight: 700;
      background: rgba(255,255,255,0.02);
      padding: 13px 16px;
      text-align: left;
      border-bottom: 1px solid ${C.line};
    }
    .db-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(184,149,90,0.1);
      color: ${C.inkSoft};
      vertical-align: middle;
      font-size: 13.5px;
      background: rgba(8,12,24,0.62);
    }
    .db-table tbody tr:hover td {
      background: rgba(184,149,90,0.05);
    }
    .db-table tbody tr:last-child td { border-bottom: none; }

    .db-row-active td { background: rgba(95,158,255,0.06) !important; }
    .db-row-active td:first-child {
      border-left: 2px solid ${C.blue};
    }
    .db-focus-name {
      font-size: 14px;
      color: #fff;
      font-weight: 700;
      margin-bottom: 3px;
      letter-spacing: -0.01em;
    }
    .db-mini {
      font-size: 11.5px;
      color: ${C.inkMuted};
      line-height: 1.5;
      font-family: 'Sora', monospace;
    }
    .db-pill-light {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      border: 1px solid rgba(184,149,90,0.18);
      background: rgba(255,255,255,0.03);
      color: ${C.inkSoft};
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    .db-action-btn {
      width: 36px; height: 36px;
      border-radius: 10px;
      border: 1px solid ${C.line};
      background: rgba(255,255,255,0.03);
      color: ${C.inkMuted};
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .db-action-btn:hover {
      background: rgba(184,149,90,0.1);
      border-color: ${C.lineStrong};
      color: ${C.inkSoft};
    }

    /* â”€â”€ Side Panel â”€â”€ */
    .db-side {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: ${C.bgPanel};
      border: 1px solid ${C.line};
      border-radius: 28px;
      backdrop-filter: blur(16px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.28);
    }
    .db-side-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .db-switch {
      display: flex;
      gap: 4px;
      background: rgba(6,10,20,0.8);
      border: 1px solid ${C.line};
      border-radius: 12px;
      padding: 4px;
      flex-shrink: 0;
    }
    .db-switch-btn {
      border: 1px solid transparent;
      height: 32px;
      border-radius: 9px;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 700;
      font-family: 'Sora', sans-serif;
      color: ${C.inkMuted};
      background: transparent;
      cursor: pointer;
      transition: all 0.22s ease;
      white-space: nowrap;
    }
    .db-switch-btn.active {
      border-color: rgba(240,201,122,0.55);
      background: linear-gradient(135deg, rgba(184,149,90,0.95), rgba(240,201,122,0.88));
      color: #1a1307;
      box-shadow: 0 4px 12px rgba(184,149,90,0.28), inset 0 1px 0 rgba(255,255,255,0.22);
    }

    .db-campaign-title {
      font-family: 'DM Serif Display', serif;
      font-size: 2.2rem;
      line-height: 1;
      color: #fff;
      margin-bottom: 5px;
      letter-spacing: -0.02em;
    }
    .db-campaign-sub {
      color: ${C.inkSoft};
      font-size: 14px;
      margin-bottom: 6px;
    }
    .db-campaign-meta {
      color: ${C.inkMuted};
      font-size: 12.5px;
      line-height: 1.65;
    }
    .db-tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 10px;
    }

    /* â”€â”€ AI Callout â”€â”€ */
    .db-ai-callout {
      border: 1px solid rgba(184,149,90,0.28);
      border-radius: 16px;
      padding: 14px;
      background: linear-gradient(135deg, rgba(184,149,90,0.08), rgba(184,149,90,0.03));
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .db-ai-chip {
      width: 40px; height: 40px;
      border-radius: 11px;
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 12px;
      background: linear-gradient(135deg, rgba(184,149,90,0.95), rgba(240,201,122,0.9));
      color: #1a1307;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(184,149,90,0.3);
      letter-spacing: 0.03em;
    }
    .db-ai-callout h4 {
      font-family: 'DM Serif Display', serif;
      font-size: 1.1rem;
      font-weight: 400;
      color: #fff;
      margin: 0 0 4px;
    }
    .db-ai-callout p {
      font-size: 13px;
      line-height: 1.6;
      color: ${C.inkMuted};
      margin: 0;
    }

    /* â”€â”€ Stats â”€â”€ */
    .db-stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .db-stat {
      border-radius: 16px;
      border: 1px solid ${C.line};
      background: rgba(6,10,20,0.65);
      padding: 16px;
    }
    .db-stat-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .db-stat label {
      text-transform: uppercase;
      letter-spacing: 0.11em;
      font-size: 10.5px;
      color: ${C.inkMuted};
      font-weight: 700;
    }
    .db-stat strong {
      display: block;
      font-family: 'DM Serif Display', serif;
      font-size: 3.2rem;
      line-height: 1;
      color: #fff;
      font-weight: 400;
      margin-bottom: 6px;
    }
    .db-stat p {
      color: ${C.inkMuted};
      font-size: 12.5px;
      line-height: 1.5;
      margin: 0 0 8px;
    }
    .db-dot-row {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
    }
    .db-dot {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11.5px;
      color: ${C.inkMuted};
    }
    .db-dot-circle {
      width: 7px; height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* â”€â”€ Funnel â”€â”€ */
    .db-funnel-card {
      border: 1px solid ${C.line};
      border-radius: 18px;
      background: rgba(6,10,20,0.65);
      overflow: hidden;
    }
    .db-funnel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      border-bottom: 1px solid ${C.line};
    }
    .db-funnel-head h4 {
      font-family: 'DM Serif Display', serif;
      font-size: 1.1rem;
      font-weight: 400;
      color: #fff;
      margin: 0;
    }
    .db-funnel-head span {
      color: ${C.inkMuted};
      font-size: 12px;
    }
    .db-funnel-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
      padding: 12px 16px 4px;
    }
    .db-funnel-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11.5px;
      color: ${C.inkMuted};
    }
    .db-funnel-legend-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .db-funnel-svg {
      width: 100%;
      height: 190px;
      display: block;
      padding: 8px 14px 14px;
    }
    .db-funnel-svg text {
      font-size: 11px;
      fill: rgba(245,240,235,0.7);
      font-family: 'Sora', sans-serif;
    }

    /* â”€â”€ Post-Funnel Controls â”€â”€ */
    .db-manage-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .db-manage-card {
      border-radius: 15px;
      border: 1px solid ${C.line};
      background: rgba(6,10,20,0.62);
      padding: 14px;
    }
    .db-manage-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }
    .db-manage-head h5 {
      margin: 0;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .db-subtle-btn {
      border: 1px solid ${C.line};
      background: rgba(184,149,90,0.08);
      color: ${C.inkSoft};
      border-radius: 10px;
      height: 34px;
      padding: 0 14px;
      font-size: 12px;
      font-weight: 700;
      font-family: 'Sora', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .db-subtle-btn:hover {
      background: rgba(184,149,90,0.16);
      border-color: ${C.lineStrong};
      color: #fff;
    }
    .db-manage-status {
      color: #fff;
      font-size: 29px;
      line-height: 1;
      font-family: 'DM Serif Display', serif;
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }
    .db-manage-end {
      color: ${C.inkMuted};
      font-size: 12.5px;
      line-height: 1.4;
    }

    .db-links-card {
      border: 1px solid ${C.line};
      border-radius: 16px;
      background: rgba(6,10,20,0.62);
      padding: 14px;
    }
    .db-links-card h4 {
      margin: 0 0 12px;
      color: #fff;
      font-size: 18px;
      font-family: 'DM Serif Display', serif;
      font-weight: 400;
      letter-spacing: -0.01em;
    }
    .db-link-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .db-link-group + .db-link-group { margin-top: 12px; }
    .db-link-group label {
      color: ${C.inkMuted};
      font-size: 12.5px;
      line-height: 1.4;
    }
    .db-link-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .db-link-input {
      width: 100%;
      height: 40px;
      border-radius: 11px;
      border: 1px solid rgba(184,149,90,0.2);
      background: rgba(8,12,24,0.9);
      color: ${C.inkSoft};
      font-size: 13px;
      font-family: 'Sora', sans-serif;
      padding: 0 12px;
      outline: none;
    }
    .db-link-input:focus {
      border-color: rgba(184,149,90,0.45);
    }
    .db-copy-btn {
      height: 40px;
      min-width: 64px;
      border-radius: 11px;
      border: 1px solid ${C.line};
      background: rgba(184,149,90,0.08);
      color: ${C.inkSoft};
      font-size: 13px;
      font-weight: 700;
      font-family: 'Sora', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0 14px;
      flex-shrink: 0;
    }
    .db-copy-btn:hover {
      background: rgba(184,149,90,0.16);
      border-color: ${C.lineStrong};
      color: #fff;
    }
    .db-copy-btn.copied {
      border-color: rgba(57,201,143,0.4);
      background: rgba(57,201,143,0.16);
      color: rgba(122,235,186,0.98);
    }

    .db-end-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .db-end-btn {
      height: 40px;
      border-radius: 12px;
      border: 1px solid ${C.line};
      background: rgba(255,255,255,0.03);
      color: ${C.inkSoft};
      padding: 0 14px;
      font-size: 13px;
      font-weight: 700;
      font-family: 'Sora', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .db-end-btn:hover {
      background: rgba(184,149,90,0.14);
      border-color: ${C.lineStrong};
      color: #fff;
    }

    /* â”€â”€ Responsive â”€â”€ */
    @media (max-width: 1280px) {
      .db-main-grid, .db-hero { grid-template-columns: 1fr; }
      .db-hero-image { min-height: 220px; max-height: 280px; }
      .db-filters { grid-template-columns: 1fr 1fr; }
      .db-create-track { grid-auto-columns: calc((100% - 24px) / 3); }
    }
    @media (max-width: 960px) {
      .db-create-track { grid-auto-columns: calc((100% - 12px) / 2); }
      .db-stat-grid { grid-template-columns: 1fr; }
      .db-manage-grid { grid-template-columns: 1fr; }
      .db-filters { grid-template-columns: 1fr; }
    }
    @media (max-width: 680px) {
      .db-root { padding-top: 88px; }
      .db-create-track { grid-auto-columns: calc(100% - 0px); }
      .db-logout-btn .db-logout-label { display: none; }
      .db-logout-btn { padding: 0 12px; }
      .db-carousel-nav { display: none; }
      .db-hero { padding: 20px; }
      .db-section-inner { padding: 18px; }
      .db-side-header { flex-direction: column; }
      .db-link-row {
        flex-direction: column;
        align-items: stretch;
      }
      .db-copy-btn { width: 100%; }
    }
  `}</style>
);

// â”€â”€â”€ Funnel Builder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildFunnelPolygons() {
  const xPositions = [14, 126, 232, 328, 414, 482];
  const heights    = [158, 108, 74, 50, 34];
  const yMid = 106;

  return FUNNEL_STEPS.map((step, i) => {
    const lH = heights[i];
    const rH = heights[i + 1] ?? lH * 0.74;
    const points = [
      `${xPositions[i]},${yMid - lH / 2}`,
      `${xPositions[i + 1]},${yMid - rH / 2}`,
      `${xPositions[i + 1]},${yMid + rH / 2}`,
      `${xPositions[i]},${yMid + lH / 2}`,
    ].join(" ");
    return { ...step, points, labelX: (xPositions[i] + xPositions[i + 1]) / 2 };
  });
}

// â”€â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [resultView, setResultView] = useState("Interview Results");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const copyResetRef = useRef(null);

  const isAuthenticated = sessionStorage.getItem(DASHBOARD_AUTH_KEY) === "true";
  const funnelShapes = useMemo(() => buildFunnelPolygons(), []);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  const templates = useMemo(() => {
    if (activeTab === "All") return CREATE_CARDS;
    return CREATE_CARDS.filter((c) => c.category.toLowerCase() === activeTab.toLowerCase());
  }, [activeTab]);

  // Compute visible cards per slide based on window width
  const getCardsPerSlide = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth < 680) return 1;
    if (window.innerWidth < 960) return 2;
    if (window.innerWidth < 1280) return 3;
    return 4;
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide);

  useEffect(() => {
    const handler = () => setCardsPerSlide(getCardsPerSlide());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const totalSlides = Math.max(1, templates.length - cardsPerSlide + 1);

  // Clamp currentSlide when templates or cardsPerSlide changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab, cardsPerSlide]);

  const goTo = (idx) => {
    setCurrentSlide(Math.max(0, Math.min(idx, totalSlides - 1)));
  };

  const handleLogout = () => {
    sessionStorage.removeItem(DASHBOARD_AUTH_KEY);
    navigate("/login", { replace: true });
  };

  const handleResultViewClick = (item) => {
    if (item === "CV Results") {
      navigate("/resume");
      return;
    }
    setResultView(item);
  };

  const handleCreateCampaignClick = () => {
    navigate("/interview");
  };

  const handleCopy = async (value, key) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedKey(key);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopiedKey(""), 1600);
    } catch {
      // Ignore clipboard failures silently to avoid interrupting dashboard flow.
    }
  };

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  if (!isAuthenticated) return null;

  // Card width percent for transform
  const slidePercent = (100 / cardsPerSlide);
  const gap = 12;

  return (
    <>
      <FontLink />
      <GlobalStyles />


      <div className="db-root">
        <div className="db-frame">

          {/* â”€â”€ Hero â”€â”€ */}
          <motion.section
            className="db-hero"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="db-hero-content">
              <div className="db-pill">
                <Clock3 size={13} />
                Today's Hiring Overview
              </div>
              <h1>
                Build elite teams <span>faster</span> with AI precision.
              </h1>
              <p className="db-hero-desc">
                Manage your full hiring pipeline in one place. Launch structured campaigns, monitor candidate
                quality, and make decisions backed by clear AI interview intelligence.
              </p>
              <div className="db-hero-stats">
                <div className="db-hero-stat">
                  <div className="db-hero-stat-val">108</div>
                  <div className="db-hero-stat-label">Total Applicants</div>
                </div>
                <div className="db-hero-stat-divider" />
                <div className="db-hero-stat">
                  <div className="db-hero-stat-val">28</div>
                  <div className="db-hero-stat-label">Interviewed</div>
                </div>
                <div className="db-hero-stat-divider" />
                <div className="db-hero-stat">
                  <div className="db-hero-stat-val">5</div>
                  <div className="db-hero-stat-label">Hired</div>
                </div>
              </div>
            </div>
            <div className="db-hero-image">
              <img src="/hiring.jpeg" alt="Hiring meeting" />
              <div className="db-hero-image-overlay" />
            </div>
          </motion.section>

          {/* â”€â”€ Create Campaign â”€â”€ */}
          <motion.section
            className="db-section"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="db-section-inner">
              <div className="db-section-head">
                <h2>Create a Campaign</h2>
                <p>Choose an interview focus to include both CV upload and AI interview in your campaign.</p>
              </div>

              <div className="db-tab-row">
                {CREATE_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`db-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="db-carousel-wrapper">
                {/* Prev */}
                <button
                  className="db-carousel-nav prev"
                  onClick={() => goTo(currentSlide - 1)}
                  aria-label="Previous"
                >
                  <ChevronLeft size={17} />
                </button>

                <div className="db-carousel-viewport">
                  <div
                    className="db-create-track"
                    style={{
                      transform: `translateX(calc(-${currentSlide * slidePercent}% - ${currentSlide * gap}px))`,
                    }}
                  >
                    {templates.map((item) => {
                      const CardIcon = item.icon;
                      return (
                        <article key={item.title} className="db-create-card">
                          <div>
                            <div className="db-create-card-top">
                              <span className="db-card-icon">
                                <CardIcon size={22} />
                              </span>
                              <span className="db-category">{item.category}</span>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                          </div>
                          <button
                            type="button"
                            className="db-create-btn"
                            onClick={() => handleCreateCampaignClick(item.title)}
                          >
                            Create campaign
                            <Plus size={14} />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>

                {/* Next */}
                <button
                  className="db-carousel-nav next"
                  onClick={() => goTo(currentSlide + 1)}
                  aria-label="Next"
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              {/* Dots */}
              {totalSlides > 1 && (
                <div className="db-carousel-dots">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      className={`db-carousel-dot ${i === currentSlide ? "active" : ""}`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          <motion.div
            className="db-main-grid"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Campaigns Table */}
            <div className="db-pane">
              <div className="db-pane-head">
                <div className="db-pane-head-top">
                  <h3>Your Campaigns</h3>
                  <span className="db-count-badge">1 campaign</span>
                </div>
                <div className="db-filters">
                  <div className="db-input-wrap">
                    <Search size={14} />
                    <input
                      className="db-input"
                      placeholder="Search campaignsâ€¦"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select className="db-select" defaultValue="">
                    <option value="" disabled>Focus</option>
                    <option>All</option>
                    <option>General</option>
                    <option>Assessment</option>
                    <option>Language</option>
                  </select>
                  <select className="db-select" defaultValue="">
                    <option value="" disabled>Status</option>
                    <option>All</option>
                    <option>Active</option>
                    <option>Archived</option>
                  </select>
                  <select className="db-select" defaultValue="">
                    <option value="" disabled>Sort</option>
                    <option>Newest</option>
                    <option>Oldest</option>
                  </select>
                </div>
              </div>

              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Created</th>
                      <th>CV End</th>
                      <th>Interview End</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="db-row-active">
                      <td>
                        <div className="db-focus-name">{TABLE_ROW.focus}</div>
                        <div className="db-mini">{TABLE_ROW.code}</div>
                      </td>
                      <td style={{ color: "#fff", fontWeight: 600 }}>{TABLE_ROW.job}</td>
                      <td>{TABLE_ROW.company}</td>
                      <td>{TABLE_ROW.created}</td>
                      <td><span className="db-pill-light">{TABLE_ROW.cvEnd}</span></td>
                      <td><span className="db-pill-light">{TABLE_ROW.interviewEnd}</span></td>
                      <td>
                        <button type="button" className="db-action-btn" aria-label="Campaign actions">
                          <CircleEllipsis size={16} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Panel */}
            <aside className="db-side">
              <div className="db-side-header">
                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", fontWeight: 400, color: "#fff", margin: "0 0 4px" }}>
                    Campaign Details
                  </h3>
                  <div className="db-mini">Select a campaign to view details.</div>
                </div>
                <div className="db-switch">
                  {["CV Results", "Interview Results"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`db-switch-btn ${resultView === item ? "active" : ""}`}
                      onClick={() => handleResultViewClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="db-campaign-title">demo</div>
                <div className="db-campaign-sub">B2B Sales Representative Â· Demo Company</div>
                <div className="db-campaign-meta">
                  Interview code: {TABLE_ROW.code}<br />
                  Intake code: {INTAKE_CODE}
                </div>
                <div className="db-tag-row">
                  <span className="db-pill-light">Open access</span>
                  <span className="db-pill-light">EN</span>
                  <span className="db-pill-light">No end date</span>
                </div>
              </div>

              <div className="db-ai-callout">
                <div className="db-ai-chip">AI</div>
                <div>
                  <h4>Consultation Session</h4>
                  <p>
                    Run a premium consultation to validate hiring decisions, surface risks, and align on the
                    strongest shortlist.
                  </p>
                </div>
              </div>

              <div className="db-stat-grid">
                <div className="db-stat">
                  <div className="db-stat-head">
                    <label>Total CVs</label>
                    <span className="db-pill-light">Intake</span>
                  </div>
                  <strong>108</strong>
                  <p>Applicants who uploaded their CV</p>
                  <div className="db-dot-row">
                    <span className="db-dot">
                      <span className="db-dot-circle" style={{ background: "#9aa7bd" }} />
                      Male: 0
                    </span>
                    <span className="db-dot">
                      <span className="db-dot-circle" style={{ background: "#7f8ca5" }} />
                      Female: 0
                    </span>
                  </div>
                </div>

                <div className="db-stat" style={{ borderColor: "rgba(57,201,143,0.35)" }}>
                  <div className="db-stat-head">
                    <label style={{ color: "rgba(122,235,186,0.85)" }}>Suitable CVs</label>
                    <span className="db-pill-light">Threshold &gt;50</span>
                  </div>
                  <strong style={{ color: "rgba(122,235,186,0.95)" }}>0</strong>
                  <p>Out of 108 reviewed</p>
                  <div className="db-dot-row">
                    <span className="db-dot">
                      <span className="db-dot-circle" style={{ background: "#1ea46f" }} />
                      Male: 0
                    </span>
                    <span className="db-dot">
                      <span className="db-dot-circle" style={{ background: "#56d3a0" }} />
                      Female: 0
                    </span>
                  </div>
                </div>
              </div>

              <div className="db-funnel-card">
                <div className="db-funnel-head">
                  <h4>Interview Funnel</h4>
                  <span>Based on invited</span>
                </div>
                <div className="db-funnel-legend">
                  {FUNNEL_STEPS.map((step) => (
                    <span key={step.label} className="db-funnel-legend-item">
                      <span className="db-funnel-legend-dot" style={{ background: step.color }} />
                      {step.label}
                    </span>
                  ))}
                </div>
                <svg
                  className="db-funnel-svg"
                  viewBox="0 0 496 210"
                  role="img"
                  aria-label="Interview funnel visualization"
                >
                  {funnelShapes.map((shape) => (
                    <polygon
                      key={shape.label}
                      points={shape.points}
                      fill={shape.color}
                      opacity="0.92"
                    />
                  ))}
                  {funnelShapes.map((shape) => (
                    <text
                      key={`${shape.label}-v`}
                      x={shape.labelX}
                      y="198"
                      textAnchor="middle"
                    >
                      {shape.value}
                    </text>
                  ))}
                </svg>
              </div>

              <div className="db-manage-grid">
                <div className="db-manage-card">
                  <div className="db-manage-head">
                    <h5>CV Submission</h5>
                    <button type="button" className="db-subtle-btn">Edit</button>
                  </div>
                  <div className="db-manage-status">Enabled</div>
                  <div className="db-manage-end">Ends: -</div>
                </div>
                <div className="db-manage-card">
                  <div className="db-manage-head">
                    <h5>Interview</h5>
                    <button type="button" className="db-subtle-btn">Edit</button>
                  </div>
                  <div className="db-manage-status">Enabled</div>
                  <div className="db-manage-end">Ends: -</div>
                </div>
              </div>

              <div className="db-links-card">
                <h4>Campaign Links</h4>

                <div className="db-link-group">
                  <label htmlFor="cv-submission-link">CV submission link</label>
                  <div className="db-link-row">
                    <input
                      id="cv-submission-link"
                      className="db-link-input"
                      value={CAMPAIGN_LINKS.cvSubmission}
                      readOnly
                    />
                    <button
                      type="button"
                      className={`db-copy-btn ${copiedKey === "cv" ? "copied" : ""}`}
                      onClick={() => handleCopy(CAMPAIGN_LINKS.cvSubmission, "cv")}
                    >
                      {copiedKey === "cv" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="db-link-group">
                  <label htmlFor="avatar-interview-link">Avatar interview link</label>
                  <div className="db-link-row">
                    <input
                      id="avatar-interview-link"
                      className="db-link-input"
                      value={CAMPAIGN_LINKS.avatarInterview}
                      readOnly
                    />
                    <button
                      type="button"
                      className={`db-copy-btn ${copiedKey === "interview" ? "copied" : ""}`}
                      onClick={() => handleCopy(CAMPAIGN_LINKS.avatarInterview, "interview")}
                    >
                      {copiedKey === "interview" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="db-end-actions">
                <button type="button" className="db-end-btn">Edit end date</button>
                <button type="button" className="db-end-btn">Extend 7d</button>
                <button type="button" className="db-end-btn">Extend 30d</button>
              </div>
            </aside>
          </motion.div>

        </div>
      </div>
    </>
  );
}
