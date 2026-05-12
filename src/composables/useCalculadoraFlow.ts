import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import { computed, reactive, ref } from 'vue'
import { postSimulate, type SimulationResult } from '@/api/energySimulate'
import { CHILE_REGIONS } from '@/shared/chileRegions'
import { monthlyBillAmountToConsumptionRange } from '@/shared/monthlyBillToConsumptionRange'

/** Alineado a useWizard (sin importar el composable para no acoplar flujos). */
export type CalcPropertyType = 'casa' | 'parcela' | 'empresa' | 'condominio' | 'bodega' | ''

export type CalcMainGoal =
  | 'ahorro'
  | 'respaldo'
  | 'equipos_criticos'
  | 'vender_excedente'
  | 'empresa'
  | ''

const SLIDER_MIN = 10_000
const SLIDER_MAX = 500_000
const SLIDER_STEP = 5_000

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

export const CALC_POST_HERO_STEPS = 3

export function useCalculadoraFlow() {
  const postHeroStep = ref(0)
  const monthlyBillAmount = ref(85_000)
  const propertyType = ref<CalcPropertyType>('')
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

  const progressFraction = computed(() => (postHeroStep.value + 1) / CALC_POST_HERO_STEPS)

  const consumptionRangeForApi = computed(() => monthlyBillAmountToConsumptionRange(monthlyBillAmount.value))

  function canAdvanceProfile() {
    return (
      propertyType.value !== '' &&
      mainGoal.value !== '' &&
      monthlyBillAmount.value >= SLIDER_MIN &&
      monthlyBillAmount.value <= SLIDER_MAX
    )
  }

  function canAdvanceRegion() {
    return region.value.length > 0
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
      const consumption_range = monthlyBillAmountToConsumptionRange(monthlyBillAmount.value)
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

  async function continueFromRegion() {
    if (!canAdvanceRegion() || simulationLoading.value) return
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
    progressFraction,
    canAdvanceProfile,
    canAdvanceRegion,
    nextFromHero,
    next,
    back,
    continueFromRegion,
    regionLabel,
  })
}

export type CalculadoraFlow = UnwrapNestedRefs<ReturnType<typeof useCalculadoraFlow>>

export const calculadoraFlowKey: InjectionKey<CalculadoraFlow> = Symbol('calculadora-flow')
