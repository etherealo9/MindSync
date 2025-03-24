"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/lib/supabase/auth-context";
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
      <div className="flex min-h-screen flex-col">
        <Sidebar />
        <Header />
        <main className="flex-1 pb-20 lg:pb-8 lg:pl-[300px] pt-14">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
      <Toaster />
      <AssistantBubble />
    </NotificationProvider>
  );
} 