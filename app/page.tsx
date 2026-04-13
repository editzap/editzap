"use client";

import { useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

type TextItem = {
  x: number;
  y: number;
  text: string;
  size: number;
};

export default function EditorPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tab, setTab] = useState<"edit" | "merge" | "split">("edit");

  // EDIT
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  // MERGE
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  // SPLIT
  const [splitFile, setSplitFile] = useState<File | null>(null);

  // ================= EDIT =================

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setTexts([]);
    setSelected(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    // Prevent adding while dragging
    if (dragging !== null) return;

    const rect = containerRef.current.getBoundingClientRect();

    const newText: TextItem = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: "Type here",
      size: 16,
    };

    setTexts((prev) => [...prev, newText]);
  };

  const updateText = (i: number, value: string) => {
    setTexts((prev) =>
      prev.map((t, index) =>
        index === i ? { ...t, text: value } : t
      )
    );
  };

  const deleteText = () => {
    if (selected === null) return;

    setTexts((prev) => prev.filter((_, i) => i !== selected));
    setSelected(null);
  };

  const handleMouseDown = (i: number) => {
    setDragging(i);
    setSelected(i);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setTexts((prev) =>
      prev.map((t, index) =>
        index === dragging
          ? {
              ...t,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            }
          : t
      )
    );
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const exportPDF = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    const page = pdf.getPages()[0];
    const { height } = page.getSize();

    texts.forEach((t) => {
      page.drawText(t.text, {
        x: t.x,
        y: height - t.y,
        size: t.size,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdf.save();

    // FIXED EXPORT
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();

    URL.revokeObjectURL(url);
  };

  // ================= MERGE =================

  const mergePDFs = async () => {
    if (mergeFiles.length < 2) return;

    const merged = await PDFDocument.create();

    for (const f of mergeFiles) {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const pages = await merged.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach((p) => merged.addPage(p));
    }

    const mergedBytes = await merged.save();

    const blob = new Blob([new Uint8Array(mergedBytes)], {
      type: "application/pdf",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "merged.pdf";
    a.click();
  };

  // ================= SPLIT =================

  const splitPDF = async () => {
    if (!splitFile) return;

    const bytes = await splitFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    const total = pdf.getPageCount();

    for (let i = 0; i < total; i++) {
      const newPdf = await PDFDocument.create();

      const [page] = await newPdf.copyPages(pdf, [i]);
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

  // ================= UI =================

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>⚡ EditZap Editor</h2>

      {/* TABS */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button onClick={() => setTab("edit")}>EDIT</button>
        <button onClick={() => setTab("merge")}>MERGE</button>
        <button onClick={() => setTab("split")}>SPLIT</button>
      </div>

      {/* EDIT */}
      {tab === "edit" && (
        <>
          <input type="file" onChange={handleUpload} />

          {pdfUrl && (
            <>
              {/* TOOLBAR */}
              <div style={{ marginTop: 10 }}>
                <button onClick={deleteText}>Delete</button>
                <button
                  onClick={() => {
                    if (selected === null) return;
                    setTexts((prev) =>
                      prev.map((t, i) =>
                        i === selected
                          ? { ...t, size: t.size + 2 }
                          : t
                      )
                    );
                  }}
                >
                  A+
                </button>

                <button
                  onClick={() => {
                    if (selected === null) return;
                    setTexts((prev) =>
                      prev.map((t, i) =>
                        i === selected
                          ? { ...t, size: t.size - 2 }
                          : t
                      )
                    );
                  }}
                >
                  A-
                </button>

                <button onClick={exportPDF}>Export</button>
              </div>

              {/* CANVAS */}
              <div
                ref={containerRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ position: "relative", marginTop: 20 }}
              >
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="600px"
                />

                {texts.map((t, i) => (
                  <div
                    key={i}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(i);
                    }}
                    style={{
                      position: "absolute",
                      left: t.x,
                      top: t.y,
                      cursor: "move",
                      border:
                        selected === i
                          ? "1px solid blue"
                          : "none",
                    }}
                  >
                    <input
                      value={t.text}
                      onChange={(e) =>
                        updateText(i, e.target.value)
                      }
                      style={{
                        fontSize: t.size,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* MERGE */}
      {tab === "merge" && (
        <>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setMergeFiles(
                Array.from(e.target.files || []) as File[]
              )
            }
          />
          <button onClick={mergePDFs}>Merge PDFs</button>
        </>
      )}

      {/* SPLIT */}
      {tab === "split" && (
        <>
          <input
            type="file"
            onChange={(e) =>
              setSplitFile(e.target.files?.[0] || null)
            }
          />
          <button onClick={splitPDF}>Split PDF</button>
        </>
      )}
    </div>
  );
}