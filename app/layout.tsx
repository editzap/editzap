import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={body}>
        {/* HEADER */}
        <header style={header}>
          <div style={logoWrap}>
            <span style={logoIcon}>⚡</span>
            <span style={logoText}>EditZap</span>
          </div>

          <nav style={navLinks}>
            <span style={navItem}>Home</span>
            <span style={navItem}>About</span>
            <span style={navItem}>Privacy</span>
            <span style={navItem}>Contact</span>
          </nav>

          <button style={ctaBtn}>Start Editing</button>
        </header>

        {/* PAGE CONTENT */}
        <main>{children}</main>

        {/* MINIMAL FOOTER */}
        <footer style={footer}>
          <div style={footerBottom}>
            © {new Date().getFullYear()} EditZap · Crafted for fast, private PDF editing
          </div>
        </footer>
      </body>
    </html>
  );
}

/* STYLES */

const body: React.CSSProperties = {
  margin: 0,
  fontFamily: "system-ui",
};

/* HEADER */
const header: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 24px",
  backdropFilter: "blur(10px)",
  background: "rgba(255,255,255,0.7)",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
};

const logoWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontWeight: 600,
};

const logoIcon: React.CSSProperties = {
  fontSize: 18,
};

const logoText: React.CSSProperties = {
  fontSize: 16,
};

const navLinks: React.CSSProperties = {
  display: "flex",
  gap: 22,
  fontSize: 14,
};

const navItem: React.CSSProperties = {
  cursor: "pointer",
  color: "#444",
};

const ctaBtn: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 999,
  background: "#111",
  color: "#fff",
  fontSize: 13,
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};

/* FOOTER */
const footer: React.CSSProperties = {
  marginTop: 80,
  padding: "24px 0",
  borderTop: "1px solid rgba(0,0,0,0.06)",
  textAlign: "center",
};

const footerBottom: React.CSSProperties = {
  fontSize: 12,
  color: "#888",
  letterSpacing: 0.3,
};