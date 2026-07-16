/**
 * Monitoring.jsx — halaman pemantauan sensor hidroponik.
 *
 * Fitur:
 * - Filter tanggal (data mock per tanggal)
 * - Kartu nilai terkini 6 parameter
 * - 6 grafik garis (Recharts) per parameter
 * - Tabel riwayat sensor
 */
import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  FlaskConical,
  Droplets,
  Thermometer,
  Sun,
  Waves
} from "lucide-react";

/** Data riwayat sensor mock (nanti diganti dari API/database) */
const HISTORY = [
  { waktu: "10:00", date: "2026-07-17", ph: 5.86, ec: 1.62, suhu: 24.7, kelembapan: 68, cahaya: 520, levelAir: 78 },
  { waktu: "09:55", date: "2026-07-17", ph: 5.82, ec: 1.60, suhu: 24.6, kelembapan: 67, cahaya: 515, levelAir: 77 },
  { waktu: "09:50", date: "2026-07-17", ph: 5.84, ec: 1.61, suhu: 24.6, kelembapan: 68, cahaya: 510, levelAir: 77 },
  { waktu: "09:45", date: "2026-07-17", ph: 5.83, ec: 1.59, suhu: 24.6, kelembapan: 67, cahaya: 505, levelAir: 76 },
  { waktu: "09:40", date: "2026-07-17", ph: 5.81, ec: 1.58, suhu: 24.5, kelembapan: 66, cahaya: 500, levelAir: 76 },
  { waktu: "16:00", date: "2026-07-16", ph: 5.90, ec: 1.55, suhu: 25.1, kelembapan: 64, cahaya: 480, levelAir: 74 },
  { waktu: "12:00", date: "2026-07-16", ph: 5.88, ec: 1.57, suhu: 24.9, kelembapan: 65, cahaya: 490, levelAir: 75 },
];

