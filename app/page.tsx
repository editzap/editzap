"use client";

import { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

export default function Page() {
  const [tab, setTab] = useState<"edit" | "merge" | "split">("edit");

  // EDIT
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // MERGE
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  // SPLIT
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
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setCurrentBox({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      text: "",
    });

    setDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!drawing || !start) return;

    const rect = containerRef.current!.getBoundingClientRect();

    setCurrentBox({
      x: start.x,
      y: start.y,
      width: e.clientX - rect.left - start.x,
      height: e.clientY - rect.top - start.y,
      text: "",
    });
  };

  const handleMouseUp = () => {
    if (!drawing) return;

    if (currentBox && Math.abs(currentBox.width) > 10) {
      setBoxes((prev) => [...prev, currentBox]);
    }

    setDrawing(false);
    setCurrentBox(null);
  };

  const updateText = (i: number, text: string) => {
    setBoxes((prev) => {
      const updated = [...prev];
      updated[i].text = text;
      return updated;
    });
  };

  const deleteBox = (i: number) => {
    setBoxes((prev) => prev.filter((_, idx) => idx !== i));
  };

  const exportPDF = async () => {
    if (!file) return;

    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
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

    const bytes = await pdfDoc.save();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([new Uint8Array(bytes)], { type: "application/pdf" })
    );
    a.download = "edited.pdf";
    a.click();
  };

  // ================= MERGE =================

  const mergePDFs = async () => {
    if (mergeFiles.length === 0) {
      alert("Upload files first");
      return;
    }

    const merged = await PDFDocument.create();

    for (const f of mergeFiles) {
      const pdf = await PDFDocument.load(await f.arrayBuffer());
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const bytes = await merged.save();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([new Uint8Array(bytes)], { type: "application/pdf" })
    );
    a.download = "merged.pdf";
    a.click();
  };

  // ================= SPLIT =================

  const splitPDF = async () => {
    if (!splitFile) {
      alert("Upload file first");
      return;
    }

    const pdf = await PDFDocument.load(await splitFile.arrayBuffer());

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const bytes = await newPdf.save();

      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([new Uint8Array(bytes)], { type: "application/pdf" })
      );
      a.download = `page-${i + 1}.pdf`;
      a.click();
    }
  };

  // ================= UI =================

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: 220,
          background: "#111827",
          color: "#fff",
          padding: 20,
        }}
      >
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
        
        {/* EDIT */}
        {tab === "edit" && (
          <>
            <h2>Edit PDF</h2>
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
                      onInput={(e) =>
                        updateText(i, (e.target as HTMLDivElement).innerText)
                      }
                      style={{ padding: 5 }}
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
            <h2>Merge PDFs</h2>
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
            <h2>Split PDF</h2>
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