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
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // START DRAW
  const handleMouseDown = (e: any) => {
    const rect = containerRef.current!.getBoundingClientRect();

    const newBox: Box = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: 0,
      height: 0,
      text: "",
    };

    setCurrentBox(newBox);
    setDrawing(true);
  };

  // DRAW SIZE
  const handleMouseMove = (e: any) => {
    if (!drawing || !currentBox) return;

    const rect = containerRef.current!.getBoundingClientRect();

    const width = e.clientX - rect.left - currentBox.x;
    const height = e.clientY - rect.top - currentBox.y;

    setCurrentBox({
      ...currentBox,
      width,
      height,
    });
  };

  // END DRAW → LOCK POSITION
  const handleMouseUp = () => {
    if (currentBox) {
      setBoxes((prev) => [...prev, currentBox]);
    }

    setCurrentBox(null);
    setDrawing(false);
  };

  // DELETE BOX
  const deleteBox = (i: number) => {
    setBoxes((prev) => prev.filter((_, index) => index !== i));
    setSelected(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>⚡ EditZap</h1>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          width: "100%",
          height: 600,
          border: "2px solid black",
          position: "relative",
          background: "#fafafa",
        }}
      >
        {/* DRAWING BOX */}
        {currentBox && (
          <div
            style={{
              position: "absolute",
              left: currentBox.x,
              top: currentBox.y,
              width: currentBox.width,
              height: currentBox.height,
              border: "2px dashed black",
              background: "rgba(0,0,0,0.05)",
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
              overflow: "hidden",
            }}
          >
            {/* TEXT AREA */}
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

            {/* DELETE BUTTON */}
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

            {/* RESIZE HANDLE */}
            {selected === i && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 10,
                  height: 10,
                  background: "black",
                  cursor: "nwse-resize",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}