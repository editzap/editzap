"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Tab = "edit" | "merge" | "split";

export default function Editor() {
  const [tab, setTab] = useState<Tab>("edit");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [text, setText] = useState("");

  // Safe buffer conversion
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
        .then((res) => res.arrayBuffer())
        .then((buf) => setPdfBytes(buf));
    }
  }, []);

  // ── EDIT ──
  const exportPDF = async () => {
    if (!pdfBytes) {
      alert("Upload a PDF first");
      return;
    }

    const pdf = await PDFDocument.load(pdfBytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const page = pdf.getPages()[0];

    page.drawText(text || "Sample Text", {
      x: 50,
      y: 500,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });

    const bytes = await pdf.save();
    download(bytes, "edited.pdf");
  };

  // ── MERGE ──
  const mergePDFs = async (files: File[]) => {
    if (files.length < 2) {
      alert("Select at least 2 PDFs");
      return;
    }

    const merged = await PDFDocument.create();

    for (const file of files) {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const result = await merged.save();
    download(result, "merged.pdf");
  };

  // ── SPLIT ──
  const splitPDF = async () => {
    if (!pdfBytes) {
      alert("No PDF loaded");
      return;
    }

    const pdf = await PDFDocument.load(pdfBytes);

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const bytes = await newPdf.save();
      download(bytes, `page-${i + 1}.pdf`);
    }
  };

  // ── DOWNLOAD ──
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
    <div style={container}>
      <h1>⚡ EditZap</h1>

      {/* Tabs */}
      <div style={tabs}>
        {(["edit", "merge", "split"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={tab === t ? activeTab : tabBtn}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={card}>
        {tab === "edit" && (
          <>
            <input
              placeholder="Enter text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <br />
            <button onClick={exportPDF}>Export PDF</button>
          </>
        )}

        {tab === "merge" && (
          <>
            <p>Select multiple PDFs:</p>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) =>
                mergePDFs(Array.from(e.target.files || []))
              }
            />
          </>
        )}

        {tab === "split" && (
          <button onClick={splitPDF}>Split PDF</button>
        )}
      </div>
    </div>
  );
}

// ── STYLES ──
const container: React.CSSProperties = {
  padding: 40,
  textAlign: "center",
};

const tabs: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  margin: 20,
};

const tabBtn: React.CSSProperties = {
  padding: "8px 16px",
  cursor: "pointer",
};

const activeTab: React.CSSProperties = {
  ...tabBtn,
  background: "#111",
  color: "#fff",
};

const card: React.CSSProperties = {
  padding: 30,
  border: "1px solid #ccc",
  borderRadius: 10,
};