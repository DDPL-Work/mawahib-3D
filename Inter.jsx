import { useState, useMemo, useEffect } from "react";
import {
    ArrowLeft, Search, ChevronLeft, ChevronRight, Copy,
    Check, Eye, RotateCcw, Trash2, AlertCircle, Users,
    BarChart2, CheckCircle2, XCircle, Clock, Filter,
    ChevronDown, Sparkles, Globe, MoreHorizontal, Captions, CaptionsOff,
} from "lucide-react";
import { getPaginationWindow, paginateItems } from "./tablePagination";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
    bgDark: "#fbf5eb",
    bgPanel: "rgba(255,250,242,0.85)",
    bgCard: "rgba(255,250,242,0.92)",
    bgInput: "rgba(255,255,255,0.95)",
    gold: "#b8915a",
    goldBright: "#f2d27a",
    goldDim: "rgba(184,149,90,0.14)",
    goldBorder: "rgba(184,149,90,0.28)",
    inkWhite: "#1c1409",
    inkSoft: "rgba(44, 30, 10, 0.88)",
    inkMuted: "rgba(44, 30, 10, 0.64)",
    inkFaint: "rgba(44, 30, 10, 0.36)",
    line: "rgba(184,149,90,0.18)",
    lineStrong: "rgba(184,149,90,0.32)",
    blue: "#3a7bd5",
    blueDim: "rgba(58,123,213,0.10)",
    blueBorder: "rgba(58,123,213,0.28)",
    green: "#2d9e75",
    greenDim: "rgba(45,158,117,0.10)",
    greenBorder: "rgba(45,158,117,0.28)",
    yellow: "#c48a00",
    yellowDim: "rgba(196,138,0,0.10)",
    yellowBorder: "rgba(196,138,0,0.28)",
    red: "#d54f4f",
    redDim: "rgba(213,79,79,0.10)",
    redBorder: "rgba(213,79,79,0.28)",
    purple: "#8c6dff",
    purpleDim: "rgba(140,109,255,0.12)",
    purpleBorder: "rgba(140,109,255,0.28)",
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const INTERVIEW_META = {
    title: "B2B Sales Representative",
    company: "Demo Company",
    code: "DEMO-073298",
    created: "Apr 06, 2026, 12:10 PM",
    started: "Apr 07, 2026, 05:10 AM",
    passed: 4, needsReview: 0, failed: 0,
    totalCandidates: 4, avgScore: 79, passCount: 4,
    passThreshold: 70, reviewRange: "40–69", failThreshold: 40,
};

const EVAL_CARDS = {
    1: [
        { id: "ai", label: "AI Assessment", color: C.blue, dot: true, content: { type: "text", text: "Excellent communicator. Demonstrated strong CRM knowledge and pipeline discipline. High confidence in closing." } },
        { id: "profile", label: "Candidate Profile", color: C.green, dot: true, content: { type: "kv", items: [{ k: "Expected Salary", v: "11,000 SAR" }, { k: "Relocation", v: "Yes" }, { k: "Notice Period", v: "30 days" }] } },
        { id: "scores", label: "Score Breakdown", color: C.gold, dot: false, content: { type: "scores", items: [{ k: "Communication", v: 92 }, { k: "CRM Knowledge", v: 88 }, { k: "Closing Skills", v: 94 }] } },
        { id: "q1", label: "Q1: Tell me about your last role", color: C.purple, dot: false, content: { type: "text", text: "Managed a portfolio of 40+ enterprise accounts at a SaaS company. Consistently hit 120% of quota over 3 years." } },
        { id: "q2", label: "Q2: How do you handle rejection?", color: C.purple, dot: false, content: { type: "text", text: "I treat rejection as data. I log objections, refine my pitch, and follow up at the right cadence." } },
        { id: "q3", label: "Q3: Describe your pipeline process", color: C.purple, dot: false, content: { type: "text", text: "Weekly pipeline reviews, deal staging, and close-date tracking in Salesforce. I prioritize by deal size × probability." } },
    ],
    2: [
        { id: "ai", label: "AI Assessment", color: C.blue, dot: true, content: { type: "text", text: "Solid product understanding. Calm under pressure." } },
        { id: "profile", label: "Candidate Profile", color: C.green, dot: true, content: { type: "kv", items: [{ k: "Expected Salary", v: "9,000 SAR" }, { k: "Relocation", v: "No" }] } },
        { id: "scores", label: "Score Breakdown", color: C.gold, dot: false, content: { type: "scores", items: [{ k: "Communication", v: 60 }, { k: "CRM Knowledge", v: 65 }, { k: "Closing Skills", v: 62 }] } },
        { id: "q1", label: "Q1: Tell me about your last role", color: C.purple, dot: false, content: { type: "text", text: "Worked in B2B tech sales for 2 years, handled inbound leads and some outbound prospecting." } },
        { id: "q2", label: "Q2: How do you handle rejection?", color: C.purple, dot: false, content: { type: "text", text: "I stay positive and move to the next prospect. Rejection is part of the job." } },
        { id: "q3", label: "Q3: Describe your pipeline process", color: C.purple, dot: false, content: { type: "text", text: "I use a CRM to track all leads and follow up weekly." } },
    ],
    3: [
        { id: "ai", label: "AI Assessment", color: C.blue, dot: true, content: { type: "text", text: "Good interpersonal skills. Needs improvement in strategic pipeline management." } },
        { id: "profile", label: "Candidate Profile", color: C.green, dot: true, content: { type: "kv", items: [{ k: "Expected Salary", v: "10,000 SAR" }, { k: "Relocation", v: "Yes" }] } },
        { id: "scores", label: "Score Breakdown", color: C.gold, dot: false, content: { type: "scores", items: [{ k: "Communication", v: 78 }, { k: "CRM Knowledge", v: 70 }, { k: "Closing Skills", v: 74 }] } },
        { id: "q1", label: "Q1: Tell me about your last role", color: C.purple, dot: false, content: { type: "text", text: "3 years in pharma sales, managed 20 accounts across Riyadh." } },
        { id: "q2", label: "Q2: How do you handle rejection?", color: C.purple, dot: false, content: { type: "text", text: "I analyze what went wrong and adjust my approach for the next opportunity." } },
        { id: "q3", label: "Q3: Describe your pipeline process", color: C.purple, dot: false, content: { type: "text", text: "Monthly reviews with my manager, CRM updates, and target tracking." } },
    ],
    4: [
        { id: "ai", label: "AI Assessment", color: C.blue, dot: true, content: { type: "text", text: "Strong analytical mindset. Very structured in approach. Top performer profile." } },
        { id: "profile", label: "Candidate Profile", color: C.green, dot: true, content: { type: "kv", items: [{ k: "Expected Salary", v: "12,000 SAR" }, { k: "Relocation", v: "No" }, { k: "Notice Period", v: "Immediate" }] } },
        { id: "scores", label: "Score Breakdown", color: C.gold, dot: false, content: { type: "scores", items: [{ k: "Communication", v: 90 }, { k: "CRM Knowledge", v: 85 }, { k: "Closing Skills", v: 89 }] } },
        { id: "q1", label: "Q1: Tell me about your last role", color: C.purple, dot: false, content: { type: "text", text: "Led an enterprise sales team of 5 at a logistics tech company. Grew ARR by 40% in two years." } },
        { id: "q2", label: "Q2: How do you handle rejection?", color: C.purple, dot: false, content: { type: "text", text: "I document every lost deal for pattern analysis and use it to coach the team." } },
        { id: "q3", label: "Q3: Describe your pipeline process", color: C.purple, dot: false, content: { type: "text", text: "Weekly 1:1 pipeline reviews, Salesforce hygiene, probability weighting, and forecast accuracy tracking." } },
    ],
};

