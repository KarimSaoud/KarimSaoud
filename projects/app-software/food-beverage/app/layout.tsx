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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
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
