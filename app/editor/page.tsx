"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Tab = "edit" | "merge" | "split";

export default function Editor() {
  const [tab, setTab] = useState<Tab>("edit");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [text, setText] = useState("");

  const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
    const ab = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(ab).set(bytes);
    return ab;
  };

  // Load from homepage
  useEffect(() => {
    const stored = sessionStorage.getItem("pdfFile");
    const tool = sessionStorage.getItem("tool") as Tab | null;

    if (tool) setTab(tool);

    if (stored) {
      fetch(stored)
        .then((r) => r.arrayBuffer())
        .then(setPdfBytes);
    }
  }, []);

  // EDIT
  const exportPDF = async () => {
    if (!pdfBytes) return alert("Upload PDF");

    const pdf = await PDFDocument.load(pdfBytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    pdf.getPages()[0].drawText(text || "Text", {
      x: 50,
      y: 500,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });

    download(await pdf.save(), "edited.pdf");
  };

  // MERGE
  const mergePDFs = async (files: File[]) => {
    if (files.length < 2) return alert("Select 2+ PDFs");

    const merged = await PDFDocument.create();

    for (const f of files) {
      const pdf = await PDFDocument.load(await f.arrayBuffer());
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    download(await merged.save(), "merged.pdf");
  };

  // SPLIT
  const splitPDF = async () => {
    if (!pdfBytes) return alert("No PDF");

    const pdf = await PDFDocument.load(pdfBytes);

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      download(await newPdf.save(), `page-${i + 1}.pdf`);
    }
  };

  const download = (bytes: Uint8Array, name: string) => {
    const buffer = toArrayBuffer(bytes);
    const url = URL.createObjectURL(new Blob([buffer]));

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={wrapper}>
      {/* TOP BAR */}
      <div style={topbar}>
        <h2>⚡ EditZap</h2>
        <button onClick={exportPDF} style={primaryBtn}>
          Export
        </button>
      </div>

      <div style={layout}>
        {/* SIDEBAR */}
        <div style={sidebar}>
          {(["edit", "merge", "split"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={tab === t ? activeTab : sideBtn}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* MAIN AREA */}
        <div style={main}>
          {tab === "edit" && (
            <div style={card}>
              <h3>Edit PDF</h3>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text"
              />
              <p style={{ marginTop: 10 }}>Text will be added on export</p>
            </div>
          )}

          {tab === "merge" && (
            <div style={card}>
              <h3>Merge PDFs</h3>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) =>
                  mergePDFs(Array.from(e.target.files || []))
                }
              />
            </div>
          )}

          {tab === "split" && (
            <div style={card}>
              <h3>Split PDF</h3>
              <button onClick={splitPDF}>Split into pages</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* STYLES */

const wrapper: React.CSSProperties = {
  fontFamily: "system-ui",
};

const topbar: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: 16,
  borderBottom: "1px solid #eee",
};

const layout: React.CSSProperties = {
  display: "flex",
  height: "calc(100vh - 60px)",
};

const sidebar: React.CSSProperties = {
  width: 200,
  borderRight: "1px solid #eee",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const sideBtn: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  cursor: "pointer",
};

const activeTab: React.CSSProperties = {
  ...sideBtn,
  background: "#111",
  color: "#fff",
};

const main: React.CSSProperties = {
  flex: 1,
  padding: 30,
};

const card: React.CSSProperties = {
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  maxWidth: 400,
};

const primaryBtn: React.CSSProperties = {
  padding: "8px 16px",
  background: "#111",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};