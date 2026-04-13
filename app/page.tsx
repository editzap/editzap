"use client";

import { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  size: number;
  color: string;
};

export default function Editor() {
  const [tab, setTab] = useState<"edit" | "merge" | "split">("edit");

  // EDIT
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // MERGE / SPLIT
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);

  // ================= EDIT =================

  const handleUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
  };

  const handleMouseDown = (e: any) => {
    if (!containerRef.current || drawing) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStart({ x, y });

    setCurrentBox({
      x,
      y,
      width: 0,
      height: 0,
      text: "",
      size: 16,
      color: "#000000",
    });

    setDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!drawing || !start) return;

    const rect = containerRef.current!.getBoundingClientRect();

    setCurrentBox((prev) =>
      prev
        ? {
            ...prev,
            width: e.clientX - rect.left - start.x,
            height: e.clientY - rect.top - start.y,
          }
        : null
    );
  };

  const handleMouseUp = () => {
    if (!drawing) return;

    if (currentBox && Math.abs(currentBox.width) > 10) {
      setBoxes((prev) => [...prev, currentBox]);
    }

    setDrawing(false);
    setCurrentBox(null);
  };

  const deleteBox = (i: number) => {
    setBoxes((prev) => prev.filter((_, idx) => idx !== i));
    setSelected(null);
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
    });

    const pdfBytes = await pdfDoc.save();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
    );
    a.download = "edited.pdf";
    a.click();
  };

  // ================= MERGE =================

  const mergePDFs = async () => {
    if (mergeFiles.length === 0) return alert("Upload files first");

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

  // ================= SPLIT =================

  const splitPDF = async () => {
    if (!splitFile) return alert("Upload file first");

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

  // ================= UI =================

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#111827", color: "#fff", padding: 20 }}>
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
      <div style={{ flex: 1, padding: 20 }}>
        
        {/* EDIT */}
        {tab === "edit" && (
          <>
            <input type="file" onChange={handleUpload} />
            <button onClick={exportPDF}>Export</button>

            {pdfUrl && (
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ position: "relative", marginTop: 20 }}
              >
                <iframe src={pdfUrl} width="100%" height="600px" />

                {currentBox && (
                  <div style={{
                    position: "absolute",
                    left: currentBox.x,
                    top: currentBox.y,
                    width: currentBox.width,
                    height: currentBox.height,
                    border: "2px dashed black",
                  }} />
                )}

                {boxes.map((b, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(i);
                    }}
                    style={{
                      position: "absolute",
                      left: b.x,
                      top: b.y,
                      width: b.width,
                      height: b.height,
                      border: "1px solid black",
                      background: "#fff",
                    }}
                  >
                    <div
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
                      style={{ padding: 4 }}
                    >
                      {b.text || "Type"}
                    </div>

                    <button onClick={() => deleteBox(i)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MERGE */}
        {tab === "merge" && (
          <>
            <h3>Merge PDFs</h3>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setMergeFiles(Array.from(e.target.files || []))
              }
            />
            <br /><br />
            <button onClick={mergePDFs}>Merge & Download</button>
          </>
        )}

        {/* SPLIT */}
        {tab === "split" && (
          <>
            <h3>Split PDF</h3>
            <input
              type="file"
              onChange={(e) =>
                setSplitFile(e.target.files?.[0] || null)
              }
            />
            <br /><br />
            <button onClick={splitPDF}>Split & Download</button>
          </>
        )}
      </div>
    </div>
  );
}