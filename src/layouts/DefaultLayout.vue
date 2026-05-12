<script setup lang="ts"></script>

<template>
  <v-app theme="dark" class="dl-app">
    <div class="dl-root">
      <router-view />
    </div>
  </v-app>
</template>

<style scoped>
.dl-app {
  background: transparent !important;
}

.dl-root {
  min-height: 100%;
  min-height: 100dvh;
}
</style>
