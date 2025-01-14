import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers";
import { inter } from "./fonts";

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
    <html lang="en" className={inter.variable}>
      <body className="font-[inter]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
