<template>
  <div class="geo-ova">

    <!-- ══════════════════════════════════════════════════════
         TOOLBAR
    ══════════════════════════════════════════════════════ -->
    <div class="geo-toolbar">
      <!-- Brand -->
      <div class="tb-brand">
        <div class="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="12,3 22,20 2,20" stroke="currentColor" stroke-width="1.8" fill="rgba(99,102,241,0.15)" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="brand-name">GeoInteractivo</span>
        <v-chip size="x-small" color="primary" variant="tonal" class="ml-2">OVA</v-chip>
      </div>

      <!-- Center controls -->
      <div class="tb-center">
        <!-- Undo / Clear -->
        <v-tooltip text="Deshacer último punto (Backspace)" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon size="small" variant="text" :disabled="currentPts.length === 0" @click="undoLastPt">
              <v-icon size="18">mdi-undo-variant</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Cancelar figura actual (Esc)" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon size="small" variant="text" :disabled="currentPts.length === 0" @click="cancelCurrent">
              <v-icon size="18">mdi-eraser</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <div class="tb-divider" />

        <!-- Zoom -->
        <v-tooltip text="Alejar" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon size="small" variant="text" :disabled="zoom <= MIN_ZOOM" @click="zoomOut">
              <v-icon size="18">mdi-magnify-minus-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <div class="zoom-badge">{{ Math.round(zoom * 100) }}%</div>
        <v-tooltip text="Acercar" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon size="small" variant="text" :disabled="zoom >= MAX_ZOOM" @click="zoomIn">
              <v-icon size="18">mdi-magnify-plus-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <div class="tb-divider" />

        <!-- Unit toggle -->
        <div class="unit-toggle-wrap">
          <span class="unit-label">Unidad:</span>
          <v-btn-toggle v-model="unit" mandatory color="primary" density="compact" variant="outlined" rounded="pill" class="unit-toggle">
            <v-btn value="cm" size="x-small" class="unit-btn">cm</v-btn>
            <v-btn value="m" size="x-small" class="unit-btn">m</v-btn>
          </v-btn-toggle>
        </div>
      </div>

      <!-- Right actions -->
      <div class="tb-right">
        <v-btn
          prepend-icon="mdi-plus-circle-outline"
          color="primary"
          size="small"
          variant="tonal"
          :disabled="currentPts.length < 3"
          @click="saveShape"
          class="save-btn"
        >
          Guardar figura
        </v-btn>
        <v-tooltip text="Borrar todo" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon size="small" color="error" variant="tonal"
              :disabled="shapes.length === 0 && currentPts.length === 0"
              @click="clearAll"
            >
              <v-icon size="18">mdi-delete-sweep-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         MAIN LAYOUT
    ══════════════════════════════════════════════════════ -->
    <div class="main-layout">

      <!-- ── Canvas Area ─────────────────────────────────── -->
      <div class="canvas-area" ref="canvasWrapper">
        <canvas
          ref="canvasEl"
          class="geo-canvas"
          :class="{ 'cursor-pointer': hoveringShape, 'cursor-crosshair': !hoveringShape }"
          @click="onCanvasClick"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
        />

        <!-- HUD: Instructions -->
        <div class="hud hud-bl">
          <div class="hud-pill">
            <v-icon size="13" class="mr-1">mdi-information-slab-circle-outline</v-icon>
            {{ hudMessage }}
          </div>
        </div>

        <!-- HUD: Coordinates -->
        <Transition name="fade-hud">
          <div class="hud hud-br" v-if="mouseCart">
            <div class="hud-pill font-mono">
              x: {{ fmtCoord(mouseCart.x) }} &nbsp;|&nbsp; y: {{ fmtCoord(mouseCart.y) }}&nbsp;{{ unit }}
            </div>
          </div>
        </Transition>

        <!-- HUD: Close-shape hint -->
        <Transition name="fade-hud">
          <div class="hud hud-tc" v-if="nearFirst && currentPts.length >= 3">
            <div class="hud-pill hud-success">
              <v-icon size="14" class="mr-1">mdi-check-circle</v-icon>
              Clic aquí para cerrar la figura · Enter
            </div>
          </div>
        </Transition>

        <!-- HUD: Shape count badge -->
        <div class="hud hud-tl" v-if="shapes.length > 0">
          <div class="hud-pill">
            <v-icon size="12" class="mr-1">mdi-vector-polygon</v-icon>
            {{ shapes.length }} figura{{ shapes.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- ── Info Panel ───────────────────────────────────── -->
      <div class="info-panel">
        <!-- ─── Active shape info ─── -->
        <template v-if="activeShape && activeDef">
          <div class="panel-header">
            <div class="shape-icon-wrap" :style="{ background: activeCol.bg }">
              <v-icon :color="activeCol.stroke" size="22">{{ activeDef.icon }}</v-icon>
            </div>
            <div class="panel-title-block">
              <div class="panel-shape-name">{{ activeDef.name }}</div>
              <div class="panel-shape-sub">
                {{ activeShape.sideLengths.length }} lados ·
                <span class="font-mono">{{ fmtVal(activeShape.area) }} {{ unit }}²</span>
              </div>
            </div>
            <v-btn icon size="x-small" variant="text" class="ml-auto" @click="selectedId = null">
              <v-icon size="16">mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Formula chips -->
          <div class="formula-chips">
            <div class="formula-chip primary-formula">{{ activeDef.areaFormula }}</div>
            <div class="formula-chip secondary-formula">{{ activeDef.perimFormula }}</div>
          </div>

          <!-- Tabs -->
          <v-tabs v-model="infoTab" color="primary" density="compact" class="info-tabs">
            <v-tab value="calc" class="tab-item">
              <v-icon start size="13">mdi-calculator-variant-outline</v-icon>
              Calc.
            </v-tab>
            <v-tab value="props" class="tab-item">
              <v-icon start size="13">mdi-format-list-bulleted-square</v-icon>
              Info
            </v-tab>
            <v-tab value="example" class="tab-item">
              <v-icon start size="13">mdi-book-open-variant-outline</v-icon>
              Ejemplo
            </v-tab>
          </v-tabs>
          <div class="tab-divider" />

          <div class="panel-body">
            <v-window v-model="infoTab">

              <!-- ── CALCULATOR TAB ── -->
              <v-window-item value="calc">
                <div class="tab-content">
                  <!-- Side lengths -->
                  <div class="section-title">
                    <v-icon size="13" class="mr-1">mdi-ruler</v-icon>
                    Lados medidos
                  </div>
                  <div class="sides-grid">
                    <div
                      v-for="(len, i) in activeShape.sideLengths"
                      :key="i"
                      class="side-item"
                    >
                      <span class="side-name">{{ sideLabel(i, activeShape.sideLengths.length) }}</span>
                      <span class="side-val font-mono">{{ fmtVal(len) }} {{ unit }}</span>
                    </div>
                  </div>

                  <div class="result-divider" />

                  <!-- Area -->
                  <div class="result-card result-area">
                    <div class="result-meta">
                      <div class="result-label">
                        <v-icon size="14" color="primary" class="mr-1">mdi-border-outside</v-icon>
                        ÁREA
                      </div>
                      <div class="result-formula font-mono">{{ activeDef.areaFormula }}</div>
                    </div>
                    <div class="result-number">
                      <span class="result-val text-primary">{{ fmtVal(activeShape.area) }}</span>
                      <span class="result-unit">{{ unit }}²</span>
                    </div>
                  </div>

                  <!-- Perimeter -->
                  <div class="result-card result-perim">
                    <div class="result-meta">
                      <div class="result-label">
                        <v-icon size="14" color="secondary" class="mr-1">mdi-vector-polyline</v-icon>
                        PERÍMETRO
                      </div>
                      <div class="result-formula font-mono">{{ activeDef.perimFormula }}</div>
                    </div>
                    <div class="result-number">
                      <span class="result-val text-secondary">{{ fmtVal(activeShape.perimeter) }}</span>
                      <span class="result-unit">{{ unit }}</span>
                    </div>
                  </div>

                  <div class="result-divider" />

                  <!-- Vertex coords -->
                  <div class="section-title">
                    <v-icon size="13" class="mr-1">mdi-map-marker-multiple-outline</v-icon>
                    Coordenadas de vértices
                  </div>
                  <div class="coords-list">
                    <div v-for="(pt, i) in activeShape.points" :key="i" class="coord-row">
                      <div class="coord-letter">{{ String.fromCharCode(65 + i) }}</div>
                      <div class="coord-val font-mono">({{ fmtCoord(pt.x) }}, {{ fmtCoord(pt.y) }})</div>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <!-- ── PROPERTIES TAB ── -->
              <v-window-item value="props">
                <div class="tab-content">
                  <div class="section-title">
                    <v-icon size="13" class="mr-1">mdi-check-all</v-icon>
                    Propiedades
                  </div>
                  <div class="props-list">
                    <div v-for="(prop, i) in activeDef.properties" :key="i" class="prop-row">
                      <v-icon size="13" color="primary" class="mr-2 flex-shrink-0">mdi-check-decagram-outline</v-icon>
                      <span class="prop-text">{{ prop }}</span>
                    </div>
                  </div>

                  <div class="result-divider" />

                  <div class="section-title">
                    <v-icon size="13" class="mr-1">mdi-tag-multiple-outline</v-icon>
                    Tipos / Clasificación
                  </div>
                  <div class="types-list">
                    <div v-for="(tipo, i) in activeDef.types" :key="i" class="type-row">
                      <v-chip
                        size="x-small"
                        :color="i % 2 === 0 ? 'primary' : 'secondary'"
                        variant="tonal"
                        class="mr-2 flex-shrink-0"
                      >
                        {{ tipo.name }}
                      </v-chip>
                      <span class="type-desc">{{ tipo.desc }}</span>
                    </div>
                  </div>

                  <div class="result-divider" />

                  <div class="curiosity-card">
                    <div class="curiosity-label">
                      <v-icon size="14" color="amber-darken-2">mdi-lightbulb-on-outline</v-icon>
                      ¿Sabías que?
                    </div>
                    <p class="curiosity-text">{{ activeDef.curiosity }}</p>
                  </div>
                </div>
              </v-window-item>

              <!-- ── EXAMPLE TAB ── -->
              <v-window-item value="example">
                <div class="tab-content">
                  <div class="section-title mb-3">
                    <v-icon size="13" class="mr-1">mdi-pencil-ruler</v-icon>
                    Ejemplo resuelto
                    <v-chip size="x-small" class="ml-2" color="primary" variant="tonal">{{ unit }}</v-chip>
                  </div>
                  <div class="steps-list">
                    <div
                      v-for="(step, i) in activeDef.exampleSteps(unit)"
                      :key="i"
                      class="step-row"
                    >
                      <div class="step-num" :class="`step-num-${i}`">{{ i + 1 }}</div>
                      <div class="step-body">
                        <div class="step-title">{{ step.title }}</div>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <div class="step-content" v-html="step.content" />
                      </div>
                    </div>
                  </div>
                </div>
              </v-window-item>

            </v-window>
          </div>
        </template>

        <!-- ─── Empty / guide state ─── -->
        <template v-else>
          <div class="empty-panel">
            <div class="empty-icon">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <polygon points="28,8 50,46 6,46" stroke="#6366f1" stroke-width="2" fill="rgba(99,102,241,0.08)" stroke-linejoin="round"/>
                <polygon points="28,16 44,40 12,40" stroke="#6366f1" stroke-width="1" stroke-dasharray="3,2" fill="none" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="empty-title">Dibuja un polígono</h3>
            <p class="empty-desc">Haz clic en el plano cartesiano para colocar vértices y explorar geometría interactiva.</p>
            <div class="hint-list">
              <div class="hint-row">
                <div class="hint-icon"><v-icon size="15" color="primary">mdi-cursor-default-click-outline</v-icon></div>
                <span>Clic para agregar vértices</span>
              </div>
              <div class="hint-row">
                <div class="hint-icon"><v-icon size="15" color="success">mdi-check-circle-outline</v-icon></div>
                <span>Clic en el <strong>primer punto</strong> para cerrar</span>
              </div>
              <div class="hint-row">
                <div class="hint-icon"><v-icon size="15" color="info">mdi-cursor-pointer</v-icon></div>
                <span>Clic en una figura guardada para ver su info</span>
              </div>
              <div class="hint-row">
                <div class="hint-icon"><v-icon size="15" color="warning">mdi-keyboard-outline</v-icon></div>
                <span><strong>Enter</strong> cierra · <strong>Backspace</strong> deshace · <strong>Esc</strong> cancela</span>
              </div>
            </div>

            <!-- Keyboard shortcuts mini card -->
            <div class="shortcuts-card mt-4">
              <div class="shortcuts-title">Atajos de teclado</div>
              <div class="shortcut-row">
                <kbd>Enter</kbd><span>Cerrar figura</span>
              </div>
              <div class="shortcut-row">
                <kbd>Backspace</kbd><span>Deshacer vértice</span>
              </div>
              <div class="shortcut-row">
                <kbd>Esc</kbd><span>Cancelar figura</span>
              </div>
              <div class="shortcut-row">
                <kbd>+</kbd> / <kbd>-</kbd><span>Zoom in / out</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>

<!-- ================================================================
     SCRIPT
================================================================ -->
<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// ── Page meta ────────────────────────────────────────────────────────
definePageMeta({ layout: 'dashboard' })

// ── Constants ────────────────────────────────────────────────────────
const BASE_CELL  = 64      // pixels per 1 grid unit at zoom = 1
const CLOSE_DIST = 16      // pixels threshold to snap-close polygon
const MIN_ZOOM   = 0.4
const MAX_ZOOM   = 4.0
const ZOOM_STEP  = 0.2

/** Canvas color palette for shapes */
const PALETTE = [
  { bg: 'rgba(99,102,241,0.1)',  stroke: '#6366f1', dot: '#4f46e5',  fill: 'rgba(99,102,241,0.10)'  },
  { bg: 'rgba(20,184,166,0.1)',  stroke: '#14b8a6', dot: '#0d9488',  fill: 'rgba(20,184,166,0.10)'  },
  { bg: 'rgba(245,158,11,0.1)',  stroke: '#f59e0b', dot: '#d97706',  fill: 'rgba(245,158,11,0.10)'  },
  { bg: 'rgba(239,68,68,0.1)',   stroke: '#ef4444', dot: '#dc2626',  fill: 'rgba(239,68,68,0.10)'   },
  { bg: 'rgba(168,85,247,0.1)',  stroke: '#a855f7', dot: '#9333ea',  fill: 'rgba(168,85,247,0.10)'  },
  { bg: 'rgba(34,197,94,0.1)',   stroke: '#22c55e', dot: '#16a34a',  fill: 'rgba(34,197,94,0.10)'   },
]

// ── Shape definitions (educational content) ──────────────────────────
const DEFS = {
  triangle: {
    name: 'Triángulo', icon: 'mdi-triangle-outline', sideCount: 3,
    areaFormula: 'A = (b × h) / 2',
    perimFormula: 'P = a + b + c',
    properties: [
      'Suma de ángulos interiores = 180°',
      'Todo lado es menor que la suma de los otros dos',
      '3 vértices, 3 lados y 3 ángulos internos',
      'Es la figura más rígida estructuralmente',
    ],
    types: [
      { name: 'Equilátero',  desc: 'Tres lados iguales; ángulos de 60°' },
      { name: 'Isósceles',   desc: 'Exactamente dos lados iguales' },
      { name: 'Escaleno',    desc: 'Los tres lados son diferentes' },
      { name: 'Rectángulo',  desc: 'Tiene un ángulo interior de 90°' },
    ],
    curiosity: 'Las pirámides de Giza tienen cuatro caras triangulares. El triángulo es la única figura que no puede deformarse sin cambiar el largo de sus lados — por eso se usa en puentes, torres y armaduras.',
    exampleSteps: (u) => [
      { title: 'Datos',              content: `Base <strong>b = 6 ${u}</strong>, Altura <strong>h = 4 ${u}</strong>` },
      { title: 'Fórmula del área',   content: 'A = (b × h) / 2' },
      { title: 'Sustitución',        content: 'A = (6 × 4) / 2 = 24 / 2' },
      { title: 'Resultado',          content: `<strong class="result-hl">A = 12 ${u}²</strong>` },
    ],
  },
  square: {
    name: 'Cuadrado', icon: 'mdi-square-outline', sideCount: 4,
    areaFormula: 'A = l²',
    perimFormula: 'P = 4l',
    properties: [
      'Cuatro lados iguales de longitud l',
      'Cuatro ángulos rectos de 90°',
      'Diagonales iguales, perpendiculares y se bisecan',
      'Es a la vez rectángulo y rombo',
    ],
    types: [{ name: 'Regular', desc: 'Siempre es un polígono regular (único tipo)' }],
    curiosity: 'Un tablero de ajedrez tiene exactamente 64 cuadrados iguales. Los "cuadrados mágicos" son arreglos numéricos donde la suma de cada fila, columna y diagonal siempre es la misma — los chinos los conocían hace más de 3000 años.',
    exampleSteps: (u) => [
      { title: 'Datos',            content: `Lado <strong>l = 7 ${u}</strong>` },
      { title: 'Fórmula del área', content: 'A = l²' },
      { title: 'Sustitución',      content: 'A = 7² = 7 × 7 = 49' },
      { title: 'Resultado',        content: `<strong class="result-hl">A = 49 ${u}²</strong> &nbsp;·&nbsp; P = 4 × 7 = <strong>28 ${u}</strong>` },
    ],
  },
  rectangle: {
    name: 'Rectángulo', icon: 'mdi-rectangle-outline', sideCount: 4,
    areaFormula: 'A = b × h',
    perimFormula: 'P = 2(b + h)',
    properties: [
      'Lados opuestos iguales y paralelos',
      'Cuatro ángulos rectos de 90°',
      'Diagonales iguales que se bisecan mutuamente',
      'Todo cuadrado es rectángulo; no viceversa',
    ],
    types: [
      { name: 'Cuadrado', desc: 'Caso especial donde b = h' },
      { name: 'Oblongo',  desc: 'Caso general donde b ≠ h' },
    ],
    curiosity: 'El formato de papel A4 tiene proporción √2:1. Al doblar A4 a la mitad obtienes A5 con las mismas proporciones. Este principio (ISO 216) permite escalar documentos sin recortar márgenes.',
    exampleSteps: (u) => [
      { title: 'Datos',            content: `Base <strong>b = 8 ${u}</strong>, Altura <strong>h = 5 ${u}</strong>` },
      { title: 'Fórmula del área', content: 'A = b × h' },
      { title: 'Sustitución',      content: 'A = 8 × 5' },
      { title: 'Resultado',        content: `<strong class="result-hl">A = 40 ${u}²</strong> &nbsp;·&nbsp; P = 2(8+5) = <strong>26 ${u}</strong>` },
    ],
  },
  rhombus: {
    name: 'Rombo', icon: 'mdi-rhombus-outline', sideCount: 4,
    areaFormula: 'A = (D × d) / 2',
    perimFormula: 'P = 4l',
    properties: [
      'Cuatro lados iguales de longitud l',
      'Ángulos opuestos son iguales',
      'Las diagonales son perpendiculares entre sí',
      'Las diagonales se bisecan mutuamente',
    ],
    types: [
      { name: 'Cuadrado', desc: 'Caso especial con ángulos de 90°' },
      { name: 'General',  desc: 'Lados iguales, ángulos oblicuos' },
    ],
    curiosity: 'El símbolo ♦ en los naipes es un rombo. Las redes metálicas de cerco y las mallas de seguridad usan rombo porque es estable lateralmente y puede deformarse bajo tensión sin romperse.',
    exampleSteps: (u) => [
      { title: 'Datos',            content: `Diagonal mayor <strong>D = 10 ${u}</strong>, menor <strong>d = 6 ${u}</strong>` },
      { title: 'Fórmula del área', content: 'A = (D × d) / 2' },
      { title: 'Sustitución',      content: 'A = (10 × 6) / 2 = 60 / 2' },
      { title: 'Resultado',        content: `<strong class="result-hl">A = 30 ${u}²</strong>` },
    ],
  },
  parallelogram: {
    name: 'Paralelogramo', icon: 'mdi-rhombus-split-outline', sideCount: 4,
    areaFormula: 'A = b × h',
    perimFormula: 'P = 2(a + b)',
    properties: [
      'Lados opuestos paralelos e iguales (a y b)',
      'Ángulos opuestos son iguales',
      'Las diagonales se bisecan mutuamente',
      'Ángulos adyacentes son suplementarios (suman 180°)',
    ],
    types: [
      { name: 'Rectángulo', desc: 'Ángulos de 90°' },
      { name: 'Rombo',      desc: 'Todos los lados iguales' },
      { name: 'Cuadrado',   desc: 'Lados iguales + ángulos de 90°' },
    ],
    curiosity: 'La "Regla del Paralelogramo" en física describe cómo sumar dos fuerzas o vectores. Las tijeras articuladas, los pantógrafos y los mecanismos de cuatro barras se basan en este principio.',
    exampleSteps: (u) => [
      { title: 'Datos',            content: `Base <strong>b = 9 ${u}</strong>, Altura perpendicular <strong>h = 4 ${u}</strong>` },
      { title: 'Fórmula del área', content: 'A = b × h' },
      { title: 'Sustitución',      content: 'A = 9 × 4' },
      { title: 'Resultado',        content: `<strong class="result-hl">A = 36 ${u}²</strong> &nbsp;·&nbsp; P = 2(9+5) = <strong>28 ${u}</strong>` },
    ],
  },
  trapezoid: {
    name: 'Trapecio', icon: 'mdi-tray', sideCount: 4,
    areaFormula: 'A = ((B+b)/2) × h',
    perimFormula: 'P = a+b+c+d',
    properties: [
      'Exactamente un par de lados paralelos (las bases)',
      'Base mayor B siempre es más larga que base menor b',
      'Ángulos del mismo lado suman 180°',
      'Segmento medio = (B + b) / 2',
    ],
    types: [
      { name: 'Isósceles',   desc: 'Los lados no paralelos son iguales' },
      { name: 'Rectángulo',  desc: 'Un lado lateral es perpendicular a las bases' },
      { name: 'Escaleno',    desc: 'Todos los lados son diferentes' },
    ],
    curiosity: 'Las represas hidráulicas tienen sección transversal trapezoidal — ancha en la base, angosta arriba — para distribuir mejor la presión del agua. Los techos a dos aguas y las cajas de resonancia de instrumentos usan este principio.',
    exampleSteps: (u) => [
      { title: 'Datos',            content: `B = <strong>10 ${u}</strong>, b = <strong>6 ${u}</strong>, h = <strong>4 ${u}</strong>` },
      { title: 'Fórmula del área', content: 'A = ((B + b) / 2) × h' },
      { title: 'Sustitución',      content: 'A = ((10 + 6) / 2) × 4 = 8 × 4' },
      { title: 'Resultado',        content: `<strong class="result-hl">A = 32 ${u}²</strong>` },
    ],
  },
  pentagon: {
    name: 'Pentágono', icon: 'mdi-pentagon-outline', sideCount: 5,
    areaFormula: '≈ 1.720 × l² (regular)',
    perimFormula: 'P = 5l (regular)',
    properties: [
      '5 lados y 5 ángulos interiores',
      'Suma de ángulos interiores = 540°',
      'Ángulo interior en regular = 108°',
      '5 ejes de simetría si es regular',
    ],
    types: [
      { name: 'Regular',   desc: 'Todos los lados y ángulos son iguales' },
      { name: 'Irregular', desc: 'Lados o ángulos difieren entre sí' },
    ],
    curiosity: 'El Departamento de Defensa de EE.UU. lleva el nombre de su sede: el Pentágono, uno de los edificios de oficinas más grandes del mundo. La estrella de 5 puntas se forma uniendo los vértices alternos de un pentágono regular.',
    exampleSteps: (u) => [
      { title: 'Datos (regular)',   content: `Lado <strong>l = 5 ${u}</strong>` },
      { title: 'Área aproximada',   content: 'A ≈ (5/4) × l² × tan(54°) ≈ 1.720 × l²' },
      { title: 'Sustitución',       content: 'A ≈ 1.720 × 5² = 1.720 × 25 = 43.01' },
      { title: 'Resultado',         content: `<strong class="result-hl">A ≈ 43.01 ${u}²</strong> &nbsp;·&nbsp; P = 5×5 = <strong>25 ${u}</strong>` },
    ],
  },
  hexagon: {
    name: 'Hexágono', icon: 'mdi-hexagon-outline', sideCount: 6,
    areaFormula: '(3√3/2) × l²',
    perimFormula: 'P = 6l (regular)',
    properties: [
      '6 lados y 6 ángulos interiores',
      'Suma de ángulos interiores = 720°',
      'Ángulo interior en regular = 120°',
      'El hexágono regular tesela el plano sin huecos',
    ],
    types: [
      { name: 'Regular',   desc: 'Todos los lados y ángulos son iguales' },
      { name: 'Irregular', desc: 'Lados o ángulos difieren entre sí' },
    ],
    curiosity: '¡Las celdas de los panales de abeja son hexagonales! Karl von Frisch demostró que esta forma maximiza el almacenamiento usando la mínima cantidad de cera — la naturaleza encontró la solución óptima antes que los matemáticos.',
    exampleSteps: (u) => [
      { title: 'Datos (regular)',  content: `Lado <strong>l = 4 ${u}</strong>` },
      { title: 'Fórmula',         content: 'A = (3√3 / 2) × l² ≈ 2.598 × l²' },
      { title: 'Sustitución',     content: 'A ≈ 2.598 × 4² = 2.598 × 16 = 41.57' },
      { title: 'Resultado',       content: `<strong class="result-hl">A ≈ 41.57 ${u}²</strong> &nbsp;·&nbsp; P = 6×4 = <strong>24 ${u}</strong>` },
    ],
  },
  quadrilateral: {
    name: 'Cuadrilátero Irr.', icon: 'mdi-vector-square', sideCount: 4,
    areaFormula: 'Shoelace',
    perimFormula: 'P = a+b+c+d',
    properties: [
      '4 lados y 4 ángulos interiores',
      'Suma de ángulos interiores = 360°',
      'Sin pares de lados paralelos identificables',
    ],
    types: [
      { name: 'Convexo',  desc: 'Todos los ángulos < 180°' },
      { name: 'Cóncavo',  desc: 'Al menos un ángulo > 180°' },
    ],
    curiosity: 'Los cuadriláteros son la familia de polígonos más diversa. Cualquier forma cerrada de 4 lados rectos, sin importar cuán irregular, pertenece a esta familia.',
    exampleSteps: (u) => [
      { title: 'Método: Gauss (Shoelace)', content: 'Para cualquier polígono de n vértices' },
      { title: 'Fórmula',    content: 'A = ½ |Σᵢ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)|' },
      { title: 'Perímetro',  content: 'P = Σᵢ √((xᵢ₊₁−xᵢ)² + (yᵢ₊₁−yᵢ)²)' },
      { title: 'Ángulos',    content: 'Suma = (n − 2) × 180° = 360° para n=4' },
    ],
  },
  polygon: {
    name: 'Polígono', icon: 'mdi-vector-polygon', sideCount: null,
    areaFormula: 'Shoelace',
    perimFormula: 'P = Σ lados',
    properties: [
      'n lados = n ángulos = n vértices',
      'Suma de ángulos int. = (n − 2) × 180°',
      'Puede ser convexo o cóncavo',
    ],
    types: [
      { name: 'Convexo',  desc: 'Todos los ángulos interiores < 180°' },
      { name: 'Cóncavo',  desc: 'Al menos un ángulo interior > 180°' },
      { name: 'Regular',  desc: 'Lados y ángulos todos iguales' },
    ],
    curiosity: 'Arquímedes usó polígonos de 96 lados inscritos y circunscritos para demostrar que π se encuentra entre 3.1408 y 3.1429. Con más lados, cualquier polígono regular se aproxima a un círculo.',
    exampleSteps: (u) => [
      { title: 'Fórmula de Gauss', content: `Para n vértices (x₁,y₁) ... (xₙ,yₙ)` },
      { title: 'Área',             content: 'A = ½ |Σᵢ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)|' },
      { title: 'Perímetro',        content: 'P = Σᵢ √((xᵢ₊₁−xᵢ)² + (yᵢ₊₁−yᵢ)²)' },
      { title: 'Ángulos interiores', content: `Suma = (n − 2) × 180°` },
    ],
  },
}

// ── Reactive state ────────────────────────────────────────────────────
const canvasEl      = ref(null)
const canvasWrapper = ref(null)
const zoom          = ref(1)
const unit          = ref('cm')
const currentPts    = ref([])       // in-progress Cartesian points
const shapes        = ref([])
const selectedId    = ref(null)
const mouseCart     = ref(null)
const mouseCanvasPt = ref(null)
const nearFirst     = ref(false)
const hoveringShape = ref(false)
const infoTab       = ref('calc')

let ctx = null
let ro  = null
let idCounter = 0

// ── Geometry math ─────────────────────────────────────────────────────
const dist = (a, b) => Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)

function computeSides(pts) {
  return pts.map((p, i) => dist(p, pts[(i + 1) % pts.length]))
}

function shoelaceArea(pts) {
  let s = 0
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    s += pts[i].x * pts[j].y - pts[j].x * pts[i].y
  }
  return Math.abs(s) / 2
}

