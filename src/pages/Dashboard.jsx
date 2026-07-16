/**
 * Dashboard.jsx — halaman beranda SmartHydro-AI.
 *
 * Menampilkan:
 * 1. Kartu 6 parameter sensor (data simulasi real-time tiap 3 detik)
 * 2. Status sistem & perangkat
 * 3. Cuplikan log sistem
 * 4. Ringkasan prediksi AI + rekomendasi
 *
 * Layout: Sidebar + Navbar sticky; hanya area konten yang di-scroll.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";
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

/** Baris label–nilai untuk panel Status Sistem */
function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center text-[0.8rem] text-hydro-muted">
      <span>{label}</span>

      <div
        className="
        border
        border-hydro-border
        bg-hydro-accent-soft
        text-hydro-primary
        font-medium
        px-2.5
        py-0.5
        min-w-[110px]
        text-center
        rounded-md
        text-[0.78rem]
        "
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Tentukan status baca sensor berdasarkan ambang batas sederhana.
 * Mengembalikan "Optimal" atau "Perlu cek".
 */
function sensorStatus(title, value) {
  const v = Number(value);
  if (title === "pH Level") return v >= 5.5 && v <= 6.5 ? "Optimal" : "Perlu cek";
  if (title === "EC / TDS") return v >= 1.2 && v <= 2.0 ? "Optimal" : "Perlu cek";
  if (title === "Suhu") return v >= 22 && v <= 28 ? "Optimal" : "Perlu cek";
  if (title === "Kelembapan") return v >= 50 && v <= 80 ? "Optimal" : "Perlu cek";
  if (title === "Cahaya") return v >= 300 ? "Optimal" : "Perlu cek";
  if (title === "Level Air") return v >= 40 ? "Optimal" : "Perlu cek";
  return "Optimal";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

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

  /** Tombol rekomendasi → buka Device Control */
  const openDevices = () => {
    showToast("Membuka kontrol perangkat...", "info");
    navigate("/device-control");
  };

  return (
    <div className="flex h-screen overflow-hidden page-shell">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 page-enter content-stagger">
          {/* ===== Kartu monitoring 6 parameter sensor ===== */}
          <div className="panel p-4 card-enter">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                Monitoring Parameter Hidroponik
              </h2>
              <button
                type="button"
                onClick={() => navigate("/monitoring")}
                className="text-[0.75rem] font-medium text-hydro-primary hover:underline cursor-pointer"
              >
                Lihat detail
              </button>
            </div>

            <div
              className="
              grid
              grid-cols-2
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-3
              xl:grid-cols-6
              gap-2
              sm:gap-3
              "
            >
              {sensors.map((sensor, index) => (
                <div
                key={index}
                className="
                bg-white/80
                border
                border-hydro-border
                rounded-lg
                p-3
                hover:border-hydro-accent
                hover:shadow-sm
                transition
                "
                style={{ animationDelay: `${index * 40}ms` }}
                >
                <div className="flex items-center justify-center gap-1.5 mb-1 text-hydro-primary">
                {sensor.title === "pH Level" && <FlaskConical size={14} />}
                {sensor.title === "EC / TDS" && <Droplets size={14} />}
                {sensor.title === "Suhu" && <Thermometer size={14} />}
                {sensor.title === "Kelembapan" && <Droplets size={14} />}
                {sensor.title === "Cahaya" && <Sun size={14} />}
                {sensor.title === "Level Air" && <Waves size={14} />}

                <h3 className="text-[0.72rem] text-hydro-muted">
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

                  <div
                    className={`w-full text-[0.72rem] mt-1.5 text-center font-medium ${
                      sensorStatus(sensor.title, sensor.value) === "Optimal"
                        ? "text-hydro-primary"
                        : "text-hydro-warn"
                    }`}
                  >
                    {sensorStatus(sensor.title, sensor.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Status perangkat + cuplikan log ===== */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 lg:col-span-4 panel p-4 card-enter">
              <h2 className="font-display font-semibold text-[0.95rem] mb-3 text-hydro-ink">
                Status Sistem & Perangkat
              </h2>

              <div className="space-y-2.5">
                <Row
                  label="Mode Sistem"
                  value="OTOMATIS"
                />

                <Row
                  label="Pompa Nutrisi"
                  value="AKTIF"
                />

                <Row
                  label="Pompa Air"
                  value="AKTIF"
                />

                <Row
                  label="Relay"
                  value="AKTIF"
                />

                <Row
                  label="Koneksi Cloud"
                  value="TERHUBUNG"
                />
              </div>
            </div>

            {/* LOG */}
            <div className="col-span-12 lg:col-span-8 panel p-4 card-enter">

            <div className="flex items-center justify-between gap-2 mb-2.5">
              <h2 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                Log Sistem
              </h2>
              <button
                type="button"
                onClick={() => navigate("/log")}
                className="text-[0.75rem] font-medium text-hydro-primary hover:underline cursor-pointer"
              >
                Lihat semua
              </button>
            </div>

<div className="max-h-[220px] overflow-y-auto table-scroll">
  <table className="w-full min-w-[560px] text-[0.78rem] border border-hydro-border border-collapse">
    <thead>
      <tr className="bg-hydro-accent-soft/60">
        <th className="border border-hydro-border w-8 py-1.5"></th>
        <th className="border border-hydro-border text-center py-1.5 px-2 text-hydro-muted font-medium">
          Waktu
        </th>
        <th className="border border-hydro-border text-center py-1.5 px-2 text-hydro-muted font-medium">
          Level
        </th>
        <th className="border border-hydro-border text-center py-1.5 px-2 text-hydro-muted font-medium">
          Sumber
        </th>
        <th className="border border-hydro-border text-center py-1.5 px-2 text-hydro-muted font-medium">
          Pesan
        </th>
        <th className="border border-hydro-border text-center py-1.5 px-2 text-hydro-muted font-medium">
          Tipe
        </th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td className="border border-hydro-border text-center py-2">
          <CheckCircle2
            size={14}
            className="mx-auto text-hydro-primary"
          />
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          10:23
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          INFO
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Sistem
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Pompa nutrisi dinyalakan otomatis
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Aktuasi
        </td>
      </tr>

      <tr>
        <td className="border border-hydro-border text-center py-2">
          <CheckCircle2
            size={14}
            className="mx-auto text-hydro-primary"
          />
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          10:45
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          INFO
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Sistem
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Pengisian air otomatis 2,5 Liter
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Aktuasi
        </td>
      </tr>

      <tr>
        <td className="border border-hydro-border text-center py-2">
          <AlertTriangle
            size={14}
            className="mx-auto text-hydro-warn"
          />
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          09:30
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          WARNING
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Sensor pH
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          pH turun, penyesuaian otomatis dilakukan
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Peringatan
        </td>
      </tr>

      <tr>
        <td className="border border-hydro-border text-center py-2">
          <Bot
            size={14}
            className="mx-auto text-hydro-accent"
          />
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          08:15
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          INFO
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          AI Prediction
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          AI prediksi kebutuhan nutrisi dijalankan
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          AI
        </td>
      </tr>

      <tr>
        <td className="border border-hydro-border text-center py-2">
          <CheckCircle2
            size={14}
            className="mx-auto text-hydro-primary"
          />
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          07:20
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          INFO
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Sistem
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Suhu kembali normal
        </td>
        <td className="border border-hydro-border text-center px-2 py-2">
          Sensor
        </td>
      </tr>
    </tbody>
  </table>
</div>
</div>
</div>

          {/* AI */}

          <div className="panel p-4 card-enter">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="font-display font-semibold text-[0.95rem] flex items-center gap-2 text-hydro-ink">
                <Brain size={16} className="text-hydro-primary" />
                Prediksi AI
              </h2>
              <button
                type="button"
                onClick={() => navigate("/ai-prediction")}
                className="text-[0.75rem] font-medium text-hydro-primary hover:underline cursor-pointer"
              >
                Buka AI Prediction
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className="
                border
                border-hydro-border
                rounded-lg
                p-3.5
                bg-white/70
                "
              >
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

              <div
                className="
                border
                border-hydro-border
                rounded-lg
                p-3.5
                bg-white/70
                "
              >
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

              <div
                className="
                border
                border-hydro-border
                rounded-lg
                p-3.5
                text-center
                bg-white/70
                "
              >
                <h3 className="font-display font-medium text-[0.85rem] text-hydro-ink">
                  Deteksi Kondisi
                </h3>

                <div className="mt-2 flex justify-center text-hydro-primary">
                  <CheckCircle2 size={36} />
                </div>

                <div className="font-display font-semibold text-[0.9rem] text-hydro-primary mt-2">
                  NORMAL
                </div>
              </div>
            </div>
          </div>

          {/* REKOMENDASI */}

          <div className="panel p-4 card-enter">
            <h2 className="font-display font-semibold text-[0.95rem] mb-2.5 text-hydro-ink">
              Rekomendasi AI
            </h2>

            <div className="flex flex-col sm:flex-row justify-between gap-3 items-stretch sm:items-center">
              <p className="max-w-4xl text-[0.85rem] text-hydro-muted leading-relaxed">
                Sistem dalam kondisi normal. AI
                merekomendasikan penambahan nutrisi
                sebanyak 160 ml dalam 3 jam ke depan
                untuk menjaga kestabilan larutan.
              </p>

              <button
                type="button"
                onClick={openDevices}
                className="
                bg-hydro-primary
                text-white
                px-3.5
                py-1.5
                rounded-lg
                hover:bg-hydro-primary-hover
                transition
                font-medium
                text-[0.8rem]
                whitespace-nowrap
                w-full
                sm:w-auto
                cursor-pointer
                "
              >
                Buka Kontrol Perangkat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
