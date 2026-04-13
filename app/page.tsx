"use client";

import { useState, useRef } from "react";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
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
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStart({ x, y });
    setCurrentBox({ x, y, width: 0, height: 0, text: "" });
    setDrawing(true);
  };

  // DRAW
  const handleMouseMove = (e: any) => {
    if (!drawing || !start || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const width = e.clientX - rect.left - start.x;
    const height = e.clientY - rect.top - start.y;

    setCurrentBox({
      x: start.x,
      y: start.y,
      width,
      height,
      text: "",
    });
  };

  // END DRAW
  const handleMouseUp = () => {
    if (currentBox) {
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

  return (
    <div style={{ padding: 20 }}>
      <h1>⚡ EditZap</h1>

      <input type="file" onChange={handleUpload} />

      {pdfUrl && (
        <div
          ref={containerRef}
          style={{
            position: "relative",
            marginTop: 20,
            width: "100%",
            height: 600,
          }}
        >
          {/* PDF */}
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          />

          {/* INTERACTION LAYER */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 5,
              cursor: "crosshair",
            }}
          />

          {/* DRAW BOX */}
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

          {/* FINAL BOXES */}
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
                style={{
                  width: "100%",
                  height: "100%",
                  padding: 4,
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
                    width: 20,
                    height: 20,
                    cursor: "pointer",
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
  );
}