<script setup lang="ts">
defineProps<{
  fraction: number
}>()
</script>

<template>
  <div class="pb" role="progressbar" :aria-valuenow="Math.round(fraction * 100)" aria-valuemin="0" aria-valuemax="100">
    <div class="pb-track">
      <div class="pb-fill" :style="{ transform: `scaleX(${Math.min(1, Math.max(0, fraction))})` }" />
    </div>
  </div>
</template>

<style scoped>
.pb {
  width: 100%;
  max-width: 420px;
  margin: 0 auto 1.25rem;
}

.pb-track {
  height: 6px;
  border-radius: 99px;
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
  overflow: hidden;
}

.pb-fill {
  height: 100%;
  width: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--se-blue), var(--se-cyan));
  box-shadow: 0 0 16px var(--se-glow);
  transform-origin: left center;
  transition: transform var(--se-transition);
}
</style>
