"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "edit" | "merge" | "split";

export default function Home() {
  const [tab, setTab] = useState<Tab>("edit");
  const [dark, setDark] = useState<boolean>(false);
  const router = useRouter();

  const theme = dark ? darkTheme : lightTheme;

  // ── FILE HANDLING ───────────────────────
  const handleFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      sessionStorage.setItem("pdfFile", reader.result as string);
      router.push("/editor");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

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
          Drag, drop, edit — instantly.
        </p>
      </div>

      {/* TABS */}
      <div style={tabsWrapper}>
        <div style={{ ...tabs, ...theme.tabs }}>
          {(["edit", "merge", "split"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...tabStyle,
                ...(tab === t ? theme.activeTab : {}),
              }}
            >
              {t === "edit" && "✏ Edit"}
              {t === "merge" && "⊞ Merge"}
              {t === "split" && "✂ Split"}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CARD */}
      <div
        style={{ ...card, ...theme.card }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h3 style={{ marginBottom: 10 }}>
          {tab.toUpperCase()} PDF
        </h3>

        <label style={{ ...primaryBtn, ...theme.primary }}>
          Upload PDF
          <input
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleSelect}
          />
        </label>

        <div style={dropZone}>
          Drag & drop PDF here
        </div>
      </div>
    </div>
  );
}

// ── THEMES ─────────────────────────────
const lightTheme = {
  bg: { background: "#f9fafb", color: "#111" } as React.CSSProperties,
  card: { background: "#fff" } as React.CSSProperties,
  tabs: { background: "#e5e7eb" } as React.CSSProperties,
  activeTab: { background: "#111", color: "#fff" } as React.CSSProperties,
  primary: { background: "#111", color: "#fff" } as React.CSSProperties,
  textSoft: { color: "#6b7280" } as React.CSSProperties,
};

const darkTheme = {
  bg: { background: "#0f172a", color: "#fff" } as React.CSSProperties,
  card: { background: "#1e293b" } as React.CSSProperties,
  tabs: { background: "#1e293b" } as React.CSSProperties,
  activeTab: { background: "#fff", color: "#111" } as React.CSSProperties,
  primary: { background: "#fff", color: "#111" } as React.CSSProperties,
  textSoft: { color: "#94a3b8" } as React.CSSProperties,
};

// ── STYLES ─────────────────────────────
const container: React.CSSProperties = {
  padding: 40,
  maxWidth: 800,
  margin: "auto",
  fontFamily: "system-ui",
};

const nav: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 20,
};

const toggleBtn: React.CSSProperties = {
  border: "none",
  cursor: "pointer",
  padding: "6px 10px",
  borderRadius: 6,
};

const hero: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 20,
};

const title: React.CSSProperties = {
  fontSize: 36,
};

const subtitle: React.CSSProperties = {
  fontSize: 14,
};

const tabsWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
};

const tabs: React.CSSProperties = {
  display: "flex",
  padding: 6,
  borderRadius: 10,
  gap: 6,
};

const tabStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "none",
  cursor: "pointer",
  borderRadius: 8,
};

const card: React.CSSProperties = {
  padding: 30,
  borderRadius: 12,
  textAlign: "center",
  border: "1px solid #ccc",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  display: "inline-block",
};

const dropZone: React.CSSProperties = {
  marginTop: 12,
  padding: 20,
  border: "2px dashed #aaa",
  borderRadius: 10,
  fontSize: 13,
};