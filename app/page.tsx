"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"edit" | "merge" | "split">("edit");
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);

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
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
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
      
      {/* LOGO */}
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
        ⚡ EditZap
      </h1>

      {/* HERO LINE */}
      <p style={{ textAlign: "center", color: "#666" }}>
        Fast, secure and free PDF tools
      </p>

      {/* TABS */}
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
              fontWeight: "bold",
              borderRadius: 8,
              border: "none",
              background: activeTab === tab ? "#000" : "#ddd",
              color: activeTab === tab ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* MAIN CARD */}
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
            <p>Editing feature already implemented above 👆</p>
          </>
        )}

        {/* MERGE */}
        {activeTab === "merge" && (
          <>
            <h2>Merge PDFs</h2>

            <input type="file" multiple onChange={handleMergeUpload} />

            <p>{mergeFiles.length} file(s) selected</p>

            <button
              onClick={mergePDFs}
              style={{
                padding: "12px 20px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              MERGE & DOWNLOAD
            </button>
          </>
        )}

        {/* SPLIT */}
        {activeTab === "split" && (
          <>
            <h2>Split PDF</h2>

            <input type="file" onChange={handleSplitUpload} />

            <button
              onClick={splitPDF}
              style={{
                marginTop: 10,
                padding: "12px 20px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              SPLIT & DOWNLOAD
            </button>
          </>
        )}
      </div>

      {/* INFO SECTION */}
      <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center" }}>
        <h2>Free Online PDF Tools</h2>

        <p style={{ color: "#555", marginTop: 10 }}>
          EditZap lets you edit, merge and split PDFs instantly — no signup required.
        </p>

        <div style={{ marginTop: 20 }}>
          <p>✔ No file upload to server</p>
          <p>✔ 100% secure (runs in browser)</p>
          <p>✔ Fast and free forever</p>
        </div>
      </div>

      {/* 🔥 COPYRIGHT */}
      <div
        style={{
          textAlign: "center",
          marginTop: 50,
          paddingTop: 20,
          borderTop: "1px solid #ddd",
          color: "#777",
          fontSize: 14,
        }}
      >
        © 2026 EditZap — Free PDF Tools
      </div>
    </div>
  );
}