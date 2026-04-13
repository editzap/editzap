export const metadata = {
  title: "EditZap - Free PDF Editor",
  description: "Edit PDF online for free. Add text, merge, split instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        
        {/* GOOGLE VERIFICATION */}
        <meta
          name="google-site-verification"
          content="VlskugI9oL7iR415GO-_cqk_HqfxZSzu4BklP4eWymY"
        />

        {/* ✅ ADSENSE CODE (VERY IMPORTANT) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4445312802335744"
          crossOrigin="anonymous"
        ></script>

      </head>

      <body style={{ margin: 0, fontFamily: "Arial" }}>
        
        {/* NAVBAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 20,
            borderBottom: "1px solid #ddd",
          }}
        >
          <h2>⚡ EditZap</h2>

          <div style={{ display: "flex", gap: 20 }}>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        {/* MAIN CONTENT */}
        {children}

        {/* FOOTER */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            textAlign: "center",
            borderTop: "1px solid #ddd",
          }}
        >
          © 2026 EditZap — Free PDF Tools
        </div>

      </body>
    </html>
  );
}