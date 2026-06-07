import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "../index.css";
import { Providers } from "./Providers";

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export const metadata: Metadata = {
  title: "Gram2City",
  description: "Gram2City",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${urbanist.variable} font-urbanist`}
        suppressHydrationWarning
      >
        <div id="root" className="font-urbanist">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
