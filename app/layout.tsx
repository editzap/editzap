export const metadata = {
  title: "EditZap - Free PDF Editor",
  description: "Edit PDF online for free. Add text, modify and download instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <head>
        {/* 🔴 PASTE YOUR GOOGLE CODE BELOW */}
        <meta
          name="google-site-verification"
          content="VlskugI9oL7iR415GO-_cqk_HqfxZSzu4BklP4eWymY"
        />
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
        <div>{children}</div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            textAlign: "center",
            borderTop: "1px solid #ddd",
          }}
        >
          © 2026 EditZap — All rights reserved
        </div>

      </body>
    </html>
  );
}