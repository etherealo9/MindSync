'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function PageTransition({ 
  children
}: { 
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState('');
  const [renderedChildren, setRenderedChildren] = useState(children);

  // Reset loading state when the route changes
  useEffect(() => {
    const url = pathname + searchParams.toString();
    
    if (prevPathname !== '' && prevPathname !== url) {
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        setRenderedChildren(children);
        setIsLoading(false);
      }, 300); // Adjust transition timing as needed
      
      return () => clearTimeout(timer);
    } else {
      setPrevPathname(url);
      setRenderedChildren(children);
    }
  }, [pathname, searchParams, children, prevPathname]);

  return (
    <>
      {/* Page content with fade-in/out animation */}
      <div
        className={cn(
          "transition-all duration-300",
          isLoading ? "opacity-0 scale-[0.99]" : "opacity-100 scale-100"
        )}
      >
        {renderedChildren}
      </div>
      
      {/* Loading overlay - only shown during actual navigation */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      )}
    </>
  );
} 