import type { CalcMainGoal, CalcPropertyType } from '@/composables/useCalculadoraFlow'

export type PrimaryKpiMode = 'savings' | 'continuity' | 'coverage'

export type ReferentialAutonomyBand = {
  hoursMin: number
  hoursMax: number
  scopeLine: string
}

export type EnergyNarrativeInput = {
  propertyType: CalcPropertyType
  mainGoal: CalcMainGoal
  selectedCriticalLoads?: string[]
}

export type EnergyNarrativeContext = {
  segmentKey: string
  resultTitle: string
  resultSubtitle: string
  mainClaim: string
  primaryKpiLabel: string
  primaryKpiMode: PrimaryKpiMode
  backupTitle: string
  backupCopy: string
  backupFootDisclaimer: string
  protectedLoadChips: readonly string[]
  narrativeConsumptionHint: string
  loadingHeadline: string
  loadingSubcopy: string
  loadingMessages: readonly string[]
  whatsappIntentLine: string
  formRevealCtaLabel: string
  whatsappButtonLabel: string
  planDisclaimer: string
  referentialAutonomy: ReferentialAutonomyBand | null
}

/** Texto fijo bajo el rango de autonomía referencial (no horas exactas). */
export const AUTONOMY_RANGE_DISCLAIMER =
  'Rango sujeto a batería, consumo real y configuración final.'

const LOADING_RESIDENTIAL: readonly string[] = [
  'Analizando radiación solar estimada…',
  'Estimando consumo energético del hogar…',
  'Evaluando respaldo para cargas críticas…',
  'Optimizando autonomía híbrida referencial…',
  'Generando diagnóstico energético…',
]

const LOADING_COMMERCIAL: readonly string[] = [
  'Analizando continuidad operacional…',
  'Estimando demanda energética del negocio…',
  'Evaluando respaldo para refrigeración, seguridad y conectividad…',
  'Optimizando escenario híbrido referencial…',
  'Generando diagnóstico energético comercial…',
]

const LOADING_INDUSTRIAL: readonly string[] = [
  'Analizando infraestructura crítica…',
  'Estimando demanda energética operativa…',
  'Evaluando respaldo para accesos, seguridad y cargas esenciales…',
  'Optimizando continuidad referencial…',
  'Generando diagnóstico de infraestructura energética…',
]

const LOADING_AGRI: readonly string[] = [
  'Analizando radiación solar estimada…',
  'Estimando demanda en campo y parcela…',
  'Evaluando respaldo para bombas, accesos y seguridad…',
  'Optimizando autonomía referencial…',
  'Generando diagnóstico energético…',
]

const LOADING_COMMUNITY: readonly string[] = [
  'Analizando radiación solar estimada…',
  'Estimando consumo común del condominio…',
  'Evaluando respaldo para áreas críticas…',
  'Generando preevaluación energética…',
]

const CHIPS_RESIDENTIAL = ['Portón automático', 'CCTV / cámaras', 'Router / WiFi', 'Iluminación crítica'] as const
const CHIPS_COMMERCIAL = ['Refrigeración', 'POS / caja', 'CCTV / cámaras', 'Internet', 'Iluminación esencial'] as const
const CHIPS_INDUSTRIAL = ['Accesos', 'CCTV', 'Iluminación crítica', 'Equipos esenciales', 'Comunicaciones'] as const
const CHIPS_AGRI = ['Bombas', 'Portón', 'Iluminación', 'Internet', 'Seguridad'] as const
const CHIPS_GENERIC = ['Portón automático', 'CCTV / cámaras', 'Router / WiFi', 'Iluminación crítica'] as const

const WA_BTN = 'Contactar por WhatsApp'

const CTA_SAVINGS = 'Quiero revisar mi ahorro con un especialista'

function isBackupGoal(g: CalcMainGoal): boolean {
  return g === 'respaldo' || g === 'equipos_criticos'
}

function isSavingsLeanGoal(g: CalcMainGoal, pt?: CalcPropertyType): boolean {
  if (g === 'ahorro' || g === 'vender_excedente' || g === '') return true
  if (pt === 'empresa' || pt === 'condominio') {
    if (g === 'empresa') return true
  }
  return false
}

function pickChips(
  base: readonly string[],
  selectedCriticalLoads: string[] | undefined
): readonly string[] {
  if (selectedCriticalLoads?.length) return [...selectedCriticalLoads]
  return base
}

