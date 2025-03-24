import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Offline() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z"
              fill="currentColor"
            />
            <path
              d="M20 18C20 19.1046 19.1046 20 18 20C16.8954 20 16 19.1046 16 18C16 16.8954 16.8954 16 18 16C19.1046 16 20 16.8954 20 18Z"
              fill="currentColor"
            />
            <path
              d="M10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold">You're offline</h1>
        
        <p className="text-muted-foreground">
          It looks like you've lost your internet connection. 
          MindSync works offline, but some features may be limited.
        </p>
        
        <div className="pt-4">
          <LoadingSpinner size="sm" text="Waiting for connection..." />
        </div>
        
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
} 