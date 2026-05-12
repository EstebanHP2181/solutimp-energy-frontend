/**
 * Semantic Product Architecture — gobernanza narrativa
 *
 * PRECEDENCIA OFICIAL (de mayor a menor peso decisorio):
 *   1. mainGoal        → intención emocional y narrativa dominante
 *   2. propertyType    → matiz léxico, ejemplos, riesgos, superficie, cargas
 *   3. financialProfile → (reservado v1) credibilidad / banda de boleta; no altera la intención
 *
 * propertyType NO redefine el objetivo principal: solo matiza el lenguaje.
 */

import type { CalcMainGoal, CalcPropertyType } from '@/composables/useCalculadoraFlow'

export type FinancialProfile = 'unknown' | 'low' | 'mid' | 'high'

export type SemanticInput = {
  propertyType: CalcPropertyType
  mainGoal: CalcMainGoal
  /** Reservado para fases posteriores; v1 = unknown no cambia segmento */
  financialProfile?: FinancialProfile
}

/** Segmentos oficiales v1 (producto). */
export type NarrativeSegmentKey =
  | 'savings_residential'
  | 'savings_rural'
  | 'savings_business'
  | 'condominium_efficiency'
  | 'backup_residential'
  | 'backup_rural'
  | 'operational_business'
  | 'protection_business'
  | 'industrial_continuity'
  | 'industrial_savings'
  | 'condominium_backup'
  | 'export_residential'
  | 'export_rural'
  | 'export_business'
  | 'default'

export type DominantNarrative =
  | 'eficiencia'
  | 'continuidad'
  | 'resiliencia_operacional'
  | 'generacion_prosumer'
  | 'operacion'

export type HeroKpiSemantic = 'ahorro' | 'autonomia_continuidad' | 'continuidad_critica' | 'potencial_generacion'

export type NarrativePriority = readonly ['mainGoal', 'propertyType', 'financialProfile']

const PRIORITY: NarrativePriority = ['mainGoal', 'propertyType', 'financialProfile']

export type NarrativeTonePack = {
  loadingTone: string
  resultTone: string
  ctaTone: string
}

export type SegmentMatrixRow = {
  dominantNarrative: DominantNarrative
  heroKpi: HeroKpiSemantic
  emotionalClaim: string
  forbiddenTerms: readonly string[]
  ctaTone: string
  loadingTone: string
  resultTone: string
}

