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

  const tools: {
    id: Tab;
    title: string;
    desc: string;
    icon: string;
  }[] = [
    {
      id: "edit",
      title: "Edit PDF",
      desc: "Add text and modify your file",
      icon: "✏️",
    },
    {
      id: "merge",
      title: "Merge PDFs",
      desc: "Combine multiple files into one",
      icon: "📚",
    },
    {
      id: "split",
      title: "Split PDF",
      desc: "Extract pages instantly",
      icon: "✂️",
    },
  ];

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <div style={logo}>⚡ EditZap</div>

        <div style={navLinks}>
          <span style={navItem}>Tools</span>
          <span style={navItem}>Features</span>
          <span style={navItem}>About</span>
        </div>

        <button style={ctaBtn}>Get Started</button>
      </div>

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
            <button key={t} onClick={() => setTab(t)} style={tabBtn}>
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

      {/* TOOL CARDS */}
      <div style={toolsGrid}>
        {tools.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              ...toolCard,
              ...(tab === t.id ? activeToolCard : {}),
            }}
            onClick={() => {
              setTab(t.id);
              goToEditor(t.id);
            }}
          >
            <div style={icon}>{t.icon}</div>
            <h3>{t.title}</h3>
            <p style={cardText}>{t.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={features}>
        {["⚡ Fast", "🔒 Private", "✨ Clean"].map((f, i) => (
          <motion.div key={i} whileHover={{ y: -6 }} style={featureCard}>
            {f}
          </motion.div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={footer}>
        <div style={footerTop}>
          <div>
            <h3>⚡ EditZap</h3>
            <p style={footerText}>
              Fast, private and simple PDF tools — built for everyday use.
            </p>
          </div>

          <div style={footerLinks}>
            <span>Home</span>
            <span>Tools</span>
            <span>Privacy</span>
            <span>Contact</span>
          </div>
        </div>

        <div style={footerBottom}>
          © {new Date().getFullYear()} EditZap. All rights reserved.
        </div>
      </div>
    </div>
  );
}

/* STYLES */

const container: React.CSSProperties = {
  padding: 40,
  maxWidth: 1100,
  margin: "auto",
  fontFamily: "system-ui",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 20px",
  borderBottom: "1px solid #eee",
  marginBottom: 20,
};

const logo: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 18,
};

const navLinks: React.CSSProperties = {
  display: "flex",
  gap: 20,
};

const navItem: React.CSSProperties = {
  cursor: "pointer",
  color: "#555",
};

const ctaBtn: React.CSSProperties = {
  padding: "8px 14px",
  background: "#111",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
  border: "none",
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

const toolsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginTop: 30,
};

const toolCard: React.CSSProperties = {
  padding: 30,
  borderRadius: 18,
  background: "linear-gradient(135deg, #fafafa, #f3f4f6)",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  cursor: "pointer",
  textAlign: "center",
};

const activeToolCard: React.CSSProperties = {
  outline: "2px solid #111",
};

const icon: React.CSSProperties = {
  fontSize: 32,
  marginBottom: 10,
};

const cardText: React.CSSProperties = {
  color: "#666",
};

const features: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: 40,
  flexWrap: "wrap",
};

const featureCard: React.CSSProperties = {
  padding: 20,
  borderRadius: 14,
  background: "#fff",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

const footer: React.CSSProperties = {
  marginTop: 80,
  paddingTop: 30,
  borderTop: "1px solid #eee",
};

const footerTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 20,
};

const footerLinks: React.CSSProperties = {
  display: "flex",
  gap: 16,
  color: "#555",
  cursor: "pointer",
};

const footerBottom: React.CSSProperties = {
  marginTop: 20,
  fontSize: 12,
  color: "#888",
};

const footerText: React.CSSProperties = {
  color: "#666",
  maxWidth: 300,
};