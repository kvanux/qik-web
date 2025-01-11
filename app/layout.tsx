import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./auth/Provider";
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
  description:
    "Bắt đầu hành trình làm chủ tài chính của bạn ngay hôm nay với công cụ quản lý tài chính cá nhân đắt lực",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} font-[inter]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
