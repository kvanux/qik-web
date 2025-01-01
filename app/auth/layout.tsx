import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  fallback: ["Roboto", "Segoe UI"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-[inter] min-h-screen`}>
      {children}
    </div>
  );
}
