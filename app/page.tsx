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

    setBoxes((prev) => [
      ...prev,
      {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        text: "",
      },
    ]);
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
    setMergeFiles(Array.from(e.target.files || []) as File[]);
  };

  const mergePDFs = async () => {
    if (mergeFiles.length < 2) return alert("Select at least 2 PDFs");

    const merged = await PDFDocument.create();

    for (const f of mergeFiles) {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const pdfBytes = await merged.save();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
    );
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

      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
      );
      a.download = `page-${i + 1}.pdf`;
      a.click();
    }
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 30 }}>
      
      {/* HEADER */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 40, fontWeight: "bold" }}>⚡ EditZap</h1>
        <p style={{ color: "#555" }}>
          Fast, secure and free PDF tools
        </p>
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
              borderRadius: 20,
              fontWeight: "bold",
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

      {/* CARD */}
      <div
        style={{
          maxWidth: 900,
          margin: "30px auto",
          background: "#fff",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* EDIT */}
        {activeTab === "edit" && (
          <>
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
          </>
        )}

        {/* MERGE */}
        {activeTab === "merge" && (
          <>
            <h2>Merge PDFs</h2>
            <input type="file" multiple onChange={handleMergeUpload} />
            <br /><br />
            <button onClick={mergePDFs}>MERGE & DOWNLOAD</button>
          </>
        )}

        {/* SPLIT */}
        {activeTab === "split" && (
          <>
            <h2>Split PDF</h2>
            <input type="file" onChange={handleSplitUpload} />
            <br /><br />
            <button onClick={splitPDF}>SPLIT & DOWNLOAD</button>
          </>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: 40, color: "#777" }}>
        © 2026 EditZap — Free PDF Tools
      </div>
    </div>
  );
}