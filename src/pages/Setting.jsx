/**
 * Setting.jsx — halaman konfigurasi sistem SmartHydro-AI.
 *
 * Untuk apa:
 * 1. Ambang batas sensor (min–max, dikelompokkan per parameter)
 * 2. Kontrol rule-based + notifikasi (kolom kiri)
 * 3. Koneksi IoT MQTT (kolom kanan)
 * 4. AI Setting (decision support)
 *
 * Input numerik difilter: float (ambang), integer (port/interval).
 * Disimpan via SettingsContext → localStorage (belum API).
 * Layout: PageShell.
 */
import { useEffect, useState } from "react";
import { PageShell } from "../components/layout";
import { ThemeSelect } from "../components/ui";
import { useToast } from "../context/ToastContext";
import {
  useSettings,
  DEFAULT_THRESHOLDS,
  DEFAULT_NOTIFY,
  DEFAULT_IOT,
  DEFAULT_AI,
  DEFAULT_CONTROL,
} from "../context/SettingsContext";
import {
  sanitizeFloat,
  sanitizeInteger,
  sanitizeString,
} from "../utils/validation";
import {
  SlidersHorizontal,
  Bell,
  Wifi,
  Brain,
  Save,
  RotateCcw,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const PLATFORM_OPTIONS = [
  { value: "mqtt", label: "MQTT Broker" },
  { value: "custom", label: "Custom / REST Dashboard" },
];

const HORIZON_OPTIONS = [
  { value: "6", label: "6 jam" },
  { value: "12", label: "12 jam" },
  { value: "24", label: "24 jam" },
];

const MODEL_OPTIONS = [
  { value: "regresi", label: "Regresi Linear" },
  { value: "tree", label: "Decision Tree" },
  { value: "threshold", label: "Klasifikasi Threshold" },
];

/** Pasangan min–max per parameter (layout ambang lebih rapi) */
const THRESHOLD_GROUPS = [
  {
    title: "pH",
    unit: "",
    minKey: "phMin",
    maxKey: "phMax",
    hint: "Rentang optimal hidroponik",
  },
  {
    title: "EC / TDS",
    unit: "mS/cm",
    minKey: "ecMin",
    maxKey: "ecMax",
  },
  {
    title: "Suhu",
    unit: "°C",
    minKey: "tempMin",
    maxKey: "tempMax",
  },
  {
    title: "Kelembapan",
    unit: "%",
    minKey: "humidityMin",
    maxKey: "humidityMax",
  },
  {
    title: "Cahaya",
    unit: "Lux",
    minKey: "lightMin",
    maxKey: "lightMax",
  },
  {
    title: "Level Air",
    unit: "%",
    minKey: "waterMin",
    maxKey: "waterMax",
  },
];

/** Toggle switch ON/OFF bertema SmartHydro */
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer shrink-0
        ${checked ? "bg-hydro-primary" : "bg-hydro-border"}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
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

/** Label + kontrol form + hint opsional */
function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5 min-w-0">
      <label className="block text-[0.78rem] font-medium text-hydro-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-[0.78rem] text-hydro-muted leading-snug">{hint}</p>
      ) : null}
    </div>
  );
}

