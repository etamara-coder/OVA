<template>
  <div class="geo-ova">

    <!-- ══════════════════════════════════════════════════════
         TOOLBAR
    ══════════════════════════════════════════════════════ -->
    <div class="geo-toolbar">

      <!-- Brand -->
      <div class="tb-brand">
        <div class="brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <polygon points="12,3 22,20 2,20" stroke="currentColor" stroke-width="2"
              fill="rgba(99,102,241,0.2)" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="brand-name">GeoInteractivo</span>
        <v-chip size="x-small" color="primary" variant="tonal" class="ml-1 d-none d-md-flex">OVA</v-chip>
      </div>

      <!-- Drawing tools -->
      <div class="tb-tools">
        <v-btn-toggle
          v-model="tool"
          mandatory color="primary"
          density="compact" variant="outlined"
          rounded="lg"
          @update:model-value="cancelCurrent"
        >
          <v-tooltip text="Dibujar polígono" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" value="polygon" size="small">
                <v-icon size="16">mdi-vector-polygon</v-icon>
                <span class="d-none d-lg-inline ml-1">Polígono</span>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Dibujar círculo" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" value="circle" size="small">
                <v-icon size="16">mdi-circle-outline</v-icon>
                <span class="d-none d-lg-inline ml-1">Círculo</span>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Mover plano" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" value="pan" size="small">
                <v-icon size="16">mdi-hand-back-left-outline</v-icon>
                <span class="d-none d-lg-inline ml-1">Mover</span>
              </v-btn>
            </template>
          </v-tooltip>
        </v-btn-toggle>
      </div>

      <div class="tb-divider" />

      <!-- Undo / cancel -->
      <v-tooltip text="Deshacer vértice (Backspace)" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="small" variant="text"
            :disabled="currentPts.length === 0" @click="undoLastPt">
            <v-icon size="17">mdi-undo-variant</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip text="Cancelar figura (Esc)" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="small" variant="text"
            :disabled="!isDrawing" @click="cancelCurrent">
            <v-icon size="17">mdi-eraser</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <div class="tb-divider" />

      <!-- Zoom -->
      <v-tooltip text="Alejar" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="small" variant="text" :disabled="zoom<=MIN_ZOOM" @click="zoomOut">
            <v-icon size="17">mdi-magnify-minus-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <div class="zoom-badge font-mono">{{ Math.round(zoom*100) }}%</div>
      <v-tooltip text="Acercar" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="small" variant="text" :disabled="zoom>=MAX_ZOOM" @click="zoomIn">
            <v-icon size="17">mdi-magnify-plus-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip text="Centrar vista" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="small" variant="text" @click="resetView">
            <v-icon size="17">mdi-home-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <div class="tb-divider" />

      <!-- Unit -->
      <div class="unit-wrap">
        <span class="unit-label d-none d-sm-inline">Unidad:</span>
        <v-btn-toggle v-model="unit" mandatory color="primary"
          density="compact" variant="outlined" rounded="pill">
          <v-btn value="cm" size="x-small" class="unit-btn">cm</v-btn>
          <v-btn value="m"  size="x-small" class="unit-btn">m</v-btn>
        </v-btn-toggle>
      </div>

      <!-- Spacer -->
      <div style="flex:1" />

      <!-- Save -->
      <v-btn prepend-icon="mdi-plus-circle-outline" color="primary"
        size="small" variant="tonal" :disabled="!canSave" @click="saveShape"
        class="save-btn d-none d-sm-flex">
        Guardar
      </v-btn>
      <v-btn icon color="primary" size="small" variant="tonal"
        :disabled="!canSave" @click="saveShape" class="d-flex d-sm-none">
        <v-icon size="18">mdi-plus-circle-outline</v-icon>
      </v-btn>

    </div><!-- /toolbar -->

    <!-- ══════════════════════════════════════════════════════
         MAIN LAYOUT
    ══════════════════════════════════════════════════════ -->
    <div class="main-layout">

      <!-- ── Canvas ─────────────────────────────────────── -->
      <div class="canvas-area" ref="canvasWrapper">
        <canvas
          ref="canvasEl"
          :class="['geo-canvas', cursorClass]"
          @click="onCanvasClick"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
          @mouseup="onMouseUp"
          @wheel.prevent="onWheel"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
        />

        <!-- HUD badges -->
        <div class="hud hud-bl">
          <div class="hud-pill">
            <v-icon size="13" class="mr-1">mdi-information-slab-circle-outline</v-icon>
            {{ hudMsg }}
          </div>
        </div>

        <Transition name="fade-hud">
          <div class="hud hud-br d-none d-md-block" v-if="mouseCart">
            <div class="hud-pill font-mono">
              x:&nbsp;{{ fc(mouseCart.x) }}&nbsp;&nbsp;y:&nbsp;{{ fc(mouseCart.y) }}&nbsp;{{ unit }}
            </div>
          </div>
        </Transition>

        <Transition name="fade-hud">
          <div class="hud hud-tc" v-if="nearFirst && currentPts.length >= 3">
            <div class="hud-pill hud-green">
              <v-icon size="14" class="mr-1">mdi-check-circle</v-icon>
              Clic aquí para cerrar · Enter
            </div>
          </div>
        </Transition>

        <Transition name="fade-hud">
          <div class="hud hud-tc" v-if="tool==='circle' && circleCenter">
            <div class="hud-pill hud-teal">
              <v-icon size="14" class="mr-1">mdi-circle-outline</v-icon>
              Clic para fijar radio ({{ fv(previewR) }} {{ unit }})
            </div>
          </div>
        </Transition>

        <div class="hud hud-tl" v-if="shapes.length">
          <div class="hud-pill">
            <v-icon size="12" class="mr-1">mdi-layers-outline</v-icon>
            {{ shapes.length }} figura{{ shapes.length!==1?'s':'' }}
          </div>
        </div>
      </div>

      <!-- ── Info panel (desktop right / mobile bottom sheet) ─ -->
      <div class="info-panel" :class="{ 'panel-open': selectedId !== null }">

        <!-- Mobile handle -->
        <div class="drag-handle d-md-none" @click="selectedId=null">
          <div class="drag-bar" />
        </div>

        <!-- ─── Active shape ─── -->
        <template v-if="activeShape && activeDef">

          <!-- Header -->
          <div class="panel-header">
            <!-- Color dot / picker trigger -->
            <v-menu location="bottom start" :close-on-content-click="false">
              <template #activator="{ props }">
                <div v-bind="props" class="color-dot-btn" :style="{ background: activeCol.stroke }"
                  title="Cambiar color">
                  <v-icon size="11" color="white">mdi-eyedropper</v-icon>
                </div>
              </template>
              <!-- Color palette menu -->
              <v-card class="color-picker-card pa-3" elevation="8" rounded="xl">
                <div class="picker-title mb-2">Color de figura</div>
                <div class="color-grid">
                  <div
                    v-for="(col, idx) in PALETTE" :key="idx"
                    class="color-swatch"
                    :class="{ 'swatch-active': activeShape.colorIdx === idx }"
                    :style="{ background: col.stroke }"
                    @click="setShapeColor(idx)"
                  >
                    <v-icon v-if="activeShape.colorIdx===idx" size="14" color="white">mdi-check</v-icon>
                  </div>
                </div>
              </v-card>
            </v-menu>

            <div class="panel-title-block">
              <div class="panel-name">{{ activeDef.name }}</div>
              <div class="panel-sub font-mono">
                <template v-if="activeShape.shapeType==='circle'">
                  r={{ fv(activeShape.radius) }} {{ unit }} ·
                </template>
                <template v-else>
                  {{ activeShape.sideLengths.length }} lados ·
                </template>
                {{ fv(activeShape.area) }} {{ unit }}²
              </div>
            </div>

            <!-- Delete single -->
            <v-tooltip text="Eliminar figura (Del)" location="bottom">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon size="x-small" color="error" variant="tonal"
                  class="ml-auto" @click="deleteSelected">
                  <v-icon size="15">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-btn icon size="x-small" variant="text" class="ml-1" @click="selectedId=null">
              <v-icon size="15">mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Formula chips -->
          <div class="formula-row">
            <div class="chip-formula chip-a">{{ activeDef.areaFormula }}</div>
            <div class="chip-formula chip-p">{{ activeDef.perimFormula }}</div>
          </div>

          <!-- Tabs -->
          <v-tabs v-model="tab" color="primary" density="compact" class="info-tabs">
            <v-tab value="calc">
              <v-icon start size="13">mdi-calculator-variant-outline</v-icon>Calc.
            </v-tab>
            <v-tab value="props">
              <v-icon start size="13">mdi-format-list-bulleted-square</v-icon>Info
            </v-tab>
            <v-tab value="ex">
              <v-icon start size="13">mdi-book-open-variant-outline</v-icon>Ejemplo
            </v-tab>
          </v-tabs>
          <div class="tab-sep" />

          <div class="panel-body">
            <v-window v-model="tab">

              <!-- CALC TAB -->
              <v-window-item value="calc">
                <div class="tab-content">
                  <!-- Circle -->
                  <template v-if="activeShape.shapeType==='circle'">
                    <div class="sec-title"><v-icon size="13" class="mr-1">mdi-ruler</v-icon>Medidas</div>
                    <div class="sides-grid">
                      <div class="side-item">
                        <span class="side-name">Radio (r)</span>
                        <span class="side-val font-mono">{{ fv(activeShape.radius) }} {{ unit }}</span>
                      </div>
                      <div class="side-item">
                        <span class="side-name">Diámetro (d)</span>
                        <span class="side-val font-mono">{{ fv(activeShape.radius*2) }} {{ unit }}</span>
                      </div>
                    </div>
                    <div class="coord-row mt-2">
                      <div class="coord-dot" :style="{background: activeCol.stroke}">O</div>
                      <span class="coord-val font-mono">Centro ({{ fc(activeShape.center.x) }}, {{ fc(activeShape.center.y) }})</span>
                    </div>
                  </template>

                  <!-- Polygon -->
                  <template v-else>
                    <div class="sec-title"><v-icon size="13" class="mr-1">mdi-ruler</v-icon>Lados</div>
                    <div class="sides-grid">
                      <div v-for="(len,i) in activeShape.sideLengths" :key="i" class="side-item">
                        <span class="side-name">{{ sideLabel(i, activeShape.sideLengths.length) }}</span>
                        <span class="side-val font-mono">{{ fv(len) }} {{ unit }}</span>
                      </div>
                    </div>
                  </template>

                  <div class="sep" />

                  <!-- Area card -->
                  <div class="res-card" :style="{ borderColor: activeCol.stroke+'33', background: activeCol.stroke+'0d' }">
                    <div class="res-meta">
                      <div class="res-label" :style="{ color: activeCol.stroke }">
                        <v-icon size="13" class="mr-1" :color="activeCol.stroke">mdi-border-outside</v-icon>ÁREA
                      </div>
                      <div class="res-formula font-mono">{{ activeDef.areaFormula }}</div>
                    </div>
                    <div class="res-number">
                      <span class="res-val" :style="{ color: activeCol.stroke }">{{ fv(activeShape.area) }}</span>
                      <span class="res-unit">{{ unit }}²</span>
                    </div>
                  </div>

                  <!-- Perimeter card -->
                  <div class="res-card" style="border-color:rgba(20,184,166,0.25);background:rgba(20,184,166,0.06)">
                    <div class="res-meta">
                      <div class="res-label" style="color:#0d9488">
                        <v-icon size="13" class="mr-1" color="#0d9488">mdi-vector-polyline</v-icon>
                        {{ activeShape.shapeType==='circle'?'CIRCUNFERENCIA':'PERÍMETRO' }}
                      </div>
                      <div class="res-formula font-mono">{{ activeDef.perimFormula }}</div>
                    </div>
                    <div class="res-number">
                      <span class="res-val" style="color:#0d9488">{{ fv(activeShape.perimeter) }}</span>
                      <span class="res-unit">{{ unit }}</span>
                    </div>
                  </div>

                  <!-- Vertices (polygon only) -->
                  <template v-if="activeShape.shapeType!=='circle'">
                    <div class="sep" />
                    <div class="sec-title"><v-icon size="13" class="mr-1">mdi-map-marker-multiple-outline</v-icon>Vértices</div>
                    <div class="coords-list">
                      <div v-for="(pt,i) in activeShape.points" :key="i" class="coord-row">
                        <div class="coord-dot" :style="{ background: activeCol.stroke }">{{ String.fromCharCode(65+i) }}</div>
                        <span class="coord-val font-mono">({{ fc(pt.x) }}, {{ fc(pt.y) }})</span>
                      </div>
                    </div>
                  </template>
                </div>
              </v-window-item>

              <!-- PROPS TAB -->
              <v-window-item value="props">
                <div class="tab-content">
                  <div class="sec-title"><v-icon size="13" class="mr-1">mdi-check-all</v-icon>Propiedades</div>
                  <div class="props-list">
                    <div v-for="(p,i) in activeDef.properties" :key="i" class="prop-row">
                      <v-icon size="13" :color="activeCol.stroke" class="mr-2 mt-0-5 flex-shrink-0">mdi-check-decagram-outline</v-icon>
                      <span class="prop-text">{{ p }}</span>
                    </div>
                  </div>

                  <div class="sep" />
                  <div class="sec-title"><v-icon size="13" class="mr-1">mdi-tag-multiple-outline</v-icon>Tipos</div>
                  <div class="types-list">
                    <div v-for="(t,i) in activeDef.types" :key="i" class="type-row">
                      <v-chip size="x-small" :color="i%2===0?'primary':'secondary'" variant="tonal" class="flex-shrink-0">
                        {{ t.name }}
                      </v-chip>
                      <span class="type-desc">{{ t.desc }}</span>
                    </div>
                  </div>

                  <div class="sep" />
                  <div class="curiosity-card">
                    <div class="curiosity-title">
                      <v-icon size="14" color="amber-darken-2">mdi-lightbulb-on-outline</v-icon>
                      ¿Sabías que?
                    </div>
                    <p class="curiosity-text">{{ activeDef.curiosity }}</p>
                  </div>
                </div>
              </v-window-item>

              <!-- EXAMPLE TAB -->
              <v-window-item value="ex">
                <div class="tab-content">
                  <div class="sec-title mb-3">
                    <v-icon size="13" class="mr-1">mdi-pencil-ruler</v-icon>Ejemplo resuelto
                    <v-chip size="x-small" :color="activeCol.stroke" variant="tonal" class="ml-2">{{ unit }}</v-chip>
                  </div>
                  <div class="steps-list">
                    <div v-for="(s,i) in activeDef.exSteps(unit)" :key="i" class="step-row">
                      <div class="step-num" :style="{ background: activeCol.stroke }">{{ i+1 }}</div>
                      <div class="step-body">
                        <div class="step-title">{{ s.title }}</div>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <div class="step-content" v-html="s.content" />
                      </div>
                    </div>
                  </div>
                </div>
              </v-window-item>

            </v-window>
          </div>
        </template>

        <!-- ─── Empty state ─── -->
        <template v-else>
          <div class="empty-panel">
            <div class="empty-svg">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <polygon points="30,8 54,50 6,50" stroke="#6366f1" stroke-width="2"
                  fill="rgba(99,102,241,0.08)" stroke-linejoin="round"/>
                <circle cx="44" cy="20" r="9" stroke="#14b8a6" stroke-width="1.5"
                  fill="rgba(20,184,166,0.06)" stroke-dasharray="3,2"/>
              </svg>
            </div>
            <h3 class="empty-title">Dibuja en el plano</h3>
            <p class="empty-desc">Elige una herramienta y toca el plano para crear figuras.</p>

            <div class="hint-list">
              <div class="hint-row">
                <v-icon size="15" color="primary">mdi-vector-polygon</v-icon>
                <span><strong>Polígono:</strong> clic para vértices → clic en ● para cerrar</span>
              </div>
              <div class="hint-row">
                <v-icon size="15" color="teal">mdi-circle-outline</v-icon>
                <span><strong>Círculo:</strong> 1.º clic = centro · 2.º clic = radio</span>
              </div>
              <div class="hint-row">
                <v-icon size="15" color="orange">mdi-hand-back-left-outline</v-icon>
                <span><strong>Mover:</strong> arrastra el plano · pellizca en móvil</span>
              </div>
              <div class="hint-row">
                <v-icon size="15" color="error">mdi-delete-outline</v-icon>
                <span>Selecciona una figura → botón <strong>🗑</strong> para eliminarla</span>
              </div>
              <div class="hint-row">
                <v-icon size="15" color="purple">mdi-eyedropper</v-icon>
                <span>Selecciona una figura → <strong>punto de color</strong> para cambiarlo</span>
              </div>
              <div class="hint-row d-none d-md-flex">
                <v-icon size="15" color="grey">mdi-keyboard-outline</v-icon>
                <span><kbd>Enter</kbd> cerrar · <kbd>Backspace</kbd> deshacer · <kbd>Esc</kbd> cancelar · <kbd>Del</kbd> eliminar · scroll zoom</span>
              </div>
            </div>
          </div>
        </template>
      </div><!-- /info-panel -->

    </div><!-- /main-layout -->
  </div><!-- /geo-ova -->
