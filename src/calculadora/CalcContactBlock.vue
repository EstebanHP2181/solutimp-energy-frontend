<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { submitEnergyLead } from '@/api/energyLeads'
import { calculadoraFlowKey } from '@/composables/useCalculadoraFlow'
import {
  CHILE_MOBILE_PREFIX,
  getChileMobileValidationError,
  isValidChileMobileE164,
  normalizeChileMobileInput,
  normalizeChileMobileToE164,
} from '@/shared/chilePhone'
import {
  monthlyBillAmountToConsumptionRange,
  simulateConsumptionRangeToLeadConsumptionRange,
} from '@/shared/monthlyBillToConsumptionRange'
import { loadUtmsFromSession } from '@/shared/utmSession'

const flow = inject(calculadoraFlowKey)!

const submitting = ref(false)
const sent = ref(false)

const phoneError = computed(() => getChileMobileValidationError(flow.phone))

const canSubmit = computed(
  () =>
    flow.name.trim().length > 1 &&
    isValidChileMobileE164(normalizeChileMobileInput(flow.phone)) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(flow.email.trim()) &&
    flow.acceptedContact
)

function onPhoneInput(e: Event) {
  const el = e.target as HTMLInputElement
  const n = normalizeChileMobileInput(el.value)
  if (n.startsWith(CHILE_MOBILE_PREFIX)) {
    flow.phone = n.slice(CHILE_MOBILE_PREFIX.length)
  } else {
    flow.phone = el.value.replace(/\D/g, '').slice(0, 8)
  }
  el.value = flow.phone
}

async function submit() {
  if (!canSubmit.value || submitting.value) return
  const phoneE164 = normalizeChileMobileToE164(flow.phone)
  if (!phoneE164) return
  submitting.value = true
  const apiRange = monthlyBillAmountToConsumptionRange(flow.monthlyBillAmount)
  const utm = loadUtmsFromSession()
  await submitEnergyLead({
    propertyType: flow.propertyType,
    consumptionRange: simulateConsumptionRangeToLeadConsumptionRange(apiRange),
    mainGoal: flow.mainGoal,
    region: flow.region,
    name: flow.name.trim(),
    phone: phoneE164,
    email: flow.email.trim(),
    communeOrAddress: flow.communeOrAddress.trim() || undefined,
    acceptedContact: flow.acceptedContact,
    monthlyBillAmount: flow.monthlyBillAmount,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,
  })
  submitting.value = false
  sent.value = true
}
</script>

<template>
  <div class="contact">
    <template v-if="!sent">
      <h3 class="sub-q">¿Quieres que te contactemos?</h3>
      <p class="hint">Deja tus datos y un asesor te responderá en horario hábil.</p>
      <div class="fields">
        <div>
          <label class="lbl" for="calc-name">Nombre</label>
          <input id="calc-name" v-model="flow.name" type="text" class="inp" autocomplete="name" />
        </div>
        <div>
          <label class="lbl" for="calc-phone">Teléfono celular (Chile)</label>
          <div class="phone-row">
            <span class="flag" aria-hidden="true">🇨🇱</span>
            <span class="prefix" aria-hidden="true">+569</span>
            <input
              id="calc-phone"
              class="phone-inp"
              :value="flow.phone"
              type="tel"
              name="phone-local-cl"
              inputmode="numeric"
              autocomplete="tel"
              placeholder="12345678"
              maxlength="32"
              :aria-invalid="phoneError ? 'true' : 'false'"
              :aria-describedby="phoneError ? 'calc-phone-err calc-phone-hint' : 'calc-phone-hint'"
              @input="onPhoneInput"
            />
          </div>
          <p id="calc-phone-hint" class="field-hint">Ingresa solo los 8 dígitos de tu celular o pega el número completo.</p>
          <p v-if="phoneError" id="calc-phone-err" class="field-err" role="alert">{{ phoneError }}</p>
        </div>
        <div>
          <label class="lbl" for="calc-email">Email</label>
          <input id="calc-email" v-model="flow.email" type="email" class="inp" autocomplete="email" />
          <p class="mail-hint">
            Cotizaciones (Chile):
            <a href="mailto:info@solutimp.cl">info@solutimp.cl</a>
          </p>
        </div>
        <div>
          <label class="lbl" for="calc-addr">Comuna o dirección aproximada <span class="opt">(opcional)</span></label>
          <input id="calc-addr" v-model="flow.communeOrAddress" type="text" class="inp" autocomplete="address-level2" />
        </div>
        <label class="chk">
          <input v-model="flow.acceptedContact" type="checkbox" />
          <span>Acepto ser contactado por Solutimp Energy.</span>
        </label>
      </div>
      <button type="button" class="se-btn" :disabled="!canSubmit || submitting" @click="submit">
        {{ submitting ? 'Enviando…' : 'Enviar mis datos' }}
      </button>
    </template>
    <p v-else class="done">Gracias. Revisa también WhatsApp para una respuesta más rápida.</p>
  </div>
</template>

<style scoped>
.contact {
  margin-top: 1.35rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--se-glass-border);
}

.sub-q {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
}

.hint {
  font-size: 0.85rem;
  color: var(--se-text-muted);
  margin: 0 0 1rem;
  line-height: 1.45;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1rem;
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

.phone-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.65);
}

.flag {
  font-size: 1.35rem;
  line-height: 1;
  flex-shrink: 0;
}

.prefix {
  font-size: 1rem;
  font-weight: 600;
  color: var(--se-text-muted);
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.phone-inp {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--se-text);
  font-size: 1.1rem;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.06em;
  padding: 0.25rem 0;
  outline: none;
}

.phone-inp::placeholder {
  color: var(--se-text-muted);
  opacity: 0.45;
}

.phone-row:focus-within {
  outline: 2px solid var(--se-cyan);
  outline-offset: 1px;
}

.field-hint {
  margin: 0.4rem 0 0;
  font-size: 0.76rem;
  color: var(--se-text-muted);
  line-height: 1.35;
}

.field-err {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: #ff8a8a;
  line-height: 1.35;
}

.mail-hint {
  margin: 0.45rem 0 0;
  font-size: 0.78rem;
  color: var(--se-text-muted);
  line-height: 1.4;
}

.mail-hint a {
  color: var(--se-cyan);
}

.chk {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--se-text-muted);
  cursor: pointer;
}

.chk input {
  margin-top: 0.15rem;
}

.se-btn {
  width: 100%;
}

.done {
  margin: 0;
  font-size: 0.9rem;
  color: var(--se-cyan);
  line-height: 1.45;
}
</style>
