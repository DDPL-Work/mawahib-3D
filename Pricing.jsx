import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const C = {
	bg: "#f5f0eb",
	bgDark: "#0a0f1e",
	ink: "#0f172a",
	inkMid: "#475569",
	inkLight: "#94a3b8",
	gold: "#b8955a",
	goldLight: "#d4b483",
	goldBright: "#f0c97a",
	goldPale: "rgba(184,149,90,.10)",
	goldBorder: "rgba(184,149,90,.22)",
	white: "#ffffff",
	border: "rgba(15,23,42,.08)",
	borderMid: "rgba(15,23,42,.14)",
};

const FontLink = () => (
	<>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
		<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
	</>
);

const GlobalStyles = () => (
	<style>{`
		*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
		html{scroll-behavior:smooth}
		body{background:#0a0f1e;color:#f5f0eb;font-family:'Sora',sans-serif;overflow-x:hidden}
		@media(min-width:769px){body,a,button{cursor:none}}
		::-webkit-scrollbar{width:2px}
		::-webkit-scrollbar-track{background:#0a0f1e}
		::-webkit-scrollbar-thumb{background:#b8955a;border-radius:2px}
		.gold-shimmer{
			background:linear-gradient(90deg,#b8955a,#f0c97a,#b8955a,#d4b483,#f0c97a);
			background-size:200% auto;
			-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
			animation:shimmer-gold 3s linear infinite
		}
		@keyframes shimmer-gold{
			0%{background-position:-200% center}
			100%{background-position:200% center}
		}
		@media(max-width:900px){.two-col{grid-template-columns:1fr!important}}
		@media(max-width:1024px){.feat-grid{grid-template-columns:repeat(2,1fr)!important}}
		@media(max-width:600px){.feat-grid{grid-template-columns:1fr!important}}
	`}</style>
);

const Label = ({ children, color = C.gold, bg = "rgba(184,149,90,.10)", border = C.goldBorder }) => (
	<div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: bg, border: `1px solid ${border}`, borderRadius: 9999, padding: "5px 14px", fontSize: 10, fontWeight: 700, color, letterSpacing: ".11em", marginBottom: 20 }}>
		<span style={{ width: 4, height: 4, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, display: "inline-block" }} />
		{children}
	</div>
);

function PricingCard({ plan, price, features, highlight }) {
	return (
		<motion.div
			whileHover={{ y: -8, scale: 1.03, borderColor: C.goldBright, boxShadow: `0 20px 60px rgba(0,0,0,.4)` }}
			transition={{ duration: .3 }}
			style={{
				background: highlight ? "rgba(184,149,90,.06)" : "rgba(255,255,255,.03)",
				border: `1px solid ${highlight ? C.goldBright : "rgba(255,255,255,.06)"}`,
				borderRadius: 18,
				padding: "clamp(22px,3vw,32px)",
				overflow: "hidden",
				backdropFilter: "blur(12px)",
				cursor: "default",
				boxShadow: highlight ? `0 0 40px ${C.goldBright}` : undefined,
				color: highlight ? C.goldBright : "#fff",
				margin: "0 auto",
				maxWidth: 340,
				width: "100%"
			}}
		>
			<div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", marginBottom: 14 }}>{plan}</div>
			<div style={{ fontSize: 28, fontWeight: 800, color: highlight ? C.goldBright : "#fff", marginBottom: 10 }}>
				{price}
			</div>
			<ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 18 }}>
				{features.map((f, i) => (
					<li key={i} style={{ fontSize: 13, color: "rgba(255,255,255,.32)", marginBottom: 8, lineHeight: 1.7 }}>{f}</li>
				))}
			</ul>
			<motion.a
				href="#"
				whileHover={{ scale: 1.04, background: `linear-gradient(135deg,${C.gold},${C.goldBright})`, color: C.bgDark }}
				style={{ display: "inline-block", background: highlight ? `linear-gradient(135deg,${C.gold},${C.goldBright})` : "rgba(255,255,255,.05)", borderRadius: 12, padding: "10px 24px", fontSize: 14, fontWeight: 700, color: highlight ? C.bgDark : "rgba(255,255,255,.7)", textDecoration: "none", marginTop: 8, boxShadow: highlight ? `0 6px 24px rgba(184,149,90,.3)` : undefined }}
			>
				Choose Plan
			</motion.a>
		</motion.div>
	);
}

