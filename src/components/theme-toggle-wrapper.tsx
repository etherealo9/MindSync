'use client';

import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('./theme-toggle').then(mod => mod.ThemeToggle), {
  ssr: false,
  loading: () => <div className="h-9 w-9 rounded-md animate-pulse bg-muted"></div>,
});

export default function ThemeToggleWrapper() {
  return <ThemeToggle />;
} 