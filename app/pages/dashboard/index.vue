<template>
  <div class="dashboard">

    <!-- Overlay para móvil -->
    <div v-if="sidebarAbierto" class="overlay" @click="sidebarAbierto = false"></div>

    <!-- Botón flecha fijo en el borde del sidebar -->
    <button
      class="sidebar__toggle"
      @click="sidebarAbierto = !sidebarAbierto"
      :style="{ left: sidebarAbierto ? '206px' : '0px' }"
      :title="sidebarAbierto ? 'Ocultar menú' : 'Mostrar menú'"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline v-if="sidebarAbierto" points="15 18 9 12 15 6" />
        <polyline v-else points="9 18 15 12 9 6" />
      </svg>
    </button>

    <aside :class="['sidebar', { 'sidebar--abierto': sidebarAbierto }]">

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

      <nav class="sidebar__nav">
        <NuxtLink
          v-for="item in menu"
          :key="item.ruta"
          :to="item.ruta"
          class="sidebar__item"
          active-class="sidebar__item--activo"
          @click="sidebarAbierto = false"
        >
          <span class="sidebar__icono"><component :is="item.icono" /></span>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar__footer">
        <p>Universidad de Córdoba</p>
        <p>Informática · 2026</p>
      </div>
    </aside>

    <div class="dashboard__right">

      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar__left">

          <!-- Botón casa -->
          <NuxtLink to="/" class="btn-icon" title="Volver al inicio">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </NuxtLink>

          <div>
            <p class="topbar__titulo">{{ seccionActual }}</p>
            <p class="topbar__breadcrumb">GeoÁrea › {{ seccionActual }}</p>
          </div>
        </div>

        <div class="topbar__right">
          <div class="progreso-badge">
            <div class="progreso-bar">
              <div class="progreso-fill" :style="{ width: progreso + '%' }"></div>
            </div>
            <span>{{ progreso }}% completado</span>
          </div>
          <div class="avatar" :title="usuario.nombre || 'Estudiante'">
            {{ usuario.iniciales }}
          </div>
        </div>
      </header>

      <main class="contenido">
        <NuxtPage />
      </main>

    </div>
  </div>
</template>

<script setup>
import { defineComponent, h, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUsuarioStore } from '~/stores/usuario'

const usuario = useUsuarioStore()
const route = useRoute()
const sidebarAbierto = ref(true)

const secciones = {
  '/dashboard/contenido':   'Contenido',
  '/dashboard/actividades': 'Actividades',
  '/dashboard/evaluacion':  'Evaluación',
  '/dashboard/recursos':    'Recursos',
  '/dashboard/creditos':    'Créditos',
}

const seccionActual = computed(() => secciones[route.path] ?? 'Dashboard')

const progreso = computed(() => {
  const rutas = Object.keys(secciones)
  const idx = rutas.indexOf(route.path)
  if (idx < 0) return 0
  return Math.round(((idx + 1) / rutas.length) * 100)
})

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
  { label: 'Contenido',   ruta: '/dashboard/contenido',   icono: IconContenido },
  { label: 'Actividades', ruta: '/dashboard/actividades', icono: IconActividades },
  { label: 'Evaluación',  ruta: '/dashboard/evaluacion',  icono: IconEvaluacion },
  { label: 'Recursos',    ruta: '/dashboard/recursos',    icono: IconRecursos },
  { label: 'Créditos',    ruta: '/dashboard/creditos',    icono: IconCreditos },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

.dashboard {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c1120 0%, #0d1f3c 50%, #0a1628 100%);
  position: relative;
}

/* ─── Overlay móvil ──────────────────────── */
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
}

/* ─── Sidebar ────────────────────────────── */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: rgba(255,255,255,0.04);
  border-right: 0.5px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
  transition: width 0.25s ease, opacity 0.25s ease;
  overflow: visible;
  position: relative;
}

/* ─── Botón flecha borde sidebar ─────────── */
.sidebar__toggle {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1a3a5c;
  border: 1.5px solid rgba(56,138,221,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7eb8f7;
  cursor: pointer;
  z-index: 30;
  transition: left 0.25s ease, background 0.15s, color 0.15s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.35);
}
.sidebar__toggle:hover { background: rgba(56,138,221,0.4); color: #fff; }

.sidebar:not(.sidebar--abierto) {
  width: 0;
  opacity: 0;
  padding: 0;
  border: none;
}

/* Cuando está cerrado, el toggle flota sobre el contenido */
.sidebar:not(.sidebar--abierto) .sidebar__toggle {
  right: -28px;
  opacity: 1;
}
.sidebar__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px 24px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.07);
  white-space: nowrap;
}

.sidebar__logo { animation: girar 14s linear infinite; flex-shrink: 0; }

@keyframes girar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.sidebar__nombre { font-size: 16px; font-weight: 500; color: #e8f0fe; margin: 0; line-height: 1.2; }
.sidebar__sub    { font-size: 11px; color: #4a6fa5; margin: 0; }

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
  color: #6b8cbb;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.sidebar__item:hover       { background: rgba(255,255,255,0.07); color: #c8d8f0; }
.sidebar__item--activo     { background: rgba(56,138,221,0.2); color: #7eb8f7; font-weight: 500; }
.sidebar__icono            { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.sidebar__footer {
  padding: 16px 20px 0;
  border-top: 0.5px solid rgba(0, 0, 0, 0.07);
  white-space: nowrap;
}
.sidebar__footer p { font-size: 10px; color: #2d4a6e; margin: 0; line-height: 1.8; }

/* ─── Derecha ────────────────────────────── */
.dashboard__right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ─── Topbar ─────────────────────────────── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: rgba(255,255,255,0.03);
  border-bottom: 0.5px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}

.topbar__left  { display: flex; align-items: center; gap: 12px; }
.topbar__right { display: flex; align-items: center; gap: 10px; }

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  border: 0.5px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b8cbb;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.btn-icon:hover { background: rgba(56,138,221,0.15); color: #7eb8f7; }

.topbar__titulo     { font-size: 15px; font-weight: 500; color: #c8d8f0; margin: 0; line-height: 1.2; }
.topbar__breadcrumb { font-size: 11px; color: #2d4a6e; margin: 0; }

.progreso-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(56,138,221,0.1);
  border: 0.5px solid rgba(56,138,221,0.25);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 12px;
  color: #7eb8f7;
}

.progreso-bar  { width: 56px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
.progreso-fill { height: 100%; background: #378ADD; border-radius: 2px; transition: width 0.4s; }

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(56,138,221,0.2);
  border: 0.5px solid rgba(56,138,221,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #7eb8f7;
  cursor: default;
}

/* ─── Contenido ──────────────────────────── */
.contenido {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: #f0f4f8;
}

/* ─── Responsivo ─────────────────────────── */
@media (max-width: 768px) {
  .overlay { display: block; }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 20;
    width: 0;
    opacity: 0;
  }

  .sidebar--abierto {
    width: 220px;
    opacity: 1;
    padding: 24px 0;
  }

  .topbar__breadcrumb { display: none; }
  .progreso-badge span { display: none; }
  .contenido { padding: 16px; }
}
</style>