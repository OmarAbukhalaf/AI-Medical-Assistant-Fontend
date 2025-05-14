
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';


type ToastType = "success" | "error" | "default";

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastType;
}

interface ToastContextType {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, variant = "default" }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2);
    const newToast = { id, title, description, variant };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id);
    }, 5000);
    
    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="toast-container">
        {toasts.map(({ id, title, description, variant = "default" }) => (
          <div 
            key={id} 
            className={`toast ${variant === "success" ? "success" : variant === "error" ? "error" : ""}`}
          >
            <div className="toast-title">{title}</div>
            {description && <div className="toast-description">{description}</div>}
            <button 
              onClick={() => dismiss(id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              style={{ fontSize: '10px', background: 'none' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
