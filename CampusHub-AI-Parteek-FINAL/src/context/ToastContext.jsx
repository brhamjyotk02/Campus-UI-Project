import { createContext, useCallback, useContext, useState } from "react";
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "success") => { setToast({ message, type }); }, []);
  const hideToast = useCallback(() => setToast(null), []);
  return <ToastContext.Provider value={{ showToast, hideToast }}>
    {children}
    {toast && <div className={`campus-toast ${toast.type}`} role="status"><span>{toast.message}</span><button onClick={hideToast} aria-label="Close notification">×</button></div>}
  </ToastContext.Provider>;
}
export function useToast() { return useContext(ToastContext); }
