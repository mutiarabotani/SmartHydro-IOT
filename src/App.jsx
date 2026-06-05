import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import AIPrediction from "./pages/AIPrediction";

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

    </Routes>
  );
}

export default App;