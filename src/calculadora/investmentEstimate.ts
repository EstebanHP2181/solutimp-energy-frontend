/** Inversión referencial (fórmula producto; no sustituye cotización). */
export const COST_BASE_KWP = 1_200_000
export const LABOR_PER_KWP = 200_000
export const MARGIN_FACTOR = 1.3
export const VAT_FACTOR = 1.19

export function estimateTotalInvestmentClp(kwp: number): number {
  if (!Number.isFinite(kwp) || kwp <= 0) return 0
  const base = kwp * COST_BASE_KWP * MARGIN_FACTOR + kwp * LABOR_PER_KWP
  return Math.round(base * VAT_FACTOR)
}

/** Etiqueta en millones CLP, sin decimales falsos (≥10M entero; si no, un decimal). */
export function formatMillionsClpLabel(totalClp: number): string {
  if (!Number.isFinite(totalClp) || totalClp <= 0) return '—'
  const m = totalClp / 1_000_000
  if (m >= 10) return `${Math.round(m)} millones`
  const rounded = Math.round(m * 10) / 10
  return `${rounded.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} millones`
}

export function preliminaryInvestmentDisplayLine(kwp: number): string | null {
  if (!Number.isFinite(kwp) || kwp <= 0) return null
  const total = estimateTotalInvestmentClp(kwp)
  const label = formatMillionsClpLabel(total)
  return `Inversión preliminar desde $${label} CLP, IVA incluido`
}
