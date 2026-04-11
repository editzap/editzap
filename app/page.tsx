"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<any[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#000000");

  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<number | null>(null);

  // UPLOAD
  const handleUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
    setPage(0);
  };

  // CLOSE
  const handleClosePDF = () => {
    setFile(null);
    setPdfUrl(null);
    setBoxes([]);
    setSelectedBox(null);
  };

  // ADD BOX
  const handleClick = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const newBox = {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
      text: "",
      fontSize,
      color,
      page,
    };

    const updated = [...boxes, newBox];
    setBoxes(updated);
    setSelectedBox(updated.length - 1);

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // SELECT
  const handleBoxClick = (i: number, e: any) => {
    e.stopPropagation();
    setSelectedBox(i);

    const b = boxes[i];
    setText(b.text);
    setFontSize(b.fontSize);
    setColor(b.color);
  };

  // UPDATE BOX
  const updateBox = (changes: any) => {
    if (selectedBox === null) return;
    const updated = [...boxes];
    updated[selectedBox] = { ...updated[selectedBox], ...changes };
    setBoxes(updated);
  };

  // DRAG START
  const startDrag = (i: number, e: any) => {
    e.stopPropagation();
    dragRef.current = i;
  };

  // DRAG MOVE (SMOOTH)
  const move = (e: any) => {
    if (dragRef.current === null) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setBoxes((prev) => {
      const updated = [...prev];
      updated[dragRef.current!] = {
        ...updated[dragRef.current!],
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
      return updated;
    });
  };

  // STOP DRAG
  const stopDrag = () => {
    dragRef.current = null;
  };

  // DELETE
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedBox === null) return;

      if (e.key === "Delete") {
        setBoxes((prev) => prev.filter((_, i) => i !== selectedBox));
        setSelectedBox(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedBox]);

  // EXPORT
  const applyToPDF = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const pages = pdfDoc.getPages();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    boxes.forEach((b) => {
      const p = pages[b.page] || pages[0];
      const height = p.getHeight();

      p.drawText(b.text, {
        x: b.x,
        y: height - b.y,
        size: b.fontSize,
        font,
        color: rgb(
          parseInt(b.color.slice(1, 3), 16) / 255,
          parseInt(b.color.slice(3, 5), 16) / 255,
          parseInt(b.color.slice(5, 7), 16) / 255
        ),
      });
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes as any], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();

    setPdfUrl(url);
  };

  return (
    <div style={{ padding: 16, fontFamily: "Arial", maxWidth: 900, margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>EDITZAP</h1>

      <input type="file" onChange={handleUpload} />

      {/* TOOLBAR */}
      <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => setZoom((z) => z + 0.1)}>Zoom +</button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
          Zoom -
        </button>

        <button onClick={() => setPage((p) => Math.max(0, p - 1))}>
          Prev
        </button>
        <button onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {/* EDIT PANEL */}
      {selectedBox !== null && (
        <div style={{ marginTop: 10 }}>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              updateBox({ text: e.target.value });
            }}
          />

          <input
            type="number"
            value={fontSize}
            onChange={(e) => {
              setFontSize(Number(e.target.value));
              updateBox({ fontSize: Number(e.target.value) });
            }}
            style={{ width: 60 }}
          />

          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              updateBox({ color: e.target.value });
            }}
          />
        </div>
      )}

      <button style={{ marginTop: 10 }} onClick={applyToPDF}>
        EXPORT PDF
      </button>

      {/* PDF AREA */}
      {pdfUrl && (
        <div
          onClick={handleClick}
          onMouseMove={move}
          onMouseUp={stopDrag}
          style={{
            position: "relative",
            marginTop: 20,
            border: "2px solid black",
            overflow: "auto",
          }}
        >
          <button
            onClick={handleClosePDF}
            style={{ position: "absolute", right: 10, zIndex: 10 }}
          >
            ✕
          </button>

          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              style={{ pointerEvents: "none" }}
            />

            {boxes
              .filter((b) => b.page === page)
              .map((b, i) => (
                <div
                  key={i}
                  onClick={(e) => handleBoxClick(i, e)}
                  onMouseDown={(e) => startDrag(i, e)}
                  style={{
                    position: "absolute",
                    left: b.x,
                    top: b.y,
                    fontSize: b.fontSize,
                    color: b.color,
                    border: selectedBox === i ? "2px solid blue" : "1px dashed black",
                    cursor: "move",
                    background: "#fff",
                    padding: 2,
                  }}
                >
                  {b.text || "Type"}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}