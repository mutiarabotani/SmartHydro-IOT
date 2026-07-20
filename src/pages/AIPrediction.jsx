/**
 * AIPrediction.jsx — halaman prediksi AI kebutuhan nutrisi & air.
 *
 * Untuk apa:
 * - Ringkasan prediksi nutrisi & air + tingkat keyakinan
 * - Analisis faktor sensor terhadap ambang Setting
 * - Analisis AI, deteksi kondisi, riwayat, rekomendasi
 *
 * Layout: PageShell. Data masih mock; ambang dari SettingsContext.
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/layout";
import {
  TablePager,
  TablePageSize,
  paginateRows,
  ThemeDatePicker,
} from "../components/ui";
import { useToast } from "../context/ToastContext";
import {
  useSettings,
  evaluateSensorStatus,
  detectAnomalies,
} from "../context/SettingsContext";

import {
  Brain,
  FlaskConical,
  Droplets,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lightbulb,
  Info,
  Loader2,
} from "lucide-react";

const HISTORY = [
  {
    time: "10:00",
    date: "2026-07-17",
    nutrisi: "320 ml",
    air: "2.4 L",
    akurasi: "92%",
    status: "Normal",
  },
  {
    time: "09:00",
    date: "2026-07-17",
    nutrisi: "310 ml",
    air: "2.3 L",
    akurasi: "90%",
    status: "Normal",
  },
  {
    time: "08:00",
    date: "2026-07-17",
    nutrisi: "300 ml",
    air: "2.2 L",
    akurasi: "88%",
    status: "Normal",
  },
  {
    time: "07:00",
    date: "2026-07-17",
    nutrisi: "295 ml",
    air: "2.2 L",
    akurasi: "87%",
    status: "Normal",
  },
  {
    time: "06:00",
    date: "2026-07-17",
    nutrisi: "290 ml",
    air: "2.1 L",
    akurasi: "86%",
    status: "Normal",
  },
  {
    time: "05:00",
    date: "2026-07-17",
    nutrisi: "285 ml",
    air: "2.1 L",
    akurasi: "85%",
    status: "Normal",
  },
  {
    time: "18:00",
    date: "2026-07-16",
    nutrisi: "280 ml",
    air: "2.1 L",
    akurasi: "87%",
    status: "Normal",
  },
  {
    time: "12:00",
    date: "2026-07-16",
    nutrisi: "290 ml",
    air: "2.2 L",
    akurasi: "89%",
    status: "Normal",
  },
];

function impactLabel(key, status) {
  if (status !== "Optimal") return "Perlu cek";
  if (key === "cahaya") return "Sedang";
  if (key === "levelAir") return "Cukup";
  return "Optimal";
}

function statusLabel(key, status) {
  if (status !== "Optimal") return "Anomali";
  if (key === "cahaya") return "Cukup";
  if (key === "levelAir") return "Aman";
  return "Normal";
}

function modelLabel(model) {
  if (model === "regresi") return "Regresi Linear";
  if (model === "tree") return "Decision Tree";
  if (model === "threshold") return "Klasifikasi Threshold";
  return model;
}

/** Kartu prediksi nutrisi / air */
function PredictionCard({
  icon,
  iconClass,
  title,
  horizon,
  value,
  unit,
  confidence,
  accentClass = "text-hydro-primary",
  barClass = "bg-hydro-primary",
}) {
  return (
    <div className="panel p-3.5 sm:p-4 card-enter h-full flex flex-col">
      <div className="flex items-start gap-2.5">
        <span
          className={`w-9 h-9 rounded-xl inline-flex items-center justify-center shrink-0 ${iconClass}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[0.86rem] font-semibold text-hydro-ink leading-snug">
            {title}
          </h3>
          <p className="text-[0.7rem] text-hydro-muted mt-0.5">
            {horizon} jam ke depan
          </p>
        </div>
      </div>

      <p
        key={`${title}-${value}`}
        className={`font-display text-[2rem] font-semibold tabular-nums value-tick mt-4 leading-none ${accentClass}`}
      >
        {value}{" "}
        <span className="text-base font-medium text-hydro-muted">{unit}</span>
      </p>

      <div className="mt-auto pt-4">
        <div className="flex justify-between text-[0.72rem] mb-1.5">
          <span className="text-hydro-muted">Tingkat keyakinan</span>
          <span className={`font-semibold ${accentClass}`}>{confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-hydro-bg2 overflow-hidden">
          <div
            className={`h-full rounded-full bar-fill ${barClass}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function AIPrediction() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { thresholds, ai } = useSettings();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState("2026-07-17");
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sensors, setSensors] = useState({
    ph: 5.86,
    ec: 1.62,
    suhu: 24.7,
    kelembapan: 68,
    cahaya: 520,
    levelAir: 78,
  });
  const [prediction, setPrediction] = useState({
    nutrisi: 320,
    air: 2.4,
    confNutrisi: 92,
    confAir: 89,
  });

  const history = useMemo(
    () => HISTORY.filter((row) => row.date === date),
    [date]
  );

  useEffect(() => {
    setPage(1);
  }, [date]);

  const pagedHistory = useMemo(
    () => paginateRows(history, page, pageSize),
    [history, page, pageSize]
  );

  const anomalies = useMemo(
    () => detectAnomalies(sensors, thresholds),
    [sensors, thresholds]
  );

  const hasAnomaly = anomalies.length > 0;
  const horizon = ai.horizon || "24";
  const recommendMl = Math.max(120, Math.round(prediction.nutrisi * 0.5));

  const factorRows = [
    { key: "ph", label: "pH", value: sensors.ph, unit: "" },
    { key: "ec", label: "EC/TDS", value: sensors.ec, unit: " mS/cm" },
    { key: "suhu", label: "Suhu", value: sensors.suhu, unit: " °C" },
    {
      key: "kelembapan",
      label: "Kelembapan",
      value: sensors.kelembapan,
      unit: "%",
    },
    { key: "cahaya", label: "Cahaya", value: sensors.cahaya, unit: " Lux" },
    {
      key: "levelAir",
      label: "Level air",
      value: sensors.levelAir,
      unit: "%",
    },
  ];

  const applyRecommendation = () => {
    if (!ai.enabled) {
      showToast("Modul AI nonaktif. Aktifkan di Setting.", "warn");
      return;
    }
    if (applied || applying) {
      if (applied) showToast("Rekomendasi sudah diterapkan.", "info");
      return;
    }
    setApplying(true);
    window.setTimeout(() => {
      setApplied(true);
      setApplying(false);
      showToast(
        ai.decisionSupportOnly
          ? `Rekomendasi ${recommendMl} ml siap di Device Control (decision support).`
          : `Rekomendasi nutrisi ${recommendMl} ml diterapkan ke Device Control.`,
        "success"
      );
    }, 180);
  };

  const refreshPrediction = () => {
    if (!ai.enabled) {
      showToast("Modul AI nonaktif. Aktifkan di Setting.", "warn");
      return;
    }
    setRefreshing(true);
    window.setTimeout(() => {
      const nextSensors = {
        ph: Number((5.4 + Math.random() * 1.2).toFixed(2)),
        ec: Number((1.1 + Math.random() * 0.9).toFixed(2)),
        suhu: Number((22 + Math.random() * 7).toFixed(1)),
        kelembapan: Math.floor(48 + Math.random() * 35),
        cahaya: Math.floor(250 + Math.random() * 500),
        levelAir: Math.floor(35 + Math.random() * 55),
      };
      setSensors(nextSensors);
      setPrediction({
        nutrisi: Math.floor(280 + Math.random() * 60),
        air: Number((2 + Math.random() * 0.6).toFixed(1)),
        confNutrisi: Math.floor(86 + Math.random() * 10),
        confAir: Math.floor(84 + Math.random() * 12),
      });
      setApplied(false);
      setRefreshing(false);
      showToast(
        `Prediksi diperbarui (${modelLabel(ai.model)}, horizon ${horizon} jam).`,
        "info"
      );
    }, 700);
  };

  return (
    <PageShell
      title="AI Prediction"
      subtitle="Analisis dan prediksi kebutuhan nutrisi & air"
    >
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display font-semibold text-[0.98rem] text-hydro-ink">
            Ringkasan Prediksi
          </h2>
          <p className="text-[0.72rem] text-hydro-muted mt-1">
            {ai.enabled
              ? `Horizon ${horizon} jam · ${modelLabel(ai.model)}`
              : "Modul AI nonaktif — aktifkan di Setting"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[0.78rem] font-medium text-hydro-muted whitespace-nowrap">
              Tanggal
            </span>
            <ThemeDatePicker
              value={date}
              max={today}
              onChange={setDate}
              aria-label="Filter tanggal prediksi AI"
            />
          </div>
          <button
            type="button"
            onClick={refreshPrediction}
            disabled={refreshing || !ai.enabled}
            className="btn-secondary disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Memperbarui..." : "Perbarui"}
          </button>
        </div>
      </div>

      {/* Prediksi nutrisi + air — sejajar, tinggi sama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 items-stretch">
        <PredictionCard
          icon={<FlaskConical size={16} />}
          iconClass="bg-hydro-accent-soft text-hydro-primary"
          title="Kebutuhan Nutrisi"
          horizon={horizon}
          value={prediction.nutrisi}
          unit="ml"
          confidence={prediction.confNutrisi}
          accentClass="text-hydro-primary"
          barClass="bg-hydro-primary"
        />
        <PredictionCard
          icon={<Droplets size={16} />}
          iconClass="bg-[#d9eef8] text-hydro-accent"
          title="Kebutuhan Air"
          horizon={horizon}
          value={prediction.air}
          unit="Liter"
          confidence={prediction.confAir}
          accentClass="text-hydro-accent"
          barClass="bg-hydro-accent"
        />
      </div>

      {/* Faktor sensor — full width, lebih lega */}
      <div className="panel p-3.5 sm:p-4 card-enter">
        <div className="mb-3">
          <h3 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
            Analisis Faktor Sensor
          </h3>
          <p className="text-[0.72rem] text-hydro-muted mt-0.5">
            Nilai terkini dibanding ambang batas di Setting
          </p>
        </div>
        <div className="table-scroll">
          <table className="hydro-table min-w-[480px]">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Nilai saat ini</th>
                <th>Status</th>
                <th>Dampak</th>
              </tr>
            </thead>
            <tbody>
              {factorRows.map((row) => {
                const evalStatus = evaluateSensorStatus(
                  row.key,
                  row.value,
                  thresholds
                );
                const ok = evalStatus === "Optimal";
                return (
                  <tr key={row.key}>
                    <td className="font-medium">{row.label}</td>
                    <td className="tabular-nums">
                      {row.value}
                      {row.unit}
                    </td>
                    <td>
                      <span
                        className={`font-semibold ${
                          ok ? "text-hydro-primary" : "text-hydro-warn"
                        }`}
                      >
                        {statusLabel(row.key, evalStatus)}
                      </span>
                    </td>
                    <td
                      className={
                        ok ? "text-hydro-muted" : "text-hydro-warn font-medium"
                      }
                    >
                      {impactLabel(row.key, evalStatus)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analisis AI + Deteksi kondisi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 items-stretch">
        <div className="lg:col-span-7 panel p-3.5 sm:p-4 card-enter flex flex-col">
          <div className="flex items-start gap-2.5 mb-3">
            <span className="w-9 h-9 rounded-xl bg-hydro-accent-soft text-hydro-primary inline-flex items-center justify-center shrink-0">
              <Brain size={17} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                Analisis AI
              </h3>
              <p className="text-[0.72rem] text-hydro-muted mt-0.5 leading-relaxed">
                Ringkasan pola sensor untuk prediksi kebutuhan dan deteksi
                anomali.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-[0.84rem] flex-1">
            {hasAnomaly ? (
              anomalies.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start gap-2 rounded-xl border border-hydro-warn/20 bg-[#fff8f0] px-3 py-2"
                >
                  <AlertTriangle
                    size={15}
                    className="text-hydro-warn shrink-0 mt-0.5"
                  />
                  <span className="text-hydro-ink">
                    <span className="font-semibold text-hydro-warn">
                      {item.label}:
                    </span>{" "}
                    {item.message}
                  </span>
                </div>
              ))
            ) : (
              [
                "pH berada dalam rentang optimal",
                "Kadar nutrisi (EC/TDS) cenderung menurun secara bertahap",
                "Suhu dan kelembapan lingkungan stabil",
                "Intensitas cahaya masih dalam kategori cukup",
                "Level air masih aman untuk beberapa jam ke depan",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-start gap-2 text-hydro-ink"
                >
                  <CheckCircle
                    size={15}
                    className="text-hydro-primary shrink-0 mt-0.5"
                  />
                  <span>{text}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-5 panel p-3.5 sm:p-4 card-enter flex flex-col">
          <h3 className="font-display font-semibold text-[0.95rem] text-hydro-ink mb-3">
            Deteksi Kondisi
          </h3>
          <div
            className={`
              flex-1 rounded-2xl border p-5 flex flex-col justify-center
              ${
                hasAnomaly
                  ? "border-hydro-warn/25 bg-[#fff8f0]"
                  : "border-hydro-primary/15 bg-gradient-to-br from-hydro-accent-soft/70 to-white"
              }
            `}
          >
            <div
              className={`
                flex items-center gap-2.5
                ${hasAnomaly ? "text-hydro-warn" : "text-hydro-primary"}
              `}
            >
              {hasAnomaly ? (
                <AlertTriangle size={26} />
              ) : (
                <CheckCircle2 size={26} />
              )}
              <span className="font-display text-2xl font-semibold tracking-tight">
                {hasAnomaly ? "ANOMALI" : "NORMAL"}
              </span>
            </div>
            <p className="text-[0.78rem] text-hydro-muted mt-3 leading-relaxed">
              {hasAnomaly
                ? `${anomalies.length} penyimpangan terdeteksi. Periksa rekomendasi korektif.`
                : "Tidak ditemukan kondisi abnormal. Sistem berjalan dalam kondisi optimal."}
            </p>
          </div>
        </div>
      </div>

      {/* Riwayat + Rekomendasi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 items-start">
        <div className="lg:col-span-8 panel p-3.5 sm:p-4 card-enter h-fit">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                Riwayat Prediksi
              </h3>
              <p className="text-[0.72rem] text-hydro-muted mt-0.5">
                {history.length
                  ? `${history.length} entri pada tanggal terpilih`
                  : "Tidak ada data untuk tanggal ini"}
              </p>
            </div>
            <TablePageSize
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              onPageChange={setPage}
            />
          </div>

          {pagedHistory.total === 0 ? (
            <div className="rounded-xl border border-dashed border-hydro-border bg-hydro-bg2/40 px-4 py-10 text-center text-[0.85rem] text-hydro-muted">
              Tidak ada riwayat untuk tanggal ini. Coba 16–17 Jul 2026.
            </div>
          ) : (
            <>
              <div className="table-scroll">
                <table className="hydro-table min-w-[520px]">
                  <thead>
                    <tr>
                      <th>Waktu</th>
                      <th>Nutrisi</th>
                      <th>Air</th>
                      <th>Keyakinan</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedHistory.rows.map((row) => (
                      <tr key={`${row.date}-${row.time}`}>
                        <td className="tabular-nums font-medium">{row.time}</td>
                        <td>{row.nutrisi}</td>
                        <td>{row.air}</td>
                        <td className="font-semibold text-hydro-primary tabular-nums">
                          {row.akurasi}
                        </td>
                        <td className="text-hydro-primary font-medium">
                          {row.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <TablePager
                pageSize={pageSize}
                page={pagedHistory.page}
                onPageChange={setPage}
                total={pagedHistory.total}
                totalPages={pagedHistory.totalPages}
                from={pagedHistory.from}
                to={pagedHistory.to}
              />
            </>
          )}
        </div>

        <div className="lg:col-span-4 panel p-3.5 sm:p-4 card-enter h-fit">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-xl bg-hydro-accent-soft text-hydro-primary inline-flex items-center justify-center shrink-0">
              <Lightbulb size={16} />
            </span>
            <div>
              <h3 className="font-display font-semibold text-[0.95rem] text-hydro-ink">
                Rekomendasi AI
              </h3>
              <p className="text-[0.7rem] text-hydro-muted">Decision support</p>
            </div>
          </div>

          <div className="rounded-xl border border-hydro-border bg-hydro-bg2/40 p-3.5 mb-3">
            <div className="flex items-start gap-2.5">
              <FlaskConical
                size={18}
                className="text-hydro-primary shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <p className="font-display text-[0.9rem] font-semibold text-hydro-ink leading-snug">
                  Penambahan nutrisi{" "}
                  <span className="text-hydro-primary">{recommendMl} ml</span>
                </p>
                <p className="text-[0.75rem] text-hydro-muted mt-1">
                  dalam 3 jam ke depan
                </p>
                {applied ? (
                  <p className="text-[0.72rem] font-semibold text-hydro-primary mt-2">
                    Sudah diterapkan
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mb-3.5">
            <div className="flex justify-between text-[0.72rem] mb-1.5">
              <span className="text-hydro-muted">Tingkat keyakinan</span>
              <span className="font-semibold text-hydro-primary">
                {prediction.confNutrisi}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-hydro-bg2 overflow-hidden">
              <div
                className="h-full rounded-full bg-hydro-primary bar-fill"
                style={{ width: `${prediction.confNutrisi}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={applyRecommendation}
              disabled={applied || applying || !ai.enabled}
              className="btn-primary w-full"
            >
              {applying ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Menerapkan...
                </>
              ) : applied ? (
                "Sudah Diterapkan"
              ) : (
                "Terapkan Rekomendasi"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/device-control")}
              className="btn-secondary w-full"
            >
              Lihat Device Control
            </button>
          </div>
        </div>
      </div>

      {/* Footer catatan — lebar selaras card di atas */}
      <p className="inline-flex items-start gap-1.5 text-[0.72rem] text-hydro-muted leading-relaxed w-full pb-1">
        <Info size={13} className="shrink-0 mt-0.5 text-hydro-primary" />
        <span className="min-w-0 flex-1">
          Prediksi berdasarkan data sensor terkini &amp; historis. AI berperan
          sebagai decision support, bukan kontrol penuh.
        </span>
      </p>
    </PageShell>
  );
}
