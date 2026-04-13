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
      {/* HERO ONLY */}
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
            }}
          >
            Start Editing PDF
          </button>
        </Link>
      </div>

      {/* SEO TEXT */}
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
          EditZap is a free online PDF editor that allows you to edit PDFs,
          merge multiple files, and split documents instantly. No upload,
          fully secure, and fast.
        </p>
      </div>
    </div>
  );
}