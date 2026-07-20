/**
 * ToastContext.jsx — sistem notifikasi singkat di tengah layar.
 *
 * Untuk apa:
 * - Feedback aksi user (simpan setting, toggle perangkat, apply AI, dll)
 * - Pemakaian: useToast().showToast("pesan", "success|info|warn|error|failed")
 * - Hilang otomatis ~2.6 detik (tanpa tombol tutup)
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

const ToastContext = createContext(null);

const ALERT_META = {
  success: {
    title: "Berhasil",
    Icon: CheckCircle2,
    iconWrap: "bg-hydro-accent-soft text-hydro-primary",
    titleColor: "text-hydro-primary",
    iconAnim: "alert-icon-success",
  },
  info: {
    title: "Informasi",
    Icon: Info,
    iconWrap: "bg-hydro-accent-soft text-hydro-primary",
    titleColor: "text-hydro-primary",
    iconAnim: "alert-icon-info",
  },
  warn: {
    title: "Peringatan",
    Icon: AlertTriangle,
    iconWrap: "bg-amber-50 text-hydro-warn",
    titleColor: "text-hydro-warn",
    iconAnim: "alert-icon-warn",
  },
  error: {
    title: "Gagal",
    Icon: XCircle,
    iconWrap: "bg-red-50 text-hydro-danger",
    titleColor: "text-hydro-danger",
    iconAnim: "alert-icon-error",
  },
  failed: {
    title: "Gagal",
    Icon: XCircle,
    iconWrap: "bg-red-50 text-hydro-danger",
    titleColor: "text-hydro-danger",
    iconAnim: "alert-icon-error",
  },
};

export function ToastProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const dismiss = useCallback(() => {
    setAlert(null);
  }, []);

  /**
   * Tampilkan pemberitahuan tengah layar.
   * @param {string} message
   * @param {"success"|"info"|"warn"|"error"|"failed"} type
   */
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    const normalized =
      type === "failed"
        ? "failed"
        : type === "error"
          ? "error"
          : type === "warn" || type === "info" || type === "success"
            ? type
            : "info";

    setAlert({ id, message, type: normalized });
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!alert) return undefined;
    const timer = window.setTimeout(() => {
      setAlert((current) => (current?.id === alert.id ? null : current));
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [alert]);

  const meta = alert ? ALERT_META[alert.type] || ALERT_META.info : null;

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}

      {alert && meta && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div
            key={alert.id}
            className="
              pointer-events-none
              w-full max-w-[300px]
              bg-white/96 backdrop-blur-xl
              border border-hydro-border rounded-2xl
              shadow-[0_18px_44px_rgba(18,36,33,0.14)]
              px-5 py-5
              alert-pop
            "
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`
                  w-14 h-14 rounded-full
                  inline-flex items-center justify-center
                  ${meta.iconWrap}
                  ${meta.iconAnim}
                `}
              >
                <meta.Icon size={30} strokeWidth={2.25} />
              </div>

              <h3
                className={`font-display font-semibold text-base mt-3 ${meta.titleColor}`}
              >
                {meta.title}
              </h3>

              <p className="text-[0.82rem] text-hydro-muted mt-1.5 leading-relaxed">
                {alert.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

/** Hook untuk menampilkan pemberitahuan dari halaman/komponen */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: () => {}, dismiss: () => {} };
  }
  return ctx;
}