const CANDIDATES = [
    { id: 1, num: 1, initials: "SN", name: "Sara Nasser", email: "sara.demo@example.com", phone: "0500000004", session: "DEMO-SESSION-004", started: "Apr 07, 2026, 08:10 AM", status: "Completed", score: 91, rank: null, verdict: "pass" },
    { id: 2, num: 2, initials: "YK", name: "Yousef Khalid", email: "yousef.demo@example.com", phone: "0500000003", session: "DEMO-SESSION-003", started: "Apr 07, 2026, 07:10 AM", status: "Completed", score: 62, rank: null, verdict: "pass" },
    { id: 3, num: 3, initials: "MS", name: "Mona Saleh", email: "mona.demo@example.com", phone: "0500000002", session: "DEMO-SESSION-002", started: "Apr 07, 2026, 06:10 AM", status: "Completed", score: 74, rank: null, verdict: "pass" },
    { id: 4, num: 4, initials: "AA", name: "Ahmad Alotaibi", email: "ahmad.demo@example.com", phone: "0500000001", session: "DEMO-SESSION-001", started: "Apr 07, 2026, 05:10 AM", status: "Completed", score: 88, rank: null, verdict: "pass" },
    { id: 5, num: 5, initials: "LH", name: "Layan Hasan", email: "layan.demo@example.com", phone: "0500000005", session: "DEMO-SESSION-005", started: "Apr 07, 2026, 09:15 AM", status: "Completed", score: 68, rank: null, verdict: "review" },
    { id: 6, num: 6, initials: "RK", name: "Rashed Kareem", email: "rashed.demo@example.com", phone: "0500000006", session: "DEMO-SESSION-006", started: "Apr 07, 2026, 09:45 AM", status: "Completed", score: 83, rank: null, verdict: "pass" },
    { id: 7, num: 7, initials: "NF", name: "Noura Faris", email: "noura.demo@example.com", phone: "0500000007", session: "DEMO-SESSION-007", started: "Apr 07, 2026, 10:05 AM", status: "Completed", score: 77, rank: null, verdict: "pass" },
    { id: 8, num: 8, initials: "OB", name: "Omar Bashir", email: "omar.demo@example.com", phone: "0500000008", session: "DEMO-SESSION-008", started: "Apr 07, 2026, 10:25 AM", status: "Completed", score: 39, rank: null, verdict: "fail" },
    { id: 9, num: 9, initials: "DM", name: "Dana Mahmoud", email: "dana.demo@example.com", phone: "0500000009", session: "DEMO-SESSION-009", started: "Apr 07, 2026, 10:55 AM", status: "Completed", score: 72, rank: null, verdict: "pass" },
    { id: 10, num: 10, initials: "FA", name: "Faisal Amer", email: "faisal.demo@example.com", phone: "0500000010", session: "DEMO-SESSION-010", started: "Apr 07, 2026, 11:20 AM", status: "Completed", score: 81, rank: null, verdict: "pass" },
    { id: 11, num: 11, initials: "HM", name: "Huda Mansour", email: "huda.demo@example.com", phone: "0500000011", session: "DEMO-SESSION-011", started: "Apr 07, 2026, 11:40 AM", status: "Completed", score: 66, rank: null, verdict: "review" },
    { id: 12, num: 12, initials: "TA", name: "Tariq Adel", email: "tariq.demo@example.com", phone: "0500000012", session: "DEMO-SESSION-012", started: "Apr 07, 2026, 12:00 PM", status: "Completed", score: 87, rank: null, verdict: "pass" },
];

