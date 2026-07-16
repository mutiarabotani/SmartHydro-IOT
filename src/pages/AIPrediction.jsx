/**
 * AIPrediction.jsx — halaman prediksi AI kebutuhan nutrisi & air.
 *
 * Fitur:
 * - Ringkasan prediksi + confidence
 * - Analisis faktor sensor & deteksi kondisi
 * - Riwayat prediksi (bisa difilter tanggal)
 * - Tombol Terapkan Rekomendasi & Perbarui Prediksi (simulasi lokal)
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";

import {
  Brain,
  FlaskConical,
  Droplets,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

/** Riwayat prediksi mock */
const HISTORY = [
  { time: "10:00", date: "2026-07-17", nutrisi: "320 ml", air: "2.4 L", akurasi: "92%" },
  { time: "09:00", date: "2026-07-17", nutrisi: "310 ml", air: "2.3 L", akurasi: "90%" },
  { time: "08:00", date: "2026-07-17", nutrisi: "300 ml", air: "2.2 L", akurasi: "88%" },
  { time: "18:00", date: "2026-07-16", nutrisi: "280 ml", air: "2.1 L", akurasi: "87%" },
  { time: "12:00", date: "2026-07-16", nutrisi: "290 ml", air: "2.2 L", akurasi: "89%" },
];

