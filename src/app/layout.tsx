// src/app/layout.tsx
import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DebateAI - Practice Structured Debates with AI Moderation",
  description: "Real-time debate platform with AI fact-checking and moderation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
