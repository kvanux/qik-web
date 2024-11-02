import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/ui/custom/header/Header";

export const metadata: Metadata = {
  title: "QIK Finance",
  description: "Your Favorite Personal Finance Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased px-10 py-6`}>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
