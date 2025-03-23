'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// This component provides a way to load scripts with optimal performance
export function ScriptOptimization() {
  // Preconnect to important domains to speed up resource loading
  useEffect(() => {
    // Create preconnect link for Google (for fonts and APIs)
    const googlePreconnect = document.createElement('link');
    googlePreconnect.rel = 'preconnect';
    googlePreconnect.href = 'https://fonts.googleapis.com';
    document.head.appendChild(googlePreconnect);

    // Create preconnect link for Google Fonts CDN
    const gstaticPreconnect = document.createElement('link');
    gstaticPreconnect.rel = 'preconnect';
    gstaticPreconnect.href = 'https://fonts.gstatic.com';
    gstaticPreconnect.crossOrigin = 'anonymous';
    document.head.appendChild(gstaticPreconnect);

    return () => {
      document.head.removeChild(googlePreconnect);
      document.head.removeChild(gstaticPreconnect);
    };
  }, []);

  return (
    <>
      {/* Load critical scripts with priority */}
      <Script
        strategy="afterInteractive"
        id="performance-script"
        dangerouslySetInnerHTML={{
          __html: `
            // Mark the First Contentful Paint time
            document.addEventListener('DOMContentLoaded', function() {
              if (performance && performance.mark) {
                performance.mark('fcp');
              }
            });
            
            // Delay non-critical operations
            const nonCriticalLoad = () => {
              // Load non-critical resources here if needed
              console.log('Non-critical resources loaded');
            };
            
            // Use requestIdleCallback to schedule non-critical work
            if ('requestIdleCallback' in window) {
              requestIdleCallback(nonCriticalLoad, { timeout: 2000 });
            } else {
              setTimeout(nonCriticalLoad, 2000);
            }
          `,
        }}
      />
    </>
  );
} 