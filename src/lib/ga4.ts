export function trackGA4(eventName: string, params: Record<string, any>) {
  if (typeof window === "undefined") return; // server side guard
  // gtag.js is loaded in _app.tsx
  (window as any).gtag('event', eventName, params);
}
