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

  // EDIT STATES
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);

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
    if (mergeFiles.length === 0) return alert("Upload files");

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
    if (!splitFile) return alert("Upload file");

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
    <div style={{ display: "flex", height: "100vh", background: "#f3f4f6" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: 260,
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: 20,
        }}
      >
        <h2 style={{ fontWeight: "bold", marginBottom: 30 }}>
          ⚡ EditZap
        </h2>

        {[
          { key: "edit", label: "Edit PDF" },
          { key: "merge", label: "Merge PDF" },
          { key: "split", label: "Split PDF" },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() => setTab(item.key as any)}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              marginBottom: 10,
              cursor: "pointer",
              background:
                tab === item.key ? "#111827" : "transparent",
              color: tab === item.key ? "#fff" : "#111",
              fontWeight: "bold",
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 40 }}>

        <div
          style={{
            background: "#fff",
            padding: 30,
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          
          {/* EDIT */}
          {tab === "edit" && (
            <>
              <h2>Edit PDF</h2>

              <label
                style={{
                  padding: "10px 20px",
                  background: "#111827",
                  color: "#fff",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Upload PDF
                <input type="file" hidden onChange={handleUpload} />
              </label>

              <button
                onClick={exportPDF}
                style={{ marginLeft: 10 }}
              >
                Export
              </button>

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
                          updateText(
                            i,
                            (e.target as HTMLDivElement).innerText
                          )
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

              <button
                onClick={mergePDFs}
                style={{ marginTop: 10 }}
              >
                Merge & Download
              </button>
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

              <button
                onClick={splitPDF}
                style={{ marginTop: 10 }}
              >
                Split & Download
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}