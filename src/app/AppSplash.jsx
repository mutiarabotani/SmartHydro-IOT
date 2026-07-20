/**
 * AppSplash.jsx — layar loading singkat saat aplikasi pertama dibuka.
 *
 * Untuk apa:
 * - Branding ringan (logo Leaf + progress)
 * - Sengaja singkat (~450ms) agar tidak membuat app terasa lambat
 * - Overlay saja; halaman di belakang sudah ikut di-mount
 *
 * Bukan dipakai tiap pindah menu / tiap klik tombol.
 */
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

const SPLASH_MS = 420;

export default function AppSplash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveAt = window.setTimeout(() => setLeaving(true), SPLASH_MS);
    const doneAt = window.setTimeout(() => onDone?.(), SPLASH_MS + 180);
    return () => {
      window.clearTimeout(leaveAt);
      window.clearTimeout(doneAt);
    };
  }, [onDone]);

  return (
    <div
      className={`
        fixed inset-0 z-[500]
        flex flex-col items-center justify-center gap-5
        bg-[#f2f6f4]
        transition-opacity duration-200 ease-out
        ${leaving ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      aria-busy="true"
      aria-label="Memuat SmartHydro-AI"
    >
      <div
        className="
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-hydro-accent-soft to-white
          border border-hydro-border
          flex items-center justify-center text-hydro-primary
          shadow-[0_8px_24px_rgba(14,106,92,0.12)]
        "
      >
        <Leaf size={28} strokeWidth={2.2} />
      </div>

      <p className="font-display text-[0.95rem] font-semibold text-hydro-ink tracking-tight">
        SmartHydro-AI
      </p>

      {/* Progress tipis — CSS only, tanpa library */}
      <div
        className="w-36 h-1.5 rounded-full bg-hydro-border/80 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="app-splash-bar h-full rounded-full bg-hydro-primary" />
      </div>
    </div>
  );
}
