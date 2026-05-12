import type { InjectionKey, UnwrapNestedRefs } from 'vue'
import { computed, ref } from 'vue'

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

export const TOTAL_STEPS = 7

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
