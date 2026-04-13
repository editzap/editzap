"use client";

import { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Box = {
  x: number;
  y: number;
  text: string;
  size: number;
  color: string;
  font: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"edit" | "merge" | "split">("edit");

  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

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
      size: 16,
      color: "#000000",
      font: "Helvetica",
    };

    setBoxes((prev) => [...prev, newBox]);
  };

  const updateBox = (changes: Partial<Box>) => {
    if (selected === null) return;

    setBoxes((prev) => {
      const updated = [...prev];
      updated[selected] = { ...updated[selected], ...changes };
      return updated;
    });
  };

  const exportPDF = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const page = pdfDoc.getPages()[0];
    const height = page.getHeight();

    for (const b of boxes) {
      if (!b.text) continue;

      let font;
      switch (b.font) {
        case "Courier":
          font = await pdfDoc.embedFont(StandardFonts.Courier);
          break;
        case "Times":
          font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
          break;
        default:
          font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      }

      const r = parseInt(b.color.slice(1, 3), 16) / 255;
      const g = parseInt(b.color.slice(3, 5), 16) / 255;
      const bl = parseInt(b.color.slice(5, 7), 16) / 255;

      page.drawText(b.text, {
        x: b.x,
        y: height - b.y,
        size: b.size,
        font,
        color: rgb(r, g, bl),
      });
    }

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
      
      <h1 style={{ textAlign: "center" }}>⚡ EditZap</h1>

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
              background: activeTab === tab ? "#000" : "#ddd",
              color: activeTab === tab ? "#fff" : "#000",
              border: "none",
              fontWeight: "bold",
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
        {activeTab === "edit" && (
          <>
            <h2>Edit PDF</h2>

            <input type="file" onChange={handleUpload} />
            <br /><br />

            {/* TOOLBAR */}
            {selected !== null && (
              <div style={{ marginBottom: 10 }}>
                <input
                  type="number"
                  value={boxes[selected].size}
                  onChange={(e) =>
                    updateBox({ size: parseInt(e.target.value) || 16 })
                  }
                />

                <input
                  type="color"
                  value={boxes[selected].color}
                  onChange={(e) =>
                    updateBox({ color: e.target.value })
                  }
                />

                <select
                  onChange={(e) =>
                    updateBox({ font: e.target.value })
                  }
                >
                  <option value="Helvetica">Arial</option>
                  <option value="Courier">Courier</option>
                  <option value="Times">Times</option>
                </select>
              </div>
            )}

            <button onClick={exportPDF}>EXPORT PDF</button>

            {pdfUrl && (
              <div
                ref={containerRef}
                onClick={handleClick}
                style={{ position: "relative", marginTop: 20 }}
              >
                <iframe src={pdfUrl} width="100%" height="500px" />

                {boxes.map((b, i) => (
                  <div
                    key={i}
                    contentEditable
                    suppressContentEditableWarning
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(i);
                    }}
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
                      fontSize: b.size,
                      color: b.color,
                      fontFamily: b.font,
                      border:
                        selected === i
                          ? "2px solid black"
                          : "1px solid gray",
                      background: "#fff",
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

        {activeTab === "merge" && (
          <>
            <h2>Merge PDFs</h2>
            <input type="file" multiple onChange={handleMergeUpload} />
            <br /><br />
            <button onClick={mergePDFs}>MERGE</button>
          </>
        )}

        {activeTab === "split" && (
          <>
            <h2>Split PDF</h2>
            <input type="file" onChange={handleSplitUpload} />
            <br /><br />
            <button onClick={splitPDF}>SPLIT</button>
          </>
        )}
      </div>
    </div>
  );
}