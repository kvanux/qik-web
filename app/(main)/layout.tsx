import Header from "@/components/ui/custom/header/Header";
import Footer from "@/components/ui/custom/footer/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center px-10 min-[360px]:max-[800px]:px-6">
        {children}
      </main>
      <Toaster richColors closeButton theme="light" position="bottom-left" />
      <Footer />
    </div>
  );
}
