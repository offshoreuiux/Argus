import React, { createContext, useContext, useState } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const showToast = (title, message, type = "success") => {
    setToast({ visible: true, title, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* 🔥 GLOBAL TOAST RENDERED ONCE */}
      {toast.visible && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}
