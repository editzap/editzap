"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "edit" | "merge" | "split";

type Theme = {
  bg: React.CSSProperties;
  card: React.CSSProperties;
  tabs: React.CSSProperties;
  activeTab: React.CSSProperties;
  primary: React.CSSProperties;
  textSoft: React.CSSProperties;
};

export default function Home() {
  const [tab, setTab] = useState<Tab>("edit");
  const [dark, setDark] = useState<boolean>(false);
  const router = useRouter();

  const theme: Theme = dark ? darkTheme : lightTheme;

  return (
    <div style={{ ...container, ...theme.bg }}>
      {/* NAV */}
      <div style={nav}>
        <h2>⚡ EditZap</h2>
        <button onClick={() => setDark(!dark)} style={toggleBtn}>
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* HERO */}
      <div style={hero}>
        <h1 style={title}>Edit PDFs Effortlessly</h1>
        <p style={{ ...subtitle, ...theme.textSoft }}>
          Fast, private, and beautifully simple tools.
        </p>
      </div>

      {/* TABS */}
      <div style={tabsWrapper}>
        <div style={{ ...tabs, ...theme.tabs }}>
          {tabsList.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...tabStyle,
                ...(tab === t.id ? { ...activeTab, ...theme.activeTab } : {}),
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS */}
      <div style={grid}>
        {tabsList.map((t) => (
          <div
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...card,
              ...theme.card,
              transform:
                tab === t.id ? "translateY(-6px) scale(1.03)" : "scale(1)",
              opacity: tab === t.id ? 1 : 0.75,
            }}
          >
            <div style={cardIcon}>{t.icon}</div>
            <h3>{t.title}</h3>
            <p style={{ ...cardText, ...theme.textSoft }}>{t.desc}</p>

            {tab === t.id && (
              <button
                style={{ ...primaryBtn, ...theme.primary }}
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
        <Feature theme={theme} title="⚡ Instant" text="Runs locally in browser" />
        <Feature theme={theme} title="🔒 Private" text="No uploads required" />
        <Feature theme={theme} title="✨ Smooth" text="Clean UX experience" />
      </div>

      {/* SEO */}
      <div style={{ ...seo, ...theme.textSoft }}>
        <h3>Free Online PDF Editor</h3>
        <p>
          EditZap lets you edit, merge, and split PDFs instantly without uploads.
        </p>
      </div>
    </div>
  );
}

// ── DATA ─────────────────────────────
const tabsList: {
  id: Tab;
  label: string;
  icon: string;
  title: string;
  desc: string;
  cta: string;
}[] = [
  {
    id: "edit",
    label: "Edit",
    icon: "✏",
    title: "Edit PDF",
    desc: "Add text and draw on your PDF easily.",
    cta: "Start Editing",
  },
  {
    id: "merge",
    label: "Merge",
    icon: "⊞",
    title: "Merge PDFs",
    desc: "Combine multiple files into one.",
    cta: "Merge Files",
  },
  {
    id: "split",
    label: "Split",
    icon: "✂",
    title: "Split PDF",
    desc: "Extract pages instantly.",
    cta: "Split PDF",
  },
];

// ── FEATURE COMPONENT (FIXED TYPES) ─────
function Feature({
  theme,
  title,
  text,
}: {
  theme: Theme;
  title: string;
  text: string;
}) {
  return (
    <div style={{ ...featureCard, ...theme.card }}>
      <div style={{ fontSize: 18 }}>{title}</div>
      <p style={{ fontSize: 13, ...theme.textSoft }}>{text}</p>
    </div>
  );
}

// ── THEMES ─────────────────────────────
const lightTheme: Theme = {
  bg: { background: "#f9fafb", color: "#111" },
  card: { background: "#fff" },
  tabs: { background: "#e5e7eb" },
  activeTab: { background: "#111", color: "#fff" },
  primary: { background: "#111", color: "#fff" },
  textSoft: { color: "#6b7280" },
};

const darkTheme: Theme = {
  bg: { background: "#0f172a", color: "#fff" },
  card: { background: "#1e293b" },
  tabs: { background: "#1e293b" },
  activeTab: { background: "#fff", color: "#111" },
  primary: { background: "#fff", color: "#111" },
  textSoft: { color: "#94a3b8" },
};

// ── STYLES ─────────────────────────────
const container: React.CSSProperties = {
  padding: 40,
  maxWidth: 1000,
  margin: "auto",
  fontFamily: "system-ui",
};

const nav: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 20,
};

const toggleBtn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const hero: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 30,
};

const title: React.CSSProperties = {
  fontSize: 42,
};

const subtitle: React.CSSProperties = {
  fontSize: 16,
};

const tabsWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const tabs: React.CSSProperties = {
  display: "flex",
  padding: 6,
  borderRadius: 12,
  gap: 6,
};

const tabStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const activeTab: React.CSSProperties = {};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20,
  marginTop: 30,
};

const card: React.CSSProperties = {
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  cursor: "pointer",
  transition: "all 0.25s ease",
  textAlign: "center",
};

const cardIcon: React.CSSProperties = {
  fontSize: 26,
  marginBottom: 10,
};

const cardText: React.CSSProperties = {
  fontSize: 14,
  marginBottom: 16,
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 10,
  border: "none",
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
  padding: 14,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  width: 180,
};

const seo: React.CSSProperties = {
  marginTop: 60,
  textAlign: "center",
};