function centroid(pts) {
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
    y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
  }
}

function pointInPoly(pt, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y
    const xj = poly[j].x, yj = poly[j].y
    if (((yi > pt.y) !== (yj > pt.y)) && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi)
      inside = !inside
  }
  return inside
}

function angleAtVertex(a, b, c) {
  const v1 = { x: a.x - b.x, y: a.y - b.y }
  const v2 = { x: c.x - b.x, y: c.y - b.y }
  const d = v1.x * v2.x + v1.y * v2.y
  const m = Math.sqrt(v1.x ** 2 + v1.y ** 2) * Math.sqrt(v2.x ** 2 + v2.y ** 2)
  if (m < 1e-10) return 0
  return Math.acos(Math.max(-1, Math.min(1, d / m))) * (180 / Math.PI)
}

function isParallel(v1, v2) {
  const cross = Math.abs(v1.x * v2.y - v1.y * v2.x)
  const m = Math.sqrt(v1.x ** 2 + v1.y ** 2) * Math.sqrt(v2.x ** 2 + v2.y ** 2)
  return m > 1e-10 && cross / m < 0.13
}

function classifyShape(pts) {
  const n = pts.length
  if (n === 3) return 'triangle'
  if (n === 4) return classifyQuad(pts)
  if (n === 5) return 'pentagon'
  if (n === 6) return 'hexagon'
  return 'polygon'
}

