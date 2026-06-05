import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Monitoring() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar
          title="Monitoring"
          subtitle="Pemantauan Sensor Hidroponik"
        />

        <div className="p-6">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Monitoring Parameter Hidroponik
            </h2>

            <div className="flex items-center gap-3">
              <span className="font-medium">
                Periode
              </span>

              <select
                className="
                border
                border-slate-300
                rounded-lg
                px-3
                py-2
                bg-white
                "
              >
                <option>Hari Ini</option>
                <option>Minggu Ini</option>
                <option>Bulan Ini</option>
              </select>
            </div>
          </div>

          {/* CARD SENSOR */}
          <div className="grid grid-cols-6 gap-4 mb-8 max-w-full">

            <div className="bg-white rounded-xl border border-slate-200 h-[140px] flex flex-col items-center justify-center text-center">
              <h3 className="text-base text-slate-500 mb-3">
                pH Level
              </h3>

              <div className="text-2xl font-bold mb-3">
                5.86
              </div>

              <div className="text-green-600 text-sm">
                Optimal
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 h-[140px] flex flex-col items-center justify-center text-center">
              <h3 className="text-base text-slate-500 mb-3">
                EC / TDS
              </h3>

              <div className="text-2xl font-bold mb-3">
                1.62
              </div>

              <div className="text-green-600 text-sm">
                Optimal
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 h-[140px] flex flex-col items-center justify-center text-center">
              <h3 className="text-base text-slate-500 mb-3">
                Suhu
              </h3>

              <div className="text-2xl font-bold mb-3">
                24.7°C
              </div>

              <div className="text-green-600 text-sm">
                Optimal
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 h-[140px] flex flex-col items-center justify-center text-center">
              <h3 className="text-base text-slate-500 mb-3">
                Kelembapan
              </h3>

              <div className="text-2xl font-bold mb-3">
                68%
              </div>

              <div className="text-green-600 text-sm">
                Optimal
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 h-[140px] flex flex-col items-center justify-center text-center">
              <h3 className="text-base text-slate-500 mb-3">
                Cahaya
              </h3>

              <div className="text-2xl font-bold mb-3">
                520
              </div>

              <div className="text-green-600 text-sm">
                Optimal
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 h-[140px] flex flex-col items-center justify-center text-center">
              <h3 className="text-base text-slate-500 mb-3">
                Level Air
              </h3>

              <div className="text-2xl font-bold mb-3">
                78%
              </div>

              <div className="text-green-600 text-sm">
                Optimal
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}