</template>


<!-- ================================================================
     SCRIPT
================================================================ -->
<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

definePageMeta({ layout: 'dashboard' })

// ── Constants ──────────────────────────────────────────────────────────
const BASE_CELL  = 60
const CLOSE_DIST = 18
const MIN_ZOOM   = 0.2
const MAX_ZOOM   = 5.0
const ZOOM_STEP  = 0.2

const PALETTE = [
  { stroke:'#6366f1', fill:'rgba(99,102,241,0.12)'  },
  { stroke:'#14b8a6', fill:'rgba(20,184,166,0.12)'  },
  { stroke:'#f59e0b', fill:'rgba(245,158,11,0.12)'  },
  { stroke:'#ef4444', fill:'rgba(239,68,68,0.12)'   },
  { stroke:'#a855f7', fill:'rgba(168,85,247,0.12)'  },
  { stroke:'#22c55e', fill:'rgba(34,197,94,0.12)'   },
  { stroke:'#ec4899', fill:'rgba(236,72,153,0.12)'  },
  { stroke:'#fb923c', fill:'rgba(251,146,60,0.12)'  },
  { stroke:'#06b6d4', fill:'rgba(6,182,212,0.12)'   },
  { stroke:'#84cc16', fill:'rgba(132,204,22,0.12)'  },
  { stroke:'#f43f5e', fill:'rgba(244,63,94,0.12)'   },
  { stroke:'#8b5cf6', fill:'rgba(139,92,246,0.12)'  },
]

