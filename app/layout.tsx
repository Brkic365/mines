import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import localFont from 'next/font/local'

const avenir = localFont({
  src: [
    {
      path: '../public/fonts/Avenir-next-lt-pro/AvenirNextLTPro-Regular.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Avenir-next-lt-pro/AvenirNextLTPro-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter', // Optional: for CSS variables
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mines",
  description: "Simple Mines Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${avenir.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
