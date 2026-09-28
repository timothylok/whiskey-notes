import { ClerkProvider, Show, SignInButton, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  title: { default: "Whiskey Notes", template: "%s · Whiskey Notes" },
  description: "Whiskey tasting notes — nose, palate, finish and rating.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <header className="border-b">
            <nav className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
              <Link href="/" className="font-semibold">
                🥃 Whiskey Notes
              </Link>
              <div className="ml-auto flex items-center gap-3">
                <Link href="/add" className="text-sm hover:underline">
                  Add note
                </Link>
                <Show when="signed-out">
                  <SignInButton>
                    <Button size="sm">Sign in</Button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