// ── Shape definitions ──────────────────────────────────────────────────
const DEFS = {
  circle: {
    name:'Círculo', icon:'mdi-circle-outline',
    areaFormula:'A = π·r²', perimFormula:'C = 2·π·r',
    properties:[
      'Todos los puntos equidistan del centro (radio r)',
      'El diámetro d = 2r es la cuerda más larga',
      'Posee infinitos ejes de simetría',
      'π ≈ 3.14159 es irracional y trascendente',
      'Circunferencia = borde; círculo = región interior',
    ],
    types:[
      {name:'Círculo',        desc:'Región plana delimitada por la circunferencia'},
      {name:'Circunferencia', desc:'Solo el contorno (puntos equidistantes del centro)'},
      {name:'Semicírculo',    desc:'Mitad dividida por un diámetro'},
      {name:'Sector circular',desc:'Porción acotada por dos radios y un arco'},
    ],
    curiosity:'Con solo 3.14159 podemos llegar a la Luna con un error de ¡0.3 mm! Hoy se conocen más de 100 billones de dígitos de π gracias a supercomputadoras.',
    exSteps:(u)=>[
      {title:'Datos',          content:`Radio <strong>r = 5 ${u}</strong>`},
      {title:'Fórmula área',   content:'A = π · r²'},
      {title:'Sustitución',    content:'A = 3.14159 × 5² = 3.14159 × 25'},
      {title:'Área',           content:`<strong class="hl">A ≈ 78.54 ${u}²</strong>`},
      {title:'Circunferencia', content:`C = 2π × 5 = 10π ≈ <strong class="hl">31.42 ${u}</strong>`},
    ],
  },
  triangle:{
    name:'Triángulo', icon:'mdi-triangle-outline',
    areaFormula:'A = (b·h)/2', perimFormula:'P = a+b+c',
    properties:[
      'Suma de ángulos interiores = 180°',
      'Todo lado < suma de los otros dos',
      '3 vértices, 3 lados, 3 ángulos',
      'Figura más rígida estructuralmente',
    ],
    types:[
      {name:'Equilátero',  desc:'Tres lados iguales; ángulos de 60°'},
      {name:'Isósceles',   desc:'Exactamente dos lados iguales'},
      {name:'Escaleno',    desc:'Los tres lados son diferentes'},
      {name:'Rectángulo',  desc:'Contiene un ángulo de 90°'},
    ],
    curiosity:'El triángulo es la única figura que no puede deformarse sin cambiar el largo de sus lados. Por eso se usa en puentes, torres y armaduras.',
    exSteps:(u)=>[
      {title:'Datos',          content:`b = <strong>6 ${u}</strong>, h = <strong>4 ${u}</strong>`},
      {title:'Fórmula',        content:'A = (b × h) / 2'},
      {title:'Sustitución',    content:'A = (6 × 4) / 2 = 12'},
      {title:'Resultado',      content:`<strong class="hl">A = 12 ${u}²</strong>`},
    ],
  },
  square:{
    name:'Cuadrado', icon:'mdi-square-outline',
    areaFormula:'A = l²', perimFormula:'P = 4l',
    properties:[
      'Cuatro lados iguales de longitud l',
      'Cuatro ángulos rectos de 90°',
      'Diagonales iguales, perpendiculares y se bisecan',
      'Es a la vez rectángulo y rombo',
    ],
    types:[{name:'Regular', desc:'Siempre es un polígono regular (único tipo)'}],
    curiosity:'Un tablero de ajedrez tiene 64 cuadrados iguales. Los cuadrados mágicos, conocidos en China hace 3 000 años, suman lo mismo en filas, columnas y diagonales.',
    exSteps:(u)=>[
      {title:'Datos',       content:`l = <strong>7 ${u}</strong>`},
      {title:'Fórmula',     content:'A = l²'},
      {title:'Sustitución', content:'A = 7² = 49'},
      {title:'Resultado',   content:`<strong class="hl">A = 49 ${u}²</strong> · P = 4×7 = <strong>28 ${u}</strong>`},
    ],
  },
  rectangle:{
    name:'Rectángulo', icon:'mdi-rectangle-outline',
    areaFormula:'A = b·h', perimFormula:'P = 2(b+h)',
    properties:[
      'Lados opuestos iguales y paralelos',
      'Cuatro ángulos rectos de 90°',
      'Diagonales iguales que se bisecan',
      'Todo cuadrado es rectángulo; no viceversa',
    ],
    types:[
      {name:'Cuadrado', desc:'Caso especial donde b = h'},
      {name:'Oblongo',  desc:'Caso general donde b ≠ h'},
    ],
    curiosity:'El papel A4 tiene proporción √2:1. Al doblarlo obtienes A5 con las mismas proporciones — principio ISO 216 que evita cortar márgenes al escalar.',
    exSteps:(u)=>[
      {title:'Datos',       content:`b = <strong>8 ${u}</strong>, h = <strong>5 ${u}</strong>`},
      {title:'Fórmula',     content:'A = b × h'},
      {title:'Sustitución', content:'A = 8 × 5 = 40'},
      {title:'Resultado',   content:`<strong class="hl">A = 40 ${u}²</strong> · P = 2(8+5) = <strong>26 ${u}</strong>`},
    ],
  },
  rhombus:{
    name:'Rombo', icon:'mdi-rhombus-outline',
    areaFormula:'A = (D·d)/2', perimFormula:'P = 4l',
    properties:[
      'Cuatro lados iguales de longitud l',
      'Ángulos opuestos son iguales',
      'Diagonales perpendiculares entre sí',
      'Las diagonales se bisecan mutuamente',
    ],
    types:[
      {name:'Cuadrado', desc:'Caso especial con ángulos de 90°'},
      {name:'General',  desc:'Lados iguales, ángulos oblicuos'},
    ],
    curiosity:'Las mallas metálicas de cerco usan forma de rombo: son estables lateralmente y pueden deformarse bajo tensión sin romperse.',
    exSteps:(u)=>[
      {title:'Datos',       content:`D = <strong>10 ${u}</strong>, d = <strong>6 ${u}</strong>`},
      {title:'Fórmula',     content:'A = (D × d) / 2'},
      {title:'Sustitución', content:'A = (10 × 6) / 2 = 30'},
      {title:'Resultado',   content:`<strong class="hl">A = 30 ${u}²</strong>`},
    ],
  },
  parallelogram:{
    name:'Paralelogramo', icon:'mdi-rhombus-split-outline',
    areaFormula:'A = b·h', perimFormula:'P = 2(a+b)',
    properties:[
      'Lados opuestos paralelos e iguales',
      'Ángulos opuestos son iguales',
      'Diagonales se bisecan mutuamente',
      'Ángulos adyacentes suman 180°',
    ],
    types:[
      {name:'Rectángulo', desc:'Ángulos de 90°'},
      {name:'Rombo',      desc:'Todos los lados iguales'},
      {name:'Cuadrado',   desc:'Lados iguales + 90°'},
    ],
    curiosity:'La regla del paralelogramo describe cómo sumar vectores en física. Los pantógrafos y mecanismos de cuatro barras se basan en este principio.',
    exSteps:(u)=>[
      {title:'Datos',       content:`b = <strong>9 ${u}</strong>, h = <strong>4 ${u}</strong>`},
      {title:'Fórmula',     content:'A = b × h'},
      {title:'Sustitución', content:'A = 9 × 4 = 36'},
      {title:'Resultado',   content:`<strong class="hl">A = 36 ${u}²</strong>`},
    ],
  },
  trapezoid:{
    name:'Trapecio', icon:'mdi-tray',
    areaFormula:'A = ((B+b)/2)·h', perimFormula:'P = a+b+c+d',
    properties:[
      'Exactamente un par de lados paralelos (las bases)',
      'Base mayor B > base menor b',
      'Ángulos del mismo lado suman 180°',
      'Segmento medio = (B + b) / 2',
    ],
    types:[
      {name:'Isósceles',  desc:'Lados no paralelos iguales'},
      {name:'Rectángulo', desc:'Un lateral perpendicular a las bases'},
      {name:'Escaleno',   desc:'Todos los lados diferentes'},
    ],
    curiosity:'Las represas tienen sección trapezoidal: ancha en la base, angosta arriba, para distribuir mejor la presión del agua.',
    exSteps:(u)=>[
      {title:'Datos',       content:`B = <strong>10 ${u}</strong>, b = <strong>6 ${u}</strong>, h = <strong>4 ${u}</strong>`},
      {title:'Fórmula',     content:'A = ((B+b)/2) × h'},
      {title:'Sustitución', content:'A = ((10+6)/2) × 4 = 8 × 4'},
      {title:'Resultado',   content:`<strong class="hl">A = 32 ${u}²</strong>`},
    ],
  },
  pentagon:{
    name:'Pentágono', icon:'mdi-pentagon-outline',
    areaFormula:'A ≈ 1.72·l²', perimFormula:'P = 5l',
    properties:[
      '5 lados y 5 ángulos interiores',
      'Suma de ángulos = 540°',
      'Ángulo interior (regular) = 108°',
      '5 ejes de simetría si es regular',
    ],
    types:[
      {name:'Regular',   desc:'Todos los lados y ángulos iguales'},
      {name:'Irregular', desc:'Lados o ángulos diferentes'},
    ],
    curiosity:'La estrella de 5 puntas se forma uniendo vértices alternos de un pentágono regular. El edificio del Pentágono en EE.UU. es uno de los más grandes del mundo.',
    exSteps:(u)=>[
      {title:'Datos',       content:`l = <strong>5 ${u}</strong>`},
      {title:'Fórmula',     content:'A ≈ 1.72 × l²'},
      {title:'Sustitución', content:'A ≈ 1.72 × 25 = 43.01'},
      {title:'Resultado',   content:`<strong class="hl">A ≈ 43.01 ${u}²</strong> · P = <strong>25 ${u}</strong>`},
    ],
  },
  hexagon:{
    name:'Hexágono', icon:'mdi-hexagon-outline',
    areaFormula:'A=(3√3/2)·l²', perimFormula:'P = 6l',
    properties:[
      '6 lados y 6 ángulos interiores',
      'Suma de ángulos = 720°',
      'Ángulo interior (regular) = 120°',
      'Tesela el plano sin huecos',
    ],
    types:[
      {name:'Regular',   desc:'Todos los lados y ángulos iguales'},
      {name:'Irregular', desc:'Lados o ángulos diferentes'},
    ],
    curiosity:'Las celdas del panal de abeja son hexagonales porque maximizan el volumen con la mínima cantidad de cera. ¡La naturaleza resolvió este problema de optimización sola!',
    exSteps:(u)=>[
      {title:'Datos',       content:`l = <strong>4 ${u}</strong>`},
      {title:'Fórmula',     content:'A ≈ 2.598 × l²'},
      {title:'Sustitución', content:'A ≈ 2.598 × 16 = 41.57'},
      {title:'Resultado',   content:`<strong class="hl">A ≈ 41.57 ${u}²</strong> · P = <strong>24 ${u}</strong>`},
    ],
  },
  quadrilateral:{
    name:'Cuadrilátero Irr.', icon:'mdi-vector-square',
    areaFormula:'Shoelace', perimFormula:'P = a+b+c+d',
    properties:[
      '4 lados y 4 ángulos interiores',
      'Suma de ángulos = 360°',
      'Sin lados paralelos identificables',
    ],
    types:[
      {name:'Convexo', desc:'Todos los ángulos < 180°'},
      {name:'Cóncavo', desc:'Al menos un ángulo > 180°'},
    ],
    curiosity:'Los cuadriláteros son la familia más diversa de polígonos. Cualquier figura cerrada de 4 lados rectos pertenece a esta familia.',
    exSteps:(u)=>[
      {title:'Método Gauss',   content:'Para cualquier polígono de n vértices'},
      {title:'Fórmula área',   content:'A = ½ |Σᵢ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)|'},
      {title:'Perímetro',      content:'P = Σᵢ √((Δx)²+(Δy)²)'},
      {title:'Suma ángulos',   content:'(4−2) × 180° = 360°'},
    ],
  },
  polygon:{
    name:'Polígono', icon:'mdi-vector-polygon',
    areaFormula:'Shoelace', perimFormula:'P = Σ lados',
    properties:[
      'n lados = n ángulos = n vértices',
      'Suma ángulos int. = (n−2)×180°',
      'Puede ser convexo o cóncavo',
    ],
    types:[
      {name:'Convexo', desc:'Todos los ángulos < 180°'},
      {name:'Cóncavo', desc:'Al menos un ángulo > 180°'},
      {name:'Regular', desc:'Lados y ángulos todos iguales'},
    ],
    curiosity:'Arquímedes usó polígonos de 96 lados para acotar π entre 3.1408 y 3.1429. Con más lados, cualquier polígono regular se aproxima a un círculo.',
    exSteps:(u)=>[
      {title:'Fórmula de Gauss', content:'n vértices (x₁,y₁)...(xₙ,yₙ)'},
      {title:'Área',             content:'A = ½|Σᵢ(xᵢ·yᵢ₊₁−xᵢ₊₁·yᵢ)|'},
      {title:'Perímetro',        content:'P = Σᵢ √((Δx)²+(Δy)²)'},
      {title:'Ángulos int.',     content:'Suma = (n−2)×180°'},
    ],
  },
}

