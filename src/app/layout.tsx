import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PearlCare AI Dental Assistant",
  description: "Dental clinic website assistant with chat, lead capture, and admin dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
