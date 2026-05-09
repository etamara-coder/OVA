<template>
  <v-navigation-drawer
    :rail="contraido"
    :permanent="mdAndUp"
    v-model="drawerMovil"
    width="230"
    rail-width="68"
    color="#ffffff"
    border="e"
    @mouseenter="contraido = false"
    @mouseleave="contraido = true"
  >

    <!-- ── Navegación ────────────────────────────── -->
    <v-list density="compact" nav class="mt-2 px-2">
      <v-list-item
        v-for="item in menu"
        :key="item.ruta"
        :to="item.ruta"
        :prepend-icon="item.icono"
        :title="item.label"
        rounded="lg"
        color="blue-darken-2"
        active-class="nav-activo"
        class="mb-1"
      >
        <!-- Chip de categoría (solo visible expandido) -->
        <template #append>
          <v-chip
            v-if="!contraido"
            :color="item.chipColor"
            variant="tonal"
            size="x-small"
            class="chip-fade"
          >
            {{ item.chip }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <!-- ── Footer ────────────────────────────────── -->
    <template #append>
      <v-divider />
      <v-expand-transition>
        <div v-if="!contraido" class="pa-3 text-center footer-fade">
          <p class="text-caption text-medium-emphasis mb-0">Universidad de Córdoba</p>
          <p class="text-caption text-medium-emphasis mb-0">Informática · 2026</p>
        </div>
      </v-expand-transition>
      <div v-if="contraido" class="pa-3 d-flex justify-center">
        <v-icon size="16" color="blue-grey-lighten-2">mdi-school</v-icon>
      </div>
    </template>

  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

// En desktop arranca contraído; en móvil lo controla el padre
const contraido    = ref(true)
const drawerMovil  = ref(false)

// Exponer un método para que el padre pueda abrir/cerrar el drawer en móvil
function toggleDrawer() {
  drawerMovil.value = !drawerMovil.value
}
defineExpose({ toggleDrawer })

const menu = [
  { label: 'Contenido',   ruta: '/dashboard/contenido',   icono: 'mdi-book-open-variant', chip: 'Teoría',      chipColor: 'blue'   },
  { label: 'Actividades', ruta: '/dashboard/actividades', icono: 'mdi-lightning-bolt',    chip: 'Práctica',    chipColor: 'green'  },
  { label: 'Evaluación',  ruta: '/dashboard/evaluacion',  icono: 'mdi-clipboard-check',   chip: 'Evaluación',  chipColor: 'orange' },
  { label: 'Recursos',    ruta: '/dashboard/recursos',    icono: 'mdi-link-variant',       chip: 'Referencias', chipColor: 'purple' },
  { label: 'Créditos',    ruta: '/dashboard/creditos',    icono: 'mdi-account-group',      chip: 'Equipo',      chipColor: 'pink'   },
]
</script>

<style scoped>
/* Logo giratorio */
.logo-hex {
  animation: girar 14s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
@keyframes girar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Ítem activo */
:deep(.nav-activo) {
  background: #E6F1FB !important;
  color: #185FA5 !important;
  font-weight: 500;
}
:deep(.nav-activo .v-icon) {
  color: #185FA5 !important;
}

/* Suavizar la transición del drawer al expandirse/contraerse */
:deep(.v-navigation-drawer__content) {
  transition: all 0.25s ease;
}

/* Fade de los chips al aparecer */
.chip-fade {
  animation: fadeIn 0.2s ease;
}
.footer-fade {
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>