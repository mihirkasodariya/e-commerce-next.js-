import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "./(shop)/Header/page";
import Footer from "./(shop)/footer/page";

const poppins = Poppins({
  weight: ["400", "600", "700"], // Optimal weights
  subsets: ["latin-ext", "latin"],
});

export const metadata: Metadata = {
  title: "Mihir Clothing Store - Men's Shirts",
  description: "Discover premium men's shirts at Mihir Clothing Store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
