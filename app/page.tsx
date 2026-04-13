"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Box = {
  x: number;
  y: number;
  text: string;
  size: number;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"edit" | "merge" | "split">("edit");

  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const [text, setText] = useState("");
  const [size, setSize] = useState(16);

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [pagesInput, setPagesInput] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<number | null>(null);

  // ================= EDIT =================

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
    setSelected(null);
  };

  const handleClose = () => {
    setFile(null);
    setPdfUrl(null);
    setBoxes([]);
    setSelected(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const newBox: Box = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: "",
      size,
    };

    setBoxes((prev) => [...prev, newBox]);
    setSelected(boxes.length);

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(i);
    setText(boxes[i].text);
    setSize(boxes[i].size);
  };

  const updateBox = (changes: Partial<Box>) => {
    if (selected === null) return;

    setBoxes((prev) => {
      const updated = [...prev];
      updated[selected] = { ...updated[selected], ...changes };
      return updated;
    });
  };

  const startDrag = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    dragRef.current = i;
  };

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current === null) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setBoxes((prev) => {
      const updated = [...prev];
      updated[dragRef.current!] = {
        ...updated[dragRef.current!],
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      return updated;
    });
  };

  const stopDrag = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selected === null) return;

      if (e.key === "Delete") {
        setBoxes((prev) => prev.filter((_, i) => i !== selected));
        setSelected(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

  const applyToPDF = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const page = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const height = page.getHeight();

    boxes.forEach((b) => {
      if (!b.text) return;

      page.drawText(b.text, {
        x: b.x,
        y: height - b.y,
        size: b.size,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();
  };

  // ================= MERGE =================

  const handleMergeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setMergeFiles(Array.from(e.target.files));
  };

  const mergePDFs = async () => {
    if (mergeFiles.length < 2) {
      alert("Select at least 2 PDFs");
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of mergeFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();

    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
  };

  // ================= SPLIT =================

  const handleSplitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSplitFile(f);
  };

  const splitPDF = async () => {
    if (!splitFile || !pagesInput) {
      alert("Upload file and enter pages");
      return;
    }

    const bytes = await splitFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);

    const newPdf = await PDFDocument.create();

    const pages = pagesInput
      .split(",")
      .map((p) => parseInt(p.trim()) - 1)
      .filter((p) => !isNaN(p));

    const copied = await newPdf.copyPages(pdfDoc, pages);
    copied.forEach((p) => newPdf.addPage(p));

    const newBytes = await newPdf.save();

    const blob = new Blob([new Uint8Array(newBytes)], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "split.pdf";
    a.click();
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      
      <h1 style={{ textAlign: "center" }}>⚡ EditZap</h1>

      {/* TABS */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        <button onClick={() => setActiveTab("edit")}>EDIT</button>
        <button onClick={() => setActiveTab("merge")}>MERGE</button>
        <button onClick={() => setActiveTab("split")}>SPLIT</button>
      </div>

      {/* EDIT */}
      {activeTab === "edit" && (
        <>
          <input type="file" onChange={handleUpload} />
          <button onClick={applyToPDF}>EXPORT PDF</button>

          {pdfUrl && (
            <div
              onClick={handleClick}
              onMouseMove={move}
              onMouseUp={stopDrag}
              style={{ position: "relative", marginTop: 20 }}
            >
              <button onClick={handleClose}>✕</button>

              <iframe
                src={pdfUrl}
                width="100%"
                height="500px"
                style={{ pointerEvents: "none" }}
              />

              {boxes.map((b, i) => (
                <div
                  key={i}
                  onClick={(e) => handleSelect(i, e)}
                  onMouseDown={(e) => startDrag(i, e)}
                  style={{
                    position: "absolute",
                    left: b.x,
                    top: b.y,
                    fontSize: b.size,
                    border: "1px solid black",
                    background: "#fff",
                    padding: 2,
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
        <div>
          <h2>Merge PDFs</h2>
          <input type="file" multiple onChange={handleMergeUpload} />
          <p>{mergeFiles.length} files selected</p>
          <button onClick={mergePDFs}>Merge & Download</button>
        </div>
      )}

      {/* SPLIT */}
      {activeTab === "split" && (
        <div>
          <h2>Split PDF</h2>
          <input type="file" onChange={handleSplitUpload} />
          <input
            placeholder="Enter pages (1,2,3)"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
          />
          <button onClick={splitPDF}>Split & Download</button>
        </div>
      )}
    </div>
  );
}