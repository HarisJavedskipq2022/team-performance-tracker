"use client";

import { ToastData } from "@/components/ui/Toast";
import ToastContainer from "@/components/ui/ToastContainer";
import { createContext, ReactNode, useContext, useState } from "react";

interface ToastContextType {
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (title: string, message?: string) => {
    addToast({ type: "success", title, message });
  };

  const showError = (title: string, message?: string) => {
    addToast({ type: "error", title, message, duration: 7000 });
  };

  const showWarning = (title: string, message?: string) => {
    addToast({ type: "warning", title, message });
  };

  const showInfo = (title: string, message?: string) => {
    addToast({ type: "info", title, message });
  };

  const value: ToastContextType = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
}