function classifyQuad(pts) {
  const sides  = computeSides(pts)
  const angles = pts.map((p, i) => angleAtVertex(pts[(i + 3) % 4], p, pts[(i + 1) % 4]))
  const sEq = (a, b) => Math.abs(a - b) / Math.max(a, b, 1e-6) < 0.13

  const allSidesEq = sEq(sides[0], sides[1]) && sEq(sides[1], sides[2]) && sEq(sides[2], sides[3])
  const oppSidesEq = sEq(sides[0], sides[2]) && sEq(sides[1], sides[3])
  const allRight   = angles.every(a => Math.abs(a - 90) < 10)
  const vecs       = pts.map((p, i) => { const q = pts[(i+1)%4]; return { x: q.x-p.x, y: q.y-p.y } })
  const p02        = isParallel(vecs[0], vecs[2])
  const p13        = isParallel(vecs[1], vecs[3])

  if (allSidesEq && allRight)   return 'square'
  if (allRight && oppSidesEq)   return 'rectangle'
  if (allSidesEq && p02 && p13) return 'rhombus'
  if (p02 && p13)               return 'parallelogram'
  if (p02 || p13)               return 'trapezoid'
  return 'quadrilateral'
}

// ── Computed ──────────────────────────────────────────────────────────
const activeShape = computed(() => shapes.value.find(s => s.id === selectedId.value) ?? null)
const activeDef   = computed(() => activeShape.value ? DEFS[activeShape.value.type] ?? DEFS.polygon : null)
const activeCol   = computed(() => PALETTE[(activeShape.value?.colorIdx ?? 0) % PALETTE.length])

