"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>⚡ EditZap</h1>
      <p>Edit, Merge & Split PDFs — Free & Fast</p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 20,
        marginTop: 40
      }}>
        
        {[
          { name: "Edit PDF", link: "/editor" },
          { name: "Merge PDF", link: "/editor" },
          { name: "Split PDF", link: "/editor" },
        ].map((tool, i) => (
          <Link key={i} href={tool.link}>
            <div style={{
              padding: 30,
              width: 200,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              cursor: "pointer"
            }}>
              <h3>{tool.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}