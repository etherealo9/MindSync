'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function PWARegister() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Register service worker
    if ('serviceWorker' in navigator) {
      console.log('Service Worker is supported');
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    } else {
      console.log('Service Worker is not supported');
    }

    // Handle PWA installation
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to show install button
      setIsInstallable(true);
    });

    // Handle already installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setIsInstallable(false);
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA is already installed');
      setIsInstallable(false);
    }
  }, []);

  // Function to handle installation
  const handleInstallClick = () => {
    console.log('Install button clicked', { deferredPrompt });
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null);
      setIsInstallable(false);
    });
  };

  // Don't render anything on server or if not installable
  if (!mounted || !isInstallable || typeof window === 'undefined') return null;

  console.log('PWA Register render', { isInstallable });

  const content = (
    <div className="fixed bottom-20 right-4 z-[99999] pointer-events-auto" style={{ position: 'fixed', zIndex: 99999 }}>
      <button
        onClick={handleInstallClick}
        className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 backdrop-blur-sm border-2 border-primary/20"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.29 7 12 12 20.71 7"/>
          <line x1="12" y1="22" x2="12" y2="12"/>
        </svg>
        <span className="font-medium">Install App</span>
      </button>
    </div>
  );

  // Use createPortal to render outside of any stacking contexts
  const portalRoot = document.getElementById('pwa-root');
  if (!portalRoot) return content;
  
  return createPortal(content, portalRoot);
} 