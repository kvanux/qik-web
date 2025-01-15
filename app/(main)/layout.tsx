import Header from "@/components/ui/custom/header/Header";
import Footer from "@/components/ui/custom/footer/Footer";
import { Toaster } from "@/components/ui/sonner";
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

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col justify-center px-10 scroll-smooth ${inter.variable} ${manrope.variable} font-[inter] min-[360px]:max-[800px]:px-6`}
    >
      <Header />
      <>{children}</>
      <Toaster richColors closeButton theme="light" position="bottom-left" />
      <Footer />
    </div>
  );
}
