'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PwaSplashScreen } from './pwa-splash-screen';

type PWAContextType = {
  isPWA: boolean;
  isLoading: boolean;
};

const PWAContext = createContext<PWAContextType>({
  isPWA: false,
  isLoading: true,
});

export const usePWA = () => useContext(PWAContext);

interface PWAProviderProps {
  children: React.ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isPWA, setIsPWA] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if app is running as PWA on mount
  useEffect(() => {
    // Check if app is installed - launched from home screen
    const isInStandaloneMode = () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    if (isInStandaloneMode()) {
      setIsPWA(true);
    }

    // Even if not in PWA mode, we want to hide the splash screen after a moment
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PWAContext.Provider value={{ isPWA, isLoading }}>
      {isPWA && isLoading ? (
        <PwaSplashScreen onFinished={() => setIsLoading(false)} />
      ) : null}
      {children}
    </PWAContext.Provider>
  );
} 