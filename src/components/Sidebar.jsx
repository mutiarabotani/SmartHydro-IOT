/**
 * Sidebar.jsx — menu navigasi kiri SmartHydro-AI.
 *
 * Fitur:
 * - Mode penuh (teks + ikon) atau mode ikon saja (saat ditutup)
 * - Di mobile: sidebar fixed + backdrop; spacer menjaga layout konten
 * - Item aktif mengikuti URL saat ini (useLocation)
 */
import {
  LayoutDashboard,
  Activity,
  Brain,
  SlidersHorizontal,
  ClipboardList,
  Settings,
  Leaf
} from "lucide-react";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // path aktif, contoh: "/monitoring"
  const { open, setOpen } = useSidebar();

  // Saat pindah halaman di mobile, tutup sidebar agar tidak menutupi konten
  useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [location.pathname, setOpen]);

  /** Navigasi ke path, lalu tutup sidebar jika layar mobile */
  const go = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setOpen(false);
  };

  return (
    <>
      {/* Overlay gelap di belakang sidebar (hanya mobile, saat terbuka) */}
      {open && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          className="fixed inset-0 z-20 bg-hydro-ink/20 backdrop-blur-[1px] backdrop-enter md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Spacer lebar ikon di mobile agar konten tidak ketutup sidebar fixed */}
      <div className="w-[64px] shrink-0 md:hidden" aria-hidden />

      {/* Panel sidebar: lebar 200px (buka) atau 64px (tutup) */}
      <div
        className={`
        sidebar-shell
        h-screen
        overflow-y-auto
        bg-white/90
        backdrop-blur-md
        border-r
        border-hydro-border
        z-30
        max-md:fixed
        max-md:inset-y-0
        max-md:left-0
        max-md:shadow-lg
        md:sticky
        md:top-0
        md:shadow-none
        ${open ? "w-[200px]" : "w-[64px]"}
        `}
      >

        {/* Brand / logo aplikasi */}
        <div
          className={`
          h-[56px]
          border-b
          border-hydro-border
          flex
          items-center
          ${open ? "px-3 gap-2.5" : "justify-center px-0"}
          `}
        >
          <div
            className="
            w-9 h-9 shrink-0 rounded-lg
            bg-hydro-accent-soft border border-hydro-border
            flex items-center justify-center text-hydro-primary
            "
          >
            <Leaf size={18} />
          </div>

          {/* Nama brand hanya tampil saat sidebar terbuka */}
          {open && (
            <h1 className="font-display font-semibold text-[0.95rem] text-hydro-ink tracking-tight whitespace-nowrap">
              SmartHydro-AI
            </h1>
          )}
        </div>

        {/* Daftar menu navigasi */}
        <div>
          <MenuItem
            icon={<LayoutDashboard size={18} />}
            text="Dashboard"
            active={location.pathname === "/"}
            onClick={() => go("/")}
            open={open}
          />
          <MenuItem
            icon={<Activity size={18} />}
            text="Monitoring"
            active={location.pathname === "/monitoring"}
            onClick={() => go("/monitoring")}
            open={open}
          />
          <MenuItem
            icon={<Brain size={18} />}
            text="AI Prediction"
            active={location.pathname === "/ai-prediction"}
            onClick={() => go("/ai-prediction")}
            open={open}
          />
          <MenuItem
            icon={<SlidersHorizontal size={18} />}
            text="Device Control"
            active={location.pathname === "/device-control"}
            onClick={() => go("/device-control")}
            open={open}
          />
          <MenuItem
            icon={<ClipboardList size={18} />}
            text="Log"
            active={location.pathname === "/log"}
            onClick={() => go("/log")}
            open={open}
          />
          <MenuItem
            icon={<Settings size={18} />}
            text="Setting"
            active={location.pathname === "/setting"}
            onClick={() => go("/setting")}
            open={open}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Satu item menu di sidebar.
 * @param active - true jika halaman ini sedang dibuka
 * @param open   - true jika sidebar menampilkan teks (bukan hanya ikon)
 */
function MenuItem({ icon, text, active, onClick, open = true }) {
  return (
    <div
      onClick={onClick}
      title={!open ? text : undefined} // tooltip saat mode ikon
      className={`
      menu-item-motion
      h-[46px]
      flex
      items-center
      border-b
      border-hydro-border
      cursor-pointer
      ${open ? "gap-2.5 px-4" : "justify-center px-0"}
      ${
        active
          ? "nav-active-bar bg-hydro-accent-soft font-medium text-hydro-primary"
          : "text-hydro-muted hover:bg-hydro-bg2 hover:text-hydro-ink"
      }
      `}
    >
      {icon}
      {open && (
        <span className="text-[0.86rem] whitespace-nowrap">
          {text}
        </span>
      )}
    </div>
  );
}
