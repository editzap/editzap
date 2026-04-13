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
  const [tab, setTab] = useState<"edit" | "merge" | "split">("edit");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // ===== EDIT =====
  const handleUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
  };

  const handleMouseDown = (e: any) => {
    const rect = containerRef.current!.getBoundingClientRect();
    setStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setCurrentBox({ x: 0, y: 0, width: 0, height: 0, text: "" });
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
    if (currentBox) setBoxes((prev) => [...prev, currentBox]);
    setDrawing(false);
    setCurrentBox(null);
  };

  const exportPDF = async () => {
    if (!file) return;

    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
    const page = pdfDoc.getPages()[0];
    const height = page.getHeight();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    boxes.forEach((b) => {
      page.drawText("Text", {
        x: b.x,
        y: height - b.y,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const bytes = await pdfDoc.save();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([new Uint8Array(bytes)]));
    a.download = "edited.pdf";
    a.click();
  };

  // ===== MERGE =====
  const mergePDFs = async () => {
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

  // ===== SPLIT =====
  const splitPDF = async () => {
    if (!splitFile) return;

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
    <div style={{ display: "flex", height: "100vh", background: "#f9fafb" }}>
      
      {/* SIDEBAR */}
      <div style={{
        width: 230,
        background: "#ffffff",
        borderRight: "1px solid #eee",
        padding: 20
      }}>
        <h2 style={{ fontWeight: "bold" }}>⚡ EditZap</h2>

        {["edit", "merge", "split"].map((t) => (
          <div
            key={t}
            onClick={() => setTab(t as any)}
            style={{
              marginTop: 20,
              padding: 10,
              borderRadius: 8,
              cursor: "pointer",
              background: tab === t ? "#f1f5f9" : "transparent",
              fontWeight: tab === t ? "bold" : "normal",
            }}
          >
            {t.toUpperCase()}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 40 }}>
        
        <div style={{
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          
          {/* EDIT */}
          {tab === "edit" && (
            <>
              <h2>Edit PDF</h2>
              <input type="file" onChange={handleUpload} />

              {pdfUrl && (
                <div
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{ position: "relative", marginTop: 20 }}
                >
                  <iframe src={pdfUrl} width="100%" height="500px" />

                  {currentBox && (
                    <div style={{
                      position: "absolute",
                      left: currentBox.x,
                      top: currentBox.y,
                      width: currentBox.width,
                      height: currentBox.height,
                      border: "2px dashed black"
                    }} />
                  )}

                  {boxes.map((b, i) => (
                    <div key={i} style={{
                      position: "absolute",
                      left: b.x,
                      top: b.y,
                      width: b.width,
                      height: b.height,
                      border: "1px solid black",
                      background: "#fff"
                    }}>
                      <div contentEditable style={{ padding: 5 }}>Type</div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={exportPDF}>Export</button>
            </>
          )}

          {/* MERGE */}
          {tab === "merge" && (
            <>
              <h2>Merge PDFs</h2>
              <input type="file" multiple onChange={(e) => setMergeFiles(Array.from(e.target.files || []))} />
              <button onClick={mergePDFs}>Merge</button>
            </>
          )}

          {/* SPLIT */}
          {tab === "split" && (
            <>
              <h2>Split PDF</h2>
              <input type="file" onChange={(e) => setSplitFile(e.target.files?.[0] || null)} />
              <button onClick={splitPDF}>Split</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}