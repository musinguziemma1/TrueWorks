import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const FB_PIXEL = import.meta.env.VITE_FB_PIXEL as string | undefined;

function loadScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.src = src;
  script.id = id;
  script.async = true;
  document.head.appendChild(script);
}

function initGA() {
  if (!GA_ID || window.gtag) return;
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, 'ga-script');
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

function initFbPixel() {
  if (!FB_PIXEL) return;
  loadScript('https://connect.facebook.net/en_US/fbevents.js', 'fb-pixel-script');
  window.fbq = window.fbq || function () {
    (window.fbq as unknown as { queue: unknown[] }).queue = (window.fbq as unknown as { queue: unknown[] }).queue || [];
    (window.fbq as unknown as { queue: unknown[] }).queue.push(arguments);
  } as unknown as (...args: unknown[]) => void;
  window.fbq('init', FB_PIXEL);
  window.fbq('track', 'PageView');
}

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (GA_ID) initGA();
    if (FB_PIXEL) initFbPixel();
  }, []);

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: location.pathname + location.search });
    }
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);
}

export function trackEvent(action: string, label?: string, value?: number) {
  if (window.gtag) {
    window.gtag('event', action, { event_label: label, value });
  }
  if (window.fbq) {
    window.fbq('track', action, { content_name: label, value });
  }
}
