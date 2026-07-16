/**
 * SidebarContext — state global untuk sidebar (buka/tutup).
 * Dipakai oleh Sidebar.jsx dan Navbar.jsx (tombol Menu).
 *
 * Perilaku:
 * - Desktop (≥768px): default terbuka
 * - Mobile (<768px): default tertutup; otomatis tutup saat resize ke mobile
 */
import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext(null);

/** Tentukan status awal sidebar berdasarkan lebar layar */
function getInitialOpen() {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= 768;
}

/** Provider yang membungkus aplikasi agar semua komponen bisa akses state sidebar */
export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(getInitialOpen);

  // Pantau perubahan ukuran layar; di mobile paksa sidebar tertutup (mode ikon/overlay)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");

    const onChange = () => {
      if (mq.matches) setOpen(false);
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** Balik status buka ↔ tutup */
  const toggle = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

/** Hook untuk membaca/mengubah sidebar dari komponen mana pun */
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  // Fallback aman jika provider belum terpasang
  if (!ctx) {
    return { open: true, setOpen: () => {}, toggle: () => {} };
  }
  return ctx;
}
