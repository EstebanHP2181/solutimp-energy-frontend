/**
 * Mapea monto mensual de luz (CLP) al `consumption_range` que espera POST /api/v1/energy/simulate.
 * Contrato API sin cambios.
 */
export type SimulateConsumptionRangeCode = 'menos_50k' | '50k_100k' | '100k_200k' | 'mas_200k'

export function monthlyBillAmountToConsumptionRange(clp: number): SimulateConsumptionRangeCode {
  const n = Math.round(Number(clp))
  if (!Number.isFinite(n) || n < 0) return 'menos_50k'
  if (n < 50_000) return 'menos_50k'
  if (n <= 99_999) return '50k_100k'
  if (n <= 199_999) return '100k_200k'
  return 'mas_200k'
}

/** Valor `consumptionRange` del lead alineado al wizard /onboarding (mismo contrato que hoy). */
export function simulateConsumptionRangeToLeadConsumptionRange(
  code: SimulateConsumptionRangeCode
): 'lt50' | '50_100' | '100_200' | 'gt200' {
  const m: Record<SimulateConsumptionRangeCode, 'lt50' | '50_100' | '100_200' | 'gt200'> = {
    menos_50k: 'lt50',
    '50k_100k': '50_100',
    '100k_200k': '100_200',
    mas_200k: 'gt200',
  }
  return m[code]
}
