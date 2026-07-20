/**
 * TablePager.jsx — pagination tabel (UI layer).
 *
 * Untuk apa:
 * - TablePageSize : pilih jumlah baris (diletakkan SEBELUM tabel)
 * - TablePager    : info rentang + prev/next (diletakkan SESUDAH tabel)
 * - paginateRows  : helper memotong array sesuai page & pageSize
 *
 * Dipakai di Monitoring, AI Prediction, dan Log.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import ThemeSelect from "./ThemeSelect";
import ThemeTip from "./ThemeTip";

/** Opsi jumlah baris; "all" = tampilkan semua */
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, "all"];

const PAGE_SIZE_SELECT_OPTIONS = PAGE_SIZE_OPTIONS.map((opt) => ({
  value: String(opt),
  label: opt === "all" ? "Semua" : String(opt),
}));

/**
 * Potong array sesuai page & pageSize.
 * @returns {{ rows, total, totalPages, page, from, to }}
 */
export function paginateRows(items, page, pageSize) {
  const total = items.length;
  const size = pageSize === "all" ? Math.max(total, 1) : pageSize;
  const totalPages = Math.max(1, Math.ceil(total / size) || 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * size;
  const end = Math.min(start + size, total);

  return {
    rows: items.slice(start, end),
    total,
    totalPages,
    page: safePage,
    from: total === 0 ? 0 : start + 1,
    to: end,
  };
}

/** Dropdown "Tampilkan X data" — taruh di atas tabel */
export function TablePageSize({ pageSize, onPageSizeChange, onPageChange }) {
  return (
    <div className="flex items-center gap-2 text-[0.78rem] text-hydro-muted">
      <span className="whitespace-nowrap">Tampilkan</span>
      <ThemeSelect
        value={String(pageSize)}
        onChange={(v) => {
          onPageSizeChange(v === "all" ? "all" : Number(v));
          onPageChange(1);
        }}
        options={PAGE_SIZE_SELECT_OPTIONS}
        align="right"
        aria-label="Jumlah data per halaman"
        className="w-[5.75rem]"
        buttonClassName="px-2 py-1 text-[0.78rem] min-w-[5.75rem]"
      />
      <span className="whitespace-nowrap">data</span>
    </div>
  );
}

/** Info rentang + tombol halaman — taruh di bawah tabel */
export default function TablePager({
  pageSize,
  page,
  onPageChange,
  total,
  totalPages,
  from,
  to,
}) {
  const isAll = pageSize === "all";

  return (
    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <span className="text-[0.75rem] text-hydro-muted tabular-nums">
        {total === 0 ? "0 data" : `${from}–${to} dari ${total}`}
      </span>

      <div className="flex items-center gap-1">
        <ThemeTip tip={isAll || page <= 1 ? "" : "Sebelumnya"} prefer="bottom">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={isAll || page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="
              w-8 h-8 rounded-lg border border-hydro-border
              inline-flex items-center justify-center
              text-hydro-primary bg-white/90
              hover:border-hydro-accent hover:bg-hydro-accent-soft transition
              disabled:opacity-40 disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            <ChevronLeft size={16} />
          </button>
        </ThemeTip>
        <span className="min-w-[4.5rem] text-center text-[0.75rem] text-hydro-muted tabular-nums">
          {isAll ? "Semua" : `${page} / ${totalPages}`}
        </span>
        <ThemeTip tip={isAll || page >= totalPages ? "" : "Berikutnya"} prefer="bottom">
          <button
            type="button"
            aria-label="Halaman berikutnya"
            disabled={isAll || page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="
              w-8 h-8 rounded-lg border border-hydro-border
              inline-flex items-center justify-center
              text-hydro-primary bg-white/90
              hover:border-hydro-accent hover:bg-hydro-accent-soft transition
              disabled:opacity-40 disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            <ChevronRight size={16} />
          </button>
        </ThemeTip>
      </div>
    </div>
  );
}
