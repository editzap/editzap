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

export default function Editor() {
  const [tool, setTool] = useState<"edit" | "merge" | "split">("edit");

  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // ===== UPLOAD =====
  const handleUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
  };

  // ===== DRAW BOX =====
  const handleMouseDown = (e: any) => {
    const rect = containerRef.current!.getBoundingClientRect();

    setCurrentBox({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: 0,
      height: 0,
      text: "",
    });

    setDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!drawing || !currentBox) return;

    const rect = containerRef.current!.getBoundingClientRect();

    setCurrentBox({
      ...currentBox,
      width: e.clientX - rect.left - currentBox.x,
      height: e.clientY - rect.top - currentBox.y,
    });
  };

  const handleMouseUp = () => {
    if (currentBox) {
      setBoxes((prev) => [...prev, currentBox]);
    }

    setCurrentBox(null);
    setDrawing(false);
  };

  // ===== DELETE =====
  const deleteBox = (i: number) => {
    setBoxes((prev) => prev.filter((_, index) => index !== i));
    setSelected(null);
  };

  // ===== EXPORT =====
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

    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
    );
    a.download = "edited.pdf";
    a.click();
  };

  // ===== MERGE =====
  const handleMergeUpload = (e: any) => {
    setMergeFiles(Array.from(e.target.files || []));
  };

  const mergePDFs = async () => {
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
    setSplitFile(e.target.files[0]);
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
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#0f172a", color: "#fff", padding: 20 }}>
        <h2>⚡ EditZap</h2>

        {["edit", "merge", "split"].map((t) => (
          <div
            key={t}
            onClick={() => setTool(t as any)}
            style={{
              marginTop: 20,
              cursor: "pointer",
              fontWeight: tool === t ? "bold" : "normal",
            }}
          >
            {t.toUpperCase()}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>
        
        {tool === "edit" && (
          <>
            <input type="file" onChange={handleUpload} />
            <button onClick={exportPDF}>EXPORT</button>

            {pdfUrl && (
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ position: "relative", marginTop: 20 }}
              >
                <iframe src={pdfUrl} width="100%" height="600px" />

                {/* DRAWING */}
                {currentBox && (
                  <div
                    style={{
                      position: "absolute",
                      left: currentBox.x,
                      top: currentBox.y,
                      width: currentBox.width,
                      height: currentBox.height,
                      border: "2px dashed black",
                    }}
                  />
                )}

                {/* BOXES */}
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
                      border:
                        selected === i
                          ? "2px solid black"
                          : "1px solid gray",
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
                      style={{ width: "100%", height: "100%", padding: 4 }}
                    >
                      {b.text || "Type"}
                    </div>

                    {selected === i && (
                      <button
                        onClick={() => deleteBox(i)}
                        style={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          background: "red",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tool === "merge" && (
          <>
            <input type="file" multiple onChange={handleMergeUpload} />
            <button onClick={mergePDFs}>MERGE</button>
          </>
        )}

        {tool === "split" && (
          <>
            <input type="file" onChange={handleSplitUpload} />
            <button onClick={splitPDF}>SPLIT</button>
          </>
        )}
      </div>
    </div>
  );
}