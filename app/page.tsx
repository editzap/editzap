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

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={container}>
      <h1 style={title}>⚡ EditZap</h1>

      {/* Tabs */}
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

      {/* Card */}
      <div
        style={card}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h3>{tab.toUpperCase()} PDF</h3>

        <label style={primaryBtn}>
          Upload PDF
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={handleSelect}
          />
        </label>

        <p style={subText}>Drag & drop supported</p>
      </div>
    </div>
  );
}

/* STYLES */
const container: React.CSSProperties = {
  padding: 40,
  maxWidth: 800,
  margin: "auto",
  textAlign: "center",
  fontFamily: "system-ui",
};

const title: React.CSSProperties = {
  marginBottom: 20,
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

const card: React.CSSProperties = {
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  background: "#111",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
  display: "inline-block",
};

const subText: React.CSSProperties = {
  marginTop: 10,
  color: "#666",
};