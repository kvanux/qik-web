import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-[inter]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
