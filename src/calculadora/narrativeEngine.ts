import type { CalcMainGoal, CalcPropertyType } from '@/composables/useCalculadoraFlow'
import { resolveNarrativeSegment, type NarrativeSegmentKey } from '@/calculadora/semanticDecisionEngine'

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
  'Estimando superficie disponible en techumbre…',
  'Estimando consumo energético del hogar…',
  'Evaluando respaldo para cargas críticas…',
  'Optimizando autonomía híbrida referencial…',
  'Generando diagnóstico energético…',
]

const LOADING_COMMERCIAL: readonly string[] = [
  'Analizando continuidad operacional…',
  'Evaluando cubierta útil para instalación solar…',
  'Estimando demanda energética del negocio…',
  'Evaluando respaldo para refrigeración, seguridad y conectividad…',
  'Optimizando escenario híbrido referencial…',
  'Generando diagnóstico energético comercial…',
]

const LOADING_INDUSTRIAL: readonly string[] = [
  'Analizando infraestructura crítica…',
  'Evaluando cubierta útil para instalación solar…',
  'Estimando demanda energética operativa…',
  'Evaluando respaldo para accesos, seguridad y cargas esenciales…',
  'Optimizando continuidad referencial…',
  'Generando diagnóstico de infraestructura energética…',
]

const LOADING_AGRI: readonly string[] = [
  'Analizando radiación solar estimada…',
  'Evaluando superficie útil para módulos fotovoltaicos…',
  'Estimando demanda en campo y parcela…',
  'Evaluando respaldo para bombas, accesos y seguridad…',
  'Optimizando autonomía referencial…',
  'Generando diagnóstico energético…',
]

const LOADING_COMMUNITY: readonly string[] = [
  'Analizando radiación solar estimada…',
  'Evaluando cubierta útil para instalación solar…',
  'Estimando consumo común del condominio…',
  'Evaluando respaldo para áreas críticas…',
  'Generando preevaluación energética…',
]

const LOADING_EXPORT_RESIDENTIAL: readonly string[] = [
  'Analizando potencial de generación solar estimada…',
  'Evaluando capacidad de autoconsumo y excedentes…',
  'Estimando superficie disponible en techumbre…',
  'Estimando generación solar referencial…',
  'Generando preevaluación energética…',
]

const LOADING_EXPORT_RURAL: readonly string[] = [
  'Analizando potencial de generación en parcela…',
  'Evaluando superficie disponible para paneles…',
  'Estimando generación solar referencial…',
  'Evaluando autoconsumo y excedentes referenciales…',
  'Generando preevaluación energética…',
]

const LOADING_EXPORT_BUSINESS: readonly string[] = [
  'Evaluando cubierta útil para instalación solar…',
  'Analizando potencial de generación distribuida…',
  'Estimando generación y excedentes referenciales…',
  'Evaluando opciones de autoconsumo comercial…',
  'Generando preevaluación energética…',
]

const LOADING_SAVINGS_RURAL: readonly string[] = [
  'Analizando radiación solar estimada…',
  'Evaluando superficie disponible para paneles…',
  'Estimando demanda en campo y parcela…',
  'Optimizando escenario solar referencial…',
  'Generando preevaluación energética…',
]

const CHIPS_EXPORT = ['Autoconsumo referencial', 'Excedentes y medición', 'Superficie para módulos fotovoltaicos', 'Visita técnica'] as const

const CHIPS_RESIDENTIAL = ['Portón automático', 'CCTV / cámaras', 'Router / WiFi', 'Iluminación crítica'] as const
const CHIPS_COMMERCIAL = ['Refrigeración', 'POS / caja', 'CCTV / cámaras', 'Internet', 'Iluminación esencial'] as const
const CHIPS_INDUSTRIAL = ['Accesos', 'CCTV', 'Iluminación crítica', 'Equipos esenciales', 'Comunicaciones'] as const
const CHIPS_AGRI = ['Bombas', 'Portón', 'Iluminación', 'Internet', 'Seguridad'] as const
const CHIPS_GENERIC = ['Portón automático', 'CCTV / cámaras', 'Router / WiFi', 'Iluminación crítica'] as const

const WA_BTN = 'Hablar con un especialista energético'

const CTA_SAVINGS = 'Validar factibilidad técnica con un especialista'

