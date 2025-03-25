'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';

interface SplashScreenProps {
  onFinished?: () => void;
  minimumDisplayTime?: number;
}

export function PwaSplashScreen({
  onFinished,
  minimumDisplayTime = 2000
}: SplashScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinished) onFinished();
    }, minimumDisplayTime);

    return () => clearTimeout(timer);
  }, [minimumDisplayTime, onFinished]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* App logo with pulsing animation */}
        <motion.div
          className="flex items-center justify-center p-4 rounded-2xl bg-black dark:bg-white shadow-lg mb-8"
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.8, 1, 0.8],
            boxShadow: [
              '0 4px 6px rgba(0, 0, 0, 0.5)',
              '0 8px 24px rgba(0, 0, 0, 0.7)',
              '0 4px 6px rgba(0, 0, 0, 0.5)'
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        >
          <Icons.logo className="h-20 w-20 text-accent" />
        </motion.div>

        {/* App name with fade-in */}
        <motion.h1
          className="text-3xl font-bold mb-2 tracking-tight uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          MindSync
        </motion.h1>

        {/* App tagline with fade-in */}
        <motion.p
          className="text-muted-foreground text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Your personal productivity companion
        </motion.p>

        {/* Loading indicator */}
        <motion.div 
          className="mt-8 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-accent"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
} 