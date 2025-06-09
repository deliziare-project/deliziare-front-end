'use client';

import { useEffect } from 'react';

export default function DeliveryPage() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  }, []);

  return (
    <main>
      <h1>Delivery Module</h1>
    </main>
  );
}
