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
    <div style={container}>
      <h1 style={title}>⚡ EditZap</h1>

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
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text"
            />
            <button onClick={exportPDF}>Export</button>
          </>
        )}

        {tab === "merge" && (
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) =>
              mergePDFs(Array.from(e.target.files || []))
            }
          />
        )}

        {tab === "split" && (
          <button onClick={splitPDF}>Split PDF</button>
        )}
      </div>
    </div>
  );
}

/* STYLES */
const container: React.CSSProperties = {
  padding: 40,
  textAlign: "center",
};

const title: React.CSSProperties = {
  marginBottom: 20,
};

const tabs: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginBottom: 20,
};

const tabBtn: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #ddd",
  cursor: "pointer",
};

const activeTab: React.CSSProperties = {
  ...tabBtn,
  background: "#111",
  color: "#fff",
};

const card: React.CSSProperties = {
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
};