/** Baris toggle: judul + deskripsi kiri, switch kanan */
function ToggleRow({ title, desc, checked, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-[0.88rem] text-hydro-ink font-medium leading-snug">
          {title}
        </p>
        {desc ? (
          <p className="text-[0.78rem] text-hydro-muted mt-0.5 leading-snug">
            {desc}
          </p>
        ) : null}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

function inputClass() {
  return `
    w-full rounded-xl
    px-3 py-2 text-[0.88rem]
    bg-white/90 text-hydro-ink
    border border-hydro-border
    hover:border-hydro-accent hover:bg-hydro-accent-soft/70
    focus:outline-none focus:border-hydro-accent focus:bg-hydro-accent-soft/70
    focus:shadow-[0_0_0_3px_rgba(42,174,160,0.12)]
    transition
  `;
}

/** Judul section biasa (ikon + teks) — tanpa panel-header berwarna */
function SectionTitle({ icon, title, sub }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <span className="text-hydro-primary shrink-0">{icon}</span>
        <h2 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
          {title}
        </h2>
      </div>
      {sub ? (
        <p className="text-[0.82rem] text-hydro-muted mt-1.5 leading-snug">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export default function Setting() {
  const { showToast } = useToast();
  const savedSettings = useSettings();

  // Draft lokal — baru diterapkan ke context saat Simpan
  const [thresholds, setThresholds] = useState({ ...savedSettings.thresholds });
  const [notify, setNotify] = useState({ ...savedSettings.notify });
  const [iot, setIot] = useState({ ...savedSettings.iot });
  const [ai, setAi] = useState({ ...savedSettings.ai });
  const [control, setControl] = useState({ ...savedSettings.control });
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Sinkron draft jika context berubah dari luar
  useEffect(() => {
    setThresholds({ ...savedSettings.thresholds });
    setNotify({ ...savedSettings.notify });
    setIot({ ...savedSettings.iot });
    setAi({ ...savedSettings.ai });
    setControl({ ...savedSettings.control });
  }, [
    savedSettings.thresholds,
    savedSettings.notify,
    savedSettings.iot,
    savedSettings.ai,
    savedSettings.control,
  ]);

  const setThreshold = (key, value) => {
    setThresholds((prev) => ({ ...prev, [key]: sanitizeFloat(value) }));
  };

  const setIotField = (key, value, sanitize = (v) => v) => {
    setIot((prev) => ({ ...prev, [key]: sanitize(value) }));
  };

  /** Simpan singkat — spinner di tombol saja */
  const handleSave = () => {
    if (saving || resetting) return;
    setSaving(true);
    window.setTimeout(() => {
      savedSettings.saveAll({ thresholds, notify, iot, ai, control });
      showToast("Setting berhasil disimpan.", "success");
      setSaving(false);
    }, 180);
  };

  const handleReset = () => {
    if (saving || resetting) return;
    setResetting(true);
    window.setTimeout(() => {
      setThresholds({ ...DEFAULT_THRESHOLDS });
      setNotify({ ...DEFAULT_NOTIFY });
      setIot({ ...DEFAULT_IOT });
      setAi({ ...DEFAULT_AI });
      setControl({ ...DEFAULT_CONTROL });
      savedSettings.resetAll();
      showToast("Setting dikembalikan ke default.", "info");
      setResetting(false);
    }, 180);
  };

  return (
    <PageShell
      title="Setting"
      subtitle="Konfigurasi ambang batas, notifikasi, IoT, dan AI"
    >
      {/* ===== 1. Ambang batas — dikelompokkan Min/Max per sensor ===== */}
      <div className="panel p-3 sm:p-4 card-enter">
        <SectionTitle
          icon={<SlidersHorizontal size={16} />}
          title="Ambang Batas Sensor"
          sub="Dipakai untuk status Optimal/Perlu cek dan deteksi anomali (rule-based)."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {THRESHOLD_GROUPS.map((group) => (
            <div
              key={group.title}
              className="rounded-xl border border-hydro-border/80 bg-hydro-bg2/35 p-3"
            >
              <div className="flex items-baseline justify-between gap-2 mb-2.5">
                <p className="text-[0.88rem] font-semibold text-hydro-ink">
                  {group.title}
                </p>
                {group.unit ? (
                  <span className="text-[0.78rem] text-hydro-muted tabular-nums">
                    {group.unit}
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Minimum">
                  <input
                    className={inputClass()}
                    value={thresholds[group.minKey]}
                    inputMode="decimal"
                    onChange={(e) => setThreshold(group.minKey, e.target.value)}
                  />
                </Field>
                <Field label="Maksimum">
                  <input
                    className={inputClass()}
                    value={thresholds[group.maxKey]}
                    inputMode="decimal"
                    onChange={(e) => setThreshold(group.maxKey, e.target.value)}
                  />
                </Field>
              </div>
              {group.hint ? (
                <p className="text-[0.78rem] text-hydro-muted mt-2 leading-snug">
                  {group.hint}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* ===== 2. Kiri: Kontrol + Notifikasi | Kanan: IoT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
        <div className="space-y-3 min-w-0">
          {/* Kontrol rule-based */}
          <div className="panel p-3 sm:p-4 card-enter h-fit">
            <SectionTitle
              icon={<ShieldCheck size={16} />}
              title="Kontrol Otomatis"
              sub="Rule-based saat mode AUTO"
            />
            <ToggleRow
              title="Aktuasi otomatis saat ambang kritis"
              desc="Pompa, relay, dan servo merespons parameter di luar batas."
              checked={control.autoRuleBased}
              onChange={(v) => setControl({ ...control, autoRuleBased: v })}
            />
          </div>

          {/* Notifikasi */}
          <div className="panel p-3 sm:p-4 card-enter h-fit">
            <SectionTitle
              icon={<Bell size={16} />}
              title="Notifikasi"
              sub="Jenis pemberitahuan yang ditampilkan"
            />
            <div className="divide-y divide-hydro-border/70">
              <ToggleRow
                title="Peringatan sensor"
                desc="Saat parameter di luar ambang"
                checked={notify.warning}
                onChange={(v) => setNotify({ ...notify, warning: v })}
              />
              <ToggleRow
                title="Error perangkat"
                desc="Relay, pompa, atau koneksi gagal"
                checked={notify.error}
                onChange={(v) => setNotify({ ...notify, error: v })}
              />
              <ToggleRow
                title="Rekomendasi AI"
                desc="Prediksi nutrisi dan air"
                checked={notify.ai}
                onChange={(v) => setNotify({ ...notify, ai: v })}
              />
              <ToggleRow
                title="Status aktuator"
                desc="Setiap ON/OFF perangkat"
                checked={notify.device}
                onChange={(v) => setNotify({ ...notify, device: v })}
              />
            </div>
          </div>
        </div>

        {/* Koneksi IoT */}
        <div className="panel p-3 sm:p-4 card-enter h-fit min-w-0">
          <SectionTitle
            icon={<Wifi size={16} />}
            title="Koneksi IoT"
            sub="Pengaturan perangkat dan alamat server untuk pengiriman data sensor"
          />
          <div className="space-y-3">
            <Field label="Nama perangkat" hint="Maks. 64 karakter">
              <input
                className={inputClass()}
                value={iot.deviceName}
                maxLength={64}
                onChange={(e) =>
                  setIotField("deviceName", e.target.value, (v) =>
                    sanitizeString(v, 64)
                  )
                }
              />
            </Field>
            <Field
              label="Platform IoT"
              hint="Pilih cara perangkat terhubung ke sistem"
            >
              <ThemeSelect
                value={iot.platform}
                onChange={(v) => setIot({ ...iot, platform: v })}
                options={PLATFORM_OPTIONS}
                aria-label="Platform IoT"
              />
            </Field>
            <div className="grid grid-cols-[1fr_5.5rem] gap-2.5">
              <Field
                label="Alamat broker"
                hint="Contoh: broker.emqx.io"
              >
                <input
                  className={inputClass()}
                  value={iot.mqttBroker}
                  maxLength={128}
                  onChange={(e) =>
                    setIotField("mqttBroker", e.target.value, (v) =>
                      sanitizeString(v, 128)
                    )
                  }
                />
              </Field>
              <Field label="Port">
                <input
                  className={inputClass()}
                  value={iot.mqttPort ?? "1883"}
                  inputMode="numeric"
                  onChange={(e) =>
                    setIotField("mqttPort", e.target.value, sanitizeInteger)
                  }
                />
              </Field>
            </div>
            <Field label="Interval kirim data (detik)">
              <input
                className={inputClass()}
                value={iot.interval}
                inputMode="numeric"
                onChange={(e) =>
                  setIotField("interval", e.target.value, sanitizeInteger)
                }
              />
            </Field>
            <div className="pt-1 border-t border-hydro-border/70">
              <ToggleRow
                title="Status koneksi"
                desc="Aktifkan jika perangkat sudah terhubung"
                checked={iot.cloud}
                onChange={(v) => setIot({ ...iot, cloud: v })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3. AI Setting ===== */}
      <div className="panel p-3 sm:p-4 card-enter">
        <SectionTitle
          icon={<Brain size={16} />}
          title="AI Setting"
          sub="Decision support — prediksi kebutuhan nutrisi & air"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:items-stretch">
          {/* Toggle AI — konten vertikal di tengah card */}
          <div className="rounded-xl border border-hydro-border/80 bg-hydro-accent-soft/30 px-3 py-3 flex flex-col justify-center min-h-full">
            <div className="divide-y divide-hydro-border/60">
              <ToggleRow
                title="Aktifkan prediksi AI"
                desc="Early prediction kebutuhan nutrisi/air"
                checked={ai.enabled}
                onChange={(v) => setAi({ ...ai, enabled: v })}
              />
              <ToggleRow
                title="Decision support only"
                desc="Bukan kontrol penuh (TKT 3)"
                checked={ai.decisionSupportOnly}
                onChange={(v) => setAi({ ...ai, decisionSupportOnly: v })}
                disabled={!ai.enabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 content-center">
            <Field label="Horizon prediksi">
              <ThemeSelect
                value={ai.horizon}
                onChange={(v) => setAi({ ...ai, horizon: v })}
                options={HORIZON_OPTIONS}
                disabled={!ai.enabled}
                aria-label="Horizon prediksi"
              />
            </Field>
            <Field label="Model dasar">
              <ThemeSelect
                value={ai.model}
                onChange={(v) => setAi({ ...ai, model: v })}
                options={MODEL_OPTIONS}
                disabled={!ai.enabled}
                aria-label="Model AI"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ===== Aksi simpan / reset ===== */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-0.5 pb-1">
        <button
          type="button"
          onClick={handleReset}
          disabled={saving || resetting}
          className="btn-secondary"
        >
          {resetting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <RotateCcw size={15} />
          )}
          {resetting ? "Mereset..." : "Reset Default"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || resetting}
          className="btn-primary"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? "Menyimpan..." : "Simpan Setting"}
        </button>
      </div>
    </PageShell>
  );
}
