import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import { computed, reactive, ref, watch } from 'vue'
import { postSimulate, type SimulationResult } from '@/api/energySimulate'
import { CHILE_REGIONS } from '@/shared/chileRegions'
import { inferRegionFromText } from '@/shared/inferRegionFromText'
import {
  consumptionRangeForPrudentSimulate,
  monthlyBillAmountToConsumptionRange,
} from '@/shared/monthlyBillToConsumptionRange'

/** Alineado a useWizard (sin importar el composable para no acoplar flujos). */
export type CalcPropertyType = 'casa' | 'parcela' | 'empresa' | 'condominio' | 'bodega' | ''

export type CalcMainGoal =
  | 'ahorro'
  | 'respaldo'
  | 'equipos_criticos'
  | 'vender_excedente'
  | 'empresa'
  | ''

/** Prioridades secundarias (UX v2); aún no enviadas al API de simulación. */
export type CalcSecondaryPriorityId =
  | 'internet_wifi'
  | 'porton'
  | 'camaras'
  | 'refrigeracion'
  | 'iluminacion'
  | 'aire_acondicionado'
  | 'bombas'
  | 'oficina'
  | 'ev'

const SLIDER_MIN = 10_000
const SLIDER_MAX = 500_000
const SLIDER_STEP = 5_000

/** Pasos post-hero: propiedad → ubicación+región → objetivo → prioridades → boleta → resultado */
export const CALC_POST_HERO_STEPS = 6

function mapGoalToApi(g: CalcMainGoal): string {
  const m: Record<string, string> = {
    ahorro: 'ahorro',
    respaldo: 'respaldo',
    equipos_criticos: 'proteger_equipos',
    vender_excedente: 'vender_excedentes',
    empresa: 'empresa',
    '': 'ahorro',
  }
  return m[g] ?? 'ahorro'
}

function regionLabel(code: string): string {
  return CHILE_REGIONS.find((r) => r.value === code)?.label ?? code
}

