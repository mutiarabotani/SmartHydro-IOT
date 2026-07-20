/**
 * validation.js — filter input form Setting per tipe data.
 *
 * Untuk apa:
 * - Integer: hanya digit (huruf, titik, simbol tidak masuk)
 * - Float: hanya digit + satu titik desimal
 * - String: potong panjang maksimal
 *
 * Dipakai di onChange agar karakter tidak valid tidak pernah muncul di field.
 */

/** Hanya bilangan bulat (0–9). Huruf, titik, simbol dibuang. */
export function sanitizeInteger(value) {
  return String(value ?? "").replace(/\D/g, "");
}

/**
 * Angka desimal: digit + paling banyak satu titik.
 * Huruf dan simbol lain dibuang.
 */
export function sanitizeFloat(value) {
  const raw = String(value ?? "").replace(/[^\d.]/g, "");
  const dot = raw.indexOf(".");
  if (dot === -1) return raw;
  return raw.slice(0, dot + 1) + raw.slice(dot + 1).replace(/\./g, "");
}

/** Teks bebas dengan batas panjang. */
export function sanitizeString(value, max = 256) {
  return String(value ?? "").slice(0, max);
}
