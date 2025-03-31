import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Suspense } from "react";
import AnnouncementBar from "@/components/homepage/announcement-bar"
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/homepage/theme-provider"
import { validateConfig } from "@/lib/config";

// Validate configuration at app initialization
validateConfig();

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Headshots AI",
  description: "Generate awesome headshots in minutes using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnnouncementBar />
          {/* Remove the section wrapper as it's interfering with sticky positioning */}
          <Suspense
            fallback={
              <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container h-16" />
              </div>
            }
          >
            <Navbar />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
