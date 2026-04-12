import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FilmHub - Discover Your Next Favorite Film",
  description: "Explore thousands of films, share reviews, and connect with fellow movie enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