// ── State ──────────────────────────────────────────────────────────────
const canvasEl      = ref(null)
const canvasWrapper = ref(null)
const zoom          = ref(1)
const unit          = ref('cm')
const tool          = ref('polygon')

// Pan
const panX       = ref(0)
const panY       = ref(0)
const panning    = ref(false)
const panOrigin  = ref(null)

// Draw
const currentPts    = ref([])
const circleCenter  = ref(null)
const previewR      = ref(0)
const mouseCart     = ref(null)
const mousePx       = ref(null)
const nearFirst     = ref(false)
const hoverShape    = ref(false)

// Shapes & selection
const shapes     = ref([])
const selectedId = ref(null)
let idCtr = 0

// Touch
let twoFinger        = false
let lastTouchDist    = 0
let lastTouchMid     = null
let touchMoved       = false
let mouseDownDragged = false

// UI
const tab = ref('calc')

// ── Computed ───────────────────────────────────────────────────────────
const activeShape = computed(()=> shapes.value.find(s=>s.id===selectedId.value)??null)
const activeDef   = computed(()=> activeShape.value?(DEFS[activeShape.value.type]??DEFS.polygon):null)
const activeCol   = computed(()=> PALETTE[(activeShape.value?.colorIdx??0)%PALETTE.length])

const isDrawing = computed(()=> currentPts.value.length>0 || circleCenter.value!==null)
const canSave   = computed(()=>{
  if(tool.value==='polygon') return currentPts.value.length>=3
  if(tool.value==='circle')  return circleCenter.value!==null && previewR.value>0.05
  return false
})

const cursorClass = computed(()=>{
  if(tool.value==='pan') return panning.value?'cur-grabbing':'cur-grab'
  if(hoverShape.value)   return 'cur-pointer'
  return 'cur-crosshair'
})

const hudMsg = computed(()=>{
  if(tool.value==='pan')    return 'Arrastra para mover · Scroll/pellizca para zoom'
  if(tool.value==='circle'){
    if(!circleCenter.value)   return 'Toca el plano para colocar el centro del círculo'
    return `Centro fijo — toca para establecer el radio (${fv(previewR.value)} ${unit.value})`
  }
  if(currentPts.value.length===0) return 'Toca el plano para colocar el primer vértice'
  if(currentPts.value.length<3)   return `${currentPts.value.length} vértice(s) — necesitas ${3-currentPts.value.length} más`
  return `${currentPts.value.length} vértices — toca ● o presiona Enter para cerrar`
})

