import { useMemo, useState } from "react";
import { ArrowLeft, Calendar, CheckSquare, Plus, Square, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const C = {
  bgDark: "#080d1c",
  bgPanel: "rgba(11,17,34,0.9)",
  inkSoft: "rgba(245,240,235,0.8)",
  inkMuted: "rgba(245,240,235,0.5)",
  line: "rgba(184,149,90,0.18)",
  lineStrong: "rgba(184,149,90,0.35)",
  blue: "#5f9eff",
  red: "#ff6b6b",
};

const INITIAL_JD_REQUIREMENTS = [
  { id: 1, requirement: "Experience with CRM tools", weight: 40 },
  { id: 2, requirement: "Pipeline management and forecasting", weight: 35 },
  { id: 3, requirement: "Strong closing and negotiation skills", weight: 25 },
];

const INITIAL_INTAKE_ITEMS = [
  { id: 1, description: "Expected Salary", idealAnswer: "e.g. 8,000 - 12,000 SAR", type: "Text", scoring: "Preferred" },
  { id: 2, description: "Notice Period", idealAnswer: "e.g. Immediate or <= 30 days", type: "Text", scoring: "Preferred" },
  { id: 3, description: "Gender", idealAnswer: "Optional and role dependent", type: "Text", scoring: "Preferred" },
];

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; scrollbar-width: none; -ms-overflow-style: none; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }

    .iv-root {
      min-height: 100vh;
      background:
        radial-gradient(ellipse 80vw 56vh at 100% -8%, rgba(184,149,90,0.12) 0%, transparent 55%),
        radial-gradient(ellipse 60vw 46vh at -8% 100%, rgba(95,158,255,0.06) 0%, transparent 52%),
        ${C.bgDark};
      color: #f5f0eb;
      font-family: 'Sora', sans-serif;
      padding: clamp(16px, 2.5vw, 28px);
    }
    .iv-shell { max-width: 1220px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
    .iv-top { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
    .iv-top-main { width: min(100%, 860px); }
    .iv-breadcrumb { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 12px; color: ${C.inkMuted}; margin-bottom: 8px; }
    .iv-crumb-link { border: none; background: none; color: ${C.blue}; font: inherit; cursor: pointer; padding: 0; }
    .iv-top h1 { margin: 0; font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 4.2vw, 2.8rem); line-height: 1; color: #fff; }
    .iv-meta { margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; font-size: 13px; color: ${C.inkSoft}; }
    .iv-meta strong { color: #fff; }
    .iv-pill { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(95,158,255,0.35); background: rgba(95,158,255,0.14); color: #aecdff; font-size: 10px; text-transform: uppercase; letter-spacing: .09em; font-weight: 700; }
    .iv-code { color: ${C.inkMuted}; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12px; }
    .iv-desc { margin: 10px auto 0; font-size: 13px; color: ${C.inkSoft}; max-width: 760px; }

    .iv-back-btn {
      display: inline-flex; align-items: center; gap: 7px; height: 42px; padding: 0 14px;
      border-radius: 11px; border: 1px solid ${C.line}; background: rgba(184,149,90,0.08);
      color: #f5f0eb; font-size: 12px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer;
      transition: all .2s ease; white-space: nowrap;
    }
    .iv-back-btn:hover { border-color: ${C.lineStrong}; background: rgba(184,149,90,0.16); transform: translateY(-1px); }
    .iv-card {
      background: ${C.bgPanel}; border: 1px solid ${C.line}; border-radius: 22px; backdrop-filter: blur(16px);
      box-shadow: 0 12px 36px rgba(0,0,0,.3); padding: clamp(14px, 2vw, 20px);
    }
    .iv-next-box { border: 1px solid ${C.line}; border-radius: 14px; background: rgba(255,255,255,.02); padding: 14px; }
    .iv-next-box h3 { margin: 0 0 10px; font-size: 18px; color: #fff; }
    .iv-next-list { margin: 0; padding-left: 18px; color: ${C.inkSoft}; font-size: 14px; line-height: 1.7; }

    .iv-section-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
    .iv-section-head h2 { margin: 0; font-size: clamp(1.2rem, 2.2vw, 1.45rem); color: #fff; }
    .iv-required-note { color: ${C.inkMuted}; font-size: 12px; }
    .iv-required-note .star, .iv-label .star { color: #ff9393; }

    .iv-toggle { border: none; background: none; color: #f5f0eb; font: inherit; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; padding: 0; }
    .iv-toggle .icon { color: ${C.blue}; display: inline-flex; }

    .iv-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 14px; }
    .iv-field, .iv-field-full { display: flex; flex-direction: column; gap: 7px; }
    .iv-field-full { grid-column: 1 / -1; }
    .iv-label { font-size: 14px; font-weight: 600; color: #f5f0eb; }
    .iv-label .opt { color: ${C.inkMuted}; }

    .iv-input, .iv-select, .iv-textarea {
      width: 100%; border-radius: 10px; border: 1px solid ${C.line}; background: rgba(6,10,20,.72);
      color: #f5f0eb; font-size: 15px; font-family: 'Sora', sans-serif; padding: 10px 12px; outline: none;
      transition: border-color .2s ease;
    }
    .iv-input:focus, .iv-select:focus, .iv-textarea:focus { border-color: rgba(184,149,90,.5); }
    .iv-input::placeholder, .iv-textarea::placeholder { color: ${C.inkMuted}; }
    .iv-textarea { resize: vertical; min-height: 150px; line-height: 1.6; }
    .iv-help { margin: 0; color: ${C.inkMuted}; font-size: 12px; line-height: 1.5; }

    .iv-actions-row { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
    .iv-btn, .iv-btn-danger, .iv-btn-primary {
      border-radius: 10px; border: 1px solid ${C.line}; background: rgba(184,149,90,.08); color: #f5f0eb;
      font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; padding: 8px 12px; cursor: pointer;
      transition: all .2s ease; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;
    }
    .iv-btn:hover { border-color: ${C.lineStrong}; background: rgba(184,149,90,.16); }
    .iv-btn-primary { border-color: rgba(95,158,255,.35); background: rgba(95,158,255,.16); color: #e8f1ff; }
    .iv-btn-primary:hover { background: rgba(95,158,255,.24); }
    .iv-btn-danger { border-color: rgba(255,107,107,.28); background: rgba(255,107,107,.08); color: #ffc2c2; }
    .iv-btn-danger:hover { background: rgba(255,107,107,.16); }
    .iv-btn:disabled, .iv-btn-primary:disabled, .iv-btn-danger:disabled { opacity: .45; cursor: not-allowed; transform: none; }

    .iv-table { border: 1px solid ${C.line}; border-radius: 12px; overflow: hidden; margin-top: 10px; }
    .iv-table-head, .iv-table-row {
      display: grid; grid-template-columns: minmax(240px,1fr) 120px 90px; gap: 10px; align-items: center; padding: 10px 12px;
    }
    .iv-table-head { background: rgba(255,255,255,.02); border-bottom: 1px solid ${C.line}; color: ${C.inkSoft}; font-size: 13px; font-weight: 700; }
    .iv-table-row { border-bottom: 1px solid ${C.line}; }
    .iv-table-row:last-child { border-bottom: none; }
    .iv-inline-remove { border: none; background: none; color: #ff9d9d; cursor: pointer; font-size: 13px; text-align: left; padding: 4px 0; }
    .iv-inline-remove:hover { color: ${C.red}; }

    .iv-subcard { margin-top: 10px; border: 1px solid ${C.line}; border-radius: 14px; padding: 12px; background: rgba(255,255,255,.02); }
    .iv-tag-wrap {
      border-radius: 10px; border: 1px solid ${C.line}; background: rgba(6,10,20,.72); min-height: 44px;
      display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 7px 8px;
    }
    .iv-tag {
      display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(95,158,255,.3);
      background: rgba(95,158,255,.14); color: #cfe2ff; border-radius: 999px; padding: 5px 10px; font-size: 12px; font-weight: 600;
    }
    .iv-tag button { border: none; background: none; color: inherit; cursor: pointer; padding: 0; font-size: 12px; line-height: 1; }
    .iv-tag-input { flex: 1; min-width: 220px; border: none; outline: none; background: transparent; color: #f5f0eb; font-size: 14px; font-family: 'Sora', sans-serif; }
    .iv-tag-input::placeholder { color: ${C.inkMuted}; }

    .iv-access-box {
      border: 1px solid ${C.line}; border-radius: 12px; background: rgba(255,255,255,.03);
      display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px;
    }
    .iv-access-box h4 { margin: 0; font-size: 17px; color: #fff; }
    .iv-access-box p { margin: 4px 0 0; color: ${C.inkSoft}; font-size: 13px; }

    .iv-import { margin-top: 12px; border: 1px solid ${C.line}; border-radius: 12px; padding: 12px; background: rgba(255,255,255,.02); opacity: .74; }
    .iv-import h4 { margin: 0; color: ${C.inkMuted}; font-size: 24px; font-family: 'DM Serif Display', serif; font-style: italic; line-height: 1; }
    .iv-import-line { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
    .iv-file { width: 100%; border: 1px solid ${C.line}; border-radius: 10px; background: rgba(6,10,20,.72); color: ${C.inkMuted}; padding: 10px 12px; }
    .iv-candidates-empty { margin-top: 10px; color: ${C.inkMuted}; font-size: 13px; }
    .iv-total { margin-top: 10px; text-align: right; color: ${C.inkSoft}; font-size: 13px; }

    .iv-cta {
      margin-top: 12px; width: 100%; border: none; border-radius: 13px; padding: 14px 16px;
      background: linear-gradient(135deg, #5089df, #67a4ff); color: #fff; font-size: 20px;
      font-family: 'DM Serif Display', serif; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease;
    }
    .iv-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(95,158,255,.25); }
    .iv-tip { text-align: center; margin: 10px 0 0; color: ${C.inkMuted}; font-size: 12px; }

    .iv-date-wrap { position: relative; display: flex; align-items: center; }
    .iv-date-wrap .iv-input { padding-right: 38px; }
    .iv-date-icon { position: absolute; right: 12px; color: ${C.inkMuted}; pointer-events: none; }

    @media (max-width: 980px) {
      .iv-grid-2 { grid-template-columns: 1fr; }
      .iv-table-head, .iv-table-row { grid-template-columns: 1fr 110px 80px; }
    }

    @media (max-width: 720px) {
      .iv-root { padding: 12px; }
      .iv-back-btn { align-self: center; }
      .iv-table-head { display: none; }
      .iv-table-row { grid-template-columns: 1fr; gap: 8px; }
      .iv-table-row .iv-inline-remove { justify-self: flex-start; }
      .iv-tag-input { min-width: 120px; }
    }
  `}</style>
);

export default function Interview() {
  const navigate = useNavigate();

  const [enableCV, setEnableCV] = useState(true);
  const [enableInterview, setEnableInterview] = useState(true);
  const [allowEveryone, setAllowEveryone] = useState(true);

  const [requirements, setRequirements] = useState(INITIAL_JD_REQUIREMENTS);
  const [intakeItems, setIntakeItems] = useState(INITIAL_INTAKE_ITEMS);
  const [specificTags, setSpecificTags] = useState(["Expected salary", "Years of experience"]);
  const [tagInput, setTagInput] = useState("");

  const [roleDescription, setRoleDescription] = useState(
    "We are hiring a Sales Executive to drive pipeline growth and manage key accounts. The role focuses on consultative selling, product demos, and closing."
  );

  const totalWeight = useMemo(
    () => requirements.reduce((sum, item) => sum + (Number(item.weight) || 0), 0),
    [requirements]
  );

  const updateRequirement = (id, key, value) => {
    setRequirements((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const addRequirement = () => {
    setRequirements((prev) => [...prev, { id: Date.now(), requirement: "", weight: 0 }]);
  };

  const removeRequirement = (id) => {
    setRequirements((prev) => prev.filter((item) => item.id !== id));
  };

  const normalizeWeights = () => {
    if (!requirements.length) return;
    const base = Math.floor(100 / requirements.length);
    const extra = 100 - base * requirements.length;
    setRequirements((prev) => prev.map((item, idx) => ({ ...item, weight: idx < extra ? base + 1 : base })));
  };

  const suggestFromJD = () => {
    const isSales = /sales|pipeline|account|crm/i.test(roleDescription);
    if (isSales) {
      setRequirements(INITIAL_JD_REQUIREMENTS);
      return;
    }
    setRequirements([
      { id: 1, requirement: "Role-specific technical skills", weight: 45 },
      { id: 2, requirement: "Communication and stakeholder management", weight: 30 },
      { id: 3, requirement: "Problem solving and ownership", weight: 25 },
    ]);
  };

  const improveJD = () => {
    if (/KPIs|outcomes/i.test(roleDescription)) return;
    setRoleDescription((prev) => `${prev} Success will be measured by monthly pipeline value, win-rate, and client retention KPIs.`);
  };

  const updateIntake = (id, key, value) => {
    setIntakeItems((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const addIntakeRow = () => {
    setIntakeItems((prev) => [...prev, { id: Date.now(), description: "", idealAnswer: "", type: "Text", scoring: "Preferred" }]);
  };

  const removeIntakeRow = (id) => {
    setIntakeItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addTag = () => {
    const clean = tagInput.trim();
    if (!clean) return;
    const exists = specificTags.some((tag) => tag.toLowerCase() === clean.toLowerCase());
    if (!exists) setSpecificTags((prev) => [...prev, clean]);
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setSpecificTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="iv-root">
        <div className="iv-shell">
          <header className="iv-top">
            <div className="iv-top-main">
              <div className="iv-breadcrumb">
                <button type="button" className="iv-crumb-link" onClick={() => navigate("/dashboard")}>Dashboard</button>
                <span>/</span>
                <span>Create Interview</span>
              </div>
              <h1>Create New Interview</h1>
              <div className="iv-meta">
                <span>Service:</span>
                <strong>First Interview</strong>
                <span className="iv-pill">General</span>
                <span className="iv-code">(first_interview)</span>
              </div>
              <p className="iv-desc">Fill your job campaign details and generate CV submission and Interview links.</p>
            </div>

          </header>

          <section className="iv-card">
            <div className="iv-next-box">
              <h3>What happens next</h3>
              <ul className="iv-next-list">
                <li>Shareable links will be generated for enabled services.</li>
                <li>You can copy it and send to candidates.</li>
                <li>The link will stop working after the end date.</li>
              </ul>
            </div>
          </section>

          <section className="iv-card">
            <div className="iv-section-head">
              <h2>Company & Role</h2>
              <div className="iv-required-note">Fields marked <span className="star">*</span> are required</div>
            </div>

            <div className="iv-grid-2">
              <label className="iv-field">
                <span className="iv-label">Company Name <span className="star">*</span></span>
                <input className="iv-input" defaultValue="Demo Company" />
              </label>

              <label className="iv-field">
                <span className="iv-label">Job Position <span className="star">*</span></span>
                <input className="iv-input" defaultValue="Sales Executive" />
              </label>

              <label className="iv-field">
                <span className="iv-label">Department <span className="opt">(optional)</span></span>
                <input className="iv-input" defaultValue="Sales" />
              </label>

              <label className="iv-field">
                <span className="iv-label">Campaign Plan</span>
                <select className="iv-select" defaultValue="Standard">
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Enterprise</option>
                </select>
                <p className="iv-help">Standard videos can be retained for 45 days, Premium for 90 days in R2 lifecycle rules.</p>
              </label>

              <div className="iv-field-full">
                <div className="iv-actions-row">
                  <button type="button" className="iv-btn" onClick={improveJD}>Improve JD</button>
                </div>
                <label className="iv-field">
                  <span className="iv-label">Role Description (Job Description / JD) <span className="star">*</span></span>
                  <textarea className="iv-textarea" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="iv-section-head" style={{ marginTop: 16 }}>
              <div>
                <h2 style={{ fontSize: "1.2rem" }}>JD Requirements & Weights</h2>
                <p className="iv-help" style={{ marginTop: 4 }}>These weights drive CV and interview scoring (total must be 100%).</p>
              </div>
              <div className="iv-actions-row" style={{ marginTop: 0 }}>
                <button type="button" className="iv-btn" onClick={suggestFromJD}>Suggest from JD</button>
                <button type="button" className="iv-btn" onClick={normalizeWeights}>Normalize to 100%</button>
              </div>
            </div>

            <div className="iv-table">
              <div className="iv-table-head">
                <span>Requirement</span>
                <span>Weight %</span>
                <span />
              </div>
              {requirements.map((item) => (
                <div className="iv-table-row" key={item.id}>
                  <input className="iv-input" value={item.requirement} onChange={(e) => updateRequirement(item.id, "requirement", e.target.value)} />
                  <input className="iv-input" type="number" min="0" max="100" value={item.weight} onChange={(e) => updateRequirement(item.id, "weight", Number(e.target.value))} />
                  <button type="button" className="iv-inline-remove" onClick={() => removeRequirement(item.id)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="iv-actions-row" style={{ justifyContent: "space-between" }}>
              <button type="button" className="iv-btn" onClick={addRequirement}><Plus size={14} /> Add requirement</button>
              <div className="iv-total">Total: <strong>{totalWeight}%</strong></div>
            </div>
          </section>

          <section className="iv-card">
            <div className="iv-section-head">
              <h2>CV Submission</h2>
              <button type="button" className="iv-toggle" onClick={() => setEnableCV((v) => !v)}>
                <span className="icon">{enableCV ? <CheckSquare size={18} /> : <Square size={18} />}</span>
                <span>Enable CV submission</span>
              </button>
            </div>

            <div style={{ opacity: enableCV ? 1 : 0.45 }}>
              <div className="iv-grid-2" style={{ gridTemplateColumns: "1fr" }}>
                <label className="iv-field">
                  <span className="iv-label">Max CVs allowed <span className="opt">(optional)</span></span>
                  <input className="iv-input" type="number" min="1" defaultValue="50" />
                  <p className="iv-help">Limits how many CVs can be submitted through the intake link.</p>
                </label>

                <div className="iv-subcard">
                  <label className="iv-field">
                    <span className="iv-label">CV submission end date</span>
                    <div className="iv-date-wrap">
                      <input className="iv-input" type="date" defaultValue="2026-04-03" />
                      <Calendar className="iv-date-icon" size={16} />
                    </div>
                  </label>
                </div>
              </div>

              <div className="iv-section-head" style={{ marginTop: 14 }}>
                <h2 style={{ fontSize: "1.2rem" }}>CV Intake Requirements <span className="opt">(optional)</span></h2>
                <button type="button" className="iv-btn" onClick={addIntakeRow}>Add requirement</button>
              </div>

              <div className="iv-table" style={{ marginTop: 0 }}>
                <div className="iv-table-head" style={{ gridTemplateColumns: "1.4fr 1.4fr 1fr 0.8fr 0.7fr" }}>
                  <span>Description</span>
                  <span>Ideal Answer</span>
                  <span>Type</span>
                  <span>Scoring</span>
                  <span />
                </div>
                {intakeItems.map((item) => (
                  <div className="iv-table-row" key={item.id} style={{ gridTemplateColumns: "1.4fr 1.4fr 1fr 0.8fr 0.7fr" }}>
                    <input className="iv-input" value={item.description} onChange={(e) => updateIntake(item.id, "description", e.target.value)} />
                    <input className="iv-input" value={item.idealAnswer} onChange={(e) => updateIntake(item.id, "idealAnswer", e.target.value)} placeholder="e.g. Yes, valid work permit" />
                    <select className="iv-select" value={item.type} onChange={(e) => updateIntake(item.id, "type", e.target.value)}>
                      <option>Text</option>
                      <option>Yes / No</option>
                      <option>Number</option>
                      <option>Single Select</option>
                    </select>
                    <select className="iv-select" value={item.scoring} onChange={(e) => updateIntake(item.id, "scoring", e.target.value)}>
                      <option>Preferred</option>
                      <option>Must</option>
                    </select>
                    <button type="button" className="iv-inline-remove" onClick={() => removeIntakeRow(item.id)}>Remove</button>
                  </div>
                ))}
              </div>

              <p className="iv-help" style={{ marginTop: 10 }}>
                Must = candidate becomes not suitable if answered No. Preferred = -10 score per No. Text answer = required free-text response.
              </p>
            </div>
          </section>

          <section className="iv-card">
            <div className="iv-section-head">
              <h2>Interview</h2>
              <button type="button" className="iv-toggle" onClick={() => setEnableInterview((v) => !v)}>
                <span className="icon">{enableInterview ? <CheckSquare size={18} /> : <Square size={18} />}</span>
                <span>Enable interview</span>
              </button>
            </div>

            <div style={{ opacity: enableInterview ? 1 : 0.45 }}>
              <div className="iv-subcard">
                <div className="iv-grid-2">
                  <label className="iv-field">
                    <span className="iv-label">Interview Level</span>
                    <select className="iv-select" defaultValue="Mid Level">
                      <option>Junior Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                    </select>
                  </label>

                  <label className="iv-field">
                    <span className="iv-label">Number of questions</span>
                    <input className="iv-input" type="number" min="1" max="30" defaultValue="10" />
                  </label>

                  <label className="iv-field">
                    <span className="iv-label">Interview end date</span>
                    <div className="iv-date-wrap">
                      <input className="iv-input" type="date" defaultValue="2026-04-07" />
                      <Calendar className="iv-date-icon" size={16} />
                    </div>
                  </label>

                  <div className="iv-field">
                    <span className="iv-label">Recording</span>
                    <div style={{ paddingTop: 8 }}>
                      <div style={{ color: "#fff", fontWeight: 600, marginBottom: 5 }}>Video interview (camera + voice)</div>
                      <div className="iv-help">Recording is required for all interviews.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="iv-grid-2" style={{ marginTop: 12, gridTemplateColumns: "1fr" }}>
                <label className="iv-field">
                  <span className="iv-label">Interview Language</span>
                  <select className="iv-select" defaultValue="English">
                    <option>English</option>
                    <option>Arabic</option>
                    <option>Bilingual (English + Arabic)</option>
                  </select>
                </label>

                <label className="iv-field">
                  <span className="iv-label">Specific Information Needed <span className="opt">(optional)</span></span>
                  <div className="iv-tag-wrap">
                    {specificTags.map((tag) => (
                      <span className="iv-tag" key={tag}>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>x</button>
                      </span>
                    ))}
                    <input
                      className="iv-tag-input"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={addTag}
                      placeholder='Type and press Enter (e.g. "Years of experience")'
                    />
                  </div>
                </label>

                <label className="iv-field">
                  <span className="iv-label">Mandatory Interview Questions <span className="opt">(optional)</span></span>
                  <input className="iv-input" placeholder='Type and press Enter (e.g. "Tell me about your last role")' />
                  <p className="iv-help">These questions will be asked to every candidate (one by one).</p>
                </label>
              </div>

              <div className="iv-section-head" style={{ marginTop: 14 }}>
                <h2 style={{ fontSize: "1.2rem" }}>Access Control</h2>
              </div>

              <div className="iv-access-box">
                <div>
                  <h4>Allow everyone</h4>
                  <p>If enabled, any candidate can enter using the interview code (no email restriction).</p>
                </div>
                <button type="button" className="iv-toggle" onClick={() => setAllowEveryone((v) => !v)}>
                  <span className="icon">{allowEveryone ? <CheckSquare size={22} /> : <Square size={22} />}</span>
                </button>
              </div>

              <div className="iv-import">
                <div className="iv-import-line">
                  <h4>Import invited emails (Excel)</h4>
                  <div className="iv-actions-row" style={{ marginTop: 0 }}>
                    <button type="button" className="iv-btn" disabled>Download Excel Template</button>
                    <button type="button" className="iv-btn" disabled>Download Current Candidates</button>
                  </div>
                </div>

                <div className="iv-file" style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <Upload size={15} />
                  <span>Choose file</span>
                </div>
                <p className="iv-help" style={{ marginTop: 8 }}>Upload an Excel file. We will detect name, email, and phone from columns.</p>

                <div className="iv-import-line" style={{ marginTop: 12 }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600 }}>Invited candidates (name / email / phone)</div>
                    <div className="iv-candidates-empty">No invited candidates loaded yet.</div>
                  </div>
                  <button type="button" className="iv-btn" disabled>Add row</button>
                </div>
              </div>
            </div>

            <button type="button" className="iv-cta">Show Links</button>
            <p className="iv-tip">
              Tip: if Interview is enabled and you disable "Allow everyone", make sure invited emails exist (from intake or Excel).
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
