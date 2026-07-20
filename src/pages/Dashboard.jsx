/**
 * Dashboard.jsx — halaman beranda SmartHydro-AI (presentation layer).
 *
 * Untuk apa:
 * 1. Kartu 6 parameter sensor (simulasi real-time tiap 3 detik)
 * 2. Status sistem & perangkat (sinkron DevicesContext)
 * 3. Cuplikan log sistem
 * 4. Ringkasan prediksi AI + rekomendasi
 *
 * Layout: PageShell (Sidebar + Navbar + area scroll).
 */
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/layout";
import {
  useSettings,
  evaluateSensorStatus,
  detectAnomalies,
} from "../context/SettingsContext";
import { useDevices } from "../context/DevicesContext";
import {
  FlaskConical,
  Droplets,
  Thermometer,
  Sun,
  Waves,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Bot,
} from "lucide-react";

/** Map judul kartu → key ambang Setting */
const SENSOR_KEY = {
  "pH Level": "ph",
  "EC / TDS": "ec",
  Suhu: "suhu",
  Kelembapan: "kelembapan",
  Cahaya: "cahaya",
  "Level Air": "levelAir",
};

/** Warna chip status mengikuti nilai (bukan selalu hijau) */
function chipClassForValue(value) {
  const v = String(value).toUpperCase();
  if (["OFFLINE", "ERROR"].includes(v)) return "chip-danger";
  if (v === "OFF") return "chip-danger";
  if (["STANDBY", "MANUAL"].includes(v)) return "chip-muted";
  if (v === "WARNING") return "chip-warn";
  return "chip-ok";
}

