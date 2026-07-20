/**
 * DeviceCard.jsx — kartu kontrol satu aktuator (pompa, relay, servo).
 *
 * Untuk apa:
 * - Menampilkan status ON/OFF perangkat
 * - Toggle manual saat mode MANUAL (DevicesContext)
 * - Terkunci + toast peringatan saat mode AUTO
 *
 * Props:
 * - deviceId : key di DevicesContext (DEVICE_IDS)
 * - title    : nama perangkat di UI
 * - icon     : ikon Lucide
 * - color    : class latar ikon
 * - disabled : true saat mode AUTO
 */
import { useState } from "react";
import { Lock } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useDevices } from "../../context/DevicesContext";

/** Format jam update terakhir (WIB display) */
function formatTime(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DeviceCard({
  deviceId,
  title,
  icon,
  color = "bg-hydro-accent-soft",
  disabled = false,
}) {
  const { showToast } = useToast();
  const { actuators, toggleActuator } = useDevices();
  const isOn = Boolean(actuators[deviceId]);
  const [updatedAt, setUpdatedAt] = useState(() => formatTime(new Date()));

  const toggleDevice = () => {
    if (disabled) {
      showToast(
        "Mode AUTO aktif. Ubah ke MANUAL untuk kontrol perangkat.",
        "warn"
      );
      return;
    }

    const newStatus = !isOn;
    toggleActuator(deviceId);
    setUpdatedAt(formatTime(new Date()));
    showToast(
      `${title} berhasil ${newStatus ? "dihidupkan" : "dimatikan"}.`,
      "success"
    );
  };

  return (
    <div
      className={`
      panel panel-lift p-3 card-enter h-fit
      ${disabled ? "opacity-90" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          className={`
          w-11 h-11 rounded-xl
          flex items-center justify-center
          text-hydro-primary shrink-0 icon-pop
          border border-hydro-border/70
          ${color}
          `}
        >
          {icon}
        </div>
        <span className={`chip shrink-0 ${isOn ? "chip-ok" : "chip-danger"}`}>
          <span
            className={`
              w-1.5 h-1.5 rounded-full
              ${isOn ? "bg-hydro-accent status-pulse" : "bg-hydro-danger"}
            `}
          />
          {isOn ? "ON" : "OFF"}
        </span>
      </div>

      <h3 className="font-display text-[0.95rem] font-semibold text-hydro-ink leading-snug">
        {title}
      </h3>
      <p className="text-[0.78rem] text-hydro-muted mt-1 tabular-nums">
        Update {updatedAt} WIB
      </p>

      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-hydro-border/70">
        <span className="text-[0.78rem] text-hydro-muted inline-flex items-center gap-1">
          {disabled ? (
            <>
              <Lock size={11} className="text-hydro-warn" />
              Terkunci
            </>
          ) : (
            "Kontrol"
          )}
        </span>
        <button
          type="button"
          onClick={toggleDevice}
          aria-label={`Toggle ${title}`}
          aria-disabled={disabled}
          className={`
          relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer
          ${isOn ? "bg-hydro-primary shadow-[0_3px_10px_rgba(14,106,92,0.25)]" : "bg-hydro-border"}
          ${disabled ? "cursor-not-allowed opacity-65" : ""}
          `}
        >
          <div
            className={`
            absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300
            ${isOn ? "left-[22px]" : "left-0.5"}
            `}
          />
        </button>
      </div>
    </div>
  );
}
