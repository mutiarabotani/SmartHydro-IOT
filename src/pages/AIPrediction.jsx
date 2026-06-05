import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Brain,
  FlaskConical,
  Droplets,
  AlertTriangle
} from "lucide-react";

export default function AIPrediction() {
  return (
    <div className="bg-slate-100">
      <Sidebar />

      <div className="ml-[220px] h-screen overflow-y-auto">

        <Navbar
          title="AI Prediction"
          subtitle="Prediksi dan Analisis Cerdas Hidroponik"
        />

        <div className="p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Prediksi AI Hidroponik
            </h2>

            <input
              type="date"
              className="
              border
              border-slate-300
              rounded-lg
              px-3
              py-2
              bg-white
              "
            />

          </div>

          {/* CARD PREDIKSI */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="bg-white rounded-xl border border-slate-200 p-5">

              <div className="flex items-center gap-3 mb-3">
                <FlaskConical size={28} />
                <h3 className="font-semibold">
                  Prediksi Nutrisi
                </h3>
              </div>

              <div className="text-3xl font-bold">
                320 ml
              </div>

              <p className="text-green-600 mt-2">
                Akurasi 92%
              </p>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">

              <div className="flex items-center gap-3 mb-3">
                <Droplets size={28} />
                <h3 className="font-semibold">
                  Prediksi Air
                </h3>
              </div>

              <div className="text-3xl font-bold">
                2.4 Liter
              </div>

              <p className="text-green-600 mt-2">
                Akurasi 89%
              </p>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">

              <div className="flex items-center gap-3 mb-3">
                <Brain size={28} />
                <h3 className="font-semibold">
                  Status AI
                </h3>
              </div>

              <div className="text-3xl font-bold text-green-600">
                Normal
              </div>

              <p className="text-slate-500 mt-2">
                Sistem berjalan optimal
              </p>

            </div>

          </div>

          {/* ANALISIS AI */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">

            <h3 className="text-xl font-semibold mb-4">
              Analisis AI
            </h3>

            <ul className="space-y-3">

              <li>
                ✓ pH berada pada rentang ideal.
              </li>

              <li>
                ✓ Nutrisi masih mencukupi.
              </li>

              <li>
                ✓ Suhu dan kelembapan stabil.
              </li>

              <li>
                ✓ Tidak ditemukan kondisi abnormal.
              </li>

            </ul>

          </div>

          {/* REKOMENDASI */}
          <div className="bg-green-600 text-white rounded-xl p-6">

            <div className="flex items-center gap-3 mb-3">

              <AlertTriangle size={28} />

              <h3 className="text-xl font-semibold">
                Rekomendasi AI
              </h3>

            </div>

            <p className="mb-4">
              Tambahkan nutrisi sebanyak 160 ml
              dalam 3 jam ke depan untuk menjaga
              kestabilan EC/TDS.
            </p>

            <button
              className="
              bg-white
              text-green-600
              px-5
              py-2
              rounded-lg
              font-semibold
              "
            >
              Terapkan Rekomendasi
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}