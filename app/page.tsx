"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: 60 }}>
        <h1 style={{ fontSize: 40, fontWeight: "bold" }}>
          ⚡ EditZap — Free PDF Editor Online
        </h1>

        <p style={{ maxWidth: 700, margin: "20px auto", color: "#555" }}>
          Edit, merge, and split PDF files instantly in your browser. 
          No installation required. 100% free and secure.
        </p>

        <Link href="/editor">
          <button
            style={{
              padding: "15px 30px",
              fontSize: 18,
              background: "black",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Start Editing PDF
          </button>
        </Link>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
        <h2 style={{ textAlign: "center" }}>Free PDF Tools</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div style={card}>
            <h3>Edit PDF</h3>
            <p>Add text, customize fonts, and edit your PDFs easily.</p>
          </div>

          <div style={card}>
            <h3>Merge PDFs</h3>
            <p>Combine multiple PDF files into one document.</p>
          </div>

          <div style={card}>
            <h3>Split PDF</h3>
            <p>Extract pages and split PDFs into separate files.</p>
          </div>
        </div>
      </div>

      {/* SEO CONTENT */}
      <div style={{ maxWidth: 900, margin: "auto", padding: 40 }}>
        <h2>Why Use EditZap?</h2>

        <p>
          EditZap is a fast and secure online PDF editor that allows users to 
          edit PDF files without installing any software. Whether you want to 
          add text, merge documents, or split files, EditZap provides all tools 
          in one place.
        </p>

        <p>
          Unlike other tools, EditZap works directly in your browser, ensuring 
          your files remain private and secure.
        </p>

        <h2>Best Free PDF Editor Online</h2>

        <p>
          If you're looking for a free PDF editor, EditZap is the perfect choice. 
          It offers powerful features like text editing, merging, splitting, and 
          exporting PDFs quickly and efficiently.
        </p>
      </div>

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          padding: 30,
          borderTop: "1px solid #ddd",
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

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};