function prefersReducedMotion(): boolean {
  if (typeof matchMedia === 'undefined') return false
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useCalculadoraFlow() {
  const postHeroStep = ref(0)
  const monthlyBillAmount = ref(85_000)
  const propertyType = ref<CalcPropertyType>('')
  /** Objetivo principal (misma semántica que antes para API / narrativa). */
  const mainGoal = ref<CalcMainGoal>('')
  const region = ref('')
  const simulationResult = ref<SimulationResult | null>(null)
  const simulationLoading = ref(false)
  const analysisPhase = ref(false)

  const name = ref('')
  const phone = ref('')
  const email = ref('')
  const communeOrAddress = ref('')
  const acceptedContact = ref(false)

  /** Borrador del paso “ubicación” (una sola caja). */
  const calcLocationLine = ref('')
  /** Derivado al confirmar ubicación. */
  const direccion = ref('')
  const comuna = ref('')
  const regionLocationInferida = ref('')

  const secondaryPriorities = ref<CalcSecondaryPriorityId[]>([])

  const progressFraction = computed(() => (postHeroStep.value + 1) / CALC_POST_HERO_STEPS)

  const consumptionRangeForApi = computed(() => monthlyBillAmountToConsumptionRange(monthlyBillAmount.value))

  watch(calcLocationLine, (v) => {
    const t = v.trim()
    if (t.length === 0) {
      region.value = ''
      return
    }
    if (t.length < 3) return
    if (!inferRegionFromText(t)) {
      region.value = ''
    }
  })

  function canCompleteLocationStep(): boolean {
    const raw = calcLocationLine.value.trim()
    if (raw.length < 3) return false
    return inferRegionFromText(raw) !== null || region.value.length > 0
  }

  function canAdvanceBill(): boolean {
    return (
      propertyType.value !== '' &&
      mainGoal.value !== '' &&
      monthlyBillAmount.value >= SLIDER_MIN &&
      monthlyBillAmount.value <= SLIDER_MAX
    )
  }

  /** @deprecated usar canAdvanceBill; se mantiene por compatibilidad con tests o código legacy */
  function canAdvanceProfile() {
    return canAdvanceBill()
  }

  function canAdvanceRegion() {
    return region.value.length > 0
  }

  function commitLocationFields() {
    const raw = calcLocationLine.value.trim()
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length >= 2) {
      direccion.value = parts[0] ?? ''
      comuna.value = parts.slice(1).join(', ')
    } else {
      direccion.value = ''
      comuna.value = raw
    }
    communeOrAddress.value = raw
  }

  function commitLocationAndAdvance() {
    if (!canCompleteLocationStep()) return
    commitLocationFields()
    const raw = calcLocationLine.value.trim()
    const inferred = inferRegionFromText(raw)
    if (inferred) {
      region.value = inferred
      regionLocationInferida.value = inferred
    } else {
      if (!region.value) return
      regionLocationInferida.value = ''
    }
    next()
  }

  function toggleSecondary(id: CalcSecondaryPriorityId) {
    const list = secondaryPriorities.value
    const i = list.indexOf(id)
    if (i >= 0) list.splice(i, 1)
    else list.push(id)
  }

  function autoAdvanceDelayMs() {
    return prefersReducedMotion() ? 0 : 220
  }

  function scheduleAutoNext() {
    window.setTimeout(() => {
      next()
    }, autoAdvanceDelayMs())
  }

  function selectPropertyType(v: Exclude<CalcPropertyType, ''>) {
    propertyType.value = v
    scheduleAutoNext()
  }

  function selectMainGoal(v: Exclude<CalcMainGoal, ''>) {
    mainGoal.value = v
    scheduleAutoNext()
  }

  function nextFromHero() {
    postHeroStep.value = 0
  }

  function next() {
    if (postHeroStep.value < CALC_POST_HERO_STEPS - 1) {
      postHeroStep.value += 1
    }
  }

  function back() {
    if (postHeroStep.value > 0) {
      postHeroStep.value -= 1
    }
  }

  const MIN_ANALYSIS_MS = 1800
  const MAX_ANALYSIS_MS = 3200

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function runSimulate() {
    simulationLoading.value = true
    simulationResult.value = null
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now()
    try {
      const consumption_range = consumptionRangeForPrudentSimulate(
        monthlyBillAmount.value,
        mainGoal.value,
      )
      const res = await postSimulate({
        property_type: (propertyType.value || 'casa') as string,
        consumption_range,
        main_goal: mapGoalToApi(mainGoal.value),
        region: regionLabel(region.value),
      })
      simulationResult.value = res
      const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const apiMs = t1 - t0
      if (apiMs < MIN_ANALYSIS_MS) {
        await sleep(MIN_ANALYSIS_MS - apiMs)
      }
      const t2 = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const total = t2 - t0
      if (total < MAX_ANALYSIS_MS) {
        await sleep(MAX_ANALYSIS_MS - total)
      }
    } finally {
      simulationLoading.value = false
    }
  }

  /** Tras el paso boleta: ejecuta simulación y avanza al resultado (sin paso región aparte). */
  async function continueFromRegion() {
    if (!canAdvanceBill() || !canAdvanceRegion() || simulationLoading.value) return
    analysisPhase.value = true
    try {
      await runSimulate()
    } finally {
      analysisPhase.value = false
    }
    next()
  }

  return reactive({
    SLIDER_MIN,
    SLIDER_MAX,
    SLIDER_STEP,
    postHeroStep,
    monthlyBillAmount,
    propertyType,
    mainGoal,
    region,
    simulationResult,
    simulationLoading,
    analysisPhase,
    consumptionRangeForApi,
    name,
    phone,
    email,
    communeOrAddress,
    acceptedContact,
    calcLocationLine,
    direccion,
    comuna,
    regionLocationInferida,
    secondaryPriorities,
    progressFraction,
    canCompleteLocationStep,
    canAdvanceBill,
    canAdvanceProfile,
    canAdvanceRegion,
    commitLocationAndAdvance,
    toggleSecondary,
    selectPropertyType,
    selectMainGoal,
    nextFromHero,
    next,
    back,
    continueFromRegion,
    regionLabel,
  })
}

export type CalculadoraFlow = UnwrapNestedRefs<ReturnType<typeof useCalculadoraFlow>>

export const calculadoraFlowKey: InjectionKey<CalculadoraFlow> = Symbol('calculadora-flow')
