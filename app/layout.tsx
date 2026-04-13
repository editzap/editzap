"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <html lang="en">
      <body style={body}>
        {/* HEADER */}
        <header style={header}>
          {/* LOGO */}
          <Link href="/" style={linkReset}>
            <div style={logoWrap}>
              <span style={logoIcon}>⚡</span>
              <span style={logoText}>EditZap</span>
            </div>
          </Link>

          {/* NAV */}
          <nav style={navLinks}>
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
              { name: "Privacy", path: "/privacy" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <Link key={item.path} href={item.path} style={linkReset}>
                <span
                  style={{
                    ...navItem,
                    ...(isActive(item.path) ? activeNavItem : {}),
                  }}
                >
                  {item.name}
                  <span style={underline} />
                </span>
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link href="/" style={linkReset}>
            <button style={ctaBtn}>Start Editing</button>
          </Link>
        </header>

        {/* MAIN */}
        <main key={pathname} style={main}>
          {children}
        </main>

        {/* FOOTER */}
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
  background: "#fff",
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
  WebkitBackdropFilter: "blur(10px)",
  background: "rgba(255,255,255,0.9)",
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

/* NAV */
const navLinks: React.CSSProperties = {
  display: "flex",
  gap: 22,
  fontSize: 14,
};

const navItem: React.CSSProperties = {
  position: "relative",
  cursor: "pointer",
  color: "#444",
  paddingBottom: 2,
};

const activeNavItem: React.CSSProperties = {
  color: "#111",
  fontWeight: 600,
};

/* UNDERLINE ANIMATION */
const underline: React.CSSProperties = {
  position: "absolute",
  left: 0,
  bottom: 0,
  height: 2,
  width: "0%",
  background: "#111",
  transition: "width 0.25s ease",
};

/* LINK RESET */
const linkReset: React.CSSProperties = {
  textDecoration: "none",
  display: "inline-block",
};

/* CTA */
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

/* MAIN */
const main: React.CSSProperties = {
  minHeight: "calc(100vh - 120px)",
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