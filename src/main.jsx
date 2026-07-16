/**
 * Entry point aplikasi React.
 * File ini yang pertama dijalankan lewat index.html.
 *
 * Susunan provider (dari luar ke dalam):
 * 1. StrictMode     → bantu deteksi masalah di development
 * 2. BrowserRouter  → mengaktifkan routing URL (/, /monitoring, dll)
 * 3. SidebarProvider→ state buka/tutup sidebar global
 * 4. ToastProvider  → notifikasi toast global
 * 5. App            → komponen utama berisi Routes
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { ToastProvider } from "./context/ToastContext";
import App from "./App";
import "./index.css"; // tema, warna, animasi, scrollbar

// Mount aplikasi ke elemen #root di index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
