/**
 * Monitoring.jsx — halaman pemantauan sensor hidroponik (presentation layer).
 *
 * Untuk apa:
 * - Filter tanggal (data mock per tanggal)
 * - Kartu nilai terkini 6 parameter sensor
 * - 6 grafik garis via SensorChart (Recharts)
 * - Tabel riwayat sensor + pagination
 *
 * Layout: PageShell (Sidebar + Navbar + area scroll).
 */
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "../components/layout";
import { SensorChart } from "../components/charts";
import { TablePager, TablePageSize, paginateRows, ThemeDatePicker, SortableTh, nextSortState, sortRows, timeToMinutes } from "../components/ui";
import {
  useSettings,
  evaluateSensorStatus,
} from "../context/SettingsContext";

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

function sensorSortValue(row, key) {
  if (key === "waktu") return timeToMinutes(row.waktu);
  return row[key];
}
/** Kartu ringkas nilai sensor — selaras pola Dashboard */
function SensorCard({ icon, title, value, unit, status }) {
  return (
    <div className="sensor-tile text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1 text-hydro-primary">
        <span className="icon-pop shrink-0">{icon}</span>
        <h3 className="text-[0.78rem] font-medium text-hydro-muted">{title}</h3>
      </div>
      <div
        key={String(value)}
        className="font-display text-xl font-semibold text-hydro-ink tabular-nums value-tick"
      >
        {value}
        {unit ? (
          <span className="text-[0.78rem] font-medium text-hydro-muted ml-0.5">
            {unit}
          </span>
        ) : null}
      </div>
      <div className="flex justify-center mt-2">
        <span className={`chip ${status === "Optimal" ? "chip-ok" : "chip-warn"}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

export default function Monitoring() {
  const { thresholds } = useSettings();
  const today = new Date().toISOString().split("T")[0];
  // Tanggal yang dipilih untuk filter data
  const [date, setDate] = useState("2026-07-17");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({ key: "waktu", dir: "desc" });

  const handleSort = (column) => {
    setSort((prev) => nextSortState(prev, column, "asc"));
    setPage(1);
  };

  // Baris riwayat yang cocok dengan tanggal terpilih
  const rows = useMemo(
    () => HISTORY.filter((row) => row.date === date),
    [date]
  );

  const sortedRows = useMemo(
    () => sortRows(rows, sort, sensorSortValue),
    [rows, sort]
  );

  useEffect(() => {
    setPage(1);
  }, [date]);

  const paged = useMemo(
    () => paginateRows(sortedRows, page, pageSize),
    [sortedRows, page, pageSize]
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
    <PageShell
      title="Monitoring"
      subtitle="Pemantauan Sensor Hidroponik"
    >
          <div className="flex justify-end items-center gap-2">
            <span className="text-[0.88rem] font-medium text-hydro-muted">
              Tanggal
            </span>
            <ThemeDatePicker
              value={date}
              max={today}
              onChange={setDate}
              aria-label="Filter tanggal monitoring"
            />
          </div>

          {!latest ? (
            <div className="panel p-8 text-center text-hydro-muted text-[0.82rem]">
              Tidak ada data sensor untuk tanggal yang dipilih. Coba tanggal 16–17 Jul 2026.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 items-start">
                <SensorCard
                  icon={<FlaskConical size={14} className="shrink-0" />}
                  title="pH Level"
                  value={latest.ph}
                  unit=""
                  status={evaluateSensorStatus("ph", latest.ph, thresholds)}
                />
                <SensorCard
                  icon={<Droplets size={14} className="shrink-0" />}
                  title="EC / TDS"
                  value={latest.ec}
                  unit=""
                  status={evaluateSensorStatus("ec", latest.ec, thresholds)}
                />
                <SensorCard
                  icon={<Thermometer size={14} className="shrink-0" />}
                  title="Suhu"
                  value={latest.suhu}
                  unit="°C"
                  status={evaluateSensorStatus("suhu", latest.suhu, thresholds)}
                />
                <SensorCard
                  icon={<Droplets size={14} className="shrink-0" />}
                  title="Kelembapan"
                  value={latest.kelembapan}
                  unit="%"
                  status={evaluateSensorStatus(
                    "kelembapan",
                    latest.kelembapan,
                    thresholds
                  )}
                />
                <SensorCard
                  icon={<Sun size={14} className="shrink-0" />}
                  title="Cahaya"
                  value={latest.cahaya}
                  unit=""
                  status={evaluateSensorStatus("cahaya", latest.cahaya, thresholds)}
                />
                <SensorCard
                  icon={<Waves size={14} className="shrink-0" />}
                  title="Level Air"
                  value={latest.levelAir}
                  unit="%"
                  status={evaluateSensorStatus(
                    "levelAir",
                    latest.levelAir,
                    thresholds
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 items-start">
                <SensorChart title="Grafik pH" data={phData} color="#0f6b5c" />
                <SensorChart title="Grafik EC / TDS" data={ecData} color="#2bb8a8" />
                <SensorChart title="Grafik Suhu (°C)" data={suhuData} color="#d97706" />
                <SensorChart title="Grafik Kelembapan (%)" data={humData} color="#1b8f9e" />
                <SensorChart title="Grafik Cahaya (Lux)" data={lightData} color="#c4a014" />
                <SensorChart title="Grafik Level Air (%)" data={waterData} color="#0f6b5c" />
              </div>

              <div className="panel p-3 sm:p-4 card-enter">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="section-title">
                    Riwayat Data Sensor
                  </h3>
                  <TablePageSize
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    onPageChange={setPage}
                  />
                </div>

                <div className="table-scroll">
                  <table className="hydro-table min-w-[640px]">
                    <thead>
                      <tr>
                        <SortableTh
                          label="Waktu"
                          column="waktu"
                          sortKey={sort.key}
                          sortDir={sort.dir}
                          onSort={handleSort}
                        />
                        <th>pH Level</th>
                        <th>EC/TDS (mS/cm)</th>
                        <th>Suhu °C</th>
                        <th>Kelembapan (%)</th>
                        <th>Cahaya (Lux)</th>
                        <th>Level Air (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.rows.map((row) => (
                        <tr key={`${row.date}-${row.waktu}`}>
                          <td>{row.waktu}</td>
                          <td>{row.ph}</td>
                          <td>{row.ec}</td>
                          <td>{row.suhu}</td>
                          <td>{row.kelembapan}</td>
                          <td>{row.cahaya}</td>
                          <td>{row.levelAir}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <TablePager
                  pageSize={pageSize}
                  page={paged.page}
                  onPageChange={setPage}
                  total={paged.total}
                  totalPages={paged.totalPages}
                  from={paged.from}
                  to={paged.to}
                />
              </div>
            </>
          )}
    </PageShell>
  );
}
