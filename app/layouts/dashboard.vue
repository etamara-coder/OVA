<template>
  <div class="dashboard">

    <!-- Overlay -->
    <div v-if="menuAbierto" class="overlay" @click="menuAbierto = false"></div>

    <!-- Panel lateral deslizable -->
    <Transition name="slide">
      <aside v-if="menuAbierto" class="panel">
        <div class="panel__header">
          <div class="panel__logo">
            <svg width="32" height="32" viewBox="0 0 80 80">
              <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="#378ADD" />
              <polygon points="40,16 64,30 64,50 40,64 16,50 16,30" fill="#185FA5" />
              <polygon points="40,27 54,35 54,45 40,53 26,45 26,35" fill="#0C447C" />
            </svg>
          </div>
          <div>
            <p class="panel__nombre">GeoÁrea</p>
            <p class="panel__sub">Figuras geométricas</p>
          </div>
          <button class="panel__cerrar" @click="menuAbierto = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav class="panel__nav">
          <p class="panel__nav-label">Secciones</p>
          <NuxtLink
            v-for="item in menu"
            :key="item.ruta"
            :to="item.ruta"
            class="panel__item"
            active-class="panel__item--activo"
            @click="menuAbierto = false"
          >
            <div class="panel__item-icono" :style="{ background: item.bgLight }">
              <span style="font-size: 18px">{{ item.emoji }}</span>
            </div>
            <div class="panel__item-info">
              <span class="panel__item-nombre">{{ item.label }}</span>
              <span class="panel__item-desc">{{ item.desc }}</span>
            </div>
            <span class="panel__item-flecha">→</span>
          </NuxtLink>
        </nav>

        <div class="panel__footer">
          <p>Universidad de Córdoba</p>
          <p>Informática · 2026</p>
        </div>
      </aside>
    </Transition>

    <div class="dashboard__right">

      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar__left">
          <button class="btn-icon" @click="menuAbierto = !menuAbierto" title="Menú">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="3" y1="6"  x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
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

      <!-- Contenido -->
      <main class="contenido">

        <!-- Home -->
        <div v-if="esDashboardHome" class="home">
          <div class="home__bienvenida">
            <h1 class="home__titulo">¡Hola, {{ usuario.nombre || 'estudiante' }}! 👋</h1>
            <p class="home__sub">Selecciona una sección para comenzar a aprender sobre figuras geométricas.</p>
          </div>

          <div class="secciones-grid">
            <NuxtLink
              v-for="s in secciones"
              :key="s.ruta"
              :to="s.ruta"
              class="seccion-card"
            >
              <div class="seccion-card__ilustracion" :style="{ background: s.gradiente }">
                <component :is="s.ilustracion" />
              </div>
              <div class="seccion-card__body">
                <span class="seccion-card__badge" :style="{ background: s.bgBadge, color: s.color }">{{ s.tipo }}</span>
                <h3 class="seccion-card__nombre">{{ s.nombre }}</h3>
                <p class="seccion-card__desc">{{ s.desc }}</p>
                <div class="seccion-card__footer" :style="{ color: s.color }">Ir a {{ s.nombre }} →</div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Páginas hijas -->
        <div v-else class="seccion-contenido">
          <slot />
        </div>

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
const menuAbierto = ref(false)

const esDashboardHome = computed(() => route.path === '/dashboard')

const nombresSeccion = {
  '/dashboard':             'Dashboard',
  '/dashboard/contenido':   'Contenido',
  '/dashboard/actividades': 'Actividades',
  '/dashboard/evaluacion':  'Evaluación',
  '/dashboard/recursos':    'Recursos',
  '/dashboard/creditos':    'Créditos',
}

const seccionActual = computed(() => nombresSeccion[route.path] ?? 'Dashboard')

const progreso = computed(() => {
  const rutas = Object.keys(nombresSeccion).filter(r => r !== '/dashboard')
  const idx = rutas.indexOf(route.path)
  if (idx < 0) return 0
  return Math.round(((idx + 1) / rutas.length) * 100)
})

