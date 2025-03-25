'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';

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
      }, 400); // Slightly longer for smoother transition
      
      return () => clearTimeout(timer);
    } else {
      setPrevPathname(url);
      setRenderedChildren(children);
    }
  }, [pathname, searchParams, children, prevPathname]);

  return (
    <>
      {/* Page content with fade-in/out and scale animation */}
      <div
        className={cn(
          "transition-all duration-400 ease-in-out transform",
          isLoading ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
        )}
      >
        {renderedChildren}
      </div>
      
      {/* Loading overlay with brand-consistent animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
          >
            <div className="relative">
              {/* Background shape */}
              <motion.div
                className="absolute inset-0 bg-black dark:bg-white rounded-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Logo */}
              <motion.div
                className="relative p-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icons.logo className="h-12 w-12 text-accent" />
              </motion.div>

              {/* Loading dots */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-accent"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 