"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Tool = "edit" | "merge" | "split";

export default function Page() {
  const [tool, setTool] = useState<Tool>("edit");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [text, setText] = useState("");

  // convert safely
  const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
    const ab = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(ab).set(bytes);
    return ab;
  };

  // load from homepage
  useEffect(() => {
    const stored = sessionStorage.getItem("pdfFile");
    const storedTool = sessionStorage.getItem("tool") as Tool | null;

    if (storedTool) setTool(storedTool);

    if (stored) {
      fetch(stored)
        .then((res) => res.arrayBuffer())
        .then((buf) => setPdfBytes(buf));
    }
  }, []);

  // ── EDIT EXPORT ───────────────────────
  const exportPDF = async () => {
    if (!pdfBytes) return;

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

  // ── MERGE ─────────────────────────────
  const mergePDFs = async (files: File[]) => {
    const merged = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const result = await merged.save();
    download(result, "merged.pdf");
  };

  // ── SPLIT ─────────────────────────────
  const splitPDF = async () => {
    if (!pdfBytes) return;

    const pdf = await PDFDocument.load(pdfBytes);

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const bytes = await newPdf.save();
      download(bytes, `page-${i + 1}.pdf`);
    }
  };

  // ── DOWNLOAD ──────────────────────────
  const download = (bytes: Uint8Array, name: string) => {
    const buffer = toArrayBuffer(bytes);
    const url = URL.createObjectURL(new Blob([buffer]));

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{tool.toUpperCase()} TOOL</h2>

      {tool === "edit" && (
        <>
          <input
            placeholder="Enter text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={exportPDF}>Export PDF</button>
        </>
      )}

      {tool === "merge" && (
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) =>
            mergePDFs(Array.from(e.target.files || []))
          }
        />
      )}

      {tool === "split" && (
        <button onClick={splitPDF}>Split PDF</button>
      )}
    </div>
  );
}