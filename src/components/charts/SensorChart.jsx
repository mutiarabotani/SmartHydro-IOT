/**
 * SensorChart.jsx — grafik garis sensor (Recharts) untuk halaman Monitoring.
 *
 * Digabung dari ChartCard internal Monitoring + SensorChart lama yang tidak terpakai.
 * Satu komponen chart dipakai ulang untuk pH, EC, suhu, kelembapan, cahaya, level air.
 *
 * Props:
 * - title   : judul di atas grafik
 * - data    : array titik data (default key X = "waktu", Y = "nilai")
 * - color   : warna garis
 * - dataKey : nama field Y di data (default "nilai")
 * - xKey    : nama field X di data (default "waktu")
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SensorChart({
  title,
  data,
  color = "#0f6b5c",
  dataKey = "nilai",
  xKey = "waktu",
}) {
  return (
    <div className="panel h-[200px] sm:h-[220px] p-3 flex flex-col card-enter">
      <h3 className="font-display font-medium text-[0.85rem] mb-2 text-hydro-ink shrink-0">
        {title}
      </h3>

      {/* ResponsiveContainer: grafik mengikuti lebar/tinggi parent */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d5cf" />
            <XAxis dataKey={xKey} stroke="#5a6b66" tick={{ fontSize: 11 }} />
            <YAxis stroke="#5a6b66" tick={{ fontSize: 11 }} width={32} />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.96)",
                border: "1px solid #c5d5cf",
                borderRadius: "0.5rem",
                color: "#0f1c1a",
                boxShadow: "0 8px 20px rgba(15, 107, 92, 0.12)",
                fontSize: "0.75rem",
              }}
              labelStyle={{ color: "#0f6b5c", fontWeight: 600 }}
              itemStyle={{ color: "#5a6b66" }}
              cursor={{ stroke: "#2bb8a8", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2.5}
              dot={{ fill: color, r: 2.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
