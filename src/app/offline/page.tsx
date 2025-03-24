import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">You're Offline</h1>
          <p className="text-lg text-muted-foreground">
            Please check your internet connection and try again.
          </p>
        </div>
        
        <div className="p-6 border-2 border-black dark:border-white rounded-lg bg-accent/10">
          <p className="text-sm">
            MindSync requires an internet connection to sync your data and provide AI features.
          </p>
        </div>

        <div className="flex justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 