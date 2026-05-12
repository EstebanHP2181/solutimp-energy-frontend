<script setup lang="ts">
defineProps<{
  label: string
  selected?: boolean
  icon?: string
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    type="button"
    class="oc"
    :class="{ 'oc--selected': selected }"
    :aria-pressed="selected ? 'true' : 'false'"
    @click="emit('select')"
  >
    <span v-if="icon" class="oc-icon" aria-hidden="true">{{ icon }}</span>
    <span class="oc-label">{{ label }}</span>
    <span v-if="selected" class="oc-check" aria-hidden="true">✓</span>
  </button>
</template>

<style scoped>
.oc {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.15rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: var(--se-glass);
  color: var(--se-text);
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--se-transition),
    box-shadow var(--se-transition),
    border-color var(--se-transition),
    background var(--se-transition);
}

.oc:hover {
  transform: scale(1.02);
  box-shadow: 0 0 24px var(--se-glow);
  border-color: rgba(0, 132, 255, 0.45);
}

.oc:focus-visible {
  outline: 2px solid var(--se-cyan);
  outline-offset: 2px;
}

.oc--selected {
  border-color: var(--se-blue-electric);
  background: rgba(0, 102, 217, 0.2);
  box-shadow: 0 0 20px var(--se-glow);
}

.oc-icon {
  font-size: 1.35rem;
  line-height: 1;
  opacity: 0.95;
}

.oc-label {
  flex: 1;
}

.oc-check {
  color: var(--se-green);
  font-weight: 700;
  font-size: 1.1rem;
}
</style>