const menu = [
  { label: 'Contenido',   ruta: '/dashboard/contenido',   emoji: '📐', desc: 'Fórmulas y propiedades',    bgLight: 'rgba(59,130,246,0.12)' },
  { label: 'Actividades', ruta: '/dashboard/actividades', emoji: '🎮', desc: 'Juegos interactivos',        bgLight: 'rgba(139,92,246,0.12)' },
  { label: 'Evaluación',  ruta: '/dashboard/evaluacion',  emoji: '📝', desc: 'Pon a prueba tu saber',      bgLight: 'rgba(249,115,22,0.12)' },
  { label: 'Recursos',    ruta: '/dashboard/recursos',    emoji: '📚', desc: 'Material de apoyo',          bgLight: 'rgba(34,197,94,0.12)'  },
  { label: 'Créditos',    ruta: '/dashboard/creditos',    emoji: '👥', desc: 'Equipo del proyecto',        bgLight: 'rgba(236,72,153,0.12)' },
]

const IlustracionContenido = defineComponent({
  render: () => h('svg', { width: 160, height: 120, viewBox: '0 0 160 120' }, [
    h('rect',    { x: 20, y: 30, width: 50, height: 50, rx: 4, fill: 'rgba(255,255,255,0.25)', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }),
    h('circle',  { cx: 118, cy: 55, r: 28, fill: 'rgba(255,255,255,0.2)', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }),
    h('polygon', { points: '75,95 100,50 125,95', fill: 'rgba(255,255,255,0.2)', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }),
    h('polygon', { points: '10,100 40,100 55,75 25,75', fill: 'rgba(255,255,255,0.15)', stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1.5 }),
  ])
})

const IlustracionActividades = defineComponent({
  render: () => h('svg', { width: 160, height: 120, viewBox: '0 0 160 120' }, [
    h('rect',    { x: 50, y: 25, width: 60, height: 60, rx: 10, fill: 'rgba(255,255,255,0.25)', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }),
    h('circle',  { cx: 70, cy: 45, r: 5, fill: 'rgba(255,255,255,0.8)' }),
    h('circle',  { cx: 90, cy: 45, r: 5, fill: 'rgba(255,255,255,0.8)' }),
    h('circle',  { cx: 70, cy: 65, r: 5, fill: 'rgba(255,255,255,0.8)' }),
    h('circle',  { cx: 90, cy: 65, r: 5, fill: 'rgba(255,255,255,0.8)' }),
    h('circle',  { cx: 80, cy: 55, r: 5, fill: 'rgba(255,255,255,0.8)' }),
    h('polygon', { points: '128,10 132,22 145,22 135,30 139,42 128,34 117,42 121,30 111,22 124,22', fill: 'rgba(255,255,255,0.5)' }),
  ])
})

