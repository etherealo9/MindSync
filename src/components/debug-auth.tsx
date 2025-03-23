"use client";

import { useAuth } from "@/lib/supabase/auth-context";

export function DebugAuth() {
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Loading authentication state...</div>;
  }

  return (
    <div className="p-4 bg-blue-100 text-blue-800 rounded">
      <h3 className="font-bold">Auth Debug Info</h3>
      <div>
        <strong>Authenticated:</strong> {user ? "Yes" : "No"}
      </div>
      <div>
        <strong>User Email:</strong> {user?.email || "Not signed in"}
      </div>
      <div>
        <strong>Session:</strong> {session ? "Active" : "None"}
      </div>
    </div>
  );
} 