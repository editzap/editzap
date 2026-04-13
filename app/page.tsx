"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ fontSize: 36, marginBottom: 10 }}>⚡ EditZap</h1>
      <p style={{ color: "#666", marginBottom: 30 }}>
        Fast, simple PDF editing — no login, no hassle.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        <button onClick={() => router.push("/editor")}>
          ✏ Edit PDF
        </button>

        <button onClick={() => router.push("/editor")}>
          ⊞ Merge PDF
        </button>

        <button onClick={() => router.push("/editor")}>
          ✂ Split PDF
        </button>
      </div>

      {/* SEO content */}
      <div style={{ marginTop: 60, maxWidth: 600, marginInline: "auto" }}>
        <h2>Free Online PDF Editor</h2>
        <p style={{ color: "#666" }}>
          Edit, merge, and split PDF files directly in your browser.
          No uploads, no accounts — fast and secure.
        </p>
      </div>
    </div>
  );
}