// ── Geometry helpers ───────────────────────────────────────────────────
const dist=(a,b)=>Math.sqrt((b.x-a.x)**2+(b.y-a.y)**2)
const shoelace=pts=>{let s=0;for(let i=0;i<pts.length;i++){const j=(i+1)%pts.length;s+=pts[i].x*pts[j].y-pts[j].x*pts[i].y}return Math.abs(s)/2}
const centroid=pts=>({x:pts.reduce((s,p)=>s+p.x,0)/pts.length,y:pts.reduce((s,p)=>s+p.y,0)/pts.length})
const sides=pts=>pts.map((p,i)=>dist(p,pts[(i+1)%pts.length]))

function ptInPoly(pt,poly){
  let inside=false
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const xi=poly[i].x,yi=poly[i].y,xj=poly[j].x,yj=poly[j].y
    if(((yi>pt.y)!==(yj>pt.y))&&pt.x<((xj-xi)*(pt.y-yi))/(yj-yi)+xi)inside=!inside
  }
  return inside
}

function isParallel(v1,v2){
  const cross=Math.abs(v1.x*v2.y-v1.y*v2.x)
  const m=Math.sqrt(v1.x**2+v1.y**2)*Math.sqrt(v2.x**2+v2.y**2)
  return m>1e-10&&cross/m<0.13
}

function classify(pts){
  const n=pts.length
  if(n===3)return 'triangle'
  if(n===4){
    const sl=sides(pts)
    const angs=pts.map((p,i)=>{
      const a=pts[(i+3)%4],b=p,c=pts[(i+1)%4]
      const v1={x:a.x-b.x,y:a.y-b.y},v2={x:c.x-b.x,y:c.y-b.y}
      const d=v1.x*v2.x+v1.y*v2.y,m=Math.sqrt(v1.x**2+v1.y**2)*Math.sqrt(v2.x**2+v2.y**2)
      return m<1e-10?0:Math.acos(Math.max(-1,Math.min(1,d/m)))*(180/Math.PI)
    })
    const eq=(a,b)=>Math.abs(a-b)/Math.max(a,b,1e-6)<0.13
    const allSEq=eq(sl[0],sl[1])&&eq(sl[1],sl[2])&&eq(sl[2],sl[3])
    const oppSEq=eq(sl[0],sl[2])&&eq(sl[1],sl[3])
    const allR=angs.every(a=>Math.abs(a-90)<10)
    const vecs=pts.map((p,i)=>{const q=pts[(i+1)%4];return{x:q.x-p.x,y:q.y-p.y}})
    const p02=isParallel(vecs[0],vecs[2]),p13=isParallel(vecs[1],vecs[3])
    if(allSEq&&allR)return 'square'
    if(allR&&oppSEq)return 'rectangle'
    if(allSEq&&p02&&p13)return 'rhombus'
    if(p02&&p13)return 'parallelogram'
    if(p02||p13)return 'trapezoid'
    return 'quadrilateral'
  }
  if(n===5)return 'pentagon'
  if(n===6)return 'hexagon'
  return 'polygon'
}

// ── Coordinate transforms ──────────────────────────────────────────────
function origin(){
  if(!canvasEl.value)return{ox:0,oy:0}
  return{ox:canvasEl.value.width/2+panX.value,oy:canvasEl.value.height/2+panY.value}
}
function toCvs(p){
  const sc=BASE_CELL*zoom.value,{ox,oy}=origin()
  return{x:ox+p.x*sc,y:oy-p.y*sc}
}
function toCart2(cx,cy){
  const sc=BASE_CELL*zoom.value,{ox,oy}=origin()
  return{x:(cx-ox)/sc,y:(oy-cy)/sc}
}
const snap=v=>Math.round(v)

// ── Draw ───────────────────────────────────────────────────────────────
let ctx=null

function draw(){
  if(!ctx||!canvasEl.value)return
  const W=canvasEl.value.width,H=canvasEl.value.height
  ctx.clearRect(0,0,W,H)
  ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,W,H)
  drawGrid(W,H)
  drawAxes(W,H)
  shapes.value.forEach(s=>s.shapeType==='circle'?drawCircle(s):drawPoly(s))
  drawInProgress()
}

function drawGrid(W,H){
  const sc=BASE_CELL*zoom.value,{ox,oy}=origin()
  let step=1
  if(sc<12)step=20
  else if(sc<22)step=10
  else if(sc<38)step=5
  else if(sc<52)step=2
  ctx.save(); ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=0.5
  const sX=Math.ceil(-ox/sc/step)*step,eX=Math.floor((W-ox)/sc/step)*step
  for(let x=sX;x<=eX;x+=step){const px=ox+x*sc;ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,H);ctx.stroke()}
  const sY=Math.ceil(-(H-oy)/sc/step)*step,eY=Math.floor(oy/sc/step)*step
  for(let y=sY;y<=eY;y+=step){const py=oy-y*sc;ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(W,py);ctx.stroke()}
  ctx.fillStyle='#94a3b8'; ctx.font='9.5px "Courier New",monospace'
  ctx.textAlign='center'
  for(let x=sX;x<=eX;x+=step){if(x===0)continue;const px=ox+x*sc;if(px<5||px>W-5)continue;ctx.fillText(x,px,Math.min(Math.max(oy+13,12),H-3))}
  ctx.textAlign='right'
  for(let y=sY;y<=eY;y+=step){if(y===0)continue;const py=oy-y*sc;if(py<5||py>H-5)continue;ctx.fillText(y,Math.max(ox-4,18),py+4)}
  ctx.restore()
}

function drawAxes(W,H){
  const{ox,oy}=origin()
  ctx.save(); ctx.strokeStyle='#64748b'; ctx.fillStyle='#64748b'; ctx.lineWidth=1.5
  ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(W,oy);ctx.stroke()
  ctx.beginPath();ctx.moveTo(W-12,oy-5);ctx.lineTo(W,oy);ctx.lineTo(W-12,oy+5);ctx.fill()
  ctx.beginPath();ctx.moveTo(ox,H);ctx.lineTo(ox,0);ctx.stroke()
  ctx.beginPath();ctx.moveTo(ox-5,12);ctx.lineTo(ox,0);ctx.lineTo(ox+5,12);ctx.fill()
  ctx.font='bold 11px sans-serif'; ctx.fillStyle='#475569'
  ctx.textAlign='left';   ctx.fillText(`x (${unit.value})`,Math.min(W-44,ox+6),oy-9)
  ctx.textAlign='center'; ctx.fillText(`y (${unit.value})`,ox+20,14)
  ctx.textAlign='right';  ctx.font='10px monospace'; ctx.fillText('O',ox-5,oy-6)
  ctx.restore()
}

function drawPoly(sh,isSelected){
  if(isSelected===undefined)isSelected=sh.id===selectedId.value
  const col=PALETTE[sh.colorIdx%PALETTE.length]
  ctx.save()
  ctx.beginPath()
  sh.points.forEach((p,i)=>{const{x,y}=toCvs(p);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)})
  ctx.closePath()
  ctx.fillStyle=isSelected?col.fill.replace('0.12','0.26'):col.fill; ctx.fill()
  ctx.strokeStyle=col.stroke; ctx.lineWidth=isSelected?2.5:1.6; ctx.stroke()
  sh.points.forEach((p,i)=>{
    const{x,y}=toCvs(p)
    ctx.beginPath();ctx.arc(x,y,isSelected?6:4,0,Math.PI*2)
    ctx.fillStyle='#fff'; ctx.fill()
    ctx.beginPath();ctx.arc(x,y,isSelected?4.5:2.8,0,Math.PI*2)
    ctx.fillStyle=col.stroke; ctx.fill()
    if(isSelected){
      ctx.fillStyle='#1e293b'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center'
      ctx.shadowColor='rgba(255,255,255,0.95)'; ctx.shadowBlur=3
      ctx.fillText(String.fromCharCode(65+i),x+11,y-10); ctx.shadowBlur=0
    }
  })
  if(isSelected){
    const c=centroid(sh.points),{x,y}=toCvs(c)
    ctx.font='bold 12px sans-serif'; ctx.fillStyle=col.stroke; ctx.textAlign='center'
    ctx.shadowColor='rgba(255,255,255,0.95)'; ctx.shadowBlur=5
    ctx.fillText((DEFS[sh.type]??DEFS.polygon).name,x,y+5); ctx.shadowBlur=0
  }
  ctx.restore()
}

