"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Arial",
      }}
    >
      {/* NAVBAR (ONLY ONE) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          background: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <h2 style={{ fontWeight: "bold" }}>⚡ EditZap</h2>

        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      {/* HERO (ONLY CTA) */}
      <div
        style={{
          textAlign: "center",
          padding: "120px 20px",
        }}
      >
        <h1 style={{ fontSize: 44, fontWeight: "bold" }}>
          All-in-One PDF Editor Online
        </h1>

        <p style={{ marginTop: 20, color: "#555", fontSize: 18 }}>
          Edit, merge and split PDFs instantly — no signup needed.
        </p>

        <Link href="/editor">
          <button
            style={{
              marginTop: 40,
              padding: "18px 40px",
              fontSize: 18,
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          >
            Start Editing PDF
          </button>
        </Link>
      </div>

      {/* SEO / INFO */}
      <div
        style={{
          maxWidth: 900,
          margin: "auto",
          padding: 40,
          textAlign: "center",
          color: "#555",
        }}
      >
        <p>
          EditZap is a free online PDF editor that allows you to add text,
          merge multiple PDFs, and split documents instantly. All processing
          happens in your browser — no uploads, no data storage.
        </p>
      </div>

      {/* FOOTER (ONLY ONE) */}
      <div
        style={{
          textAlign: "center",
          padding: 30,
          borderTop: "1px solid #eee",
          background: "#fff",
        }}
      >
        <p>© 2026 EditZap — Free PDF Tools</p>

        <div style={{ marginTop: 10 }}>
          <Link href="/about">About</Link> |{" "}
          <Link href="/privacy">Privacy</Link> |{" "}
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </div>
  );
}