export default function AIPrediction() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState("2026-07-17"); // filter riwayat
  const [applied, setApplied] = useState(false); // apakah rekomendasi sudah diterapkan
  const [refreshing, setRefreshing] = useState(false); // loading tombol perbarui
  // Hasil prediksi yang ditampilkan di kartu
  const [prediction, setPrediction] = useState({
    nutrisi: 320,
    air: 2.4,
    confNutrisi: 92,
    confAir: 89,
  });

  // Riwayat yang cocok dengan tanggal filter
  const history = useMemo(
    () => HISTORY.filter((row) => row.date === date),
    [date]
  );

  /** Simulasi terapkan rekomendasi nutrisi */
  const applyRecommendation = () => {
    if (applied) {
      showToast("Rekomendasi sudah diterapkan.", "info");
      return;
    }
    setApplied(true);
    showToast(
      "Rekomendasi nutrisi 160 ml diterapkan. Siap dikirim ke Device Control.",
      "success"
    );
  };

  /** Simulasi hitung ulang prediksi (acak nilai baru) */
  const refreshPrediction = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setPrediction({
        nutrisi: Math.floor(280 + Math.random() * 60),
        air: Number((2 + Math.random() * 0.6).toFixed(1)),
        confNutrisi: Math.floor(86 + Math.random() * 10),
        confAir: Math.floor(84 + Math.random() * 12),
      });
      setApplied(false);
      setRefreshing(false);
      showToast("Prediksi AI diperbarui berdasarkan data sensor terbaru.", "info");
    }, 700);
  };

  return (
    <div className="flex h-screen overflow-hidden page-shell">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">

        <Navbar
          title="AI Prediction"
          subtitle="Analisis dan Prediksi Kebutuhan Hidroponik"
        />

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 page-enter content-stagger">

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 mb-4">
            <button
              type="button"
              onClick={refreshPrediction}
              disabled={refreshing}
              className="
                inline-flex items-center justify-center gap-1.5
                border border-hydro-border rounded-lg
                px-3 py-1.5 text-[0.8rem] font-medium
                text-hydro-primary bg-white/90
                hover:border-hydro-accent transition
                disabled:opacity-60 cursor-pointer
                order-2 sm:order-1
              "
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Memperbarui..." : "Perbarui Prediksi"}
            </button>

            <div className="flex items-center gap-2 order-1 sm:order-2">
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
          </div>

          <h2 className="font-display text-[0.95rem] font-semibold text-hydro-ink mb-3">
            Ringkasan Prediksi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4">

            <div className="panel p-3 sm:p-4 card-enter">
              <div className="flex items-center gap-2 mb-2 text-hydro-primary">
                <FlaskConical size={18} className="shrink-0" />
                <h3 className="font-display font-medium text-[0.85rem] text-hydro-ink">
                  Prediksi Kebutuhan Nutrisi
                </h3>
              </div>
              <div
                key={`n-${prediction.nutrisi}`}
                className="font-display text-2xl font-semibold text-hydro-primary value-tick"
              >
                {prediction.nutrisi} ml
              </div>
              <p className="text-[0.75rem] text-hydro-muted mt-1.5">
                24 Jam Kedepan
              </p>
              <div className="mt-2.5 text-[0.75rem] text-hydro-muted">
                Tingkat Keyakinan {prediction.confNutrisi}%
              </div>
            </div>

            <div className="panel p-3 sm:p-4 card-enter">
              <div className="flex items-center gap-2 mb-2 text-hydro-accent">
                <Droplets size={18} className="shrink-0" />
                <h3 className="font-display font-medium text-[0.85rem] text-hydro-ink">
                  Prediksi Kebutuhan Air
                </h3>
              </div>
              <div
                key={`a-${prediction.air}`}
                className="font-display text-2xl font-semibold text-hydro-accent value-tick"
              >
                {prediction.air} L
              </div>
              <p className="text-[0.75rem] text-hydro-muted mt-1.5">
                24 Jam Kedepan
              </p>
              <div className="mt-2.5 text-[0.75rem] text-hydro-muted">
                Tingkat Keyakinan {prediction.confAir}%
              </div>
            </div>

            <div className="panel p-3 sm:p-4 card-enter sm:col-span-2 lg:col-span-1">
              <h3 className="font-display font-medium text-[0.85rem] mb-3 text-hydro-ink">
                Analisis Faktor Sensor
              </h3>
              <table className="w-full text-[0.8rem]">
                <tbody>
                  <tr>
                    <td className="py-1 text-hydro-muted">pH</td>
                    <td className="py-1">5.86</td>
                    <td className="py-1 text-hydro-primary font-medium">Normal</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-hydro-muted">EC/TDS</td>
                    <td className="py-1">1.62</td>
                    <td className="py-1 text-hydro-primary font-medium">Normal</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-hydro-muted">Suhu</td>
                    <td className="py-1">24.7°C</td>
                    <td className="py-1 text-hydro-primary font-medium">Optimal</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-hydro-muted">Kelembapan</td>
                    <td className="py-1">68%</td>
                    <td className="py-1 text-hydro-primary font-medium">Optimal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 mb-4">
            <div className="lg:col-span-2 panel p-3 sm:p-4 card-enter">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={20} className="text-hydro-primary" />
                <h3 className="font-display text-[0.95rem] font-semibold text-hydro-ink">
                  Analisis AI
                </h3>
              </div>
              <div className="space-y-2.5 text-[0.85rem]">
                <div className="flex items-center gap-2 text-hydro-ink">
                  <CheckCircle size={16} className="text-hydro-primary shrink-0" />
                  pH berada dalam rentang optimal
                </div>
                <div className="flex items-center gap-2 text-hydro-ink">
                  <CheckCircle size={16} className="text-hydro-primary shrink-0" />
                  Kadar nutrisi mulai menurun secara bertahap
                </div>
                <div className="flex items-center gap-2 text-hydro-ink">
                  <CheckCircle size={16} className="text-hydro-primary shrink-0" />
                  Suhu dan kelembapan stabil
                </div>
                <div className="flex items-center gap-2 text-hydro-ink">
                  <CheckCircle size={16} className="text-hydro-primary shrink-0" />
                  Level air masih aman 3-4 jam
                </div>
              </div>
            </div>

            <div className="panel p-3 sm:p-4 card-enter">
              <h3 className="font-display text-[0.95rem] font-semibold mb-3 text-hydro-ink">
                Deteksi Kondisi
              </h3>
              <div className="text-hydro-primary text-xl font-display font-semibold">
                NORMAL
              </div>
              <p className="mt-2.5 text-[0.8rem] text-hydro-muted leading-relaxed">
                Tidak ditemukan kondisi abnormal.
                Sistem berjalan optimal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">
            <div className="lg:col-span-2 panel p-3 sm:p-4 card-enter">
              <h3 className="font-display text-[0.95rem] font-semibold mb-3 text-hydro-ink">
                Riwayat Prediksi AI
              </h3>

              <div className="table-scroll">
                <table className="w-full min-w-[360px] text-[0.8rem] border border-hydro-border border-collapse">
                  <thead>
                    <tr className="bg-hydro-accent-soft/60">
                      <th className="border border-hydro-border p-1.5 text-center text-hydro-muted font-medium">Waktu</th>
                      <th className="border border-hydro-border p-1.5 text-center text-hydro-muted font-medium">Nutrisi</th>
                      <th className="border border-hydro-border p-1.5 text-center text-hydro-muted font-medium">Air</th>
                      <th className="border border-hydro-border p-1.5 text-center text-hydro-muted font-medium">Akurasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="border border-hydro-border text-center py-6 text-hydro-muted"
                        >
                          Tidak ada riwayat untuk tanggal ini.
                        </td>
                      </tr>
                    ) : (
                      history.map((row) => (
                        <tr key={`${row.date}-${row.time}`}>
                          <td className="border border-hydro-border p-1.5 text-center">{row.time}</td>
                          <td className="border border-hydro-border p-1.5 text-center">{row.nutrisi}</td>
                          <td className="border border-hydro-border p-1.5 text-center">{row.air}</td>
                          <td className="border border-hydro-border p-1.5 text-center text-hydro-primary font-medium">
                            {row.akurasi}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-hydro-accent-soft border border-hydro-border rounded-xl p-3 sm:p-4 card-enter">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-hydro-primary" />
                <h3 className="font-display text-[0.95rem] font-semibold text-hydro-ink">
                  Rekomendasi AI
                </h3>
              </div>

              <div className="bg-white/70 border border-hydro-border p-3 rounded-lg mb-3">
                <h4 className="font-display font-semibold text-[0.85rem] text-hydro-ink">
                  Penambahan Nutrisi
                </h4>
                <p className="font-display text-2xl font-semibold text-hydro-primary">
                  160 ml
                </p>
                <p className="text-[0.75rem] text-hydro-muted">
                  Dalam 3 jam ke depan
                </p>
                {applied && (
                  <p className="text-[0.75rem] text-hydro-primary font-medium mt-2">
                    Status: sudah diterapkan
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={applyRecommendation}
                className="
                w-full
                bg-hydro-primary
                text-white
                py-1.5
                rounded-lg
                mb-2
                hover:bg-hydro-primary-hover
                transition
                font-medium
                text-[0.8rem]
                cursor-pointer
                "
              >
                {applied ? "Rekomendasi Diterapkan" : "Terapkan Rekomendasi"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/device-control")}
                className="
                w-full
                border
                border-hydro-primary
                text-hydro-primary
                py-1.5
                rounded-lg
                hover:bg-white/60
                transition
                font-medium
                text-[0.8rem]
                cursor-pointer
                "
              >
                Lihat Device Control
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
