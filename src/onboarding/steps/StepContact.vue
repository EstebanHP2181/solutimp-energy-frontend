<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { submitEnergyLead } from '@/api/energyLeads'
import { wizardInjectionKey } from '@/composables/useWizard'

const w = inject(wizardInjectionKey)!

const submitting = ref(false)

const canSubmit = computed(
  () =>
    w.name.trim().length > 1 &&
    w.phone.trim().length > 6 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w.email.trim()) &&
    w.acceptedContact
)

async function submit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  await submitEnergyLead({
    propertyType: w.propertyType,
    consumptionRange: w.consumptionRange,
    mainGoal: w.mainGoal,
    region: w.region,
    name: w.name.trim(),
    phone: w.phone.trim(),
    email: w.email.trim(),
    communeOrAddress: w.communeOrAddress.trim() || undefined,
    acceptedContact: w.acceptedContact,
  })
  submitting.value = false
  w.next()
}
</script>

<template>
  <div class="step">
    <h2 class="step-q">Tu evaluación preliminar está lista</h2>
    <p class="step-hint">
      Déjanos tus datos y un asesor de Solutimp Energy podrá enviarte una propuesta personalizada.
    </p>
    <div class="fields">
      <div>
        <label class="lbl" for="f-name">Nombre</label>
        <input id="f-name" v-model="w.name" type="text" class="inp" autocomplete="name" />
      </div>
      <div>
        <label class="lbl" for="f-phone">Teléfono</label>
        <input id="f-phone" v-model="w.phone" type="tel" class="inp" autocomplete="tel" />
      </div>
      <div>
        <label class="lbl" for="f-email">Email</label>
        <input id="f-email" v-model="w.email" type="email" class="inp" autocomplete="email" />
      </div>
      <div>
        <label class="lbl" for="f-addr">Comuna o dirección aproximada <span class="opt">(opcional)</span></label>
        <input id="f-addr" v-model="w.communeOrAddress" type="text" class="inp" autocomplete="address-level2" />
      </div>
      <label class="chk">
        <input v-model="w.acceptedContact" type="checkbox" />
        <span>Acepto ser contactado por Solutimp Energy.</span>
      </label>
    </div>
    <button type="button" class="se-btn" :disabled="!canSubmit || submitting" @click="submit">
      {{ submitting ? 'Enviando…' : 'Recibir evaluación gratuita' }}
    </button>
  </div>
</template>

<style scoped>
.step-q {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.65rem;
  line-height: 1.35;
}

.step-hint {
  font-size: 0.88rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0 0 1.1rem;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.15rem;
}

.lbl {
  display: block;
  font-size: 0.82rem;
  color: var(--se-text-muted);
  margin-bottom: 0.35rem;
}

.opt {
  font-weight: 400;
  opacity: 0.85;
}

.inp {
  width: 100%;
  box-sizing: border-box;
  padding: 0.85rem 1rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.65);
  color: var(--se-text);
  font-size: 1rem;
  font-family: inherit;
}

.inp:focus {
  outline: 2px solid var(--se-cyan);
  outline-offset: 1px;
}

.chk {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.88rem;
  color: var(--se-text-muted);
  cursor: pointer;
}

.chk input {
  margin-top: 0.2rem;
  accent-color: var(--se-blue-electric);
}
</style>
