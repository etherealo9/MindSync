"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/lib/supabase/auth-context";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  const { user, session, isLoading: authLoading, forceRedirectToDashboard } = useAuth();
  const redirectAttempted = useRef(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Force redirect if we're still on the sign-in page after a certain time
  useEffect(() => {
    if (session && !window.location.pathname.includes('dashboard')) {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      
      // Force navigate to dashboard after 2 seconds if still on sign-in page
      redirectTimeoutRef.current = setTimeout(() => {
        console.log("Force redirecting to dashboard via window.location");
        window.location.href = "/dashboard";
      }, 2000);
    }
    
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [session]);

  // Debug the auth state (but limit refreshes)
  useEffect(() => {
    // Only update debug info if something changed
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const debugMessage = `
      Current URL: ${currentUrl}
      Auth Loading: ${authLoading}
      Session: ${session ? 'Yes' : 'No'}
      User: ${user ? user.email : 'None'}
      Redirect Attempted: ${redirectAttempted.current}
    `;
    
    console.log("SignIn Debug:", debugMessage);
    setDebugInfo(debugMessage);
    
    // Clear any redirect_count cookie that might be causing issues
    document.cookie = "redirect_count=0; path=/;";
  }, [authLoading, session, user]);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (session && !redirectAttempted.current) {
      console.log("User already authenticated, redirecting to dashboard");
      redirectAttempted.current = true;
      
      try {
        // Try Next.js router first
        router.push("/dashboard");
        
        // Also set a fallback direct navigation
        setTimeout(() => {
          if (window.location.pathname.includes('sign-in')) {
            console.log("Router navigation failed, using direct navigation");
            window.location.href = "/dashboard";
          }
        }, 1000);
      } catch (error) {
        console.error("Navigation error:", error);
        // Fall back to direct navigation
        window.location.href = "/dashboard";
      }
    }
  }, [session, router]);

  // Handle successful login with a timer to ensure auth state is updated
  useEffect(() => {
    if (loginSuccess && !redirectAttempted.current) {
      console.log("Login successful, redirecting to dashboard");
      redirectAttempted.current = true;
      
      try {
        // Try Next.js router first
        router.push("/dashboard");
        
        // Also set a fallback direct navigation
        setTimeout(() => {
          if (window.location.pathname.includes('sign-in')) {
            console.log("Router navigation failed, using direct navigation");
            window.location.href = "/dashboard";
          }
        }, 1000);
      } catch (error) {
        console.error("Navigation error:", error);
        // Fall back to direct navigation
        window.location.href = "/dashboard";
      }
    }
  }, [loginSuccess, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoading || loginSuccess) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      console.log("Authentication successful:", data);
      toast.success("Successfully signed in!");
      setLoginSuccess(true);
      
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Debug info display */}
      {debugInfo && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded w-full max-w-md whitespace-pre-wrap">
          <h3 className="font-bold">Debug Information</h3>
          <pre className="text-xs">{debugInfo}</pre>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              // Use the robust redirect method
              forceRedirectToDashboard();
            }}
          >
            Force Dashboard Redirect
          </Button>
        </div>
      )}
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your email and password to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading || loginSuccess}>
                {isLoading ? "Signing in..." : loginSuccess ? "Redirecting..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 