"use client";

import { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Box = {
  x: number;
  y: number;
  text: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"edit" | "merge" | "split">("edit");

  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // ===== EDIT =====
  const handleUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
  };

  const handleClick = (e: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const newBox: Box = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: "",
    };

    setBoxes((prev) => [...prev, newBox]);
  };

  const exportPDF = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const page = pdfDoc.getPages()[0];
    const height = page.getHeight();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    boxes.forEach((b) => {
      if (!b.text) return;

      page.drawText(b.text, {
        x: b.x,
        y: height - b.y,
        size: 16,
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
  const handleMergeUpload = (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    setMergeFiles(files);
  };

  const mergePDFs = async () => {
    if (mergeFiles.length < 2) {
      alert("Select at least 2 PDFs");
      return;
    }

    const merged = await PDFDocument.create();

    for (const file of mergeFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const pdfBytes = await merged.save();

    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "merged.pdf";
    a.click();
  };

  // ===== SPLIT =====
  const handleSplitUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSplitFile(f);
  };

  const splitPDF = async () => {
    if (!splitFile) return;

    const bytes = await splitFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);

    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);

      const pdfBytes = await newPdf.save();

      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `page-${i + 1}.pdf`;
      a.click();
    }
  };

  return (
    <div style={{ padding: 30, background: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div style={{ textAlign: "center" }}>
        <h1>⚡ EditZap</h1>
        <p>Fast, secure and free PDF tools</p>
      </div>

      {/* TABS */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        {["edit", "merge", "split"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              margin: 5,
              padding: "10px 20px",
              fontWeight: "bold",
              borderRadius: 8,
              background: activeTab === tab ? "black" : "#ddd",
              color: activeTab === tab ? "#fff" : "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* EDIT */}
      {activeTab === "edit" && (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            marginTop: 30,
          }}
        >
          <h2>Edit PDF</h2>

          <input type="file" onChange={handleUpload} />
          <br /><br />
          <button onClick={exportPDF}>EXPORT PDF</button>

          {pdfUrl && (
            <div
              ref={containerRef}
              onClick={handleClick}
              style={{
                marginTop: 20,
                position: "relative",
                border: "2px solid black",
              }}
            >
              <iframe src={pdfUrl} width="100%" height="500px" />

              {boxes.map((b, i) => (
                <div
                  key={i}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const val = (e.target as HTMLDivElement).innerText;

                    setBoxes((prev) => {
                      const updated = [...prev];
                      updated[i].text = val;
                      return updated;
                    });
                  }}
                  style={{
                    position: "absolute",
                    left: b.x,
                    top: b.y,
                    background: "#fff",
                    border: "1px solid black",
                    padding: 4,
                  }}
                >
                  {b.text || "Type"}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MERGE */}
      {activeTab === "merge" && (
        <div style={{ marginTop: 30 }}>
          <h2>Merge PDFs</h2>
          <input type="file" multiple onChange={handleMergeUpload} />
          <br /><br />
          <button onClick={mergePDFs}>MERGE & DOWNLOAD</button>
        </div>
      )}

      {/* SPLIT */}
      {activeTab === "split" && (
        <div style={{ marginTop: 30 }}>
          <h2>Split PDF</h2>
          <input type="file" onChange={handleSplitUpload} />
          <br /><br />
          <button onClick={splitPDF}>SPLIT & DOWNLOAD</button>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: 50 }}>
        © 2026 EditZap — Free PDF Tools
      </div>
    </div>
  );
}