import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Profilazione Cliente Premium",
  description: "Wizard consulenziale per clienti finanziari e assicurativi",
  icons: {
    icon: "/KS.png",
    apple: "/KS.png",
    shortcut: "/KS.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
