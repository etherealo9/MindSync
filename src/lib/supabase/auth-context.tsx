"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "./client";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  forceRedirectToDashboard: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const router = useRouter();
  const lastRedirectTime = useRef<number>(0);

  // Function to safely redirect to dashboard
  const forceRedirectToDashboard = () => {
    const now = Date.now();
    // Prevent multiple redirects within 2 seconds
    if (now - lastRedirectTime.current < 2000) {
      return;
    }
    
    lastRedirectTime.current = now;
    console.log("Force redirecting to dashboard");
    
    try {
      // Try to use the router first
      router.push("/dashboard");
      
      // Fallback to window location if needed
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location.pathname.includes('auth')) {
          console.log("Using window.location for dashboard redirect");
          window.location.href = "/dashboard";
        }
      }, 500);
    } catch (error) {
      console.error("Navigation error:", error);
      // Last resort
      if (typeof window !== 'undefined') {
        window.location.href = "/dashboard";
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const setData = async () => {
      try {
        console.log("Auth context - Initial load");
        setIsLoading(true);
        
        // Get session and refresh if needed
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        if (mounted) {
          console.log("Auth context - Session loaded:", session ? "Session found" : "No session");
          
          if (session) {
            // Refresh token if needed
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.warn("Failed to refresh token:", refreshError);
            } else if (refreshData.session) {
              console.log("Auth context - Token refreshed");
              setSession(refreshData.session);
              setUser(refreshData.session?.user ?? null);
            } else {
              setSession(session);
              setUser(session?.user ?? null);
            }
          } else {
            setSession(null);
            setUser(null);
          }
          
          setIsLoading(false);
          setInitialLoadComplete(true);
        }
      } catch (error) {
        console.error("Error setting data:", error);
        if (mounted) {
          setIsLoading(false);
          setInitialLoadComplete(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          console.log("Auth state changed:", event, session ? "Session exists" : "No session");
          
          setSession(session);
          setUser(session?.user ?? null);
          
          // Handle sign in event - only redirect on actual SIGNED_IN event, not initial load
          if (event === 'SIGNED_IN' && session && initialLoadComplete) {
            console.log("User signed in, redirecting to dashboard");
            
            // Use pathname to check current location
            const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
            if (pathname.startsWith('/auth')) {
              forceRedirectToDashboard();
            }
          }
          
          // Handle sign out event
          if (event === 'SIGNED_OUT') {
            console.log("User signed out");
            // Clear any redirect cookies
            if (typeof document !== 'undefined') {
              document.cookie = "redirect_count=0; path=/;";
            }
          }
        }
      }
    );

    setData();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialLoadComplete]); // Only include necessary dependencies, removed router to avoid rerenders

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      if (typeof document !== 'undefined') {
        document.cookie = "redirect_count=0; path=/;";
      }
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    forceRedirectToDashboard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 