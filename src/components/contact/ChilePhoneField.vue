<script setup lang="ts">
import { sanitizeChileMobileDigits8 } from '@/shared/chilePhone'

const props = withDefaults(
  defineProps<{
    modelValue: string
    inputId: string
    label?: string
  }>(),
  { label: 'Teléfono celular (Chile)' }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(e: Event) {
  const t = e.target as HTMLInputElement
  emit('update:modelValue', sanitizeChileMobileDigits8(t.value))
}
</script>

<template>
  <div>
    <label class="lbl" :for="inputId">{{ label }}</label>
    <div class="phone-row">
      <span class="flag" aria-hidden="true">🇨🇱</span>
      <span class="prefix" aria-hidden="true">+569</span>
      <input
        :id="inputId"
        class="phone-inp"
        :value="modelValue"
        type="text"
        name="phone-local-cl"
        maxlength="8"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="tel-national"
        placeholder="12345678"
        :aria-describedby="`${inputId}-hint`"
        @input="onInput"
      />
    </div>
    <p :id="`${inputId}-hint`" class="hint">Ingresa solo los 8 dígitos de tu celular.</p>
  </div>
</template>

<style scoped>
.lbl {
  display: block;
  font-size: 0.82rem;
  color: var(--se-text-muted);
  margin-bottom: 0.35rem;
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

.hint {
  margin: 0.4rem 0 0;
  font-size: 0.76rem;
  color: var(--se-text-muted);
  line-height: 1.35;
}
</style>
