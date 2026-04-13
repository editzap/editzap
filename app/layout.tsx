import Script from "next/script";

export const metadata = {
  title: "EditZap - Free PDF Editor",
  description: "Edit, merge and split PDFs online for free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="VlskugI9oL7iR415GO-_cqk_HqfxZSzu4BklP4eWymY"
        />
      </head>

      <body style={{ margin: 0, fontFamily: "Arial" }}>
        
        {/* ADSENSE */}
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
            padding: 20,
            borderBottom: "1px solid #ddd",
            fontWeight: "bold",
          }}
        >
          <div>⚡ EditZap</div>

          <div style={{ display: "flex", gap: 20 }}>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

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
          © 2026 EditZap — Free PDF Tools
        </div>
      </body>
    </html>
  );
}