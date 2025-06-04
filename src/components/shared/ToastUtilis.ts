
import { toast } from 'react-hot-toast';
import type { ToastOptions } from 'react-hot-toast';

export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, options);
};

export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, options);
};

export const showLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, options);
};

export const dismissToast = (toastId?: string) => {
  toast.dismiss(toastId);
};

export const showPromiseToast = <T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: string;
    error: string;
  },
  options?: ToastOptions
) => {
  return toast.promise(promise, {
    loading,
    success,
    error,
  }, options);
};