function drawCircle(sh){
  const sel=sh.id===selectedId.value
  const col=PALETTE[sh.colorIdx%PALETTE.length]
  const sc=BASE_CELL*zoom.value,{x:cx,y:cy}=toCvs(sh.center),r=sh.radius*sc
  ctx.save()
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2)
  ctx.fillStyle=sel?col.fill.replace('0.12','0.26'):col.fill; ctx.fill()
  ctx.strokeStyle=col.stroke; ctx.lineWidth=sel?2.5:1.6; ctx.stroke()
  ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill()
  ctx.beginPath();ctx.arc(cx,cy,3.5,0,Math.PI*2);ctx.fillStyle=col.stroke;ctx.fill()
  if(sel){
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r,cy)
    ctx.strokeStyle=col.stroke;ctx.lineWidth=1;ctx.setLineDash([4,2]);ctx.stroke();ctx.setLineDash([])
    ctx.font='bold 12px sans-serif';ctx.fillStyle=col.stroke;ctx.textAlign='center'
    ctx.shadowColor='rgba(255,255,255,0.95)';ctx.shadowBlur=5
    ctx.fillText('Círculo',cx,cy-r-10)
    ctx.font='10px monospace';ctx.fillText(`r=${fv(sh.radius)} ${unit.value}`,cx+r/2+8,cy-7)
    ctx.shadowBlur=0
  }
  ctx.restore()
}

function drawInProgress(){
  const pts=currentPts.value
  if(tool.value==='polygon'&&pts.length>0){
    ctx.save()
    if(pts.length>=3){
      ctx.beginPath(); pts.forEach((p,i)=>{const{x,y}=toCvs(p);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)})
      ctx.closePath(); ctx.fillStyle='rgba(99,102,241,0.07)'; ctx.fill()
    }
    ctx.strokeStyle='#6366f1';ctx.lineWidth=1.5;ctx.setLineDash([6,3])
    ctx.beginPath(); pts.forEach((p,i)=>{const{x,y}=toCvs(p);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)})
    if(mousePx.value)ctx.lineTo(mousePx.value.x,mousePx.value.y)
    ctx.stroke();ctx.setLineDash([])
    pts.forEach((p,i)=>{
      const{x,y}=toCvs(p),first=(i===0)
      ctx.beginPath();ctx.arc(x,y,first?8:4.5,0,Math.PI*2);ctx.fillStyle=first?'#4f46e5':'#6366f1';ctx.fill()
      ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke()
      if(first&&nearFirst.value&&pts.length>=3){
        ctx.beginPath();ctx.arc(x,y,14,0,Math.PI*2)
        ctx.strokeStyle='rgba(34,197,94,0.8)';ctx.lineWidth=2;ctx.stroke()
      }
    })
    ctx.restore()
  }
  if(tool.value==='circle'){
    if(circleCenter.value){
      const{x:cx,y:cy}=toCvs(circleCenter.value)
      ctx.save()
      ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle='#14b8a6';ctx.fill()
      ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke()
      if(mousePx.value){
        const r=dist(mousePx.value,{x:cx,y:cy})
        if(r>1){
          ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2)
          ctx.fillStyle='rgba(20,184,166,0.07)';ctx.fill()
          ctx.strokeStyle='rgba(20,184,166,0.75)';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);ctx.stroke();ctx.setLineDash([])
          ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(mousePx.value.x,mousePx.value.y)
          ctx.strokeStyle='rgba(20,184,166,0.5)';ctx.lineWidth=1;ctx.stroke()
        }
      }
      ctx.restore()
    } else if(mousePx.value){
      ctx.save();ctx.beginPath();ctx.arc(mousePx.value.x,mousePx.value.y,5,0,Math.PI*2)
      ctx.fillStyle='rgba(20,184,166,0.45)';ctx.fill();ctx.restore()
    }
  }
}

// ── Click handler (shared mouse + touch) ──────────────────────────────
function handleClick(cx,cy){
  const raw=toCart2(cx,cy)
  const pt={x:snap(raw.x),y:snap(raw.y)}

  // Hit existing shapes (topmost first)
  for(let i=shapes.value.length-1;i>=0;i--){
    const sh=shapes.value[i]
    const hit=sh.shapeType==='circle'?dist(raw,sh.center)<=sh.radius:ptInPoly(raw,sh.points)
    if(hit){selectedId.value=sh.id;tab.value='calc';draw();return}
  }

  // Deselect on empty tap
  if(selectedId.value&&!isDrawing.value){selectedId.value=null}

  // Circle tool
  if(tool.value==='circle'){
    if(!circleCenter.value){circleCenter.value=pt}
    else{if(previewR.value>0.05)finishCircle(previewR.value);else circleCenter.value=null}
    draw();return
  }

  // Polygon tool
  if(tool.value==='polygon'){
    if(currentPts.value.length>=3){
      const{x:fpx,y:fpy}=toCvs(currentPts.value[0])
      if(Math.hypot(cx-fpx,cy-fpy)<CLOSE_DIST){closePoly();return}
    }
    currentPts.value.push(pt);draw()
  }
}

// ── Mouse events ───────────────────────────────────────────────────────
function onMouseDown(e){
  mouseDownDragged=false
  if(tool.value==='pan'){
    panning.value=true
    panOrigin.value={x:e.clientX,y:e.clientY,px:panX.value,py:panY.value}
  }
}
function onMouseUp(){ panning.value=false;panOrigin.value=null }

function onCanvasClick(e){
  if(mouseDownDragged){mouseDownDragged=false;return}
  const rect=canvasEl.value.getBoundingClientRect()
  handleClick(e.clientX-rect.left,e.clientY-rect.top)
}

function updateMouse(cx,cy){
  const sc=BASE_CELL*zoom.value,raw=toCart2(cx,cy)
  mouseCart.value={x:Math.round(raw.x*10)/10,y:Math.round(raw.y*10)/10}
  mousePx.value={x:cx,y:cy}
  if(currentPts.value.length>=3){
    const{x:fpx,y:fpy}=toCvs(currentPts.value[0])
    nearFirst.value=Math.hypot(cx-fpx,cy-fpy)<CLOSE_DIST
  }else nearFirst.value=false
  if(tool.value==='circle'&&circleCenter.value){
    const{x:ccx,y:ccy}=toCvs(circleCenter.value)
    previewR.value=dist({x:cx,y:cy},{x:ccx,y:ccy})/sc
  }
  hoverShape.value=shapes.value.some(sh=>sh.shapeType==='circle'?dist(raw,sh.center)<=sh.radius:ptInPoly(raw,sh.points))
  draw()
}

function onMouseMove(e){
  if(panning.value&&panOrigin.value&&tool.value==='pan'){
    const dx=e.clientX-panOrigin.value.x,dy=e.clientY-panOrigin.value.y
    if(Math.hypot(dx,dy)>4)mouseDownDragged=true
    panX.value=panOrigin.value.px+dx; panY.value=panOrigin.value.py+dy; draw();return
  }
  const rect=canvasEl.value.getBoundingClientRect()
  updateMouse(e.clientX-rect.left,e.clientY-rect.top)
}

function onMouseLeave(){mouseCart.value=null;mousePx.value=null;nearFirst.value=false;hoverShape.value=false;draw()}

function onWheel(e){
  const delta=e.deltaY>0?-ZOOM_STEP:ZOOM_STEP
  const nz=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,+(zoom.value+delta).toFixed(2)))
  if(nz===zoom.value)return
  const rect=canvasEl.value.getBoundingClientRect()
  const mx=e.clientX-rect.left,my=e.clientY-rect.top
  const W=canvasEl.value.width,H=canvasEl.value.height
  const ratio=nz/zoom.value
  panX.value=mx-(mx-W/2-panX.value)*ratio-W/2
  panY.value=my+(H/2+panY.value-my)*ratio-H/2
  zoom.value=nz; draw()
}

// ── Touch events ───────────────────────────────────────────────────────
function onTouchStart(e){
  touchMoved=false
  if(e.touches.length>=2){
    twoFinger=true; panning.value=false
    const t0=e.touches[0],t1=e.touches[1]
    lastTouchDist=Math.hypot(t1.clientX-t0.clientX,t1.clientY-t0.clientY)
    lastTouchMid={x:(t0.clientX+t1.clientX)/2,y:(t0.clientY+t1.clientY)/2}
    return
  }
  twoFinger=false
  if(tool.value==='pan'){
    panning.value=true
    panOrigin.value={x:e.touches[0].clientX,y:e.touches[0].clientY,px:panX.value,py:panY.value}
  } else {
    const rect=canvasEl.value.getBoundingClientRect()
    updateMouse(e.touches[0].clientX-rect.left,e.touches[0].clientY-rect.top)
  }
}

