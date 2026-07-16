/**
 * DeviceControl.jsx — halaman kendali perangkat hidroponik.
 *
 * Fitur:
 * - Pilih mode AUTO / MANUAL
 * - Saat AUTO: kartu perangkat terkunci (disabled)
 * - Saat MANUAL: pengguna bisa toggle ON/OFF tiap aktuator
 */
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DeviceCard from "../components/DeviceCard";
import { useToast } from "../context/ToastContext";

import {
  FlaskConical,
  Droplets,
  Fan,
  PlugZap
} from "lucide-react";

export default function DeviceControl() {
  const { showToast } = useToast();
  // Mode sistem: AUTO = otomatis, MANUAL = kontrol user
  const [mode, setMode] = useState("AUTO");

  /** Ganti mode + tampilkan notifikasi */
  const changeMode = (next) => {
    if (next === mode) return;
    setMode(next);
    showToast(
      next === "AUTO"
        ? "Mode AUTO aktif. Perangkat dikendalikan otomatis."
        : "Mode MANUAL aktif. Anda dapat mengontrol perangkat.",
      "info"
    );
  };

  return (
    // Layout: sidebar kiri + kolom utama (navbar sticky + konten scroll)
    <div className="flex page-shell h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Navbar
          title="Device Control"
          subtitle="Kendali aktuator dan mode sistem hidroponik"
        />

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 page-enter content-stagger">

          {/* ===== Mode Sistem AUTO / MANUAL ===== */}
          <div className="panel p-4 card-enter">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="font-display text-base font-semibold text-hydro-ink">
                  Mode Sistem
                </h2>
                <p className="text-[0.8rem] text-hydro-muted">
                  Pilih mode pengendalian sistem hidroponik
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => changeMode("AUTO")}
                  className={`
                  px-5 py-2 rounded-lg font-medium text-[0.8rem] border cursor-pointer
                  ${
                    mode === "AUTO"
                      ? "bg-hydro-accent-soft border-hydro-primary text-hydro-primary"
                      : "bg-hydro-bg2 border-hydro-border text-hydro-muted hover:border-hydro-accent"
                  }
                  `}
                >
                  AUTO
                </button>

                <button
                  type="button"
                  onClick={() => changeMode("MANUAL")}
                  className={`
                  px-5 py-2 rounded-lg font-medium text-[0.8rem] border cursor-pointer
                  ${
                    mode === "MANUAL"
                      ? "bg-hydro-accent-soft border-hydro-primary text-hydro-primary"
                      : "bg-hydro-bg2 border-hydro-border text-hydro-muted hover:border-hydro-accent"
                  }
                  `}
                >
                  MANUAL
                </button>
              </div>
            </div>

            {/* Keterangan mode aktif */}
            <p className="mt-3 text-[0.78rem] text-hydro-muted border-t border-hydro-border pt-3">
              Status saat ini:{" "}
              <span className="font-semibold text-hydro-primary">{mode}</span>
              {mode === "AUTO"
                ? " — pompa dan aktuator dikendalikan aturan sistem & AI."
                : " — kontrol perangkat dapat diubah secara manual."}
            </p>
          </div>

          {/* ===== Grid kartu perangkat ===== */}
          <div className="mt-4">
            <h2 className="font-display text-base font-semibold mb-3 text-hydro-ink">
              Kontrol Perangkat
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {/* disabled={mode === "AUTO"} → kunci kontrol di mode otomatis */}
              <DeviceCard
                title="Pompa Nutrisi"
                icon={<FlaskConical size={28} />}
                color="bg-hydro-accent-soft"
                disabled={mode === "AUTO"}
                initialOn
              />
              <DeviceCard
                title="Pompa Air"
                icon={<Droplets size={28} />}
                color="bg-[#d9eef8]"
                disabled={mode === "AUTO"}
                initialOn
              />
              <DeviceCard
                title="Kipas"
                icon={<Fan size={28} />}
                color="bg-[#d8f0f2]"
                disabled={mode === "AUTO"}
                initialOn={false}
              />
              <DeviceCard
                title="Aktuator"
                icon={<PlugZap size={28} />}
                color="bg-[#e8f0e4]"
                disabled={mode === "AUTO"}
                initialOn
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
