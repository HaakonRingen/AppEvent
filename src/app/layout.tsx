import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { LanguageProvider } from "../context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: "#ebf5ff",
          minHeight: "100vh",
          width: "100%",
          height: "100%",
        }}
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex justify-center">
            <div className="w-full">
              {children}
              {/* Dette er hvor sidene dine vises */}
            </div>
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
