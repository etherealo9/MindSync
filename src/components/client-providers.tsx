'use client';

import dynamic from 'next/dynamic';

const PageTransition = dynamic(() => import('@/components/page-transition').then(mod => mod.PageTransition), {
  ssr: false,
});

const PWAProvider = dynamic(() => import('@/components/pwa-provider').then(mod => mod.PWAProvider), {
  ssr: false,
});

const PWARegister = dynamic(() => import('@/components/pwa-register').then(mod => mod.PWARegister), {
  ssr: false,
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PWAProvider>
      <PageTransition>{children}</PageTransition>
      <PWARegister />
    </PWAProvider>
  );
} 