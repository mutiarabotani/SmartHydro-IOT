/**
 * SettingsContext.jsx — pengaturan global SmartHydro-AI (application state).
 *
 * Untuk apa:
 * - Ambang batas sensor (Optimal / Perlu cek / anomali)
 * - Notifikasi, koneksi IoT MQTT, pengaturan AI, rule-based control
 * - Persist localStorage; dipakai lintas halaman Setting, Dashboard, dll
 * - Helper: evaluateSensorStatus, detectAnomalies
 *
 * Nanti bisa diganti sinkronisasi API/backend.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "smarthydro-settings-v1";

/** Ambang batas sensor (sesuai proposal: rule-based kritis) */
export const DEFAULT_THRESHOLDS = {
  phMin: "5.5",
  phMax: "6.5",
  ecMin: "1.2",
  ecMax: "2.0",
  tempMin: "22",
  tempMax: "28",
  humidityMin: "50",
  humidityMax: "80",
  lightMin: "300",
  lightMax: "1000",
  waterMin: "40",
  waterMax: "95",
};

export const DEFAULT_NOTIFY = {
  warning: true,
  error: true,
  ai: true,
  device: false,
};

/** Koneksi IoT — selaras smart-hydro: ESP → MQTT broker → backend → REST dashboard */
export const DEFAULT_IOT = {
  deviceName: "SmartHydro-Node-01",
  interval: "5",
  cloud: true,
  platform: "mqtt",
  mqttBroker: "broker.emqx.io",
  mqttPort: "1883",
};

/** AI = decision support, bukan kontrol penuh (proposal TKT 3) */
export const DEFAULT_AI = {
  enabled: true,
  horizon: "24",
  model: "regresi",
  decisionSupportOnly: true,
};

/** Kontrol otomatis berbasis ambang (rule-based) */
export const DEFAULT_CONTROL = {
  autoRuleBased: true,
};

