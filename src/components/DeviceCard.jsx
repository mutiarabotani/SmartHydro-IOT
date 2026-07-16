/**
 * DeviceCard.jsx — kartu kontrol satu perangkat (pompa, kipas, aktuator).
 *
 * Props:
 * - title      : nama perangkat
 * - icon       : ikon Lucide
 * - color      : warna latar ikon
 * - disabled   : true saat mode AUTO (kontrol manual dikunci)
 * - initialOn  : status awal ON/OFF
 *
 * Saat diklik di mode AUTO → tampil toast peringatan.
 * Saat MANUAL → toggle ON/OFF + toast sukses + update waktu.
 */
import { useState } from "react";
import { useToast } from "../context/ToastContext";

/** Format jam HH:MM untuk label "Terakhir diperbarui" */
function formatTime(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DeviceCard({
  title,
  icon,
  color = "bg-hydro-accent-soft",
  disabled = false,
  initialOn = true,
}) {
  const { showToast } = useToast();
  const [isOn, setIsOn] = useState(initialOn); // status perangkat
  const [updatedAt, setUpdatedAt] = useState(() => formatTime(new Date()));

  /** Hidupkan / matikan perangkat (simulasi lokal, belum API) */
  const toggleDevice = () => {
    // Blokir jika sistem masih AUTO
    if (disabled) {
      showToast(
        "Mode AUTO aktif. Ubah ke MANUAL untuk kontrol perangkat.",
        "warn"
      );
      return;
    }

    const newStatus = !isOn;
    setIsOn(newStatus);
    setUpdatedAt(formatTime(new Date()));
    showToast(
      `${title} berhasil ${newStatus ? "dihidupkan" : "dimatikan"}.`,
      "success"
    );
  };

  return (
    <div
      className={`
      panel p-4 card-enter transition hover:border-hydro-accent
      ${disabled ? "opacity-80" : ""}
      `}
    >
      <div className="flex gap-4">
        {/* Ikon perangkat */}
        <div
          className={`
          w-16 h-16 rounded-xl
          flex items-center justify-center
          text-hydro-primary shrink-0 icon-pop
          ${color}
          `}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[0.95rem] font-semibold border-b border-hydro-border pb-1.5 text-hydro-ink">
            {title}
          </h3>

          {/* Status ON/OFF + saklar */}
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              {/* Titik indikator hijau (ON) / merah (OFF) */}
              <div
                className={`
                w-2.5 h-2.5 rounded-full
                ${isOn ? "bg-hydro-accent status-pulse" : "bg-hydro-danger"}
                `}
              />
              <span
                className={`
                text-[0.85rem] font-semibold
                ${isOn ? "text-hydro-primary" : "text-hydro-danger"}
                `}
              >
                {isOn ? "ON" : "OFF"}
              </span>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              onClick={toggleDevice}
              aria-label={`Toggle ${title}`}
              className={`
              relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer
              ${isOn ? "bg-hydro-primary" : "bg-hydro-border"}
              ${disabled ? "cursor-not-allowed" : ""}
              `}
            >
              {/* Knob saklar yang bergeser kiri/kanan */}
              <div
                className={`
                absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300
                ${isOn ? "left-[22px]" : "left-0.5"}
                `}
              />
            </button>
          </div>

          {/* Info waktu update terakhir */}
          <div className="mt-3 text-[0.75rem] text-hydro-muted">
            <p>Terakhir diperbarui</p>
            <p>{updatedAt} WIB</p>
            {disabled && (
              <p className="text-hydro-warn mt-1">Dikunci mode AUTO</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
