<template>
  <div class="actividades-page">

    <div class="page-banner">
      <div class="page-banner__inner">
        <h1 class="page-titulo">Actividades</h1>
        <p class="page-desc">Une cada figura geométrica con su fórmula de área arrastrando las tarjetas.</p>
      </div>
      <div class="banner-stats">
        <div class="stat">
          <span class="stat-num">{{ correctas }}</span>
          <span class="stat-label">Correctas</span>
        </div>
        <div class="stat">
          <span class="stat-num">{{ intentos }}</span>
          <span class="stat-label">Intentos</span>
        </div>
      </div>
    </div>

    <!-- Completado -->
    <div v-if="completado" class="completado-banner">
      <span class="completado-icon">🎉</span>
      <div>
        <p class="completado-titulo">¡Excelente! Completaste la actividad</p>
        <p class="completado-sub">Uniste correctamente las {{ pares.length }} figuras con sus fórmulas en {{ intentos }} intentos.</p>
      </div>
      <button class="btn-reiniciar" @click="reiniciar">Intentar de nuevo</button>
    </div>

    <div v-else class="actividad-contenedor">

      <!-- Columna figuras -->
      <div class="columna">
        <h2 class="columna-titulo">Figuras</h2>
        <div class="columna-items">
          <div
            v-for="figura in figurasRestantes"
            :key="figura.id"
            class="drag-item drag-item--figura"
            :style="{ borderColor: figura.color, background: figura.bg }"
            draggable="true"
            @dragstart="onDragStart(figura)"
          >
            <component :is="figura.svg" />
            <span class="drag-item__label" :style="{ color: figura.color }">{{ figura.nombre }}</span>
          </div>
          <!-- Espacios vacíos para figuras ya unidas -->
          <div
            v-for="figura in figurasUnidas"
            :key="'unida-' + figura.id"
            class="drag-item drag-item--unida"
          >
            <span class="check-icon">✓</span>
            <span class="drag-item__label">{{ figura.nombre }}</span>
          </div>
        </div>
      </div>

      <!-- Columna fórmulas -->
      <div class="columna">
        <h2 class="columna-titulo">Fórmulas</h2>
        <div class="columna-items">
          <div
            v-for="formula in formulasMezcladas"
            :key="formula.id"
            class="drop-zone"
            :class="{
              'drop-zone--correcto': formula.estado === 'correcto',
              'drop-zone--incorrecto': formula.estado === 'incorrecto',
              'drop-zone--hover': formula.hover,
            }"
            @dragover.prevent="formula.hover = true"
            @dragleave="formula.hover = false"
            @drop="onDrop(formula)"
          >
            <span class="formula-texto">{{ formula.texto }}</span>
            <span v-if="formula.estado === 'correcto'" class="estado-icon">✓</span>
            <span v-if="formula.estado === 'incorrecto'" class="estado-icon estado-icon--mal">✗</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Panel de solución paso a paso -->
    <div v-if="mostrarSolucion" class="solucion-panel">
      <div class="solucion-header">
        <h3 class="solucion-titulo">📖 Solución paso a paso — {{ solucionFigura?.nombre }}</h3>
        <button class="btn-cerrar" @click="mostrarSolucion = false">✕</button>
      </div>
      <div class="solucion-pasos">
        <div v-for="(paso, i) in solucionFigura?.pasos" :key="i" class="paso">
          <div class="paso-num" :style="{ background: solucionFigura?.color }">{{ i + 1 }}</div>
          <p class="paso-texto">{{ paso }}</p>
        </div>
      </div>
      <div class="solucion-formula" :style="{ borderColor: solucionFigura?.color, background: solucionFigura?.bg }">
        <span class="formula-label">La fórmula correcta es:</span>
        <span class="formula-grande" :style="{ color: solucionFigura?.color }">{{ solucionFigura?.formula }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'

const mkSvg = (nodos) =>
  defineComponent({ render: () => h('svg', { width: 56, height: 56, viewBox: '0 0 80 80' }, nodos) })

const pares = [
  {
    id: 'cuadrado', nombre: 'Cuadrado',
    color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',
    formula: 'A = l²',
    svg: mkSvg([h('rect', { x: 10, y: 10, width: 60, height: 60, rx: 4, fill: 'rgba(59,130,246,0.2)', stroke: '#3B82F6', 'stroke-width': 2 })]),
    pasos: [
      'El cuadrado tiene todos sus lados iguales, cada uno de longitud l.',
      'Para calcular su área, multiplicamos el lado por sí mismo.',
      'A = l × l = l²',
      'Ejemplo: si l = 4 cm → A = 4² = 16 cm²',
    ],
  },
  {
    id: 'rectangulo', nombre: 'Rectángulo',
    color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',
    formula: 'A = b × h',
    svg: mkSvg([h('rect', { x: 6, y: 20, width: 68, height: 40, rx: 4, fill: 'rgba(139,92,246,0.2)', stroke: '#8B5CF6', 'stroke-width': 2 })]),
    pasos: [
      'El rectángulo tiene una base (b) y una altura (h).',
      'Para calcular el área, multiplicamos la base por la altura.',
      'A = b × h',
      'Ejemplo: si b = 8 cm y h = 3 cm → A = 8 × 3 = 24 cm²',
    ],
  },
  {
    id: 'triangulo', nombre: 'Triángulo',
    color: '#16a34a', bg: 'rgba(34,197,94,0.08)',
    formula: 'A = (b × h) / 2',
    svg: mkSvg([h('polygon', { points: '40,8 74,72 6,72', fill: 'rgba(34,197,94,0.2)', stroke: '#22C55E', 'stroke-width': 2 })]),
    pasos: [
      'El triángulo tiene una base (b) y una altura (h) perpendicular a ella.',
      'Su área es la mitad del rectángulo que lo contiene.',
      'A = (b × h) / 2',
      'Ejemplo: si b = 10 cm y h = 6 cm → A = (10 × 6) / 2 = 30 cm²',
    ],
  },
  {
    id: 'circulo', nombre: 'Círculo',
    color: '#F97316', bg: 'rgba(251,146,60,0.08)',
    formula: 'A = π × r²',
    svg: mkSvg([
      h('circle', { cx: 40, cy: 40, r: 32, fill: 'rgba(251,146,60,0.2)', stroke: '#F97316', 'stroke-width': 2 }),
      h('circle', { cx: 40, cy: 40, r: 2.5, fill: '#F97316' }),
    ]),
    pasos: [
      'El círculo tiene un radio (r) que va del centro al borde.',
      'Usamos el número π (pi) que vale aproximadamente 3.1416.',
      'A = π × r²',
      'Ejemplo: si r = 5 cm → A = 3.1416 × 5² = 3.1416 × 25 ≈ 78.54 cm²',
    ],
  },
  {
    id: 'trapecio', nombre: 'Trapecio',
    color: '#EC4899', bg: 'rgba(236,72,153,0.08)',
    formula: 'A = (B + b) × h / 2',
    svg: mkSvg([h('polygon', { points: '20,16 60,16 74,64 6,64', fill: 'rgba(236,72,153,0.2)', stroke: '#EC4899', 'stroke-width': 2 })]),
    pasos: [
      'El trapecio tiene dos bases paralelas: la mayor (B) y la menor (b), y una altura (h).',
      'Primero sumamos las dos bases: B + b.',
      'Luego multiplicamos por la altura y dividimos entre 2.',
      'Ejemplo: B = 10, b = 6, h = 4 → A = (10 + 6) × 4 / 2 = 32 cm²',
    ],
  },
  {
    id: 'rombo', nombre: 'Rombo',
    color: '#EF4444', bg: 'rgba(239,68,68,0.08)',
    formula: 'A = (d₁ × d₂) / 2',
    svg: mkSvg([
      h('polygon', { points: '40,6 74,40 40,74 6,40', fill: 'rgba(239,68,68,0.2)', stroke: '#EF4444', 'stroke-width': 2 }),
      h('line', { x1: 6, y1: 40, x2: 74, y2: 40, stroke: '#EF4444', 'stroke-width': 1, 'stroke-dasharray': 3 }),
      h('line', { x1: 40, y1: 6, x2: 40, y2: 74, stroke: '#EF4444', 'stroke-width': 1, 'stroke-dasharray': 3 }),
    ]),
    pasos: [
      'El rombo tiene dos diagonales: la mayor (d₁) y la menor (d₂).',
      'Multiplicamos las dos diagonales entre sí.',
      'Luego dividimos el resultado entre 2.',
      'Ejemplo: d₁ = 12 cm, d₂ = 8 cm → A = (12 × 8) / 2 = 48 cm²',
    ],
  },
]

// Estado
const arrastrado = ref(null)
const correctas = ref(0)
const intentos = ref(0)
const completado = ref(false)
const mostrarSolucion = ref(false)
const solucionFigura = ref(null)
const figurasUnidas = ref([])

const formulasMezcladas = ref(
  [...pares]
    .sort(() => Math.random() - 0.5)
    .map(p => ({ id: p.id, texto: p.formula, estado: null, hover: false }))
)

const figurasRestantes = computed(() =>
  pares.filter(p => !figurasUnidas.value.find(u => u.id === p.id))
)

const onDragStart = (figura) => {
  arrastrado.value = figura
}

const onDrop = (formula) => {
  formula.hover = false
  if (!arrastrado.value) return
  if (formula.estado === 'correcto') return

  intentos.value++

  if (arrastrado.value.id === formula.id) {
    formula.estado = 'correcto'
    correctas.value++
    figurasUnidas.value.push(arrastrado.value)
    if (figurasUnidas.value.length === pares.length) {
      completado.value = true
    }
  } else {
    formula.estado = 'incorrecto'
    // Mostrar solución paso a paso
    solucionFigura.value = pares.find(p => p.id === arrastrado.value.id)
    mostrarSolucion.value = true
    setTimeout(() => { formula.estado = null }, 1500)
  }

  arrastrado.value = null
}

const reiniciar = () => {
  correctas.value = 0
  intentos.value = 0
  completado.value = false
  mostrarSolucion.value = false
  figurasUnidas.value = []
  formulasMezcladas.value = [...pares]
    .sort(() => Math.random() - 0.5)
    .map(p => ({ id: p.id, texto: p.formula, estado: null, hover: false }))
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

.actividades-page {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ─── Banner ─────────────────────────────── */
.page-banner {
  background: linear-gradient(135deg, #0c1120 0%, #0d1f3c 50%, #0a1628 100%);
  border-radius: 14px;
  padding: 28px 32px;
  border: 0.5px solid rgba(255,255,255,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-titulo {
  font-size: 22px;
  font-weight: 700;
  color: #e8f0fe;
  margin: 0;
}

.page-desc {
  font-size: 13px;
  color: #4a6fa5;
  margin: 4px 0 0;
}

.banner-stats {
  display: flex;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #7eb8f7;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  color: #4a6fa5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ─── Completado ─────────────────────────── */
.completado-banner {
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.completado-icon { font-size: 36px; }

.completado-titulo {
  font-size: 16px;
  font-weight: 600;
  color: #16a34a;
  margin: 0;
}

.completado-sub {
  font-size: 13px;
  color: #334155;
  margin: 4px 0 0;
}

.btn-reiniciar {
  margin-left: auto;
  background: rgba(34,197,94,0.15);
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 500;
  color: #16a34a;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-reiniciar:hover { background: rgba(34,197,94,0.25); }

/* ─── Actividad ──────────────────────────── */
.actividad-contenedor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.columna {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.columna-titulo {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.columna-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ─── Drag items ─────────────────────────── */
.drag-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid;
  cursor: grab;
  transition: transform 0.15s, box-shadow 0.15s;
  background: #fff;
  user-select: none;
}

.drag-item:active { cursor: grabbing; transform: scale(1.02); }
.drag-item:hover  { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }

.drag-item--unida {
  border-color: rgba(34,197,94,0.3) !important;
  background: rgba(34,197,94,0.05) !important;
  cursor: default;
  opacity: 0.6;
}

.drag-item__label { font-size: 14px; font-weight: 500; }

.check-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #16a34a;
  flex-shrink: 0;
}

/* ─── Drop zones ─────────────────────────── */
.drop-zone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
  background: #f8fafc;
  min-height: 68px;
  transition: border-color 0.15s, background 0.15s;
  cursor: default;
}

.drop-zone--hover {
  border-color: #378ADD;
  background: rgba(56,138,221,0.06);
}

.drop-zone--correcto {
  border-color: #16a34a !important;
  background: rgba(34,197,94,0.08) !important;
  border-style: solid !important;
}

.drop-zone--incorrecto {
  border-color: #EF4444 !important;
  background: rgba(239,68,68,0.08) !important;
  border-style: solid !important;
}

.formula-texto {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.estado-icon {
  font-size: 20px;
  color: #16a34a;
  font-weight: 700;
}

.estado-icon--mal { color: #EF4444; }

/* ─── Solución ───────────────────────────── */
.solucion-panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.solucion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.solucion-titulo {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.btn-cerrar {
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cerrar:hover { background: #e2e8f0; }

.solucion-pasos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.paso {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.paso-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.paso-texto {
  font-size: 13px;
  color: #334155;
  margin: 0;
  line-height: 1.6;
  padding-top: 2px;
}

.solucion-formula {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid;
  border-radius: 10px;
  padding: 12px 18px;
}

.formula-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.formula-grande {
  font-size: 20px;
  font-weight: 700;
}

/* ─── Responsivo ─────────────────────────── */
@media (max-width: 768px) {
  .actividad-contenedor { grid-template-columns: 1fr; }
  .page-banner { flex-direction: column; gap: 16px; align-items: flex-start; }
}
</style>