/**
 * ToastContext — sistem notifikasi singkat di pojok kanan bawah.
 * Dipanggil lewat useToast().showToast("pesan", "success|info|warn|error")
 * Toast hilang otomatis setelah ~2.8 detik.
 */
import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  // Daftar toast yang sedang tampil
  const [toasts, setToasts] = useState([]);

  /** Hapus toast berdasarkan id */
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Tampilkan toast baru.
   * @param {string} message - teks notifikasi
   * @param {"success"|"info"|"warn"|"error"} type - jenis/warna toast
   */
  const showToast = useCallback(
    (message, type = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      // Auto-dismiss
      window.setTimeout(() => dismiss(id), 2800);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Area tampilan toast (fixed di kanan bawah) */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[min(360px,calc(100vw-2rem))]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              rounded-lg border px-3.5 py-2.5 text-[0.8rem] font-medium shadow-sm
              backdrop-blur-md toast-enter
              ${
                toast.type === "error"
                  ? "bg-white/95 border-hydro-danger/40 text-hydro-danger"
                  : toast.type === "warn"
                    ? "bg-white/95 border-hydro-warn/40 text-hydro-warn"
                    : toast.type === "info"
                      ? "bg-white/95 border-hydro-accent/50 text-hydro-primary"
                      : "bg-white/95 border-hydro-primary/30 text-hydro-primary"
              }
            `}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Hook untuk menampilkan toast dari halaman/komponen */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: () => {} };
  }
  return ctx;
}
