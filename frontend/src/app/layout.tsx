import "./globals.css";

import Authorize from "@/components/Authorize";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Исскуственный Интеллект для Департамента Маркетинга",
  description: "Разработано yeunikey.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >

        <ToastContainer position="bottom-right" />

        <Authorize>
          {children}
        </Authorize>
      </body>
    </html>
  );
}
