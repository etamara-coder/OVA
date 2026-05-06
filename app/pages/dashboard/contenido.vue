<template>
  <div class="contenido-page">

    <div class="page-banner">
      <div class="page-banner__inner">
        <h1 class="page-titulo">Figuras Geométricas</h1>
        <p class="page-desc">Aprende las fórmulas para calcular el área de las principales figuras geométricas planas.</p>
      </div>
    </div>

    <div class="figuras-grid">
      <div
        v-for="f in figuras"
        :key="f.nombre"
        class="figura-card"
        :class="{ 'figura-card--expandida': expandida === f.nombre }"
        @click="toggleExpandir(f.nombre)"
      >
        <!-- Vista compacta -->
        <div class="figura-card__compacta">
          <div class="figura-card__svg">
            <component :is="f.svg" />
          </div>
          <div class="figura-card__info">
            <div class="figura-card__header">
              <span class="figura-card__badge" :style="{ background: f.bgBadge, color: f.color }">{{ f.nombre }}</span>
              <span class="figura-card__flecha">{{ expandida === f.nombre ? '▲' : '▼' }}</span>
            </div>
            <p class="figura-card__def">{{ f.def }}</p>
            <div class="formula-box" :style="{ borderColor: f.borderColor, background: f.bgFormula }">
              <span class="formula-label">Fórmula</span>
              <span class="formula-text" :style="{ color: f.color }">{{ f.formula }}</span>
            </div>
          </div>
        </div>

        <!-- Vista expandida -->
        <div v-if="expandida === f.nombre" class="figura-card__expandida-contenido">

          <div class="expand-grid">

            <!-- Variables -->
            <div class="expand-seccion">
              <h3 class="expand-titulo">📐 Variables</h3>
              <div class="variables-lista">
                <div v-for="v in f.variables" :key="v.var" class="variable-item">
                  <span class="variable-key" :style="{ color: f.color }">{{ v.var }}</span>
                  <span class="variable-desc">{{ v.desc }}</span>
                </div>
              </div>
            </div>

            <!-- Propiedades -->
            <div class="expand-seccion">
              <h3 class="expand-titulo">✏️ Propiedades</h3>
              <ul class="propiedades-lista">
                <li v-for="p in f.propiedades" :key="p">{{ p }}</li>
              </ul>
            </div>

          </div>

          <!-- Ejemplos -->
          <div class="expand-seccion">
            <h3 class="expand-titulo">🧮 Ejemplos resueltos</h3>
            <div class="ejemplos-grid">
              <div v-for="ej in f.ejemplos" :key="ej.titulo" class="ejemplo-card" :style="{ borderColor: f.borderColor, background: f.bgFormula }">
                <p class="ejemplo-titulo">{{ ej.titulo }}</p>
                <p class="ejemplo-datos">{{ ej.datos }}</p>
                <p class="ejemplo-paso">{{ ej.paso }}</p>
                <p class="ejemplo-resultado" :style="{ color: f.color }">✓ {{ ej.resultado }}</p>
              </div>
            </div>
          </div>

          <!-- Dato curioso -->
          <div class="curiosidad" :style="{ borderColor: f.borderColor, background: f.bgFormula }">
            <span class="curiosidad-icon">💡</span>
            <p>{{ f.curiosidad }}</p>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'

const expandida = ref(null)

const toggleExpandir = (nombre) => {
  expandida.value = expandida.value === nombre ? null : nombre
}

const mkSvg = (nodos) =>
  defineComponent({ render: () => h('svg', { width: 80, height: 80, viewBox: '0 0 80 80' }, nodos) })

