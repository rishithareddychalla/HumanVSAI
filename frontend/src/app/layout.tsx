import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TruthLens AI",
  description: "Learn to identify AI-generated content through an interactive game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col relative bg-background text-foreground overflow-x-hidden`}>
        {/* Background Noise */}
        <div className="fixed inset-0 z-0 bg-noise pointer-events-none"></div>
        
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
