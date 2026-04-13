"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ background: "#f9fafb", fontFamily: "Arial" }}>

      {/* NAVBAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        background: "#fff",
        borderBottom: "1px solid #eee"
      }}>
        <h2 style={{ fontWeight: "bold" }}>⚡ EditZap</h2>

        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/editor">Editor</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      {/* HERO */}
      <div style={{
        textAlign: "center",
        padding: "80px 20px"
      }}>
        <h1 style={{ fontSize: 42, fontWeight: "bold" }}>
          All-in-One PDF Editor Online
        </h1>

        <p style={{ marginTop: 20, color: "#555" }}>
          Edit, merge and split PDFs instantly — no signup needed.
        </p>

        <Link href="/editor">
          <button style={{
            marginTop: 30,
            padding: "16px 32px",
            fontSize: 18,
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Start Editing PDF
          </button>
        </Link>
      </div>

      {/* TOOL CARDS (FIXED BUTTONS) */}
      <div style={{
        maxWidth: 1100,
        margin: "auto",
        padding: 40,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 25
      }}>
        
        {/* EDIT */}
        <Link href="/editor">
          <div style={cardStyle}>
            <h3 style={titleStyle}>✏️ Edit PDF</h3>
            <p style={descStyle}>
              Add text anywhere with simple drag & type.
            </p>
            <button style={btnStyle}>Open Editor</button>
          </div>
        </Link>

        {/* MERGE */}
        <Link href="/editor">
          <div style={cardStyle}>
            <h3 style={titleStyle}>📄 Merge PDF</h3>
            <p style={descStyle}>
              Combine multiple PDFs into one file.
            </p>
            <button style={btnStyle}>Merge Files</button>
          </div>
        </Link>

        {/* SPLIT */}
        <Link href="/editor">
          <div style={cardStyle}>
            <h3 style={titleStyle}>✂️ Split PDF</h3>
            <p style={descStyle}>
              Extract pages into separate documents.
            </p>
            <button style={btnStyle}>Split PDF</button>
          </div>
        </Link>

      </div>

      {/* TRUST */}
      <div style={{
        textAlign: "center",
        padding: 50
      }}>
        <h2>Fast. Secure. Private.</h2>
        <p style={{ marginTop: 10, color: "#555" }}>
          Files are processed in your browser. Nothing is stored.
        </p>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: "center",
        padding: 30,
        borderTop: "1px solid #eee",
        background: "#fff"
      }}>
        © 2026 EditZap — Free PDF Tools
      </div>

    </div>
  );
}

/* STYLES */

const cardStyle = {
  background: "#fff",
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
  cursor: "pointer",
  textAlign: "center" as const,
  transition: "0.2s"
};

const titleStyle = {
  fontWeight: "bold",
  marginBottom: 10
};

const descStyle = {
  color: "#666",
  marginBottom: 20
};

const btnStyle = {
  padding: "10px 20px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold"
};