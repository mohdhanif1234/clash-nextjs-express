import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Clashing App",
  description: "Get your audience thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-slate-50 font-sans antialiased",
          fontSans.variable
        )}>
          {children}
          <Toaster richColors position="top-right" />
        </body>
    </html>
  );
}
