/**
 * SensorChart.jsx — komponen grafik garis generik (Recharts).
 *
 * Props:
 * - title : judul grafik
 * - data  : array { time, value }
 *
 * Catatan: komponen cadangan; halaman Monitoring saat ini
 * memakai ChartCard internal sendiri.
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SensorChart({ title, data }) {
  return (
    <div className="panel p-4 h-[250px]">
      <h3 className="font-display font-semibold mb-4 text-hydro-ink">
        {title}
      </h3>

      {/* ResponsiveContainer agar grafik menyesuaikan lebar parent */}
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#5a6b66" />
          <YAxis stroke="#5a6b66" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0f6b5c"
            strokeWidth={3}
            dot={{ fill: "#2bb8a8", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
