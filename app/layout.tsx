import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata = {
  title: "Headshots AI",
  description: "Generate awesome headshots in minutes using AI",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <section>
          <Navbar />
        </section>
        <main className="flex flex-1 flex-col items-center py-16">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