const hudMessage = computed(() => {
  if (currentPts.value.length === 0) return 'Clic para colocar el primer vértice en el plano'
  if (currentPts.value.length === 1) return '1 vértice — agrega al menos 2 más para cerrar'
  if (currentPts.value.length === 2) return '2 vértices — agrega al menos 1 más para cerrar'
  return `${currentPts.value.length} vértices — clic en el punto inicial ● para cerrar`
})

// ── Canvas helpers ────────────────────────────────────────────────────
function toCanvas(cartPt, scale, ox, oy) {
  return { x: ox + cartPt.x * scale, y: oy - cartPt.y * scale }
}
function toCart(cx, cy, scale, ox, oy) {
  return { x: (cx - ox) / scale, y: (oy - cy) / scale }
}
function snap(v) { return Math.round(v) }

// ── Main draw function ────────────────────────────────────────────────
function draw() {
  if (!ctx || !canvasEl.value) return
  const cv = canvasEl.value
  const W = cv.width, H = cv.height
  const scale = BASE_CELL * zoom.value
  const ox = W / 2, oy = H / 2

  ctx.clearRect(0, 0, W, H)

  // Background
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  drawGrid(W, H, ox, oy, scale)
  drawAxes(W, H, ox, oy, scale)

  shapes.value.forEach(sh => drawShape(sh, ox, oy, scale, sh.id === selectedId.value))
  drawInProgress(ox, oy, scale)
}

