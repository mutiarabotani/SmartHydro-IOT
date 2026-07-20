/**
 * Sidebar.jsx — menu navigasi kiri SmartHydro-AI (layout layer).
 *
 * Untuk apa:
 * - Navigasi antar halaman (Dashboard → Setting)
 * - Mode penuh (teks + ikon) atau mode ikon saja saat ditutup
 * - Mobile: overlay + sidebar fixed; spacer menjaga konten tidak ketutup
 *
 * State buka/tutup berasal dari SidebarContext (global).
 */
import {
  LayoutDashboard,
  Activity,
  Brain,
  SlidersHorizontal,
  ClipboardList,
  Settings,
  Leaf,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

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

      {/* Panel sidebar: lebar 210px (buka) atau 64px (tutup) */}
      <div
        className={`
        sidebar-shell
        app-screen
        overflow-y-auto
        bg-white/85
        backdrop-blur-xl
        border-r
        border-hydro-border/80
        z-30
        max-md:fixed
        max-md:inset-y-0
        max-md:left-0
        max-md:shadow-[0_12px_40px_rgba(18,36,33,0.12)]
        md:sticky
        md:top-0
        md:shadow-none
        ${open ? "w-[210px]" : "w-[64px]"}
        `}
      >
        {/* Brand / logo aplikasi */}
        <div
          className={`
          h-[58px]
          border-b
          border-hydro-border/80
          flex
          items-center
          ${open ? "px-3 gap-2.5" : "justify-center px-0"}
          `}
        >
          <div
            className="
            w-9 h-9 shrink-0 rounded-xl
            bg-gradient-to-br from-hydro-accent-soft to-white
            border border-hydro-border
            flex items-center justify-center text-hydro-primary
            shadow-[0_4px_12px_rgba(14,106,92,0.08)]
            "
          >
            <Leaf size={18} />
          </div>

          {open && (
            <h1 className="font-display font-semibold text-[1rem] text-hydro-ink tracking-tight whitespace-nowrap">
              SmartHydro-AI
            </h1>
          )}
        </div>

        {/* Daftar menu navigasi */}
        <div className={`${open ? "px-2 py-2" : "py-2"} space-y-0.5`}>
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
 * MenuItem — satu tombol menu di sidebar.
 * Tooltip (mode ikon) di-portal agar tidak terpotong overflow.
 */
function MenuItem({ icon, text, active, onClick, open = true }) {
  const itemRef = useRef(null);
  const [tip, setTip] = useState(null); // { top, left } | null

  const showTip = () => {
    if (open || !itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setTip({
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  };

  const hideTip = () => setTip(null);

  // Sembunyikan tip saat sidebar dibuka kembali
  useEffect(() => {
    if (open) hideTip();
  }, [open]);

  return (
    <button
      type="button"
      ref={itemRef}
      onClick={() => {
        hideTip();
        onClick();
      }}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onFocus={showTip}
      onBlur={hideTip}
      aria-current={active ? "page" : undefined}
      aria-label={text}
      className={`
      menu-item-motion
      w-full
      h-[42px]
      flex
      items-center
      rounded-xl
      cursor-pointer
      border-0
      text-left
      ${open ? "gap-2.5 px-3" : "justify-center px-0 mx-1.5 w-[calc(100%-0.75rem)]"}
      ${
        active
          ? "nav-active-bar nav-item-active bg-hydro-accent-soft font-semibold text-hydro-primary"
          : "bg-transparent text-hydro-muted hover:bg-hydro-bg2/70 hover:text-hydro-ink"
      }
      `}
    >
      <span className={active ? "text-hydro-primary" : "text-current"}>
        {icon}
      </span>
      {open && (
        <span className="text-[0.88rem] whitespace-nowrap">{text}</span>
      )}

      {!open &&
        tip &&
        createPortal(
          <div
            role="tooltip"
            className="
              fixed z-[200] pointer-events-none
              px-2.5 py-1.5 rounded-md
              bg-hydro-primary text-white
              text-[0.78rem] font-medium whitespace-nowrap
              shadow-[0_6px_16px_rgba(15,107,92,0.22)]
            "
            style={{
              top: tip.top,
              left: tip.left,
              transform: "translateY(-50%)",
            }}
          >
            <span
              aria-hidden
              className="
                absolute right-full top-1/2 -translate-y-1/2
                border-[5px] border-transparent border-r-hydro-primary
              "
            />
            {text}
          </div>,
          document.body
        )}
    </button>
  );
}
