"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

type Tool = "text" | "draw" | null;

interface Annotation {
  id: string;
  type: Tool;
  page: number;
  x: number;
  y: number;
  text?: string;
  path?: { x: number; y: number }[];
}

export default function Page() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>(null);

  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [textValue, setTextValue] = useState("");

  const [drawing, setDrawing] = useState(false);
  const [livePath, setLivePath] = useState<{ x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
    const ab = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(ab).set(bytes);
    return ab;
  };

  // load from homepage
  useEffect(() => {
    const stored = sessionStorage.getItem("pdfFile");
    if (!stored) return;

    fetch(stored)
      .then((res) => res.arrayBuffer())
      .then((buf) => setPdfBytes(buf));
  }, []);

  // render
  const renderPage = useCallback(async (doc: any, pageNum: number) => {
    if (!canvasRef.current || !overlayRef.current) return;

    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const ov = overlayRef.current;
    ov.width = viewport.width;
    ov.height = viewport.height;
  }, []);

  useEffect(() => {
    if (!pdfBytes) return;

    (async () => {
      const pdfjs = await import("pdfjs-dist");
      const { getDocument, GlobalWorkerOptions } = pdfjs as any;

      GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const doc = await getDocument({ data: pdfBytes }).promise;
      setPageCount(doc.numPages);
      renderPage(doc, currentPage);
    })();
  }, [pdfBytes, currentPage, renderPage]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = overlayRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * overlayRef.current!.width) / rect.width,
      y: ((e.clientY - rect.top) * overlayRef.current!.height) / rect.height,
    };
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "text") return;
    setPendingPos(getPos(e));
  };

  const commitText = () => {
    if (!pendingPos || !textValue.trim()) return;

    setAnnotations((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "text", page: currentPage, x: pendingPos.x, y: pendingPos.y, text: textValue },
    ]);

    setTextValue("");
    setPendingPos(null);
  };

  const exportPDF = async () => {
    if (!pdfBytes || !overlayRef.current) return;

    const doc = await PDFDocument.load(pdfBytes);
    const font = await doc.embedFont(StandardFonts.Helvetica);

    const page = doc.getPage(currentPage - 1);
    const { height, width } = page.getSize();

    const rect = overlayRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    annotations.forEach((a) => {
      if (a.type !== "text" || !a.text) return;

      page.drawText(a.text, {
        x: a.x * scaleX,
        y: height - a.y * scaleY,
        size: 14,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const bytes = await doc.save();
    const buffer = toArrayBuffer(bytes);

    const url = URL.createObjectURL(new Blob([buffer]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Editor</h2>

      <button onClick={() => setActiveTool("text")}>Text</button>
      <button onClick={exportPDF}>Export</button>

      <div>
        Page {currentPage} / {pageCount}
      </div>

      <div style={{ position: "relative", marginTop: 20 }}>
        <canvas ref={canvasRef} />
        <canvas ref={overlayRef} onClick={handleClick} style={{ position: "absolute", top: 0 }} />
      </div>

      {pendingPos && (
        <div>
          <input value={textValue} onChange={(e) => setTextValue(e.target.value)} />
          <button onClick={commitText}>Add</button>
        </div>
      )}
    </div>
  );
}