export default function Pricing() {
	return (
		<>
			<FontLink />
			<GlobalStyles />
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }} style={{ position: "relative", zIndex: 10 }}>
				<main style={{ minHeight: "100vh", background: C.bgDark, color: C.bg, fontFamily: "'Sora',sans-serif", padding: "clamp(80px,10vw,120px) clamp(28px,7vw,100px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Label>PRICING PLANS</Label>
					<h1 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: "clamp(2.6rem,7vw,4rem)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.05, color: "rgba(255,255,255,.95)", marginBottom: 6, textAlign: "center" }}>
						<span className="gold-shimmer">Choose Your Plan</span>
					</h1>
					<p style={{ color: "rgba(255,255,255,.5)", fontSize: "clamp(14px,1.6vw,17px)", lineHeight: 1.85, marginBottom: 38, maxWidth: 440, textAlign: "center" }}>
						Flexible pricing for teams of all sizes. All plans include AI-powered candidate intelligence, structured interviews, and instant ranking.
					</p>
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "clamp(18px,3vw,32px)", width: "100%", maxWidth: 1100, margin: "0 auto" }}>
						<PricingCard plan="Starter" price="$49/mo" features={["Up to 50 candidates/mo", "Basic AI screening", "Email support"]} />
						<PricingCard plan="Pro" price="$129/mo" features={["Up to 200 candidates/mo", "Advanced AI interviews", "Priority support", "Custom branding"]} highlight />
						<PricingCard plan="Enterprise" price="Contact Us" features={["Unlimited candidates", "Dedicated onboarding", "Custom integrations", "24/7 support"]} />
					</div>

					{/* Extended Content */}
					<section style={{ marginTop: 60, width: "100%", maxWidth: 1100 }}>
						<h2 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: "clamp(2rem,5vw,3rem)", color: C.goldBright, marginBottom: 24 }}>What's Included?</h2>
						<ul style={{ color: "rgba(255,255,255,.7)", fontSize: 16, lineHeight: 2, marginBottom: 40 }}>
							<li>AI-powered candidate screening and ranking</li>
							<li>Structured voice interviews with AI avatar</li>
							<li>Customizable scoring rubrics</li>
							<li>Real-time analytics dashboard</li>
							<li>Team collaboration tools</li>
							<li>GDPR & SOC 2 compliance</li>
							<li>Priority onboarding for Pro & Enterprise</li>
							<li>24/7 support for Enterprise</li>
						</ul>
						<div style={{ background: "rgba(255,255,255,.04)", borderRadius: 18, padding: "32px 24px", marginBottom: 60 }}>
							<h3 style={{ color: C.gold, fontSize: 22, marginBottom: 12 }}>Frequently Asked Questions</h3>
							<div style={{ marginBottom: 18 }}>
								<strong>Can I upgrade or downgrade my plan?</strong>
								<p style={{ color: "rgba(255,255,255,.5)", fontSize: 15 }}>Yes, you can change your plan at any time from your dashboard. Changes take effect immediately.</p>
							</div>
							<div style={{ marginBottom: 18 }}>
								<strong>Is there a free trial?</strong>
								<p style={{ color: "rgba(255,255,255,.5)", fontSize: 15 }}>We offer a 14-day free trial for Starter and Pro plans. No credit card required.</p>
							</div>
							<div style={{ marginBottom: 18 }}>
								<strong>How does onboarding work?</strong>
								<p style={{ color: "rgba(255,255,255,.5)", fontSize: 15 }}>Enterprise customers receive dedicated onboarding and custom integrations. Pro users get priority onboarding.</p>
							</div>
							<div style={{ marginBottom: 18 }}>
								<strong>Is my data secure?</strong>
								<p style={{ color: "rgba(255,255,255,.5)", fontSize: 15 }}>Yes, Mawahib is fully GDPR and SOC 2 compliant. Your data is encrypted and protected.</p>
							</div>
						</div>
						<div style={{ textAlign: "center", marginBottom: 80 }}>
							<motion.a
								href="https://mawahib.ai/request-campaign"
								target="_blank"
								whileHover={{ scale: 1.05, boxShadow: `0 16px 50px rgba(184,149,90,.5)` }}
								whileTap={{ scale: .96 }}
								style={{ background: `linear-gradient(135deg,${C.gold},${C.goldBright})`, borderRadius: 14, padding: "18px 44px", fontSize: 18, fontWeight: 700, color: C.bgDark, textDecoration: "none", boxShadow: `0 8px 30px rgba(184,149,90,.35)` }}
							>
								Request a Demo
							</motion.a>
						</div>
					</section>
				</main>
			</motion.div>
		</>
	);
}
