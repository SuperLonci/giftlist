import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  position: ToastPosition;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function addToast(
    message: string,
    type: ToastType = 'info',
    duration: number = 3000,
    position: ToastPosition = 'top-center'
  ) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, duration, position };

    update(toasts => [...toasts, toast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }

  function removeToast(id: string) {
    update(toasts => toasts.filter(toast => toast.id !== id));
  }

  return {
    subscribe,
    info: (message: string, duration?: number, position?: ToastPosition) => 
      addToast(message, 'info', duration, position),
    success: (message: string, duration?: number, position?: ToastPosition) => 
      addToast(message, 'success', duration, position),
    warning: (message: string, duration?: number, position?: ToastPosition) => 
      addToast(message, 'warning', duration, position),
    error: (message: string, duration?: number, position?: ToastPosition) => 
      addToast(message, 'error', duration, position),
    remove: removeToast
  };
}

export const toasts = createToastStore();
