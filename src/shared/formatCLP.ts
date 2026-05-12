/** Formato peso chileno: $128.000 (punto miles, es-CL) */
export function formatCLP(amount: number): string {
  if (!Number.isFinite(amount)) return '$0'
  const rounded = Math.round(Math.abs(amount))
  return `$${rounded.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`
}
