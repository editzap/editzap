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
    <div style={container}>
      <h1>⚡ EditZap</h1>

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

      {/* Upload Card */}
      <div
        style={card}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h3>{tab.toUpperCase()} PDF</h3>

        <label style={btn}>
          Upload PDF
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={handleSelect}
          />
        </label>

        <p style={{ marginTop: 10 }}>Drag & drop PDF here</p>
      </div>
    </div>
  );
}

// ── STYLES ──
const container: React.CSSProperties = {
  padding: 40,
  textAlign: "center",
};

const tabs: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  margin: 20,
};

const tabBtn: React.CSSProperties = {
  padding: "8px 16px",
  cursor: "pointer",
};

const activeTab: React.CSSProperties = {
  ...tabBtn,
  background: "#111",
  color: "#fff",
};

const card: React.CSSProperties = {
  padding: 30,
  border: "1px solid #ccc",
  borderRadius: 10,
};

const btn: React.CSSProperties = {
  padding: "10px 20px",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
  borderRadius: 8,
};