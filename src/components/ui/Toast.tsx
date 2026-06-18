import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastMessage {
  id: number;
  message: string;
}

export const ToastContainer = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Mark component as mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handler = (e: CustomEvent<{ message: string }>) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: e.detail.message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('cart-toast', handler as EventListener);
    return () => window.removeEventListener('cart-toast', handler as EventListener);
  }, [isMounted]);

  // Don't render anything on the server
  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  const portalContent = (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 flex flex-col gap-2 items-center">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="px-4 py-3 shadow-md border-2 rounded-xl"
          style={{
            background: 'var(--ui-panel)',
            borderColor: 'var(--brand-primary)',
            color: 'var(--ui-text)',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );

  // Only use portal on the client
  return createPortal(portalContent, document.body);
};