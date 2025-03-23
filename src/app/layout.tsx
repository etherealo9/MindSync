import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/themes.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { ScriptOptimization } from "@/components/script-optimization";
import { PerformanceMonitor } from "@/components/performance-monitor";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
};

export const metadata: Metadata = {
  title: "MindSync - Personal Productivity App",
  description: "A mobile-first personal productivity web application combining task management, journaling, and reflection capabilities.",
  other: {
    'Cache-Control': 'public, max-age=3600, must-revalidate',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MindSync',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${spaceGrotesk.variable} font-space-grotesk antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" />
            <ScriptOptimization />
            <PerformanceMonitor />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
