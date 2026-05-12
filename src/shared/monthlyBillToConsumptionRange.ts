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

/**
 * Rango enviado a `POST /energy/simulate`: un escalón más conservador en la banda media
 * para perfiles de ahorro/eficiencia (evita dimensionamientos agresivos tipo 8 kWp híbrido
 * cuando la boleta cae en 100k–200k sin prioridad de continuidad avanzada).
 * El lead y CRM siguen usando `monthlyBillAmountToConsumptionRange` sin cambios.
 */
export function consumptionRangeForPrudentSimulate(
  clp: number,
  mainGoal: string
): SimulateConsumptionRangeCode {
  const base = monthlyBillAmountToConsumptionRange(clp)
  const continuityHeavy = mainGoal === 'respaldo' || mainGoal === 'equipos_criticos'
  if (continuityHeavy) return base
  const prudent = mainGoal === 'ahorro' || mainGoal === '' || mainGoal === 'empresa'
  if (prudent && base === '100k_200k') return '50k_100k'
  return base
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
