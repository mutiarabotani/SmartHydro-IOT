/**
 * Setting.jsx — halaman konfigurasi sistem SmartHydro-AI.
 *
 * Bagian:
 * 1. Ambang batas sensor (pH, EC, suhu, dll)
 * 2. Notifikasi (warning, error, AI, device)
 * 3. Koneksi IoT (nama node, interval, cloud)
 * 4. Pengaturan AI (aktif, horizon, model)
 *
 * Simpan/Reset masih lokal (belum API).
 */
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";
import {
  SlidersHorizontal,
  Bell,
  Wifi,
  Brain,
  Save,
  RotateCcw,
} from "lucide-react";

/** Nilai default ambang batas sensor */
const DEFAULT_THRESHOLDS = {
  phMin: "5.5",
  phMax: "6.5",
  ecMin: "1.2",
  ecMax: "2.0",
  tempMax: "28",
  humidityMin: "50",
  lightMin: "300",
  waterMin: "40",
};

/** Default saklar notifikasi */
const DEFAULT_NOTIFY = {
  warning: true,
  error: true,
  ai: true,
  device: false,
};

/** Default pengaturan IoT */
const DEFAULT_IOT = {
  deviceName: "SmartHydro-Node-01",
  interval: "5",
  cloud: true,
};

/** Default pengaturan modul AI */
const DEFAULT_AI = {
  enabled: true,
  horizon: "24",
  model: "regresi",
};