/** Kartu satu grafik garis untuk satu parameter sensor */
function ChartCard({ title, data, color, dataKey = "nilai" }) {
  return (
    <div className="panel h-[180px] sm:h-[190px] p-3 card-enter">
      <h3 className="font-display font-medium text-[0.85rem] mb-2 text-hydro-ink">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#c5d5cf" />
          <XAxis dataKey="waktu" stroke="#5a6b66" tick={{ fontSize: 11 }} />
          <YAxis stroke="#5a6b66" tick={{ fontSize: 11 }} width={32} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            dot={{ fill: color, r: 2.5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Kartu ringkas nilai sensor di bagian atas halaman */
function SensorCard({ icon, title, value, unit, status }) {
  return (
    <div className="panel min-h-[88px] h-auto py-3 px-3 flex items-center justify-center gap-2.5">
      <span className="icon-pop shrink-0">{icon}</span>
      <div>
        <h3 className="text-[0.7rem] text-hydro-muted">{title}</h3>
        <div
          key={String(value)}
          className="font-display text-base font-semibold text-hydro-ink value-tick"
        >
          {value}{unit}
        </div>
        <div className="text-hydro-primary text-[0.7rem] font-medium">
          {status}
        </div>
      </div>
    </div>
  );
}

export default function Monitoring() {
  const today = new Date().toISOString().split("T")[0];
  // Tanggal yang dipilih untuk filter data
  const [date, setDate] = useState("2026-07-17");

  // Baris riwayat yang cocok dengan tanggal terpilih
  const rows = useMemo(
    () => HISTORY.filter((row) => row.date === date),
    [date]
  );

  // Nilai terbaru (baris pertama) untuk kartu sensor
  const latest = rows[0];

  // Ubah data tabel → format yang dibaca LineChart ({ waktu, nilai })
  const phData = rows.map((r) => ({ waktu: r.waktu, nilai: r.ph })).reverse();
  const ecData = rows.map((r) => ({ waktu: r.waktu, nilai: r.ec })).reverse();
  const suhuData = rows.map((r) => ({ waktu: r.waktu, nilai: r.suhu })).reverse();
  const humData = rows.map((r) => ({ waktu: r.waktu, nilai: r.kelembapan })).reverse();
  const lightData = rows.map((r) => ({ waktu: r.waktu, nilai: r.cahaya })).reverse();
  const waterData = rows.map((r) => ({ waktu: r.waktu, nilai: r.levelAir })).reverse();

  return (
    <div className="flex h-screen overflow-hidden page-shell">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Navbar
          title="Monitoring"
          subtitle="Pemantauan Sensor Hidroponik"
        />

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 page-enter content-stagger">

          <div className="flex justify-end items-center gap-2 mb-3 sm:mb-4">
            <span className="text-[0.8rem] font-medium text-hydro-muted">
              Tanggal
            </span>
            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="
              border
              border-hydro-border
              rounded-lg
              px-2.5
              py-1.5
              text-[0.8rem]
              bg-white/90
              text-hydro-ink
              focus:outline-none
              focus:border-hydro-accent
              "
            />
          </div>

          {!latest ? (
            <div className="panel p-8 text-center text-hydro-muted text-[0.85rem] mb-4">
              Tidak ada data sensor untuk tanggal yang dipilih. Coba tanggal 16–17 Jul 2026.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 mb-4">
                <SensorCard
                  icon={<FlaskConical size={22} className="text-hydro-primary shrink-0" />}
                  title="pH Level"
                  value={latest.ph}
                  unit=""
                  status="Optimal"
                />
                <SensorCard
                  icon={<Droplets size={22} className="text-hydro-primary shrink-0" />}
                  title="EC / TDS"
                  value={latest.ec}
                  unit=""
                  status="Optimal"
                />
                <SensorCard
                  icon={<Thermometer size={22} className="text-hydro-primary shrink-0" />}
                  title="Suhu"
                  value={latest.suhu}
                  unit="°C"
                  status="Optimal"
                />
                <SensorCard
                  icon={<Droplets size={22} className="text-hydro-primary shrink-0" />}
                  title="Kelembapan"
                  value={latest.kelembapan}
                  unit="%"
                  status="Optimal"
                />
                <SensorCard
                  icon={<Sun size={22} className="text-hydro-warn shrink-0" />}
                  title="Cahaya"
                  value={latest.cahaya}
                  unit=""
                  status="Optimal"
                />
                <SensorCard
                  icon={<Waves size={22} className="text-hydro-accent shrink-0" />}
                  title="Level Air"
                  value={latest.levelAir}
                  unit="%"
                  status="Optimal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3">
                <ChartCard title="Grafik pH" data={phData} color="#0f6b5c" />
                <ChartCard title="Grafik EC / TDS" data={ecData} color="#2bb8a8" />
                <ChartCard title="Grafik Suhu (°C)" data={suhuData} color="#d97706" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4">
                <ChartCard title="Grafik Kelembapan (%)" data={humData} color="#1b8f9e" />
                <ChartCard title="Grafik Cahaya (Lux)" data={lightData} color="#c4a014" />
                <ChartCard title="Grafik Level Air (%)" data={waterData} color="#0f6b5c" />
              </div>
            </>
          )}

          <div className="panel p-3.5 card-enter">
            <h3 className="font-display text-[0.95rem] font-semibold mb-3 text-hydro-ink">
              Riwayat Data Sensor
            </h3>

            <div className="max-h-[240px] overflow-y-auto table-scroll border border-hydro-border rounded-lg">
              <table className="w-full min-w-[640px] border-collapse text-[0.78rem]">
                <thead className="sticky top-0 bg-hydro-accent-soft">
                  <tr>
                    <th className="border border-hydro-border p-2 text-center text-hydro-muted font-medium">Waktu</th>
                    <th className="border border-hydro-border p-2 text-center text-hydro-muted font-medium">pH Level</th>
                    <th className="border border-hydro-border p-2 text-center text-hydro-muted font-medium">EC/TDS (mS/cm)</th>
                    <th className="border border-hydro-border p-2 text-center text-hydro-muted font-medium">Suhu °C</th>
                    <th className="border border-hydro-border p-2 text-center text-hydro-muted font-medium">Kelembapan (%)</th>
                    <th className="border border-hydro-border p-2 text-center text-hydro-muted font-medium">Cahaya (Lux)</th>
                    <th className="border border-hydro-border p-2 text-center text-hydro-muted font-medium">Level Air (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="border border-hydro-border p-6 text-center text-hydro-muted">
                        Tidak ada riwayat untuk tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={`${row.date}-${row.waktu}`}>
                        <td className="border border-hydro-border p-2 text-center">{row.waktu}</td>
                        <td className="border border-hydro-border p-2 text-center">{row.ph}</td>
                        <td className="border border-hydro-border p-2 text-center">{row.ec}</td>
                        <td className="border border-hydro-border p-2 text-center">{row.suhu}</td>
                        <td className="border border-hydro-border p-2 text-center">{row.kelembapan}</td>
                        <td className="border border-hydro-border p-2 text-center">{row.cahaya}</td>
                        <td className="border border-hydro-border p-2 text-center">{row.levelAir}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
