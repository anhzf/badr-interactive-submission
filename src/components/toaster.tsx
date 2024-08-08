'use client';

import { cn } from '@/utils/ui';
import { createContext, useContext, useState, type ReactNode } from 'react';

const TOAST_DURATION = 10_000;

interface Toast {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  /** in milliseconds */
  timeout?: number;
}

const ToastContext = createContext<{ queue: Record<string, Toast>, toast(opts: Toast): void }>({
  queue: {},
  toast: () => { },
});

export function useToaster() {
  const { toast } = useContext(ToastContext);
  return toast;
}

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [queue, setToasts] = useState<Record<string, Toast>>({});
  const toast = (opts: Toast) => {
    const id = Date.now().toString();
    const entry = { ...opts, timeout: opts.timeout ?? TOAST_DURATION };
    setToasts({ ...queue, [id]: entry });

    setTimeout(() => {
      setToasts((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }, entry.timeout);
  };
  return (
    <ToastContext.Provider value={{ queue, toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export default function Toaster() {
  const { queue: toasts } = useContext(ToastContext);

  return (
    <div className="fixed top-20 right-4 h-min flex flex-col gap-2 overflow-hidden">
      {Object.values(toasts).map((toast, i) => (
        <div key={i} className={cn(
          'p-4 rounded shadow-md border-l-4 animate-in slide-in-from-right fade-in duration-500',
          {
            'bg-secondary text-on-secondary border-primary': toast.type === 'info',
            'bg-success-bg text-white border-success-darken': toast.type === 'success',
            'bg-amber-400 text-gray-900 border-amber-800': toast.type === 'warning',
            'bg-error-bg text-white border-error-darken': toast.type === 'error',
          },
        )}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}