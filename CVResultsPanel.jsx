import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Mail, MoreHorizontal, RotateCcw, X } from "lucide-react";
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
  const [phoneQuery, setPhoneQuery] = useState("");
  const [suitableFilter, setSuitableFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");
  const [scoreSort, setScoreSort] = useState("high-to-low");
  const [candidatePage, setCandidatePage] = useState(1);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);

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
    const normalizedPhone = phoneQuery.trim().toLowerCase();

    const filtered = candidates.filter((candidate) => {
      const matchesName = !normalizedName
        || candidate.name.toLowerCase().includes(normalizedName)
        || candidate.email.toLowerCase().includes(normalizedName);
      const matchesStatus = statusFilter === "all" || candidate.reviewStatus === statusFilter;
      const matchesGender = genderFilter === "all" || candidate.gender === genderFilter;
      const matchesCountry = countryFilter === "all" || candidate.country === countryFilter;
      const matchesCity = cityFilter === "all" || candidate.city === cityFilter;
      const matchesPhone = !normalizedPhone || candidate.phone.toLowerCase().includes(normalizedPhone);
      const matchesSuitable = suitableFilter === "all"
        || (suitableFilter === "yes" && candidate.suitable)
        || (suitableFilter === "no" && !candidate.suitable);

      return matchesName && matchesStatus && matchesGender && matchesCountry && matchesCity && matchesPhone && matchesSuitable;
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
  }, [candidates, nameQuery, statusFilter, genderFilter, countryFilter, cityFilter, phoneQuery, suitableFilter, dateSort, scoreSort]);

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
  }, [nameQuery, statusFilter, genderFilter, countryFilter, cityFilter, phoneQuery, suitableFilter, dateSort, scoreSort]);

  useEffect(() => {
    setSelectedCandidateIds((currentIds) => currentIds.filter((id) => filteredCandidates.some((candidate) => candidate.id === id)));
  }, [filteredCandidates]);

  const resetFilters = () => {
    setNameQuery("");
    setStatusFilter("all");
    setGenderFilter("all");
    setCountryFilter("all");
    setCityFilter("all");
    setPhoneQuery("");
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

  const tableColumns = "48px minmax(140px, 1.6fr) minmax(100px, 0.85fr) minmax(100px, 0.9fr) minmax(90px, 0.75fr) minmax(100px, 0.9fr) minmax(95px, 0.8fr) minmax(80px, 0.7fr) minmax(95px, 0.85fr) minmax(90px, 0.75fr) minmax(90px, 0.75fr)";

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
              {["Candidate", "Details", "CV", "Status", "Action", "Country", "City", "Phone", "Final Score", "Suitable"].map((heading) => (
                <div key={heading} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.inkSoft }}>{heading}</div>
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
              <input value={phoneQuery} onChange={(e) => setPhoneQuery(e.target.value)} placeholder="Phone" style={controlStyle} />
              <select value={scoreSort} onChange={(e) => setScoreSort(e.target.value)} style={controlStyle}><option value="high-to-low">High to low</option><option value="low-to-high">Low to high</option><option value="none">None</option></select>
              <select value={suitableFilter} onChange={(e) => setSuitableFilter(e.target.value)} style={controlStyle}><option value="all">All</option><option value="yes">Yes</option><option value="no">No</option></select>
            </div>

            {candidatePagination.pageItems.map((candidate, index) => {
              const statusStyle = statusStyles[candidate.reviewStatus] || statusStyles.Pending;
              return (
                <div key={candidate.id} style={{ display: "grid", gridTemplateColumns: tableColumns, padding: "16px 14px", gap: 6, borderBottom: index < candidatePagination.pageItems.length - 1 ? `1px solid ${theme.line}` : "none", alignItems: "start" }}>
                  <label style={{ display: "grid", placeItems: "start center", paddingTop: 6 }}><input type="checkbox" checked={selectedCandidateIds.includes(candidate.id)} onChange={() => toggleCandidateSelection(candidate.id)} /></label>
                  <div style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.inkWhite, lineHeight: 1.2 }}>{candidate.name}</div>
                    <div style={{ fontSize: 12.5, color: theme.blue, marginTop: 4, lineHeight: 1.3, overflowWrap: "anywhere", wordBreak: "break-word" }}>{candidate.email}</div>
                    <div style={{ fontSize: 12, color: theme.inkFaint, marginTop: 4 }}>{candidate.submittedAtLabel}</div>
                  </div>
                  <button type="button" style={{ border: "none", background: "transparent", color: "#2146ff", padding: 0, textAlign: "left", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Sora', sans-serif", whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word" }}>{candidate.detailsLabel}</button>
                  <button type="button" style={{ border: "none", background: "transparent", color: "#2146ff", padding: 0, textAlign: "left", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Sora', sans-serif", whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word" }}>{candidate.cvFile}</button>
                  <div><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 90, padding: "6px 14px", borderRadius: 999, border: `1px solid ${statusStyle.border}`, background: statusStyle.bg, color: statusStyle.text, fontSize: 12.5, fontWeight: 700 }}>{candidate.reviewStatus}</span></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                    {[{ key: "mail", icon: Mail, color: theme.green, bg: "rgba(45,158,117,0.10)", border: "rgba(45,158,117,0.26)" }, { key: "reject", icon: X, color: theme.red, bg: "rgba(217,79,107,0.08)", border: "rgba(217,79,107,0.22)" }, { key: "refresh", icon: RotateCcw, color: theme.yellow, bg: "rgba(196,138,0,0.08)", border: "rgba(196,138,0,0.22)" }].map(({ key, icon: Icon, color, bg, border }) => (
                      <button key={key} type="button" style={{ width: 34, height: 34, minWidth: 34, borderRadius: 12, border: `1px solid ${border}`, background: bg, color, display: "grid", placeItems: "center", cursor: "pointer" }}>
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 13.5, color: theme.inkSoft }}>{candidate.country}</div>
                  <div style={{ fontSize: 13.5, color: theme.inkSoft }}>{candidate.city}</div>
                  <div style={{ fontSize: 13.5, color: theme.inkWhite }}>{candidate.phone}</div>
                  <div style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "6px 12px", borderRadius: 999, background: candidate.finalScore >= 50 ? "rgba(45,158,117,0.12)" : "rgba(217,79,107,0.10)", border: `1px solid ${candidate.finalScore >= 50 ? "rgba(45,158,117,0.24)" : "rgba(217,79,107,0.22)"}`, color: candidate.finalScore >= 50 ? theme.green : theme.red, fontSize: 12.5, fontWeight: 700 }}>{candidate.finalScore}/100</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8, fontSize: 11.5, color: theme.inkMuted, lineHeight: 1.4, maxWidth: 140 }}>
                      <div>JD: {candidate.jdScore}</div>
                      <div>Penalty: {candidate.penalty}</div>
                      <div>Overqual: {candidate.overqualificationPenalty}</div>
                      <div>Disq: {candidate.disqualified}</div>
                    </div>
                  </div>
                  <div style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 50, padding: "6px 10px", borderRadius: 999, border: `1px solid ${candidate.suitable ? "rgba(45,158,117,0.24)" : "rgba(217,79,107,0.22)"}`, background: candidate.suitable ? "rgba(45,158,117,0.10)" : "rgba(217,79,107,0.08)", color: candidate.suitable ? theme.green : theme.red, fontSize: 12.5, fontWeight: 700 }}>{candidate.suitable ? "YES" : "NO"}</div>
                    <div style={{ fontSize: 11.5, color: theme.inkFaint, marginTop: 6 }}>{candidate.suitable ? "Score ≥ 50" : "Score < 50"}</div>
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
    </div>
  );
}
