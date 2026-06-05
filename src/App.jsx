import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";

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
    </Routes>
  );
}

export default App;