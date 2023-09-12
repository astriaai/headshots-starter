import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Headshots AI",
  description: "Generate awesome headshots in minutes using AI",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <section className="">
          <Navbar />
        </section>
        <main className="flex flex-1 flex-col items-center pb-16">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