function drawGrid(W, H, ox, oy, scale) {
  let step = 1
  if (scale < 18)  step = 10
  else if (scale < 30) step = 5
  else if (scale < 52) step = 2

  ctx.save()
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 0.5

  const sX = Math.ceil(-ox / scale / step) * step
  const eX = Math.floor((W - ox) / scale / step) * step
  for (let cx = sX; cx <= eX; cx += step) {
    const px = ox + cx * scale
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke()
  }

  const sY = Math.ceil(-(H - oy) / scale / step) * step
  const eY = Math.floor(oy / scale / step) * step
  for (let cy = sY; cy <= eY; cy += step) {
    const py = oy - cy * scale
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke()
  }

  ctx.fillStyle = '#94a3b8'
  ctx.font = '10px "Courier New", monospace'

  ctx.textAlign = 'center'
  for (let cx = sX; cx <= eX; cx += step) {
    if (cx === 0) continue
    ctx.fillText(cx, ox + cx * scale, oy + 16)
  }

  ctx.textAlign = 'right'
  for (let cy = sY; cy <= eY; cy += step) {
    if (cy === 0) continue
    ctx.fillText(cy, ox - 6, oy - cy * scale + 4)
  }
  ctx.restore()
}

function drawAxes(W, H, ox, oy) {
  ctx.save()
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 1.5

  ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.beginPath(); ctx.moveTo(W-13, oy-5); ctx.lineTo(W, oy); ctx.lineTo(W-13, oy+5); ctx.fill()
  ctx.beginPath(); ctx.moveTo(ox-5, 13); ctx.lineTo(ox, 0); ctx.lineTo(ox+5, 13); ctx.fill()

  ctx.font = 'bold 11px sans-serif'
  ctx.fillStyle = '#475569'
  ctx.textAlign = 'left'
  ctx.fillText(`x (${unit.value})`, W - 36, oy - 9)
  ctx.textAlign = 'center'
  ctx.fillText(`y (${unit.value})`, ox + 20, 14)
  ctx.textAlign = 'right'
  ctx.font = '10px monospace'
  ctx.fillText('O', ox - 6, oy - 6)
  ctx.restore()
}