const INTERVIEW_TABS = ["First Interview", "Second Interview (0)"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const verdictStyle = (v) => ({
    pass: { bg: C.greenDim, border: C.greenBorder, color: C.green, label: "Pass" },
    review: { bg: C.yellowDim, border: C.yellowBorder, color: C.yellow, label: "Needs Review" },
    fail: { bg: C.redDim, border: C.redBorder, color: C.red, label: "Fail" },
})[v] || { bg: C.goldDim, border: C.goldBorder, color: C.goldBright, label: "—" };

const scoreColor = (s) => s >= 70 ? C.green : s >= 40 ? C.yellow : C.red;

const avatarColors = ["#3a7bd5", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444"];
const avatarColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const getCaptionSegments = (candidate) => {
    const firstName = candidate.name.split(" ")[0];
    return [
        { id: `${candidate.id}-1`, time: "00:04", speaker: "AI Intro", text: `Welcome ${firstName}. This session will focus on communication style, sales process ownership, and your approach to closing.` },
        { id: `${candidate.id}-2`, time: "00:21", speaker: firstName, text: "Thank you. I am excited to walk through my background and share how I manage a consistent pipeline." },
        { id: `${candidate.id}-3`, time: "00:47", speaker: "Interviewer", text: "Tell me about the type of accounts you handled recently and the metrics you were responsible for." },
        { id: `${candidate.id}-4`, time: "01:16", speaker: firstName, text: "I managed mid-market and enterprise opportunities, tracked conversion by stage, and kept a strong follow-up rhythm in the CRM." },
        { id: `${candidate.id}-5`, time: "01:54", speaker: "Interviewer", text: "How do you respond when a qualified prospect goes quiet late in the cycle?" },
        { id: `${candidate.id}-6`, time: "02:20", speaker: firstName, text: "I review the last objection, tailor the next message to business impact, and reopen the conversation with a specific next step." },
        { id: `${candidate.id}-7`, time: "02:58", speaker: "AI Insight", text: "Candidate shows structured thinking, clear ownership of the sales process, and a measured communication style under pressure." },
        { id: `${candidate.id}-8`, time: "03:31", speaker: "Summary", text: `Session ${candidate.session} indicates steady confidence, relevant experience, and an interview score of ${candidate.score} out of 100.` },
    ];
};

// ─── Small Components ─────────────────────────────────────────────────────────
const Pill = ({ label, color, bg, border, small }) => (
    <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: small ? "3px 9px" : "5px 13px",
        borderRadius: 999, fontSize: small ? 10.5 : 12, fontWeight: 700,
        background: bg, border: `1px solid ${border}`, color,
        letterSpacing: "0.06em", whiteSpace: "nowrap",
    }}>{label}</span>
);

const Avatar = ({ initials, name, size = 36 }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: avatarColor(name),
        display: "grid", placeItems: "center",
        fontSize: Math.round(size * 0.35), fontWeight: 700, color: "#fff",
        letterSpacing: "0.04em",
    }}>{initials}</div>
);

const IconBtn = ({ children, onClick, title, active, danger, small }) => (
    <button title={title} onClick={onClick} style={{
        width: small ? 28 : 32, height: small ? 28 : 32, borderRadius: small ? 7 : 8,
        border: `1px solid ${danger ? C.redBorder : active ? C.goldBorder : C.line}`,
        background: danger ? C.redDim : active ? C.goldDim : "transparent",
        color: danger ? C.red : active ? C.goldBright : C.inkMuted,
        display: "grid", placeItems: "center", cursor: "pointer", transition: "all 0.18s",
    }}
        onMouseEnter={e => { e.currentTarget.style.background = danger ? "rgba(255,107,107,0.18)" : C.goldDim; e.currentTarget.style.borderColor = danger ? C.red : C.goldBorder; e.currentTarget.style.color = danger ? "#ffaaaa" : C.inkSoft; }}
        onMouseLeave={e => { e.currentTarget.style.background = danger ? C.redDim : active ? C.goldDim : "transparent"; e.currentTarget.style.borderColor = danger ? C.redBorder : active ? C.goldBorder : C.line; e.currentTarget.style.color = danger ? C.red : active ? C.goldBright : C.inkMuted; }}
    >{children}</button>
);

const CopyBtn = ({ value, small }) => {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard?.writeText(value).catch(() => { }); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
            style={{
                height: small ? 22 : 26, padding: "0 8px", borderRadius: 6,
                border: `1px solid ${copied ? C.greenBorder : C.line}`,
                background: copied ? C.greenDim : "rgba(255,255,255,0.55)",
                color: copied ? C.green : C.inkFaint,
                fontSize: 10.5, fontWeight: 600, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 4,
                fontFamily: "'Sora', sans-serif", transition: "all 0.18s", whiteSpace: "nowrap",
            }}
        >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
};

const Input = ({ value, onChange, placeholder, icon: Icon }) => (
    <div style={{ position: "relative" }}>
        {Icon && <Icon size={14} color={C.inkFaint} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />}
        <input
            value={value} onChange={onChange} placeholder={placeholder}
            style={{
                width: "100%", height: 38, paddingLeft: Icon ? 34 : 12, paddingRight: 12,
                background: C.bgInput, border: `1px solid ${C.line}`,
                borderRadius: 10, color: C.inkSoft, fontSize: 13, outline: "none",
                fontFamily: "'Sora', sans-serif", transition: "border-color 0.18s",
            }}
            onFocus={e => e.target.style.borderColor = C.goldBorder}
            onBlur={e => e.target.style.borderColor = C.line}
        />
    </div>
);

const SelectField = ({ value, onChange, children }) => (
    <div style={{ position: "relative" }}>
        <select value={value} onChange={onChange} style={{
            width: "100%", height: 38, padding: "0 32px 0 12px",
            background: C.bgInput, border: `1px solid ${C.line}`,
            borderRadius: 10, color: C.inkSoft, fontSize: 13, outline: "none",
            fontFamily: "'Sora', sans-serif", cursor: "pointer", appearance: "none",
            transition: "border-color 0.18s",
        }}
            onFocus={e => e.target.style.borderColor = C.goldBorder}
            onBlur={e => e.target.style.borderColor = C.line}
        >{children}</select>
        <ChevronDown size={13} color={C.inkFaint} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
);

