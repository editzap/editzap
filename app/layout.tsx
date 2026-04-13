import Script from "next/script";

export const metadata = {
  title: "EditZap - Free PDF Editor",
  description:
    "Edit PDF online for free. Add text, modify and download instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="VlskugI9oL7iR415GO-_cqk_HqfxZSzu4BklP4eWymY"
        />
      </head>

      <body
        style={{
          margin: 0,
          fontFamily: "Arial",
          background: "#fff",
          color: "#000",
        }}
      >
        {/* ✅ AdSense Script (CORRECT WAY) */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4445312802335744"
          crossOrigin="anonymous"
        />

        {/* NAVBAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            borderBottom: "1px solid #ddd",
            fontWeight: "bold",
          }}
        >
          <h2 style={{ margin: 0 }}>⚡ EditZap</h2>

          <div style={{ display: "flex", gap: 20 }}>
            <a href="/" style={{ color: "#000", textDecoration: "none" }}>
              Home
            </a>
            <a href="/about" style={{ color: "#000", textDecoration: "none" }}>
              About
            </a>
            <a href="/privacy" style={{ color: "#000", textDecoration: "none" }}>
              Privacy
            </a>
            <a href="/contact" style={{ color: "#000", textDecoration: "none" }}>
              Contact
            </a>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ padding: 20 }}>{children}</div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            textAlign: "center",
            borderTop: "1px solid #ddd",
            fontSize: 14,
          }}
        >
          © 2026 EditZap — All rights reserved
        </div>
      </body>
    </html>
  );
}