function drawShape(sh, ox, oy, scale, selected) {
  if (sh.points.length < 2) return
  const col = PALETTE[sh.colorIdx % PALETTE.length]

  ctx.save()

  // Polygon fill
  ctx.beginPath()
  sh.points.forEach((p, i) => {
    const { x, y } = toCanvas(p, scale, ox, oy)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = selected ? col.fill.replace('0.10', '0.20') : col.fill
  ctx.fill()
  ctx.strokeStyle = col.stroke
  ctx.lineWidth = selected ? 2.5 : 1.5
  ctx.stroke()

  // Vertices
  sh.points.forEach((p, i) => {
    const { x, y } = toCanvas(p, scale, ox, oy)
    ctx.beginPath()
    ctx.arc(x, y, selected ? 5 : 3.5, 0, Math.PI * 2)
    ctx.fillStyle = col.dot; ctx.fill()
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke()

    if (selected) {
      ctx.fillStyle = '#1e293b'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(255,255,255,0.9)'
      ctx.shadowBlur = 3
      ctx.fillText(String.fromCharCode(65 + i), x + 12, y - 9)
      ctx.shadowBlur = 0
    }
  })

  // Center label on selected
  if (selected) {
    const c = centroid(sh.points)
    const { x, y } = toCanvas(c, scale, ox, oy)
    const def = DEFS[sh.type] ?? DEFS.polygon
    ctx.font = 'bold 12px sans-serif'
    ctx.fillStyle = col.stroke
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(255,255,255,0.95)'
    ctx.shadowBlur = 5
    ctx.fillText(def.name, x, y + 5)
    ctx.shadowBlur = 0
  }

  ctx.restore()
}

function drawInProgress(ox, oy, scale) {
  const pts = currentPts.value
  if (pts.length === 0) return
  ctx.save()

  // Preview fill
  if (pts.length >= 3) {
    ctx.beginPath()
    pts.forEach((p, i) => {
      const { x, y } = toCanvas(p, scale, ox, oy)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.fillStyle = 'rgba(99,102,241,0.08)'
    ctx.fill()
  }

  // Dashed lines
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 3])
  ctx.beginPath()
  pts.forEach((p, i) => {
    const { x, y } = toCanvas(p, scale, ox, oy)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  if (mouseCanvasPt.value) ctx.lineTo(mouseCanvasPt.value.x, mouseCanvasPt.value.y)
  ctx.stroke()
  ctx.setLineDash([])

  // Points
  pts.forEach((p, i) => {
    const { x, y } = toCanvas(p, scale, ox, oy)
    const isFirst = i === 0
    ctx.beginPath()
    ctx.arc(x, y, isFirst ? 7 : 4, 0, Math.PI * 2)
    ctx.fillStyle = isFirst ? '#4f46e5' : '#6366f1'
    ctx.fill()
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()

    // Snap ring on first point
    if (isFirst && nearFirst.value && pts.length >= 3) {
      ctx.beginPath()
      ctx.arc(x, y, 13, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(34,197,94,0.7)'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  })
  ctx.restore()
}

// ── Event handlers ────────────────────────────────────────────────────
function canvasCoords(e) {
  const rect = canvasEl.value.getBoundingClientRect()
  return { cx: e.clientX - rect.left, cy: e.clientY - rect.top }
}

function onCanvasClick(e) {
  if (!canvasEl.value) return
  const { cx, cy } = canvasCoords(e)
  const scale = BASE_CELL * zoom.value
  const W = canvasEl.value.width, H = canvasEl.value.height
  const ox = W / 2, oy = H / 2
  const rawPt = toCart(cx, cy, scale, ox, oy)
  const cartPt = { x: snap(rawPt.x), y: snap(rawPt.y) }

  // 1. Check existing shapes (topmost first)
  for (let i = shapes.value.length - 1; i >= 0; i--) {
    if (pointInPoly(rawPt, shapes.value[i].points)) {
      selectedId.value = shapes.value[i].id
      infoTab.value = 'calc'
      draw()
      return
    }
  }

  // 2. Check close polygon
  if (currentPts.value.length >= 3) {
    const fp = currentPts.value[0]
    const { x: fpx, y: fpy } = toCanvas(fp, scale, ox, oy)
    if (Math.hypot(cx - fpx, cy - fpy) < CLOSE_DIST) {
      closeShape()
      return
    }
  }

  // 3. Deselect if starting fresh draw
  if (selectedId.value !== null && currentPts.value.length === 0) selectedId.value = null

  // 4. Add point
  currentPts.value.push(cartPt)
  draw()
}

function onMouseMove(e) {
  if (!canvasEl.value) return
  const { cx, cy } = canvasCoords(e)
  const scale = BASE_CELL * zoom.value
  const W = canvasEl.value.width, H = canvasEl.value.height
  const ox = W / 2, oy = H / 2
  const raw = toCart(cx, cy, scale, ox, oy)

  mouseCart.value     = { x: Math.round(raw.x * 10) / 10, y: Math.round(raw.y * 10) / 10 }
  mouseCanvasPt.value = { x: cx, y: cy }

  // Near first point?
  if (currentPts.value.length >= 3) {
    const fp = currentPts.value[0]
    const { x: fpx, y: fpy } = toCanvas(fp, scale, ox, oy)
    nearFirst.value = Math.hypot(cx - fpx, cy - fpy) < CLOSE_DIST
  } else {
    nearFirst.value = false
  }

  // Hovering any saved shape?
  hoveringShape.value = shapes.value.some(sh => pointInPoly(raw, sh.points))

  draw()
}

function onMouseLeave() {
  mouseCart.value     = null
  mouseCanvasPt.value = null
  nearFirst.value     = false
  hoveringShape.value = false
  draw()
}

// ── Shape actions ─────────────────────────────────────────────────────
function closeShape() {
  if (currentPts.value.length < 3) return
  const pts = [...currentPts.value]
  const type = classifyShape(pts)
  const sideLengths = computeSides(pts)
  const shape = {
    id: ++idCounter,
    points: pts,
    type,
    sideLengths,
    area: shoelaceArea(pts),
    perimeter: sideLengths.reduce((a, b) => a + b, 0),
    colorIdx: shapes.value.length,
  }
  shapes.value.push(shape)
  selectedId.value = shape.id
  currentPts.value = []
  nearFirst.value  = false
  infoTab.value    = 'calc'
  draw()
}

function saveShape()    { closeShape() }
function cancelCurrent(){ currentPts.value = []; nearFirst.value = false; draw() }
function undoLastPt()   { currentPts.value.pop(); draw() }
function clearAll()     { shapes.value = []; currentPts.value = []; selectedId.value = null; draw() }
function zoomIn()       { if (zoom.value < MAX_ZOOM) { zoom.value = Math.min(MAX_ZOOM, +(zoom.value + ZOOM_STEP).toFixed(2)); draw() } }
function zoomOut()      { if (zoom.value > MIN_ZOOM) { zoom.value = Math.max(MIN_ZOOM, +(zoom.value - ZOOM_STEP).toFixed(2)); draw() } }

// ── Formatting helpers ────────────────────────────────────────────────
function fmtVal(v) {
  if (v == null || isNaN(v)) return '—'
  if (Math.abs(v) < 0.005) return '0'
  if (Math.abs(v) >= 1000)  return Math.round(v).toString()
  return (Math.round(v * 100) / 100).toString()
}

function fmtCoord(v) {
  return (Math.round(v * 10) / 10).toString()
}

function sideLabel(i, n) {
  return `${String.fromCharCode(65 + i)}${String.fromCharCode(65 + (i + 1) % n)}`
}

// ── Canvas sizing ─────────────────────────────────────────────────────
function resizeCanvas() {
  if (!canvasEl.value || !canvasWrapper.value) return
  canvasEl.value.width  = canvasWrapper.value.clientWidth
  canvasEl.value.height = canvasWrapper.value.clientHeight
}

// ── Lifecycle ─────────────────────────────────────────────────────────
onMounted(async () => {
  await nextTick()
  ctx = canvasEl.value.getContext('2d')
  resizeCanvas()
  draw()

  ro = new ResizeObserver(() => { resizeCanvas(); draw() })
  ro.observe(canvasWrapper.value)

  const onKey = (e) => {
    if (e.key === 'Escape')                                { cancelCurrent() }
    if (e.key === 'Backspace' && currentPts.value.length)  { e.preventDefault(); undoLastPt() }
    if (e.key === 'Enter'     && currentPts.value.length >= 3) { closeShape() }
    if (e.key === '+' || e.key === '=')                    { zoomIn() }
    if (e.key === '-')                                     { zoomOut() }
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

onUnmounted(() => { if (ro) ro.disconnect() })
watch(unit, () => draw())
</script>

<!-- ================================================================
     STYLES
================================================================ -->
<style scoped>
/* ── Google Fonts (monospace + sans) ───────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');

/* ── Layout skeleton ───────────────────────────────────────────────── */
.geo-ova {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - 64px);
  font-family: 'DM Sans', sans-serif;
  background: #f1f5f9;
  overflow: hidden;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── Toolbar ───────────────────────────────────────────────────────── */
.geo-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 52px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  flex-shrink: 0;
  z-index: 10;
}

.tb-brand   { display: flex; align-items: center; flex-shrink: 0; }
.tb-center  { display: flex; align-items: center; gap: 4px; flex: 1; justify-content: center; }
.tb-right   { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.tb-divider { width: 1px; height: 22px; background: #e2e8f0; margin: 0 4px; }

.brand-icon {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px;
  background: rgba(99,102,241,0.08);
  border-radius: 8px;
  margin-right: 8px;
  color: #6366f1;
}

.brand-name {
  font-weight: 700;
  font-size: 15px;
  color: #1e293b;
  letter-spacing: -0.3px;
}

.zoom-badge {
  min-width: 48px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 2px 6px;
  font-family: 'JetBrains Mono', monospace;
}

.unit-toggle-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.unit-label { font-size: 12px; color: #64748b; font-weight: 500; }
.unit-btn   { min-width: 36px !important; font-size: 11px !important; font-weight: 600 !important; }

.save-btn { font-weight: 600 !important; letter-spacing: 0 !important; }

/* ── Canvas ────────────────────────────────────────────────────────── */
.canvas-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #f8fafc;
}

.geo-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.cursor-crosshair { cursor: crosshair; }
.cursor-pointer   { cursor: pointer; }

/* ── HUD overlays ──────────────────────────────────────────────────── */
.hud { position: absolute; pointer-events: none; }
.hud-bl { bottom: 14px; left: 14px; }
.hud-br { bottom: 14px; right: 14px; }
.hud-tc { top: 14px; left: 50%; transform: translateX(-50%); }
.hud-tl { top: 14px; left: 14px; }

.hud-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 11.5px;
  color: #475569;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  white-space: nowrap;
}

.hud-success {
  background: rgba(240,253,244,0.95);
  border-color: #86efac;
  color: #15803d;
}

.font-mono { font-family: 'JetBrains Mono', monospace !important; }

/* ── Info Panel ────────────────────────────────────────────────────── */
.info-panel {
  width: 340px;
  min-width: 300px;
  background: #fff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

/* ── Panel header (active shape) ───────────────────────────────────── */
.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 10px;
  background: #fff;
}

.shape-icon-wrap {
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.panel-shape-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.3px;
}

.panel-shape-sub {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 1px;
}

.formula-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px 12px;
}

.formula-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
}

.primary-formula   { background: rgba(99,102,241,0.08); color: #4f46e5; }
.secondary-formula { background: rgba(20,184,166,0.08); color: #0d9488; }

/* ── Tabs ──────────────────────────────────────────────────────────── */
.info-tabs  { flex-shrink: 0; border-bottom: none; }
.tab-item   { font-size: 12px !important; font-weight: 600 !important; letter-spacing: 0 !important; min-width: 0 !important; }
.tab-divider { height: 1px; background: #e2e8f0; }

.panel-body {
  flex: 1;
  overflow-y: auto;
}

/* ── Tab content ───────────────────────────────────────────────────── */
.tab-content {
  padding: 14px 16px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 8px;
}

/* ── Sides grid ────────────────────────────────────────────────────── */
.sides-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.side-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 10px;
}

.side-name { font-size: 11.5px; font-weight: 700; color: #475569; }
.side-val  { font-size: 11.5px; font-weight: 500; color: #1e293b; }

/* ── Result cards ──────────────────────────────────────────────────── */
.result-divider { height: 1px; background: #f1f5f9; margin: 12px 0; }

.result-card {
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
}

.result-area  { background: rgba(99,102,241,0.05);  border: 1px solid rgba(99,102,241,0.15); }
.result-perim { background: rgba(20,184,166,0.05);  border: 1px solid rgba(20,184,166,0.15); }

.result-meta   { display: flex; align-items: center; margin-bottom: 4px; }
.result-label  { display: flex; align-items: center; font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px; }
.result-formula{ font-size: 10.5px; color: #94a3b8; margin-left: auto; }

.result-number { display: flex; align-items: baseline; gap: 3px; }
.result-val    { font-size: 24px; font-weight: 700; font-family: 'JetBrains Mono', monospace; line-height: 1; }
.result-unit   { font-size: 12px; font-weight: 500; color: #64748b; }

/* ── Coordinates ───────────────────────────────────────────────────── */
.coords-list { display: flex; flex-direction: column; gap: 4px; }
.coord-row   { display: flex; align-items: center; gap: 10px; background: #f8fafc; border-radius: 6px; padding: 5px 10px; }
.coord-letter{ width: 18px; height: 18px; border-radius: 50%; background: #6366f1; color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.coord-val   { font-size: 12px; color: #1e293b; font-weight: 500; }

/* ── Properties tab ────────────────────────────────────────────────── */
.props-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 4px; }
.prop-row   { display: flex; align-items: flex-start; gap: 6px; }
.prop-text  { font-size: 13px; color: #374151; line-height: 1.45; }

.types-list { display: flex; flex-direction: column; gap: 7px; }
.type-row   { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
.type-desc  { font-size: 12px; color: #64748b; }

.curiosity-card   { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px; }
.curiosity-label  { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #92400e; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px; }
.curiosity-text   { font-size: 12.5px; color: #78350f; line-height: 1.55; margin: 0; }

/* ── Example steps ─────────────────────────────────────────────────── */
.steps-list { display: flex; flex-direction: column; gap: 2px; }

.step-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.step-num {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.step-body   { flex: 1; min-width: 0; }
.step-title  { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: #94a3b8; margin-bottom: 4px; }
.step-content { font-size: 13px; color: #1e293b; line-height: 1.5; }

/* Highlight in example steps */
:deep(.result-hl) {
  color: #4f46e5;
  background: rgba(99,102,241,0.08);
  padding: 1px 6px;
  border-radius: 4px;
}

/* ── Empty panel ───────────────────────────────────────────────────── */
.empty-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px;
  height: 100%;
  overflow-y: auto;
}

.empty-icon  { margin-bottom: 16px; opacity: 0.85; }
.empty-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 6px; }
.empty-desc  { font-size: 13px; color: #64748b; text-align: center; line-height: 1.55; margin: 0 0 20px; }

.hint-list { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.hint-row  { display: flex; align-items: flex-start; gap: 10px; font-size: 12.5px; color: #374151; line-height: 1.45; }
.hint-icon { flex-shrink: 0; margin-top: 1px; }

.shortcuts-card  { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }
.shortcuts-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 8px; }
.shortcut-row    { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-size: 12px; color: #475569; }
.shortcut-row:last-child { margin-bottom: 0; }

kbd {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-bottom-width: 2px;
  border-radius: 4px;
  padding: 1px 6px;
  color: #1e293b;
}

/* ── Transitions ───────────────────────────────────────────────────── */
.fade-hud-enter-active,
.fade-hud-leave-active { transition: opacity 0.2s ease; }
.fade-hud-enter-from,
.fade-hud-leave-to     { opacity: 0; }

/* ── Scrollbar ─────────────────────────────────────────────────────── */
.panel-body::-webkit-scrollbar,
.empty-panel::-webkit-scrollbar { width: 4px; }
.panel-body::-webkit-scrollbar-thumb,
.empty-panel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .main-layout   { flex-direction: column; }
  .canvas-area   { min-height: 55vh; }
  .info-panel    { width: 100%; min-width: unset; border-left: none; border-top: 1px solid #e2e8f0; max-height: 45vh; }
  .tb-center     { gap: 2px; }
  .unit-label    { display: none; }
  .brand-name    { display: none; }
}

@media (max-width: 480px) {
  .geo-toolbar { padding: 0 10px; gap: 6px; }
  .tb-right .save-btn :deep(.v-btn__prepend) { display: none; }
}
</style>