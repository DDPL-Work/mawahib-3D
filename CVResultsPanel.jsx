import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Download, Eye, MoreHorizontal, X } from "lucide-react";
import { getPaginationWindow, MIN_TABLE_ROWS, paginateItems } from "./tablePagination";

const TablePagination = ({ page, totalPages, startIndex, endIndex, totalItems, onPageChange, theme }) => {
  const pageNumbers = getPaginationWindow(page, totalPages);
  const summary = totalItems
    ? `Showing ${startIndex}-${endIndex} of ${totalItems} candidates`
    : "No candidates available";

  return (
    <div style={{
      padding: "14px 18px",
      borderTop: `1px solid ${theme.line}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
      background: "rgba(255,250,242,0.50)",
    }}>
      <div style={{ fontSize: 12.5, color: theme.inkMuted }}>{summary}</div>
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
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onPageChange(targetPage)}
            style={{
              minWidth: 36,
              height: 34,
              padding: "0 12px",
              borderRadius: 9,
              border: `1px solid ${active ? theme.goldBorder : theme.line}`,
              background: active ? theme.goldDim : "transparent",
              color: active ? theme.gold : disabled ? theme.inkFaint : theme.inkMuted,
              cursor: disabled ? "not-allowed" : "pointer",
              fontSize: 12.5,
              fontWeight: 600,
              fontFamily: "'Sora', sans-serif",
              opacity: disabled ? 0.45 : 1,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function DashboardCVResultsPanel({ candidates, theme }) {
  const [nameQuery, setNameQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [suitableFilter, setSuitableFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");
  const [scoreSort, setScoreSort] = useState("high-to-low");
  const [candidatePage, setCandidatePage] = useState(1);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [previewCandidate, setPreviewCandidate] = useState(null);

  const countryOptions = useMemo(
    () => Array.from(new Set(candidates.map((candidate) => candidate.country))).sort(),
    [candidates]
  );
  const cityOptions = useMemo(
    () => Array.from(new Set(candidates.map((candidate) => candidate.city))).sort(),
    [candidates]
  );

  const filteredCandidates = useMemo(() => {
    const normalizedName = nameQuery.trim().toLowerCase();

    const filtered = candidates.filter((candidate) => {
      const matchesName = !normalizedName
        || candidate.name.toLowerCase().includes(normalizedName)
        || candidate.email.toLowerCase().includes(normalizedName)
        || candidate.phone.toLowerCase().includes(normalizedName);
      const matchesStatus = statusFilter === "all" || candidate.reviewStatus === statusFilter;
      const matchesGender = genderFilter === "all" || candidate.gender === genderFilter;
      const matchesCountry = countryFilter === "all" || candidate.country === countryFilter;
      const matchesCity = cityFilter === "all" || candidate.city === cityFilter;
      const matchesSuitable = suitableFilter === "all"
        || (suitableFilter === "yes" && candidate.suitable)
        || (suitableFilter === "no" && !candidate.suitable);

      return matchesName && matchesStatus && matchesGender && matchesCountry && matchesCity && matchesSuitable;
    });

    return [...filtered].sort((left, right) => {
      if (scoreSort !== "none") {
        const scoreDelta = scoreSort === "high-to-low"
          ? right.finalScore - left.finalScore
          : left.finalScore - right.finalScore;
        if (scoreDelta !== 0) return scoreDelta;
      }

      const leftTime = new Date(left.submittedAt).getTime();
      const rightTime = new Date(right.submittedAt).getTime();
      return dateSort === "newest" ? rightTime - leftTime : leftTime - rightTime;
    });
  }, [candidates, nameQuery, statusFilter, genderFilter, countryFilter, cityFilter, suitableFilter, dateSort, scoreSort]);

  const candidatePagination = useMemo(
    () => paginateItems(filteredCandidates, candidatePage, MIN_TABLE_ROWS),
    [filteredCandidates, candidatePage]
  );

  const visibleCandidateIds = candidatePagination.pageItems.map((candidate) => candidate.id);
  const allVisibleSelected = visibleCandidateIds.length > 0
    && visibleCandidateIds.every((id) => selectedCandidateIds.includes(id));

  useEffect(() => {
    if (candidatePage !== candidatePagination.currentPage) {
      setCandidatePage(candidatePagination.currentPage);
    }
  }, [candidatePage, candidatePagination.currentPage]);

  useEffect(() => {
    setCandidatePage(1);
  }, [nameQuery, statusFilter, genderFilter, countryFilter, cityFilter, suitableFilter, dateSort, scoreSort]);

  useEffect(() => {
    setSelectedCandidateIds((currentIds) => currentIds.filter((id) => filteredCandidates.some((candidate) => candidate.id === id)));
  }, [filteredCandidates]);

  const resetFilters = () => {
    setNameQuery("");
    setStatusFilter("all");
    setGenderFilter("all");
    setCountryFilter("all");
    setCityFilter("all");
    setSuitableFilter("all");
    setDateSort("newest");
    setScoreSort("high-to-low");
  };

  const toggleSelectAllVisible = () => {
    setSelectedCandidateIds((currentIds) => {
      if (allVisibleSelected) {
        return currentIds.filter((id) => !visibleCandidateIds.includes(id));
      }
      return Array.from(new Set([...currentIds, ...visibleCandidateIds]));
    });
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidateIds((currentIds) => (
      currentIds.includes(candidateId)
        ? currentIds.filter((id) => id !== candidateId)
        : [...currentIds, candidateId]
    ));
  };

  const openResumePreview = (candidate) => setPreviewCandidate(candidate);
  const closeResumePreview = () => setPreviewCandidate(null);

  const controlStyle = {
    height: 34,
    borderRadius: 9,
    border: `1px solid ${theme.line}`,
    background: "rgba(255,250,242,0.82)",
    color: theme.inkSoft,
    fontSize: 12.5,
    fontFamily: "'Sora', sans-serif",
    padding: "0 12px",
    outline: "none",
    width: "100%",
  };

  const statusStyles = {
    Pending: { bg: "rgba(58,123,213,0.08)", border: "rgba(58,123,213,0.20)", text: theme.blue },
    Reviewed: { bg: "rgba(184,145,90,0.12)", border: theme.goldBorder, text: theme.gold },
    Contacted: { bg: "rgba(45,158,117,0.10)", border: "rgba(45,158,117,0.24)", text: theme.green },
  };

  const tableColumns = "48px minmax(220px, 1.95fr) minmax(120px, 0.85fr) minmax(100px, 0.8fr) minmax(100px, 0.82fr) minmax(180px, 1.25fr) minmax(110px, 0.82fr) minmax(90px, 0.78fr) minmax(96px, 0.82fr)";

  const ResumeSidebarModal = ({ candidate, theme, onClose }) => {
    useEffect(() => {
      if (!candidate) return undefined;

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleEscape = (event) => {
        if (event.key === "Escape") onClose();
      };

      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", handleEscape);
      };
    }, [candidate, onClose]);

    if (!candidate) return null;

    const resumeUrl = `/demo/cv/${encodeURIComponent(candidate.cvFile)}`;
    const isDisqualified = String(candidate.disqualified).toLowerCase() !== "no";
    const fitState = isDisqualified
      ? { label: "Review Required", color: theme.red, bg: "rgba(217,79,107,0.10)", border: "rgba(217,79,107,0.24)" }
      : candidate.suitable
        ? { label: "Strong Fit", color: theme.green, bg: "rgba(45,158,117,0.10)", border: "rgba(45,158,117,0.24)" }
        : { label: "Consider", color: theme.gold, bg: "rgba(184,145,90,0.10)", border: theme.goldBorder };

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Resume sidebar for ${candidate.name}`}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1200,
          background: "rgba(12, 16, 26, 0.65)",
          backdropFilter: "blur(12px)",
          padding: "40px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <section
          onClick={(event) => event.stopPropagation()}
          style={{
            width: "min(880px, 100%)",
            maxHeight: "92vh",
            background: "#fff",
            border: `1px solid ${theme.line}`,
            borderRadius: 32,
            boxShadow: "0 40px 100px rgba(10,18,32,0.35)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Header Action Bar */}
          <div style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${theme.line}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255,250,242,0.8)",
            backdropFilter: "blur(4px)",
            zIndex: 10,
          }}>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={resumeUrl} target="_blank" rel="noreferrer" style={{ height: 36, padding: "0 16px", borderRadius: 10, border: `1px solid ${theme.line}`, background: "#fff", color: theme.inkMuted, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, transition: "0.2s" }}>
                <Eye size={15} /> Open PDF
              </a>
              <a href={resumeUrl} download={candidate.cvFile} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: `1px solid ${theme.line}`, background: theme.goldDim, color: theme.gold, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                <Download size={15} /> Download
              </a>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: 10, border: "none", background: "rgba(0,0,0,0.05)", color: theme.inkMuted,
                display: "grid", placeItems: "center", cursor: "pointer", transition: "0.2s"
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Resume Document Area */}
          <div style={{ flex: 1, overflowY: "auto", background: "#fcfaf7", padding: "40px clamp(20px, 6vw, 60px)" }}>
            <div style={{
              maxWidth: 720,
              margin: "0 auto",
              background: "#fff",
              padding: "50px clamp(20px, 5vw, 60px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.02)",
              borderRadius: 4,
              border: "1px solid rgba(0,0,0,0.03)",
              minHeight: "100%",
            }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h1 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 42,
                  color: theme.inkWhite,
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}>
                  {candidate.name}
                </h1>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "8px 16px",
                  fontSize: 13,
                  color: theme.inkMuted,
                  fontWeight: 500,
                }}>
                  <span>{candidate.email}</span>
                  <span style={{ color: theme.lineStrong }}>|</span>
                  <span>{candidate.phone}</span>
                  <span style={{ color: theme.lineStrong }}>|</span>
                  <span>{candidate.city}, {candidate.country}</span>
                </div>
              </div>

              {/* Summary Section */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: theme.gold, letterSpacing: "0.15em", textTransform: "uppercase", borderBottom: `1px solid ${theme.line}`, paddingBottom: 6, marginBottom: 14 }}>
                  Professional Summary
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: theme.inkSoft, margin: 0 }}>
                  {candidate.summary || `${candidate.name} is a professional ${candidate.reviewStatus === "Reviewed" ? "evaluated" : "candidate"} currently in our recruitment pipeline.`}
                </p>
              </div>

              {/* Experience Section */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: theme.gold, letterSpacing: "0.15em", textTransform: "uppercase", borderBottom: `1px solid ${theme.line}`, paddingBottom: 6, marginBottom: 18 }}>
                  Work Experience
                </div>
                {candidate.experience ? candidate.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 700, color: theme.inkWhite }}>{exp.title}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: theme.gold }}>{exp.period}</div>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: theme.inkMuted, marginBottom: 10 }}>{exp.company}</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {exp.points.map((pt, j) => (
                        <li key={j} style={{ fontSize: 14, color: theme.inkSoft, lineHeight: 1.6, marginBottom: 4 }}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )) : (
                  <div style={{ fontSize: 14, color: theme.inkMuted, fontStyle: "italic" }}>No detailed experience provided in the parsed resume data.</div>
                )}
              </div>

              {/* Education Section */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: theme.gold, letterSpacing: "0.15em", textTransform: "uppercase", borderBottom: `1px solid ${theme.line}`, paddingBottom: 6, marginBottom: 18 }}>
                  Education
                </div>
                {candidate.education ? candidate.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.inkWhite }}>{edu.degree}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: theme.inkMuted }}>{edu.year}</div>
                    </div>
                    <div style={{ fontSize: 13, color: theme.inkMuted }}>{edu.institution}</div>
                  </div>
                )) : (
                  <div style={{ fontSize: 14, color: theme.inkMuted, fontStyle: "italic" }}>Education details not available.</div>
                )}
              </div>

              {/* Skills Section */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: theme.gold, letterSpacing: "0.15em", textTransform: "uppercase", borderBottom: `1px solid ${theme.line}`, paddingBottom: 6, marginBottom: 14 }}>
                  Technical Skills
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px" }}>
                  {candidate.skills ? candidate.skills.map(s => (
                    <span key={s} style={{ fontSize: 12.5, fontWeight: 600, color: theme.inkSoft, background: "rgba(0,0,0,0.03)", padding: "4px 10px", borderRadius: 4 }}>{s}</span>
                  )) : (
                    <div style={{ fontSize: 14, color: theme.inkMuted, fontStyle: "italic" }}>No skills listed.</div>
                  )}
                </div>
              </div>

              {/* Mawahib Assessment Box */}
              <div style={{
                background: "linear-gradient(135deg, rgba(184,145,90,0.05) 0%, rgba(184,145,90,0.02) 100%)",
                border: `1px solid ${theme.goldBorder}`,
                borderRadius: 16,
                padding: 24,
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, right: 0, padding: "8px 16px",
                  background: fitState.bg, borderBottomLeftRadius: 16, borderLeft: `1px solid ${fitState.border}`, borderBottom: `1px solid ${fitState.border}`,
                  fontSize: 11, fontWeight: 800, color: fitState.color, letterSpacing: "0.05em",
                }}>
                  {fitState.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: theme.gold, letterSpacing: "0.12em", marginBottom: 16, textTransform: "uppercase" }}>
                  Mawahib AI Assessment
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, color: theme.inkSoft, lineHeight: 1.6, marginBottom: 12 }}>
                      This candidate shows a <strong>{candidate.finalScore}% match</strong> for the JD requirements. Recommended for the next stage based on experience alignment.
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: theme.inkMuted, fontWeight: 600 }}>
                      <span>JD Focus: {candidate.jdScore}%</span>
                      <span>Penalty: {candidate.penalty}</span>
                      <span>Overqual: {candidate.overqualificationPenalty}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: theme.inkWhite, fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>{candidate.finalScore}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: theme.inkMuted, marginTop: 4 }}>MATCH SCORE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{
        background: "rgba(255, 250, 242, 0.72)",
        border: `1px solid ${theme.line}`,
        borderRadius: 16,
        padding: 16,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.25fr 1fr 0.7fr 0.7fr 1fr 1fr 0.7fr auto",
          gap: 12,
          alignItems: "end",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: theme.inkFaint }}>Name</div>
            <input value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} placeholder="Candidate name" style={controlStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: theme.inkFaint }}>Newest to oldest</div>
            <select value={dateSort} onChange={(e) => setDateSort(e.target.value)} style={controlStyle}>
              <option value="newest">Newest to oldest</option>
              <option value="oldest">Oldest to newest</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: theme.inkFaint }}>Status</div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={controlStyle}>
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Contacted">Contacted</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: theme.inkFaint }}>Gender</div>
            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} style={controlStyle}>
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: theme.inkFaint }}>Country</div>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} style={controlStyle}>
              <option value="all">All countries</option>
              {countryOptions.map((country) => <option key={country} value={country}>{country}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: theme.inkFaint }}>City</div>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} style={controlStyle}>
              <option value="all">All cities</option>
              {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: theme.inkFaint }}>Suitable</div>
            <select value={suitableFilter} onChange={(e) => setSuitableFilter(e.target.value)} style={controlStyle}>
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <button type="button" onClick={resetFilters} style={{
            height: 34,
            padding: "0 14px",
            borderRadius: 9,
            border: `1px solid ${theme.line}`,
            background: "transparent",
            color: theme.blue,
            cursor: "pointer",
            fontSize: 12.5,
            fontWeight: 600,
            fontFamily: "'Sora', sans-serif",
          }}>
            Clear filters
          </button>
        </div>
      </div>

      <div style={{ background: "rgba(255, 250, 242, 0.78)", border: `1px solid ${theme.line}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: `1px solid ${theme.line}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.inkWhite }}>Candidates ({filteredCandidates.length}/{candidates.length})</div>
          <button type="button" style={{ width: 40, height: 40, borderRadius: 14, border: `1px solid ${theme.line}`, background: "rgba(255,250,242,0.85)", color: theme.inkMuted, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <div style={{ width: "100%", minWidth: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: tableColumns, padding: "14px 14px", gap: 6, borderBottom: `1px solid ${theme.line}`, background: "rgba(184,145,90,0.04)", alignItems: "center" }}>
              <label style={{ display: "grid", placeItems: "center" }}><input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAllVisible} /></label>
              {["Candidate", "Details", "CV", "Status", "Action", "Country", "City", "Suitable"].map((heading) => (
                <div key={heading} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.inkSoft, textAlign: heading === "Candidate" ? "left" : "center" }}>{heading}</div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: tableColumns, padding: "12px 14px", gap: 6, borderBottom: `1px solid ${theme.line}`, background: "rgba(255,250,242,0.58)", alignItems: "center" }}>
              <div />
              <input value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} placeholder="Name" style={controlStyle} />
              <div />
              <div />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={controlStyle}><option value="all">All</option><option value="Pending">Pending</option><option value="Reviewed">Reviewed</option><option value="Contacted">Contacted</option></select>
              <div />
              <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} style={controlStyle}><option value="all">All</option>{countryOptions.map((country) => <option key={country} value={country}>{country}</option>)}</select>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} style={controlStyle}><option value="all">All</option>{cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}</select>
              <select value={suitableFilter} onChange={(e) => setSuitableFilter(e.target.value)} style={controlStyle}><option value="all">All</option><option value="yes">Yes</option><option value="no">No</option></select>
            </div>

            {candidatePagination.pageItems.map((candidate, index) => {
              const statusStyle = statusStyles[candidate.reviewStatus] || statusStyles.Pending;
              return (
                <div
                  key={candidate.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openResumePreview(candidate)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openResumePreview(candidate);
                    }
                  }}
                  style={{ display: "grid", gridTemplateColumns: tableColumns, padding: "16px 14px", gap: 6, borderBottom: index < candidatePagination.pageItems.length - 1 ? `1px solid ${theme.line}` : "none", alignItems: "start", cursor: "pointer" }}
                >
                  <label style={{ display: "grid", placeItems: "start center", paddingTop: 6 }}><input type="checkbox" checked={selectedCandidateIds.includes(candidate.id)} onChange={(event) => { event.stopPropagation(); toggleCandidateSelection(candidate.id); }} /></label>
                  <div style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.inkWhite, lineHeight: 1.2 }}>{candidate.name}</div>
                    <div style={{ fontSize: 12.5, color: theme.blue, marginTop: 4, lineHeight: 1.3, overflowWrap: "anywhere", wordBreak: "break-word" }}>{candidate.email}</div>
                    <div style={{ fontSize: 12.5, color: theme.inkMuted, marginTop: 4 }}>{candidate.phone}</div>
                    <div style={{ fontSize: 12, color: theme.inkFaint, marginTop: 4 }}>{candidate.submittedAtLabel}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <button
                      type="button"
                      onClick={(event) => { event.stopPropagation(); openResumePreview(candidate); }}
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 72, height: 34, padding: "0 14px", borderRadius: 10, border: `1px solid ${theme.blue}33`, background: "rgba(58,123,213,0.08)", color: theme.blue, cursor: "pointer", fontSize: 12.5, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}
                    >
                      View
                    </button>
                    <div style={{ fontSize: 24, lineHeight: 1, fontWeight: 700, color: candidate.finalScore >= 50 ? theme.green : theme.red, fontFamily: "'DM Serif Display', serif" }}>
                      {candidate.finalScore}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => { event.stopPropagation(); openResumePreview(candidate); }}
                    style={{ border: "none", background: "transparent", color: "#2146ff", padding: 0, textAlign: "center", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Sora', sans-serif", whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word", width: "100%" }}
                  >
                    Show CV
                  </button>
                  <div style={{ textAlign: "center" }}><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 90, padding: "6px 14px", borderRadius: 999, border: `1px solid ${statusStyle.border}`, background: statusStyle.bg, color: statusStyle.text, fontSize: 12.5, fontWeight: 700 }}>{candidate.reviewStatus}</span></div>                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", width: "100%" }}>
                    <button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      style={{ minWidth: 82, height: 36, padding: "0 14px", borderRadius: 12, border: "1px solid rgba(45,158,117,0.26)", background: "rgba(45,158,117,0.10)", color: theme.green, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12.5, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}
                    >
                      Invite
                    </button>
                    <button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      style={{ minWidth: 82, height: 36, padding: "0 14px", borderRadius: 12, border: "1px solid rgba(217,79,107,0.22)", background: "rgba(217,79,107,0.08)", color: theme.red, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12.5, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}
                    >
                      Reject
                    </button>
                  </div>
                  <div style={{ fontSize: 13.5, color: theme.inkSoft, textAlign: "center" }}>{candidate.country}</div>
                  <div style={{ fontSize: 13.5, color: theme.inkSoft, textAlign: "center" }}>{candidate.city}</div>
                  <div style={{ overflowWrap: "anywhere", wordBreak: "break-word", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 50, padding: "6px 10px", borderRadius: 999, border: `1px solid ${candidate.suitable ? "rgba(45,158,117,0.24)" : "rgba(217,79,107,0.22)"}`, background: candidate.suitable ? "rgba(45,158,117,0.10)" : "rgba(217,79,107,0.08)", color: candidate.suitable ? theme.green : theme.red, fontSize: 12.5, fontWeight: 700 }}>{candidate.suitable ? "YES" : "NO"}</div>
                  </div>
                </div>
              );
            })}

            {!candidatePagination.pageItems.length && <div style={{ padding: "28px 20px", textAlign: "center", color: theme.inkMuted }}>No candidates matched the current filters.</div>}
          </div>
        </div>

        <TablePagination
          page={candidatePagination.currentPage}
          totalPages={candidatePagination.totalPages}
          startIndex={candidatePagination.startIndex}
          endIndex={candidatePagination.endIndex}
          totalItems={filteredCandidates.length}
          onPageChange={setCandidatePage}
          theme={theme}
        />
      </div>

      <div style={{ background: "linear-gradient(135deg,rgba(184,145,90,0.08),rgba(184,145,90,0.04))", border: `1px solid ${theme.goldBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <AlertCircle size={16} color={theme.gold} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 12.5, color: theme.inkMuted, lineHeight: 1.6 }}>
          <span style={{ color: theme.inkSoft, fontWeight: 600 }}>CV Results now use the requested candidates-only structure.</span> Filters, score ordering, suitability, and row selection stay inside the dashboard theme.
        </div>
      </div>
      {previewCandidate && <ResumeSidebarModal candidate={previewCandidate} theme={theme} onClose={closeResumePreview} />}
    </div>
  );
}
