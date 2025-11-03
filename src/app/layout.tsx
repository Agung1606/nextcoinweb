import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const rubik = Rubik({ subsets: ["latin"]})

// bg-[#0D1421]

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
        className={`bg-[#020a18] text-[#E0E0E0] flex h-screen ${rubik.className} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
