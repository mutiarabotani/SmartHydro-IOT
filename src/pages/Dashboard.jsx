import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FlaskConical,
  Droplets,
  Thermometer,
  Sun,
  Waves,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Bot,
} from "lucide-react";

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>

      <div
        className="
        border
        border-slate-300
        px-3
        py-1
        min-w-[130px]
        text-center
        rounded-md
        "
      >
        {value}
      </div>
    </div>
  );
}

export default function Dashboard() {

  const [sensorData, setSensorData] = useState({
    ph: 5.86,
    ec: 1.62,
    suhu: 24.7,
    kelembapan: 68,
    cahaya: 520,
    levelAir: 78,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData({
        ph: (5 + Math.random() * 2).toFixed(2),
        ec: (1 + Math.random()).toFixed(2),
        suhu: (24 + Math.random() * 3).toFixed(1),
        kelembapan: Math.floor(60 + Math.random() * 20),
        cahaya: Math.floor(450 + Math.random() * 150),
        levelAir: Math.floor(70 + Math.random() * 20),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sensors = [
    {
      title: "pH Level",
      value: sensorData.ph,
      unit: "",
    },
    {
      title: "EC / TDS",
      value: sensorData.ec,
      unit: "mS/cm",
    },
    {
      title: "Suhu",
      value: sensorData.suhu,
      unit: "°C",
    },
    {
      title: "Kelembapan",
      value: sensorData.kelembapan,
      unit: "%",
    },
    {
      title: "Cahaya",
      value: sensorData.cahaya,
      unit: "Lux",
    },
    {
      title: "Level Air",
      value: sensorData.levelAir,
      unit: "%",
    },
  ];
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-4">
          {/* MONITORING */}

          <div
            className="
            bg-white
            border
            border-slate-300
            rounded-xl
            p-5
            shadow-sm
            "
          >
            <h2 className="font-bold text-lg mb-4">
              Monitoring Parameter Hidroponik
            </h2>

            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-6
              gap-4
              "
            >
              {sensors.map((sensor, index) => (
                <div
                key={index}
                className="
                bg-white
                border
                border-slate-300
                rounded-lg
                p-4
                hover:shadow-md
                transition
                "
                >
                <div className="flex items-center justify-center gap-2 mb-2">
                {sensor.title === "pH Level" && <FlaskConical size={16} />}
                {sensor.title === "EC / TDS" && <Droplets size={16} />}
                {sensor.title === "Suhu" && <Thermometer size={16} />}
                {sensor.title === "Kelembapan" && <Droplets size={16} />}
                {sensor.title === "Cahaya" && <Sun size={16} />}
                {sensor.title === "Level Air" && <Waves size={16} />}

                <h3 className="text-sm text-slate-500">
                    {sensor.title}
                </h3>
                </div>

                  <div className="flex items-end justify-center gap-1 mt-3">
                    <span className="text-3xl font-bold">
                      {sensor.value}
                    </span>

                    <span className="text-sm text-slate-500 mb-1">
                      {sensor.unit}
                    </span>
                  </div>

                  <div className="w-full text-sm text-green-600 mt-2 text-center">
                    Optimal
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STATUS + LOG */}

          <div className="grid grid-cols-12 gap-4">
            {/* STATUS */}

            <div
              className="
              col-span-12
              lg:col-span-4
              bg-white
              border
              border-slate-300
              rounded-xl
              p-5
              shadow-sm
              "
            >
              <h2 className="font-bold text-lg mb-4">
                Status Sistem & Perangkat
              </h2>

              <div className="space-y-3">
                <Row
                  label="Mode Sistem"
                  value="OTOMATIS"
                />

                <Row
                  label="Pompa Nutrisi"
                  value="AKTIF"
                />

                <Row
                  label="Pompa Air"
                  value="AKTIF"
                />

                <Row
                  label="Relay"
                  value="AKTIF"
                />

                <Row
                  label="Koneksi Cloud"
                  value="TERHUBUNG"
                />
              </div>
            </div>

            {/* LOG */}
            <div
            className="
            col-span-12
            lg:col-span-8
            bg-white
            border
            border-slate-300
            rounded-xl
            p-5
            shadow-sm
            "
            >

            <h2 className="font-semibold text-2xl mb-3">
                Log Sistem
            </h2>

<div className="max-h-[260px] overflow-y-auto">
  <table className="w-full text-sm border border-slate-400 border-collapse">
    <thead>
      <tr>
        <th className="border border-slate-400 w-10 py-2"></th>
        <th className="border border-slate-400 text-left py-2 px-2">
          Waktu
        </th>
        <th className="border border-slate-400 text-left py-2 px-2">
          Level
        </th>
        <th className="border border-slate-400 text-left py-2 px-2">
          Sumber
        </th>
        <th className="border border-slate-400 text-left py-2 px-2">
          Pesan
        </th>
        <th className="border border-slate-400 text-left py-2 px-2">
          Tipe
        </th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td className="border border-slate-300 text-center py-3">
          <CheckCircle2
            size={16}
            className="mx-auto text-green-600"
          />
        </td>
        <td className="border border-slate-300 px-2 py-3">
          10:23
        </td>
        <td className="border border-slate-300 px-2 py-3">
          INFO
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Sistem
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Pompa nutrisi dinyalakan otomatis
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Aktuasi
        </td>
      </tr>

      <tr>
        <td className="border border-slate-300 text-center py-3">
          <CheckCircle2
            size={16}
            className="mx-auto text-green-600"
          />
        </td>
        <td className="border border-slate-300 px-2 py-3">
          10:45
        </td>
        <td className="border border-slate-300 px-2 py-3">
          INFO
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Sistem
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Pengisian air otomatis 2,5 Liter
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Aktuasi
        </td>
      </tr>

      <tr>
        <td className="border border-slate-300 text-center py-3">
          <AlertTriangle
            size={16}
            className="mx-auto text-yellow-500"
          />
        </td>
        <td className="border border-slate-300 px-2 py-3">
          09:30
        </td>
        <td className="border border-slate-300 px-2 py-3">
          WARNING
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Sensor pH
        </td>
        <td className="border border-slate-300 px-2 py-3">
          pH turun, penyesuaian otomatis dilakukan
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Peringatan
        </td>
      </tr>

      <tr>
        <td className="border border-slate-300 text-center py-3">
          <Bot
            size={16}
            className="mx-auto text-blue-600"
          />
        </td>
        <td className="border border-slate-300 px-2 py-3">
          08:15
        </td>
        <td className="border border-slate-300 px-2 py-3">
          INFO
        </td>
        <td className="border border-slate-300 px-2 py-3">
          AI Prediction
        </td>
        <td className="border border-slate-300 px-2 py-3">
          AI prediksi kebutuhan nutrisi dijalankan
        </td>
        <td className="border border-slate-300 px-2 py-3">
          AI
        </td>
      </tr>

      <tr>
        <td className="border border-slate-300 text-center py-3">
          <CheckCircle2
            size={16}
            className="mx-auto text-green-600"
          />
        </td>
        <td className="border border-slate-300 px-2 py-3">
          07:20
        </td>
        <td className="border border-slate-300 px-2 py-3">
          INFO
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Sistem
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Suhu kembali normal
        </td>
        <td className="border border-slate-300 px-2 py-3">
          Sensor
        </td>
      </tr>
    </tbody>
  </table>
</div>
</div>
</div>

          {/* AI */}

          <div
            className="
            bg-white
            border
            border-slate-300
            rounded-xl
            p-5
            shadow-sm
            "
          >
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Brain size={20} />
            Prediksi AI
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="
                border
                border-slate-300
                rounded-lg
                p-4
                "
              >
                <h3 className="font-semibold">
                  Prediksi Kebutuhan Nutrisi
                </h3>

                <div className="text-4xl font-bold mt-4">
                  320 ml
                </div>

                <div className="mt-4">
                  Confidence: 92%
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full mt-2">
                  <div
                    className="h-3 bg-blue-600 rounded-full"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>

              <div
                className="
                border
                border-slate-300
                rounded-lg
                p-4
                "
              >
                <h3 className="font-semibold">
                  Prediksi Kebutuhan Air
                </h3>

                <div className="text-4xl font-bold mt-4">
                  2.4 L
                </div>

                <div className="mt-4">
                  Confidence: 89%
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full mt-2">
                  <div
                    className="h-3 bg-cyan-600 rounded-full"
                    style={{ width: "89%" }}
                  />
                </div>
              </div>

              <div
                className="
                border
                border-slate-300
                rounded-lg
                p-4
                text-center
                "
              >
                <h3 className="font-semibold">
                  Deteksi Kondisi
                </h3>

                <div className="text-6xl mt-4">
                  ✅
                </div>

                <div className="font-bold text-green-600 mt-4">
                  NORMAL
                </div>
              </div>
            </div>
          </div>

          {/* REKOMENDASI */}

          <div
            className="
            bg-white
            border
            border-slate-300
            rounded-xl
            p-5
            shadow-sm
            "
          >
            <h2 className="font-bold text-lg mb-4">
              Rekomendasi AI
            </h2>

            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <p className="max-w-4xl text-slate-700">
                Sistem dalam kondisi normal. AI
                merekomendasikan penambahan nutrisi
                sebanyak 160 ml dalam 3 jam ke depan
                untuk menjaga kestabilan larutan.
              </p>

              <button
                className="
                bg-blue-600
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-blue-700
                transition
                "
              >
                Buka Kontrol Perangkat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}