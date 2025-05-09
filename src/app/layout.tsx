import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Shop",
  description: "Find the product closest to you",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`bg-white text-black ${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        
        {/* Main content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-blue-700 text-white py-6">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
    {/* Left Section */}
    <div className="text-center md:text-left">
      <h3 className="text-lg font-semibold">SmartShop</h3>
      <p className="text-sm text-gray-400">Find what you need, where you need it.</p>
    </div>

    {/* Center Section - Navigation */}
    <nav className="my-4 md:my-0">
      <ul className="flex gap-6 text-sm">
        <li><a href="/" className="hover:text-gray-300">Home</a></li>
        <li><a href="/admin" className="hover:text-yellow-300 font-semibold">(Dev) Admin</a></li>
        <li><a href="/about" className="hover:text-gray-300">About</a></li>
        <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
      </ul>
    </nav>

    {/* Right Section - Social Media */}
    <div className="flex gap-4">
      <a href="#" className="hover:text-gray-300">🔗 Facebook</a>
      <a href="#" className="hover:text-gray-300">🔗 Twitter</a>
      <a href="#" className="hover:text-gray-300">🔗 Instagram</a>
    </div>
  </div>

  {/* Copyright */}
  <div className="text-center text-gray-500 text-sm mt-4">
    &copy; {new Date().getFullYear()} SmartShop. All rights reserved.
  </div>
</footer>

      </body>
    </html>
  );
}
