"use client";

import { useState } from "react";

export default function Editor() {
  const [tool, setTool] = useState("edit");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f5f5" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: 240,
          background: "#0f172a",
          color: "#fff",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <div>
          <h2 style={{ fontWeight: "bold", fontSize: 24 }}>
            ⚡ EditZap
          </h2>

          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 5 }}>
            PDF Tools
          </p>

          {/* MENU */}
          <div style={{ marginTop: 30 }}>
            {[
              { id: "edit", name: "Edit PDF" },
              { id: "merge", name: "Merge PDF" },
              { id: "split", name: "Split PDF" },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setTool(item.id)}
                style={{
                  padding: "12px 16px",
                  marginBottom: 10,
                  borderRadius: 10,
                  cursor: "pointer",
                  background:
                    tool === item.id ? "#1e293b" : "transparent",
                  fontWeight: tool === item.id ? "bold" : "normal",
                  transition: "0.2s",
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ fontSize: 12, color: "#64748b" }}>
          © 2026 EditZap
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: 40 }}>

        {/* TOP BAR */}
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: "bold" }}>
            {tool === "edit" && "Edit PDF"}
            {tool === "merge" && "Merge PDFs"}
            {tool === "split" && "Split PDF"}
          </h2>
        </div>

        {/* TOOL AREA */}
        <div
          style={{
            background: "#fff",
            padding: 30,
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          {tool === "edit" && (
            <>
              <p style={{ marginBottom: 10 }}>
                Upload PDF to start editing
              </p>
              <input type="file" />
            </>
          )}

          {tool === "merge" && (
            <>
              <p>Select multiple PDFs</p>
              <input type="file" multiple />
            </>
          )}

          {tool === "split" && (
            <>
              <p>Select PDF to split</p>
              <input type="file" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}