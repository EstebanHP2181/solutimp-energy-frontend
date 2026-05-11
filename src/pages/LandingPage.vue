<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goOnboarding() {
  void router.push({ name: 'onboarding' })
}
</script>

<template>
  <section class="landing text-center">
    <v-sheet class="pa-6 pa-sm-10 rounded-xl elevation-1">
      <h1 class="text-h4 text-sm-h3 font-weight-bold mb-3">SOLUTIMP ENERGY</h1>
      <p class="text-body-1 text-sm-h6 text-medium-emphasis mb-6">
        Solar + respaldo energético
      </p>
      <v-btn color="primary" size="large" block class="d-sm-inline-flex" @click="goOnboarding">
        Comenzar evaluación
      </v-btn>
    </v-sheet>
  </section>
</template>

<style scoped>
.landing {
  padding-top: 0.5rem;
}
</style>