function onTouchMove(e){
  e.preventDefault(); touchMoved=true
  if(e.touches.length>=2){
    twoFinger=true
    const t0=e.touches[0],t1=e.touches[1]
    const newDist=Math.hypot(t1.clientX-t0.clientX,t1.clientY-t0.clientY)
    const mid={x:(t0.clientX+t1.clientX)/2,y:(t0.clientY+t1.clientY)/2}
    // Pan from pinch center
    if(lastTouchMid){panX.value+=mid.x-lastTouchMid.x;panY.value+=mid.y-lastTouchMid.y}
    // Zoom from pinch distance
    if(lastTouchDist>0){
      const ratio=newDist/lastTouchDist
      const nz=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,+(zoom.value*ratio).toFixed(3)))
      const rect=canvasEl.value.getBoundingClientRect()
      const mx=mid.x-rect.left,my=mid.y-rect.top
      const W=canvasEl.value.width,H=canvasEl.value.height
      const r2=nz/zoom.value
      panX.value=mx-(mx-W/2-panX.value)*r2-W/2
      panY.value=my+(H/2+panY.value-my)*r2-H/2
      zoom.value=nz
    }
    lastTouchDist=newDist; lastTouchMid=mid; draw();return
  }
  if(tool.value==='pan'&&panning.value&&panOrigin.value){
    panX.value=panOrigin.value.px+(e.touches[0].clientX-panOrigin.value.x)
    panY.value=panOrigin.value.py+(e.touches[0].clientY-panOrigin.value.y)
    draw();return
  }
  const rect=canvasEl.value.getBoundingClientRect()
  updateMouse(e.touches[0].clientX-rect.left,e.touches[0].clientY-rect.top)
}

function onTouchEnd(e){
  panning.value=false
  if(twoFinger&&e.touches.length===0){twoFinger=false;lastTouchDist=0;lastTouchMid=null;return}
  if(e.touches.length<2){twoFinger=false;lastTouchDist=0;lastTouchMid=null}
  if(!touchMoved&&e.changedTouches.length===1){
    const rect=canvasEl.value.getBoundingClientRect(),t=e.changedTouches[0]
    handleClick(t.clientX-rect.left,t.clientY-rect.top)
  }
}

// ── Shape actions ──────────────────────────────────────────────────────
function closePoly(){
  if(currentPts.value.length<3)return
  const pts=[...currentPts.value],type=classify(pts),sl=sides(pts)
  shapes.value.push({
    id:++idCtr, shapeType:'polygon', points:pts, type, sideLengths:sl,
    area:shoelace(pts), perimeter:sl.reduce((a,b)=>a+b,0),
    colorIdx:shapes.value.length%PALETTE.length,
  })
  selectedId.value=idCtr; currentPts.value=[]; nearFirst.value=false; tab.value='calc'; draw()
}

function finishCircle(r){
  shapes.value.push({
    id:++idCtr, shapeType:'circle', center:{...circleCenter.value}, radius:r, type:'circle',
    sideLengths:[r], area:Math.PI*r*r, perimeter:2*Math.PI*r,
    colorIdx:shapes.value.length%PALETTE.length,
  })
  selectedId.value=idCtr; circleCenter.value=null; previewR.value=0; tab.value='calc'; draw()
}

function saveShape(){
  if(tool.value==='polygon'&&currentPts.value.length>=3)closePoly()
  else if(tool.value==='circle'&&circleCenter.value&&previewR.value>0.05)finishCircle(previewR.value)
}

function cancelCurrent(){currentPts.value=[];circleCenter.value=null;previewR.value=0;nearFirst.value=false;draw()}
function undoLastPt(){if(currentPts.value.length)currentPts.value.pop();draw()}
function deleteSelected(){
  if(!selectedId.value)return
  shapes.value=shapes.value.filter(s=>s.id!==selectedId.value)
  selectedId.value=null; draw()
}
function setShapeColor(idx){
  if(!activeShape.value)return
  const sh=shapes.value.find(s=>s.id===selectedId.value)
  if(sh){sh.colorIdx=idx;draw()}
}
function resetView(){panX.value=0;panY.value=0;zoom.value=1;draw()}
function zoomIn(){if(zoom.value<MAX_ZOOM){zoom.value=+(Math.min(MAX_ZOOM,zoom.value+ZOOM_STEP)).toFixed(2);draw()}}
function zoomOut(){if(zoom.value>MIN_ZOOM){zoom.value=+(Math.max(MIN_ZOOM,zoom.value-ZOOM_STEP)).toFixed(2);draw()}}

// ── Format helpers ─────────────────────────────────────────────────────
const fv=v=>v==null||isNaN(v)?'—':Math.abs(v)<0.005?'0':Math.abs(v)>=1000?Math.round(v).toString():(Math.round(v*100)/100).toString()
const fc=v=>(Math.round(v*10)/10).toString()
const sideLabel=(i,n)=>`${String.fromCharCode(65+i)}${String.fromCharCode(65+(i+1)%n)}`

// ── Canvas resize ──────────────────────────────────────────────────────
function resize(){
  if(!canvasEl.value||!canvasWrapper.value)return
  canvasEl.value.width=canvasWrapper.value.clientWidth
  canvasEl.value.height=canvasWrapper.value.clientHeight
}

// ── Lifecycle ──────────────────────────────────────────────────────────
onMounted(async()=>{
  await nextTick()
  ctx=canvasEl.value.getContext('2d')
  resize(); draw()
  const ro=new ResizeObserver(()=>{resize();draw()})
  ro.observe(canvasWrapper.value)

  const onUp=()=>{panning.value=false;panOrigin.value=null}
  window.addEventListener('mouseup',onUp)

  const onKey=e=>{
    if(e.key==='Escape')cancelCurrent()
    if(e.key==='Backspace'&&currentPts.value.length){e.preventDefault();undoLastPt()}
    if(e.key==='Enter'&&currentPts.value.length>=3)closePoly()
    if((e.key==='Delete'||e.key==='Backspace')&&selectedId.value&&!isDrawing.value)deleteSelected()
    if(e.key==='+'||e.key==='=')zoomIn()
    if(e.key==='-')zoomOut()
  }
  window.addEventListener('keydown',onKey)

  onUnmounted(()=>{
    window.removeEventListener('mouseup',onUp)
    window.removeEventListener('keydown',onKey)
    ro.disconnect()
  })
})

watch(unit,()=>draw())
watch(selectedId,v=>{if(v)tab.value='calc'})
</script>


<!-- ================================================================
     STYLES
================================================================ -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap');

/* ── Root ──────────────────────────────────────────────────────────── */
.geo-ova {
  display: flex; flex-direction: column;
  height: 100%; min-height: calc(100dvh - 64px);
  font-family: 'Sora', sans-serif;
  background: #f1f5f9; overflow: hidden;
}
.font-mono { font-family: 'JetBrains Mono', monospace !important; }

/* ── Toolbar ───────────────────────────────────────────────────────── */
.geo-toolbar {
  display: flex; align-items: center; gap: 6px;
  padding: 0 12px; height: 52px;
  background: #fff; border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  flex-shrink: 0; z-index: 10;
  overflow-x: auto; scrollbar-width: none;
}
.geo-toolbar::-webkit-scrollbar { display: none; }

