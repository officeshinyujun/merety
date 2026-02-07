import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/auth/AuthGuard";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "404bnf team page",
  description: "404bnf team page making by merety",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthGuard>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#26282B',
                color: '#fdfdfe',
                padding: "16px"
              },
            }}
          />
        </AuthGuard>
      </body>
    </html>
  );
}
