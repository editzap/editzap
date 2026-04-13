"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import AdBlock from "@/components/AdBlock";

export default function Page() {
  const [tab, setTab] = useState<"edit" | "merge" | "split">("edit");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);

  // MERGE
  const mergePDFs = async () => {
    if (mergeFiles.length === 0) return alert("Upload files");

    const merged = await PDFDocument.create();

    for (const f of mergeFiles) {
      const pdf = await PDFDocument.load(await f.arrayBuffer());
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const bytes = await merged.save();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([new Uint8Array(bytes)]));
    a.download = "merged.pdf";
    a.click();
  };

  // SPLIT
  const splitPDF = async () => {
    if (!splitFile) return alert("Upload file");

    const pdf = await PDFDocument.load(await splitFile.arrayBuffer());

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const bytes = await newPdf.save();

      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([new Uint8Array(bytes)]));
      a.download = `page-${i + 1}.pdf`;
      a.click();
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#111", color: "#fff", padding: 20 }}>
        <h2>⚡ EditZap</h2>

        {["edit", "merge", "split"].map((t) => (
          <div
            key={t}
            onClick={() => setTab(t as any)}
            style={{
              marginTop: 20,
              cursor: "pointer",
              fontWeight: tab === t ? "bold" : "normal",
            }}
          >
            {t.toUpperCase()}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 30 }}>
        
        {/* AD TOP */}
        <AdBlock />

        {/* EDIT */}
        {tab === "edit" && (
          <>
            <h2>Edit PDF</h2>

            <input
              type="file"
              onChange={(e) =>
                setPdfUrl(URL.createObjectURL(e.target.files?.[0] as File))
              }
            />

            {pdfUrl && (
              <iframe src={pdfUrl} width="100%" height="500px" />
            )}
          </>
        )}

        {/* MERGE */}
        {tab === "merge" && (
          <>
            <h2>Merge PDFs</h2>

            <input
              type="file"
              multiple
              onChange={(e) =>
                setMergeFiles(Array.from(e.target.files || []))
              }
            />

            <button onClick={mergePDFs}>Merge</button>
          </>
        )}

        {/* SPLIT */}
        {tab === "split" && (
          <>
            <h2>Split PDF</h2>

            <input
              type="file"
              onChange={(e) =>
                setSplitFile(e.target.files?.[0] || null)
              }
            />

            <button onClick={splitPDF}>Split</button>
          </>
        )}

        {/* AD BOTTOM */}
        <AdBlock />
      </div>
    </div>
  );
}