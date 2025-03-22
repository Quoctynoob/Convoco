// src/app/layout.tsx
import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Convoco - Practice Structured Debates with AI Moderation",
  description: "Real-time debate platform with AI fact-checking and moderation",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
