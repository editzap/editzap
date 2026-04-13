"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "edit" | "merge" | "split";

export default function Home() {
  const [tab, setTab] = useState<Tab>("edit");
  const router = useRouter();

  const handleFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      sessionStorage.setItem("pdfFile", reader.result as string);
      sessionStorage.setItem("tool", tab);
      router.push("/editor");
    };

    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={container}>
      {/* NAV */}
      <div style={nav}>
        <h2>⚡ EditZap</h2>
      </div>

      {/* HERO */}
      <div style={hero}>
        <h1 style={title}>Edit PDFs in Seconds</h1>
        <p style={subtitle}>
          No uploads. No accounts. Just fast, private PDF tools.
        </p>
      </div>

      {/* TABS */}
      <div style={tabs}>
        {(["edit", "merge", "split"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={tab === t ? activeTab : tabBtn}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* DROP ZONE */}
      <div
        style={dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <h3>{tab.toUpperCase()} PDF</h3>

        <p style={dropText}>Drag & drop your file here</p>

        <label style={primaryBtn}>
          Choose File
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />
        </label>
      </div>

      {/* FEATURES */}
      <div style={features}>
        <Feature title="⚡ Fast" text="Instant processing in your browser" />
        <Feature title="🔒 Private" text="Files never leave your device" />
        <Feature title="✨ Simple" text="Clean and easy to use" />
      </div>

      {/* SEO / DESCRIPTION */}
      <div style={seo}>
        <h3>Free Online PDF Editor</h3>
        <p>
          EditZap lets you edit, merge, and split PDFs instantly in your browser.
          No uploads, no signups — just fast and secure PDF tools.
        </p>
      </div>
    </div>
  );
}

// ── COMPONENT ──
function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div style={featureCard}>
      <div style={{ fontSize: 20 }}>{title}</div>
      <p style={{ color: "#666", fontSize: 14 }}>{text}</p>
    </div>
  );
}

// ── STYLES ──
const container: React.CSSProperties = {
  padding: 40,
  maxWidth: 1000,
  margin: "auto",
  fontFamily: "system-ui",
};

const nav: React.CSSProperties = {
  marginBottom: 20,
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
};

const tabs: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginBottom: 20,
};

const tabBtn: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #ddd",
  cursor: "pointer",
};

const activeTab: React.CSSProperties = {
  ...tabBtn,
  background: "#111",
  color: "#fff",
};

const dropZone: React.CSSProperties = {
  border: "2px dashed #aaa",
  padding: 40,
  borderRadius: 12,
  textAlign: "center",
};

const dropText: React.CSSProperties = {
  marginBottom: 10,
  color: "#666",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  background: "#111",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};

const features: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: 40,
  flexWrap: "wrap",
};

const featureCard: React.CSSProperties = {
  padding: 16,
  borderRadius: 10,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  width: 180,
};

const seo: React.CSSProperties = {
  marginTop: 50,
  textAlign: "center",
  color: "#666",
};