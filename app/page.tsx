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
          Fast. Private. No uploads. Just clean tools.
        </p>
      </div>

      {/* TABS */}
      <div style={tabsWrapper}>
        <div style={tabs}>
          {(["edit", "merge", "split"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...tabBtn,
                ...(tab === t ? activeTab : {}),
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* DROP ZONE */}
      <div style={dropZone}>
        <h3>{tab.toUpperCase()} PDF</h3>

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

        <p style={dropText}>or drag & drop</p>
      </div>

      {/* FEATURES */}
      <div style={features}>
        <Feature title="⚡ Fast" text="Instant processing" />
        <Feature title="🔒 Private" text="No uploads" />
        <Feature title="✨ Simple" text="Clean experience" />
      </div>
    </div>
  );
}

// COMPONENT
function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div style={featureCard}>
      <div style={{ fontSize: 20 }}>{title}</div>
      <p style={{ color: "#666", fontSize: 14 }}>{text}</p>
    </div>
  );
}

// STYLES
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

const tabsWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
};

const tabs: React.CSSProperties = {
  display: "flex",
  background: "#f3f4f6",
  padding: 6,
  borderRadius: 999,
  gap: 6,
};

const tabBtn: React.CSSProperties = {
  padding: "8px 18px",
  borderRadius: 999,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  transition: "all 0.25s ease",
};

const activeTab: React.CSSProperties = {
  background: "#111",
  color: "#fff",
  transform: "scale(1.05)",
};

const dropZone: React.CSSProperties = {
  border: "2px dashed #aaa",
  padding: 50,
  borderRadius: 16,
  textAlign: "center",
  transition: "all 0.3s ease",
};

const dropText: React.CSSProperties = {
  marginTop: 10,
  color: "#666",
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 24px",
  background: "#111",
  color: "#fff",
  borderRadius: 10,
  cursor: "pointer",
  marginTop: 10,
};

const features: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: 40,
};

const featureCard: React.CSSProperties = {
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  transition: "transform 0.2s ease",
};