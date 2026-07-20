/**
 * SortableTh.jsx — header kolom dengan indikator urutan.
 *
 * Panah modern: chevron tipis ↑↓ bertumpuk (atas–bawah).
 */
import { ChevronDown, ChevronUp } from "lucide-react";

export function SortDirIcon({ active, dir }) {
  const upOn = active && dir === "asc";
  const downOn = active && dir === "desc";

  return (
    <span className="sort-pair" aria-hidden>
      <ChevronUp
        size={11}
        strokeWidth={2.5}
        className={upOn ? "sort-on" : "sort-off"}
      />
      <ChevronDown
        size={11}
        strokeWidth={2.5}
        className={downOn ? "sort-on" : "sort-off"}
      />
    </span>
  );
}

export function SortableTh({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  className = "",
}) {
  const active = sortKey === column;

  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`sort-th-btn${active ? " is-active" : ""}`}
        aria-label={`Urutkan ${label}${
          active ? (sortDir === "asc" ? ", terlama dulu" : ", terbaru dulu") : ""
        }`}
      >
        <span>{label}</span>
        <SortDirIcon active={active} dir={sortDir} />
      </button>
    </th>
  );
}

export function nextSortState(prev, column, defaultDir = "asc") {
  if (prev.key === column) {
    return { key: column, dir: prev.dir === "asc" ? "desc" : "asc" };
  }
  return { key: column, dir: defaultDir };
}

export function sortRows(rows, sort, getValue) {
  if (!sort?.key || !rows?.length) return rows ?? [];
  const mult = sort.dir === "desc" ? -1 : 1;

  return [...rows].sort((a, b) => {
    const va = getValue(a, sort.key);
    const vb = getValue(b, sort.key);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * mult;
    }
    return (
      String(va).localeCompare(String(vb), "id", {
        numeric: true,
        sensitivity: "base",
      }) * mult
    );
  });
}

export function timeToMinutes(time) {
  const m = String(time ?? "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return 0;
  return Number(m[1]) * 60 + Number(m[2]);
}

const MONTH_IDX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export function parseIdDate(dateStr) {
  const m = String(dateStr ?? "").match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
  if (!m) return 0;
  const month = MONTH_IDX[m[2]];
  if (month == null) return 0;
  return Date.UTC(Number(m[3]), month, Number(m[1]));
}

export default SortableTh;