/** Komponen saklar ON/OFF kecil untuk setting */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer
        ${checked ? "bg-hydro-primary" : "bg-hydro-border"}
      `}
    >
      <span
        className={`
          absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300
          ${checked ? "left-[22px]" : "left-0.5"}
        `}
      />
    </button>
  );
}

/** Wrapper label + input + hint opsional */
function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[0.8rem] font-medium text-hydro-ink">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[0.72rem] text-hydro-muted">{hint}</p>
      )}
    </div>
  );
}

/** Class CSS bersama untuk input/select di halaman Setting */
function inputClass() {
  return `
    w-full border border-hydro-border rounded-lg
    px-3 py-1.5 text-[0.8rem]
    bg-white/90 text-hydro-ink
    focus:outline-none focus:border-hydro-accent
  `;
}

export default function Setting() {
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false); // flag teks "berhasil disimpan"

  // State tiap grup pengaturan
  const [thresholds, setThresholds] = useState({ ...DEFAULT_THRESHOLDS });
  const [notify, setNotify] = useState({ ...DEFAULT_NOTIFY });
  const [iot, setIot] = useState({ ...DEFAULT_IOT });
  const [ai, setAi] = useState({ ...DEFAULT_AI });

  /** Simpan pengaturan (simulasi lokal) */
  const handleSave = () => {
    setSaved(true);
    showToast("Pengaturan berhasil disimpan.", "success");
    window.setTimeout(() => setSaved(false), 2200);
  };

  /** Kembalikan semua field ke nilai default */
  const handleReset = () => {
    setThresholds({ ...DEFAULT_THRESHOLDS });
    setNotify({ ...DEFAULT_NOTIFY });
    setIot({ ...DEFAULT_IOT });
    setAi({ ...DEFAULT_AI });
    setSaved(false);
    showToast("Pengaturan dikembalikan ke default.", "info");
  };

  return (
    <div className="flex h-screen overflow-hidden page-shell">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Navbar
          title="Setting"
          subtitle="Konfigurasi ambang batas, notifikasi, IoT, dan AI"
        />

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 page-enter content-stagger">
          {/* ===== 1. Ambang batas sensor ===== */}
          <div className="panel p-3 sm:p-4 card-enter">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal size={16} className="text-hydro-primary" />
              <h2 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                Ambang Batas Sensor
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Field label="pH Minimum" hint="Rentang optimal hidroponik">
                <input
                  className={inputClass()}
                  value={thresholds.phMin}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, phMin: e.target.value })
                  }
                />
              </Field>
              <Field label="pH Maksimum">
                <input
                  className={inputClass()}
                  value={thresholds.phMax}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, phMax: e.target.value })
                  }
                />
              </Field>
              <Field label="EC Minimum (mS/cm)">
                <input
                  className={inputClass()}
                  value={thresholds.ecMin}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, ecMin: e.target.value })
                  }
                />
              </Field>
              <Field label="EC Maksimum (mS/cm)">
                <input
                  className={inputClass()}
                  value={thresholds.ecMax}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, ecMax: e.target.value })
                  }
                />
              </Field>
              <Field label="Suhu Maksimum (°C)">
                <input
                  className={inputClass()}
                  value={thresholds.tempMax}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, tempMax: e.target.value })
                  }
                />
              </Field>
              <Field label="Kelembapan Minimum (%)">
                <input
                  className={inputClass()}
                  value={thresholds.humidityMin}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, humidityMin: e.target.value })
                  }
                />
              </Field>
              <Field label="Cahaya Minimum (Lux)">
                <input
                  className={inputClass()}
                  value={thresholds.lightMin}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, lightMin: e.target.value })
                  }
                />
              </Field>
              <Field label="Level Air Minimum (%)">
                <input
                  className={inputClass()}
                  value={thresholds.waterMin}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, waterMin: e.target.value })
                  }
                />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* ===== 2. Notifikasi ===== */}
            <div className="panel p-3 sm:p-4 card-enter">
              <div className="flex items-center gap-2 mb-3">
                <Bell size={16} className="text-hydro-primary" />
                <h2 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                  Notifikasi
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.85rem] text-hydro-ink font-medium">Peringatan sensor</p>
                    <p className="text-[0.72rem] text-hydro-muted">Saat parameter di luar ambang</p>
                  </div>
                  <Toggle
                    checked={notify.warning}
                    onChange={(v) => setNotify({ ...notify, warning: v })}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.85rem] text-hydro-ink font-medium">Error perangkat</p>
                    <p className="text-[0.72rem] text-hydro-muted">Relay, pompa, atau koneksi gagal</p>
                  </div>
                  <Toggle
                    checked={notify.error}
                    onChange={(v) => setNotify({ ...notify, error: v })}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.85rem] text-hydro-ink font-medium">Rekomendasi AI</p>
                    <p className="text-[0.72rem] text-hydro-muted">Prediksi nutrisi dan air</p>
                  </div>
                  <Toggle
                    checked={notify.ai}
                    onChange={(v) => setNotify({ ...notify, ai: v })}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.85rem] text-hydro-ink font-medium">Status aktuator</p>
                    <p className="text-[0.72rem] text-hydro-muted">Setiap ON/OFF perangkat</p>
                  </div>
                  <Toggle
                    checked={notify.device}
                    onChange={(v) => setNotify({ ...notify, device: v })}
                  />
                </div>
              </div>
            </div>

            {/* ===== 3. Koneksi IoT ===== */}
            <div className="panel p-3 sm:p-4 card-enter">
              <div className="flex items-center gap-2 mb-3">
                <Wifi size={16} className="text-hydro-primary" />
                <h2 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                  Koneksi IoT
                </h2>
              </div>

              <div className="space-y-3">
                <Field label="Nama perangkat">
                  <input
                    className={inputClass()}
                    value={iot.deviceName}
                    onChange={(e) =>
                      setIot({ ...iot, deviceName: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Interval kirim data (detik)"
                  hint="Semakin kecil semakin real-time, tapi beban lebih besar"
                >
                  <input
                    className={inputClass()}
                    value={iot.interval}
                    onChange={(e) =>
                      setIot({ ...iot, interval: e.target.value })
                    }
                  />
                </Field>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div>
                    <p className="text-[0.85rem] text-hydro-ink font-medium">Sinkronisasi cloud</p>
                    <p className="text-[0.72rem] text-hydro-muted">Kirim data ke dashboard cloud</p>
                  </div>
                  <Toggle
                    checked={iot.cloud}
                    onChange={(v) => setIot({ ...iot, cloud: v })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== 4. Pengaturan AI ===== */}
          <div className="panel p-3 sm:p-4 card-enter">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-hydro-primary" />
              <h2 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                Pengaturan AI
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center justify-between gap-3 sm:col-span-1 bg-hydro-accent-soft/40 p-3 rounded-lg border border-hydro-border">
                <div>
                  <p className="text-[0.85rem] text-hydro-ink font-medium">Aktifkan prediksi AI</p>
                  <p className="text-[0.72rem] text-hydro-muted">Decision support, bukan kontrol penuh</p>
                </div>
                <Toggle
                  checked={ai.enabled}
                  onChange={(v) => setAi({ ...ai, enabled: v })}
                />
              </div>

              <Field label="Horizon prediksi (jam)">
                <select
                  className={inputClass()}
                  value={ai.horizon}
                  onChange={(e) => setAi({ ...ai, horizon: e.target.value })}
                  disabled={!ai.enabled}
                >
                  <option value="6">6 jam</option>
                  <option value="12">12 jam</option>
                  <option value="24">24 jam</option>
                </select>
              </Field>

              <Field label="Model dasar" hint="Sesuai proposal PDP: ML sederhana">
                <select
                  className={inputClass()}
                  value={ai.model}
                  onChange={(e) => setAi({ ...ai, model: e.target.value })}
                  disabled={!ai.enabled}
                >
                  <option value="regresi">Regresi Linear</option>
                  <option value="tree">Decision Tree</option>
                  <option value="threshold">Klasifikasi Threshold</option>
                </select>
              </Field>
            </div>
          </div>

          {/* ===== Tombol simpan / reset ===== */}
          <div className="panel p-3 sm:p-4 card-enter flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <p className="text-[0.8rem] text-hydro-muted">
              {saved
                ? "Pengaturan berhasil disimpan."
                : "Ubah nilai lalu simpan. Integrasi API dapat ditambahkan nanti."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="
                  inline-flex items-center justify-center gap-2
                  border border-hydro-border text-hydro-muted
                  px-4 py-2 rounded-lg
                  hover:border-hydro-accent hover:text-hydro-primary transition
                  font-medium text-[0.8rem]
                  cursor-pointer
                "
              >
                <RotateCcw size={15} />
                Reset Default
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="
                  inline-flex items-center justify-center gap-2
                  bg-hydro-primary text-white
                  px-4 py-2 rounded-lg
                  hover:bg-hydro-primary-hover transition
                  font-medium text-[0.8rem]
                  cursor-pointer
                "
              >
                <Save size={15} />
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