const FOOT_REF =
  'La autonomía referencial depende de batería, consumo real y configuración final. Es una preevaluación sujeta a visita técnica.'

export function getEnergyNarrativeContext(input: EnergyNarrativeInput): EnergyNarrativeContext {
  const { propertyType, mainGoal, selectedCriticalLoads } = input
  const pt = propertyType || ''
  const mg = mainGoal || ''

  const residentialDisclaimer =
    'Preevaluación referencial. Un especialista Solutimp puede validar tu techo, consumo real y respaldo ideal.'
  const nonResidentialDisclaimer =
    'Preevaluación referencial. Un especialista Solutimp puede validar tu instalación, consumo real y respaldo ideal.'

  if (pt === 'bodega') {
    return {
      segmentKey: 'industrial_infrastructure',
      resultTitle: 'Diagnóstico de infraestructura energética',
      resultSubtitle: 'Preevaluación Solutimp Energy',
      mainClaim: 'Tu operación crítica sigue funcionando',
      primaryKpiLabel: 'Ahorro mensual referencial',
      primaryKpiMode: 'continuity',
      backupTitle: 'Respaldo para infraestructura crítica',
      backupCopy:
        'Solutimp Energy puede evaluar una solución para mantener activos accesos, seguridad, iluminación y cargas esenciales.',
      backupFootDisclaimer: FOOT_REF,
      protectedLoadChips: pickChips(CHIPS_INDUSTRIAL, selectedCriticalLoads),
      narrativeConsumptionHint: 'Estimamos una demanda operativa acorde a tu tipo de instalación.',
      loadingHeadline: 'Analizando infraestructura crítica',
      loadingSubcopy: 'Estamos preparando una preevaluación para ahorro, respaldo y continuidad operativa.',
      loadingMessages: LOADING_INDUSTRIAL,
      whatsappIntentLine: 'Quiero evaluar respaldo energético para mi operación crítica.',
      formRevealCtaLabel: 'Coordinar diagnóstico de infraestructura',
      whatsappButtonLabel: WA_BTN,
      planDisclaimer: nonResidentialDisclaimer,
      referentialAutonomy: { hoursMin: 6, hoursMax: 12, scopeLine: 'para accesos, seguridad y comunicaciones' },
    }
  }

  if (pt === 'empresa' || pt === 'condominio') {
    if (isBackupGoal(mg)) {
      const isCommunity = pt === 'condominio'
      return {
        segmentKey: isCommunity ? 'community_continuity' : 'commercial_continuity',
        resultTitle: isCommunity
          ? 'Plan de continuidad energética para tu comunidad'
          : 'Plan de continuidad energética para tu operación',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: isCommunity ? 'La comunidad sigue operativa' : 'Tu negocio sigue operando',
        primaryKpiLabel: 'Ahorro mensual referencial',
        primaryKpiMode: 'continuity',
        backupTitle: isCommunity ? 'Continuidad para espacios comunes' : 'Continuidad operacional Solutimp',
        backupCopy: isCommunity
          ? 'Diseñado para apoyar iluminación común, accesos, conectividad y cargas críticas ante interrupciones de suministro.'
          : 'Diseñado para proteger refrigeración, conectividad, seguridad y operación básica ante interrupciones de suministro.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: pickChips(CHIPS_COMMERCIAL, selectedCriticalLoads),
        narrativeConsumptionHint: isCommunity
          ? 'Estimamos un perfil de consumo común acorde a la referencia declarada.'
          : 'Estimamos una curva de demanda acorde a tu operación y referencia declarada.',
        loadingHeadline: isCommunity ? 'La comunidad sigue operativa' : 'Analizando continuidad operacional',
        loadingSubcopy: isCommunity
          ? 'Estamos preparando una preevaluación para ahorro, respaldo y espacios comunes.'
          : 'Estamos preparando una preevaluación para ahorro, respaldo y operación crítica.',
        loadingMessages: isCommunity ? LOADING_COMMUNITY : LOADING_COMMERCIAL,
        whatsappIntentLine: isCommunity
          ? 'Mi prioridad es mantener operativas las áreas comunes ante cortes eléctricos.'
          : 'Mi prioridad es mantener operativo mi negocio ante cortes eléctricos.',
        formRevealCtaLabel: isCommunity
          ? 'Solicitar evaluación de continuidad comunal'
          : 'Solicitar evaluación operacional',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: isCommunity
          ? { hoursMin: 6, hoursMax: 10, scopeLine: 'para accesos, CCTV e iluminación común' }
          : { hoursMin: 4, hoursMax: 8, scopeLine: 'para operación crítica básica' },
      }
    }
    if (pt === 'empresa' && isSavingsLeanGoal(mg, pt)) {
      return {
        segmentKey: 'commercial_savings',
        resultTitle: 'Tu plan de eficiencia energética empresarial',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'Reduce costos de electricidad en tu operación',
        primaryKpiLabel: 'Podrías dejar de pagar aprox.',
        primaryKpiMode: 'savings',
        backupTitle: 'Respaldo inteligente Solutimp',
        backupCopy:
          'Solutimp Energy puede complementar el ahorro con evaluación de cargas críticas ante cortes de suministro.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: pickChips(CHIPS_COMMERCIAL, selectedCriticalLoads),
        narrativeConsumptionHint: 'Estimamos una demanda acorde a tu operación y referencia declarada.',
        loadingHeadline: 'Tu negocio sigue funcionando',
        loadingSubcopy: 'Estamos preparando una preevaluación de ahorro, respaldo y continuidad energética.',
        loadingMessages: LOADING_COMMERCIAL,
        whatsappIntentLine: 'Quiero revisar el ahorro estimado y una propuesta solar.',
        formRevealCtaLabel: CTA_SAVINGS,
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: null,
      }
    }
    if (pt === 'condominio' && isSavingsLeanGoal(mg, pt)) {
      return {
        segmentKey: 'community_savings',
        resultTitle: 'Eficiencia energética para tu comunidad',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'La comunidad puede reducir costos y sumar respaldo referencial',
        primaryKpiLabel: 'Podrías dejar de pagar aprox.',
        primaryKpiMode: 'savings',
        backupTitle: 'Respaldo para áreas comunes',
        backupCopy:
          'Solutimp Energy puede orientar respaldo referencial para espacios comunes y cargas críticas del condominio.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: pickChips(CHIPS_COMMERCIAL, selectedCriticalLoads),
        narrativeConsumptionHint: 'Estimamos un perfil de consumo común acorde a la referencia declarada.',
        loadingHeadline: 'La comunidad sigue operativa',
        loadingSubcopy: 'Estamos preparando una preevaluación de ahorro, respaldo y continuidad energética.',
        loadingMessages: LOADING_COMMUNITY,
        whatsappIntentLine: 'Quiero revisar el ahorro estimado y una propuesta solar.',
        formRevealCtaLabel: CTA_SAVINGS,
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: null,
      }
    }
  }

  if (pt === 'parcela' && isBackupGoal(mg)) {
    return {
      segmentKey: 'agricultural_autonomy',
      resultTitle: 'Plan de autonomía energética',
      resultSubtitle: 'Preevaluación Solutimp Energy',
      mainClaim: 'Tu propiedad gana autonomía energética',
      primaryKpiLabel: 'Ahorro mensual referencial',
      primaryKpiMode: 'coverage',
      backupTitle: 'Respaldo para campo y parcela',
      backupCopy:
        'Solutimp Energy puede evaluar continuidad referencial para bombas, accesos, iluminación y conectividad.',
      backupFootDisclaimer: FOOT_REF,
      protectedLoadChips: pickChips(CHIPS_AGRI, selectedCriticalLoads),
      narrativeConsumptionHint: 'Estimamos un perfil de consumo en parcela/campo acorde a la referencia declarada.',
      loadingHeadline: 'Tu operación en campo sigue funcionando',
      loadingSubcopy: 'Estamos preparando una preevaluación para ahorro, respaldo y autonomía referencial.',
      loadingMessages: LOADING_AGRI,
      whatsappIntentLine: 'Quiero evaluar autonomía energética para mi propiedad.',
      formRevealCtaLabel: 'Evaluar autonomía energética',
      whatsappButtonLabel: WA_BTN,
      planDisclaimer: residentialDisclaimer,
      referentialAutonomy: { hoursMin: 8, hoursMax: 16, scopeLine: 'para cargas esenciales rurales' },
    }
  }

  if (pt === 'casa' && isBackupGoal(mg)) {
    return {
      segmentKey: 'residential_backup',
      resultTitle: 'Tu plan de continuidad y ahorro solar',
      resultSubtitle: 'Preevaluación Solutimp Energy',
      mainClaim: 'Tu hogar sigue funcionando',
      primaryKpiLabel: 'Ahorro mensual referencial',
      primaryKpiMode: 'continuity',
      backupTitle: 'Respaldo inteligente para tu hogar',
      backupCopy:
        'Solutimp Energy puede ayudarte a mantener operativas tus cargas críticas ante cortes de luz.',
      backupFootDisclaimer: FOOT_REF,
      protectedLoadChips: pickChips(CHIPS_RESIDENTIAL, selectedCriticalLoads),
      narrativeConsumptionHint: 'Estimamos un consumo residencial acorde a ese nivel.',
      loadingHeadline: 'Tu hogar sigue funcionando',
      loadingSubcopy: 'Estamos preparando una preevaluación de ahorro, respaldo y continuidad energética.',
      loadingMessages: LOADING_RESIDENTIAL,
      whatsappIntentLine: 'Mi prioridad es mantener funcionando mi hogar ante cortes.',
      formRevealCtaLabel: 'Quiero validar el respaldo de mi hogar',
      whatsappButtonLabel: WA_BTN,
      planDisclaimer: residentialDisclaimer,
      referentialAutonomy: { hoursMin: 8, hoursMax: 14, scopeLine: 'para cargas esenciales del hogar' },
    }
  }

  if ((pt === 'casa' || pt === 'parcela') && isSavingsLeanGoal(mg, pt)) {
    return {
      segmentKey: 'residential_savings',
      resultTitle: 'Tu plan de eficiencia e independencia',
      resultSubtitle: 'Preevaluación residencial',
      mainClaim: 'Reduce tu dependencia de la red eléctrica',
      primaryKpiLabel: 'Podrías dejar de pagar aprox.',
      primaryKpiMode: 'savings',
      backupTitle: 'Respaldo inteligente Solutimp',
      backupCopy:
        'Además del ahorro, Solutimp Energy puede orientarte en respaldo referencial para cargas críticas.',
      backupFootDisclaimer: FOOT_REF,
      protectedLoadChips: pickChips(CHIPS_RESIDENTIAL, selectedCriticalLoads),
      narrativeConsumptionHint: 'Estimamos un consumo residencial acorde a ese nivel.',
      loadingHeadline: 'Tu hogar sigue funcionando',
      loadingSubcopy: 'Estamos preparando una preevaluación de ahorro, respaldo y continuidad energética.',
      loadingMessages: LOADING_RESIDENTIAL,
      whatsappIntentLine: 'Quiero revisar el ahorro estimado y una propuesta solar.',
      formRevealCtaLabel: CTA_SAVINGS,
      whatsappButtonLabel: WA_BTN,
      planDisclaimer: residentialDisclaimer,
      referentialAutonomy: null,
    }
  }

  return {
    segmentKey: 'default',
    resultTitle: 'Tu diagnóstico energético preliminar',
    resultSubtitle: 'Preevaluación Solutimp Energy',
    mainClaim: 'Ahorro, respaldo y continuidad energética',
    primaryKpiLabel: 'Podrías dejar de pagar aprox.',
    primaryKpiMode: 'savings',
    backupTitle: 'Respaldo inteligente Solutimp',
    backupCopy:
      'Solutimp Energy puede ayudarte a combinar ahorro solar con evaluación de cargas críticas ante cortes.',
    backupFootDisclaimer: FOOT_REF,
    protectedLoadChips: pickChips(CHIPS_GENERIC, selectedCriticalLoads),
    narrativeConsumptionHint: 'Estimamos un perfil de consumo acorde a la referencia declarada.',
    loadingHeadline: 'Tu hogar sigue funcionando',
    loadingSubcopy: 'Estamos preparando una preevaluación de ahorro, respaldo y continuidad energética.',
    loadingMessages: LOADING_RESIDENTIAL,
    whatsappIntentLine: 'Quiero revisar el ahorro estimado y una propuesta solar.',
    formRevealCtaLabel: 'Solicitar evaluación técnica',
    whatsappButtonLabel: WA_BTN,
    planDisclaimer: residentialDisclaimer,
    referentialAutonomy: null,
  }
}

/** Mensajes por defecto del overlay (residencial) si no se pasan props. */
export const DEFAULT_LOADING_MESSAGES: readonly string[] = LOADING_RESIDENTIAL
