"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "edit" | "merge" | "split";

export default function Home() {
  const [tab, setTab] = useState<Tab>("edit");
  const router = useRouter();

  return (
    <div style={container}>
      {/* HERO */}
      <div style={hero}>
        <h1 style={title}>⚡ EditZap</h1>
        <p style={subtitle}>
          Edit, merge, and split PDFs — instantly, privately, beautifully.
        </p>
      </div>

      {/* TABS */}
      <div style={tabsWrapper}>
        <div style={tabs}>
          {tabsList.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...tabStyle,
                ...(tab === t.id ? activeTab : {}),
              }}
            >
              <span style={{ marginRight: 6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={grid}>
        {tabsList.map((t) => (
          <div
            key={t.id}
            style={{
              ...card,
              transform: tab === t.id ? "scale(1.02)" : "scale(1)",
              border:
                tab === t.id
                  ? "1px solid #111"
                  : "1px solid rgba(0,0,0,0.06)",
              opacity: tab === t.id ? 1 : 0.7,
            }}
            onClick={() => setTab(t.id)}
          >
            <div style={cardIcon}>{t.icon}</div>
            <h3>{t.title}</h3>
            <p style={cardText}>{t.desc}</p>

            {tab === t.id && (
              <button
                style={primaryBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/editor");
                }}
              >
                {t.cta} →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={features}>
        <Feature title="⚡ Instant" text="No uploads, runs in your browser" />
        <Feature title="🔒 Private" text="Files never leave your device" />
        <Feature title="✨ Smooth" text="Clean and distraction-free experience" />
      </div>

      {/* SEO */}
      <div style={seo}>
        <h3>Free Online PDF Editor</h3>
        <p>
          EditZap is a fast, secure PDF editor that lets you edit, merge,
          and split PDFs directly in your browser without uploads.
        </p>
      </div>
    </div>
  );
}

// ── DATA ─────────────────────────────────
const tabsList = [
  {
    id: "edit" as Tab,
    label: "Edit",
    icon: "✏",
    title: "Edit PDF",
    desc: "Add text, draw, and customize your PDF precisely.",
    cta: "Start Editing",
  },
  {
    id: "merge" as Tab,
    label: "Merge",
    icon: "⊞",
    title: "Merge PDFs",
    desc: "Combine multiple PDF files into one seamless document.",
    cta: "Merge Files",
  },
  {
    id: "split" as Tab,
    label: "Split",
    icon: "✂",
    title: "Split PDF",
    desc: "Extract pages or split PDFs instantly.",
    cta: "Split PDF",
  },
];

// ── COMPONENT ────────────────────────────
function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div style={featureCard}>
      <div style={{ fontSize: 20 }}>{title}</div>
      <p style={{ fontSize: 13, color: "#666" }}>{text}</p>
    </div>
  );
}

// ── STYLES ───────────────────────────────
const container: React.CSSProperties = {
  padding: 40,
  maxWidth: 1000,
  margin: "auto",
  fontFamily: "system-ui",
};

const hero: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 30,
};

const title: React.CSSProperties = {
  fontSize: 44,
  marginBottom: 10,
};

const subtitle: React.CSSProperties = {
  color: "#666",
  fontSize: 16,
};

const tabsWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 30,
};

const tabs: React.CSSProperties = {
  display: "flex",
  background: "#f3f4f6",
  padding: 6,
  borderRadius: 14,
  gap: 6,
};

const tabStyle: React.CSSProperties = {
  padding: "8px 18px",
  borderRadius: 10,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
  transition: "all 0.2s ease",
};

const activeTab: React.CSSProperties = {
  background: "#111",
  color: "#fff",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20,
};

const card: React.CSSProperties = {
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  cursor: "pointer",
  transition: "all 0.25s ease",
  textAlign: "center",
};

const cardIcon: React.CSSProperties = {
  fontSize: 28,
  marginBottom: 10,
};

const cardText: React.CSSProperties = {
  color: "#666",
  fontSize: 14,
  marginBottom: 16,
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 18px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const features: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: 50,
  flexWrap: "wrap",
};

const featureCard: React.CSSProperties = {
  background: "#fff",
  padding: 14,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  width: 180,
};

const seo: React.CSSProperties = {
  marginTop: 60,
  textAlign: "center",
  color: "#666",
  fontSize: 14,
};