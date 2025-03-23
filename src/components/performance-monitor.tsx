'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production to avoid development overhead
    if (process.env.NODE_ENV !== 'production') return;

    let dataSent = false;

    const sendPerformanceMetrics = () => {
      if (dataSent) return;
      dataSent = true;

      // Get performance metrics
      if (window.performance) {
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintTiming = performance.getEntriesByType('paint');
        const firstPaint = paintTiming.find(entry => entry.name === 'first-paint')?.startTime;
        const firstContentfulPaint = paintTiming.find(entry => entry.name === 'first-contentful-paint')?.startTime;

        // Calculate key metrics
        const timeToFirstByte = navigationTiming?.responseStart - navigationTiming?.requestStart;
        const domContentLoaded = navigationTiming?.domContentLoadedEventEnd - navigationTiming?.fetchStart;
        const windowLoad = navigationTiming?.loadEventEnd - navigationTiming?.fetchStart;

        // Log performance metrics
        console.log('Performance Metrics:', {
          timeToFirstByte: Math.round(timeToFirstByte),
          firstPaint: Math.round(firstPaint || 0),
          firstContentfulPaint: Math.round(firstContentfulPaint || 0),
          domContentLoaded: Math.round(domContentLoaded),
          windowLoad: Math.round(windowLoad),
        });

        // You can also send these metrics to your analytics service
        // Example: sendToAnalytics({ timeToFirstByte, firstPaint, etc });
      }
    };

    // After the page has loaded, send the performance metrics
    if (document.readyState === 'complete') {
      sendPerformanceMetrics();
    } else {
      window.addEventListener('load', sendPerformanceMetrics);
    }

    // Also collect metrics on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        setTimeout(sendPerformanceMetrics, 1000);
      }
    });

    return () => {
      window.removeEventListener('load', sendPerformanceMetrics);
      document.removeEventListener('visibilitychange', sendPerformanceMetrics);
    };
  }, []);

  return null; // This component doesn't render anything visible
} 