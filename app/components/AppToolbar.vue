<template>
  <v-app-bar
    color="#0f1f3d"
    elevation="0"
    height="60"
  >

    <!-- Hamburger (solo móvil) -->
    <v-app-bar-nav-icon
      v-if="!mdAndUp"
      color="white"
      @click="emit('toggle-drawer')"
    />

    <!-- ── Logo + nombre (siempre visible) ───────── -->
    <div class="d-flex align-center ga-3 ml-2 ml-md-4">
      <div class="logo-hex">
        <svg width="32" height="32" viewBox="0 0 80 80">
          <polygon points="40,4 72,22 72,58 40,76 8,58 8,22"  fill="#378ADD" />
          <polygon points="40,16 64,30 64,50 40,64 16,50 16,30" fill="#185FA5" />
          <polygon points="40,27 54,35 54,45 40,53 26,45 26,35" fill="#3B82F6" />
        </svg>
      </div>
      <div class="d-none d-sm-block">
        <p class="text-subtitle-2 font-weight-medium text-white mb-0 lh-1">GeoÁrea</p>
        <p class="text-caption mb-0" style="color:#4B6CB7; line-height:1">Figuras geométricas</p>
      </div>
    </div>

    <!-- Divisor vertical -->
    <v-divider vertical class="mx-4 my-3 d-none d-md-flex" color="rgba(255,255,255,0.12)" />

    <!-- ── Sección activa ─────────────────────────── -->
    <div class="d-none d-md-flex align-center ga-2">
      <v-icon :icon="seccionActual.icono" color="blue-lighten-3" size="16" />
      <span class="text-body-2 font-weight-medium text-white">
        {{ seccionActual.label }}
      </span>
      <v-chip
        :color="seccionActual.chipColor"
        variant="tonal"
        size="x-small"
      >
        {{ seccionActual.chip }}
      </v-chip>
    </div>

    <v-spacer />

    <!-- ── Progreso ───────────────────────────────── -->
    <div class="d-none d-lg-flex align-center ga-2 mr-4">
      <span class="text-caption" style="color:#4B6CB7">Progreso</span>
      <v-progress-linear
        :model-value="progreso"
        color="blue-lighten-2"
        bg-color="rgba(255,255,255,0.1)"
        rounded
        height="5"
        style="width:90px"
      />
      <span class="text-caption font-weight-medium text-blue-lighten-2">
        {{ progreso }}%
      </span>
    </div>

    <!-- Avatar -->
    <v-avatar
      color="blue-darken-3"
      size="32"
      class="mr-3 cursor-pointer"
    >
      <v-icon size="16" color="white">mdi-account</v-icon>
    </v-avatar>

  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

const emit = defineEmits(['toggle-drawer'])

const { mdAndUp } = useDisplay()
const route = useRoute()

const menu = [
  { label: 'Contenido',   ruta: '/dashboard/contenido',   icono: 'mdi-book-open-variant', chip: 'Teoría',      chipColor: 'blue'   },
  { label: 'Actividades', ruta: '/dashboard/actividades', icono: 'mdi-lightning-bolt',    chip: 'Práctica',    chipColor: 'green'  },
  { label: 'Evaluación',  ruta: '/dashboard/evaluacion',  icono: 'mdi-clipboard-check',   chip: 'Evaluación',  chipColor: 'orange' },
  { label: 'Recursos',    ruta: '/dashboard/recursos',    icono: 'mdi-link-variant',       chip: 'Referencias', chipColor: 'purple' },
  { label: 'Créditos',    ruta: '/dashboard/creditos',    icono: 'mdi-account-group',      chip: 'Equipo',      chipColor: 'pink'   },
]

const seccionActual = computed(() => {
  return menu.find(m => route.path.startsWith(m.ruta))
    ?? { label: 'Dashboard', icono: 'mdi-view-dashboard', chip: 'Inicio', chipColor: 'blue' }
})

const progreso = computed(() => {
  const item = menu.find(m => route.path.startsWith(m.ruta))
  return item ? Math.round((menu.indexOf(item) + 1) / menu.length * 100) : 0
})
</script>

<style scoped>
.logo-hex {
  animation: girar 14s linear infinite;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
@keyframes girar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>