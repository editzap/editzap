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
          Fast, clean PDF tools — no login, no waiting.
        </p>
      </div>

      {/* TABS */}
      <div style={tabsWrapper}>
        <div style={tabs}>
          {["edit", "merge", "split"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as Tab)}
              style={tab === t ? activeTab : tabStyle}
            >
              {t === "edit" && "✏ Edit"}
              {t === "merge" && "⊞ Merge"}
              {t === "split" && "✂ Split"}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT CARD */}
      <div style={card}>
        {tab === "edit" && (
          <>
            <h2 style={cardTitle}>Edit PDF</h2>
            <p style={cardText}>
              Add text, draw, and customize your PDF with precision.
            </p>

            <button style={primaryBtn} onClick={() => router.push("/editor")}>
              Start Editing →
            </button>
          </>
        )}

        {tab === "merge" && (
          <>
            <h2 style={cardTitle}>Merge PDFs</h2>
            <p style={cardText}>
              Combine multiple PDF files into one seamless document.
            </p>

            <button style={primaryBtn} onClick={() => router.push("/editor")}>
              Merge Files →
            </button>
          </>
        )}

        {tab === "split" && (
          <>
            <h2 style={cardTitle}>Split PDF</h2>
            <p style={cardText}>
              Extract pages or split your PDF into separate files instantly.
            </p>

            <button style={primaryBtn} onClick={() => router.push("/editor")}>
              Split PDF →
            </button>
          </>
        )}
      </div>

      {/* FEATURES */}
      <div style={features}>
        <Feature title="⚡ Fast" text="Instant processing in your browser" />
        <Feature title="🔒 Secure" text="No uploads, your files stay local" />
        <Feature title="✨ Simple" text="Clean and easy-to-use interface" />
      </div>

      {/* SEO */}
      <div style={seo}>
        <h3>Free Online PDF Tools</h3>
        <p>
          EditZap lets you edit, merge, and split PDFs directly in your browser.
          No signups, no delays — just fast and secure PDF tools.
        </p>
      </div>
    </div>
  );
}

// ── COMPONENT ─────────────────────────────
function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div style={featureCard}>
      <div style={{ fontSize: 22 }}>{title}</div>
      <p style={{ color: "#666", fontSize: 14 }}>{text}</p>
    </div>
  );
}

// ── STYLES ────────────────────────────────
const container: React.CSSProperties = {
  padding: 40,
  maxWidth: 900,
  margin: "auto",
  fontFamily: "system-ui",
};

const hero: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 30,
};

const title: React.CSSProperties = {
  fontSize: 42,
  marginBottom: 10,
};

const subtitle: React.CSSProperties = {
  color: "#666",
  fontSize: 16,
};

const tabsWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
};

const tabs: React.CSSProperties = {
  display: "flex",
  background: "#f3f4f6",
  padding: 6,
  borderRadius: 12,
  gap: 6,
};

const tabStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
};

const activeTab: React.CSSProperties = {
  ...tabStyle,
  background: "#111",
  color: "#fff",
};

const card: React.CSSProperties = {
  background: "#fff",
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const cardTitle: React.CSSProperties = {
  fontSize: 22,
  marginBottom: 10,
};

const cardText: React.CSSProperties = {
  color: "#666",
  marginBottom: 20,
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 14,
};

const features: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: 40,
  flexWrap: "wrap",
};

const featureCard: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  width: 180,
};

const seo: React.CSSProperties = {
  marginTop: 50,
  textAlign: "center",
  color: "#666",
  fontSize: 14,
};