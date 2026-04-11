"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function Home() {
  const [activeTab, setActiveTab] = useState("edit");

  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<any[]>([]);
  const [currentBox, setCurrentBox] = useState<any>(null);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);

  const inputRef = useRef<HTMLInputElement>(null);

  // UPLOAD
  const handleUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setBoxes([]);
  };

  // DRAG START (ONLY EMPTY AREA)
  const handleMouseDown = (e: any) => {
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setIsDragging(true);
    setSelectedBox(null);

    setCurrentBox({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: 0,
      height: 0,
    });
  };

  // DRAG MOVE
  const handleMouseMove = (e: any) => {
    if (!isDragging || !currentBox) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setCurrentBox({
      ...currentBox,
      width: e.clientX - rect.left - currentBox.x,
      height: e.clientY - rect.top - currentBox.y,
    });
  };

  // DRAG END
  const handleMouseUp = () => {
    if (!currentBox) return;

    const newBoxes = [...boxes, { ...currentBox, text: "", fontSize }];
    setBoxes(newBoxes);

    setSelectedBox(newBoxes.length - 1);
    setText("");

    setCurrentBox(null);
    setIsDragging(false);

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // CLICK BOX
  const handleBoxClick = (index: number, e: any) => {
    e.stopPropagation();

    setSelectedBox(index);
    setText(boxes[index].text);

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // LIVE TEXT EDIT
  const handleTextChange = (value: string) => {
    setText(value);

    if (selectedBox === null) return;

    const updated = [...boxes];
    updated[selectedBox].text = value;
    updated[selectedBox].fontSize = fontSize;

    setBoxes(updated);
  };

  // DELETE EMPTY BOX USING KEYBOARD
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedBox === null) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (boxes[selectedBox]?.text === "") {
          e.preventDefault();

          const updated = boxes.filter((_, i) => i !== selectedBox);
          setBoxes(updated);
          setSelectedBox(null);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedBox, boxes]);

  // EXPORT PDF
  const applyToPDF = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const page = pdfDoc.getPages()[0];
    const height = page.getHeight();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    boxes.forEach((b) => {
      if (!b.text) return;

      page.drawText(b.text, {
        x: b.x,
        y: height - b.y,
        size: b.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const result = await pdfDoc.save();
    const buffer = new Uint8Array(result).buffer;

    setPdfUrl(URL.createObjectURL(new Blob([buffer])));
  };

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh", fontFamily: "Arial" }}>
      
      {/* HEADER */}
      <div style={header}>
        <div style={logo}>
          <div style={logoIcon}>⚡</div>
          <div style={{ fontWeight: "900" }}>EDITZAP</div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {["edit", "merge", "split"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={tabBtn(activeTab === tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: "800px", margin: "40px auto" }}>
        <div style={card}>

          {activeTab === "edit" && (
            <>
              <h2>Edit PDF</h2>

              <input type="file" onChange={handleUpload} />

              {selectedBox !== null && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Type text..."
                  />

                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    style={{ width: "60px" }}
                  />
                </div>
              )}

              <button style={btn} onClick={applyToPDF}>
                EXPORT PDF
              </button>
            </>
          )}

          {activeTab === "merge" && <div>Merge coming soon</div>}
          {activeTab === "split" && <div>Split coming soon</div>}
        </div>

        {/* PDF AREA */}
        {pdfUrl && activeTab === "edit" && (
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              position: "relative",
              marginTop: "20px",
              border: "2px solid black",
            }}
          >
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              style={{ pointerEvents: "none" }}
            />

            {boxes.map((b, i) => (
              <div
                key={i}
                onClick={(e) => handleBoxClick(i, e)}
                style={{
                  position: "absolute",
                  left: b.x,
                  top: b.y,
                  fontSize: b.fontSize,
                  border: "1px dashed black",
                  padding: "2px",
                  cursor: "text",
                }}
              >
                {b.text || "Click to type"}
              </div>
            ))}

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
          </div>
        )}
      </div>
    </div>
  );
}

// STYLES
const header = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px 30px",
  background: "#fff",
};

const logo = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const logoIcon = {
  width: "36px",
  height: "36px",
  background: "#000",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
};

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "14px",
};

const btn = {
  padding: "10px 16px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
};

const tabBtn = (active: boolean) => ({
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  background: active ? "#000" : "#eee",
  color: active ? "#fff" : "#000",
});