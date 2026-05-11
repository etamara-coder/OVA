<template>
  <div class="eval-page">

    <!-- Banner -->
    <div class="page-banner">
      <div>
        <h1 class="page-titulo">Evaluación Final</h1>
        <p class="page-desc">Demuestra todo lo que aprendiste sobre áreas de figuras geométricas.</p>
      </div>
      <div class="banner-stats">
        <div class="banner-stat"><span class="banner-stat__num">20</span><span class="banner-stat__label">Preguntas</span></div>
        <div class="banner-stat"><span class="banner-stat__num">30'</span><span class="banner-stat__label">Minutos</span></div>
      </div>
    </div>

    <!-- Pantalla de inicio -->
    <div v-if="estado === 'inicio'" class="pantalla-inicio">
      <div class="inicio-card">
        <div class="inicio-emoji">📝</div>
        <h2 class="inicio-titulo">¿Listo para la evaluación?</h2>
        <p class="inicio-desc">
          Tendrás <strong>20 preguntas</strong> sobre todas las figuras geométricas
          y <strong>30 minutos</strong> para completarla.
          Al final verás la retroalimentación detallada de cada pregunta.
        </p>
        <div class="inicio-reglas">
          <div class="regla"><span>⏱️</span><p>El tiempo total es de 30 minutos — avanza a tu ritmo</p></div>
          <div class="regla"><span>🔥</span><p>Consigue rachas de respuestas correctas para bonus</p></div>
          <div class="regla"><span>⚡</span><p>Responde rápido para puntos extra por racha</p></div>
          <div class="regla"><span>📋</span><p>Al final, revisa la retroalimentación de cada pregunta</p></div>
        </div>
        <button class="btn-comenzar" @click="iniciarEvaluacion()">¡Comenzar evaluación!</button>
      </div>
    </div>

    <!-- Pantalla de evaluación -->
    <div v-else-if="estado === 'evaluando'" class="pantalla-eval">

      <!-- HUD -->
      <div class="hud">
        <div class="hud-item">
          <span class="hud-label">Pregunta</span>
          <span class="hud-valor">{{ indice + 1 }}/{{ preguntas.length }}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Puntos</span>
          <span class="hud-valor" style="color:#378ADD">{{ puntos }}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Racha</span>
          <span class="hud-valor" :style="{ color: racha >= 3 ? '#f97316' : '#64748b' }">
            {{ racha >= 3 ? '🔥' : '' }} {{ racha }}
          </span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Tiempo</span>
          <span class="hud-valor" :style="{ color: tiempoTotal < 300 ? '#ef4444' : '#c8d8f0' }">
            {{ formatTiempo(tiempoTotal) }}
          </span>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div class="progreso-wrapper">
        <div class="progreso-barra">
          <div class="progreso-fill" :style="{ width: ((indice) / preguntas.length * 100) + '%' }"></div>
        </div>
      </div>

      <!-- Racha bonus -->
      <Transition name="fade">
        <div v-if="mostrarBonus" class="bonus-badge">🔥 ¡Racha x{{ racha }}! +{{ bonusActual }} puntos extra</div>
      </Transition>

      <!-- Pregunta -->
      <div class="pregunta-card" :style="{ borderColor: preguntaActual.borderColor }">
        <div class="pregunta-header" :style="{ background: preguntaActual.bgLight }">
          <div class="pregunta-figura">
            <span class="pregunta-emoji">{{ preguntaActual.emoji }}</span>
            <span class="pregunta-figura-nombre" :style="{ color: preguntaActual.color }">{{ preguntaActual.figura }}</span>
          </div>
          <div class="pregunta-meta">
            <span class="pregunta-dificultad" :style="{ background: preguntaActual.bgLight, color: preguntaActual.color }">{{ preguntaActual.dificultad }}</span>
          </div>
        </div>
        <div class="pregunta-body">
          <p class="pregunta-texto">{{ preguntaActual.pregunta }}</p>
          <div class="opciones-grid">
            <button
              v-for="op in preguntaActual.opciones"
              :key="op"
              class="opcion-btn"
              :class="{
                correcta:   respondida && op === preguntaActual.correcta,
                incorrecta: respondida && op === respuestaSeleccionada && op !== preguntaActual.correcta,
                seleccionada: !respondida && op === respuestaSeleccionada
              }"
              :disabled="respondida"
              @click="responder(op)"
            >{{ op }}</button>
          </div>

          <!-- Feedback -->
          <Transition name="slide-up">
            <div v-if="respondida" class="feedback" :class="{ correcto: esCorrecta, incorrecto: !esCorrecta }">
              <div class="feedback-icono">{{ esCorrecta ? '✅' : '❌' }}</div>
              <div>
                <p class="feedback-titulo">{{ esCorrecta ? '¡Correcto!' : 'Incorrecto' }}</p>
                <p class="feedback-explicacion">{{ preguntaActual.explicacion }}</p>
              </div>
            </div>
          </Transition>

          <button v-if="respondida" class="btn-siguiente" @click="siguiente">
            {{ indice < preguntas.length - 1 ? 'Siguiente pregunta →' : 'Ver resultado →' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Pantalla de resultado -->
    <div v-else-if="estado === 'resultado'" class="pantalla-resultado">

      <!-- Confeti -->
      <div v-if="nota >= 3" class="confeti-wrapper">
        <div v-for="i in 40" :key="i" class="confeti-particle" :style="confettiStyle(i)"></div>
      </div>

      <div class="resultado-card">
        <div class="resultado-medalla">{{ medalla.emoji }}</div>
        <h2 class="resultado-titulo" :style="{ color: medalla.color }">{{ medalla.titulo }}</h2>
        <p class="resultado-nombre">{{ usuario.nombre || 'Estudiante' }}, obtuviste {{ puntos }} puntos</p>

        <div class="resultado-stats">
          <div class="res-stat" style="border-color:rgba(34,197,94,0.3);background:rgba(34,197,94,0.06)">
            <span class="res-stat__num" style="color:#16a34a">{{ correctas }}</span>
            <span class="res-stat__label">Correctas</span>
          </div>
          <div class="res-stat" style="border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.06)">
            <span class="res-stat__num" style="color:#ef4444">{{ preguntas.length - correctas }}</span>
            <span class="res-stat__label">Incorrectas</span>
          </div>
          <div class="res-stat" :style="{ borderColor: medalla.color + '55', background: medalla.color + '11' }">
            <span class="res-stat__num" :style="{ color: medalla.color }">{{ nota.toFixed(1) }}</span>
            <span class="res-stat__label">Nota / 5.0</span>
          </div>
        </div>

        <!-- Rendimiento por figura -->
        <div class="rendimiento">
          <h3 class="rendimiento-titulo">📊 Rendimiento por figura</h3>
          <div class="rendimiento-grid">
            <div v-for="fig in rendimientoPorFigura" :key="fig.figura" class="rend-item">
              <div class="rend-item__header">
                <span>{{ fig.emoji }} {{ fig.figura }}</span>
                <span :style="{ color: fig.porcentaje >= 50 ? '#16a34a' : '#ef4444' }">{{ fig.correctas }}/{{ fig.total }}</span>
              </div>
              <div class="rend-barra">
                <div class="rend-barra-fill" :style="{ width: fig.porcentaje + '%', background: fig.porcentaje >= 50 ? '#16a34a' : '#ef4444' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revisión completa con retroalimentación -->
        <div class="revision">
          <h3 class="revision-titulo">📋 Revisión completa con retroalimentación</h3>
          <div class="revision-lista">
            <div
              v-for="(p, i) in preguntas"
              :key="i"
              class="revision-item"
              :class="{ correcto: respuestas[i] === p.correcta, incorrecto: respuestas[i] !== p.correcta }"
            >
              <div class="revision-num" :style="{ background: respuestas[i] === p.correcta ? '#16a34a' : '#ef4444' }">{{ i + 1 }}</div>
              <div class="revision-body">
                <p class="revision-pregunta">{{ p.pregunta }}</p>
                <p class="revision-tu">Tu respuesta: <strong :style="{ color: respuestas[i] === p.correcta ? '#16a34a' : '#ef4444' }">{{ respuestas[i] || 'Sin responder' }}</strong></p>
                <p v-if="respuestas[i] !== p.correcta" class="revision-correcta">Correcta: <strong style="color:#16a34a">{{ p.correcta }}</strong></p>
                <p class="revision-expl">{{ p.explicacion }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="resultado-acciones">
          <button class="btn-comenzar" @click="reiniciar">Intentar de nuevo</button>
          <button v-if="preguntas.length - correctas > 0" class="btn-secundario" @click="soloFallidas">
            Repasar fallidas ({{ preguntas.length - correctas }})
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })
import { ref, computed, onUnmounted } from 'vue'
import { useUsuarioStore } from '~/stores/usuario'

const usuario = useUsuarioStore()

// ── Estado ───────────────────────────────────────────────
const estado               = ref('inicio')
const indice               = ref(0)
const puntos               = ref(0)
const racha                = ref(0)
const respondida           = ref(false)
const respuestaSeleccionada = ref(null)
const esCorrecta           = ref(false)
const tiempoTotal          = ref(1800)
const mostrarBonus         = ref(false)
const bonusActual          = ref(0)
const respuestas           = ref([])
const timerTotal           = ref(null)

const formatTiempo = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

// ── Preguntas ────────────────────────────────────────────
const todasPreguntas = [
  // Cuadrado
  { figura:'Cuadrado', emoji:'🟦', color:'#3B82F6', bgLight:'rgba(59,130,246,0.08)', borderColor:'rgba(59,130,246,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del cuadrado?',
    opciones:['A = b × h','A = l²','A = π × r²','A = 4l'], correcta:'A = l²',
    explicacion:'El cuadrado tiene todos sus lados iguales (l), por eso su área es l × l = l².' },
  { figura:'Cuadrado', emoji:'🟦', color:'#3B82F6', bgLight:'rgba(59,130,246,0.08)', borderColor:'rgba(59,130,246,0.3)', dificultad:'Medio',
    pregunta:'Un cuadrado tiene lado de 8 cm. ¿Cuál es su área?',
    opciones:['32 cm²','16 cm²','64 cm²','48 cm²'], correcta:'64 cm²',
    explicacion:'A = l² = 8² = 64 cm².' },
  { figura:'Cuadrado', emoji:'🟦', color:'#3B82F6', bgLight:'rgba(59,130,246,0.08)', borderColor:'rgba(59,130,246,0.3)', dificultad:'Difícil',
    pregunta:'Un piso cuadrado tiene área de 144 m². ¿Cuánto mide cada lado?',
    opciones:['10 m','12 m','14 m','16 m'], correcta:'12 m',
    explicacion:'Si A = l², entonces l = √144 = 12 m.' },

  // Rectángulo
  { figura:'Rectángulo', emoji:'🟩', color:'#8B5CF6', bgLight:'rgba(139,92,246,0.08)', borderColor:'rgba(139,92,246,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del rectángulo?',
    opciones:['A = l²','A = (b+h)/2','A = b × h','A = 2(b+h)'], correcta:'A = b × h',
    explicacion:'El área del rectángulo es base × altura: A = b × h.' },
  { figura:'Rectángulo', emoji:'🟩', color:'#8B5CF6', bgLight:'rgba(139,92,246,0.08)', borderColor:'rgba(139,92,246,0.3)', dificultad:'Medio',
    pregunta:'Una cancha rectangular mide 25 m de base y 15 m de altura. ¿Cuál es su área?',
    opciones:['300 m²','350 m²','375 m²','400 m²'], correcta:'375 m²',
    explicacion:'A = b × h = 25 × 15 = 375 m².' },

  // Triángulo
  { figura:'Triángulo', emoji:'🔺', color:'#16a34a', bgLight:'rgba(34,197,94,0.08)', borderColor:'rgba(34,197,94,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del triángulo?',
    opciones:['A = b × h','A = (b × h) / 2','A = b + h','A = b² / 2'], correcta:'A = (b × h) / 2',
    explicacion:'El triángulo es la mitad de un rectángulo: A = (b × h) / 2.' },
  { figura:'Triángulo', emoji:'🔺', color:'#16a34a', bgLight:'rgba(34,197,94,0.08)', borderColor:'rgba(34,197,94,0.3)', dificultad:'Medio',
    pregunta:'Un triángulo tiene base 14 cm y altura 10 cm. ¿Cuál es su área?',
    opciones:['140 cm²','70 cm²','28 cm²','56 cm²'], correcta:'70 cm²',
    explicacion:'A = (14 × 10) / 2 = 140 / 2 = 70 cm².' },
  { figura:'Triángulo', emoji:'🔺', color:'#16a34a', bgLight:'rgba(34,197,94,0.08)', borderColor:'rgba(34,197,94,0.3)', dificultad:'Difícil',
    pregunta:'Un triángulo tiene área de 60 cm² y base de 12 cm. ¿Cuál es su altura?',
    opciones:['5 cm','8 cm','10 cm','12 cm'], correcta:'10 cm',
    explicacion:'De A = (b × h)/2 → h = (2 × A) / b = (2 × 60) / 12 = 10 cm.' },

  // Círculo
  { figura:'Círculo', emoji:'⭕', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del círculo?',
    opciones:['A = 2πr','A = πd','A = πr²','A = r²'], correcta:'A = πr²',
    explicacion:'El área del círculo es π multiplicado por el radio al cuadrado: A = πr².' },
  { figura:'Círculo', emoji:'⭕', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Medio',
    pregunta:'Un círculo tiene radio de 6 cm. ¿Cuál es su área aproximada?',
    opciones:['113.1 cm²','37.7 cm²','78.5 cm²','150.8 cm²'], correcta:'113.1 cm²',
    explicacion:'A = π × 6² = 3.1416 × 36 ≈ 113.1 cm².' },
  { figura:'Círculo', emoji:'⭕', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Difícil',
    pregunta:'Una pizza circular tiene área de 314.16 cm². ¿Cuál es su radio?',
    opciones:['5 cm','8 cm','10 cm','12 cm'], correcta:'10 cm',
    explicacion:'De A = πr² → r = √(A/π) = √(314.16/3.1416) = √100 = 10 cm.' },

  // Trapecio
  { figura:'Trapecio', emoji:'🔶', color:'#EC4899', bgLight:'rgba(236,72,153,0.08)', borderColor:'rgba(236,72,153,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del trapecio?',
    opciones:['A = b × h','A = (B + b) × h / 2','A = d₁ × d₂ / 2','A = (B × b) / h'], correcta:'A = (B + b) × h / 2',
    explicacion:'El trapecio tiene dos bases (B y b) y altura h. Se suman las bases, se multiplica por h y se divide entre 2.' },
  { figura:'Trapecio', emoji:'🔶', color:'#EC4899', bgLight:'rgba(236,72,153,0.08)', borderColor:'rgba(236,72,153,0.3)', dificultad:'Medio',
    pregunta:'Un trapecio tiene B = 16 cm, b = 10 cm, h = 8 cm. ¿Cuál es su área?',
    opciones:['96 cm²','104 cm²','112 cm²','208 cm²'], correcta:'104 cm²',
    explicacion:'A = (16 + 10) × 8 / 2 = 26 × 8 / 2 = 208 / 2 = 104 cm².' },

  // Rombo
  { figura:'Rombo', emoji:'🔷', color:'#EF4444', bgLight:'rgba(239,68,68,0.08)', borderColor:'rgba(239,68,68,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del rombo?',
    opciones:['A = l²','A = b × h','A = (d₁ × d₂) / 2','A = 4l'], correcta:'A = (d₁ × d₂) / 2',
    explicacion:'El rombo usa sus dos diagonales (d₁ y d₂): A = (d₁ × d₂) / 2.' },
  { figura:'Rombo', emoji:'🔷', color:'#EF4444', bgLight:'rgba(239,68,68,0.08)', borderColor:'rgba(239,68,68,0.3)', dificultad:'Medio',
    pregunta:'Un rombo tiene diagonales de 18 cm y 12 cm. ¿Cuál es su área?',
    opciones:['108 cm²','216 cm²','60 cm²','72 cm²'], correcta:'108 cm²',
    explicacion:'A = (18 × 12) / 2 = 216 / 2 = 108 cm².' },

  // Paralelogramo
  { figura:'Paralelogramo', emoji:'🔹', color:'#0891b2', bgLight:'rgba(8,145,178,0.08)', borderColor:'rgba(8,145,178,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del paralelogramo?',
    opciones:['A = l²','A = b × h','A = (b + h) / 2','A = 2b + 2h'], correcta:'A = b × h',
    explicacion:'El paralelogramo usa base × altura perpendicular: A = b × h. La altura NO es el lado inclinado.' },
  { figura:'Paralelogramo', emoji:'🔹', color:'#0891b2', bgLight:'rgba(8,145,178,0.08)', borderColor:'rgba(8,145,178,0.3)', dificultad:'Difícil',
    pregunta:'Un paralelogramo tiene base 12 cm y lado inclinado 8 cm. Si el ángulo es 30°, ¿cuál es su área aproximada?',
    opciones:['48 cm²','96 cm²','55.4 cm²','83.1 cm²'], correcta:'48 cm²',
    explicacion:'h = 8 × sin(30°) = 8 × 0.5 = 4 cm. A = 12 × 4 = 48 cm².' },

  // Pentágono
  { figura:'Pentágono Regular', emoji:'⭐', color:'#7c3aed', bgLight:'rgba(124,58,237,0.08)', borderColor:'rgba(124,58,237,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del pentágono regular?',
    opciones:['A = 5l','A = (P × a) / 2','A = l²× 5','A = P / a'], correcta:'A = (P × a) / 2',
    explicacion:'P es el perímetro (5 × lado) y a es la apotema. A = (P × a) / 2.' },
  { figura:'Pentágono Regular', emoji:'⭐', color:'#7c3aed', bgLight:'rgba(124,58,237,0.08)', borderColor:'rgba(124,58,237,0.3)', dificultad:'Medio',
    pregunta:'Un pentágono regular tiene lado 10 cm y apotema 6.88 cm. ¿Cuál es su área aproximada?',
    opciones:['172 cm²','344 cm²','86 cm²','200 cm²'], correcta:'172 cm²',
    explicacion:'P = 5 × 10 = 50 cm. A = (50 × 6.88) / 2 = 344 / 2 = 172 cm².' },
]

const preguntas    = ref([])
const preguntaActual = computed(() => preguntas.value[indice.value] || {})
const correctas    = computed(() => respuestas.value.filter((r, i) => r === preguntas.value[i]?.correcta).length)
const nota         = computed(() => +(correctas.value / preguntas.value.length * 5).toFixed(1))

const medalla = computed(() => {
  if (nota.value >= 4.5) return { emoji:'🏆', titulo:'¡Sobresaliente!',  color:'#F59E0B' }
  if (nota.value >= 4.0) return { emoji:'🥇', titulo:'¡Excelente!',      color:'#F97316' }
  if (nota.value >= 3.5) return { emoji:'🥈', titulo:'¡Muy bien!',       color:'#8B5CF6' }
  if (nota.value >= 3.0) return { emoji:'🥉', titulo:'¡Aprobado!',       color:'#3B82F6' }
  return                        { emoji:'📚', titulo:'Sigue practicando', color:'#EF4444' }
})

const rendimientoPorFigura = computed(() => {
  const figuras = {}
  preguntas.value.forEach((p, i) => {
    if (!figuras[p.figura]) figuras[p.figura] = { figura: p.figura, emoji: p.emoji, total: 0, correctas: 0 }
    figuras[p.figura].total++
    if (respuestas.value[i] === p.correcta) figuras[p.figura].correctas++
  })
  return Object.values(figuras).map(f => ({ ...f, porcentaje: Math.round(f.correctas / f.total * 100) }))
})

// ── Métodos ──────────────────────────────────────────────
const iniciarEvaluacion = (pqs) => {
  preguntas.value = (Array.isArray(pqs) ? [...pqs] : [...todasPreguntas]).sort(() => Math.random() - 0.5)
  respuestas.value = new Array(preguntas.value.length).fill(null)
  indice.value = 0
  puntos.value = 0
  racha.value = 0
  respondida.value = false
  respuestaSeleccionada.value = null
  tiempoTotal.value = 1800
  estado.value = 'evaluando'
  clearInterval(timerTotal.value)
  timerTotal.value = setInterval(() => {
    tiempoTotal.value--
    if (tiempoTotal.value <= 0) {
      clearInterval(timerTotal.value)
      finalizarEvaluacion()
    }
  }, 1000)
}

const responder = (op) => {
  if (respondida.value) return
  respuestaSeleccionada.value = op
  respondida.value = true
  respuestas.value[indice.value] = op

  if (op === preguntaActual.value.correcta) {
    esCorrecta.value = true
    racha.value++
    let bonus = 10
    if (racha.value >= 3) {
      bonusActual.value = racha.value * 2
      bonus += bonusActual.value
      mostrarBonus.value = true
      setTimeout(() => mostrarBonus.value = false, 2000)
    }
    puntos.value += bonus
  } else {
    esCorrecta.value = false
    racha.value = 0
  }
}

const siguiente = () => {
  if (indice.value < preguntas.value.length - 1) {
    indice.value++
    respondida.value = false
    respuestaSeleccionada.value = null
  } else {
    finalizarEvaluacion()
  }
}

const finalizarEvaluacion = () => {
  clearInterval(timerTotal.value)
  estado.value = 'resultado'
}

const reiniciar = () => {
  clearInterval(timerTotal.value)
  estado.value = 'inicio'
}

const soloFallidas = () => {
  const fallidas = preguntas.value.filter((p, i) => respuestas.value[i] !== p.correcta)
  iniciarEvaluacion(fallidas)
}

const confettiStyle = (i) => ({
  left: (Math.random() * 100) + '%',
  animationDelay: (Math.random() * 3) + 's',
  animationDuration: (2 + Math.random() * 2) + 's',
  background: ['#378ADD','#F97316','#16a34a','#EC4899','#EF4444','#8B5CF6','#F59E0B'][i % 7],
})

onUnmounted(() => { clearInterval(timerTotal.value) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.eval-page { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:24px; }

/* Banner */
.page-banner { background:linear-gradient(135deg,#0c1120 0%,#0d1f3c 50%,#0a1628 100%); border-radius:14px; padding:28px 32px; border:0.5px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; }
.page-titulo { font-size:22px; font-weight:700; color:#e8f0fe; margin:0 0 6px; letter-spacing:-0.3px; }
.page-desc   { font-size:13px; color:#4a6fa5; margin:0; line-height:1.6; }
.banner-stats { display:flex; gap:24px; flex-shrink:0; }
.banner-stat  { display:flex; flex-direction:column; align-items:center; }
.banner-stat__num   { font-size:24px; font-weight:700; color:#e8f0fe; }
.banner-stat__label { font-size:11px; color:#4a6fa5; }

/* Inicio */
.pantalla-inicio { display:flex; justify-content:center; }
.inicio-card { background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:40px; max-width:560px; width:100%; text-align:center; box-shadow:0 4px 20px rgba(0,0,0,0.06); display:flex; flex-direction:column; align-items:center; gap:16px; }
.inicio-emoji  { font-size:56px; }
.inicio-titulo { font-size:22px; font-weight:700; color:#1e293b; margin:0; }
.inicio-desc   { font-size:14px; color:#64748b; margin:0; line-height:1.6; }
.inicio-reglas { display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%; text-align:left; }
.regla { display:flex; align-items:flex-start; gap:8px; background:#f8fafc; border-radius:10px; padding:10px 12px; }
.regla span { font-size:18px; flex-shrink:0; }
.regla p    { font-size:12px; color:#475569; margin:0; line-height:1.4; }

.btn-comenzar { background:#378ADD; color:#fff; border:none; border-radius:12px; padding:14px 32px; font-size:15px; font-weight:700; cursor:pointer; transition:background 0.2s; width:100%; max-width:320px; }
.btn-comenzar:hover { background:#2a6ab5; }

/* HUD */
.hud { display:flex; align-items:center; justify-content:space-between; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:12px 20px; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.hud-item  { display:flex; flex-direction:column; align-items:center; gap:2px; }
.hud-label { font-size:10px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; }
.hud-valor { font-size:16px; font-weight:700; color:#1e293b; }

/* Progreso */
.progreso-wrapper { background:#e2e8f0; border-radius:4px; height:6px; overflow:hidden; }
.progreso-barra   { width:100%; height:100%; }
.progreso-fill    { height:100%; background:linear-gradient(90deg,#378ADD,#8B5CF6); border-radius:4px; transition:width 0.4s; }

/* Bonus */
.bonus-badge { background:linear-gradient(135deg,#f97316,#ec4899); color:#fff; font-size:14px; font-weight:700; padding:10px 20px; border-radius:20px; text-align:center; box-shadow:0 4px 12px rgba(249,115,22,0.3); }

/* Pregunta */
.pregunta-card { background:#fff; border:1.5px solid; border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
.pregunta-header { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; }
.pregunta-figura { display:flex; align-items:center; gap:10px; }
.pregunta-emoji  { font-size:24px; }
.pregunta-figura-nombre { font-size:14px; font-weight:700; }
.pregunta-meta   { display:flex; align-items:center; gap:10px; }
.pregunta-dificultad { font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; }
.pregunta-body  { padding:24px; display:flex; flex-direction:column; gap:16px; }
.pregunta-texto { font-size:17px; font-weight:600; color:#1e293b; margin:0; line-height:1.4; }

/* Opciones */
.opciones-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.opcion-btn { padding:12px 16px; border-radius:10px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:14px; font-weight:500; cursor:pointer; color:#334155; transition:all 0.15s; text-align:left; }
.opcion-btn:hover:not(:disabled) { border-color:#378ADD; background:rgba(56,138,221,0.06); }
.opcion-btn.seleccionada { border-color:#378ADD; background:rgba(56,138,221,0.08); }
.opcion-btn.correcta     { background:rgba(34,197,94,0.12);  border-color:#22c55e; color:#16a34a; font-weight:700; }
.opcion-btn.incorrecta   { background:rgba(239,68,68,0.12);  border-color:#ef4444; color:#dc2626; font-weight:700; }

/* Feedback */
.feedback { display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border-radius:10px; border:1px solid; }
.feedback.correcto   { background:rgba(34,197,94,0.08);  border-color:rgba(34,197,94,0.3); }
.feedback.incorrecto { background:rgba(239,68,68,0.08);  border-color:rgba(239,68,68,0.3); }
.feedback-icono      { font-size:20px; flex-shrink:0; }
.feedback-titulo     { font-size:14px; font-weight:700; color:#1e293b; margin:0 0 4px; }
.feedback-explicacion { font-size:13px; color:#475569; margin:0; line-height:1.5; }

.btn-siguiente { background:#1e293b; color:#fff; border:none; border-radius:10px; padding:12px 24px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s; align-self:flex-end; }
.btn-siguiente:hover { background:#0f172a; }

/* Resultado */
.pantalla-resultado { position:relative; }
.confeti-wrapper    { position:fixed; inset:0; pointer-events:none; z-index:50; overflow:hidden; }
.confeti-particle   { position:absolute; top:-10px; width:8px; height:8px; border-radius:2px; animation:caer linear infinite; }
@keyframes caer { 0%{top:-10px;transform:rotate(0deg)} 100%{top:100vh;transform:rotate(720deg)} }

.resultado-card   { background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:36px; display:flex; flex-direction:column; align-items:center; gap:20px; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
.resultado-medalla { font-size:64px; }
.resultado-titulo  { font-size:24px; font-weight:700; margin:0; }
.resultado-nombre  { font-size:15px; color:#64748b; margin:0; }

.resultado-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; width:100%; }
.res-stat        { display:flex; flex-direction:column; align-items:center; gap:4px; padding:16px; border-radius:12px; border:1px solid; }
.res-stat__num   { font-size:28px; font-weight:700; }
.res-stat__label { font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase; }

/* Rendimiento */
.rendimiento       { width:100%; }
.rendimiento-titulo { font-size:15px; font-weight:700; color:#1e293b; margin:0 0 12px; }
.rendimiento-grid  { display:flex; flex-direction:column; gap:8px; }
.rend-item         { display:flex; flex-direction:column; gap:4px; }
.rend-item__header { display:flex; justify-content:space-between; font-size:13px; font-weight:500; color:#334155; }
.rend-barra        { height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.rend-barra-fill   { height:100%; border-radius:3px; transition:width 0.6s; }

/* Revisión */
.revision       { width:100%; }
.revision-titulo { font-size:15px; font-weight:700; color:#1e293b; margin:0 0 12px; }
.revision-lista  { display:flex; flex-direction:column; gap:10px; }
.revision-item   { display:flex; gap:12px; padding:14px; border-radius:10px; border:1px solid; }
.revision-item.correcto   { background:rgba(34,197,94,0.05);  border-color:rgba(34,197,94,0.2); }
.revision-item.incorrecto { background:rgba(239,68,68,0.05);  border-color:rgba(239,68,68,0.2); }
.revision-num    { width:26px; height:26px; border-radius:50%; color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.revision-body   { flex:1; display:flex; flex-direction:column; gap:3px; }
.revision-pregunta { font-size:13px; font-weight:600; color:#1e293b; margin:0; }
.revision-tu       { font-size:12px; color:#475569; margin:0; }
.revision-correcta { font-size:12px; color:#475569; margin:0; }
.revision-expl     { font-size:11.5px; color:#64748b; margin:0; line-height:1.4; font-style:italic; }

.resultado-acciones { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; width:100%; }
.btn-secundario { background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; border-radius:12px; padding:14px 24px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s; }
.btn-secundario:hover { background:#e2e8f0; }

/* Transiciones */
.fade-enter-active, .fade-leave-active { transition:opacity 0.3s; }
.fade-enter-from,   .fade-leave-to     { opacity:0; }
.slide-up-enter-active { transition:all 0.3s ease; }
.slide-up-enter-from   { opacity:0; transform:translateY(10px); }

/* Responsive */
@media(max-width:768px) {
  .hud                { flex-wrap:wrap; gap:8px; }
  .opciones-grid      { grid-template-columns:1fr; }
  .resultado-stats    { grid-template-columns:repeat(2,1fr); }
  .inicio-reglas      { grid-template-columns:1fr; }
  .banner-stats       { display:none; }
  .resultado-acciones { flex-direction:column; }
  .btn-comenzar, .btn-secundario { max-width:100%; }
}
</style>