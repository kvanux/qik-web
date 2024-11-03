import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/custom/header/Header";
import { Inter, Manrope } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  fallback: ["Roboto", "Segoe UI"],
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  fallback: ["Roboto", "Segoe UI"],
});

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
      <body className={`${inter.variable} font-[inter] antialiased px-10 py-6`}>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
