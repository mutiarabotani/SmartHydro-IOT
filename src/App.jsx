/**
 * App.jsx — peta navigasi (routing) seluruh halaman SmartHydro-AI.
 * Setiap path URL diarahkan ke komponen page yang sesuai.
 */
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import AIPrediction from "./pages/AIPrediction";
import DeviceControl from "./pages/DeviceControl";
import Log from "./pages/Log";
import Setting from "./pages/Setting";

function App() {
  return (
    <Routes>
      {/* Beranda ringkasan sistem */}
      <Route path="/" element={<Dashboard />} />

      {/* Pemantauan sensor + grafik + riwayat */}
      <Route path="/monitoring" element={<Monitoring />} />

      {/* Prediksi AI nutrisi/air + rekomendasi */}
      <Route path="/ai-prediction" element={<AIPrediction />} />

      {/* Kontrol mode AUTO/MANUAL + aktuator */}
      <Route path="/device-control" element={<DeviceControl />} />

      {/* Riwayat log sistem lengkap */}
      <Route path="/log" element={<Log />} />

      {/* Konfigurasi ambang batas, notifikasi, IoT, AI */}
      <Route path="/setting" element={<Setting />} />
    </Routes>
  );
}

export default App;
