/**
 * ThemeTip.jsx — tooltip bertema SmartHydro dengan posisi pintar.
 *
 * Untuk apa:
 * - Mengganti title/tooltip native browser
 * - Utamakan muncul di bawah; jika ruang bawah sempit, otomatis ke atas
 * - Render via portal (fixed) agar tidak kepotong overflow card
 *
 * Pemakaian:
 *   <ThemeTip tip="Tampilan feed"><button>...</button></ThemeTip>
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TIP_ESTIMATE_H = 34; // tinggi perkiraan tip + panah
const DEFAULT_GAP = 8;

export default function ThemeTip({
  tip,
  children,
  prefer = "bottom", // "bottom" | "top"
  gap = DEFAULT_GAP,
  className = "",
}) {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [place, setPlace] = useState(prefer === "top" ? "top" : "bottom");
  const [coords, setCoords] = useState(null);

  const updatePosition = useCallback(() => {
    const el = wrapRef.current;
    if (!el || !tip) return;

    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;

    // Utamakan bawah; flip ke atas hanya jika bawah sempit DAN atas lebih longgar
    let next = prefer === "top" ? "top" : "bottom";
    if (prefer === "bottom") {
      if (spaceBelow < TIP_ESTIMATE_H && spaceAbove > spaceBelow) {
        next = "top";
      } else {
        next = "bottom";
      }
    } else if (spaceAbove < TIP_ESTIMATE_H && spaceBelow > spaceAbove) {
      next = "bottom";
    }

    setPlace(next);
    setCoords({
      left: rect.left + rect.width / 2,
      top: next === "bottom" ? rect.bottom + gap : rect.top - gap,
    });
  }, [tip, prefer, gap]);

  const show = () => {
    if (!tip) return;
    updatePosition();
    setVisible(true);
  };

  const hide = () => setVisible(false);

  useEffect(() => {
    if (!visible) return undefined;
    const onRepos = () => updatePosition();
    window.addEventListener("resize", onRepos);
    window.addEventListener("scroll", onRepos, true);
    return () => {
      window.removeEventListener("resize", onRepos);
      window.removeEventListener("scroll", onRepos, true);
    };
  }, [visible, updatePosition]);

  if (!tip) return children;

  return (
    <span
      ref={wrapRef}
      className={`inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible &&
        coords &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none fixed z-[400]"
            style={{
              left: coords.left,
              top: coords.top,
              transform:
                place === "bottom"
                  ? "translate(-50%, 0)"
                  : "translate(-50%, -100%)",
            }}
          >
            {/* Panah */}
            <span
              aria-hidden
              className={`
                absolute left-1/2 -translate-x-1/2
                border-[5px] border-transparent
                ${
                  place === "bottom"
                    ? "bottom-full border-b-hydro-primary"
                    : "top-full border-t-hydro-primary"
                }
              `}
            />
            <span
              className="
                block px-2.5 py-1.5 rounded-md
                bg-hydro-primary text-white
                text-[0.78rem] font-medium whitespace-nowrap
                shadow-[0_6px_16px_rgba(15,107,92,0.22)]
              "
            >
              {tip}
            </span>
          </span>,
          document.body
        )}
    </span>
  );
}
