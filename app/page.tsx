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
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const [text, setText] = useState("");
  const [size, setSize] = useState(16);

  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<number | null>(null);

  // UPLOAD
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
    setSelected(null);
  };

  // CLOSE
  const handleClose = () => {
    setFile(null);
    setPdfUrl(null);
    setBoxes([]);
    setSelected(null);
  };

  // ADD TEXT BOX
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

  // SELECT
  const handleSelect = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(i);
    setText(boxes[i].text);
    setSize(boxes[i].size);
  };

  // UPDATE
  const updateBox = (changes: Partial<Box>) => {
    if (selected === null) return;

    setBoxes((prev) => {
      const updated = [...prev];
      updated[selected] = { ...updated[selected], ...changes };
      return updated;
    });
  };

  // DRAG
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

  // DELETE
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

  // ✅ FINAL EXPORT (NO ERRORS EVER)
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

    // 🔥 SAFEST METHOD (NO TYPE ERROR)
    const uint8 = new Uint8Array(pdfBytes);
    const blob = new Blob([uint8], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "edited.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>EDITZAP</h1>

      <input type="file" onChange={handleUpload} />

      {selected !== null && (
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
            value={size}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSize(val);
              updateBox({ size: val });
            }}
            style={{ width: 60 }}
          />
        </div>
      )}

      <button style={{ marginTop: 10 }} onClick={applyToPDF}>
        EXPORT PDF
      </button>

      {pdfUrl && (
        <div
          onClick={handleClick}
          onMouseMove={move}
          onMouseUp={stopDrag}
          style={{
            position: "relative",
            marginTop: 20,
            border: "2px solid black",
          }}
        >
          <button
            onClick={handleClose}
            style={{ position: "absolute", right: 10 }}
          >
            ✕
          </button>

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
                border: selected === i ? "2px solid blue" : "1px dashed black",
                background: "#fff",
                padding: 2,
                cursor: "move",
              }}
            >
              {b.text || "Type"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}