const DEFAULT_SETTINGS = {
  thresholds: DEFAULT_THRESHOLDS,
  notify: DEFAULT_NOTIFY,
  iot: DEFAULT_IOT,
  ai: DEFAULT_AI,
  control: DEFAULT_CONTROL,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw);
    const iot = { ...DEFAULT_IOT, ...parsed.iot };
    // Migrasi lama: opsi Blynk diganti MQTT (arsitektur smart-hydro)
    if (iot.platform === "blynk") {
      iot.platform = "mqtt";
    }
    delete iot.blynkToken;
    return {
      thresholds: { ...DEFAULT_THRESHOLDS, ...parsed.thresholds },
      notify: { ...DEFAULT_NOTIFY, ...parsed.notify },
      iot,
      ai: { ...DEFAULT_AI, ...parsed.ai },
      control: { ...DEFAULT_CONTROL, ...parsed.control },
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

/**
 * Evaluasi status satu parameter terhadap ambang Setting.
 * @returns {"Optimal"|"Perlu cek"}
 */
export function evaluateSensorStatus(key, value, thresholds) {
  const v = Number(value);
  const n = (x) => Number(x);
  const t = thresholds || DEFAULT_THRESHOLDS;

  if (Number.isNaN(v)) return "Perlu cek";

  switch (key) {
    case "ph":
      return v >= n(t.phMin) && v <= n(t.phMax) ? "Optimal" : "Perlu cek";
    case "ec":
      return v >= n(t.ecMin) && v <= n(t.ecMax) ? "Optimal" : "Perlu cek";
    case "suhu":
      return v >= n(t.tempMin) && v <= n(t.tempMax) ? "Optimal" : "Perlu cek";
    case "kelembapan":
      return v >= n(t.humidityMin) && v <= n(t.humidityMax) ? "Optimal" : "Perlu cek";
    case "cahaya":
      return v >= n(t.lightMin) && v <= n(t.lightMax) ? "Optimal" : "Perlu cek";
    case "levelAir":
      return v >= n(t.waterMin) && v <= n(t.waterMax) ? "Optimal" : "Perlu cek";
    default:
      return "Optimal";
  }
}

/**
 * Deteksi anomali sederhana (proposal: penyimpangan pH, kekurangan nutrisi, dll).
 * @returns {Array<{ key: string, label: string, message: string }>}
 */
export function detectAnomalies(sensors, thresholds) {
  const t = thresholds || DEFAULT_THRESHOLDS;
  const n = (x) => Number(x);
  const list = [];

  const ph = n(sensors.ph);
  const ec = n(sensors.ec);
  const suhu = n(sensors.suhu);
  const hum = n(sensors.kelembapan);
  const light = n(sensors.cahaya);
  const water = n(sensors.levelAir);

  if (ph < n(t.phMin)) {
    list.push({
      key: "ph_low",
      label: "pH rendah",
      message: `pH ${ph} di bawah ambang ${t.phMin}`,
    });
  } else if (ph > n(t.phMax)) {
    list.push({
      key: "ph_high",
      label: "pH tinggi",
      message: `pH ${ph} di atas ambang ${t.phMax}`,
    });
  }

  if (ec < n(t.ecMin)) {
    list.push({
      key: "ec_low",
      label: "Nutrisi kurang",
      message: `EC/TDS ${ec} di bawah ambang ${t.ecMin} mS/cm`,
    });
  } else if (ec > n(t.ecMax)) {
    list.push({
      key: "ec_high",
      label: "Nutrisi berlebih",
      message: `EC/TDS ${ec} di atas ambang ${t.ecMax} mS/cm`,
    });
  }

  if (water < n(t.waterMin)) {
    list.push({
      key: "water_low",
      label: "Level air rendah",
      message: `Level air ${water}% di bawah ambang ${t.waterMin}%`,
    });
  }

  if (suhu < n(t.tempMin) || suhu > n(t.tempMax)) {
    list.push({
      key: "temp",
      label: "Suhu di luar rentang",
      message: `Suhu ${suhu}°C di luar ${t.tempMin}–${t.tempMax}°C`,
    });
  }

  if (hum < n(t.humidityMin) || hum > n(t.humidityMax)) {
    list.push({
      key: "humidity",
      label: "Kelembapan di luar rentang",
      message: `Kelembapan ${hum}% di luar ${t.humidityMin}–${t.humidityMax}%`,
    });
  }

  if (light < n(t.lightMin) || light > n(t.lightMax)) {
    list.push({
      key: "light",
      label: "Cahaya di luar rentang",
      message: `Cahaya ${light} Lux di luar ${t.lightMin}–${t.lightMax} Lux`,
    });
  }

  return list;
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings());

  // Persist tiap perubahan
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore quota */
    }
  }, [settings]);

  const updateThresholds = useCallback((next) => {
    setSettings((s) => ({
      ...s,
      thresholds: typeof next === "function" ? next(s.thresholds) : next,
    }));
  }, []);

  const updateNotify = useCallback((next) => {
    setSettings((s) => ({
      ...s,
      notify: typeof next === "function" ? next(s.notify) : next,
    }));
  }, []);

  const updateIot = useCallback((next) => {
    setSettings((s) => ({
      ...s,
      iot: typeof next === "function" ? next(s.iot) : next,
    }));
  }, []);

  const updateAi = useCallback((next) => {
    setSettings((s) => ({
      ...s,
      ai: typeof next === "function" ? next(s.ai) : next,
    }));
  }, []);

  const updateControl = useCallback((next) => {
    setSettings((s) => ({
      ...s,
      control: typeof next === "function" ? next(s.control) : next,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setSettings(structuredClone(DEFAULT_SETTINGS));
  }, []);

  const saveAll = useCallback((bundle) => {
    setSettings({
      thresholds: { ...DEFAULT_THRESHOLDS, ...bundle.thresholds },
      notify: { ...DEFAULT_NOTIFY, ...bundle.notify },
      iot: { ...DEFAULT_IOT, ...bundle.iot },
      ai: { ...DEFAULT_AI, ...bundle.ai },
      control: { ...DEFAULT_CONTROL, ...bundle.control },
    });
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      updateThresholds,
      updateNotify,
      updateIot,
      updateAi,
      updateControl,
      resetAll,
      saveAll,
    }),
    [
      settings,
      updateThresholds,
      updateNotify,
      updateIot,
      updateAi,
      updateControl,
      resetAll,
      saveAll,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings harus dipakai di dalam SettingsProvider");
  }
  return ctx;
}
