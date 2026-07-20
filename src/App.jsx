/**
 * App.jsx — peta routing + splash ringan saat boot.
 *
 * Untuk apa:
 * - Menghubungkan URL ke halaman (pages/)
 * - Menampilkan AppSplash sekali saat aplikasi dibuka (overlay singkat)
 * - Pindah halaman TIDAK memicu splash lagi
 */
import { useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppSplash from "./app/AppSplash";

import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import AIPrediction from "./pages/AIPrediction";
import DeviceControl from "./pages/DeviceControl";
import Log from "./pages/Log";
import Setting from "./pages/Setting";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash ? <AppSplash onDone={hideSplash} /> : null}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/ai-prediction" element={<AIPrediction />} />
        <Route path="/device-control" element={<DeviceControl />} />
        <Route path="/log" element={<Log />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </>
  );
}

export default App;
