/**
 * Log.jsx — halaman riwayat aktivitas sistem SmartHydro-AI.
 *
 * Untuk apa:
 * - Ringkasan metrik (klik untuk filter cepat)
 * - Filter level + pencarian dengan feedback jelas
 * - Feed aktivitas dikelompokkan per tanggal (UX modern)
 * - Mode tabel untuk melihat data padat
 *
 * Layout: PageShell. Data masih mock (nanti dari API).
 */
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "../components/layout";
import {
  TablePager,
  TablePageSize,
  paginateRows,
  ThemeSelect,
  ThemeTip,
} from "../components/ui";
import { useToast } from "../context/ToastContext";
import {
  CheckCircle2,
  AlertTriangle,
  Bot,
  XCircle,
  Info,
  RotateCcw,
  Search,
  ClipboardList,
  X,
  LayoutList,
  Table2,
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
    source: "Relay Tandon",
    message: "Koneksi relay tandon sempat terputus, sistem mencoba ulang",
    type: "Perangkat",
  },
  {
    id: 7,
    time: "06:10",
    date: "17 Jul 2026",
    level: "INFO",
    source: "MQTT Broker",
    message: "Data sensor berhasil dikirim ke server",
    type: "IoT",
  },
  {
    id: 11,
    time: "05:40",
    date: "17 Jul 2026",
    level: "INFO",
    source: "Servo Nutrisi",
    message: "Servo dosing nutrisi dijalankan otomatis",
    type: "Aktuasi",
  },
  {
    id: 12,
    time: "05:15",
    date: "17 Jul 2026",
    level: "WARNING",
    source: "AI Prediction",
    message: "Anomali EC/TDS: kadar nutrisi di bawah ambang",
    type: "AI",
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

/** Opsi filter level — dropdown, bukan deretan chip */
const FILTER_OPTIONS = [
  { value: "Semua", label: "Semua level" },
  { value: "INFO", label: "INFO" },
  { value: "WARNING", label: "WARNING" },
  { value: "ERROR", label: "ERROR" },
  { value: "AI", label: "AI" },
];

function levelTextClass(level) {
  if (level === "WARNING") return "text-hydro-warn";
  if (level === "ERROR") return "text-hydro-danger";
  return "text-hydro-primary";
}

function levelAccent(level) {
  if (level === "WARNING") return "bg-hydro-warn";
  if (level === "ERROR") return "bg-hydro-danger";
  return "bg-hydro-primary";
}

function levelIconWrap(level, type) {
  if (level === "WARNING") return "bg-[#fff6e8] text-hydro-warn border-[#f0d9a8]";
  if (level === "ERROR") return "bg-[#fdeeee] text-hydro-danger border-[#f0c8c8]";
  if (type === "AI") return "bg-hydro-accent-soft text-hydro-accent border-hydro-primary/15";
  return "bg-hydro-accent-soft text-hydro-primary border-hydro-primary/15";
}

function LogIcon({ level, type, size = 15 }) {
  if (level === "WARNING") return <AlertTriangle size={size} />;
  if (level === "ERROR") return <XCircle size={size} />;
  if (type === "AI") return <Bot size={size} />;
  return <CheckCircle2 size={size} />;
}

/** Kartu metrik ringkas — tampilan saja (filter lewat dropdown) */
function MetricCard({ label, value, icon, tone, hint }) {
  const tones = {
    ink: {
      icon: "bg-hydro-bg2 text-hydro-ink border-hydro-border",
      num: "text-hydro-ink",
      glow: "from-white to-hydro-bg2/50",
    },
    info: {
      icon: "bg-hydro-accent-soft text-hydro-primary border-hydro-primary/15",
      num: "text-hydro-primary",
      glow: "from-hydro-accent-soft/40 to-white",
    },
    warn: {
      icon: "bg-[#fff6e8] text-hydro-warn border-[#f0d9a8]",
      num: "text-hydro-warn",
      glow: "from-[#fff6e8]/70 to-white",
    },
    danger: {
      icon: "bg-[#fdeeee] text-hydro-danger border-[#f0c8c8]",
      num: "text-hydro-danger",
      glow: "from-[#fdeeee]/70 to-white",
    },
  };
  const t = tones[tone] || tones.ink;

  return (
    <div
      className={`
        relative overflow-hidden w-full
        rounded-2xl border border-hydro-border/90
        bg-gradient-to-br ${t.glow}
        p-3 sm:p-3.5
        shadow-[0_2px_10px_rgba(18,36,33,0.04)]
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`
            w-9 h-9 sm:w-10 sm:h-10 rounded-xl border
            inline-flex items-center justify-center shrink-0
            ${t.icon}
          `}
        >
          {icon}
        </div>
        <span
          className={`font-display text-2xl sm:text-[1.75rem] font-semibold tabular-nums leading-none ${t.num}`}
        >
          {value}
        </span>
      </div>
      <p className="mt-2.5 text-[0.78rem] font-semibold text-hydro-ink tracking-tight">
        {label}
      </p>
      <p className="text-[0.68rem] text-hydro-muted mt-0.5">{hint}</p>
    </div>
  );
}

/** Satu baris di feed aktivitas */
function LogFeedItem({ log }) {
  return (
    <article
      className="
        group relative flex gap-3 sm:gap-3.5
        rounded-xl border border-hydro-border/80
        bg-white/80 hover:bg-hydro-accent-soft/25
        px-3 py-3 sm:px-3.5 sm:py-3.5
        transition-colors duration-200
      "
    >
      {/* Aksen level di kiri */}
      <span
        aria-hidden
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${levelAccent(log.level)}`}
      />

      <div
        className={`
          ml-1.5 shrink-0 w-9 h-9 rounded-xl border
          inline-flex items-center justify-center
          ${levelIconWrap(log.level, log.type)}
        `}
      >
        <LogIcon level={log.level} type={log.type} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="text-[0.86rem] font-medium text-hydro-ink leading-snug">
            {log.message}
          </p>
          <span className="text-[0.7rem] text-hydro-muted tabular-nums shrink-0 pt-0.5">
            {log.time}
          </span>
        </div>
        <p className="text-[0.72rem] text-hydro-muted leading-snug">
          <span className={`font-semibold ${levelTextClass(log.level)}`}>
            {log.level}
          </span>
          <span className="mx-1.5 text-hydro-border">·</span>
          <span>{log.source}</span>
          <span className="mx-1.5 text-hydro-border">·</span>
          <span>{log.type}</span>
        </p>
      </div>
    </article>
  );
}

export default function Log() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [view, setView] = useState("feed"); // "feed" | "table"

  const counts = useMemo(
    () => ({
      Semua: LOGS.length,
      INFO: LOGS.filter((l) => l.level === "INFO").length,
      WARNING: LOGS.filter((l) => l.level === "WARNING").length,
      ERROR: LOGS.filter((l) => l.level === "ERROR").length,
      AI: LOGS.filter((l) => l.type === "AI").length,
    }),
    []
  );

  const resetFilters = () => {
    setFilter("Semua");
    setQuery("");
    setPage(1);
    showToast("Filter log dikembalikan ke default.", "info");
  };

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

  useEffect(() => {
    setPage(1);
  }, [filter, query, view]);

  const paged = useMemo(
    () => paginateRows(filtered, page, pageSize),
    [filtered, page, pageSize]
  );

  /** Kelompokkan baris halaman aktif berdasarkan tanggal */
  const grouped = useMemo(() => {
    const map = new Map();
    for (const log of paged.rows) {
      if (!map.has(log.date)) map.set(log.date, []);
      map.get(log.date).push(log);
    }
    return Array.from(map.entries());
  }, [paged.rows]);

  const isFiltered = filter !== "Semua" || query.trim() !== "";

  return (
    <PageShell
      title="Log"
      subtitle="Pantau aktivitas, peringatan, dan peristiwa sistem"
    >
      {/* Metrik ringkas (bukan kontrol filter — filter lewat dropdown) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <MetricCard
          label="Total"
          value={counts.Semua}
          icon={<ClipboardList size={18} />}
          tone="ink"
          hint="Semua entri"
        />
        <MetricCard
          label="INFO"
          value={counts.INFO}
          icon={<Info size={18} />}
          tone="info"
          hint="Aktivitas normal"
        />
        <MetricCard
          label="WARNING"
          value={counts.WARNING}
          icon={<AlertTriangle size={18} />}
          tone="warn"
          hint="Perlu perhatian"
        />
        <MetricCard
          label="ERROR"
          value={counts.ERROR}
          icon={<XCircle size={18} />}
          tone="danger"
          hint="Butuh tindakan"
        />
      </div>

      {/* Toolbar + konten */}
      <div className="panel p-0 card-enter">
        {/* Toolbar sticky — overflow visible supaya tooltip tidak kepotong */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl px-3 sm:px-4 pt-3 pb-2 space-y-3 overflow-visible">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display font-semibold text-[0.98rem] text-hydro-ink">
                Riwayat Aktivitas
              </h2>
              <p className="text-[0.72rem] text-hydro-muted mt-1">
                {isFiltered
                  ? `${filtered.length} hasil sesuai filter aktif`
                  : `${filtered.length} entri · urutan terbaru di atas`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Filter level — satu dropdown, tidak ramai */}
              <ThemeSelect
                value={filter}
                onChange={setFilter}
                options={FILTER_OPTIONS}
                aria-label="Filter level log"
                className="w-full sm:w-[9.5rem]"
              />

              <div className="relative flex-1 sm:w-[240px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-hydro-muted pointer-events-none"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari pesan atau sumber..."
                  aria-label="Cari log"
                  className="field-input w-full !pl-9 !pr-9"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Hapus pencarian"
                    className="
                      absolute right-2 top-1/2 -translate-y-1/2
                      w-7 h-7 rounded-lg
                      inline-flex items-center justify-center
                      text-hydro-muted hover:text-hydro-primary hover:bg-hydro-accent-soft
                      transition cursor-pointer
                    "
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>

              {isFiltered ? (
                <ThemeTip tip="Reset filter & pencarian" prefer="bottom">
                  <button
                    type="button"
                    onClick={resetFilters}
                    aria-label="Reset filter"
                    className="btn-secondary !px-2.5 !py-1.5 shrink-0"
                  >
                    <RotateCcw size={14} />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </ThemeTip>
              ) : null}

              {/* Toggle tampilan — tooltip pintar (utamakan bawah, flip ke atas jika sempit) */}
              <div
                className="inline-flex p-0.5 rounded-xl border border-hydro-border bg-hydro-bg2/60 shrink-0"
                role="group"
                aria-label="Mode tampilan"
              >
                <ThemeTip tip="Tampilan feed" prefer="bottom">
                  <button
                    type="button"
                    onClick={() => setView("feed")}
                    aria-pressed={view === "feed"}
                    aria-label="Tampilan feed"
                    className={`
                      inline-flex items-center justify-center w-9 h-8 rounded-[0.65rem]
                      transition cursor-pointer
                      ${
                        view === "feed"
                          ? "bg-white text-hydro-primary shadow-sm"
                          : "text-hydro-muted hover:text-hydro-ink"
                      }
                    `}
                  >
                    <LayoutList size={15} />
                  </button>
                </ThemeTip>
                <ThemeTip tip="Tampilan tabel" prefer="bottom">
                  <button
                    type="button"
                    onClick={() => setView("table")}
                    aria-pressed={view === "table"}
                    aria-label="Tampilan tabel"
                    className={`
                      inline-flex items-center justify-center w-9 h-8 rounded-[0.65rem]
                      transition cursor-pointer
                      ${
                        view === "table"
                          ? "bg-white text-hydro-primary shadow-sm"
                          : "text-hydro-muted hover:text-hydro-ink"
                      }
                    `}
                  >
                    <Table2 size={15} />
                  </button>
                </ThemeTip>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 py-3 space-y-3">
          <div className="flex justify-end">
            <TablePageSize
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              onPageChange={setPage}
            />
          </div>

          {/* Empty state */}
          {paged.total === 0 ? (
            <div
              className="
                flex flex-col items-center justify-center text-center
                rounded-2xl border border-dashed border-hydro-border
                bg-hydro-bg2/40 px-4 py-12
              "
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-hydro-border inline-flex items-center justify-center text-hydro-muted mb-3">
                <Search size={22} />
              </div>
              <p className="font-display font-semibold text-hydro-ink">
                Tidak ada log yang cocok
              </p>
              <p className="text-[0.78rem] text-hydro-muted mt-1 max-w-xs">
                Ubah kata kunci atau pilih filter lain, lalu coba lagi.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="btn-secondary mt-4"
              >
                <RotateCcw size={13} />
                Tampilkan semua
              </button>
            </div>
          ) : view === "feed" ? (
            /* Feed modern per tanggal */
            <div className="space-y-5">
              {grouped.map(([date, items]) => (
                <section key={date} className="space-y-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[0.78rem] font-semibold text-hydro-primary tracking-tight">
                      {date}
                    </h3>
                    <span className="text-[0.68rem] text-hydro-muted tabular-nums">
                      {items.length} entri
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((log) => (
                      <LogFeedItem key={log.id} log={log} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            /* Mode tabel padat */
            <div className="table-scroll">
              <table className="hydro-table min-w-[720px]">
                <thead>
                  <tr>
                    <th className="w-10"></th>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Level</th>
                    <th>Sumber</th>
                    <th>Pesan</th>
                    <th>Tipe</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.rows.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span
                          className={`
                            inline-flex items-center justify-center
                            w-7 h-7 rounded-lg border
                            ${levelIconWrap(log.level, log.type)}
                          `}
                        >
                          <LogIcon level={log.level} type={log.type} size={14} />
                        </span>
                      </td>
                      <td className="tabular-nums text-hydro-muted whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="tabular-nums font-medium whitespace-nowrap">
                        {log.time}
                      </td>
                      <td>
                        <span
                          className={`font-semibold ${levelTextClass(log.level)}`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="whitespace-nowrap font-medium">
                        {log.source}
                      </td>
                      <td className="text-left">{log.message}</td>
                      <td className="text-hydro-muted">{log.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
      </div>
    </PageShell>
  );
}
