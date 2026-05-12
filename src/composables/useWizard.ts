import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import { computed, ref } from 'vue'
import { postSimulate, type SimulationResult } from '@/api/energySimulate'
import { CHILE_REGIONS } from '@/shared/chileRegions'

export type PropertyType =
  | 'casa'
  | 'parcela'
  | 'empresa'
  | 'condominio'
  | 'bodega'
  | ''

export type ConsumptionRange =
  | 'lt50'
  | '50_100'
  | '100_200'
  | 'gt200'
  | 'unknown'
  | ''

export type MainGoal =
  | 'ahorro'
  | 'respaldo'
  | 'equipos_criticos'
  | 'vender_excedente'
  | 'empresa'
  | ''

export const TOTAL_STEPS = 8

export function createWizardState() {
  const currentStep = ref(0)

  const propertyType = ref<PropertyType>('')
  const consumptionRange = ref<ConsumptionRange>('')
  const mainGoal = ref<MainGoal>('')
  const region = ref('')
  const name = ref('')
  const phone = ref('')
  const email = ref('')
  const communeOrAddress = ref('')
  const acceptedContact = ref(false)

  const simulationResult = ref<SimulationResult | null>(null)
  const simulationLoading = ref(false)

  const progressFraction = computed(() => (currentStep.value + 1) / TOTAL_STEPS)

  function goToStep(step: number) {
    currentStep.value = Math.max(0, Math.min(TOTAL_STEPS - 1, step))
  }

  function next() {
    if (currentStep.value < TOTAL_STEPS - 1) {
      currentStep.value += 1
    }
  }

  function back() {
    if (currentStep.value > 0) {
      currentStep.value -= 1
    }
  }

  function regionLabel(code: string): string {
    return CHILE_REGIONS.find((r) => r.value === code)?.label ?? code
  }

  function mapConsumption(c: ConsumptionRange): string {
    const m: Record<string, string> = {
      lt50: 'menos_50k',
      '50_100': '50k_100k',
      '100_200': '100k_200k',
      gt200: 'mas_200k',
      unknown: 'no_se',
      '': 'no_se',
    }
    return m[c] ?? 'no_se'
  }

  function mapGoal(g: MainGoal): string {
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

  async function simulateProject() {
    simulationLoading.value = true
    simulationResult.value = null
    const minDelay = new Promise<void>((resolve) => {
      setTimeout(resolve, 520)
    })
    try {
      const [res] = await Promise.all([
        postSimulate({
          property_type: (propertyType.value || 'casa') as string,
          consumption_range: mapConsumption(consumptionRange.value),
          main_goal: mapGoal(mainGoal.value),
          region: regionLabel(region.value),
        }),
        minDelay,
      ])
      simulationResult.value = res
    } finally {
      simulationLoading.value = false
    }
  }

  function applyRouteStart(startParam: string | undefined) {
    if (startParam === '1' || startParam === 'property') {
      currentStep.value = 1
    }
  }

  function reset() {
    currentStep.value = 0
    propertyType.value = ''
    consumptionRange.value = ''
    mainGoal.value = ''
    region.value = ''
    name.value = ''
    phone.value = ''
    email.value = ''
    communeOrAddress.value = ''
    acceptedContact.value = false
    simulationResult.value = null
    simulationLoading.value = false
  }

  return {
    TOTAL_STEPS,
    currentStep,
    propertyType,
    consumptionRange,
    mainGoal,
    region,
    name,
    phone,
    email,
    communeOrAddress,
    acceptedContact,
    simulationResult,
    simulationLoading,
    simulateProject,
    progressFraction,
    goToStep,
    next,
    back,
    applyRouteStart,
    reset,
  }
}

export type WizardContext = UnwrapNestedRefs<ReturnType<typeof createWizardState>>

export const wizardInjectionKey: InjectionKey<WizardContext> = Symbol('energy-wizard')
