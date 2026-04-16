import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { PwaRegistrar } from "@/components/PwaRegistrar";

export const metadata: Metadata = {
  title: "Posing Caller",
  description:
    "A premium routine timer and pose caller for bodybuilding athletes, backstage rehearsals, and posing practice.",
  applicationName: "Posing Caller",
  icons: {
    icon: "/KS.png",
    apple: "/KS.png",
    shortcut: "/KS.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Posing Caller",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas font-sans text-white antialiased">
        <PwaRegistrar />
        {children}
      </body>
    </html>
  );
}
