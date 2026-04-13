"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Box = {
  x: number;
  y: number;
  text: string;
  size: number;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"edit" | "merge" | "split">("edit");

  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const [text, setText] = useState("");
  const [size, setSize] = useState(16);

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<number | null>(null);

  // ===== EDIT =====
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
    setSelected(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const newBox: Box = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: "",
      size,
    };

    setBoxes((prev) => [...prev, newBox]);
    setSelected(boxes.length);

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const updateBox = (changes: Partial<Box>) => {
    if (selected === null) return;

    setBoxes((prev) => {
      const updated = [...prev];
      updated[selected] = { ...updated[selected], ...changes };
      return updated;
    });
  };

  const applyToPDF = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const page = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const height = page.getHeight();

    boxes.forEach((b) => {
      if (!b.text) return;

      page.drawText(b.text, {
        x: b.x,
        y: height - b.y,
        size: b.size,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "edited.pdf";
    a.click();
  };

  // ===== MERGE =====
  const handleMergeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setMergeFiles(Array.from(e.target.files));
  };

  const mergePDFs = async () => {
    if (mergeFiles.length < 2) {
      alert("Select at least 2 PDFs");
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of mergeFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach((p) => mergedPdf.addPage(p));
    }

    const pdfBytes = await mergedPdf.save();

    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "merged.pdf";
    a.click();
  };

  // ===== SPLIT =====
  const handleSplitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSplitFile(f);
  };

  const splitPDF = async () => {
    if (!splitFile) {
      alert("Upload a PDF first");
      return;
    }

    const bytes = await splitFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);

    const total = pdfDoc.getPageCount();

    for (let i = 0; i < total; i++) {
      const newPdf = await PDFDocument.create();

      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);

      const newBytes = await newPdf.save();

      const blob = new Blob([new Uint8Array(newBytes)], {
        type: "application/pdf",
      });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `page-${i + 1}.pdf`;
      a.click();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: 30 }}>
      
      {/* HEADER */}
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
        ⚡ EditZap
      </h1>

      {/* 🔥 PREMIUM TABS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 20,
        }}
      >
        {["edit", "merge", "split"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              background: activeTab === tab ? "#000" : "#e0e0e0",
              color: activeTab === tab ? "#fff" : "#000",
              boxShadow:
                activeTab === tab
                  ? "0 3px 10px rgba(0,0,0,0.2)"
                  : "none",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CARD */}
      <div
        style={{
          maxWidth: 700,
          margin: "40px auto",
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* EDIT */}
        {activeTab === "edit" && (
          <>
            <h2>Edit PDF</h2>

            <input type="file" onChange={handleUpload} />

            <button onClick={applyToPDF} style={{ marginTop: 10 }}>
              EXPORT PDF
            </button>

            {pdfUrl && (
              <div
                onClick={handleClick}
                style={{ marginTop: 20 }}
              >
                <iframe src={pdfUrl} width="100%" height="500px" />
              </div>
            )}
          </>
        )}

        {/* MERGE */}
        {activeTab === "merge" && (
          <>
            <h2>Merge PDFs</h2>

            <input type="file" multiple onChange={handleMergeUpload} />

            <p>{mergeFiles.length} files selected</p>

            <button onClick={mergePDFs}>
              MERGE & DOWNLOAD
            </button>
          </>
        )}

        {/* SPLIT */}
        {activeTab === "split" && (
          <>
            <h2>Split PDF</h2>

            <input type="file" onChange={handleSplitUpload} />

            <button onClick={splitPDF}>
              SPLIT & DOWNLOAD
            </button>
          </>
        )}
      </div>
    </div>
  );
}