"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Tab = "edit" | "merge" | "split";

export default function Home() {
  const [tab, setTab] = useState<Tab>("edit");
  const router = useRouter();

  const goToEditor = (selected: Tab) => {
    sessionStorage.setItem("tool", selected);
    router.push("/editor");
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
        <p style={subtitle}>
          Fast. Private. Beautiful.
        </p>
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

      {/* ACTION CARD */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        style={card}
        onClick={() => goToEditor(tab)}
      >
        <h3 style={{ marginBottom: 10 }}>
          {tab === "edit" && "✏ Edit your PDF"}
          {tab === "merge" && "⊞ Merge multiple PDFs"}
          {tab === "split" && "✂ Split PDF into pages"}
        </h3>

        <p style={cardText}>
          Open {tab} tool →
        </p>
      </motion.div>

      {/* FEATURES */}
      <div style={features}>
        {["⚡ Fast", "🔒 Private", "✨ Clean"].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
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

const card: React.CSSProperties = {
  marginTop: 20,
  padding: 60,
  borderRadius: 20,
  textAlign: "center",
  background: "linear-gradient(135deg, #fafafa, #f3f4f6)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  cursor: "pointer",
};

const cardText: React.CSSProperties = {
  color: "#666",
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