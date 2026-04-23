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

      {/* CONTENT STARTS HERE */}

      {/* INTRO */}
      <div style={contentSection}>
        <h2>Free Online PDF Editor</h2>
        <p style={contentText}>
          Our online PDF editor helps you edit, merge, and split PDF files
          quickly without installing any software. Whether you need to combine
          documents, extract pages, or make quick edits, this tool is designed
          for speed, simplicity, and privacy.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div style={contentSection}>
        <h2>How It Works</h2>
        <ol style={contentList}>
          <li>Upload your PDF file</li>
          <li>Select a tool (Edit, Merge, or Split)</li>
          <li>Make your changes instantly</li>
          <li>Download your updated PDF</li>
        </ol>
      </div>

      {/* SEO CONTENT */}
      <div style={contentSection}>
        <h2>Why Use Our PDF Tools?</h2>

        <p style={contentText}>
          PDF files are widely used for sharing documents, but editing them can
          be difficult without the right tools. Our platform provides an easy
          way to edit PDFs online without installing heavy software.
        </p>

        <p style={contentText}>
          You can merge multiple PDFs into a single file, split large PDFs into
          smaller parts, and quickly edit text or content. Everything works
          directly in your browser, making it accessible on any device.
        </p>

        <p style={contentText}>
          We focus on speed, simplicity, and user privacy so you can complete
          your tasks efficiently without unnecessary complications.
        </p>
      </div>

      {/* FAQ */}
      <div style={contentSection}>
        <h2>Frequently Asked Questions</h2>

        <h4>Is this PDF editor free?</h4>
        <p style={contentText}>
          Yes, our core PDF tools are free to use.
        </p>

        <h4>Are my files secure?</h4>
        <p style={contentText}>
          Yes, your files are processed securely and are not stored permanently.
        </p>

        <h4>Do I need to install anything?</h4>
        <p style={contentText}>
          No installation is required. Everything works in your browser.
        </p>
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

/* TABS */
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

/* TOOL CARDS */
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

/* FEATURES */
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

/* CONTENT */
const contentSection: React.CSSProperties = {
  marginTop: 60,
  maxWidth: 800,
  marginInline: "auto",
};

const contentText: React.CSSProperties = {
  color: "#555",
  lineHeight: 1.7,
  marginTop: 10,
};

const contentList: React.CSSProperties = {
  marginTop: 10,
  paddingLeft: 20,
  color: "#555",
  lineHeight: 1.8,
};