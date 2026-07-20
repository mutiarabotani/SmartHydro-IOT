/**
 * DeviceControl.jsx — halaman kendali perangkat hidroponik.
 *
 * Untuk apa:
 * - Pilih mode AUTO / MANUAL (DevicesContext)
 * - Saat AUTO: kartu terkunci; rule-based mengikuti Setting
 * - Saat MANUAL: toggle ON/OFF tiap aktuator via DeviceCard
 *
 * Aktuator: pompa nutrisi, pompa air, relay tandon, servo dosing.
 * Layout: PageShell (konten pakai space-y-4).
 */
import { PageShell } from "../components/layout";
import { DeviceCard } from "../components/devices";
import { useToast } from "../context/ToastContext";
import { useSettings } from "../context/SettingsContext";
import { useDevices, DEVICE_IDS } from "../context/DevicesContext";

import {
  FlaskConical,
  Droplets,
  Cable,
  RotateCw,
  Bot,
  Hand,
  Sparkles,
  Lock,
} from "lucide-react";

export default function DeviceControl() {
  const { showToast } = useToast();
  const { control } = useSettings();
  const { mode, setMode, isAuto } = useDevices();

  const changeMode = (next) => {
    if (next === mode) return;
    setMode(next);
    showToast(
      next === "AUTO"
        ? control.autoRuleBased
          ? "Mode AUTO aktif. Aktuasi rule-based saat ambang kritis."
          : "Mode AUTO aktif. Rule-based dimatikan di Setting."
        : "Mode MANUAL aktif. Anda dapat mengontrol perangkat.",
      "info"
    );
  };

  const statusText = isAuto
    ? control.autoRuleBased
      ? "Aktuator dikendalikan aturan ambang + rekomendasi AI (decision support)."
      : "Mode AUTO aktif, tapi rule-based masih dimatikan di Setting."
    : "Kendali langsung aktif — atur ON/OFF tiap perangkat secara manual.";

  return (
    <PageShell
      title="Device Control"
      subtitle="Kendali aktuator dan mode sistem hidroponik"
      contentClassName="space-y-4"
    >
          {/* ===== Mode Sistem ===== */}
          <div className="panel p-3 sm:p-4 card-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`
                    shrink-0 w-10 h-10 rounded-xl
                    inline-flex items-center justify-center
                    border border-hydro-border
                    ${isAuto ? "bg-hydro-accent-soft text-hydro-primary" : "bg-hydro-bg2 text-hydro-ink"}
                  `}
                >
                  {isAuto ? <Bot size={20} /> : <Hand size={20} />}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="section-title">Mode Sistem</h2>
                    <span
                      className={`chip ${isAuto ? "chip-ok" : "chip-muted"}`}
                    >
                      <span
                        className={`
                          w-1.5 h-1.5 rounded-full
                          ${isAuto ? "bg-hydro-accent status-pulse" : "bg-hydro-muted"}
                        `}
                      />
                      {isAuto ? "AUTO" : "MANUAL"}
                    </span>
                    <span
                      className={`chip ${
                        control.autoRuleBased ? "chip-ok" : "chip-muted"
                      }`}
                    >
                      <Sparkles size={11} />
                      Rule-based {control.autoRuleBased ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="section-sub mt-1">{statusText}</p>
                </div>
              </div>

              <div
                className="
                  relative shrink-0
                  grid grid-cols-2 p-1 rounded-xl
                  bg-hydro-bg2/90 border border-hydro-border
                  w-full sm:w-[240px]
                "
                role="group"
                aria-label="Pilih mode sistem"
              >
                <span
                  aria-hidden
                  className={`
                    absolute top-1 bottom-1 left-1 w-[calc(50%-6px)]
                    rounded-lg bg-white border border-hydro-primary/25
                    shadow-[0_4px_14px_rgba(15,107,92,0.12)]
                    transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${isAuto ? "translate-x-0" : "translate-x-[calc(100%+4px)]"}
                  `}
                />
                <button
                  type="button"
                  onClick={() => changeMode("AUTO")}
                  className={`
                    relative z-10 inline-flex items-center justify-center gap-1.5
                    py-2 rounded-lg text-[0.78rem] font-semibold cursor-pointer
                    ${isAuto ? "text-hydro-primary" : "text-hydro-muted hover:text-hydro-ink"}
                  `}
                >
                  <Bot size={13} />
                  AUTO
                </button>
                <button
                  type="button"
                  onClick={() => changeMode("MANUAL")}
                  className={`
                    relative z-10 inline-flex items-center justify-center gap-1.5
                    py-2 rounded-lg text-[0.78rem] font-semibold cursor-pointer
                    ${!isAuto ? "text-hydro-primary" : "text-hydro-muted hover:text-hydro-ink"}
                  `}
                >
                  <Hand size={13} />
                  MANUAL
                </button>
              </div>
            </div>
          </div>

          {/* ===== Aktuator ===== */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2.5">
              <div>
                <h2 className="section-title">Aktuator</h2>
                <p className="section-sub mt-0.5">
                  Pompa, relay tandon, dan servo dosing nutrisi
                </p>
              </div>
              {isAuto && (
                <p className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-hydro-warn">
                  <Lock size={13} />
                  Dikunci mode AUTO — ubah ke MANUAL untuk kontrol
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 items-start">
              <DeviceCard
                deviceId={DEVICE_IDS.pompaNutrisi}
                title="Pompa Nutrisi"
                icon={<FlaskConical size={22} />}
                color="bg-hydro-accent-soft"
                disabled={isAuto}
              />
              <DeviceCard
                deviceId={DEVICE_IDS.pompaAir}
                title="Pompa Air"
                icon={<Droplets size={22} />}
                color="bg-[#d9eef8]"
                disabled={isAuto}
              />
              <DeviceCard
                deviceId={DEVICE_IDS.relayTandon}
                title="Relay Tandon"
                icon={<Cable size={22} />}
                color="bg-[#d8f0f2]"
                disabled={isAuto}
              />
              <DeviceCard
                deviceId={DEVICE_IDS.servoNutrisi}
                title="Servo Nutrisi"
                icon={<RotateCw size={22} />}
                color="bg-[#e8f0e4]"
                disabled={isAuto}
              />
            </div>
          </div>
    </PageShell>
  );
}
