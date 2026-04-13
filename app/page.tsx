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
  const [selected, setSelected] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // START DRAW
  const handleMouseDown = (e: any) => {
    const rect = containerRef.current!.getBoundingClientRect();

    setStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setDrawing(true);
  };

  // DRAW BOX
  const handleMouseMove = (e: any) => {
    if (!drawing || !start) return;

    const rect = containerRef.current!.getBoundingClientRect();

    const width = e.clientX - rect.left - start.x;
    const height = e.clientY - rect.top - start.y;

    setBoxes((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        width,
        height,
      };
      return updated;
    });
  };

  // END DRAW
  const handleMouseUp = () => {
    setDrawing(false);
    setStart(null);
  };

  // CREATE NEW BOX
  const handleClick = (e: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const newBox: Box = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: 0,
      height: 0,
      text: "",
    };

    setBoxes((prev) => [...prev, newBox]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>⚡ EditZap</h1>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        style={{
          width: "100%",
          height: 600,
          border: "2px solid black",
          position: "relative",
        }}
      >
        {boxes.map((b, i) => (
          <div
            key={i}
            contentEditable
            suppressContentEditableWarning
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
                selected === i ? "2px solid black" : "1px solid gray",
              background: "#fff",
              overflow: "hidden",
              padding: 4,
            }}
          >
            {b.text || "Type"}
          </div>
        ))}
      </div>
    </div>
  );
}