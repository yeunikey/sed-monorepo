import "./globals.css";

import Authorize from "@/components/Authorize";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SED маркетплейс",
  description: "Разрабатывается yeunikey.dev",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Suspense>
          <Authorize>
            {children}

            <ToastContainer />
          </Authorize>
        </Suspense>
      </body>
    </html>
  );
}