export const SEGMENT_MATRIX: Record<NarrativeSegmentKey, SegmentMatrixRow> = {
  savings_residential: {
    dominantNarrative: 'eficiencia',
    heroKpi: 'ahorro',
    emotionalClaim: 'Control de gasto y menor dependencia de la red.',
    forbiddenTerms: ['tu negocio sigue', 'operación crítica', 'cubierta común'],
    ctaTone: 'ahorro y revisión con especialista',
    loadingTone: 'hogar / techumbre / consumo',
    resultTone: 'residencial claro, KPI ahorro dominante',
  },
  savings_rural: {
    dominantNarrative: 'eficiencia',
    heroKpi: 'ahorro',
    emotionalClaim: 'Eficiencia en parcela o campo con referencia declarada.',
    forbiddenTerms: ['preevaluación residencial', 'tu hogar sigue', 'hogar sigue'],
    ctaTone: 'ahorro en propiedad rural',
    loadingTone: 'parcela / superficie / demanda en campo',
    resultTone: 'sin etiqueta residencial; foco ahorro',
  },
  savings_business: {
    dominantNarrative: 'eficiencia',
    heroKpi: 'ahorro',
    emotionalClaim: 'Reducción de costo energético en la operación.',
    forbiddenTerms: ['hogar', 'familia', 'tu casa', 'residencial'],
    ctaTone: 'eficiencia empresarial',
    loadingTone: 'negocio / cubierta útil / demanda',
    resultTone: 'operación, sin lenguaje doméstico',
  },
  condominium_efficiency: {
    dominantNarrative: 'eficiencia',
    heroKpi: 'ahorro',
    emotionalClaim: 'Ahorro y referencia en espacios comunes.',
    forbiddenTerms: ['hogar', 'tu casa'],
    ctaTone: 'comunidad y espacios comunes',
    loadingTone: 'consumo común / cubierta',
    resultTone: 'comunidad, sin hogar doméstico',
  },
  backup_residential: {
    dominantNarrative: 'continuidad',
    heroKpi: 'autonomia_continuidad',
    emotionalClaim: 'Seguridad energética en el hogar ante cortes.',
    forbiddenTerms: ['roi agresivo'],
    ctaTone: 'validación de respaldo hogar',
    loadingTone: 'continuidad residencial',
    resultTone: 'autonomía y continuidad antes que ahorro titular',
  },
  backup_rural: {
    dominantNarrative: 'continuidad',
    heroKpi: 'autonomia_continuidad',
    emotionalClaim: 'Continuidad referencial en parcela o campo.',
    forbiddenTerms: ['preevaluación residencial', 'tu hogar sigue funcionando'],
    ctaTone: 'autonomía en propiedad',
    loadingTone: 'campo / parcela / cargas esenciales',
    resultTone: 'cobertura o continuidad rural sin hogar',
  },
  operational_business: {
    dominantNarrative: 'continuidad',
    heroKpi: 'autonomia_continuidad',
    emotionalClaim: 'Continuidad operacional ante cortes.',
    forbiddenTerms: ['hogar', 'familia', 'tu casa'],
    ctaTone: 'evaluación operacional',
    loadingTone: 'continuidad de negocio',
    resultTone: 'operación, refrigeración, conectividad',
  },
  protection_business: {
    dominantNarrative: 'resiliencia_operacional',
    heroKpi: 'continuidad_critica',
    emotionalClaim: 'Protección de activos y cargas sensibles.',
    forbiddenTerms: ['hogar', 'familia'],
    ctaTone: 'protección de equipos y operación',
    loadingTone: 'resiliencia comercial',
    resultTone: 'CTA operacional, no ahorro genérico',
  },
  industrial_continuity: {
    dominantNarrative: 'continuidad',
    heroKpi: 'autonomia_continuidad',
    emotionalClaim: 'Infraestructura crítica y continuidad referencial.',
    forbiddenTerms: ['hogar', 'techo despejado', 'tu casa', 'familia'],
    ctaTone: 'diagnóstico de infraestructura',
    loadingTone: 'industrial / cubierta o estructura',
    resultTone: 'operación crítica',
  },
  industrial_savings: {
    dominantNarrative: 'eficiencia',
    heroKpi: 'ahorro',
    emotionalClaim: 'Eficiencia energética en instalación industrial.',
    forbiddenTerms: ['hogar', 'familia', 'tu casa'],
    ctaTone: 'ahorro operativo industrial',
    loadingTone: 'demanda operativa / cubierta',
    resultTone: 'KPI ahorro dominante',
  },
  condominium_backup: {
    dominantNarrative: 'continuidad',
    heroKpi: 'autonomia_continuidad',
    emotionalClaim: 'Áreas comunes y espacios críticos ante cortes.',
    forbiddenTerms: ['hogar', 'tu casa'],
    ctaTone: 'continuidad comunal',
    loadingTone: 'comunidad / espacios comunes',
    resultTone: 'comunidad operativa',
  },
  export_residential: {
    dominantNarrative: 'generacion_prosumer',
    heroKpi: 'potencial_generacion',
    emotionalClaim: 'Autoconsumo, excedentes y referencia tipo net billing.',
    forbiddenTerms: [
      'tu hogar sigue funcionando',
      'continuidad energética',
      'respaldo como titular',
      'cargas críticas como claim principal',
    ],
    ctaTone: 'potencial solar y excedentes',
    loadingTone: 'generación / excedentes / radiación',
    resultTone: 'prosumidor, sin survivalismo',
  },
  export_rural: {
    dominantNarrative: 'generacion_prosumer',
    heroKpi: 'potencial_generacion',
    emotionalClaim: 'Potencial de generación y excedentes en parcela o campo.',
    forbiddenTerms: ['tu hogar sigue funcionando', 'continuidad como titular', 'respaldo como titular'],
    ctaTone: 'evaluación de potencial solar rural',
    loadingTone: 'generación en parcela',
    resultTone: 'producción y excedentes, no backup dominante',
  },
  export_business: {
    dominantNarrative: 'generacion_prosumer',
    heroKpi: 'potencial_generacion',
    emotionalClaim: 'Generación distribuida y valorización de excedentes.',
    forbiddenTerms: ['hogar', 'familia', 'tu casa', 'tu hogar sigue funcionando'],
    ctaTone: 'evaluación comercial de generación',
    loadingTone: 'cubierta útil / generación',
    resultTone: 'prosumidor empresarial',
  },
  default: {
    dominantNarrative: 'eficiencia',
    heroKpi: 'ahorro',
    emotionalClaim: 'Ahorro, respaldo y continuidad como preevaluación general.',
    forbiddenTerms: [],
    ctaTone: 'evaluación técnica genérica',
    loadingTone: 'mixto',
    resultTone: 'neutral',
  },
}