// ─── Score Bar ────────────────────────────────────────────────────────────────
const ScoreBar = ({ score }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(score), minWidth: 50, fontFamily: "'DM Serif Display', serif" }}>
            {score} <span style={{ fontSize: 11, color: C.inkFaint, fontWeight: 400, fontFamily: "'Sora', sans-serif" }}>/ 100</span>
        </span>
        <div style={{ flex: 1, maxWidth: 120, height: 5, borderRadius: 99, background: C.line, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${score}%`, borderRadius: 99, background: scoreColor(score), transition: "width 0.4s ease" }} />
        </div>
    </div>
);

// ─── Evaluation Card Carousel ─────────────────────────────────────────────────
const EvalCarousel = ({ candidateId, lang, setLang, hideBorder }) => {
    const [idx, setIdx] = useState(0);
    const cards = EVAL_CARDS[candidateId] || [];
    const card = cards[idx];

    return (
        <div style={{
            background: hideBorder ? "transparent" : "rgba(4,8,20,0.6)", 
            borderTop: hideBorder ? "none" : `1px solid ${C.line}`,
            borderLeft: hideBorder ? "none" : `3px solid ${C.green}`,
            display: "flex", flexDirection: "column", height: "100%"
        }}>
            {/* Eval header */}
            <div style={{
                padding: "12px 20px", borderBottom: `1px solid ${C.line}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.inkFaint }}>
                    Evaluation
                </div>
                {/* Lang toggle */}
                <div style={{ display: "flex", gap: 4, background: "rgba(255,250,242,0.80)", border: `1px solid rgba(184,149,90,0.18)`, borderRadius: 9, padding: 3 }}>
                    {["EN", "AR"].map(l => (
                        <button key={l} onClick={() => setLang(l)} style={{
                            height: 26, padding: "0 12px", borderRadius: 7,
                            border: `1px solid ${lang === l ? C.goldBorder : "transparent"}`,
                            background: lang === l ? C.goldDim : "transparent",
                            color: lang === l ? C.goldBright : C.inkMuted,
                            fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                            fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
                        }}>{l}</button>
                    ))}
                </div>
            </div>

            <div style={{ padding: "16px 20px", display: "flex", alignItems: "stretch", gap: 0 }}>
                {/* Prev arrow */}
                <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0, alignSelf: "center",
                    border: `1px solid rgba(184,149,90,0.18)`, background: "rgba(255,250,242,0.90)",
                    color: idx === 0 ? C.inkFaint : C.inkSoft, cursor: idx === 0 ? "not-allowed" : "pointer",
                    display: "grid", placeItems: "center", marginRight: 12, transition: "all 0.18s",
                }}
                    onMouseEnter={e => { if (idx > 0) { e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.color = C.goldBright; } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = idx === 0 ? C.inkFaint : C.inkSoft; }}
                ><ChevronLeft size={16} /></button>

                {/* Card area */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {card && (
                        <div style={{
                            background: "rgba(255,255,255,0.98)", border: `1px solid rgba(184,149,90,0.18)`,
                            borderRadius: 16, overflow: "hidden",
                        }}>
                            {/* Card header */}
                            <div style={{
                                padding: "12px 16px", borderBottom: `2px solid ${card.color}`,
                                display: "flex", alignItems: "center", gap: 8,
                                background: `${card.color}08`,
                            }}>
                                {card.dot && <span style={{ width: 9, height: 9, borderRadius: "50%", background: card.color, boxShadow: `0 0 6px ${card.color}`, flexShrink: 0 }} />}
                                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.inkSoft }}>{card.label}</span>
                            </div>

                            {/* Card body */}
                            <div style={{ padding: "16px" }}>
                                {card.content.type === "text" && (
                                    <p style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.75, margin: 0 }}>{card.content.text}</p>
                                )}
                                {card.content.type === "kv" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                        {card.content.items.map(({ k, v }, i) => (
                                            <div key={k} style={{
                                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                                padding: "10px 0",
                                                borderBottom: i < card.content.items.length - 1 ? `1px solid ${C.line}` : "none",
                                            }}>
                                                <span style={{ fontSize: 13, color: C.inkMuted }}>{k}</span>
                                                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.inkSoft }}>{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {card.content.type === "scores" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {card.content.items.map(({ k, v }) => (
                                            <div key={k}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                                    <span style={{ fontSize: 12.5, color: C.inkMuted }}>{k}</span>
                                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: scoreColor(v) }}>{v}</span>
                                                </div>
                                                <div style={{ height: 5, borderRadius: 99, background: C.line, overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${v}%`, borderRadius: 99, background: scoreColor(v) }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Dots */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
                        {cards.map((_, i) => (
                            <button key={i} onClick={() => setIdx(i)} style={{
                                width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
                                background: i === idx ? C.goldBright : "rgba(184,149,90,0.25)",
                                border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s",
                            }} />
                        ))}
                    </div>
                </div>

                {/* Next arrow */}
                <button onClick={() => setIdx(i => Math.min(cards.length - 1, i + 1))} disabled={idx === cards.length - 1} style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0, alignSelf: "center",
                    border: `1px solid rgba(184,149,90,0.18)`, background: "rgba(255,250,242,0.90)",
                    color: idx === cards.length - 1 ? C.inkFaint : C.inkSoft,
                    cursor: idx === cards.length - 1 ? "not-allowed" : "pointer",
                    display: "grid", placeItems: "center", marginLeft: 12, transition: "all 0.18s",
                }}
                    onMouseEnter={e => { if (idx < cards.length - 1) { e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.color = C.goldBright; } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = idx === cards.length - 1 ? C.inkFaint : C.inkSoft; }}
                ><ChevronRight size={16} /></button>
            </div>
        </div>
    );
};

// ─── Candidate Row ────────────────────────────────────────────────────────────
const CandidateRow = ({ c, expanded, onToggle, checked, onCheck, lang, setLang }) => {
    const vs = verdictStyle(c.verdict);
    const [showCaptions, setShowCaptions] = useState(false);
    const captionSegments = getCaptionSegments(c);
    return (
        <div style={{
            border: `1px solid rgba(184,149,90,0.18)`,
            borderRadius: 16, overflow: "hidden",
            background: expanded ? "rgba(255,250,242,0.98)" : "rgba(255,250,242,0.92)",
            transition: "all 0.2s ease",
            boxShadow: expanded ? `0 6px 24px rgba(184,149,90,0.18)` : "none",
        }}>
            {/* Main row */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "28px 44px 1fr 140px 130px 180px 90px 90px 120px",
                gap: 10, padding: "14px 16px", alignItems: "center",
                borderLeft: `3px solid ${expanded ? C.green : "transparent"}`,
                transition: "border-color 0.2s",
            }}>
                {/* Checkbox */}
                <div>
                    <input type="checkbox" checked={checked} onChange={onCheck} style={{ cursor: "pointer", accentColor: C.goldBright, width: 15, height: 15 }} />
                </div>

                {/* Num */}
                <div style={{ fontSize: 13, color: C.inkFaint, fontWeight: 600, textAlign: "center" }}>{c.num}</div>

                {/* Candidate info */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Avatar initials={c.initials} name={c.name} size={36} />
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.inkSoft, marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color: C.inkFaint, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.email}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11, color: C.inkFaint, fontFamily: "monospace" }}>Session: {c.session}</span>
                            <CopyBtn value={c.session} small />
                        </div>
                    </div>
                </div>

                {/* Phone */}
                <div style={{ fontSize: 13, color: C.inkMuted, fontFamily: "monospace" }}>{c.phone}</div>

                {/* Started */}
                <div style={{ fontSize: 11.5, color: C.inkFaint, lineHeight: 1.5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 1 }}>
                        <Clock size={10} color={C.inkFaint} /> {c.started}
                    </div>
                </div>

                {/* Interview Status */}
                <div>
                    <Pill
                        label={c.status}
                        color={c.status === "Completed" ? C.green : C.yellow}
                        bg={c.status === "Completed" ? C.greenDim : C.yellowDim}
                        border={c.status === "Completed" ? C.greenBorder : C.yellowBorder}
                        small
                    />
                </div>

                {/* Score */}
                <div><ScoreBar score={c.score} /></div>

                {/* Qualifier rank */}
                <div style={{ fontSize: 13, color: C.inkFaint, textAlign: "center" }}>{c.rank ?? "—"}</div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <Pill label={vs.label} color={vs.color} bg={vs.bg} border={vs.border} small />
                    <div style={{ display: "flex", gap: 4, marginTop: 4, width: "100%", justifyContent: "flex-start" }}>
                        <button
                            onClick={onToggle}
                            style={{
                                height: 26, padding: "0 10px", borderRadius: 7,
                                border: `1px solid ${expanded ? C.goldBorder : C.line}`,
                                background: expanded ? C.goldDim : "transparent",
                                color: expanded ? C.goldBright : C.inkMuted,
                                fontSize: 11, fontWeight: 600, cursor: "pointer",
                                fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
                                display: "flex", alignItems: "center", gap: 5,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.color = C.goldBright; e.currentTarget.style.background = C.goldDim; }}
                            onMouseLeave={e => { if (!expanded) { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.inkMuted; e.currentTarget.style.background = "transparent"; } }}
                        >
                            <Eye size={10} /> {expanded ? "Hide" : "View"}
                        </button>
                        {/* R W I D icons */}
                        {[
                            { label: "R", title: "Resume", color: C.blue },
                            { label: "W", title: "Workspace", color: C.green },
                            { label: "I", title: "Interview", color: C.yellow },
                            { label: "D", title: "Delete", color: C.red },
                        ].map(({ label, title, color }) => (
                            <button key={label} title={title} style={{
                                width: 22, height: 22, borderRadius: 6,
                                border: `1px solid ${C.line}`, background: "transparent",
                                color: C.inkFaint, fontSize: 10, fontWeight: 700, cursor: "pointer",
                                display: "grid", placeItems: "center", transition: "all 0.15s",
                                fontFamily: "'Sora', sans-serif",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.background = `${color}15`; e.currentTarget.style.color = color; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.inkFaint; }}
                            >{label}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Evaluation panel */}
            {expanded && (
                <div className="inter-expanded-grid" style={{ 
                    background: "rgba(255,250,242,0.94)", 
                    borderTop: `1px solid rgba(184,149,90,0.18)`,
                    borderLeft: `3px solid ${vs.color}`,
                }}>
                    {/* Video Player Area */}
                    <div className="inter-video-border" style={{ 
                        padding: "16px 20px", 
                        borderRight: `1px solid rgba(184,149,90,0.18)`,
                        display: "flex", flexDirection: "column"
                    }}>
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            gap: 12, marginBottom: 12, flexWrap: "wrap"
                        }}>
                            <div style={{ 
                                fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", 
                                textTransform: "uppercase", color: C.inkFaint,
                                display: "flex", alignItems: "center", gap: 8
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, boxShadow: `0 0 6px ${C.red}` }}></span>
                                Interview Recording
                            </div>
                            <button
                                type="button"
                                aria-pressed={showCaptions}
                                onClick={() => setShowCaptions((value) => !value)}
                                style={{
                                    height: 34,
                                    padding: "0 12px",
                                    borderRadius: 10,
                                    border: `1px solid ${showCaptions ? C.blueBorder : C.line}`,
                                    background: showCaptions ? C.blueDim : "rgba(255,255,255,0.7)",
                                    color: showCaptions ? C.blue : C.inkMuted,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    transition: "all 0.18s",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    fontFamily: "'Sora', sans-serif",
                                    boxShadow: showCaptions ? "0 8px 18px rgba(58,123,213,0.12)" : "none",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = showCaptions ? C.blueBorder : C.goldBorder;
                                    e.currentTarget.style.background = showCaptions ? C.blueDim : C.goldDim;
                                    e.currentTarget.style.color = showCaptions ? C.blue : C.inkSoft;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = showCaptions ? C.blueBorder : C.line;
                                    e.currentTarget.style.background = showCaptions ? C.blueDim : "rgba(255,255,255,0.7)";
                                    e.currentTarget.style.color = showCaptions ? C.blue : C.inkMuted;
                                }}
                            >
                                {showCaptions ? <CaptionsOff size={14} /> : <Captions size={14} />}
                                {showCaptions ? "Hide Captions" : "Show Captions"}
                            </button>
                        </div>

                        <div className={`inter-recording-shell ${showCaptions ? "captions-on" : "captions-off"}`}>
                            {showCaptions && (
                                <div className="inter-captions-panel">
                                    <div style={{
                                        padding: "14px 16px",
                                        borderBottom: `1px solid ${C.line}`,
                                        background: "linear-gradient(180deg, rgba(58,123,213,0.10), rgba(58,123,213,0.02))",
                                    }}>
                                        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.blue, marginBottom: 4 }}>
                                            Captions
                                        </div>
                                        <div style={{ fontSize: 12.5, color: C.inkMuted, lineHeight: 1.5 }}>
                                            Scroll through the interview transcript while the recording stays visible.
                                        </div>
                                    </div>
                                    <div className="inter-captions-scroll">
                                        {captionSegments.map((segment, index) => (
                                            <div key={segment.id} className="inter-caption-card">
                                                <div style={{
                                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                                    gap: 8, marginBottom: 8
                                                }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center",
                                                        height: 24, padding: "0 10px", borderRadius: 999,
                                                        background: index % 2 === 0 ? C.blueDim : C.goldDim,
                                                        border: `1px solid ${index % 2 === 0 ? C.blueBorder : C.goldBorder}`,
                                                        color: index % 2 === 0 ? C.blue : C.gold,
                                                        fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em",
                                                        textTransform: "uppercase"
                                                    }}>
                                                        {segment.time}
                                                    </span>
                                                    <span style={{ fontSize: 11.5, fontWeight: 700, color: C.inkMuted }}>
                                                        {segment.speaker}
                                                    </span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: C.inkSoft }}>
                                                    {segment.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{
                                width: "100%",
                                minWidth: 0,
                                minHeight: showCaptions ? 420 : 580,
                                borderRadius: 12,
                                overflow: "hidden",
                                border: `1px solid rgba(184,149,90,0.18)`,
                                background: C.bgInput,
                                position: "relative",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
                            }}>
                                <iframe
                                    src="https://www.youtube.com/embed/n-cH2WyYJiA?rel=0&modestbranding=1&playsinline=1"
                                    title="Candidate Interview Recording"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Evaluation */}
                    <div style={{ minWidth: 0 }}>
                        <EvalCarousel candidateId={c.id} lang={lang} setLang={setLang} hideBorder={true} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default function InterviewResults({ onClose, inline = false }) {
    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");
    const [pageSize, setPageSize] = useState("10");
    const [completedOnly, setCompletedOnly] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState(new Set());
    const [lang, setLang] = useState("EN");
    const [page, setPage] = useState(1);
    const isInline = inline;
    const interRootStyle = isInline
      ? {
          position: "relative",
          inset: "auto",
          zIndex: "auto",
          display: "block",
          alignItems: "stretch",
          justifyContent: "stretch",
          fontFamily: "'Sora', sans-serif",
          color: C.inkSoft,
          animation: "none",
          padding: 0,
          background: "transparent",
        }
      : {
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Sora', sans-serif",
          color: C.inkSoft,
          animation: "interFadeIn 0.25s ease forwards",
          padding: "clamp(10px,2vw,20px)",
        };
    const shellStyle = {
      position: "relative",
      zIndex: 1,
      overflowY: "auto",
      borderRadius: 22,
      border: isInline ? "none" : `1px solid ${C.line}`,
      background: isInline ? "transparent" : "radial-gradient(ellipse 80vw 55vh at 100% -5%, rgba(184,149,90,0.12) 0%, transparent 55%), " +
          "radial-gradient(ellipse 60vw 45vh at -5% 95%, rgba(95,158,255,0.08) 0%, transparent 50%), " +
          "#fbf5ef",
      animation: isInline ? "none" : "interSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) forwards",
      boxShadow: isInline ? "none" : "inset 0 1px 0 rgba(184,149,90,0.18)",
      padding: isInline ? 0 : "clamp(16px,2.5vw,32px)",
      width: "100%",
      maxWidth: "100%",
      maxHeight: isInline ? "none" : "94vh",
    };

    const m = useMemo(() => {
        const totalCandidates = CANDIDATES.length;
        const avgScore = totalCandidates
            ? Math.round(CANDIDATES.reduce((total, candidate) => total + candidate.score, 0) / totalCandidates)
            : 0;
        const passCount = CANDIDATES.filter((candidate) => candidate.verdict === "pass").length;
        const needsReview = CANDIDATES.filter((candidate) => candidate.verdict === "review").length;
        const failed = CANDIDATES.filter((candidate) => candidate.verdict === "fail").length;

        return {
            ...INTERVIEW_META,
            totalCandidates,
            avgScore,
            passCount,
            passed: passCount,
            needsReview,
            failed,
        };
    }, []);

    const filtered = useMemo(() => {
        let list = [...CANDIDATES];
        if (search) list = list.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search)
        );
        if (statusFilter !== "All") list = list.filter(c =>
            statusFilter === "Pass" ? c.verdict === "pass" :
                statusFilter === "Needs Review" ? c.verdict === "review" : c.verdict === "fail"
        );
        if (completedOnly) list = list.filter(c => c.status === "Completed");
        if (sortBy === "Newest") list = list.sort((a, b) => b.id - a.id);
        if (sortBy === "Highest Score") list = list.sort((a, b) => b.score - a.score);
        if (sortBy === "Lowest Score") list = list.sort((a, b) => a.score - b.score);
        return list;
    }, [search, statusFilter, completedOnly, sortBy]);

    const pagination = useMemo(
        () => paginateItems(filtered, page, pageSize),
        [filtered, page, pageSize]
    );
    const totalPages = pagination.totalPages;
    const paginated = pagination.pageItems;

    useEffect(() => {
        if (page !== pagination.currentPage) {
            setPage(pagination.currentPage);
        }
    }, [page, pagination.currentPage]);

    const allChecked = paginated.length > 0 && paginated.every(c => checkedIds.has(c.id));
    const toggleAll = () => {
        if (allChecked) setCheckedIds(s => { const n = new Set(s); paginated.forEach(c => n.delete(c.id)); return n; });
        else setCheckedIds(s => { const n = new Set(s); paginated.forEach(c => n.add(c.id)); return n; });
    };

    const statCards = [
        { label: "Total Candidates", value: m.totalCandidates, sub: `Completed: ${m.totalCandidates}`, color: C.blue, icon: Users },
        { label: "Average Score", value: `${m.avgScore}/100`, sub: "Based on completed", color: C.goldBright, icon: BarChart2 },
        { label: "Pass", value: m.passCount, sub: `Score ≥ ${m.passThreshold}`, color: C.green, icon: CheckCircle2 },
        { label: "Needs Review / Fail", value: `${m.needsReview} / ${m.failed}`, sub: `${m.reviewRange} / < ${m.failThreshold}`, color: C.yellow, icon: AlertCircle },
    ];
    useEffect(() => {
        if (!isInline) {
            const onKeyDown = (event) => {
                if (event.key === "Escape") onClose?.();
            };
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", onKeyDown);
            return () => {
                document.removeEventListener("keydown", onKeyDown);
                document.body.style.overflow = previousOverflow;
            };
        }
        return undefined;
    }, [onClose, isInline]);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .inter-modal * { box-sizing: border-box; }
        .inter-modal { scrollbar-width: thin; scrollbar-color: rgba(184,149,90,0.2) transparent; }
        .inter-shell { width: 100%; max-width: 100%; max-height: none; }
        .inter-content { width: 100%; max-width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .inter-hero { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
        .inter-expanded-grid { background: rgba(255,250,242,0.92); border-top: 1px solid rgba(184,149,90,0.18); }
        .inter-video-border { background: rgba(255,255,255,0.98); border-right: 1px solid rgba(184,149,90,0.18); }
        .inter-recording-shell { display: block; }
        .inter-recording-shell.captions-on { display: grid; grid-template-columns: minmax(260px, 320px) minmax(0, 1fr); gap: 16px; align-items: stretch; }
        .inter-captions-panel {
          display: flex;
          flex-direction: column;
          min-width: 0;
          border: 1px solid rgba(184,149,90,0.18);
          border-radius: 14px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(251,245,235,0.98));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.78);
        }
        .inter-captions-scroll {
          max-height: 580px;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: rgba(184,149,90,0.24) transparent;
        }
        .inter-caption-card {
          padding: 12px 13px;
          border: 1px solid rgba(184,149,90,0.16);
          border-radius: 12px;
          background: rgba(255,255,255,0.86);
        }
        .inter-hero-top { width: 100%; display: flex; justify-content: flex-end; }
        .inter-modal input::placeholder { color: rgba(44, 30, 10, 0.28); }
        .inter-modal input[type="checkbox"] { accent-color: #f0c97a; }
        .inter-modal select option { background: #fbf1df; color: #1c1409; }
        @media (max-width: 980px) {
          .inter-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 900px) {
          .inter-expanded-grid { grid-template-columns: 1fr !important; }
          .inter-video-border { border-right: none !important; border-bottom: 1px solid rgba(184,149,90,0.16) !important; }
          .inter-recording-shell.captions-on { grid-template-columns: 1fr !important; }
          .inter-captions-scroll { max-height: 260px; }
        }
        @media (max-width: 720px) {
          .inter-shell { width: 96vw; max-height: 96vh; }
          .inter-content { max-width: 100%; gap: 16px; }
          .inter-hero-top { justify-content: center; }
          .inter-filter-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1100px) {
          .cand-grid { grid-template-columns: 28px 44px 1fr 110px 120px 130px 80px 80px 110px !important; }
        }
        @media (max-width: 860px) {
          .cand-grid { grid-template-columns: 28px 1fr 100px 100px !important; }
          .cand-hide-md { display: none !important; }
        }
        @keyframes interFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes interSlideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

            <div
                className="inter-modal"
                style={interRootStyle}
            >
                {/* Backdrop — click to close */}
                {!isInline && (
                  <div
                    onClick={onClose}
                    style={{ position: "absolute", inset: 0, background: "rgba(3,5,14,0.78)" }}
                  />
                )}

                {/* Scrollable content panel */}
                <div
                    className="inter-shell"
                    style={shellStyle}
                >
                <div className="inter-content">

                    {/* Hero Header */}
                        {/* Interview Details card */}
                    <div style={{
                        background: C.bgPanel, border: `1px solid ${C.line}`,
                        borderRadius: 22, padding: "20px 22px", backdropFilter: "blur(16px)",
                    }}>
                        {/* Header row */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 6 }}>Interview Details</div>
                                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", fontWeight: 400, color: C.inkSoft, margin: "0 0 3px" }}>{m.title}</h2>
                                <div style={{ fontSize: 13, color: C.inkMuted }}>{m.company}</div>
                            </div>
                            <IconBtn title="More options"><MoreHorizontal size={15} /></IconBtn>
                        </div>

                        {/* Meta chips */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                            {[
                                { label: `Code: ${m.code}`, color: C.inkMuted, bg: "rgba(255,255,255,0.55)", border: C.line },
                                { label: `Created: ${m.created}`, color: C.inkMuted, bg: "rgba(255,255,255,0.55)", border: C.line },
                                { label: `Started: ${m.started}`, color: C.inkMuted, bg: "rgba(255,255,255,0.55)", border: C.line },
                            ].map(({ label, color, bg, border }) => (
                                <span key={label} style={{
                                    fontSize: 12, color, background: bg, border: `1px solid ${border}`,
                                    borderRadius: 8, padding: "5px 10px", fontFamily: "monospace",
                                }}>{label}</span>
                            ))}
                        </div>

                        {/* Verdict pills */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                            <Pill label={`Passed: ${m.passed}`} color={C.green} bg={C.greenDim} border={C.greenBorder} />
                            <Pill label={`Needs Review: ${m.needsReview}`} color={C.yellow} bg={C.yellowDim} border={C.yellowBorder} />
                            <Pill label={`Failed: ${m.failed}`} color={C.red} bg={C.redDim} border={C.redBorder} />
                        </div>

                        {/* Stat cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                            {statCards.map(({ label, value, sub, color, icon: Icon }) => (
                                <div key={label} style={{
                                    background: "rgba(255,250,242,0.92)", border: `1px solid rgba(184,149,90,0.18)`,
                                    borderRadius: 14, padding: "14px 16px",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint }}>{label}</div>
                                        <Icon size={14} color={color} />
                                    </div>
                                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
                                    <div style={{ fontSize: 11.5, color: C.inkFaint }}>{sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Interview type tabs ── */}
                    <div style={{ display: "flex", gap: 4, background: C.bgPanel, border: `1px solid rgba(184,149,90,0.18)`, borderRadius: 14, padding: 5, backdropFilter: "blur(12px)", alignSelf: "center" }}>
                        {INTERVIEW_TABS.map((tab, i) => (
                            <button key={tab} onClick={() => setActiveTab(i)} style={{
                                height: 36, padding: "0 18px", borderRadius: 10,
                                border: `1px solid ${activeTab === i ? C.goldBorder : "transparent"}`,
                                background: activeTab === i ? "rgba(184,149,90,0.18)" : "transparent",
                                color: activeTab === i ? C.inkSoft : C.inkMuted,
                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                                fontFamily: "'Sora', sans-serif", transition: "all 0.18s", whiteSpace: "nowrap",
                            }}>{tab}</button>
                        ))}
                    </div>

                    {/* ── Filter bar ── */}
                    <div style={{
                        background: C.bgPanel, border: `1px solid ${C.line}`,
                        borderRadius: 18, padding: "16px 20px", backdropFilter: "blur(12px)",
                    }}>
                        <div className="inter-filter-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <div>
                                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 6 }}>Search</div>
                                <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, or phone…" icon={Search} />
                            </div>
                            <div style={{ minWidth: 130 }}>
                                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 6 }}>Status</div>
                                <SelectField value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                                    <option>All</option>
                                    <option>Pass</option>
                                    <option>Needs Review</option>
                                    <option>Fail</option>
                                </SelectField>
                            </div>
                            <div style={{ minWidth: 160 }}>
                                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 6 }}>Sort</div>
                                <SelectField value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
                                    <option>Newest</option>
                                    <option>Highest Score</option>
                                    <option>Lowest Score</option>
                                </SelectField>
                            </div>
                            <div style={{ minWidth: 110 }}>
                                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 6 }}>Page Size</div>
                                <SelectField value={pageSize} onChange={e => { setPageSize(e.target.value); setPage(1); }}>
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </SelectField>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, flexWrap: "wrap", gap: 10 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.inkMuted, userSelect: "none" }}>
                                <input type="checkbox" checked={completedOnly} onChange={() => { setCompletedOnly(v => !v); setPage(1); }} />
                                Show only completed interviews
                            </label>
                            <div style={{
                                fontSize: 12.5, color: C.inkMuted, fontWeight: 600,
                                background: "rgba(255,255,255,0.55)", border: `1px solid ${C.line}`,
                                borderRadius: 8, padding: "5px 12px",
                            }}>
                                Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>

                    {/* ── Candidates Results ── */}
                    <div style={{
                        background: C.bgPanel, border: `1px solid ${C.line}`,
                        borderRadius: 22, backdropFilter: "blur(12px)", overflow: "hidden",
                    }}>
                        {/* Section header */}
                        <div style={{
                            padding: "16px 20px", borderBottom: `1px solid ${C.line}`,
                            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", fontWeight: 400, color: C.inkSoft, margin: 0 }}>
                                    Candidates Results
                                </h2>
                                <span style={{
                                    fontSize: 12, color: C.inkMuted, border: `1px solid ${C.line}`,
                                    borderRadius: 999, padding: "2px 10px", fontWeight: 600,
                                }}>{filtered.length} candidates</span>
                            </div>
                            <div style={{ fontSize: 12.5, color: C.inkFaint }}>
                                Page <strong style={{ color: C.inkSoft }}>{page}</strong> / {totalPages}
                            </div>
                        </div>

                        {/* Column headers */}
                        <div className="cand-grid" style={{
                            display: "grid",
                            gridTemplateColumns: "28px 44px 1fr 140px 130px 180px 90px 90px 120px",
                            gap: 10, padding: "10px 16px",
                            borderBottom: `1px solid ${C.line}`,
                            background: "rgba(255,255,255,0.015)",
                        }}>
                            <div>
                                <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ cursor: "pointer", accentColor: C.goldBright, width: 15, height: 15 }} />
                            </div>
                            <div style={{ fontSize: 10.5, fontWeight: 700, color: C.inkFaint, letterSpacing: "0.1em" }}>#</div>
                            {["Candidate", "Phone", "Interview Status", "Interview Status", "Initial Score", "Qualifier Rank", "Action"].map((h, i) => (
                                <div key={i} style={{ fontSize: 10.5, fontWeight: 700, color: C.inkFaint, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                    {["Candidate", "Phone", "Started", "Status", "Initial Score", "Qualifier Rank", "Action"][i]}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {paginated.length === 0 ? (
                                <div style={{ padding: "48px 20px", textAlign: "center", color: C.inkFaint, fontSize: 14 }}>
                                    No candidates match your filters.
                                </div>
                            ) : paginated.map(c => (
                                <div key={c.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                                    <CandidateRow
                                        c={c}
                                        expanded={expandedId === c.id}
                                        onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
                                        checked={checkedIds.has(c.id)}
                                        onCheck={() => setCheckedIds(s => { const n = new Set(s); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; })}
                                        lang={lang}
                                        setLang={setLang}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination footer */}
                        <div style={{
                            padding: "14px 20px", borderTop: `1px solid ${C.line}`,
                            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
                        }}>
                            <div style={{ fontSize: 13, color: C.inkMuted }}>
                                Showing <strong style={{ color: C.inkSoft }}>{pagination.startIndex}</strong> to{" "}
                                <strong style={{ color: C.inkSoft }}>{pagination.endIndex}</strong> of{" "}
                                <strong style={{ color: C.inkSoft }}>{pagination.totalItems}</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {[
                                    { label: "First", action: () => setPage(1), disabled: page === 1 },
                                    { label: "Prev", action: () => setPage(p => p - 1), disabled: page === 1 },
                                    ...getPaginationWindow(pagination.currentPage, totalPages).map((pageNumber) => ({
                                        label: String(pageNumber),
                                        action: () => setPage(pageNumber),
                                        disabled: false,
                                        active: pageNumber === pagination.currentPage,
                                    })),
                                    { label: "Next", action: () => setPage(p => p + 1), disabled: page === totalPages },
                                    { label: "Last", action: () => setPage(totalPages), disabled: page === totalPages },
                                ].map(({ label, action, disabled }) => (
                                    <button key={label} onClick={action} disabled={disabled} style={{
                                        height: 34, padding: "0 14px", borderRadius: 9,
                                        border: `1px solid ${label === String(pagination.currentPage) ? C.goldBorder : C.line}`,
                                        background: label === String(pagination.currentPage) ? C.goldDim : "transparent",
                                        color: label === String(pagination.currentPage) ? C.goldBright : disabled ? C.inkFaint : C.inkMuted,
                                        fontSize: 12.5, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
                                        fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
                                        opacity: disabled ? 0.45 : 1,
                                    }}
                                        onMouseEnter={e => {
                                            if (!disabled && label !== String(pagination.currentPage)) {
                                                e.currentTarget.style.borderColor = C.goldBorder;
                                                e.currentTarget.style.color = C.inkSoft;
                                                e.currentTarget.style.background = C.goldDim;
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (label !== String(pagination.currentPage)) {
                                                e.currentTarget.style.borderColor = C.line;
                                                e.currentTarget.style.color = disabled ? C.inkFaint : C.inkMuted;
                                                e.currentTarget.style.background = "transparent";
                                            }
                                        }}
                                    >{label}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </>
    );
}


