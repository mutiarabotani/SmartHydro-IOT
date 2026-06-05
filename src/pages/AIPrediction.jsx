import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Brain,
  FlaskConical,
  Droplets,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function AIPrediction() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 ml-[220px]">

        <Navbar
          title="AI Prediction"
          subtitle="Analisis dan Prediksi Kebutuhan Hidroponik"
        />

        <div className="p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Ringkasan Prediksi
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
                  Prediksi Kebutuhan Nutrisi
                </h3>
              </div>

              <div className="text-4xl font-bold">
                320 ml
              </div>

              <p className="text-slate-500 mt-2">
                24 Jam Kedepan
              </p>

              <div className="mt-4">
                Tingkat Keyakinan 92%
              </div>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">

              <div className="flex items-center gap-3 mb-3">
                <Droplets size={28} />
                <h3 className="font-semibold">
                  Prediksi Kebutuhan Air
                </h3>
              </div>

              <div className="text-4xl font-bold">
                2.4 L
              </div>

              <p className="text-slate-500 mt-2">
                24 Jam Kedepan
              </p>

              <div className="mt-4">
                Tingkat Keyakinan 89%
              </div>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">

              <h3 className="font-semibold mb-4">
                Analisis Faktor Sensor
              </h3>

              <table className="w-full text-sm">

                <tbody>

                  <tr>
                    <td>pH</td>
                    <td>5.86</td>
                    <td className="text-green-600">
                      Normal
                    </td>
                  </tr>

                  <tr>
                    <td>EC/TDS</td>
                    <td>1.62</td>
                    <td className="text-green-600">
                      Normal
                    </td>
                  </tr>

                  <tr>
                    <td>Suhu</td>
                    <td>24.7°C</td>
                    <td className="text-green-600">
                      Optimal
                    </td>
                  </tr>

                  <tr>
                    <td>Kelembapan</td>
                    <td>68%</td>
                    <td className="text-green-600">
                      Optimal
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* ANALISIS AI */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6">

              <div className="flex items-center gap-3 mb-4">

                <Brain size={30} />

                <h3 className="text-xl font-semibold">
                  Analisis AI
                </h3>

              </div>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  pH berada dalam rentang optimal
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  Kadar nutrisi mulai menurun secara bertahap
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  Suhu dan kelembapan stabil
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  Level air masih aman 3-4 jam
                </div>

              </div>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">

              <h3 className="text-xl font-semibold mb-4">
                Deteksi Kondisi
              </h3>

              <div className="text-green-600 text-3xl font-bold">
                NORMAL
              </div>

              <p className="mt-4 text-slate-600">
                Tidak ditemukan kondisi abnormal.
                Sistem berjalan optimal.
              </p>

            </div>

          </div>

          {/* RIWAYAT + REKOMENDASI */}
          <div className="grid grid-cols-3 gap-4">

            <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">

              <h3 className="text-xl font-semibold mb-4">
                Riwayat Prediksi AI
              </h3>

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="p-2">Waktu</th>
                    <th className="p-2">Nutrisi</th>
                    <th className="p-2">Air</th>
                    <th className="p-2">Akurasi</th>

                  </tr>

                </thead>

                <tbody>

                  <tr>
                    <td className="p-2 text-center">10:00</td>
                    <td className="p-2 text-center">320 ml</td>
                    <td className="p-2 text-center">2.4 L</td>
                    <td className="p-2 text-center">92%</td>
                  </tr>

                  <tr>
                    <td className="p-2 text-center">09:00</td>
                    <td className="p-2 text-center">310 ml</td>
                    <td className="p-2 text-center">2.3 L</td>
                    <td className="p-2 text-center">90%</td>
                  </tr>

                </tbody>

              </table>

            </div>

            <div className="bg-green-100 border border-green-300 rounded-xl p-5">

              <div className="flex items-center gap-3 mb-4">

                <AlertTriangle
                  className="text-green-700"
                />

                <h3 className="text-xl font-semibold">
                  Rekomendasi AI
                </h3>

              </div>

              <div className="bg-green-200 p-4 rounded-lg mb-4">

                <h4 className="font-bold text-lg">
                  Penambahan Nutrisi
                </h4>

                <p className="text-3xl font-bold">
                  160 ml
                </p>

                <p>
                  Dalam 3 jam ke depan
                </p>

              </div>

              <button
                className="
                w-full
                bg-green-600
                text-white
                py-2
                rounded-lg
                mb-3
                "
              >
                Terapkan Rekomendasi
              </button>

              <button
                className="
                w-full
                border
                border-green-600
                text-green-700
                py-2
                rounded-lg
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