'use client';

import { startTransition, useEffect, useOptimistic, useState } from 'react';

import { toast as sonnerToast } from 'sonner';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  description?: string;
  dismiss: () => Promise<void>;
}

const ClientToasts = ({ toasts }: { toasts: Toast[] }): React.JSX.Element | null => {
  const [optimisticToasts, remove] = useOptimistic(toasts, (current, id) =>
    current.filter(toast => toast.id !== id),
  );

  const localToasts = optimisticToasts.map(toast => ({
    ...toast,
    dismiss: async () => {
      remove(toast.id);
      await toast.dismiss();
    },
  }));

  const [sentToSonner, setSentToSonner] = useState<string[]>([]);

  useEffect(() => {
    localToasts
      .filter(toast => !sentToSonner.includes(toast.id))
      .forEach(toast => {
        setSentToSonner(prev => [...prev, toast.id]);
        sonnerToast[toast.type](toast.message, {
          id: toast.id,
          description: toast.description,
          onDismiss: () => startTransition(toast.dismiss),
          onAutoClose: () => startTransition(toast.dismiss),
          position: 'bottom-right',
        });
      });
  }, [localToasts, sentToSonner]);

  return null;
};

export default ClientToasts;
