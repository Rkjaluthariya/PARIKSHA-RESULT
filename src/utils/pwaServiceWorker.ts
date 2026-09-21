/**
 * PWA Service Worker & Push Notification Utility
 * For Pariksha Result 2026
 */

export interface NotificationStatus {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  subscribed: boolean;
  swRegistered: boolean;
}

let deferredInstallPrompt: any = null;

// Listen for PWA BeforeInstallPrompt Event
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
}

/**
 * Register Service Worker for PWA Caching & Push Notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  // If in dev environment or iframe preview (e.g. Google AI Studio live preview container),
  // proactively unregister any lingering service workers to guarantee zero white-screen or stale cache issues.
  const isIframe = window.self !== window.top;
  const isDevHost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname.includes('run.app');

  if (isIframe || isDevHost) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }
    } catch (e) {
      console.warn('SW cleanup in preview environment:', e);
    }
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    // Check for SW updates
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            installingWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        };
      }
    };

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Get current Push Notification permission and SW status
 */
export function getNotificationStatus(): NotificationStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      supported: false,
      permission: 'unsupported',
      subscribed: false,
      swRegistered: false
    };
  }

  const isSubscribed = localStorage.getItem('pariksha_push_subscribed') === 'true';
  const hasSW = 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;

  return {
    supported: true,
    permission: Notification.permission,
    subscribed: isSubscribed && Notification.permission === 'granted',
    swRegistered: hasSW
  };
}

/**
 * Request Push Notification Permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    alert('Push Notifications are not supported by your current browser.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      localStorage.setItem('pariksha_push_subscribed', 'true');
      
      // Trigger a welcome test push notification
      await sendTestPushNotification({
        title: '🔔 Pariksha Result Notifications Activated!',
        body: 'You will now receive real-time alerts for new Sarkari Jobs, Exam Results & Admit Cards!',
        url: '/'
      });
      return true;
    } else if (permission === 'denied') {
      localStorage.setItem('pariksha_push_subscribed', 'false');
      alert('Notification permissions were blocked. Please enable permissions in your browser settings to receive job alerts.');
      return false;
    }
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Unsubscribe from Push Notifications
 */
export function unsubscribeNotifications(): void {
  localStorage.setItem('pariksha_push_subscribed', 'false');
}

/**
 * Send a test or broad push notification using Service Worker or Native Notification API
 */
export async function sendTestPushNotification(data: { title: string; body: string; url?: string }): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Cannot send notification: permission not granted.');
    return false;
  }

  // Try via Service Worker Registration if active
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg) {
        reg.showNotification(data.title, {
          body: data.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [200, 100, 200],
          data: { url: data.url || '/' },
          tag: 'sarkari-result-alert',
          actions: [
            { action: 'open', title: 'Open Pariksha Result' }
          ]
        } as any);
        return true;
      }
    } catch (e) {
      console.warn('Fallback to standard Notification API:', e);
    }
  }

  // Fallback to standard Notification constructor
  try {
    const notif = new Notification(data.title, {
      body: data.body,
      icon: '/favicon.ico'
    } as NotificationOptions);
    notif.onclick = () => {
      window.focus();
      if (data.url) window.location.href = data.url;
    };
    return true;
  } catch (err) {
    console.error('Failed to dispatch notification:', err);
    return false;
  }
}

/**
 * Prompt PWA Installation if available
 */
export async function promptPWAInstall(): Promise<boolean> {
  if (!deferredInstallPrompt) {
    alert('To install Pariksha Result PWA:\n• Desktop: Click the install icon in your browser address bar.\n• Mobile: Tap browser menu (⋮) -> "Add to Home Screen".');
    return false;
  }

  try {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return outcome === 'accepted';
  } catch (err) {
    console.error('PWA install prompt error:', err);
    return false;
  }
}

/**
 * Check if app is running in standalone PWA mode
 */
export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
}
