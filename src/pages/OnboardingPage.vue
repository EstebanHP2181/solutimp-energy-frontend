<script setup lang="ts">
import { computed, onMounted, provide, reactive } from 'vue'
import { useRoute } from 'vue-router'
import WizardShell from '@/components/wizard/WizardShell.vue'
import EnergyBackground from '@/components/wizard/EnergyBackground.vue'
import { createWizardState, wizardInjectionKey } from '@/composables/useWizard'
import StepWelcome from '@/onboarding/steps/StepWelcome.vue'
import StepPropertyType from '@/onboarding/steps/StepPropertyType.vue'
import StepConsumption from '@/onboarding/steps/StepConsumption.vue'
import StepGoal from '@/onboarding/steps/StepGoal.vue'
import StepRegion from '@/onboarding/steps/StepRegion.vue'
import StepContact from '@/onboarding/steps/StepContact.vue'
import StepResult from '@/onboarding/steps/StepResult.vue'

const route = useRoute()
const wizard = reactive(createWizardState())
provide(wizardInjectionKey, wizard)

onMounted(() => {
  wizard.applyRouteStart(route.query.start as string | undefined)
})

const stepComponent = computed(() => {
  const map = [
    StepWelcome,
    StepPropertyType,
    StepConsumption,
    StepGoal,
    StepRegion,
    StepContact,
    StepResult,
  ] as const
  return map[wizard.currentStep] ?? StepWelcome
})

const showBack = computed(() => wizard.currentStep > 0 && wizard.currentStep < 6)
</script>

<template>
  <div class="onb">
    <EnergyBackground />
    <div class="onb-layout">
      <aside class="onb-aside" aria-hidden="true">
        <div class="aside-glow" />
        <p class="aside-tag">Solutimp · Tecnología y energía</p>
        <p class="aside-lead">Solar, respaldo y soluciones para hogares y empresas en Chile.</p>
      </aside>
      <main class="onb-main">
        <WizardShell
          :current-step="wizard.currentStep"
          :total-steps="wizard.TOTAL_STEPS"
          :progress-fraction="wizard.progressFraction"
          :show-back="showBack"
          @back="wizard.back()"
        >
          <component :is="stepComponent" />
        </WizardShell>
      </main>
    </div>
  </div>
</template>

<style scoped>
.onb {
  position: relative;
  min-height: 100%;
}

.onb-layout {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 1100px) {
  .onb-layout {
    flex-direction: row;
    align-items: stretch;
    padding: 0 1rem;
  }
}

.onb-aside {
  display: none;
}

@media (min-width: 1100px) {
  .onb-aside {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 0 0 38%;
    max-width: 400px;
    padding: 2rem 1.5rem 2rem 0;
    position: relative;
  }
}

.aside-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%);
  top: 10%;
  left: 10%;
  filter: blur(8px);
}

.aside-tag {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--se-cyan);
  margin: 0 0 1rem;
  position: relative;
}

.aside-lead {
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--se-text-muted);
  margin: 0;
  position: relative;
  max-width: 280px;
}

.onb-main {
  flex: 1;
  min-width: 0;
}
</style>
