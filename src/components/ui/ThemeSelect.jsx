/**
 * ThemeSelect — dropdown custom bertema SmartHydro (bukan <select> native).
 *
 * Untuk apa: Memilih satu opsi dari daftar (filter periode, tipe sensor, dll.)
 * dengan tampilan konsisten pada tema hydro; pengganti <select> agar styling
 * tidak terbatas oleh browser.
 *
 * Menu di-render via portal (fixed) agar tidak terpotong overflow card/page.
 *
 * options: Array<{ value: string, label: string }>
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export default function ThemeSelect({
  value,
  onChange,
  options,
  disabled = false,
  className = "",
  buttonClassName = "",
  align = "left", // "left" | "right"
  truncate = true,
  "aria-label": ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));
  const label = selected?.label ?? String(value ?? "");

  /** Hitung posisi menu di viewport (fixed); auto-flip ke atas jika ruang bawah sempit */
  const updateMenuPosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const gap = 4;
    const menuMaxH = 224; // max-h-56
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < 140 && spaceAbove > spaceBelow;

    const width = Math.max(rect.width, 120);
    const left =
      align === "right"
        ? Math.min(rect.right - width, window.innerWidth - width - 8)
        : Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));

    if (openUp) {
      setMenuStyle({
        position: "fixed",
        left,
        width,
        bottom: window.innerHeight - rect.top + gap,
        top: "auto",
        maxHeight: Math.min(menuMaxH, Math.max(96, spaceAbove)),
      });
    } else {
      setMenuStyle({
        position: "fixed",
        left,
        width,
        top: rect.bottom + gap,
        bottom: "auto",
        maxHeight: Math.min(menuMaxH, Math.max(96, spaceBelow)),
      });
    }
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return undefined;
    }
    updateMenuPosition();
    const onReposition = () => updateMenuPosition();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, align, options.length]);

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

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const pick = (opt) => {
    onChange(opt.value);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`
          w-full inline-flex items-center justify-between gap-2
          border border-hydro-border rounded-xl
          px-3 py-2 text-[0.88rem]
          bg-white/90 text-hydro-ink
          hover:border-hydro-accent hover:bg-hydro-accent-soft/70
          focus:outline-none focus:border-hydro-accent focus:bg-hydro-accent-soft/70
          focus:shadow-[0_0_0_3px_rgba(42,174,160,0.12)]
          transition cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/90
          ${open ? "border-hydro-accent bg-hydro-accent-soft" : ""}
          ${buttonClassName}
        `}
      >
        <span
          className={`min-w-0 flex-1 text-left font-medium ${
            truncate ? "truncate" : "whitespace-nowrap"
          }`}
        >
          {label}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-hydro-primary transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        !disabled &&
        menuStyle &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            style={menuStyle}
            className="
              z-[300] py-1
              bg-white border border-hydro-border rounded-lg
              shadow-[0_8px_24px_rgba(15,107,92,0.16)]
              overflow-y-auto
            "
          >
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <li key={String(opt.value)} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => pick(opt)}
                    className={`
                      w-full text-left px-3 py-1.5 text-[0.88rem]
                      transition cursor-pointer
                      ${
                        isSelected
                          ? "bg-hydro-accent-soft text-hydro-primary font-semibold"
                          : "text-hydro-ink hover:bg-hydro-accent-soft hover:text-hydro-primary"
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </div>
  );
}
