import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";

import "@/app/globals.css";
import { PwaRegistrar } from "@/components/pwa-registrar";

export const metadata: Metadata = {
  applicationName: "Food & Beverage Tracker",
  title: "Food & Beverage Tracker",
  description: "MVP minimalista per tracciare cibo, acqua e bevande.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Food Log",
    statusBarStyle: "default"
  },
  icons: {
    icon: "/KS.png",
    apple: "/KS.png",
    shortcut: "/KS.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1e3b2d"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>
        <PwaRegistrar />
        {children}
      </body>
    </html>
  );
}
