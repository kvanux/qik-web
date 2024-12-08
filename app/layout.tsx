import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/custom/header/Header";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/ui/custom/footer/Footer";
import AuthProvider from "./auth/Provider";

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
      <AuthProvider>
        <body
          className={`${inter.variable} font-[inter] antialiased flex flex-col justify-center px-10`}
        >
          <Header />
          {children}
          <Toaster
            richColors
            closeButton
            theme="light"
            position="bottom-left"
          />
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
