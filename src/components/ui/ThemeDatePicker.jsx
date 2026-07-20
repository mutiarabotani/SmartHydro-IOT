/**
 * ThemeDatePicker — kalender custom bertema SmartHydro.
 *
 * Untuk apa: Memilih tanggal (rentang waktu chart, filter histori, dll.)
 * dengan kalender popup bertema hydro; pengganti <input type="date"> native
 * yang tidak bisa diwarnai penuh.
 *
 * value / onChange memakai format YYYY-MM-DD (sama seperti input date).
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function parseISO(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDisplay(iso) {
  const date = parseISO(iso);
  if (!date) return "Pilih tanggal";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ThemeDatePicker({
  value,
  onChange,
  max,
  min,
  className = "",
  "aria-label": ariaLabel = "Pilih tanggal",
}) {
  const selected = parseISO(value);
  const maxDate = max ? startOfDay(parseISO(max)) : null;
  const minDate = min ? startOfDay(parseISO(min)) : null;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(
    () => selected || maxDate || startOfDay(new Date())
  );
  const [menuStyle, setMenuStyle] = useState(null);

  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (selected) setView(selected);
  }, [value]);

  const days = useMemo(() => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay(); // 0 = Minggu
    const cells = [];

    for (let i = 0; i < startOffset; i += 1) {
      const d = new Date(year, month, i - startOffset + 1);
      cells.push({ date: d, outside: true });
    }
    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDate; day += 1) {
      cells.push({ date: new Date(year, month, day), outside: false });
    }
    let trailing = 1;
    while (cells.length % 7 !== 0) {
      cells.push({ date: new Date(year, month + 1, trailing), outside: true });
      trailing += 1;
    }
    return cells;
  }, [view]);

  const updateMenuPosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const gap = 6;
    const width = Math.max(288, rect.width);
    const left = Math.max(
      8,
      Math.min(rect.right - width, window.innerWidth - width - 8)
    );
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < 320 && spaceAbove > spaceBelow;

    if (openUp) {
      setMenuStyle({
        position: "fixed",
        left,
        width,
        bottom: window.innerHeight - rect.top + gap,
        top: "auto",
      });
    } else {
      setMenuStyle({
        position: "fixed",
        left,
        width,
        top: rect.bottom + gap,
        bottom: "auto",
      });
    }
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return undefined;
    }
    updateMenuPosition();
    const onRepos = () => updateMenuPosition();
    window.addEventListener("resize", onRepos);
    window.addEventListener("scroll", onRepos, true);
    return () => {
      window.removeEventListener("resize", onRepos);
      window.removeEventListener("scroll", onRepos, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      const t = e.target;
      if (rootRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isDisabled = (date) => {
    const d = startOfDay(date);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const pick = (date) => {
    if (isDisabled(date)) return;
    onChange(toISO(date));
    setOpen(false);
  };

  const shiftMonth = (delta) => {
    setView((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const today = startOfDay(new Date());
  const canToday = !isDisabled(today);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`
          inline-flex items-center gap-2 min-w-[148px]
          border border-hydro-border rounded-xl
          px-2.5 py-1.5 text-[0.8rem]
          bg-white/90 text-hydro-ink
          hover:border-hydro-accent hover:bg-hydro-accent-soft/70
          focus:outline-none focus:border-hydro-accent focus:bg-hydro-accent-soft/70
          focus:shadow-[0_0_0_3px_rgba(42,174,160,0.12)]
          transition cursor-pointer
          ${open ? "border-hydro-accent bg-hydro-accent-soft" : ""}
        `}
      >
        <CalendarDays size={15} className="text-hydro-primary shrink-0" />
        <span className="font-medium tabular-nums">{formatDisplay(value)}</span>
      </button>

      {open &&
        menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            role="dialog"
            aria-label="Kalender"
            style={menuStyle}
            className="
              z-[300] rounded-2xl border border-hydro-border
              bg-white shadow-[0_16px_40px_rgba(18,36,33,0.14)]
              p-3
            "
          >
            {/* Header bulan */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <button
                type="button"
                aria-label="Bulan sebelumnya"
                onClick={() => shiftMonth(-1)}
                className="
                  w-8 h-8 rounded-lg border border-hydro-border
                  inline-flex items-center justify-center
                  text-hydro-primary hover:bg-hydro-accent-soft transition cursor-pointer
                "
              >
                <ChevronLeft size={16} />
              </button>

              <p className="font-display font-semibold text-[0.9rem] text-hydro-ink">
                {MONTHS[view.getMonth()]} {view.getFullYear()}
              </p>

              <button
                type="button"
                aria-label="Bulan berikutnya"
                onClick={() => shiftMonth(1)}
                className="
                  w-8 h-8 rounded-lg border border-hydro-border
                  inline-flex items-center justify-center
                  text-hydro-primary hover:bg-hydro-accent-soft transition cursor-pointer
                "
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Hari */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-[0.68rem] font-semibold text-hydro-muted py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(({ date, outside }) => {
                const disabled = isDisabled(date);
                const selectedDay = sameDay(date, selected);
                const isToday = sameDay(date, today);

                return (
                  <button
                    key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${outside ? "o" : "i"}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => pick(date)}
                    className={`
                      h-9 rounded-lg text-[0.78rem] font-medium
                      transition cursor-pointer
                      ${
                        selectedDay
                          ? "bg-hydro-primary text-white shadow-[0_4px_12px_rgba(14,106,92,0.28)]"
                          : isToday
                            ? "bg-hydro-accent-soft text-hydro-primary border border-hydro-primary/20"
                            : outside
                              ? "text-hydro-muted/45 hover:bg-hydro-bg2"
                              : "text-hydro-ink hover:bg-hydro-accent-soft hover:text-hydro-primary"
                      }
                      ${disabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : ""}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-hydro-border">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-[0.75rem] font-semibold text-hydro-muted hover:text-hydro-primary transition cursor-pointer"
              >
                Hapus
              </button>
              <button
                type="button"
                disabled={!canToday}
                onClick={() => pick(today)}
                className="
                  text-[0.75rem] font-semibold
                  text-hydro-primary hover:underline
                  disabled:opacity-40 disabled:no-underline
                  transition cursor-pointer
                "
              >
                Hari ini
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
