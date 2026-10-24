import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DeviceShell } from "@/components/shell/DeviceShell";
import "./globals.css";

const neueMontreal = localFont({
  variable: "--font-sans",
  src: [
    {
      path: "./fonts/PPNeueMontreal-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/PPNeueMontreal-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "TripUp prototype",
  description: "Interactive prototype of TripUp, a group-trip planning app.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={neueMontreal.variable}>
      <body className="font-sans font-medium text-gunmetal antialiased">
        <DeviceShell>{children}</DeviceShell>
      </body>
    </html>
  );
}
