import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

export default function Toast({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles =
      "flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300 transform";
    const visibilityStyles =
      isVisible && !isLeaving
        ? "translate-x-0 opacity-100"
        : isLeaving
        ? "translate-x-full opacity-0"
        : "translate-x-full opacity-0";

    switch (toast.type) {
      case "success":
        return `${baseStyles} ${visibilityStyles} bg-green-50 border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} ${visibilityStyles} bg-red-50 border-red-200 text-red-800`;
      case "warning":
        return `${baseStyles} ${visibilityStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case "info":
        return `${baseStyles} ${visibilityStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} ${visibilityStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  const getIcon = () => {
    const iconClass = "h-5 w-5 flex-shrink-0 mt-0.5";
    switch (toast.type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case "error":
        return <XCircle className={`${iconClass} text-red-600`} />;
      case "warning":
        return <AlertCircle className={`${iconClass} text-yellow-600`} />;
      case "info":
        return <Info className={`${iconClass} text-blue-600`} />;
      default:
        return <Info className={`${iconClass} text-gray-600`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="ml-3 flex-1">
        <h4 className="text-sm font-medium">{toast.title}</h4>
        {toast.message && (
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="ml-4 flex-shrink-0 rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
