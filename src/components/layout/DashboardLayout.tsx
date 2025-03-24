"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/lib/supabase/auth-context";
import { DebugAuth } from "@/components/debug-auth";
import { NotificationProvider } from "@/lib/notifications/notification-context";
import AssistantBubble from "@/components/ai/AssistantBubble";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle authentication
  useEffect(() => {
    if (!isLoading && !user && mounted) {
      router.push("/auth/sign-in");
    }
  }, [isLoading, user, router, mounted]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2 text-foreground">Loading...</div>
          <p className="text-muted-foreground">Please wait while we retrieve your account information</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Let the redirect handle it
  }

  return (
    <NotificationProvider>
      <div className="flex min-h-screen flex-col lg:flex-row bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-[300px]">
          <Header />
          <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 pb-20 lg:pb-8">
            <div className="mx-auto max-w-6xl w-full">
              {children}
            </div>
          </main>
          <BottomNav />
        </div>
        <Toaster />
        <AssistantBubble />
      </div>
    </NotificationProvider>
  );
} 