"use client";

import { useState, useRef } from "react";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  size: number;
  color: string;
  bold: boolean;
};

export default function Editor() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // UPLOAD
  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfUrl(URL.createObjectURL(file));
    setBoxes([]);
  };

  // START DRAW
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
      bold: false,
    });

    setDrawing(true);
  };

  // DRAW
  const handleMouseMove = (e: any) => {
    if (!drawing || !start || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const width = e.clientX - rect.left - start.x;
    const height = e.clientY - rect.top - start.y;

    setCurrentBox((prev) =>
      prev
        ? {
            ...prev,
            width,
            height,
          }
        : null
    );
  };

  // END DRAW (FIXED)
  const handleMouseUp = () => {
    if (!drawing) return;

    if (currentBox && Math.abs(currentBox.width) > 10 && Math.abs(currentBox.height) > 10) {
      setBoxes((prev) => [...prev, currentBox]);
    }

    setDrawing(false);
    setStart(null);
    setCurrentBox(null);
  };

  // DELETE
  const deleteBox = (i: number) => {
    setBoxes((prev) => prev.filter((_, index) => index !== i));
    setSelected(null);
  };

  // UPDATE BOX
  const updateBox = (changes: Partial<Box>) => {
    if (selected === null) return;

    setBoxes((prev) => {
      const updated = [...prev];
      updated[selected] = { ...updated[selected], ...changes };
      return updated;
    });
  };

  return (
    <div style={{ height: "100vh", background: "#f3f4f6" }}>

      {/* TOP BAR */}
      <div
        style={{
          background: "#fff",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>⚡ EditZap Editor</h2>

        <label
          style={{
            background: "black",
            color: "#fff",
            padding: "8px 15px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Upload PDF
          <input type="file" hidden onChange={handleUpload} />
        </label>
      </div>

      {/* TOOLBAR */}
      {selected !== null && (
        <div
          style={{
            background: "#fff",
            padding: 10,
            display: "flex",
            gap: 10,
            borderBottom: "1px solid #ddd",
          }}
        >
          <input
            type="number"
            value={boxes[selected].size}
            onChange={(e) =>
              updateBox({ size: parseInt(e.target.value) || 16 })
            }
          />

          <input
            type="color"
            value={boxes[selected].color}
            onChange={(e) =>
              updateBox({ color: e.target.value })
            }
          />

          <button onClick={() => updateBox({ bold: !boxes[selected].bold })}>
            B
          </button>
        </div>
      )}

      {/* WORK AREA */}
      <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
        {pdfUrl && (
          <div
            ref={containerRef}
            style={{
              position: "relative",
              width: 800,
              height: 600,
              background: "#fff",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            {/* PDF */}
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ position: "absolute", zIndex: 1 }}
            />

            {/* INTERACTION */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 5,
                cursor: "crosshair",
              }}
            />

            {/* DRAW PREVIEW */}
            {currentBox && (
              <div
                style={{
                  position: "absolute",
                  left: currentBox.x,
                  top: currentBox.y,
                  width: currentBox.width,
                  height: currentBox.height,
                  border: "2px dashed black",
                  zIndex: 10,
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
                  zIndex: 20,
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
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: 6,
                    fontSize: b.size,
                    color: b.color,
                    fontWeight: b.bold ? "bold" : "normal",
                    outline: "none",
                  }}
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
                      width: 22,
                      height: 22,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}