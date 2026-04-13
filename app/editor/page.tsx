"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Tab = "edit" | "merge" | "split";

export default function Editor() {
  const [tab, setTab] = useState<Tab>("edit");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [text, setText] = useState("");

  const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
    const ab = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(ab).set(bytes);
    return ab;
  };

  useEffect(() => {
    const tool = sessionStorage.getItem("tool") as Tab | null;
    if (tool) setTab(tool);
  }, []);

  const exportPDF = async () => {
    if (!pdfBytes) return alert("Upload PDF");

    const pdf = await PDFDocument.load(pdfBytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    pdf.getPages()[0].drawText(text || "Text", {
      x: 50,
      y: 500,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });

    download(await pdf.save(), "edited.pdf");
  };

  const mergePDFs = async (files: File[]) => {
    if (files.length < 2) return alert("Select 2+ PDFs");

    const merged = await PDFDocument.create();

    for (const f of files) {
      const pdf = await PDFDocument.load(await f.arrayBuffer());
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    download(await merged.save(), "merged.pdf");
  };

  const splitPDF = async () => {
    if (!pdfBytes) return alert("No PDF");

    const pdf = await PDFDocument.load(pdfBytes);

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      download(await newPdf.save(), `page-${i + 1}.pdf`);
    }
  };

  const download = (bytes: Uint8Array, name: string) => {
    const buffer = toArrayBuffer(bytes);
    const url = URL.createObjectURL(new Blob([buffer]));

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={container}>
      {/* HERO */}
      <div style={hero}>
        <h1 style={title}>Editor</h1>
        <p style={subtitle}>Modify your PDFs with ease</p>
      </div>

      {/* TABS */}
      <div style={tabsWrapper}>
        <div style={tabs}>
          {(["edit", "merge", "split"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...tabBtn,
                ...(tab === t ? activeTab : {}),
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CARD */}
      <div style={card}>
        {tab === "edit" && (
          <>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                e.target.files?.[0] &&
                e.target.files[0].arrayBuffer().then(setPdfBytes)
              }
            />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text"
              style={input}
            />
            <button onClick={exportPDF} style={primaryBtn}>
              Export PDF
            </button>
          </>
        )}

        {tab === "merge" && (
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) =>
              mergePDFs(Array.from(e.target.files || []))
            }
          />
        )}

        {tab === "split" && (
          <>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                e.target.files?.[0] &&
                e.target.files[0].arrayBuffer().then(setPdfBytes)
              }
            />
            <button onClick={splitPDF} style={primaryBtn}>
              Split PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* STYLES */

const container: React.CSSProperties = {
  padding: 40,
  maxWidth: 800,
  margin: "auto",
  fontFamily: "system-ui",
};

const hero: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 30,
};

const title: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
};

const subtitle: React.CSSProperties = {
  color: "#666",
};

/* TABS */
const tabsWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
};

const tabs: React.CSSProperties = {
  display: "flex",
  background: "#f3f4f6",
  padding: 6,
  borderRadius: 999,
};

const tabBtn: React.CSSProperties = {
  padding: "8px 18px",
  borderRadius: 999,
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const activeTab: React.CSSProperties = {
  background: "#111",
  color: "#fff",
};

/* CARD */
const card: React.CSSProperties = {
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const input: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  background: "#111",
  color: "#fff",
  borderRadius: 10,
  cursor: "pointer",
  border: "none",
};