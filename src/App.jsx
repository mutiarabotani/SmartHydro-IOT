import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import AIPrediction from "./pages/AIPrediction";
import DeviceControl from "./pages/DeviceControl";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/monitoring"
        element={<Monitoring />}
      />

      <Route
        path="/ai-prediction"
        element={<AIPrediction />}
      />

      <Route
        path="/device-control"
        element={<DeviceControl />}
      />

    </Routes>
  );
}

export default App;