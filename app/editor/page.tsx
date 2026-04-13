"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import AdBlock from "@/components/AdBlock";

type Tool = "text" | "highlight" | "draw" | null;

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

  const [textValue, setTextValue] = useState("");
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [livePath, setLivePath] = useState<{ x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // ✅ SAFE ArrayBuffer converter
  const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
    const ab = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(ab).set(bytes);
    return ab;
  };

  // ── LOAD PDF ─────────────────────────────
  const loadFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    setPdfBytes(buf);
    setAnnotations([]);
    setCurrentPage(1);

    const pdfjsLib = await import("pdfjs-dist");
    const { getDocument, GlobalWorkerOptions } = pdfjsLib as any;

    GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    const doc = await getDocument({ data: buf }).promise;
    setPageCount(doc.numPages);

    renderPage(doc, 1, []);
  };

  // ── RENDER ───────────────────────────────
  const renderPage = useCallback(async (doc: any, pageNum: number, annots: Annotation[]) => {
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

    drawAnnotations(ov, annots, pageNum);
  }, []);

  const drawAnnotations = (ov: HTMLCanvasElement, annots: Annotation[], pageNum: number) => {
    const ctx = ov.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, ov.width, ov.height);

    annots.filter(a => a.page === pageNum).forEach(a => {
      if (a.type === "highlight") {
        ctx.fillStyle = "#fbbf2455";
        ctx.fillRect(a.x, a.y - 10, 120, 20);
      }

      if (a.type === "text" && a.text) {
        ctx.fillStyle = "#111";
        ctx.fillText(a.text, a.x, a.y);
      }

      if (a.type === "draw" && a.path) {
        ctx.strokeStyle = "#e11d48";
        ctx.lineWidth = 2;
        ctx.beginPath();
        a.path.forEach((pt, i) =>
          i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
        );
        ctx.stroke();
      }
    });
  };

  // ── RE-RENDER ────────────────────────────
  useEffect(() => {
    if (!pdfBytes) return;

    (async () => {
      const pdfjsLib = await import("pdfjs-dist");
      const { getDocument } = pdfjsLib as any;

      const doc = await getDocument({ data: pdfBytes }).promise;
      renderPage(doc, currentPage, annotations);
    })();
  }, [pdfBytes, currentPage, annotations, renderPage]);

  // ── HELPERS ──────────────────────────────
  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!overlayRef.current) return { x: 0, y: 0 };

    const rect = overlayRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * overlayRef.current.width) / rect.width,
      y: ((e.clientY - rect.top) * overlayRef.current.height) / rect.height,
    };
  };

  const uid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const download = (bytes: Uint8Array, name: string) => {
    const buffer = toArrayBuffer(bytes);
    const url = URL.createObjectURL(new Blob([buffer]));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── INTERACTIONS ─────────────────────────
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);

    if (activeTool === "text") {
      setPendingPos(pos);
      return;
    }

    if (activeTool === "highlight") {
      setAnnotations(prev => [...prev, { id: uid(), type: "highlight", page: currentPage, x: pos.x, y: pos.y }]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "draw") return;
    setDrawing(true);
    setLivePath([getPos(e)]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    setLivePath(prev => [...prev, getPos(e)]);
  };

  const handleMouseUp = () => {
    if (!drawing) return;
    setDrawing(false);

    if (livePath.length > 1) {
      setAnnotations(prev => [...prev, { id: uid(), type: "draw", page: currentPage, x: 0, y: 0, path: livePath }]);
    }

    setLivePath([]);
  };

  const commitText = () => {
    if (!pendingPos || !textValue.trim()) return;

    setAnnotations(prev => [
      ...prev,
      { id: uid(), type: "text", page: currentPage, x: pendingPos.x, y: pendingPos.y, text: textValue }
    ]);

    setTextValue("");
    setPendingPos(null);
  };

  // ── ROTATE ───────────────────────────────
  const rotatePage = async () => {
    if (!pdfBytes) return;

    const doc = await PDFDocument.load(pdfBytes);
    const page = doc.getPage(currentPage - 1);

    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + 90) % 360));

    const saved = await doc.save();
    setPdfBytes(toArrayBuffer(saved));
  };

  // ── EXPORT ───────────────────────────────
  const exportPDF = async () => {
    if (!pdfBytes) return;

    const doc = await PDFDocument.load(pdfBytes);
    const font = await doc.embedFont(StandardFonts.Helvetica);

    for (const ann of annotations) {
      if (ann.type !== "text" || !ann.text) continue;

      const page = doc.getPage(ann.page - 1);
      const { height } = page.getSize();

      page.drawText(ann.text, {
        x: ann.x / 1.5,
        y: height - ann.y / 1.5,
        size: 14,
        font,
        color: rgb(0, 0, 0),
      });
    }

    const bytes = await doc.save();
    download(bytes, "edited.pdf");
  };

  return (
    <div style={{ padding: 20 }}>
      <AdBlock />

      <button onClick={() => fileRef.current?.click()}>Upload PDF</button>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setActiveTool("text")}>Text</button>
        <button onClick={() => setActiveTool("highlight")}>Highlight</button>
        <button onClick={() => setActiveTool("draw")}>Draw</button>
      </div>

      <button onClick={rotatePage}>Rotate</button>
      <button onClick={exportPDF}>Export</button>

      <div style={{ position: "relative", marginTop: 20 }}>
        <canvas ref={canvasRef} />
        <canvas
          ref={overlayRef}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      {pendingPos && (
        <div>
          <input value={textValue} onChange={e => setTextValue(e.target.value)} />
          <button onClick={commitText}>Add</button>
        </div>
      )}

      <AdBlock />
    </div>
  );
}