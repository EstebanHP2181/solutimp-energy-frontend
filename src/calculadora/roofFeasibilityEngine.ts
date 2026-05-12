import type { CalcPropertyType } from '@/composables/useCalculadoraFlow'

export const PANEL_REFERENCE_AREA_M2 = 2.8
export const INSTALLATION_CLEARANCE_FACTOR = 1.2
export const PARKING_SPACE_M2 = 17

export type RoofFeasibilityInput = {
  panelCount: number | null | undefined
  propertyType: CalcPropertyType
}

const ADVANCED_SURFACE_WARNING =
  'Este proyecto requiere validación técnica avanzada de superficie, orientación y sombras.'

const ORIENTATION_COPY = 'Idealmente norte, nororiente o norponiente.'

const DISCLAIMER_COPY =
  'La factibilidad final depende de sombras, orientación, inclinación, materialidad y visita técnica.'

const TITLE_COPY = 'Factibilidad técnica de superficie'

function surfaceContextPhrase(propertyType: CalcPropertyType): string {
  switch (propertyType) {
    case 'casa':
      return 'techo despejado'
    case 'parcela':
      return 'cubierta, techo o estructura disponible'
    case 'empresa':
      return 'cubierta útil disponible'
    case 'bodega':
      return 'cubierta útil o estructura disponible'
    case 'condominio':
      return 'cubierta común disponible'
    default:
      return 'cubierta o superficie disponible'
  }
}

/** Superficie referencial requerida (m²), o null si no hay paneles válidos. */
export function estimateRequiredSurface(input: RoofFeasibilityInput): number | null {
  const raw = input.panelCount
  if (raw == null || !Number.isFinite(raw)) return null
  const count = Math.round(raw)
  if (count <= 0) return null
  return Math.ceil(count * PANEL_REFERENCE_AREA_M2 * INSTALLATION_CLEARANCE_FACTOR)
}

/**
 * Equivalencia en estacionamientos (solo referencia visual).
 * Solo aplica para casa o parcela.
 */
export function getSurfaceEquivalence(input: RoofFeasibilityInput): string | null {
  const pt = input.propertyType
  if (pt !== 'casa' && pt !== 'parcela') return null
  const m2 = estimateRequiredSurface(input)
  if (m2 == null) return null
  const eq = m2 / PARKING_SPACE_M2
  if (!Number.isFinite(eq) || eq <= 0) return null

  const roundedTenth = Math.round(eq * 10) / 10
  const useInteger = Math.abs(roundedTenth - Math.round(roundedTenth)) < 0.001
  const numLabel = useInteger
    ? String(Math.round(roundedTenth))
    : roundedTenth.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  const n = useInteger ? Math.round(roundedTenth) : roundedTenth
  const plural = n > 1 || !useInteger
  return `aprox. ${numLabel} estacionamiento${plural ? 'es' : ''}`
}

export type RoofFeasibilityCopy = {
  title: string
  headline: string
  contextLine: string
  orientation: string
  disclaimer: string
  advancedWarning: string | null
  parkingEquivalence: string | null
}

/** Copy listo para UI; null si no hay estimación de paneles. */
export function getRoofFeasibilityCopy(input: RoofFeasibilityInput): RoofFeasibilityCopy | null {
  const m2 = estimateRequiredSurface(input)
  if (m2 == null) return null

  const phrase = surfaceContextPhrase(input.propertyType)
  return {
    title: TITLE_COPY,
    headline: `Este sistema requiere aprox. ${m2} m² de superficie despejada.`,
    contextLine: `Como referencia de emplazamiento, piensa en ${phrase}.`,
    orientation: ORIENTATION_COPY,
    disclaimer: DISCLAIMER_COPY,
    advancedWarning: m2 >= 80 ? ADVANCED_SURFACE_WARNING : null,
    parkingEquivalence: getSurfaceEquivalence(input),
  }
}