.tb-brand  { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.brand-icon{
  width:30px; height:30px; border-radius:8px;
  background:rgba(99,102,241,0.08);
  display:flex; align-items:center; justify-content:center; color:#6366f1; flex-shrink:0;
}
.brand-name { font-weight:700; font-size:14px; color:#1e293b; letter-spacing:-0.3px; white-space:nowrap; }

.tb-tools  { flex-shrink: 0; }
.tb-divider{ width:1px; height:22px; background:#e2e8f0; flex-shrink:0; }

.zoom-badge{
  min-width:44px; text-align:center; font-size:11px; font-weight:600; color:#475569;
  background:#f1f5f9; border-radius:6px; padding:2px 5px; flex-shrink:0;
}

.unit-wrap  { display:flex; align-items:center; gap:5px; flex-shrink:0; }
.unit-label { font-size:12px; color:#64748b; font-weight:500; }
.unit-btn   { min-width:34px !important; font-size:11px !important; font-weight:700 !important; }
.save-btn   { font-weight:600 !important; flex-shrink:0; }

/* ── Layout ────────────────────────────────────────────────────────── */
.main-layout { display:flex; flex:1; overflow:hidden; position:relative; }

/* ── Canvas ────────────────────────────────────────────────────────── */
.canvas-area { flex:1; position:relative; overflow:hidden; background:#f8fafc; min-width:0; }
.geo-canvas  { display:block; width:100%; height:100%; touch-action:none; }
.cur-crosshair { cursor:crosshair; }
.cur-pointer   { cursor:pointer;   }
.cur-grab      { cursor:grab;      }
.cur-grabbing  { cursor:grabbing;  }

/* ── HUD ───────────────────────────────────────────────────────────── */
.hud    { position:absolute; pointer-events:none; z-index:5; }
.hud-bl { bottom:14px; left:14px; }
.hud-br { bottom:14px; right:14px; }
.hud-tc { top:14px; left:50%; transform:translateX(-50%); }
.hud-tl { top:14px; left:14px; }

.hud-pill {
  display:inline-flex; align-items:center;
  background:rgba(255,255,255,0.93); backdrop-filter:blur(8px);
  border:1px solid #e2e8f0; border-radius:20px;
  padding:5px 12px; font-size:11.5px; color:#475569; font-weight:500;
  box-shadow:0 1px 5px rgba(0,0,0,0.08); white-space:nowrap;
}
.hud-green { background:rgba(240,253,244,0.95); border-color:#86efac; color:#15803d; }
.hud-teal  { background:rgba(240,253,250,0.95); border-color:#5eead4; color:#0f766e; }

/* ── Info panel ────────────────────────────────────────────────────── */
.info-panel {
  width: 340px; min-width: 300px;
  background: #fff; border-left: 1px solid #e2e8f0;
  display: flex; flex-direction: column;
  overflow: hidden; flex-shrink: 0;
}

/* ── MOBILE: bottom sheet ──────────────────────────────────────────── */
@media (max-width: 959px) {
  .main-layout { flex-direction: column; }
  .canvas-area { flex: 1; min-height: 52dvh; }

  .info-panel {
    position: fixed; bottom: 0; left: 0; right: 0;
    width: 100%; min-width: unset; max-height: 65dvh;
    border-radius: 20px 20px 0 0;
    border-left: none; border-top: 1px solid #e2e8f0;
    box-shadow: 0 -8px 30px rgba(0,0,0,0.13);
    transform: translateY(calc(100% + 4px));
    transition: transform 0.34s cubic-bezier(0.34, 1.38, 0.64, 1);
    z-index: 200; overflow-y: auto;
  }
  .info-panel.panel-open { transform: translateY(0); }
}

/* ── Drag handle ───────────────────────────────────────────────────── */
.drag-handle { display:flex; justify-content:center; padding:10px 0 4px; cursor:pointer; flex-shrink:0; }
.drag-bar    { width:40px; height:4px; background:#cbd5e1; border-radius:2px; }

/* ── Panel header ──────────────────────────────────────────────────── */
.panel-header {
  display:flex; align-items:center; gap:8px;
  padding:12px 14px 8px; flex-shrink:0;
}

/* ── Color dot button ──────────────────────────────────────────────── */
.color-dot-btn {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px rgba(0,0,0,0.12);
  transition: transform 0.15s, box-shadow 0.15s;
}
.color-dot-btn:hover {
  transform: scale(1.12);
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(0,0,0,0.22);
}

/* ── Color picker menu ─────────────────────────────────────────────── */
.color-picker-card { min-width: 208px !important; }
.picker-title { font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.5px; }
.color-grid {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 7px;
}
.color-swatch {
  width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform .15s, box-shadow .15s;
  box-shadow: 0 0 0 2px transparent;
}
.color-swatch:hover { transform: scale(1.18); }
.swatch-active {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(0,0,0,0.25);
  transform: scale(1.12);
}

.panel-title-block { min-width:0; }
.panel-name { font-size:15px; font-weight:700; color:#1e293b; letter-spacing:-0.2px; }
.panel-sub  { font-size:11px; color:#64748b; margin-top:1px; }

.formula-row { display:flex; flex-wrap:wrap; gap:5px; padding:0 14px 9px; flex-shrink:0; }
.chip-formula { font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:500; padding:3px 9px; border-radius:6px; }
.chip-a { background:rgba(99,102,241,0.08); color:#4f46e5; }
.chip-p { background:rgba(20,184,166,0.08); color:#0d9488; }

.info-tabs  { flex-shrink:0; }
.tab-sep    { height:1px; background:#f1f5f9; flex-shrink:0; }

.panel-body { flex:1; overflow-y:auto; }
.panel-body::-webkit-scrollbar { width:3px; }
.panel-body::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }

/* ── Tab content ───────────────────────────────────────────────────── */
.tab-content { padding:12px 14px 20px; }

.sec-title {
  display:flex; align-items:center;
  font-size:10.5px; font-weight:700; letter-spacing:.5px;
  text-transform:uppercase; color:#94a3b8; margin-bottom:8px;
}

.sides-grid { display:grid; grid-template-columns:1fr 1fr; gap:5px; }
.side-item  { display:flex; align-items:center; justify-content:space-between;
              background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:5px 9px; }
.side-name  { font-size:11px; font-weight:700; color:#64748b; }
.side-val   { font-size:11px; font-weight:500; color:#1e293b; }

.sep { height:1px; background:#f1f5f9; margin:10px 0; }

.res-card   { border-radius:10px; padding:9px 11px; margin-bottom:7px; border:1px solid transparent; }
.res-meta   { display:flex; align-items:center; margin-bottom:4px; }
.res-label  { display:flex; align-items:center; font-size:10px; font-weight:700; letter-spacing:.4px; }
.res-formula{ font-size:10px; color:#94a3b8; margin-left:auto; font-family:'JetBrains Mono',monospace; }
.res-number { display:flex; align-items:baseline; gap:3px; }
.res-val    { font-size:22px; font-weight:700; font-family:'JetBrains Mono',monospace; line-height:1; }
.res-unit   { font-size:12px; color:#64748b; font-weight:500; }

.coords-list { display:flex; flex-direction:column; gap:4px; }
.coord-row   { display:flex; align-items:center; gap:8px;
               background:#f8fafc; border-radius:6px; padding:5px 9px; }
.coord-dot   { width:20px; height:20px; border-radius:50%;
               color:#fff; font-size:9.5px; font-weight:700;
               display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.coord-val   { font-size:11.5px; color:#1e293b; font-weight:500; }

.props-list { display:flex; flex-direction:column; gap:6px; }
.prop-row   { display:flex; align-items:flex-start; }
.prop-text  { font-size:12.5px; color:#374151; line-height:1.45; }
.mt-0-5     { margin-top:2px; }

.types-list { display:flex; flex-direction:column; gap:6px; }
.type-row   { display:flex; align-items:center; flex-wrap:wrap; gap:5px; }
.type-desc  { font-size:12px; color:#64748b; }

.curiosity-card   { background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:11px; }
.curiosity-title  { display:flex; align-items:center; gap:5px; font-size:10.5px; font-weight:700;
                    color:#92400e; margin-bottom:5px; text-transform:uppercase; letter-spacing:.4px; }
.curiosity-text   { font-size:12px; color:#78350f; line-height:1.55; margin:0; }

.steps-list { display:flex; flex-direction:column; gap:6px; }
.step-row   { display:flex; gap:10px; align-items:flex-start;
              padding:10px; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0; }
.step-num   { width:22px; height:22px; border-radius:50%; color:#fff; font-size:11px; font-weight:700;
              display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
.step-body  { flex:1; min-width:0; }
.step-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; color:#94a3b8; margin-bottom:3px; }
.step-content { font-size:12.5px; color:#1e293b; line-height:1.5; }
:deep(.hl)  { color:#4f46e5; background:rgba(99,102,241,0.09); padding:1px 5px; border-radius:4px; }

/* ── Empty panel ───────────────────────────────────────────────────── */
.empty-panel {
  display:flex; flex-direction:column; align-items:center;
  padding:24px 18px; text-align:center; height:100%; overflow-y:auto;
}
.empty-svg   { margin-bottom:14px; opacity:.88; }
.empty-title { font-size:15px; font-weight:700; color:#1e293b; margin:0 0 6px; }
.empty-desc  { font-size:12.5px; color:#64748b; line-height:1.55; margin:0 0 16px; }

.hint-list { width:100%; display:flex; flex-direction:column; gap:8px; text-align:left; }
.hint-row  { display:flex; align-items:flex-start; gap:9px; font-size:12px; color:#374151; line-height:1.45; }

kbd {
  font-family:'JetBrains Mono',monospace; font-size:10px;
  background:#fff; border:1px solid #cbd5e1; border-bottom-width:2px;
  border-radius:4px; padding:1px 5px; color:#1e293b;
}

/* ── Transitions ───────────────────────────────────────────────────── */
.fade-hud-enter-active,.fade-hud-leave-active { transition:opacity .2s ease; }
.fade-hud-enter-from,.fade-hud-leave-to       { opacity:0; }
</style>