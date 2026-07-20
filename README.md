# SmartHydro-AI Frontend

Prototype dashboard hidroponik (React 19 + Vite 8 + Tailwind CSS 4).
Data masih mock / localStorage; selaras arsitektur IoT MQTT di backend smart-hydro.

## Menjalankan

```bash
npm install
npm run dev
```

Build produksi: `npm run build` · Preview: `npm run preview` · Lint: `npm run lint`

## Arsitektur (`src/`)

```
src/
  main.jsx              → entry + mount React
  App.jsx               → routing URL → pages
  index.css             → tema global (Tailwind v4)
  app/Providers.jsx     → komposisi Context Provider
  pages/                → halaman (presentation)
  components/
    layout/             → PageShell, Sidebar, Navbar
    charts/             → SensorChart (Recharts)
    devices/            → DeviceCard
    ui/                 → TablePager, ThemeSelect, ThemeDatePicker
  context/              → state aplikasi (Settings, Devices, Sidebar, Toast)
```

Alur: `index.html` → `main.jsx` → `AppProviders` → `App` (Routes) → `pages/*` (dalam `PageShell`).

## Dependency utama

| Paket | Untuk |
|-------|--------|
| react / react-dom | UI |
| react-router-dom | Routing |
| lucide-react | Ikon |
| recharts | Grafik Monitoring |
| tailwindcss + @tailwindcss/vite | Styling |

Tidak memakai axios / Chart.js (belum ada API HTTP; chart memakai Recharts).
