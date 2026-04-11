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
  const [activeTab, setActiveTab] = useState("edit");

  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const [text, setText] = useState("");
  const [size, setSize] = useState(16);

  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<number | null>(null);

  // UPLOAD
  const handleUpload = (e: any) => {
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

  // ADD BOX
  const handleClick = (e: any) => {
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
  const handleSelect = (i: number, e: any) => {
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
  const startDrag = (i: number, e: any) => {
    e.stopPropagation();
    dragRef.current = i;
  };

  const move = (e: any) => {
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

  // EXPORT
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

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      
      {/* TABS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["edit", "merge", "split"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              fontWeight: "bold",
              background: activeTab === tab ? "#000" : "#eee",
              color: activeTab === tab ? "#fff" : "#000",
              border: "none"
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* EDIT TAB */}
      {activeTab === "edit" && (
        <>
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

          <button onClick={applyToPDF} style={{ marginTop: 10 }}>
            EXPORT PDF
          </button>

          {pdfUrl && (
            <div
              onClick={handleClick}
              onMouseMove={move}
              onMouseUp={stopDrag}
              style={{ position: "relative", marginTop: 20, border: "2px solid black" }}
            >
              <button onClick={handleClose} style={{ position: "absolute", right: 10 }}>
                ✕
              </button>

              <iframe src={pdfUrl} width="100%" height="500px" style={{ pointerEvents: "none" }} />

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
                    padding: 2
                  }}
                >
                  {b.text || "Type"}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CONTENT FOR ADSENSE */}
      <div style={{ marginTop: 40 }}>
        <h2>Free Online PDF Editor - EditZap</h2>

        <p>
          EditZap is a free online PDF editor that allows you to easily add text to your documents.
          Upload your file, edit instantly, and download your updated PDF in seconds.
        </p>

        <h3>Features</h3>
        <ul>
          <li>Add text to PDF</li>
          <li>Fast and secure editing</li>
          <li>No installation required</li>
          <li>Works on all devices</li>
        </ul>

        <h3>Why Choose EditZap?</h3>
        <p>
          EditZap is simple, fast, and completely free. Unlike other tools, it does not require
          signup and works directly in your browser.
        </p>
      </div>
    </div>
  );
}