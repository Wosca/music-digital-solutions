import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Solutions Music Library",
  description: "Made by Wosca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        <div className="flex flex-col min-h-screen overflow-x-hidden">
          <header className="bg-background border-b shadow-sm sticky top-0 z-10">
            <div className="container px-4 md:px-6 flex items-center h-14">
              <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Home
                </Link>
                <Link
                  href="/search"
                  className="text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Search
                </Link>
                <Link
                  href="/add"
                  className="text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  Add
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
