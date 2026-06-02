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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function ChartSection() {

  const phData = {
    labels: [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00"
    ],
    datasets: [
      {
        label: "pH",
        data: [5.6, 5.8, 5.7, 5.9, 5.8, 5.86],
        borderColor: "#3b82f6",
        tension: 0.4
      }
    ]
  };

  const tempData = {
    labels: [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00"
    ],
    datasets: [
      {
        label: "Suhu",
        data: [24, 25, 24.5, 25.2, 24.8, 24.7],
        borderColor: "#f97316",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="grid grid-cols-2 gap-5 mt-6">

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <h2 className="font-bold text-xl mb-4">
          Grafik pH
        </h2>

        <Line data={phData} />

      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <h2 className="font-bold text-xl mb-4">
          Grafik Suhu
        </h2>

        <Line data={tempData} />

      </div>

    </div>
  );
}