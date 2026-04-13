"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ background: "#f9fafb", fontFamily: "Arial" }}>

      {/* NAVBAR */}
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
          <Link href="/editor">Editor</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
        <h1 style={{ fontSize: 42, fontWeight: "bold" }}>
          Edit PDF Online — Fast, Free & Secure
        </h1>

        <p style={{ marginTop: 20, color: "#555" }}>
          Add text, merge, split and download PDFs instantly.
          No signup required.
        </p>

        <Link href="/editor">
          <button
            style={{
              marginTop: 30,
              padding: "15px 30px",
              fontSize: 18,
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Start Editing Now
          </button>
        </Link>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1000, margin: "auto", padding: 40 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {[
            {
              title: "Edit PDF",
              desc: "Add text anywhere with a simple drag interface.",
            },
            {
              title: "Merge PDFs",
              desc: "Combine multiple files into one document instantly.",
            },
            {
              title: "Split PDF",
              desc: "Extract pages into separate files with one click.",
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                padding: 25,
                borderRadius: 12,
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ fontWeight: "bold" }}>{f.title}</h3>
              <p style={{ marginTop: 10, color: "#666" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST SECTION */}
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2>Why EditZap?</h2>

        <p style={{ marginTop: 10, color: "#555" }}>
          Your files stay private. Everything runs directly in your browser.
          No uploads, no storage, no risk.
        </p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: 60 }}>
        <h2>Ready to edit your PDF?</h2>

        <Link href="/editor">
          <button
            style={{
              marginTop: 20,
              padding: "12px 25px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Open Editor
          </button>
        </Link>
      </div>

      {/* FOOTER */}
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