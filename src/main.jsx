/**
 * main.jsx — entry point aplikasi React SmartHydro-AI.
 *
 * Untuk apa:
 * - File ini yang pertama dijalankan dari index.html (#root)
 * - Memasang Router, Context Providers, dan App (routing halaman)
 * - Mengimpor index.css (tema Tailwind + token desain)
 *
 * Lapisan arsitektur:
 *   index.html → main.jsx → AppProviders → App (Routes) → pages
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppProviders from "./app/Providers";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);
