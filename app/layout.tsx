export const metadata = {
  title: "EditZap",
  description: "Free online PDF editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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

        {/* CONTENT */}
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
          © 2026 EditZap
        </div>

      </body>
    </html>
  );
}