function pickChips(
  base: readonly string[],
  selectedCriticalLoads: string[] | undefined
): readonly string[] {
  if (selectedCriticalLoads?.length) return [...selectedCriticalLoads]
  return base
}

function chipsForSegment(seg: NarrativeSegmentKey, selectedCriticalLoads: string[] | undefined): readonly string[] {
  switch (seg) {
    case 'export_residential':
    case 'export_rural':
    case 'export_business':
      return pickChips(CHIPS_EXPORT, selectedCriticalLoads)
    case 'savings_residential':
    case 'backup_residential':
      return pickChips(CHIPS_RESIDENTIAL, selectedCriticalLoads)
    case 'savings_rural':
    case 'backup_rural':
      return pickChips(CHIPS_AGRI, selectedCriticalLoads)
    case 'savings_business':
    case 'operational_business':
    case 'protection_business':
    case 'condominium_efficiency':
    case 'condominium_backup':
      return pickChips(CHIPS_COMMERCIAL, selectedCriticalLoads)
    case 'industrial_continuity':
    case 'industrial_savings':
      return pickChips(CHIPS_INDUSTRIAL, selectedCriticalLoads)
    default:
      return pickChips(CHIPS_GENERIC, selectedCriticalLoads)
  }
}

const FOOT_REF =
  'La autonomía referencial depende de batería, consumo real y configuración final. Es una preevaluación sujeta a visita técnica.'

