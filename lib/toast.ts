import { toast } from 'sonner';

export function notifySuccess(message: string, options?: { description?: string }) {
  toast.success(message, options);
}

export function notifyError(message: string, options?: { description?: string }) {
  toast.error(message, options);
}

export function notifyInfo(message: string, options?: { description?: string }) {
  toast.info(message, options);
}
