/**
 * PageShell.jsx — kerangka layout bersama semua halaman SmartHydro-AI.
 *
 * Digabung dari pola berulang di tiap page:
 *   Sidebar + Navbar sticky + area konten yang bisa di-scroll
 *
 * Props:
 * - title / subtitle     → teks Navbar (opsional; default Dashboard)
 * - contentClassName     → class tambahan di area konten (mis. space-y-4)
 * - children             → isi halaman
 */
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function PageShell({
  title,
  subtitle,
  contentClassName = "space-y-3",
  children,
}) {
  return (
    <div className="flex app-screen overflow-hidden page-shell">
      {/* Menu navigasi kiri */}
      <Sidebar />

      {/* Kolom kanan: navbar tetap + konten scroll */}
      <div className="flex-1 min-w-0 flex flex-col app-screen overflow-hidden">
        <Navbar title={title} subtitle={subtitle} />

        <div
          className={`flex-1 overflow-y-auto p-3 sm:p-4 page-enter content-stagger page-scroll ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
