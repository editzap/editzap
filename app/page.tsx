"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ⚡ EditZap
      </motion.h2>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={hero}
      >
        <h1 style={title}>Edit PDFs in Seconds</h1>
        <p style={subtitle}>Fast. Private. Beautiful.</p>
      </motion.div>

      {/* TABS */}
      <div style={tabsWrapper}>
        <div style={tabs}>
          {(["edit", "merge", "split"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={tabBtn}
            >
              {tab === t && (
                <motion.div
                  layoutId="active-pill"
                  style={activePill}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span style={tabText(tab === t)}>{t.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DROP ZONE */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={dropZone}
      >
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
      </motion.div>

      {/* FEATURES */}
      <div style={features}>
        {["⚡ Fast", "🔒 Private", "✨ Clean"].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            style={featureCard}
          >
            {f}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */

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
  fontWeight: 700,
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
  position: "relative",
};

const tabBtn: React.CSSProperties = {
  position: "relative",
  padding: "10px 20px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const activePill: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: 999,
  background: "linear-gradient(135deg, #111, #333)",
};

const tabText = (active: boolean): React.CSSProperties => ({
  position: "relative",
  zIndex: 1,
  color: active ? "#fff" : "#333",
  fontWeight: 500,
});

const dropZone: React.CSSProperties = {
  borderRadius: 20,
  padding: 60,
  textAlign: "center",
  background: "linear-gradient(135deg, #fafafa, #f3f4f6)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 26px",
  background: "#111",
  color: "#fff",
  borderRadius: 12,
  cursor: "pointer",
  marginTop: 10,
  display: "inline-block",
};

const dropText: React.CSSProperties = {
  marginTop: 10,
  color: "#777",
};

const features: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: 40,
};

const featureCard: React.CSSProperties = {
  padding: 20,
  borderRadius: 14,
  background: "#fff",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};