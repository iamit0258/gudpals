
import { ToastActionElement } from "@/components/ui/toast";

// Toast data structure matching what's expected in the UI
export interface ToastData {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: ToastActionElement;
}

// Interface for the toast utility
export interface ToastInterface {
  toast: (props: ToastData) => { 
    id: string; 
    dismiss: () => void; 
    update: (props: any) => void;
  };
  dismiss?: (toastId?: string) => void;
  toasts?: any[];
}

// Helper function to safely use toast
export const createToastHelper = (toastUtil: ToastInterface) => {
  return (props: ToastData) => {
    // Check if toastUtil has a toast function
    if (toastUtil && typeof toastUtil.toast === 'function') {
      toastUtil.toast(props);
    }
  };
};