const IlustracionEvaluacion = defineComponent({
  render: () => h('svg', { width: 160, height: 120, viewBox: '0 0 160 120' }, [
    h('rect',  { x: 40, y: 15, width: 80, height: 95, rx: 8, fill: 'rgba(255,255,255,0.2)', stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 2 }),
    h('line',  { x1: 55, y1: 38, x2: 105, y2: 38, stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 2, 'stroke-linecap': 'round' }),
    h('line',  { x1: 55, y1: 52, x2: 105, y2: 52, stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 2, 'stroke-linecap': 'round' }),
    h('line',  { x1: 55, y1: 66, x2: 85,  y2: 66, stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 2, 'stroke-linecap': 'round' }),
    h('path',  { d: 'M58 88 L70 100 L102 72', stroke: 'rgba(255,255,255,0.9)', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ])
})

const IlustracionRecursos = defineComponent({
  render: () => h('svg', { width: 160, height: 120, viewBox: '0 0 160 120' }, [
    h('rect',  { x: 20, y: 30, width: 45, height: 65, rx: 4, fill: 'rgba(255,255,255,0.3)', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }),
    h('line',  { x1: 32, y1: 30, x2: 32, y2: 95, stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 2 }),
    h('rect',  { x: 72, y: 20, width: 45, height: 75, rx: 4, fill: 'rgba(255,255,255,0.25)', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }),
    h('line',  { x1: 84, y1: 20, x2: 84, y2: 95, stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 2 }),
    h('rect',  { x: 124, y: 35, width: 20, height: 60, rx: 3, fill: 'rgba(255,255,255,0.2)', stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1.5 }),
  ])
})

const IlustracionCreditos = defineComponent({
  render: () => h('svg', { width: 160, height: 120, viewBox: '0 0 160 120' }, [
    h('circle', { cx: 80,  cy: 38, r: 18, fill: 'rgba(255,255,255,0.35)', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 2 }),
    h('path',   { d: 'M50 95 Q50 70 80 70 Q110 70 110 95', fill: 'rgba(255,255,255,0.25)', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }),
    h('circle', { cx: 32,  cy: 50, r: 13, fill: 'rgba(255,255,255,0.2)',  stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1.5 }),
    h('path',   { d: 'M12 100 Q12 80 32 80 Q52 80 52 100', fill: 'rgba(255,255,255,0.15)', stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 1.5 }),
    h('circle', { cx: 128, cy: 50, r: 13, fill: 'rgba(255,255,255,0.2)',  stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1.5 }),
    h('path',   { d: 'M108 100 Q108 80 128 80 Q148 80 148 100', fill: 'rgba(255,255,255,0.15)', stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 1.5 }),
  ])
})

const secciones = [
  { nombre: 'Contenido',   ruta: '/dashboard/contenido',   tipo: 'Teoría',      desc: 'Aprende las fórmulas y propiedades de las principales figuras geométricas.',   color: '#3B82F6', bgBadge: 'rgba(59,130,246,0.12)',  gradiente: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', ilustracion: IlustracionContenido },
  { nombre: 'Actividades', ruta: '/dashboard/actividades', tipo: 'Práctica',    desc: 'Pon a prueba tus conocimientos con juegos y actividades interactivas.',        color: '#8B5CF6', bgBadge: 'rgba(139,92,246,0.12)', gradiente: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', ilustracion: IlustracionActividades },
  { nombre: 'Evaluación',  ruta: '/dashboard/evaluacion',  tipo: 'Evaluación',  desc: 'Demuestra lo que aprendiste con una evaluación completa.',                     color: '#F97316', bgBadge: 'rgba(249,115,22,0.12)',  gradiente: 'linear-gradient(135deg, #C2410C, #F97316)', ilustracion: IlustracionEvaluacion },
  { nombre: 'Recursos',    ruta: '/dashboard/recursos',    tipo: 'Material',    desc: 'Encuentra videos, lecturas y material de apoyo para reforzar tu aprendizaje.', color: '#16a34a', bgBadge: 'rgba(34,197,94,0.12)',   gradiente: 'linear-gradient(135deg, #15803D, #22C55E)', ilustracion: IlustracionRecursos },
  { nombre: 'Créditos',    ruta: '/dashboard/creditos',    tipo: 'Información', desc: 'Conoce al equipo que desarrolló esta OVA.',                                    color: '#EC4899', bgBadge: 'rgba(236,72,153,0.12)', gradiente: 'linear-gradient(135deg, #BE185D, #EC4899)', ilustracion: IlustracionCreditos },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.dashboard {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c1120 0%, #0d1f3c 50%, #0a1628 100%);
  position: relative;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 20;
  backdrop-filter: blur(2px);
}

.panel {
  position: fixed;
  top: 0; left: 0;
  width: 280px;
  height: 100vh;
  background: #0d1f3c;
  border-right: 0.5px solid rgba(255,255,255,0.1);
  z-index: 30;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 0.5px solid rgba(255,255,255,0.07);
}

.panel__logo { animation: girar 14s linear infinite; flex-shrink: 0; }

@keyframes girar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.panel__nombre { font-size: 15px; font-weight: 600; color: #e8f0fe; margin: 0; line-height: 1.2; }
.panel__sub    { font-size: 11px; color: #4a6fa5; margin: 0; }

.panel__cerrar {
  margin-left: auto;
  width: 30px; height: 30px;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  border: 0.5px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  color: #6b8cbb;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.panel__cerrar:hover { background: rgba(255,255,255,0.12); color: #c8d8f0; }

.panel__nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.panel__nav-label {
  font-size: 10px;
  font-weight: 600;
  color: #2d4a6e;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 8px 4px;
}

.panel__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.15s;
  cursor: pointer;
}

.panel__item:hover { background: rgba(255,255,255,0.06); }
.panel__item--activo { background: rgba(56,138,221,0.15); }

.panel__item-icono {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.panel__item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.panel__item-nombre { font-size: 14px; font-weight: 500; color: #c8d8f0; }
.panel__item-desc   { font-size: 11px; color: #4a6fa5; }
.panel__item-flecha { font-size: 14px; color: #2d4a6e; }
.panel__item:hover .panel__item-flecha { color: #7eb8f7; }

.panel__footer {
  padding: 14px 16px;
  border-top: 0.5px solid rgba(255,255,255,0.07);
}
.panel__footer p { font-size: 10px; color: #2d4a6e; margin: 0; line-height: 1.8; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }

.dashboard__right { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 56px;
  background: rgba(255,255,255,0.03);
  border-bottom: 0.5px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}

.topbar__left  { display: flex; align-items: center; gap: 12px; }
.topbar__right { display: flex; align-items: center; gap: 10px; }

.btn-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  border: 0.5px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  color: #6b8cbb; text-decoration: none; cursor: pointer;
  transition: background 0.15s, color 0.15s; flex-shrink: 0;
}
.btn-icon:hover { background: rgba(56,138,221,0.15); color: #7eb8f7; }

.topbar__titulo     { font-size: 15px; font-weight: 500; color: #c8d8f0; margin: 0; line-height: 1.2; }
.topbar__breadcrumb { font-size: 11px; color: #2d4a6e; margin: 0; }

.progreso-badge {
  display: flex; align-items: center; gap: 8px;
  background: rgba(56,138,221,0.1);
  border: 0.5px solid rgba(56,138,221,0.25);
  border-radius: 20px; padding: 5px 12px;
  font-size: 12px; color: #7eb8f7;
}

.progreso-bar  { width: 56px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
.progreso-fill { height: 100%; background: #378ADD; border-radius: 2px; transition: width 0.4s; }

.avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(56,138,221,0.2);
  border: 0.5px solid rgba(56,138,221,0.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 500; color: #7eb8f7;
}

.contenido { flex: 1; overflow-y: auto; background: #e8edf5; }
.seccion-contenido { padding: 32px; }

.home { padding: 32px; display: flex; flex-direction: column; gap: 28px; }
.home__titulo { font-size: 24px; font-weight: 700; color: #0f1f3d; margin: 0 0 6px; }
.home__sub    { font-size: 14px; color: #5a6e8a; margin: 0; }

.secciones-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.seccion-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  display: flex; flex-direction: column;
  transition: box-shadow 0.2s, transform 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.seccion-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-3px); }

.seccion-card__ilustracion {
  height: 140px;
  display: flex; align-items: center; justify-content: center;
}

.seccion-card__body { padding: 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }

.seccion-card__badge {
  font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: 0.4px;
  width: fit-content;
}

.seccion-card__nombre { font-size: 17px; font-weight: 700; color: #0f1f3d; margin: 0; }
.seccion-card__desc   { font-size: 13px; color: #5a6e8a; margin: 0; line-height: 1.5; flex: 1; }
.seccion-card__footer { font-size: 13px; font-weight: 600; margin-top: 8px; }

@media (max-width: 1024px) { .secciones-grid { grid-template-columns: repeat(2, 1fr); } }

@media (max-width: 768px) {
  .secciones-grid { grid-template-columns: 1fr; }
  .home { padding: 16px; }
  .seccion-contenido { padding: 16px; }
  .topbar__breadcrumb { display: none; }
  .progreso-badge span { display: none; }
}
</style>