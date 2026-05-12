<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import CalcHeroStep from '@/calculadora/CalcHeroStep.vue'
import CalcProfileStep from '@/calculadora/CalcProfileStep.vue'
import CalcRegionStep from '@/calculadora/CalcRegionStep.vue'
import CalcResultStep from '@/calculadora/CalcResultStep.vue'
import EnergyAnalysisLoading from '@/calculadora/EnergyAnalysisLoading.vue'
import EnergyBackground from '@/components/wizard/EnergyBackground.vue'
import WizardShell from '@/components/wizard/WizardShell.vue'
import {
  calculadoraFlowKey,
  CALC_POST_HERO_STEPS,
  useCalculadoraFlow,
} from '@/composables/useCalculadoraFlow'
import { getEnergyNarrativeContext } from '@/calculadora/narrativeEngine'
import { readUtmsFromQuery } from '@/shared/utmQuery'
import { saveUtmsToSession } from '@/shared/utmSession'

const route = useRoute()

onMounted(() => {
  const utms = readUtmsFromQuery(route.query as Record<string, unknown>)
  saveUtmsToSession(utms)
})

const showHero = ref(true)
const flow = useCalculadoraFlow()
provide(calculadoraFlowKey, flow)

function start() {
  showHero.value = false
  flow.nextFromHero()
}

const stepComponent = computed(() => {
  const map = [CalcProfileStep, CalcRegionStep, CalcResultStep] as const
  return map[flow.postHeroStep] ?? CalcProfileStep
})

const showBack = computed(() => !showHero.value && flow.postHeroStep > 0)

const narrativeForLoading = computed(() =>
  getEnergyNarrativeContext({
    propertyType: flow.propertyType,
    mainGoal: flow.mainGoal,
  })
)
</script>

<template>
  <div class="calc">
    <EnergyBackground />
    <div class="calc-inner">
      <CalcHeroStep v-if="showHero" @start="start" />
      <WizardShell
        v-else
        :current-step="flow.postHeroStep"
        :total-steps="CALC_POST_HERO_STEPS"
        :progress-fraction="flow.progressFraction"
        :show-back="showBack"
        @back="flow.back()"
      >
        <component :is="stepComponent" />
      </WizardShell>
      <EnergyAnalysisLoading
        v-if="!showHero && flow.analysisPhase"
        :headline="narrativeForLoading.loadingHeadline"
        :subcopy="narrativeForLoading.loadingSubcopy"
        :messages="narrativeForLoading.loadingMessages"
      />
    </div>
  </div>
</template>

<style scoped>
.calc {
  position: relative;
  min-height: 100%;
}

.calc-inner {
  position: relative;
  z-index: 1;
  min-height: 12rem;
  max-width: 560px;
  margin: 0 auto;
  padding: 0.75rem 1rem 2rem;
}
</style>
