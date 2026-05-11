<script setup lang="ts">
import { useDisplay } from 'vuetify'

const display = useDisplay()
</script>

<template>
  <div class="layout-root">
    <v-app-bar
      app
      class="layout-app-bar"
      color="surface"
      elevation="0"
      border
    >
      <v-container class="pa-2 pa-sm-3" fluid>
        <div class="d-flex align-center justify-space-between flex-wrap gap-2">
          <div class="text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-primary">
            SOLUTIMP ENERGY
          </div>
          <div class="text-caption text-medium-emphasis d-none d-sm-block">
            GoodWe Smart Solar
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-main app class="layout-main">
      <v-container
        class="py-4 py-sm-6"
        :class="display.mobile ? 'px-4' : 'px-6'"
        fluid
      >
        <div class="layout-content mx-auto">
          <router-view />
        </div>
      </v-container>
    </v-main>

    <v-footer class="text-caption text-medium-emphasis border-t" app>
      <v-container class="py-3 text-center" fluid>
        © {{ new Date().getFullYear() }} SOLUTIMP · Independiente de PrestaShop
      </v-container>
    </v-footer>
  </div>
</template>

<style scoped>
.layout-root {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.layout-app-bar {
  position: sticky;
  top: 0;
  z-index: 10;
}

.layout-main {
  flex: 1 1 auto;
}

/* Mobile-first: ancho cómodo en pantallas grandes */
.layout-content {
  width: 100%;
  max-width: 720px;
}

@media (min-width: 960px) {
  .layout-content {
    max-width: 960px;
  }
}
</style>
