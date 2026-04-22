import { useEffect } from "react";
import { X, Download, CheckCircle2, AlertCircle, FileText, TrendingUp, Target } from "lucide-react";

const EvaluationModal = ({ candidate, theme, onClose }) => {
  useEffect(() => {
    if (!candidate) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [candidate, onClose]);

  if (!candidate) return null;

  // Mock JD Evaluation Data based on user screenshot
  const jdEvaluations = [
    {
      source: "JD",
      criterion: "End-to-end accounts payable and accounts receivable management (invoicing, collections, vendor payments)",
      prompt: "To what extent is the candidate expected to meet this criterion based on the CV: End-to-end accounts payable and accounts receivable management (invoicing, collections, vendor payments)?",
      expectation: "High",
      weight: 19,
      score: 16,
      level: "direct",
      note: "Managed AP/AR, issued sales invoices, and followed up on receivables; AP management listed. Vendor payment handling not explicitly stated."
    },
    {
      source: "JD",
      criterion: "Prepare and post daily journal entries with proper supporting documentation",
      prompt: "To what extent is the candidate expected to meet this criterion based on the CV: Prepare and post daily journal entries with proper supporting documentation?",
      expectation: "High",
      weight: 13,
      score: 10,
      level: "direct",
      note: "Recorded daily accounting entries and handled journal entries during closings; supporting documentation not mentioned."
    },
    {
      source: "JD",
      criterion: "Perform timely bank and ledger reconciliations and resolve discrepancies",
      prompt: "To what extent is the candidate expected to meet this criterion based on the CV: Perform timely bank and ledger reconciliations and resolve discrepancies?",
      expectation: "High",
      weight: 18,
      score: 17,
      level: "direct",
      note: "Performed bank reconciliations (JOD & USD) and account reconciliations across roles; discrepancy resolution not explicitly detailed."
    },
    {
      source: "JD",
      criterion: "Prepare monthly/quarterly/annual financial statements and conduct variance analysis across P&L, balance sheet, and cash flow",
      prompt: "To what extent is the candidate expected to meet this criterion based on the CV: Prepare monthly/quarterly/annual financial statements and conduct variance analysis across P&L, balance sheet, and cash flow?",
      expectation: "Moderate",
      weight: 20,
      score: 16,
      level: "partial",
      note: "Prepared financial reports/statements and managed monthly/annual closings; explicit variance analysis across P&L/BS/CF not stated."
    },
    {
      source: "JD",
      criterion: "Support internal and external audits and maintain organized, accurate financial records; collaborate with internal teams; strong English communication",
      prompt: "To what extent is the candidate expected to meet this criterion based on the CV: Support internal and external audits and maintain organized, accurate financial records; collaborate with internal teams; strong English communication?",
      expectation: "High",
      weight: 10,
      score: 8,
      level: "direct",
      note: "Performed internal audits and maintained accurate records; external audit support and strong English evidence not explicitly documented."
    }
  ];

  const intakeEvaluations = [
    { label: "Expected Salary", expectation: "Not more than 800 JD", candidate: "600-650", weight: "-", score: "-", level: "Match", note: "0" },
    { label: "Notice Period (Days)", expectation: "-", candidate: "Immediate", weight: "-", score: "-", level: "NotApplicable", note: "-" },
    { label: "Gender", expectation: "-", candidate: "Female", weight: "-", score: "-", level: "NotApplicable", note: "-" },
    { label: "Years of Experience", expectation: "-", candidate: "4", weight: "-", score: "-", level: "NotApplicable", note: "-" }
  ];

  const resumeUrl = `/demo/cv/${encodeURIComponent(candidate.cvFile)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        background: "rgba(28, 20, 9, 0.35)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "evalFadeIn 0.3s ease-out forwards",
      }}
    >
      <style>{`
        @keyframes evalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes evalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .eval-row:hover {
          background-color: rgba(184,145,90,0.03) !important;
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 1150,
          maxHeight: "92vh",
          background: "#fff",
          borderRadius: 32,
          boxShadow: "0 40px 120px rgba(28, 20, 9, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: `1px solid ${theme.lineStrong || theme.line}`,
          animation: "evalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Header Section */}
        <div style={{
          padding: "24px 32px",
          borderBottom: `1px solid ${theme.line}`,
          background: "linear-gradient(to right, rgba(184,145,90,0.05), #fff)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: theme.gold, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
              Evaluation Details
            </div>
            <h2 style={{ fontSize: 28, color: theme.inkWhite, fontFamily: "'DM Serif Display', serif", margin: 0 }}>
              {candidate.name}
            </h2>
            <div style={{ fontSize: 14, color: theme.inkMuted, marginTop: 4 }}>
              {candidate.email}
            </div>
            <a
              href={resumeUrl}
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: theme.blue,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                marginTop: 12,
                transition: "opacity 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              <Download size={14} /> Download CV
            </a>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: `1px solid ${theme.line}`,
              background: "#fff",
              color: theme.inkMuted,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor = theme.inkMuted; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = theme.line; }}
          >
            <X size={16} /> Close
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {/* JD Evaluation Table */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Target size={20} color={theme.gold} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.inkWhite, margin: 0 }}>JD Evaluation</h3>
            </div>
            <div style={{ overflowX: "auto", border: `1px solid ${theme.line}`, borderRadius: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(184,145,90,0.05)" }}>
                    {["Source", "Criterion", "Prompt / Ideal", "Expectation / Candidate", "Weight%", "Score%", "Level", "Note / Distance"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: theme.inkFaint }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jdEvaluations.map((item, i) => (
                    <tr key={i} className="eval-row" style={{ borderTop: `1px solid ${theme.line}`, transition: "background 0.2s" }}>
                      <td style={{ padding: "16px", fontSize: 13, color: theme.inkMuted, fontWeight: 500 }}>{item.source}</td>
                      <td style={{ padding: "16px", fontSize: 13, fontWeight: 700, color: theme.inkSoft, width: "18%", lineHeight: 1.4 }}>{item.criterion}</td>
                      <td style={{ padding: "16px", fontSize: 12.5, color: theme.inkMuted, lineHeight: 1.6, width: "22%" }}>{item.prompt}</td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: item.expectation === "High" ? theme.green : theme.gold, background: item.expectation === "High" ? "rgba(45,158,117,0.08)" : "rgba(184,145,90,0.08)", padding: "4px 10px", borderRadius: 8 }}>
                          {item.expectation}
                        </span>
                      </td>
                      <td style={{ padding: "16px", fontSize: 13, color: theme.inkMuted, textAlign: "center", fontWeight: 600 }}>{item.weight}</td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: theme.goldBright || theme.gold }}>{item.score}</div>
                        <div style={{ fontSize: 10, color: theme.inkFaint, fontWeight: 700 }}>OF {item.weight}</div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                          background: item.level === "direct" ? "rgba(45,158,117,0.12)" : "rgba(184,145,90,0.12)",
                          color: item.level === "direct" ? theme.green : theme.gold,
                          letterSpacing: "0.02em"
                        }}>
                          {item.level === "direct" && <CheckCircle2 size={12} />}
                          {item.level}
                        </div>
                      </td>
                      <td style={{ padding: "16px", fontSize: 12.5, color: theme.inkSoft, lineHeight: 1.6, width: "20%" }}>{item.note}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "rgba(0,0,0,0.02)", fontWeight: 700 }}>
                    <td colSpan={4} style={{ padding: "12px 16px", fontSize: 13 }}>JD Total</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "center" }}>100</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "center", color: theme.gold }}>83</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Intake Evaluation Table */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <TrendingUp size={20} color={theme.blue} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.inkWhite, margin: 0 }}>Intake Evaluation</h3>
            </div>
            <div style={{ overflowX: "auto", border: `1px solid ${theme.line}`, borderRadius: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(58,123,213,0.05)" }}>
                    {["Intake", "Criterion", "Prompt / Ideal", "Expectation / Candidate", "Weight%", "Score%", "Level", "Note / Distance"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: theme.inkFaint }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {intakeEvaluations.map((item, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${theme.line}` }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: theme.inkMuted }}>Intake</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: theme.inkSoft }}>{item.label}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: theme.inkMuted }}>{item.expectation}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: theme.inkSoft }}>{item.candidate}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: theme.inkMuted, textAlign: "center" }}>{item.weight}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: theme.inkMuted, textAlign: "center" }}>{item.score}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                          background: item.level === "Match" ? "rgba(45,158,117,0.1)" : "rgba(0,0,0,0.05)",
                          color: item.level === "Match" ? theme.green : theme.inkMuted
                        }}>
                          {item.level}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: theme.inkMuted }}>{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Summary Bar */}
        <div style={{
          padding: "20px 32px",
          background: "linear-gradient(to right, #1c1409, #2c1e0a)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>{candidate.finalScore}/100</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Final Match Score</div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { label: "JD Score", value: candidate.jdScore },
                { label: "Penalty", value: candidate.penalty },
                { label: "Overqual Penalty", value: candidate.overqualificationPenalty },
                { label: "Disqualified", value: candidate.disqualified || "NO" },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", padding: "10px 18px", borderRadius: 14 }}>
            <CheckCircle2 size={20} color={theme.green} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Suitable for this role</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
