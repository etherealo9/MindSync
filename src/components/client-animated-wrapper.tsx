'use client';

import { useEffect, useState } from 'react';

interface AnimatedWrapperProps {
  children: React.ReactNode;
}

export function ClientAnimatedWrapper({ children }: AnimatedWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // First ensure we're mounted on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Then handle the loading animation
  useEffect(() => {
    if (isMounted) {
      // Force a layout calculation before showing content
      document.body.offsetHeight;
      
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  // If not mounted yet, provide a non-shifting placeholder
  if (!isMounted) {
    return <div style={{ minHeight: '100vh' }} />;
  }

  return (
    <div 
      className={`transition-opacity duration-300 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </div>
  );
} 