"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { motion } from "framer-motion";

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
    <motion.div
      style={container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HERO */}
      <motion.div
        style={hero}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 style={title}>PDF Editor Tool</h1>
        <p style={subtitle}>
          Edit, merge, and split PDF files online easily
        </p>
      </motion.div>

      {/* TABS */}
      <div style={tabsWrapper}>
        <div style={tabs}>
          {(["edit", "merge", "split"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={tabBtn}>
              {tab === t && (
                <motion.div
                  layoutId="pill"
                  transition={{ type: "spring", stiffness: 300 }}
                  style={activePill}
                />
              )}
              <span style={tabText(tab === t)}>{t.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TOOL CARD */}
      <motion.div
        key={tab}
        style={card}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {tab === "edit" && (
          <>
            <label style={upload}>
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) =>
                  e.target.files?.[0] &&
                  e.target.files[0].arrayBuffer().then(setPdfBytes)
                }
              />
            </label>

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text"
              style={input}
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={exportPDF}
              style={primaryBtn}
            >
              Export PDF
            </motion.button>
          </>
        )}

        {tab === "merge" && (
          <label style={upload}>
            Upload PDFs
            <input
              type="file"
              multiple
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) =>
                mergePDFs(Array.from(e.target.files || []))
              }
            />
          </label>
        )}

        {tab === "split" && (
          <>
            <label style={upload}>
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) =>
                  e.target.files?.[0] &&
                  e.target.files[0].arrayBuffer().then(setPdfBytes)
                }
              />
            </label>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={splitPDF}
              style={primaryBtn}
            >
              Split PDF
            </motion.button>
          </>
        )}
      </motion.div>

      {/* CONTENT (ADSENSE IMPORTANT) */}
      <div style={contentSection}>
        <h2>Online PDF Editor</h2>
        <p style={contentText}>
          This online PDF editor allows you to edit, merge, and split PDF files
          quickly and securely. No installation is required, and everything works
          directly in your browser.
        </p>

        <h3>How to Use</h3>
        <ul style={contentList}>
          <li>Upload your PDF file</li>
          <li>Select the tool you need</li>
          <li>Make changes instantly</li>
          <li>Download the final file</li>
        </ul>

        <h3>Why Choose This Tool?</h3>
        <p style={contentText}>
          Our PDF tools are designed for speed, simplicity, and privacy. You can
          process files on any device without installing heavy software.
        </p>

        <h3>FAQ</h3>
        <p style={contentText}>
          <b>Is this tool free?</b> Yes, basic features are free to use.
        </p>
        <p style={contentText}>
          <b>Are my files safe?</b> Files are processed securely and not stored.
        </p>
      </div>
    </motion.div>
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
  position: "relative",
  padding: "10px 20px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const activePill: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: 999,
  background: "#111",
};

const tabText = (active: boolean): React.CSSProperties => ({
  position: "relative",
  zIndex: 1,
  color: active ? "#fff" : "#333",
});

/* CARD */
const card: React.CSSProperties = {
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const upload: React.CSSProperties = {
  padding: "12px",
  border: "2px dashed #ccc",
  borderRadius: 10,
  textAlign: "center",
  cursor: "pointer",
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

/* CONTENT */
const contentSection: React.CSSProperties = {
  marginTop: 60,
  maxWidth: 800,
  marginInline: "auto",
};

const contentText: React.CSSProperties = {
  color: "#555",
  lineHeight: 1.7,
  marginTop: 10,
};

const contentList: React.CSSProperties = {
  marginTop: 10,
  paddingLeft: 20,
  color: "#555",
  lineHeight: 1.8,
};