function isBackupGoal(g: CalcMainGoal): boolean {
  return g === 'respaldo' || g === 'equipos_criticos'
}

/** Objetivos de eficiencia/ahorro (excluye vender_excedente: va siempre al track export). */
function isSavingsLeanGoal(g: CalcMainGoal, pt?: CalcPropertyType): boolean {
  if (g === 'vender_excedente') return false
  if (g === 'ahorro' || g === '') return true
  if (pt === 'empresa' || pt === 'condominio') {
    if (g === 'empresa') return true
  }
  return false
}

export function resolveNarrativeSegment(input: SemanticInput): NarrativeSegmentKey {
  const pt = input.propertyType || ''
  const mgRaw = String(input.mainGoal ?? '')
  /** Alias defensivo (p.ej. datos legacy); el tipo oficial sigue siendo `vender_excedente`. */
  const mg: CalcMainGoal = (mgRaw === 'vender_excedentes' ? 'vender_excedente' : mgRaw) as CalcMainGoal

  if (mg === 'vender_excedente') {
    if (pt === 'casa') return 'export_residential'
    if (pt === 'parcela') return 'export_rural'
    if (pt === 'empresa' || pt === 'condominio' || pt === 'bodega') return 'export_business'
    return 'export_residential'
  }

  if (isBackupGoal(mg)) {
    if (pt === 'casa') return 'backup_residential'
    if (pt === 'parcela') return 'backup_rural'
    if (pt === 'empresa') return mg === 'equipos_criticos' ? 'protection_business' : 'operational_business'
    if (pt === 'condominio') return 'condominium_backup'
    if (pt === 'bodega') return 'industrial_continuity'
  }

  if (isSavingsLeanGoal(mg, pt)) {
    if (pt === 'casa') return 'savings_residential'
    if (pt === 'parcela') return 'savings_rural'
    if (pt === 'empresa') return 'savings_business'
    if (pt === 'condominio') return 'condominium_efficiency'
    if (pt === 'bodega') return 'industrial_savings'
  }

  return 'default'
}

export function resolveNarrativePriority(): NarrativePriority {
  return PRIORITY
}

export function resolveHeroKpi(input: SemanticInput): HeroKpiSemantic {
  return SEGMENT_MATRIX[resolveNarrativeSegment(input)].heroKpi
}

export function resolveNarrativeTone(input: SemanticInput): NarrativeTonePack {
  const row = SEGMENT_MATRIX[resolveNarrativeSegment(input)]
  return {
    loadingTone: row.loadingTone,
    resultTone: row.resultTone,
    ctaTone: row.ctaTone,
  }
}

export function getSegmentMatrixRow(seg: NarrativeSegmentKey): SegmentMatrixRow {
  return SEGMENT_MATRIX[seg] ?? SEGMENT_MATRIX.default
}

/** Devuelve el primer forbidden term encontrado en `text`, o null. */
export function narrativeContainsForbidden(text: string, seg: NarrativeSegmentKey): string | null {
  const lower = text.toLowerCase()
  for (const term of SEGMENT_MATRIX[seg].forbiddenTerms) {
    if (term && lower.includes(term.toLowerCase())) return term
  }
  return null
}
