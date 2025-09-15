import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { Providers } from "./providers";

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
    <html lang="en" className="">
      <body
        className={`bg-[var(--color-bg)] text-[var(--color-text)] flex h-screen ${rubik.className} antialiased`}
      >
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}
