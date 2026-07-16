/**
 * Navbar.jsx — bilah atas halaman (sticky).
 *
 * Isi:
 * - Tombol Menu → buka/tutup sidebar
 * - Judul + subtitle halaman
 * - Status IoT, jam real-time, tanggal (format Indonesia)
 */
import { useEffect, useState } from "react";
import {
  Menu,
  Cloud,
  Clock3,
  CalendarDays
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export default function Navbar({
  title = "Dashboard",
  subtitle = "Monitoring dan Kontrol Sistem Hidroponik"
}) {
  const { toggle } = useSidebar();

  // Waktu yang di-update setiap detik
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format tanggal & jam lokal Indonesia
  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return (
    <div
      className="
      sticky top-0 z-20 shrink-0
      bg-white/90 backdrop-blur-md
      border-b border-hydro-border
      min-h-[56px] h-auto sm:h-[56px]
      flex justify-between items-center
      px-1 py-1.5 sm:py-0 gap-2
      "
    >
      {/* Kiri: toggle sidebar + judul halaman */}
      <div className="flex min-w-0 items-center flex-1">
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle sidebar"
          className="
          w-10 h-10 mx-1 shrink-0 rounded-lg
          flex items-center justify-center
          text-hydro-primary hover:bg-hydro-accent-soft hover:scale-105
          cursor-pointer
          "
        >
          <Menu size={20} />
        </button>

        {/* key={title} memicu animasi ulang saat pindah halaman */}
        <div
          key={title}
          className="pl-1 pr-2 sm:pr-4 flex flex-col justify-center min-w-0 title-enter"
        >
          <h1 className="font-display text-sm sm:text-base font-semibold text-hydro-ink tracking-tight leading-tight truncate">
            {title}
          </h1>
          <p className="text-[0.7rem] sm:text-[0.75rem] text-hydro-muted truncate max-w-[40vw] sm:max-w-none">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Kanan: status IoT + jam + tanggal */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 shrink-0 text-[0.75rem] sm:text-[0.8rem]">
        {/* Indikator koneksi IoT (simulasi Online) */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2 live-dot">
            <span className="status-pulse absolute inline-flex h-full w-full rounded-full bg-hydro-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-hydro-accent" />
          </span>
          <Cloud size={15} className="text-hydro-primary" />
          <span className="font-medium text-hydro-primary whitespace-nowrap hidden sm:inline">
            IoT · Online
          </span>
        </div>

        <span className="hidden sm:block w-px h-4 bg-hydro-border" />

        {/* Jam real-time */}
        <div className="hidden sm:flex items-center gap-1.5 text-hydro-muted">
          <Clock3 size={15} className="text-hydro-primary" />
          <span className="tabular-nums">{formattedTime}</span>
        </div>

        {/* Tanggal (tampil dari layar besar) */}
        <div className="hidden lg:flex items-center gap-1.5 text-hydro-muted">
          <CalendarDays size={15} className="text-hydro-primary" />
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