const figuras = [
  {
    nombre: 'Cuadrado',
    color: '#3B82F6', bgBadge: 'rgba(59,130,246,0.12)',
    borderColor: 'rgba(59,130,246,0.3)', bgFormula: 'rgba(59,130,246,0.06)',
    def: 'Figura con cuatro lados iguales y cuatro ángulos rectos.',
    formula: 'A = l²',
    svg: mkSvg([
      h('rect', { x: 10, y: 10, width: 60, height: 60, rx: 4, fill: 'rgba(59,130,246,0.2)', stroke: '#3B82F6', 'stroke-width': 2 }),
      h('text', { x: 40, y: 44, 'text-anchor': 'middle', 'font-size': 11, fill: '#3B82F6', 'font-family': 'DM Sans' }, 'l'),
    ]),
    variables: [
      { var: 'l', desc: 'Longitud del lado' },
    ],
    propiedades: [
      'Todos sus lados son iguales',
      'Sus cuatro ángulos miden 90°',
      'Sus diagonales son iguales y se bisectan',
      'Es un caso especial del rectángulo',
    ],
    ejemplos: [
      { titulo: 'Ejemplo 1', datos: 'l = 5 cm', paso: 'A = 5² = 5 × 5', resultado: 'A = 25 cm²' },
      { titulo: 'Ejemplo 2', datos: 'l = 12 m', paso: 'A = 12² = 12 × 12', resultado: 'A = 144 m²' },
      { titulo: 'Ejemplo 3', datos: 'l = 3.5 cm', paso: 'A = 3.5² = 3.5 × 3.5', resultado: 'A = 12.25 cm²' },
    ],
    curiosidad: 'Dato curioso: si divides un cuadrado por su diagonal, obtienes dos triángulos exactamente iguales. ¡El cuadrado esconde triángulos dentro!',
  },
  {
    nombre: 'Rectángulo',
    color: '#8B5CF6', bgBadge: 'rgba(139,92,246,0.12)',
    borderColor: 'rgba(139,92,246,0.3)', bgFormula: 'rgba(139,92,246,0.06)',
    def: 'Figura con cuatro lados y cuatro ángulos rectos. Lados opuestos iguales.',
    formula: 'A = b × h',
    svg: mkSvg([
      h('rect', { x: 6, y: 20, width: 68, height: 40, rx: 4, fill: 'rgba(139,92,246,0.2)', stroke: '#8B5CF6', 'stroke-width': 2 }),
      h('text', { x: 40, y: 43, 'text-anchor': 'middle', 'font-size': 9, fill: '#8B5CF6', 'font-family': 'DM Sans' }, 'b'),
      h('text', { x: 76, y: 42, 'text-anchor': 'middle', 'font-size': 9, fill: '#8B5CF6', 'font-family': 'DM Sans' }, 'h'),
    ]),
    variables: [
      { var: 'b', desc: 'Base (lado horizontal)' },
      { var: 'h', desc: 'Altura (lado vertical)' },
    ],
    propiedades: [
      'Lados opuestos son paralelos e iguales',
      'Sus cuatro ángulos miden 90°',
      'Sus diagonales son iguales',
      'El cuadrado es un rectángulo especial',
    ],
    ejemplos: [
      { titulo: 'Ejemplo 1', datos: 'b = 8 cm, h = 4 cm', paso: 'A = 8 × 4', resultado: 'A = 32 cm²' },
      { titulo: 'Ejemplo 2', datos: 'b = 15 m, h = 7 m', paso: 'A = 15 × 7', resultado: 'A = 105 m²' },
      { titulo: 'Ejemplo 3', datos: 'b = 6.5 cm, h = 3 cm', paso: 'A = 6.5 × 3', resultado: 'A = 19.5 cm²' },
    ],
curiosidad: 'Dato curioso: una hoja de papel tamaño carta es un rectángulo. Si la doblas por la mitad, obtienes otro rectángulo con las mismas proporciones.',  },
  {
    nombre: 'Triángulo',
    color: '#16a34a', bgBadge: 'rgba(34,197,94,0.12)',
    borderColor: 'rgba(34,197,94,0.3)', bgFormula: 'rgba(34,197,94,0.06)',
    def: 'Figura con tres lados y tres ángulos. La suma de sus ángulos es 180°.',
    formula: 'A = (b × h) / 2',
    svg: mkSvg([
      h('polygon', { points: '40,8 74,72 6,72', fill: 'rgba(34,197,94,0.2)', stroke: '#22C55E', 'stroke-width': 2 }),
      h('text', { x: 40, y: 68, 'text-anchor': 'middle', 'font-size': 9, fill: '#22C55E', 'font-family': 'DM Sans' }, 'b'),
      h('text', { x: 54, y: 44, 'text-anchor': 'middle', 'font-size': 9, fill: '#22C55E', 'font-family': 'DM Sans' }, 'h'),
    ]),
    variables: [
      { var: 'b', desc: 'Base del triángulo' },
      { var: 'h', desc: 'Altura perpendicular a la base' },
    ],
    propiedades: [
      'La suma de sus ángulos internos es 180°',
      'El área es la mitad de la del rectángulo que lo contiene',
      'Puede ser equilátero, isósceles o escaleno',
      'La altura siempre es perpendicular a la base',
    ],
    ejemplos: [
      { titulo: 'Ejemplo 1', datos: 'b = 10 cm, h = 6 cm', paso: 'A = (10 × 6) / 2', resultado: 'A = 30 cm²' },
      { titulo: 'Ejemplo 2', datos: 'b = 14 m, h = 9 m', paso: 'A = (14 × 9) / 2', resultado: 'A = 63 m²' },
      { titulo: 'Ejemplo 3', datos: 'b = 7 cm, h = 4 cm', paso: 'A = (7 × 4) / 2', resultado: 'A = 14 cm²' },
    ],
curiosidad: 'Dato curioso: los puentes y las torres usan forma de triángulo porque es la figura más difícil de deformar. ¡Es la más resistente de todas!',  },
  {
    nombre: 'Círculo',
    color: '#F97316', bgBadge: 'rgba(251,146,60,0.12)',
    borderColor: 'rgba(251,146,60,0.3)', bgFormula: 'rgba(251,146,60,0.06)',
    def: 'Figura perfectamente redonda donde todos los puntos equidistan del centro.',
    formula: 'A = π × r²',
    svg: mkSvg([
      h('circle', { cx: 40, cy: 40, r: 32, fill: 'rgba(251,146,60,0.2)', stroke: '#F97316', 'stroke-width': 2 }),
      h('line', { x1: 40, y1: 40, x2: 72, y2: 40, stroke: '#F97316', 'stroke-width': 1.5, 'stroke-dasharray': 3 }),
      h('text', { x: 56, y: 36, 'text-anchor': 'middle', 'font-size': 9, fill: '#F97316', 'font-family': 'DM Sans' }, 'r'),
      h('circle', { cx: 40, cy: 40, r: 2.5, fill: '#F97316' }),
    ]),
    variables: [
      { var: 'r', desc: 'Radio (del centro al borde)' },
      { var: 'π', desc: 'Pi ≈ 3.1416 (constante)' },
    ],
    propiedades: [
      'Todos los puntos están a igual distancia del centro',
      'El diámetro es el doble del radio (d = 2r)',
      'La circunferencia mide 2πr',
      'Es la figura con mayor área para un perímetro dado',
    ],
    ejemplos: [
      { titulo: 'Ejemplo 1', datos: 'r = 5 cm', paso: 'A = π × 5² = π × 25', resultado: 'A ≈ 78.54 cm²' },
      { titulo: 'Ejemplo 2', datos: 'r = 10 m', paso: 'A = π × 10² = π × 100', resultado: 'A ≈ 314.16 m²' },
      { titulo: 'Ejemplo 3', datos: 'r = 3.5 cm', paso: 'A = π × 3.5² = π × 12.25', resultado: 'A ≈ 38.48 cm²' },
    ],
curiosidad: 'Dato curioso: π (pi) es un número que nunca termina ni se repite: 3.14159265... Los matemáticos han calculado más de 100 billones de sus decimales.',  },
  {
    nombre: 'Trapecio',
    color: '#EC4899', bgBadge: 'rgba(236,72,153,0.12)',
    borderColor: 'rgba(236,72,153,0.3)', bgFormula: 'rgba(236,72,153,0.06)',
    def: 'Cuadrilátero con un par de lados paralelos llamados bases.',
    formula: 'A = (B + b) × h / 2',
    svg: mkSvg([
      h('polygon', { points: '20,16 60,16 74,64 6,64', fill: 'rgba(236,72,153,0.2)', stroke: '#EC4899', 'stroke-width': 2 }),
      h('text', { x: 40, y: 13, 'text-anchor': 'middle', 'font-size': 9, fill: '#EC4899', 'font-family': 'DM Sans' }, 'B'),
      h('text', { x: 40, y: 76, 'text-anchor': 'middle', 'font-size': 9, fill: '#EC4899', 'font-family': 'DM Sans' }, 'b'),
      h('text', { x: 72, y: 42, 'text-anchor': 'middle', 'font-size': 9, fill: '#EC4899', 'font-family': 'DM Sans' }, 'h'),
    ]),
    variables: [
      { var: 'B', desc: 'Base mayor (lado más largo)' },
      { var: 'b', desc: 'Base menor (lado más corto)' },
      { var: 'h', desc: 'Altura perpendicular entre bases' },
    ],
    propiedades: [
      'Tiene exactamente un par de lados paralelos',
      'La fórmula es el promedio de las bases por la altura',
      'Si las bases son iguales se convierte en paralelogramo',
      'Sus ángulos adyacentes entre lados no paralelos suman 180°',
    ],
    ejemplos: [
      { titulo: 'Ejemplo 1', datos: 'B = 10, b = 6, h = 4', paso: 'A = (10 + 6) × 4 / 2', resultado: 'A = 32 cm²' },
      { titulo: 'Ejemplo 2', datos: 'B = 14, b = 8, h = 6', paso: 'A = (14 + 8) × 6 / 2', resultado: 'A = 66 cm²' },
      { titulo: 'Ejemplo 3', datos: 'B = 20, b = 12, h = 5', paso: 'A = (20 + 12) × 5 / 2', resultado: 'A = 80 cm²' },
    ],
curiosidad: 'Dato curioso: muchas presas de agua tienen forma de trapecio vistas de lado, con la base más ancha abajo para soportar mejor el peso del agua.',  },
  {
    nombre: 'Rombo',
    color: '#EF4444', bgBadge: 'rgba(239,68,68,0.12)',
    borderColor: 'rgba(239,68,68,0.3)', bgFormula: 'rgba(239,68,68,0.06)',
    def: 'Cuadrilátero con cuatro lados iguales. Sus diagonales se cortan perpendicularmente.',
    formula: 'A = (d₁ × d₂) / 2',
    svg: mkSvg([
      h('polygon', { points: '40,6 74,40 40,74 6,40', fill: 'rgba(239,68,68,0.2)', stroke: '#EF4444', 'stroke-width': 2 }),
      h('line', { x1: 6, y1: 40, x2: 74, y2: 40, stroke: '#EF4444', 'stroke-width': 1, 'stroke-dasharray': 3 }),
      h('line', { x1: 40, y1: 6, x2: 40, y2: 74, stroke: '#EF4444', 'stroke-width': 1, 'stroke-dasharray': 3 }),
      h('text', { x: 56, y: 37, 'text-anchor': 'middle', 'font-size': 9, fill: '#EF4444', 'font-family': 'DM Sans' }, 'd₁'),
      h('text', { x: 40, y: 30, 'text-anchor': 'middle', 'font-size': 9, fill: '#EF4444', 'font-family': 'DM Sans' }, 'd₂'),
    ]),
    variables: [
      { var: 'd₁', desc: 'Diagonal mayor' },
      { var: 'd₂', desc: 'Diagonal menor' },
    ],
    propiedades: [
      'Sus cuatro lados son iguales',
      'Sus diagonales se cortan en ángulo recto',
      'Las diagonales se bisectan mutuamente',
      'Es un caso especial del paralelogramo',
    ],
    ejemplos: [
      { titulo: 'Ejemplo 1', datos: 'd₁ = 12 cm, d₂ = 8 cm', paso: 'A = (12 × 8) / 2', resultado: 'A = 48 cm²' },
      { titulo: 'Ejemplo 2', datos: 'd₁ = 20 m, d₂ = 15 m', paso: 'A = (20 × 15) / 2', resultado: 'A = 150 m²' },
      { titulo: 'Ejemplo 3', datos: 'd₁ = 9 cm, d₂ = 6 cm', paso: 'A = (9 × 6) / 2', resultado: 'A = 27 cm²' },
    ],
curiosidad: 'Dato curioso: si un rombo tiene sus cuatro ángulos iguales a 90°, ¡se convierte en un cuadrado! Por eso decimos que el cuadrado es un rombo perfecto.',  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

.contenido-page {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ─── Banner ─────────────────────────────── */
.page-banner {
  background: linear-gradient(135deg, #0c1120 0%, #0d1f3c 50%, #0a1628 100%);
  border-radius: 14px;
  padding: 28px 32px;
  border: 0.5px solid rgba(255,255,255,0.08);
}

.page-titulo {
  font-size: 22px;
  font-weight: 700;
  color: #e8f0fe;
  margin: 0;
  letter-spacing: -0.3px;
}

.page-desc {
  font-size: 13px;
  color: #4a6fa5;
  margin: 4px 0 0;
  line-height: 1.6;
}

/* ─── Grid ───────────────────────────────── */
.figuras-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* ─── Card ───────────────────────────────── */
.figura-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
}

.figura-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}

.figura-card--expandida {
  grid-column: span 2;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
}

.figura-card__compacta {
  display: flex;
  gap: 20px;
}

.figura-card__svg {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

.figura-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.figura-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.figura-card__badge {
  font-size: 13px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.figura-card__flecha {
  font-size: 11px;
  color: #94a3b8;
}

.figura-card__def {
  font-size: 13px;
  color: #334155;
  margin: 0;
  line-height: 1.5;
}

/* ─── Fórmula ────────────────────────────── */
.formula-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid;
  border-radius: 8px;
  padding: 8px 14px;
}

.formula-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.formula-text {
  font-size: 16px;
  font-weight: 700;
}

/* ─── Expandida ──────────────────────────── */
.figura-card__expandida-contenido {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.expand-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.expand-seccion {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.expand-titulo {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ─── Variables ──────────────────────────── */
.variables-lista {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.variable-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.variable-key {
  font-weight: 700;
  font-size: 15px;
  width: 28px;
  flex-shrink: 0;
}

.variable-desc { color: #334155; }

/* ─── Propiedades ────────────────────────── */
.propiedades-lista {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.propiedades-lista li {
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
}

/* ─── Ejemplos ───────────────────────────── */
.ejemplos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.ejemplo-card {
  border: 1px solid;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ejemplo-titulo {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin: 0;
}

.ejemplo-datos {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  margin: 0;
}

.ejemplo-paso {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.ejemplo-resultado {
  font-size: 14px;
  font-weight: 700;
  margin: 4px 0 0;
}

/* ─── Curiosidad ─────────────────────────── */
.curiosidad {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid;
  border-radius: 10px;
  padding: 14px 16px;
}

.curiosidad-icon { font-size: 18px; flex-shrink: 0; }

.curiosidad p {
  font-size: 13px;
  color: #334155;
  margin: 0;
  line-height: 1.6;
  font-style: italic;
}

/* ─── Responsivo ─────────────────────────── */
@media (max-width: 768px) {
  .figuras-grid { grid-template-columns: 1fr; }
  .figura-card--expandida { grid-column: span 1; }
  .figura-card__compacta { flex-direction: column; }
  .expand-grid { grid-template-columns: 1fr; }
  .ejemplos-grid { grid-template-columns: 1fr; }
}
</style>