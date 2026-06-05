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

export default function Monitoring() {
    const chartData = [
  { waktu: "09:40", nilai: 5.81 },
  { waktu: "09:45", nilai: 5.83 },
  { waktu: "09:50", nilai: 5.84 },
  { waktu: "09:55", nilai: 5.82 },
  { waktu: "10:00", nilai: 5.86 }
];
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
          <div className="grid grid-cols-6 gap-4 mb-6">

            {/* pH */}
            <div className="bg-white rounded-xl border border-slate-200 h-[120px] px-4 flex items-center justify-center gap-3">
              <FlaskConical size={32} />

              <div>
                <h3 className="text-sm text-slate-500">
                  pH Level
                </h3>

                <div className="text-xl font-bold">
                  5.86
                </div>

                <div className="text-green-600 text-sm">
                  Optimal
                </div>
              </div>
            </div>

            {/* EC/TDS */}
            <div className="bg-white rounded-xl border border-slate-200 h-[120px] px-4 flex items-center justify-center gap-3">
              <Droplets size={32} />

              <div>
                <h3 className="text-sm text-slate-500">
                  EC / TDS
                </h3>

                <div className="text-xl font-bold">
                  1.62
                </div>

                <div className="text-green-600 text-sm">
                  Optimal
                </div>
              </div>
            </div>

            {/* Suhu */}
            <div className="bg-white rounded-xl border border-slate-200 h-[120px] px-4 flex items-center justify-center gap-3">
              <Thermometer size={32} />

              <div>
                <h3 className="text-sm text-slate-500">
                  Suhu
                </h3>

                <div className="text-xl font-bold">
                  24.7°C
                </div>

                <div className="text-green-600 text-sm">
                  Optimal
                </div>
              </div>
            </div>

            {/* Kelembapan */}
            <div className="bg-white rounded-xl border border-slate-200 h-[120px] px-4 flex items-center justify-center gap-3">
              <Droplets size={32} />

              <div>
                <h3 className="text-sm text-slate-500">
                  Kelembapan
                </h3>

                <div className="text-xl font-bold">
                  68%
                </div>

                <div className="text-green-600 text-sm">
                  Optimal
                </div>
              </div>
            </div>

            {/* Cahaya */}
            <div className="bg-white rounded-xl border border-slate-200 h-[120px] px-4 flex items-center justify-center gap-3">
              <Sun size={32} />

              <div>
                <h3 className="text-sm text-slate-500">
                  Cahaya
                </h3>

                <div className="text-xl font-bold">
                  520
                </div>

                <div className="text-green-600 text-sm">
                  Optimal
                </div>
              </div>
            </div>

            {/* Level Air */}
            <div className="bg-white rounded-xl border border-slate-200 h-[120px] px-4 flex items-center justify-center gap-3">
              <Waves size={32} />

              <div>
                <h3 className="text-sm text-slate-500">
                  Level Air
                </h3>

                <div className="text-xl font-bold">
                  78%
                </div>

                <div className="text-green-600 text-sm">
                  Optimal
                </div>
              </div>
            </div>

          </div>
          {/* GRAFIK BARIS 1 */}
<div className="grid grid-cols-3 gap-4 mb-4">

  <div className="bg-white rounded-xl border border-slate-200 h-[220px] p-4">
    <h3 className="font-semibold mb-3">
      Grafik pH
    </h3>

    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="waktu" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="nilai"
          stroke="#3b82f6"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="bg-white rounded-xl border border-slate-200 h-[220px] p-4">
    <h3 className="font-semibold mb-3">
      Grafik EC / TDS
    </h3>

    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="waktu" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="nilai"
          stroke="#10b981"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="bg-white rounded-xl border border-slate-200 h-[220px] p-4">
    <h3 className="font-semibold mb-3">
      Grafik Suhu (°C)
    </h3>

    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="waktu" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="nilai"
          stroke="#f97316"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

</div>

{/* GRAFIK BARIS 2 */}
<div className="grid grid-cols-3 gap-4 mb-6">

  <div className="bg-white rounded-xl border border-slate-200 h-[220px] p-4">
    <h3 className="font-semibold mb-3">
      Grafik Kelembapan (%)
    </h3>

    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="waktu" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="nilai"
          stroke="#06b6d4"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="bg-white rounded-xl border border-slate-200 h-[220px] p-4">
    <h3 className="font-semibold mb-3">
      Grafik Cahaya (Lux)
    </h3>

    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="waktu" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="nilai"
          stroke="#eab308"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="bg-white rounded-xl border border-slate-200 h-[220px] p-4">
    <h3 className="font-semibold mb-3">
      Grafik Level Air (%)
    </h3>

    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="waktu" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="nilai"
          stroke="#8b5cf6"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

</div>

          
<div className="bg-white rounded-xl border border-slate-300 p-4">
  <h3 className="text-xl font-semibold mb-4">
    Riwayat Data Sensor
  </h3>

  <div className="max-h-[280px] overflow-y-auto border border-slate-300 rounded-lg">
    <table className="w-full border-collapse text-sm">
      <thead className="sticky top-0 bg-white">
        <tr>
          <th className="border border-slate-300 p-3">Waktu</th>
          <th className="border border-slate-300 p-3">pH Level</th>
          <th className="border border-slate-300 p-3">EC/TDS (mS/cm)</th>
          <th className="border border-slate-300 p-3">Suhu °C</th>
          <th className="border border-slate-300 p-3">Kelembapan (%)</th>
          <th className="border border-slate-300 p-3">Cahaya (Lux)</th>
          <th className="border border-slate-300 p-3">Level Air (%)</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td className="border border-slate-300 p-3 text-center">10:00</td>
          <td className="border border-slate-300 p-3 text-center">5.86</td>
          <td className="border border-slate-300 p-3 text-center">1.62</td>
          <td className="border border-slate-300 p-3 text-center">24.7</td>
          <td className="border border-slate-300 p-3 text-center">68</td>
          <td className="border border-slate-300 p-3 text-center">520</td>
          <td className="border border-slate-300 p-3 text-center">78</td>
        </tr>

        <tr>
          <td className="border border-slate-300 p-3 text-center">09:55</td>
          <td className="border border-slate-300 p-3 text-center">5.82</td>
          <td className="border border-slate-300 p-3 text-center">1.60</td>
          <td className="border border-slate-300 p-3 text-center">24.6</td>
          <td className="border border-slate-300 p-3 text-center">67</td>
          <td className="border border-slate-300 p-3 text-center">515</td>
          <td className="border border-slate-300 p-3 text-center">77</td>
        </tr>

        <tr>
          <td className="border border-slate-300 p-3 text-center">09:50</td>
          <td className="border border-slate-300 p-3 text-center">5.84</td>
          <td className="border border-slate-300 p-3 text-center">1.61</td>
          <td className="border border-slate-300 p-3 text-center">24.6</td>
          <td className="border border-slate-300 p-3 text-center">68</td>
          <td className="border border-slate-300 p-3 text-center">510</td>
          <td className="border border-slate-300 p-3 text-center">77</td>
        </tr>

        <tr>
          <td className="border border-slate-300 p-3 text-center">09:45</td>
          <td className="border border-slate-300 p-3 text-center">5.83</td>
          <td className="border border-slate-300 p-3 text-center">1.59</td>
          <td className="border border-slate-300 p-3 text-center">24.6</td>
          <td className="border border-slate-300 p-3 text-center">67</td>
          <td className="border border-slate-300 p-3 text-center">505</td>
          <td className="border border-slate-300 p-3 text-center">76</td>
        </tr>

        <tr>
          <td className="border border-slate-300 p-3 text-center">09:40</td>
          <td className="border border-slate-300 p-3 text-center">5.81</td>
          <td className="border border-slate-300 p-3 text-center">1.58</td>
          <td className="border border-slate-300 p-3 text-center">24.5</td>
          <td className="border border-slate-300 p-3 text-center">66</td>
          <td className="border border-slate-300 p-3 text-center">500</td>
          <td className="border border-slate-300 p-3 text-center">76</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}