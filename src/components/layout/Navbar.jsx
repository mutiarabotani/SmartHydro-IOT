/**
 * Navbar.jsx — bilah atas halaman (layout layer, sticky).
 *
 * Untuk apa:
 * - Tombol Menu → buka/tutup Sidebar (SidebarContext)
 * - Judul + subtitle halaman aktif
 * - Status koneksi IoT (MQTT) dari SettingsContext
 * - Jam & tanggal real-time (format Indonesia)
 */
import { useEffect, useState } from "react";
import { Menu, Cloud, Clock3, CalendarDays } from "lucide-react";
import { ThemeTip } from "../ui";
import { useSidebar } from "../../context/SidebarContext";
import { useSettings } from "../../context/SettingsContext";

export default function Navbar({
  title = "Dashboard",
  subtitle = "Monitoring dan Kontrol Sistem Hidroponik",
}) {
  const { toggle } = useSidebar();
  const { iot } = useSettings();
  const platformLabel = iot.platform === "mqtt" ? "MQTT" : "Cloud";
  const statusLabel = iot.cloud ? "Online" : "Offline";
  const statusTitle = `IoT · ${statusLabel}${iot.cloud ? ` · ${platformLabel}` : ""}`;

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className="
      sticky top-0 z-20 shrink-0
      bg-white/80 backdrop-blur-xl
      border-b border-hydro-border/80
      min-h-[58px] h-auto sm:h-[58px]
      flex justify-between items-center
      px-1.5 py-1.5 sm:py-0 gap-2
      "
    >
      <div className="flex min-w-0 items-center flex-1">
        <ThemeTip tip="Menu" prefer="bottom">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle sidebar"
            className="
            w-10 h-10 mx-1 shrink-0 rounded-xl
            flex items-center justify-center
            text-hydro-primary
            hover:bg-hydro-accent-soft
            transition cursor-pointer
            "
          >
            <Menu size={20} />
          </button>
        </ThemeTip>

        <div
          key={title}
          className="pl-1 pr-2 sm:pr-4 flex flex-col justify-center min-w-0 title-enter"
        >
          <h1 className="font-display text-[0.88rem] sm:text-[0.95rem] font-semibold text-hydro-ink tracking-tight leading-tight truncate">
            {title}
          </h1>
          <p className="text-[0.72rem] sm:text-[0.78rem] text-hydro-muted truncate max-w-[42vw] sm:max-w-none">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-2 sm:px-3 shrink-0 text-[0.72rem] sm:text-[0.78rem]">
        {/* Status IoT compact (mobile) */}
        <div
          className={`
            inline-flex sm:hidden items-center gap-1.5
            px-2 py-1 rounded-full border
            ${
              iot.cloud
                ? "bg-hydro-accent-soft/80 border-hydro-primary/15 text-hydro-primary"
                : "bg-hydro-bg2 border-hydro-border text-hydro-muted"
            }
          `}
          title={statusTitle}
        >
          <span className="relative flex h-1.5 w-1.5">
            {iot.cloud && (
              <span className="status-pulse absolute inline-flex h-full w-full rounded-full bg-hydro-accent opacity-75" />
            )}
            <span
              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                iot.cloud ? "bg-hydro-accent" : "bg-hydro-muted"
              }`}
            />
          </span>
          <Cloud size={12} />
          <span className="font-semibold text-[0.72rem]">
            {iot.cloud ? "Online" : "Off"}
          </span>
        </div>

        {/* Status IoT lengkap (desktop) */}
        <div
          className={`
            hidden sm:inline-flex items-center gap-1.5
            px-2 py-1 rounded-full border
            ${
              iot.cloud
                ? "bg-hydro-accent-soft/80 border-hydro-primary/15 text-hydro-primary"
                : "bg-hydro-bg2 border-hydro-border text-hydro-muted"
            }
          `}
          title={statusTitle}
        >
          <span className="relative flex h-1.5 w-1.5 live-dot">
            {iot.cloud && (
              <span className="status-pulse absolute inline-flex h-full w-full rounded-full bg-hydro-accent opacity-75" />
            )}
            <span
              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                iot.cloud ? "bg-hydro-accent" : "bg-hydro-muted"
              }`}
            />
          </span>
          <Cloud size={13} />
          <span className="font-semibold whitespace-nowrap text-[0.72rem] sm:text-[0.78rem]">
            IoT · {statusLabel}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-hydro-bg2/70 border border-hydro-border/80 text-hydro-muted">
          <Clock3 size={13} className="text-hydro-primary" />
          <span className="tabular-nums font-medium text-hydro-ink text-[0.72rem] sm:text-[0.78rem]">
            {formattedTime}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-hydro-bg2/70 border border-hydro-border/80 text-hydro-muted">
          <CalendarDays size={13} className="text-hydro-primary" />
          <span className="whitespace-nowrap font-medium text-[0.72rem] sm:text-[0.78rem]">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
