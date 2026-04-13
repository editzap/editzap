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

      {/* Drop Zone */}
      <div
        style={dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <p>Drag & Drop your PDF here</p>

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
    </div>
  );
}

/* STYLES */
const container: React.CSSProperties = {
  padding: 40,
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

const dropZone: React.CSSProperties = {
  border: "2px dashed #aaa",
  padding: 40,
  borderRadius: 12,
};

const primaryBtn: React.CSSProperties = {
  marginTop: 10,
  display: "inline-block",
  padding: "10px 20px",
  background: "#111",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};