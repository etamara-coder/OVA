<template>
  <div class="dashboard">

    <!-- Sidebar -->
    <aside class="sidebar">

      <!-- Logo y título -->
      <div class="sidebar__header">
        <div class="sidebar__logo">
          <svg width="36" height="36" viewBox="0 0 80 80">
            <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="#378ADD" />
            <polygon points="40,16 64,30 64,50 40,64 16,50 16,30" fill="#185FA5" />
            <polygon points="40,27 54,35 54,45 40,53 26,45 26,35" fill="#0C447C" />
          </svg>
        </div>
        <div>
          <p class="sidebar__nombre">GeoÁrea</p>
          <p class="sidebar__sub">Figuras geométricas</p>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="sidebar__nav">
        <NuxtLink
          v-for="item in menu"
          :key="item.ruta"
          :to="item.ruta"
          class="sidebar__item"
          active-class="sidebar__item--activo"
        >
          <span class="sidebar__icono">
            <component :is="item.icono" />
          </span>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer del sidebar -->
      <div class="sidebar__footer">
        <p>Universidad de Córdoba</p>
        <p>Informática · 2026</p>
      </div>

    </aside>

    <!-- Área de contenido -->
    <main class="contenido">
      <NuxtPage />
    </main>

  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue'

// Íconos SVG inline como componentes simples
const IconContenido = defineComponent({
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }, [
    h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3 }),
    h('path', { d: 'M8 12h8M8 8h8M8 16h5' })
  ])
})

const IconActividades = defineComponent({
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }, [
    h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
  ])
})

const IconEvaluacion = defineComponent({
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }, [
    h('path', { d: 'M9 11l3 3L22 4' }),
    h('path', { d: 'M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' })
  ])
})

const IconRecursos = defineComponent({
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }, [
    h('path', { d: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71' }),
    h('path', { d: 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' })
  ])
})

const IconCreditos = defineComponent({
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }, [
    h('path', { d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' }),
    h('circle', { cx: 9, cy: 7, r: 4 }),
    h('path', { d: 'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' })
  ])
})

const menu = [
  { label: 'Contenido',    ruta: '/dashboard/contenido',    icono: IconContenido },
  { label: 'Actividades',  ruta: '/dashboard/actividades',  icono: IconActividades },
  { label: 'Evaluación',   ruta: '/dashboard/evaluacion',   icono: IconEvaluacion },
  { label: 'Recursos',     ruta: '/dashboard/recursos',     icono: IconRecursos },
  { label: 'Créditos',     ruta: '/dashboard/creditos',     icono: IconCreditos },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

/* ─── Layout general ───────────────────────────────── */
.dashboard {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  min-height: 100vh;
  background-color: #f0f4fa;
}

/* ─── Sidebar ──────────────────────────────────────── */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 0.5px solid #dde3ef;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
}

.sidebar__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px 24px;
  border-bottom: 0.5px solid #eef1f8;
}

.sidebar__logo {
  animation: girar 14s linear infinite;
  flex-shrink: 0;
}

@keyframes girar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.sidebar__nombre {
  font-size: 16px;
  font-weight: 500;
  color: #0f1f3d;
  margin: 0;
  line-height: 1.2;
}

.sidebar__sub {
  font-size: 11px;
  color: #8899bb;
  margin: 0;
}

/* ─── Navegación ───────────────────────────────────── */
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px 12px;
  flex: 1;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #5a6e8a;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.sidebar__item:hover {
  background: #f0f4fa;
  color: #0f1f3d;
}

.sidebar__item--activo {
  background: #E6F1FB;
  color: #185FA5;
  font-weight: 500;
}

.sidebar__icono {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ─── Footer del sidebar ───────────────────────────── */
.sidebar__footer {
  padding: 16px 20px 0;
  border-top: 0.5px solid #eef1f8;
}

.sidebar__footer p {
  font-size: 10px;
  color: #aab4c8;
  margin: 0;
  line-height: 1.8;
}

/* ─── Área de contenido ────────────────────────────── */
.contenido {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

/* ─── Responsivo ───────────────────────────────────── */
@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    min-height: auto;
    padding: 16px 0;
  }
  .sidebar__nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 8px 12px;
  }
  .sidebar__item {
    flex-shrink: 0;
  }
  .sidebar__footer {
    display: none;
  }
  .contenido {
    padding: 16px;
  }
}
</style>