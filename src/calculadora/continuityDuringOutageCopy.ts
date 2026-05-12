import type { CalcPropertyType } from '@/composables/useCalculadoraFlow'

export type OutageExampleRow = {
  tier: 'ok' | 'partial' | 'caution'
  text: string
}

/** Qué podría seguir operando en cortes (referencial; no garantía de horas). */
export function getContinuityDuringOutageRows(propertyType: CalcPropertyType): OutageExampleRow[] {
  const rural = propertyType === 'parcela'
  const industrial = propertyType === 'bodega' || propertyType === 'empresa'

  const rows: OutageExampleRow[] = [
    { tier: 'ok', text: 'Portón automático y accesos clave' },
    { tier: 'ok', text: 'CCTV y alarmas' },
    { tier: 'ok', text: 'Router / Internet' },
    { tier: 'ok', text: 'Iluminación crítica' },
  ]

  if (rural) {
    rows.splice(1, 0, { tier: 'ok', text: 'Bombas o riego perimetral (según priorización)' })
  }

  if (industrial) {
    rows.push(
      { tier: 'partial', text: 'Refrigeración o cámaras (autonomía parcial según carga)' },
      { tier: 'caution', text: 'Motores grandes o hornos sujetos a potencia y almacenamiento disponible' },
    )
  } else {
    rows.push(
      { tier: 'partial', text: 'Climatización parcial (según capacidad de almacenamiento)' },
      { tier: 'caution', text: 'Hornos eléctricos o cocinas intensivas sujetos a autonomía disponible' },
    )
  }

  if (propertyType === 'condominio') {
    rows.splice(2, 0, { tier: 'ok', text: 'Iluminación de circulación y ascensor (referencial)' })
  }

  return rows
}
