/**
 * ChartSection.jsx — contoh section grafik pH & suhu memakai Chart.js.
 *
 * Data masih hardcode (demo).
 * Komponen ini cadangan; belum diimpor di halaman aktif
 * (Monitoring memakai Recharts).
 */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

// Daftarkan modul Chart.js yang dibutuhkan agar grafik bisa digambar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function ChartSection() {
  // Dataset contoh untuk grafik pH
  const phData = {
    labels: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
    datasets: [
      {
        label: "pH",
        data: [5.6, 5.8, 5.7, 5.9, 5.8, 5.86],
        borderColor: "#0f6b5c",
        backgroundColor: "rgba(43, 184, 168, 0.15)",
        tension: 0.4
      }
    ]
  };

  // Dataset contoh untuk grafik suhu
  const tempData = {
    labels: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
    datasets: [
      {
        label: "Suhu",
        data: [24, 25, 24.5, 25.2, 24.8, 24.7],
        borderColor: "#d97706",
        backgroundColor: "rgba(217, 119, 6, 0.12)",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="grid grid-cols-2 gap-5 mt-6">
      <div className="panel p-6">
        <h2 className="font-display font-bold text-xl mb-4 text-hydro-ink">
          Grafik pH
        </h2>
        <Line data={phData} />
      </div>

      <div className="panel p-6">
        <h2 className="font-display font-bold text-xl mb-4 text-hydro-ink">
          Grafik Suhu
        </h2>
        <Line data={tempData} />
      </div>
    </div>
  );
}
