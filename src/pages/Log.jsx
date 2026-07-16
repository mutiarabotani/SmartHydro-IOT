/**
 * Log.jsx — halaman riwayat log sistem SmartHydro-AI.
 *
 * Fitur:
 * - Ringkasan jumlah INFO / WARNING / ERROR
 * - Filter level + pencarian teks
 * - Tabel log lengkap dengan ikon status
 */
import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";
import {
  CheckCircle2,
  AlertTriangle,
  Bot,
  XCircle,
  Info,
  RotateCcw,
} from "lucide-react";

/** Data log mock (nanti diganti dari API) */
const LOGS = [
  {
    id: 1,
    time: "10:45",
    date: "17 Jul 2026",
    level: "INFO",
    source: "Sistem",
    message: "Pengisian air otomatis 2,5 Liter",
    type: "Aktuasi",
  },
  {
    id: 2,
    time: "10:23",
    date: "17 Jul 2026",
    level: "INFO",
    source: "Sistem",
    message: "Pompa nutrisi dinyalakan otomatis",
    type: "Aktuasi",
  },
  {
    id: 3,
    time: "09:30",
    date: "17 Jul 2026",
    level: "WARNING",
    source: "Sensor pH",
    message: "pH turun, penyesuaian otomatis dilakukan",
    type: "Peringatan",
  },
  {
    id: 4,
    time: "08:15",
    date: "17 Jul 2026",
    level: "INFO",
    source: "AI Prediction",
    message: "AI prediksi kebutuhan nutrisi dijalankan",
    type: "AI",
  },
  {
    id: 5,
    time: "07:20",
    date: "17 Jul 2026",
    level: "INFO",
    source: "Sistem",
    message: "Suhu kembali normal",
    type: "Sensor",
  },
  {
    id: 6,
    time: "06:50",
    date: "17 Jul 2026",
    level: "ERROR",
    source: "Relay",
    message: "Koneksi relay sempat terputus, sistem mencoba ulang",
    type: "Perangkat",
  },
  {
    id: 7,
    time: "06:10",
    date: "17 Jul 2026",
    level: "INFO",
    source: "Cloud",
    message: "Sinkronisasi data sensor ke cloud berhasil",
    type: "IoT",
  },
  {
    id: 8,
    time: "22:40",
    date: "16 Jul 2026",
    level: "WARNING",
    source: "Level Air",
    message: "Level air mendekati batas bawah (72%)",
    type: "Peringatan",
  },
  {
    id: 9,
    time: "20:05",
    date: "16 Jul 2026",
    level: "INFO",
    source: "AI Prediction",
    message: "Rekomendasi nutrisi 160 ml dicatat",
    type: "AI",
  },
  {
    id: 10,
    time: "18:30",
    date: "16 Jul 2026",
    level: "INFO",
    source: "Device Control",
    message: "Mode sistem diubah ke AUTO",
    type: "Aktuasi",
  },
];

/** Opsi tombol filter level */
const FILTERS = ["Semua", "INFO", "WARNING", "ERROR", "AI"];

/** Ikon di kolom pertama tabel, sesuai level/tipe log */
function LogIcon({ level, type }) {
  if (level === "WARNING") {
    return <AlertTriangle size={14} className="mx-auto text-hydro-warn" />;
  }
  if (level === "ERROR") {
    return <XCircle size={14} className="mx-auto text-hydro-danger" />;
  }
  if (type === "AI") {
    return <Bot size={14} className="mx-auto text-hydro-accent" />;
  }
  return <CheckCircle2 size={14} className="mx-auto text-hydro-primary" />;
}

