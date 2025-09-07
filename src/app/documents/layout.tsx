'use client';

import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface DocumentsLayoutProps {
  children: ReactNode;
}

export default function DocumentsLayout({ children }: DocumentsLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 