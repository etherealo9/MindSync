import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex items-center justify-center rounded-xl bg-primary/10 p-6">
          <LoadingSpinner size="lg" />
        </div>
        <h2 className="text-xl font-semibold">Loading</h2>
        <p className="text-sm text-muted-foreground">Please wait while we prepare this page</p>
      </div>
    </div>
  );
} 