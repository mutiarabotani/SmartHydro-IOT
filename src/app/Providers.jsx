/**
 * Providers.jsx — komposisi Context Provider untuk seluruh aplikasi.
 *
 * Kenapa digabung di satu file?
 * - main.jsx tetap tipis (hanya mount React + Router)
 * - Urutan provider jelas & terdokumentasi di satu tempat
 *
 * Urutan (luar → dalam) penting karena dependency antar state:
 * 1. SidebarProvider  → UI chrome (buka/tutup menu)
 * 2. SettingsProvider → ambang, IoT MQTT, AI, notifikasi
 * 3. DevicesProvider  → mode AUTO/MANUAL + aktuator
 * 4. ToastProvider     → notifikasi singkat (butuh dipakai di halaman dalam)
 */
import { SidebarProvider } from "../context/SidebarContext";
import { SettingsProvider } from "../context/SettingsContext";
import { DevicesProvider } from "../context/DevicesContext";
import { ToastProvider } from "../context/ToastContext";

/** Membungkus tree React dengan semua provider aplikasi */
export default function AppProviders({ children }) {
  return (
    <SidebarProvider>
      <SettingsProvider>
        <DevicesProvider>
          <ToastProvider>{children}</ToastProvider>
        </DevicesProvider>
      </SettingsProvider>
    </SidebarProvider>
  );
}
