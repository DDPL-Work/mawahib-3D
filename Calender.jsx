import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Mail, 
  Phone, 
  Briefcase, 
  Clock, 
  ArrowLeft,
  Calendar as CalendarIcon,
  X,
  ExternalLink,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/* ─── Design Tokens (Premium Palette) ────────────────────────────── */
const C = {
  bg: "#fdfbf7",
  bgGlass: "rgba(255, 255, 255, 0.7)",
  bgGlassDark: "rgba(255, 255, 255, 0.4)",
  ink: "#0f172a",
  inkMuted: "#64748b",
  gold: "#b8955a",
  goldLight: "#d4b483",
  goldBright: "#f0c97a",
  goldPale: "rgba(184, 149, 90, 0.08)",
  goldBorder: "rgba(184, 149, 90, 0.22)",
  success: "#10b981",
  successPale: "rgba(16, 185, 129, 0.08)",
  border: "rgba(15, 23, 42, 0.06)",
  shadow: "0 20px 50px rgba(184, 149, 90, 0.1)",
  glow: "0 0 20px rgba(184, 149, 90, 0.15)"
};

/* ─── Dynamic Date Helpers ───────────────────────────────────────── */
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Adjust to Sunday
  return new Date(d.setDate(diff));
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

const formatShortDate = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatFullDateRange = (start) => {
  const end = addDays(start, 6);
  return `${formatShortDate(start)} – ${formatShortDate(end)}, ${start.getFullYear()}`;
};

/* ─── Mock Data Template ─────────────────────────────────────────── */
const SLOT_TEMPLATES = [
  { dayOffset: 1, time: "09:15 AM", name: "James Wilson", role: "Product Designer", email: "j.wilson@design.co", phone: "+44 7700 900077", position: "Senior UI/UX Designer", score: 94, avatar: "J" },
  { dayOffset: 3, time: "10:00 AM", name: "Priya Sharma", role: "Finance Operations Lead", email: "priya.s@fintech.com", phone: "+91 98765 43210", position: "Finance Operations Lead", score: 88, avatar: "P" },
  { dayOffset: 3, time: "11:30 AM", name: "Rahul Kapoor", role: "Backend Engineer", email: "rahul.k@tech.io", phone: "+91 98888 77777", position: "Senior Backend Engineer", score: 82, avatar: "R" },
  { dayOffset: 3, time: "02:30 PM", name: "Arjun Mehta", role: "Customer Success Manager", email: "arjun.m@gmail.com", phone: "+91 99870 45678", position: "Customer Success Manager", score: 74, avatar: "A" },
  { dayOffset: 3, time: "04:00 PM", name: "Sara Khan", role: "HR Specialist", email: "sara.k@org.com", phone: "+91 77766 55544", position: "HR Manager", score: 85, avatar: "S" },
  { dayOffset: 3, time: "05:15 PM", name: "Leo Das", role: "DevOps Engineer", email: "leo.d@cloud.com", phone: "+91 99999 00000", position: "DevOps Lead", score: 90, avatar: "L" },
  { dayOffset: 5, time: "11:00 AM", name: "Sonal Verma", role: "B2B Sales Representative", email: "sonal.v@salesforce.com", phone: "+91 88765 11223", position: "B2B Sales Representative", score: 91, avatar: "S" },
  { dayOffset: 5, time: "01:00 PM", name: "Mike Ross", role: "Legal Associate", email: "mike.r@pearson.com", phone: "+1 212 555 0199", position: "Legal Counsel", score: 95, avatar: "M" }
];