export function getEnergyNarrativeContext(input: EnergyNarrativeInput): EnergyNarrativeContext {
  const { propertyType, mainGoal, selectedCriticalLoads } = input
  const chips = chipsForSegment(resolveNarrativeSegment(input), selectedCriticalLoads)

  const residentialDisclaimer =
    'Preevaluación referencial. Un especialista Solutimp puede validar tu techo, consumo real y respaldo ideal.'
  const nonResidentialDisclaimer =
    'Preevaluación referencial. Un especialista Solutimp puede validar tu instalación, consumo real y respaldo ideal.'
  const ruralParcelDisclaimer =
    'Preevaluación referencial. Un especialista Solutimp puede validar tu cubierta o estructura, consumo real y escenario solar.'

  const seg = resolveNarrativeSegment({ propertyType, mainGoal })

  switch (seg) {
    case 'export_residential':
      return {
        segmentKey: seg,
        resultTitle: 'Tu plan de generación e independencia energética',
        resultSubtitle: 'Preevaluación · autoconsumo y excedentes',
        mainClaim: 'Tu hogar podría generar más energía de la que consume en ciertos periodos.',
        primaryKpiLabel: 'Potencial de generación referencial',
        primaryKpiMode: 'savings',
        backupTitle: 'Autoconsumo y excedentes referenciales',
        backupCopy:
          'Solutimp Energy puede orientarte en autoconsumo, medición y esquema de excedentes según normativa aplicable (preevaluación).',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos un perfil de consumo residencial acorde a la referencia declarada.',
        loadingHeadline: 'Evaluando potencial de generación solar',
        loadingSubcopy:
          'Estamos preparando una preevaluación de autoconsumo, excedentes y net billing referencial.',
        loadingMessages: LOADING_EXPORT_RESIDENTIAL,
        whatsappIntentLine: 'Quiero evaluar mi potencial de generación y excedentes solares.',
        formRevealCtaLabel: 'Evaluar mi infraestructura energética y excedentes',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: residentialDisclaimer,
        referentialAutonomy: null,
      }

    case 'export_rural':
      return {
        segmentKey: seg,
        resultTitle: 'Plan de generación y excedentes en tu propiedad',
        resultSubtitle: 'Preevaluación en parcela o campo',
        mainClaim: 'Tu propiedad podría generar más energía de la que consume en ciertos periodos.',
        primaryKpiLabel: 'Potencial de generación referencial',
        primaryKpiMode: 'savings',
        backupTitle: 'Producción y excedentes en campo',
        backupCopy:
          'Solutimp Energy puede orientarte en generación distribuida, medición y valorización referencial de excedentes.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos un perfil de consumo en parcela/campo acorde a la referencia declarada.',
        loadingHeadline: 'Evaluando potencial de generación en parcela',
        loadingSubcopy: 'Estamos preparando una preevaluación de autoconsumo, excedentes y generación referencial.',
        loadingMessages: LOADING_EXPORT_RURAL,
        whatsappIntentLine: 'Quiero evaluar autonomía y excedentes solares en mi parcela o campo.',
        formRevealCtaLabel: 'Evaluar autonomía y factibilidad en mi propiedad',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: ruralParcelDisclaimer,
        referentialAutonomy: null,
      }

    case 'export_business':
      return {
        segmentKey: seg,
        resultTitle: 'Plan de generación y excedentes para tu operación',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'Tu operación puede valorizar la generación distribuida y excedentes referenciales.',
        primaryKpiLabel: 'Potencial de generación referencial',
        primaryKpiMode: 'savings',
        backupTitle: 'Generación y autoconsumo comercial',
        backupCopy:
          'Solutimp Energy puede orientarte en cubierta útil, autoconsumo y esquema de excedentes según perfil operativo (preevaluación).',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos una curva de demanda acorde a tu operación y referencia declarada.',
        loadingHeadline: 'Evaluando potencial de generación comercial',
        loadingSubcopy: 'Estamos preparando una preevaluación de generación, excedentes y autoconsumo referencial.',
        loadingMessages: LOADING_EXPORT_BUSINESS,
        whatsappIntentLine: 'Quiero evaluar generación y excedentes solares para mi operación.',
        formRevealCtaLabel: 'Evaluar generación y excedentes con un especialista',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: null,
      }

    case 'savings_residential':
      return {
        segmentKey: seg,
        resultTitle: 'Tu plan de eficiencia e independencia',
        resultSubtitle: 'Preevaluación residencial',
        mainClaim: 'Reduce tu dependencia de la red eléctrica',
        primaryKpiLabel: 'Podrías dejar de pagar aprox.',
        primaryKpiMode: 'savings',
        backupTitle: 'Respaldo inteligente Solutimp',
        backupCopy:
          'Además del ahorro, Solutimp Energy puede orientarte en respaldo referencial para cargas críticas.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
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

    case 'savings_rural':
      return {
        segmentKey: seg,
        resultTitle: 'Tu plan de eficiencia en parcela o campo',
        resultSubtitle: 'Preevaluación en parcela o campo',
        mainClaim: 'Reduce tu dependencia de la red con un perfil solar acorde a tu propiedad.',
        primaryKpiLabel: 'Podrías dejar de pagar aprox.',
        primaryKpiMode: 'savings',
        backupTitle: 'Respaldo referencial en propiedad',
        backupCopy:
          'Solutimp Energy puede combinar ahorro solar con evaluación de respaldo referencial para cargas clave en campo.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos un perfil de consumo en parcela/campo acorde a la referencia declarada.',
        loadingHeadline: 'Evaluando potencial solar en parcela',
        loadingSubcopy: 'Estamos preparando una preevaluación de ahorro y generación referencial.',
        loadingMessages: LOADING_SAVINGS_RURAL,
        whatsappIntentLine: 'Quiero revisar el ahorro estimado y una propuesta solar para mi parcela.',
        formRevealCtaLabel: CTA_SAVINGS,
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: ruralParcelDisclaimer,
        referentialAutonomy: null,
      }

    case 'savings_business':
      return {
        segmentKey: seg,
        resultTitle: 'Tu plan de eficiencia energética empresarial',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'Reduce costos de electricidad en tu operación',
        primaryKpiLabel: 'Podrías dejar de pagar aprox.',
        primaryKpiMode: 'savings',
        backupTitle: 'Respaldo inteligente Solutimp',
        backupCopy:
          'Solutimp Energy puede complementar el ahorro con evaluación de cargas críticas ante cortes de suministro.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
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

    case 'condominium_efficiency':
      return {
        segmentKey: seg,
        resultTitle: 'Eficiencia energética para tu comunidad',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'La comunidad puede reducir costos y sumar respaldo referencial',
        primaryKpiLabel: 'Podrías dejar de pagar aprox.',
        primaryKpiMode: 'savings',
        backupTitle: 'Respaldo para áreas comunes',
        backupCopy:
          'Solutimp Energy puede orientar respaldo referencial para espacios comunes y cargas críticas del condominio.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
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

    case 'backup_residential':
      return {
        segmentKey: seg,
        resultTitle: 'Tu plan de continuidad y ahorro solar',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'Tu hogar sigue funcionando',
        primaryKpiLabel: 'Ahorro mensual referencial',
        primaryKpiMode: 'continuity',
        backupTitle: 'Respaldo inteligente para tu hogar',
        backupCopy:
          'Solutimp Energy puede ayudarte a mantener operativas tus cargas críticas ante cortes de luz.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos un consumo residencial acorde a ese nivel.',
        loadingHeadline: 'Tu hogar sigue funcionando',
        loadingSubcopy: 'Estamos preparando una preevaluación de ahorro, respaldo y continuidad energética.',
        loadingMessages: LOADING_RESIDENTIAL,
        whatsappIntentLine: 'Mi prioridad es mantener funcionando mi hogar ante cortes.',
        formRevealCtaLabel: 'Revisar autonomía energética de mi hogar',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: residentialDisclaimer,
        referentialAutonomy: { hoursMin: 8, hoursMax: 14, scopeLine: 'para cargas esenciales del hogar' },
      }

    case 'backup_rural':
      return {
        segmentKey: seg,
        resultTitle: 'Plan de autonomía energética',
        resultSubtitle: 'Preevaluación en parcela o campo',
        mainClaim: 'Tu propiedad gana autonomía energética',
        primaryKpiLabel: 'Ahorro mensual referencial',
        primaryKpiMode: 'coverage',
        backupTitle: 'Respaldo para campo y parcela',
        backupCopy:
          'Solutimp Energy puede evaluar continuidad referencial para bombas, accesos, iluminación y conectividad.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos un perfil de consumo en parcela/campo acorde a la referencia declarada.',
        loadingHeadline: 'Tu operación en campo sigue funcionando',
        loadingSubcopy: 'Estamos preparando una preevaluación para ahorro, respaldo y autonomía referencial.',
        loadingMessages: LOADING_AGRI,
        whatsappIntentLine: 'Quiero evaluar autonomía energética para mi propiedad.',
        formRevealCtaLabel: 'Revisar autonomía de mi propiedad con un especialista',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: ruralParcelDisclaimer,
        referentialAutonomy: { hoursMin: 8, hoursMax: 16, scopeLine: 'para cargas esenciales rurales' },
      }

    case 'operational_business':
      return {
        segmentKey: seg,
        resultTitle: 'Plan de continuidad energética para tu operación',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'Tu negocio sigue operando',
        primaryKpiLabel: 'Ahorro mensual referencial',
        primaryKpiMode: 'continuity',
        backupTitle: 'Continuidad operacional Solutimp',
        backupCopy:
          'Diseñado para proteger refrigeración, conectividad, seguridad y operación básica ante interrupciones de suministro.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos una curva de demanda acorde a tu operación y referencia declarada.',
        loadingHeadline: 'Analizando continuidad operacional',
        loadingSubcopy: 'Estamos preparando una preevaluación para ahorro, respaldo y operación crítica.',
        loadingMessages: LOADING_COMMERCIAL,
        whatsappIntentLine: 'Mi prioridad es mantener operativo mi negocio ante cortes eléctricos.',
        formRevealCtaLabel: 'Validar continuidad operacional con un especialista',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: { hoursMin: 4, hoursMax: 8, scopeLine: 'para operación crítica básica' },
      }

    case 'protection_business':
      return {
        segmentKey: seg,
        resultTitle: 'Plan de continuidad energética para tu operación',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'Tu negocio sigue operando',
        primaryKpiLabel: 'Ahorro mensual referencial',
        primaryKpiMode: 'continuity',
        backupTitle: 'Resiliencia para equipos y operación',
        backupCopy:
          'Solutimp Energy puede evaluar continuidad referencial orientada a equipos sensibles y cargas críticas del negocio.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos una curva de demanda acorde a tu operación y referencia declarada.',
        loadingHeadline: 'Analizando continuidad operacional',
        loadingSubcopy: 'Estamos preparando una preevaluación para protección de equipos y operación crítica.',
        loadingMessages: LOADING_COMMERCIAL,
        whatsappIntentLine: 'Mi prioridad es proteger equipos críticos de mi operación ante cortes.',
        formRevealCtaLabel: 'Validar protección de equipos con un especialista',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: { hoursMin: 4, hoursMax: 8, scopeLine: 'para operación crítica básica' },
      }

    case 'condominium_backup':
      return {
        segmentKey: seg,
        resultTitle: 'Plan de continuidad energética para tu comunidad',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'La comunidad sigue operativa',
        primaryKpiLabel: 'Ahorro mensual referencial',
        primaryKpiMode: 'continuity',
        backupTitle: 'Continuidad para espacios comunes',
        backupCopy:
          'Diseñado para apoyar iluminación común, accesos, conectividad y cargas críticas ante interrupciones de suministro.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos un perfil de consumo común acorde a la referencia declarada.',
        loadingHeadline: 'La comunidad sigue operativa',
        loadingSubcopy: 'Estamos preparando una preevaluación para ahorro, respaldo y espacios comunes.',
        loadingMessages: LOADING_COMMUNITY,
        whatsappIntentLine: 'Mi prioridad es mantener operativas las áreas comunes ante cortes eléctricos.',
        formRevealCtaLabel: 'Solicitar evaluación de continuidad comunal',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: { hoursMin: 6, hoursMax: 10, scopeLine: 'para accesos, CCTV e iluminación común' },
      }

    case 'industrial_continuity':
      return {
        segmentKey: seg,
        resultTitle: 'Diagnóstico de infraestructura energética',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'Tu operación crítica sigue funcionando',
        primaryKpiLabel: 'Ahorro mensual referencial',
        primaryKpiMode: 'continuity',
        backupTitle: 'Respaldo para infraestructura crítica',
        backupCopy:
          'Solutimp Energy puede evaluar una solución para mantener activos accesos, seguridad, iluminación y cargas esenciales.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos una demanda operativa acorde a tu tipo de instalación.',
        loadingHeadline: 'Analizando infraestructura crítica',
        loadingSubcopy: 'Estamos preparando una preevaluación para ahorro, respaldo y continuidad operativa.',
        loadingMessages: LOADING_INDUSTRIAL,
        whatsappIntentLine: 'Quiero evaluar respaldo energético para mi operación crítica.',
        formRevealCtaLabel: 'Evaluar mi infraestructura energética',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: { hoursMin: 6, hoursMax: 12, scopeLine: 'para accesos, seguridad y comunicaciones' },
      }

    case 'industrial_savings':
      return {
        segmentKey: seg,
        resultTitle: 'Eficiencia energética en instalación industrial',
        resultSubtitle: 'Preevaluación Solutimp Energy',
        mainClaim: 'Reduce costos de electricidad en tu operación',
        primaryKpiLabel: 'Podrías dejar de pagar aprox.',
        primaryKpiMode: 'savings',
        backupTitle: 'Respaldo referencial industrial',
        backupCopy:
          'Solutimp Energy puede complementar el ahorro con evaluación de continuidad referencial en cargas clave.',
        backupFootDisclaimer: FOOT_REF,
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos una demanda operativa acorde a tu tipo de instalación.',
        loadingHeadline: 'Analizando infraestructura crítica',
        loadingSubcopy: 'Estamos preparando una preevaluación de ahorro y escenario solar referencial.',
        loadingMessages: LOADING_INDUSTRIAL,
        whatsappIntentLine: 'Quiero revisar el ahorro estimado y una propuesta solar para mi instalación.',
        formRevealCtaLabel: CTA_SAVINGS,
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: nonResidentialDisclaimer,
        referentialAutonomy: null,
      }

    default:
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
        protectedLoadChips: chips,
        narrativeConsumptionHint: 'Estimamos un perfil de consumo acorde a la referencia declarada.',
        loadingHeadline: 'Tu hogar sigue funcionando',
        loadingSubcopy: 'Estamos preparando una preevaluación de ahorro, respaldo y continuidad energética.',
        loadingMessages: LOADING_RESIDENTIAL,
        whatsappIntentLine: 'Quiero revisar el ahorro estimado y una propuesta solar.',
        formRevealCtaLabel: 'Hablar con un especialista energético',
        whatsappButtonLabel: WA_BTN,
        planDisclaimer: residentialDisclaimer,
        referentialAutonomy: null,
      }
  }
}

/** Mensajes por defecto del overlay (residencial) si no se pasan props. */
export const DEFAULT_LOADING_MESSAGES: readonly string[] = LOADING_RESIDENTIAL