export default function Log() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState("Semua"); // filter level aktif
  const [query, setQuery] = useState(""); // kata kunci pencarian

  /** Kembalikan filter & pencarian ke default */
  const resetFilters = () => {
    setFilter("Semua");
    setQuery("");
    showToast("Filter log dikembalikan ke default.", "info");
  };

  // Log yang lolos filter level + pencarian teks
  const filtered = useMemo(() => {
    return LOGS.filter((log) => {
      const matchFilter =
        filter === "Semua" ||
        log.level === filter ||
        (filter === "AI" && log.type === "AI");

      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        log.message.toLowerCase().includes(q) ||
        log.source.toLowerCase().includes(q) ||
        log.type.toLowerCase().includes(q);

      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  // Angka ringkasan di kartu atas
  const summary = {
    total: LOGS.length,
    info: LOGS.filter((l) => l.level === "INFO").length,
    warning: LOGS.filter((l) => l.level === "WARNING").length,
    error: LOGS.filter((l) => l.level === "ERROR").length,
  };

  return (
    <div className="flex h-screen overflow-hidden page-shell">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Navbar
          title="Log"
          subtitle="Riwayat aktivitas sistem SmartHydro-AI"
        />

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 page-enter content-stagger">
          {/* RINGKASAN */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="panel p-3 sm:p-4 card-enter">
              <p className="text-[0.72rem] text-hydro-muted">Total Log</p>
              <p className="font-display text-xl font-semibold text-hydro-ink mt-1">
                {summary.total}
              </p>
            </div>
            <div className="panel p-3 sm:p-4 card-enter">
              <p className="text-[0.72rem] text-hydro-muted flex items-center gap-1">
                <Info size={12} className="text-hydro-primary" /> INFO
              </p>
              <p className="font-display text-xl font-semibold text-hydro-primary mt-1">
                {summary.info}
              </p>
            </div>
            <div className="panel p-3 sm:p-4 card-enter">
              <p className="text-[0.72rem] text-hydro-muted flex items-center gap-1">
                <AlertTriangle size={12} className="text-hydro-warn" /> WARNING
              </p>
              <p className="font-display text-xl font-semibold text-hydro-warn mt-1">
                {summary.warning}
              </p>
            </div>
            <div className="panel p-3 sm:p-4 card-enter">
              <p className="text-[0.72rem] text-hydro-muted flex items-center gap-1">
                <XCircle size={12} className="text-hydro-danger" /> ERROR
              </p>
              <p className="font-display text-xl font-semibold text-hydro-danger mt-1">
                {summary.error}
              </p>
            </div>
          </div>

          {/* FILTER */}
          <div className="panel p-3 sm:p-4 card-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`
                      px-3 py-1.5 rounded-lg text-[0.78rem] font-medium border transition cursor-pointer
                      ${
                        filter === item
                          ? "bg-hydro-accent-soft border-hydro-primary text-hydro-primary"
                          : "bg-white/70 border-hydro-border text-hydro-muted hover:border-hydro-accent"
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari pesan, sumber, atau tipe..."
                  className="
                    border border-hydro-border rounded-lg
                    px-3 py-1.5 text-[0.8rem]
                    bg-white/90 text-hydro-ink
                    w-full sm:w-[240px]
                    focus:outline-none focus:border-hydro-accent
                  "
                />
                <button
                  type="button"
                  onClick={resetFilters}
                  className="
                    inline-flex items-center justify-center gap-1.5
                    border border-hydro-border rounded-lg
                    px-3 py-1.5 text-[0.78rem] font-medium
                    text-hydro-muted hover:border-hydro-accent hover:text-hydro-primary
                    transition cursor-pointer
                  "
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* TABEL LOG */}
          <div className="panel p-3 sm:p-4 card-enter">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                Daftar Log Sistem
              </h2>
              <span className="text-[0.75rem] text-hydro-muted">
                {filtered.length} entri
              </span>
            </div>

            <div className="table-scroll">
              <table className="w-full min-w-[680px] text-[0.78rem] border border-hydro-border border-collapse">
                <thead>
                  <tr className="bg-hydro-accent-soft/60">
                    <th className="border border-hydro-border w-8 py-1.5"></th>
                    <th className="border border-hydro-border text-center py-1.5 px-2 text-hydro-muted font-medium">
                      Tanggal
                    </th>
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="border border-hydro-border text-center py-8 text-hydro-muted"
                      >
                        Tidak ada log yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((log) => (
                      <tr key={log.id}>
                        <td className="border border-hydro-border text-center py-2">
                          <LogIcon level={log.level} type={log.type} />
                        </td>
                        <td className="border border-hydro-border text-center px-2 py-2">
                          {log.date}
                        </td>
                        <td className="border border-hydro-border text-center px-2 py-2">
                          {log.time}
                        </td>
                        <td className="border border-hydro-border text-center px-2 py-2">
                          <span
                            className={`
                              font-medium
                              ${
                                log.level === "WARNING"
                                  ? "text-hydro-warn"
                                  : log.level === "ERROR"
                                    ? "text-hydro-danger"
                                    : "text-hydro-primary"
                              }
                            `}
                          >
                            {log.level}
                          </span>
                        </td>
                        <td className="border border-hydro-border text-center px-2 py-2">
                          {log.source}
                        </td>
                        <td className="border border-hydro-border text-center px-2 py-2">
                          {log.message}
                        </td>
                        <td className="border border-hydro-border text-center px-2 py-2">
                          {log.type}
                        </td>
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
