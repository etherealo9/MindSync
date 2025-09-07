'use client';

import dynamic from 'next/dynamic';
import { NotificationProvider } from '@/lib/notifications/notification-context';
import { AlarmProvider } from '@/lib/alarms/alarm-context';

const PageTransition = dynamic(() => import('@/components/page-transition').then(mod => mod.PageTransition), {
  ssr: false,
});

const PWAProvider = dynamic(() => import('@/components/pwa-provider').then(mod => mod.PWAProvider), {
  ssr: false,
});

export const PWARegister = dynamic(() => import('@/components/pwa-register').then(mod => mod.PWARegister), {
  ssr: false,
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PWAProvider>
      <NotificationProvider>
        <AlarmProvider>
          <PageTransition>{children}</PageTransition>
        </AlarmProvider>
      </NotificationProvider>
    </PWAProvider>
  );
} 