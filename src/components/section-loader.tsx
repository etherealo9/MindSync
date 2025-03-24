'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionLoaderProps {
  className?: string;
  variant?: "default" | "card" | "grid";
  count?: number;
  height?: string;
}

export function SectionLoader({
  className,
  variant = "default",
  count = 3,
  height = "h-20"
}: SectionLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const loadingVariants = {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Default skeleton for text content
  if (variant === "default") {
    return (
      <div className={cn("space-y-4", className)}>
        {items.map((i) => (
          <motion.div
            key={i}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={loadingVariants}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className={cn("bg-muted/70 rounded-md w-full", height)}
          />
        ))}
      </div>
    );
  }

  // Card-like skeleton
  if (variant === "card") {
    return (
      <div className={cn("grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3", className)}>
        {items.map((i) => (
          <motion.div
            key={i}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={loadingVariants}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="bg-card rounded-lg border shadow-sm p-4 h-48"
          >
            <div className="space-y-3">
              <div className="bg-muted/70 h-4 w-3/4 rounded-sm" />
              <div className="bg-muted/70 h-4 w-1/2 rounded-sm" />
              <div className="bg-muted/70 h-24 w-full rounded-md mt-4" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Grid skeleton
  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
        {items.map((i) => (
          <motion.div
            key={i}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={loadingVariants}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="bg-muted/70 aspect-square rounded-md"
          />
        ))}
      </div>
    );
  }

  return null;
} 