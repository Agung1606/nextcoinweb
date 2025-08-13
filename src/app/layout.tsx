import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const rubik = Rubik({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Next Coin",
  description: "Monitor crypto prices with NextCoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex h-screen ${rubik.className} antialiased`}
      >
        {/* left sidebar */}
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
