import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AthleticFlowBackground from "@/components/AthleticFlowBackground";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EDAP Social",
  description: "Transform South African talent via AI coaching and digital literacy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative transition-colors duration-200`}>
        <AthleticFlowBackground />
        <div className="flex-1 flex flex-col relative z-10">
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}