export default function Calender() {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Optional: Refresh data logic here
    }, 1500);
  };

  const handlePrevWeek = () => setCurrentWeekStart(prev => addDays(prev, -7));
  const handleNextWeek = () => setCurrentWeekStart(prev => addDays(prev, 7));
  const handleToday = () => setCurrentWeekStart(getStartOfWeek(new Date()));

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(currentWeekStart, i);
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        isToday: isSameDay(date, new Date())
      };
    });
  }, [currentWeekStart]);

  const activeSlots = useMemo(() => {
    // Group templates by day (No limit)
    const grouped = {};
    SLOT_TEMPLATES.forEach(template => {
      if (!grouped[template.dayOffset]) grouped[template.dayOffset] = [];
      grouped[template.dayOffset].push(template);
    });

    const flattened = [];
    Object.keys(grouped).forEach(offset => {
      grouped[offset].forEach(template => {
        flattened.push({
          ...template,
          id: `${currentWeekStart.getTime()}-${template.dayOffset}-${template.time}`,
          fullDate: addDays(currentWeekStart, parseInt(offset)),
          dateLabel: addDays(currentWeekStart, parseInt(offset)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
      });
    });
    return flattened;
  }, [currentWeekStart]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: `radial-gradient(circle at 0% 0%, rgba(184, 149, 90, 0.05) 0%, transparent 40%), 
                   radial-gradient(circle at 100% 100%, rgba(184, 149, 90, 0.03) 0%, transparent 40%), ${C.bg}`,
      fontFamily: "'Sora', sans-serif",
      color: C.ink,
      padding: isMobile ? "20px 16px" : "40px 6vw",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* ── Page Header ── */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-end", 
        marginBottom: 40,
        flexWrap: "wrap",
        gap: 24
      }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ 
              background: C.goldPale, 
              border: `1px solid ${C.goldBorder}`, 
              borderRadius: 8, 
              padding: "4px 10px",
              fontSize: 10,
              fontWeight: 800,
              color: C.gold,
              letterSpacing: "0.12em"
            }}>SETTINGS</div>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.border }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: C.inkMuted }}>Calendar Management</div>
          </div>
          <h1 style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontStyle: "italic", 
            fontSize: "clamp(2.2rem, 4vw, 3rem)", 
            margin: 0,
            lineHeight: 1
          }}>Your Schedule.</h1>
          <p style={{ color: C.inkMuted, fontSize: 14, marginTop: 12, maxWidth: 500, lineHeight: 1.6 }}>
            Track and manage your upcoming AI-assisted interviews. Select any booked slot to view full candidate intelligence.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 14 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSync}
            style={{
              background: C.bgGlass,
              backdropFilter: "blur(12px)",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "12px 20px",
              fontSize: 13,
              fontWeight: 700,
              color: C.ink,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
            }}
          >
            <motion.div animate={isSyncing ? { rotate: 360 } : {}} transition={isSyncing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}>
              <Zap size={16} color={C.gold} fill={isSyncing ? C.gold : "transparent"} />
            </motion.div>
            {isSyncing ? "Syncing..." : "Sync Schedule"}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard")}
            style={{ 
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(184, 149, 90, 0.25)"
            }}
          >
            <ArrowLeft size={16} />
            Dashboard
          </motion.button>
        </motion.div>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 380px", 
        gap: 32,
        alignItems: "start"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <StatusPill icon={CalendarIcon} label="Total Bookings" value="12" />
            <StatusPill icon={Zap} label="This Week" value={activeSlots.length.toString().padStart(2, '0')} active />
            <StatusPill icon={ShieldCheck} label="Success Rate" value="94%" />
          </motion.div>

          {/* ── Calendar View ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: C.bgGlass,
              backdropFilter: "blur(24px)",
              borderRadius: 32,
              padding: isMobile ? "24px" : "40px",
              border: `1px solid ${C.goldBorder}`,
              boxShadow: C.shadow
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>Weekly Planner</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold }} />
                  <span style={{ fontSize: 13, color: C.inkMuted, fontWeight: 500 }}>{formatFullDateRange(currentWeekStart)}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconButton icon={ChevronLeft} onClick={handlePrevWeek} />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToday}
                  style={{ 
                    background: isSameDay(currentWeekStart, getStartOfWeek(new Date())) ? C.goldPale : "transparent", 
                    border: `1px solid ${C.goldBorder}`, 
                    padding: "10px 18px", 
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 800,
                    color: C.gold,
                    cursor: "pointer"
                  }}
                >
                  {isSameDay(currentWeekStart, getStartOfWeek(new Date())) ? "Current Week" : "Back to Today"}
                </motion.button>
                <IconButton icon={ChevronRight} onClick={handleNextWeek} />
              </div>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(180px, 1fr))", 
              gap: 16 
            }}>
              {weekDays.map((day) => {
                const daySlots = activeSlots.filter(s => isSameDay(s.fullDate, day.fullDate));
                const hasSlots = daySlots.length > 0;

                return (
                  <div key={day.name} style={{ 
                    borderRadius: 24,
                    border: `1px solid ${day.isToday ? C.goldBorder : C.border}`,
                    background: day.isToday ? "rgba(184, 149, 90, 0.04)" : "rgba(255, 255, 255, 0.4)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    {day.isToday && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.gold }} />}
                    
                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{day.name.slice(0, 3)}</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: day.isToday ? C.gold : C.ink }}>{day.dateLabel.split(" ")[1]}</div>
                        </div>
                        {hasSlots && (
                          <div style={{ 
                            width: 24, height: 24, borderRadius: "50%", background: C.gold, 
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, color: "#fff"
                          }}>{daySlots.length}</div>
                        )}
                      </div>

                      <div style={{ position: "relative" }}>
                        <div 
                          className="custom-scrollbar"
                          style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            gap: 12,
                            maxHeight: 180, // Height for approx 2.2 slots to show scroll exists
                            overflowY: hasSlots && daySlots.length > 2 ? "auto" : "visible",
                            paddingRight: hasSlots && daySlots.length > 2 ? 4 : 0,
                            paddingBottom: 4
                          }}
                        >
                          {hasSlots ? (
                            daySlots.map(slot => (
                              <motion.button
                                key={slot.id}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelectedSlot(slot)}
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "14px",
                                  borderRadius: 18,
                                  background: selectedSlot?.id === slot.id ? C.gold : "#fff",
                                  border: `1px solid ${selectedSlot?.id === slot.id ? C.gold : C.border}`,
                                  cursor: "pointer",
                                  boxShadow: selectedSlot?.id === slot.id ? "0 8px 20px rgba(184, 149, 90, 0.25)" : "0 4px 10px rgba(0,0,0,0.02)",
                                  transition: "all 0.2s ease",
                                  flexShrink: 0 // Prevent height collapse in scroll container
                                }}
                              >
                                <div style={{ 
                                  fontSize: 10, 
                                  fontWeight: 800, 
                                  color: selectedSlot?.id === slot.id ? "rgba(255,255,255,0.8)" : C.gold,
                                  marginBottom: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4
                                }}>
                                  <Clock size={10} />
                                  {slot.time}
                                </div>
                                <div style={{ 
                                  fontSize: 13, 
                                  fontWeight: 800, 
                                  color: selectedSlot?.id === slot.id ? "#fff" : C.ink,
                                  marginBottom: 2
                                }}>{slot.name.split(" ")[0]}</div>
                                <div style={{ 
                                  fontSize: 10, 
                                  fontWeight: 600,
                                  color: selectedSlot?.id === slot.id ? "rgba(255,255,255,0.6)" : C.inkMuted,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis"
                                }}>{slot.role}</div>
                              </motion.button>
                            ))
                          ) : (
                            <div style={{ 
                              height: 60, 
                              border: `1.5px dashed ${C.border}`, 
                              borderRadius: 18,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              color: C.inkMuted,
                              fontWeight: 500
                            }}>Empty</div>
                          )}
                        </div>
                        
                        {/* Scroll Indicator Fade */}
                        {hasSlots && daySlots.length > 2 && (
                          <div style={{ 
                            position: "absolute", 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            height: 20, 
                            background: `linear-gradient(to top, ${day.isToday ? "rgba(251,248,242,1)" : "rgba(255,255,255,0.9)"}, transparent)`,
                            pointerEvents: "none",
                            borderRadius: "0 0 18px 18px"
                          }} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Side Intelligence Panel ── */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedSlot ? "details" : "empty"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ 
              background: C.bgGlass,
              backdropFilter: "blur(32px)",
              borderRadius: 32,
              padding: "40px 32px",
              border: `1px solid ${C.goldBorder}`,
              boxShadow: C.shadow,
              position: isMobile ? "relative" : "sticky",
              top: 40,
              minHeight: 500
            }}
          >
            {selectedSlot ? (
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 20px" }}>
                    <div style={{ 
                      width: "100%", height: "100%", borderRadius: "50%", 
                      background: `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 32, fontWeight: 800, color: "#fff",
                      boxShadow: `0 10px 25px rgba(184, 149, 90, 0.3)`
                    }}>
                      {selectedSlot.avatar}
                    </div>
                    <div style={{ 
                      position: "absolute", bottom: 0, right: 0,
                      width: 26, height: 26, borderRadius: "50%",
                      background: C.success, border: "4px solid #fff",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <ShieldCheck size={12} color="#fff" />
                    </div>
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>{selectedSlot.name}</h2>
                  <p style={{ fontSize: 14, color: C.inkMuted, fontWeight: 500, marginTop: 4 }}>{selectedSlot.position}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <IntelligenceItem icon={Mail} label="Candidate Email" value={selectedSlot.email} />
                  <IntelligenceItem icon={Phone} label="Contact Phone" value={selectedSlot.phone} />
                  <IntelligenceItem icon={Clock} label="Scheduled Time" value={selectedSlot.dateLabel + " @ " + selectedSlot.time} />
                  
                  <div style={{ 
                    marginTop: 8,
                    background: "rgba(15, 23, 42, 0.03)", 
                    borderRadius: 24, 
                    padding: "24px",
                    border: `1px solid ${C.border}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: C.inkMuted, letterSpacing: "0.05em" }}>MATCH SCORE</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{selectedSlot.score}%</span>
                    </div>
                    <div style={{ height: 8, background: "rgba(0,0,0,0.05)", borderRadius: 4, position: "relative" }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedSlot.score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.gold}, ${C.goldBright})`, borderRadius: 4, boxShadow: C.glow }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      <Zap size={12} color={C.gold} /> Top 5% of candidate pool
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    <motion.button
                      whileHover={{ y: -2, boxShadow: "0 10px 20px rgba(184, 149, 90, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: C.gold,
                        color: "#fff",
                        border: "none",
                        borderRadius: 16,
                        padding: "16px",
                        fontSize: 13,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        cursor: "pointer"
                      }}
                    >
                      <Download size={16} />
                      CV
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2, background: "rgba(15, 23, 42, 0.06)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSlot(null)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 16,
                        padding: "16px",
                        fontSize: 13,
                        fontWeight: 800,
                        color: C.ink,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        cursor: "pointer"
                      }}
                    >
                      <X size={16} />
                      Close
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, color: C.gold }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: C.inkMuted,
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      marginTop: 8,
                      cursor: "pointer"
                    }}
                  >
                    View Full Assessment <ExternalLink size={12} />
                  </motion.button>
                </div>
              </>
            ) : (
              <div style={{ 
                height: 400, 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "20px"
              }}>
                <div style={{ 
                  width: 72, 
                  height: 72, 
                  borderRadius: 24, 
                  background: C.goldPale, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: C.gold,
                  marginBottom: 24,
                  boxShadow: "inset 0 0 0 1px rgba(184, 149, 90, 0.1)"
                }}>
                  <CalendarIcon size={32} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>No Selection</h3>
                <p style={{ color: C.inkMuted, fontSize: 14, lineHeight: 1.6, maxWidth: 220 }}>
                  Select an interview slot from your calendar to view candidate details.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div style={{ 
        marginTop: 60, 
        paddingTop: 32, 
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <FooterItem label="TIMEZONE" value="UTC+03:00 (Riyadh)" />
          <FooterItem label="SYNC STATUS" value="Up to date" success />
        </div>
        <div style={{ fontSize: 12, color: C.inkMuted, fontWeight: 600, letterSpacing: "0.02em" }}>
          © 2025 Mawahib AI Intelligence • Secure Portal
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function StatusPill({ icon: Icon, label, value, active }) {
  return (
    <div style={{ 
      background: active ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : C.bgGlass,
      backdropFilter: "blur(12px)",
      border: `1px solid ${active ? C.gold : C.border}`,
      borderRadius: 16,
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
    }}>
      <div style={{ 
        width: 32, height: 32, borderRadius: 10, 
        background: active ? "rgba(255,255,255,0.2)" : C.goldPale,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: active ? "#fff" : C.gold
      }}>
        <Icon size={16} />
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: active ? "rgba(255,255,255,0.7)" : C.inkMuted, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: active ? "#fff" : C.ink }}>{value}</div>
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, background: "rgba(15, 23, 42, 0.05)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        width: 40, height: 40, borderRadius: 12,
        background: "transparent",
        border: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: C.ink
      }}
    >
      <Icon size={18} />
    </motion.button>
  );
}

function IntelligenceItem({ icon: Icon, label, value }) {
  return (
    <div style={{ 
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 18px",
      background: "rgba(255,255,255,0.4)",
      border: `1px solid ${C.border}`,
      borderRadius: 20
    }}>
      <div style={{ color: C.gold }}><Icon size={16} /></div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: C.inkMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{value}</div>
      </div>
    </div>
  );
}

function FooterItem({ label, value, success }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: C.inkMuted, letterSpacing: "0.05em" }}>{label}:</div>
      <div style={{ 
        fontSize: 11, fontWeight: 700, 
        color: success ? C.success : C.ink,
        display: "flex", alignItems: "center", gap: 5
      }}>
        {success && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success }} />}
        {value}
      </div>
    </div>
  );
}