/** Baris label–nilai untuk panel Status Sistem */
function Row({ label, value, tone }) {
  return (
    <div className="flex justify-between items-center gap-3 text-[0.8rem]">
      <span className="text-hydro-muted">{label}</span>
      <span
        className={`chip ${tone || chipClassForValue(value)} min-w-[96px] justify-center`}
      >
        {value}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { thresholds, control, iot, ai } = useSettings();
  const { mode, actuators } = useDevices();

  // State nilai sensor (simulasi; nanti diganti fetch API)
  const [sensorData, setSensorData] = useState({
    ph: 5.86,
    ec: 1.62,
    suhu: 24.7,
    kelembapan: 68,
    cahaya: 520,
    levelAir: 78,
  });

  // Simulasi data real-time: acak nilai tiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData({
        ph: (5.5 + Math.random() * 1).toFixed(2),
        ec: (1.3 + Math.random() * 0.5).toFixed(2),
        suhu: (23 + Math.random() * 4).toFixed(1),
        kelembapan: Math.floor(55 + Math.random() * 20),
        cahaya: Math.floor(400 + Math.random() * 150),
        levelAir: Math.floor(65 + Math.random() * 25),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Data yang di-map ke kartu sensor di UI
  const sensors = [
    { title: "pH Level", value: sensorData.ph, unit: "" },
    { title: "EC / TDS", value: sensorData.ec, unit: "mS/cm" },
    { title: "Suhu", value: sensorData.suhu, unit: "°C" },
    { title: "Kelembapan", value: sensorData.kelembapan, unit: "%" },
    { title: "Cahaya", value: sensorData.cahaya, unit: "Lux" },
    { title: "Level Air", value: sensorData.levelAir, unit: "%" },
  ];

  const anomalies = useMemo(
    () => detectAnomalies(sensorData, thresholds),
    [sensorData, thresholds]
  );

  const cloudLabel =
    iot.platform === "mqtt" ? "MQTT" : "Cloud";


  return (
    <PageShell>
          {/* ===== Kartu monitoring 6 parameter sensor ===== */}
          <div className="panel overflow-hidden p-0 card-enter">
            <div className="panel-header">
              <div className="min-w-0">
                <h2 className="section-title">Monitoring Parameter Hidroponik</h2>
                <p className="section-sub mt-0.5">Data sensor real-time (simulasi)</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/monitoring")}
                className="btn-link shrink-0"
              >
                Lihat Monitoring
              </button>
            </div>

            <div className="panel-body">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3">
                {sensors.map((sensor, index) => {
                  const status = evaluateSensorStatus(
                    SENSOR_KEY[sensor.title],
                    sensor.value,
                    thresholds
                  );
                  return (
                    <div
                      key={index}
                      className="sensor-tile"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1 text-hydro-primary">
                        {sensor.title === "pH Level" && <FlaskConical size={14} />}
                        {sensor.title === "EC / TDS" && <Droplets size={14} />}
                        {sensor.title === "Suhu" && <Thermometer size={14} />}
                        {sensor.title === "Kelembapan" && <Droplets size={14} />}
                        {sensor.title === "Cahaya" && <Sun size={14} />}
                        {sensor.title === "Level Air" && <Waves size={14} />}

                        <h3 className="text-[0.72rem] font-medium text-hydro-muted">
                          {sensor.title}
                        </h3>
                      </div>

                      <div className="flex items-end justify-center gap-1 mt-1.5">
                        <span
                          key={sensor.value}
                          className="font-display text-xl font-semibold text-hydro-ink tabular-nums value-tick"
                        >
                          {sensor.value}
                        </span>

                        <span className="text-[0.7rem] text-hydro-muted mb-0.5">
                          {sensor.unit}
                        </span>
                      </div>

                      <div className="flex justify-center mt-2">
                        <span
                          className={`chip ${
                            status === "Optimal" ? "chip-ok" : "chip-warn"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===== Status perangkat + cuplikan log ===== */}
          <div className="grid grid-cols-12 gap-2 sm:gap-3 items-start">
            <div className="col-span-12 lg:col-span-4 panel overflow-hidden p-0 card-enter h-fit">
              <div className="panel-header">
                <div className="min-w-0">
                  <h2 className="section-title">Status Sistem & Perangkat</h2>
                  <p className="section-sub mt-0.5">
                    Mode, aktuator, dan koneksi IoT
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/device-control")}
                  className="btn-link shrink-0"
                >
                  Device Control
                </button>
              </div>

              <div className="panel-body space-y-2.5">
                <Row label="Mode Sistem" value={mode} />
                <Row
                  label="Rule-based"
                  value={control.autoRuleBased ? "ON" : "OFF"}
                  tone={control.autoRuleBased ? "chip-ok" : "chip-muted"}
                />
                <Row
                  label="Pompa Nutrisi"
                  value={actuators.pompaNutrisi ? "ON" : "OFF"}
                />
                <Row
                  label="Pompa Air"
                  value={actuators.pompaAir ? "ON" : "OFF"}
                />
                <Row
                  label="Relay Tandon"
                  value={actuators.relayTandon ? "ON" : "OFF"}
                />
                <Row
                  label="Servo Nutrisi"
                  value={actuators.servoNutrisi ? "ON" : "STANDBY"}
                />
                <Row
                  label={`IoT (${cloudLabel})`}
                  value={iot.cloud ? "Online" : "Offline"}
                />
              </div>
            </div>

            {/* LOG */}
            <div className="col-span-12 lg:col-span-8 panel overflow-hidden p-0 card-enter h-fit">
              <div className="panel-header">
                <div className="min-w-0">
                  <h2 className="section-title">Log Sistem</h2>
                  <p className="section-sub mt-0.5">
                    Cuplikan aktivitas terbaru
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/log")}
                  className="btn-link shrink-0"
                >
                  Lihat Log
                </button>
              </div>

              <div className="panel-body">
<div className="max-h-[220px] overflow-y-auto table-scroll">
  <table className="hydro-table min-w-[560px]">
    <thead>
      <tr>
        <th className="w-8"></th>
        <th>Waktu</th>
        <th>Level</th>
        <th>Sumber</th>
        <th>Pesan</th>
        <th>Tipe</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <CheckCircle2
            size={14}
            className="mx-auto text-hydro-primary"
          />
        </td>
        <td>
          10:23
        </td>
        <td>
          INFO
        </td>
        <td>
          Sistem
        </td>
        <td>
          Pompa nutrisi dinyalakan otomatis
        </td>
        <td>
          Aktuasi
        </td>
      </tr>

      <tr>
        <td>
          <CheckCircle2
            size={14}
            className="mx-auto text-hydro-primary"
          />
        </td>
        <td>
          10:45
        </td>
        <td>
          INFO
        </td>
        <td>
          Sistem
        </td>
        <td>
          Pengisian air otomatis 2,5 Liter
        </td>
        <td>
          Aktuasi
        </td>
      </tr>

      <tr>
        <td>
          <AlertTriangle
            size={14}
            className="mx-auto text-hydro-warn"
          />
        </td>
        <td>
          09:30
        </td>
        <td>
          WARNING
        </td>
        <td>
          Sensor pH
        </td>
        <td>
          pH turun, penyesuaian otomatis dilakukan
        </td>
        <td>
          Peringatan
        </td>
      </tr>

      <tr>
        <td>
          <Bot
            size={14}
            className="mx-auto text-hydro-accent"
          />
        </td>
        <td>
          08:15
        </td>
        <td>
          INFO
        </td>
        <td>
          AI Prediction
        </td>
        <td>
          AI prediksi kebutuhan nutrisi dijalankan
        </td>
        <td>
          AI
        </td>
      </tr>

      <tr>
        <td>
          <CheckCircle2
            size={14}
            className="mx-auto text-hydro-primary"
          />
        </td>
        <td>
          07:20
        </td>
        <td>
          INFO
        </td>
        <td>
          Sistem
        </td>
        <td>
          Suhu kembali normal
        </td>
        <td>
          Sensor
        </td>
      </tr>
    </tbody>
  </table>
</div>
              </div>
            </div>
          </div>

          {/* AI */}
          <div className="panel overflow-hidden p-0 card-enter">
            <div className="panel-header">
              <div className="min-w-0">
                <h2 className="section-title flex items-center gap-2">
                  <Brain size={16} />
                  Prediksi AI
                </h2>
                <p className="section-sub mt-0.5">
                  Ringkasan kebutuhan nutrisi, air, dan kondisi
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/ai-prediction")}
                className="btn-link shrink-0"
              >
                Buka AI Prediction
              </button>
            </div>

            <div className="panel-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 items-start">
                <div className="border border-hydro-border rounded-xl p-3 bg-white/70 h-fit">
                  <h3 className="font-display font-medium text-[0.85rem] text-hydro-ink">
                    Prediksi Kebutuhan Nutrisi
                  </h3>

                  <div className="font-display text-2xl font-semibold mt-2 text-hydro-primary">
                    320 ml
                  </div>

                  <div className="mt-2 text-[0.75rem] text-hydro-muted">
                    Confidence: 92%
                  </div>

                  <div className="w-full h-2 bg-hydro-bg2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-2 bg-hydro-primary rounded-full bar-fill"
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>

                <div className="border border-hydro-border rounded-xl p-3 bg-white/70 h-fit">
                  <h3 className="font-display font-medium text-[0.85rem] text-hydro-ink">
                    Prediksi Kebutuhan Air
                  </h3>

                  <div className="font-display text-2xl font-semibold mt-2 text-hydro-accent">
                    2.4 L
                  </div>

                  <div className="mt-2 text-[0.75rem] text-hydro-muted">
                    Confidence: 89%
                  </div>

                  <div className="w-full h-2 bg-hydro-bg2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-2 bg-hydro-accent rounded-full bar-fill"
                      style={{ width: "89%" }}
                    />
                  </div>
                </div>

                <div className="border border-hydro-border rounded-xl p-3 bg-white/70 h-fit">
                  <h3 className="font-display font-medium text-[0.85rem] text-hydro-ink">
                    Deteksi Kondisi
                  </h3>

                  <div
                    className={`mt-2 flex items-center gap-2 ${
                      anomalies.length ? "text-hydro-warn" : "text-hydro-primary"
                    }`}
                  >
                    {anomalies.length ? (
                      <AlertTriangle size={22} />
                    ) : (
                      <CheckCircle2 size={22} />
                    )}
                    <span className="font-display font-semibold text-[0.95rem]">
                      {anomalies.length ? "ANOMALI" : "NORMAL"}
                    </span>
                  </div>
                  <p className="text-[0.75rem] text-hydro-muted mt-2 leading-snug">
                    {anomalies.length
                      ? `${anomalies[0].label}${
                          anomalies.length > 1 ? ` (+${anomalies.length - 1})` : ""
                        }`
                      : "Semua parameter dalam batas aman"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* REKOMENDASI */}
          <div className="panel overflow-hidden p-0 card-enter">
            <div className="panel-header">
              <div className="min-w-0">
                <h2 className="section-title">Rekomendasi AI</h2>
                <p className="section-sub mt-0.5">
                  {ai.enabled
                    ? "Decision support untuk koreksi nutrisi & air"
                    : "Modul AI nonaktif di Setting"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/ai-prediction")}
                className="btn-link shrink-0"
              >
                Lihat AI Prediction
              </button>
            </div>

            <div className="panel-body">
              <p className="text-[0.85rem] text-hydro-muted leading-relaxed">
                {!ai.enabled
                  ? "Prediksi AI dinonaktifkan. Aktifkan di Setting untuk menampilkan rekomendasi korektif."
                  : anomalies.length
                    ? `Terdeteksi ${anomalies.length} anomali (${anomalies
                        .map((a) => a.label)
                        .join(", ")}). AI merekomendasikan koreksi nutrisi/air — decision support, bukan kontrol penuh.`
                    : "Sistem dalam kondisi normal. AI merekomendasikan penambahan nutrisi sebanyak 160 ml dalam 3 jam ke depan untuk menjaga kestabilan larutan."}
              </p>
            </div>
          </div>
    </PageShell>
  );
}
