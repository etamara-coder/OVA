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

    <!-- ── INICIO ─────────────────────────────────────── -->
    <div v-if="estado === 'inicio'" class="pantalla-inicio">
      <div class="inicio-card">
        <div class="inicio-emoji">📝</div>
        <h2 class="inicio-titulo">¿Listo para la evaluación?</h2>
        <p class="inicio-desc">
          Tendrás <strong>20 preguntas</strong> de diferentes tipos y <strong>30 minutos</strong> para completarla.
          Al finalizar verás tu resultado con retroalimentación detallada.
        </p>
        <div class="inicio-tipos">
          <div class="tipo-chip"><span>🔘</span> Selección múltiple</div>
          <div class="tipo-chip"><span>✏️</span> Completar fórmula</div>
          <div class="tipo-chip"><span>🧮</span> Calcular área</div>
          <div class="tipo-chip"><span>🔍</span> Identificar figura</div>
          <div class="tipo-chip"><span>✅</span> Verdadero o Falso</div>
        </div>
        <div class="inicio-reglas">
          <div class="regla"><span>🔥</span><p>Rachas de aciertos dan puntos bonus</p></div>
          <div class="regla"><span>⚡</span><p>Responder rápido da puntos extra</p></div>
          <div class="regla"><span>📊</span><p>Verás tu rendimiento por figura al final</p></div>
          <div class="regla"><span>🏆</span><p>Obtén medalla según tu puntaje</p></div>
        </div>
        <button class="btn-comenzar" @click="iniciarEvaluacion">¡Comenzar evaluación!</button>
      </div>
    </div>

    <!-- ── EVALUANDO ──────────────────────────────────── -->
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
          <span class="hud-valor" :style="{ color: tiempoTotal < 300 ? '#ef4444' : '#1e293b' }">
            {{ formatTiempo(tiempoTotal) }}
          </span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Tipo</span>
          <span class="hud-tipo" :style="{ background: tipoColor(preguntaActual.tipo) + '22', color: tipoColor(preguntaActual.tipo) }">
            {{ tipoLabel(preguntaActual.tipo) }}
          </span>
        </div>
      </div>

      <!-- Progreso -->
      <div class="progreso-wrapper">
        <div class="progreso-fill" :style="{ width: (indice / preguntas.length * 100) + '%' }"></div>
      </div>

      <!-- Bonus -->
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
          <span class="pregunta-dificultad" :style="{ background: preguntaActual.color + '22', color: preguntaActual.color }">
            {{ preguntaActual.dificultad }}
          </span>
        </div>

        <div class="pregunta-body">
          <p class="pregunta-texto">{{ preguntaActual.pregunta }}</p>

          <!-- TIPO 1: Selección múltiple -->
          <div v-if="preguntaActual.tipo === 'multiple'" class="opciones-grid">
            <button
              v-for="op in preguntaActual.opciones" :key="op"
              class="opcion-btn"
              :class="{
                correcta:   respondida && op === preguntaActual.correcta,
                incorrecta: respondida && op === respuestaSeleccionada && op !== preguntaActual.correcta,
              }"
              :disabled="respondida"
              @click="responder(op)"
            >{{ op }}</button>
          </div>

          <!-- TIPO 2: Completar fórmula -->
          <div v-else-if="preguntaActual.tipo === 'completar'" class="completar-box">
            <div class="formula-display">
              <span v-for="(parte, i) in preguntaActual.partes" :key="i">
                <span v-if="parte === '__'" class="formula-blank">
                  <span v-if="!respondida">___</span>
                  <span v-else :style="{ color: respuestaSeleccionada === preguntaActual.correcta ? '#16a34a' : '#ef4444' }">
                    {{ respuestaSeleccionada }}
                  </span>
                </span>
                <span v-else class="formula-parte">{{ parte }}</span>
              </span>
            </div>
            <div class="completar-opciones">
              <button
                v-for="op in preguntaActual.opciones" :key="op"
                class="completar-btn"
                :class="{
                  correcta:   respondida && op === preguntaActual.correcta,
                  incorrecta: respondida && op === respuestaSeleccionada && op !== preguntaActual.correcta,
                }"
                :disabled="respondida"
                @click="responder(op)"
              >{{ op }}</button>
            </div>
          </div>

          <!-- TIPO 3: Calcular área -->
          <div v-else-if="preguntaActual.tipo === 'calcular'" class="calcular-box">
            <div class="calcular-datos">
              <div v-for="dato in preguntaActual.datos" :key="dato" class="dato-chip">📌 {{ dato }}</div>
            </div>
            <div class="calcular-input-row">
              <span class="calcular-label">Área =</span>
              <input
                v-model="inputCalculo"
                type="number"
                class="calcular-input"
                placeholder="0"
                :disabled="respondida"
                @keyup.enter="responderCalculo"
              />
              <span class="calcular-unidad">cm²</span>
            </div>
            <button v-if="!respondida" class="btn-calcular" @click="responderCalculo">Confirmar</button>
            <div v-if="respondida" class="calcular-resultado" :class="{ correcto: esCorrecta, incorrecto: !esCorrecta }">
              {{ esCorrecta ? '✅ ¡Correcto!' : `❌ La respuesta era ${preguntaActual.correcta} cm²` }}
            </div>
          </div>

          <!-- TIPO 4: Identificar figura -->
          <div v-else-if="preguntaActual.tipo === 'identificar'" class="identificar-box">
            <div class="identificar-datos">
              <div v-for="dato in preguntaActual.datos" :key="dato" class="dato-chip">📌 {{ dato }}</div>
              <div class="identificar-area">Área = <strong>{{ preguntaActual.area }}</strong></div>
            </div>
            <div class="opciones-grid">
              <button
                v-for="op in preguntaActual.opciones" :key="op"
                class="opcion-btn"
                :class="{
                  correcta:   respondida && op === preguntaActual.correcta,
                  incorrecta: respondida && op === respuestaSeleccionada && op !== preguntaActual.correcta,
                }"
                :disabled="respondida"
                @click="responder(op)"
              >{{ op }}</button>
            </div>
          </div>

          <!-- TIPO 5: Verdadero o Falso -->
          <div v-else-if="preguntaActual.tipo === 'vof'" class="vof-box">
            <div class="vof-opciones">
              <button
                class="vof-btn vof-btn--verdadero"
                :class="{
                  correcta:   respondida && 'Verdadero' === preguntaActual.correcta,
                  incorrecta: respondida && respuestaSeleccionada === 'Verdadero' && 'Verdadero' !== preguntaActual.correcta,
                }"
                :disabled="respondida"
                @click="responder('Verdadero')"
              >✅ Verdadero</button>
              <button
                class="vof-btn vof-btn--falso"
                :class="{
                  correcta:   respondida && 'Falso' === preguntaActual.correcta,
                  incorrecta: respondida && respuestaSeleccionada === 'Falso' && 'Falso' !== preguntaActual.correcta,
                }"
                :disabled="respondida"
                @click="responder('Falso')"
              >❌ Falso</button>
            </div>
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

    <!-- ── RESULTADO ───────────────────────────────────── -->
    <div v-else-if="estado === 'resultado'" class="pantalla-resultado">

      <div v-if="nota >= 3" class="confeti-wrapper">
        <div v-for="i in 40" :key="i" class="confeti-particle" :style="confettiStyle(i)"></div>
      </div>

      <div class="resultado-card">
        <div class="resultado-medalla">{{ medalla.emoji }}</div>
        <h2 class="resultado-titulo" :style="{ color: medalla.color }">{{ medalla.titulo }}</h2>
        <p class="resultado-nombre">{{ usuario.nombre || 'Estudiante' }}, estos son tus resultados:</p>

        <div class="resultado-stats">
          <div class="res-stat" style="border-color:rgba(34,197,94,0.3);background:rgba(34,197,94,0.06)">
            <span class="res-stat__num" style="color:#16a34a">{{ correctas }}</span>
            <span class="res-stat__label">Correctas</span>
          </div>
          <div class="res-stat" style="border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.06)">
            <span class="res-stat__num" style="color:#ef4444">{{ preguntas.length - correctas }}</span>
            <span class="res-stat__label">Incorrectas</span>
          </div>
          <div class="res-stat" style="border-color:rgba(56,138,221,0.3);background:rgba(56,138,221,0.06)">
            <span class="res-stat__num" style="color:#378ADD">{{ puntos }}</span>
            <span class="res-stat__label">Puntos</span>
          </div>
          <div class="res-stat" :style="{ borderColor: medalla.color + '55', background: medalla.color + '11' }">
            <span class="res-stat__num" :style="{ color: medalla.color }">{{ nota.toFixed(1) }}</span>
            <span class="res-stat__label">Nota / 5.0</span>
          </div>
        </div>

        <!-- Rendimiento por tipo -->
        <div class="rendimiento">
          <h3 class="rendimiento-titulo">📊 Rendimiento por tipo de pregunta</h3>
          <div class="rendimiento-grid">
            <div v-for="t in rendimientoPorTipo" :key="t.tipo" class="rend-item">
              <div class="rend-item__header">
                <span>{{ t.emoji }} {{ t.label }}</span>
                <span :style="{ color: t.porcentaje >= 50 ? '#16a34a' : '#ef4444', fontWeight: 600 }">{{ t.correctas }}/{{ t.total }}</span>
              </div>
              <div class="rend-barra">
                <div class="rend-barra-fill" :style="{ width: t.porcentaje + '%', background: t.porcentaje >= 50 ? '#16a34a' : '#ef4444' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revisión completa -->
        <div class="revision">
          <h3 class="revision-titulo">📋 Revisión completa de respuestas</h3>
          <div class="revision-lista">
            <div
              v-for="(p, i) in preguntas" :key="i"
              class="revision-item"
              :class="{ correcto: esRespuestaCorrecta(i), incorrecto: !esRespuestaCorrecta(i) }"
            >
              <div class="revision-left">
                <div class="revision-num" :style="{ background: esRespuestaCorrecta(i) ? '#16a34a' : '#ef4444' }">{{ i + 1 }}</div>
                <div class="revision-figura-tag" :style="{ background: p.bgLight, color: p.color }">{{ p.emoji }} {{ p.figura }}</div>
                <div class="revision-tipo-tag" :style="{ background: tipoColor(p.tipo) + '22', color: tipoColor(p.tipo) }">{{ tipoLabel(p.tipo) }}</div>
              </div>
              <div class="revision-body">
                <div class="revision-top-row">
                  <span class="revision-dificultad" :style="{ color: p.color }">{{ p.dificultad }}</span>
                  <span class="revision-estado">{{ esRespuestaCorrecta(i) ? '✅ Correcta' : '❌ Incorrecta' }}</span>
                </div>
                <p class="revision-pregunta">{{ p.pregunta }}</p>
                <div class="revision-respuestas">
                  <p class="revision-tu">Tu respuesta: <strong :style="{ color: esRespuestaCorrecta(i) ? '#16a34a' : '#ef4444' }">{{ respuestas[i] ?? 'Sin responder' }}</strong></p>
                  <p v-if="!esRespuestaCorrecta(i)" class="revision-correcta">Respuesta correcta: <strong style="color:#16a34a">{{ p.tipo === 'calcular' ? p.correcta + ' cm²' : p.correcta }}</strong></p>
                </div>
                <div class="revision-retro">
                  <span class="revision-retro-label">💡 Retroalimentación</span>
                  <p class="revision-expl">{{ p.explicacion }}</p>
                </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUsuarioStore } from '~/stores/usuario'
const usuario = useUsuarioStore()
onMounted(() => usuario.marcarVisitada('/dashboard/evaluacion'))

// ── Utilidad: barajar array ──────────────────────────────
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

const estado = ref('inicio')
const indice = ref(0)
const puntos = ref(0)
const racha  = ref(0)
const respondida = ref(false)
const respuestaSeleccionada = ref(null)
const esCorrecta = ref(false)
const tiempoTotal = ref(1800)
const mostrarBonus = ref(false)
const bonusActual  = ref(0)
const respuestas   = ref([])
const timerTotal   = ref(null)
const tiempoRespuesta = ref(0)
const timerRespuesta  = ref(null)
const inputCalculo = ref('')
const preguntas    = ref([])

const formatTiempo = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

const tipoLabel = (tipo) => ({ multiple:'Selección múltiple', completar:'Completar fórmula', calcular:'Calcular área', identificar:'Identificar figura', vof:'Verdadero o Falso' })[tipo] || tipo
const tipoColor = (tipo) => ({ multiple:'#3B82F6', completar:'#8B5CF6', calcular:'#16a34a', identificar:'#F97316', vof:'#EC4899' })[tipo] || '#64748b'
const tipoEmoji = (tipo) => ({ multiple:'🔘', completar:'✏️', calcular:'🧮', identificar:'🔍', vof:'✅' })[tipo] || '❓'

// ── BANCO DE PREGUNTAS ───────────────────────────────────
const banco = [
  // SELECCIÓN MÚLTIPLE
  { tipo:'multiple', figura:'Cuadrado', emoji:'🟦', color:'#3B82F6', bgLight:'rgba(59,130,246,0.08)', borderColor:'rgba(59,130,246,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del cuadrado?', opciones:['A = b × h','A = l²','A = π × r²','A = 4l'], correcta:'A = l²',
    explicacion:'El cuadrado tiene todos sus lados iguales (l). Su área es l × l = l².' },
  { tipo:'multiple', figura:'Rectángulo', emoji:'🟩', color:'#8B5CF6', bgLight:'rgba(139,92,246,0.08)', borderColor:'rgba(139,92,246,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del rectángulo?', opciones:['A = l²','A = b × h','A = 2(b+h)','A = (b+h)/2'], correcta:'A = b × h',
    explicacion:'El área del rectángulo es base × altura: A = b × h.' },
  { tipo:'multiple', figura:'Triángulo', emoji:'🔺', color:'#16a34a', bgLight:'rgba(34,197,94,0.08)', borderColor:'rgba(34,197,94,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del triángulo?', opciones:['A = b × h','A = b²/2','A = (b × h)/2','A = b+h'], correcta:'A = (b × h)/2',
    explicacion:'El triángulo es la mitad de un rectángulo: A = (b × h) / 2.' },
  { tipo:'multiple', figura:'Círculo', emoji:'⭕', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Fácil',
    pregunta:'¿Cuál es la fórmula del área del círculo?', opciones:['A = 2πr','A = πd','A = πr²','A = r²'], correcta:'A = πr²',
    explicacion:'El área del círculo es π multiplicado por el radio al cuadrado: A = πr².' },
  { tipo:'multiple', figura:'Rombo', emoji:'🔷', color:'#EF4444', bgLight:'rgba(239,68,68,0.08)', borderColor:'rgba(239,68,68,0.3)', dificultad:'Medio',
    pregunta:'Un rombo tiene diagonales de 18 cm y 12 cm. ¿Cuál es su área?', opciones:['108 cm²','216 cm²','60 cm²','72 cm²'], correcta:'108 cm²',
    explicacion:'A = (d₁ × d₂) / 2 = (18 × 12) / 2 = 216 / 2 = 108 cm².' },
  { tipo:'multiple', figura:'Trapecio', emoji:'🔶', color:'#EC4899', bgLight:'rgba(236,72,153,0.08)', borderColor:'rgba(236,72,153,0.3)', dificultad:'Medio',
    pregunta:'Un trapecio tiene B=16, b=10 y h=8. ¿Cuál es su área?', opciones:['96 cm²','104 cm²','112 cm²','208 cm²'], correcta:'104 cm²',
    explicacion:'A = (B + b) × h / 2 = (16 + 10) × 8 / 2 = 26 × 8 / 2 = 104 cm².' },
  { tipo:'multiple', figura:'Cuadrado', emoji:'🟦', color:'#3B82F6', bgLight:'rgba(59,130,246,0.08)', borderColor:'rgba(59,130,246,0.3)', dificultad:'Difícil',
    pregunta:'Un piso cuadrado tiene área de 225 m². ¿Cuánto mide cada lado?', opciones:['12 m','13 m','15 m','16 m'], correcta:'15 m',
    explicacion:'De A = l² despejamos l = √225 = 15 m.' },

  // COMPLETAR FÓRMULA
  { tipo:'completar', figura:'Cuadrado', emoji:'🟦', color:'#3B82F6', bgLight:'rgba(59,130,246,0.08)', borderColor:'rgba(59,130,246,0.3)', dificultad:'Fácil',
    pregunta:'Completa la fórmula del área del cuadrado:', partes:['A', ' = ', '__', '²'], opciones:['l','b','r','d'], correcta:'l',
    explicacion:'El cuadrado usa la longitud del lado (l): A = l².' },
  { tipo:'completar', figura:'Círculo', emoji:'⭕', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Fácil',
    pregunta:'Completa la fórmula del área del círculo:', partes:['A', ' = ', 'π', ' × ', '__', '²'], opciones:['r','d','l','h'], correcta:'r',
    explicacion:'El círculo usa el radio (r): A = π × r².' },
  { tipo:'completar', figura:'Triángulo', emoji:'🔺', color:'#16a34a', bgLight:'rgba(34,197,94,0.08)', borderColor:'rgba(34,197,94,0.3)', dificultad:'Medio',
    pregunta:'Completa la fórmula del área del triángulo:', partes:['A', ' = ', '(b × h)', ' / ', '__'], opciones:['2','3','π','4'], correcta:'2',
    explicacion:'El triángulo divide entre 2 porque es la mitad de un rectángulo: A = (b × h) / 2.' },
  { tipo:'completar', figura:'Rombo', emoji:'🔷', color:'#EF4444', bgLight:'rgba(239,68,68,0.08)', borderColor:'rgba(239,68,68,0.3)', dificultad:'Medio',
    pregunta:'Completa la fórmula del área del rombo:', partes:['A', ' = ', '(d₁ × ', '__', ')', ' / 2'], opciones:['d₂','d₁','h','b'], correcta:'d₂',
    explicacion:'El rombo usa sus dos diagonales: A = (d₁ × d₂) / 2.' },
  { tipo:'completar', figura:'Pentágono Regular', emoji:'⭐', color:'#7c3aed', bgLight:'rgba(124,58,237,0.08)', borderColor:'rgba(124,58,237,0.3)', dificultad:'Difícil',
    pregunta:'Completa la fórmula del pentágono regular:', partes:['A', ' = ', '(', '__', ' × a)', ' / 2'], opciones:['P','l','b','d'], correcta:'P',
    explicacion:'El pentágono usa el Perímetro (P) y la apotema (a): A = (P × a) / 2.' },

  // CALCULAR ÁREA
  { tipo:'calcular', figura:'Cuadrado', emoji:'🟦', color:'#3B82F6', bgLight:'rgba(59,130,246,0.08)', borderColor:'rgba(59,130,246,0.3)', dificultad:'Medio',
    pregunta:'Calcula el área del cuadrado con los datos dados:', datos:['l = 7 cm'], correcta:49,
    explicacion:'A = l² = 7² = 49 cm².' },
  { tipo:'calcular', figura:'Rectángulo', emoji:'🟩', color:'#8B5CF6', bgLight:'rgba(139,92,246,0.08)', borderColor:'rgba(139,92,246,0.3)', dificultad:'Medio',
    pregunta:'Calcula el área del rectángulo con los datos dados:', datos:['b = 9 cm','h = 6 cm'], correcta:54,
    explicacion:'A = b × h = 9 × 6 = 54 cm².' },
  { tipo:'calcular', figura:'Triángulo', emoji:'🔺', color:'#16a34a', bgLight:'rgba(34,197,94,0.08)', borderColor:'rgba(34,197,94,0.3)', dificultad:'Medio',
    pregunta:'Calcula el área del triángulo con los datos dados:', datos:['b = 10 cm','h = 8 cm'], correcta:40,
    explicacion:'A = (b × h) / 2 = (10 × 8) / 2 = 80 / 2 = 40 cm².' },
  { tipo:'calcular', figura:'Paralelogramo', emoji:'🔹', color:'#0891b2', bgLight:'rgba(8,145,178,0.08)', borderColor:'rgba(8,145,178,0.3)', dificultad:'Medio',
    pregunta:'Calcula el área del paralelogramo con los datos dados:', datos:['b = 12 cm','h = 5 cm'], correcta:60,
    explicacion:'A = b × h = 12 × 5 = 60 cm².' },

  // IDENTIFICAR FIGURA
  { tipo:'identificar', figura:'Varias', emoji:'🔍', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Medio',
    pregunta:'¿A qué figura pertenecen estos datos y área?', datos:['l = 9 cm'], area:'81 cm²', opciones:['Cuadrado','Rectángulo','Rombo','Trapecio'], correcta:'Cuadrado',
    explicacion:'A = l² = 9² = 81 cm². Solo el cuadrado usa una sola medida elevada al cuadrado.' },
  { tipo:'identificar', figura:'Varias', emoji:'🔍', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Medio',
    pregunta:'¿A qué figura pertenecen estos datos y área?', datos:['d₁ = 10 cm','d₂ = 6 cm'], area:'30 cm²', opciones:['Triángulo','Cuadrado','Rombo','Círculo'], correcta:'Rombo',
    explicacion:'A = (d₁ × d₂) / 2 = (10 × 6) / 2 = 30 cm². Solo el rombo usa diagonales.' },
  { tipo:'identificar', figura:'Varias', emoji:'🔍', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Difícil',
    pregunta:'¿A qué figura pertenecen estos datos y área?', datos:['B = 12 cm','b = 8 cm','h = 5 cm'], area:'50 cm²', opciones:['Rectángulo','Rombo','Trapecio','Triángulo'], correcta:'Trapecio',
    explicacion:'A = (B + b) × h / 2 = (12 + 8) × 5 / 2 = 100 / 2 = 50 cm². El trapecio usa dos bases.' },

  // VERDADERO O FALSO
  { tipo:'vof', figura:'Triángulo', emoji:'🔺', color:'#16a34a', bgLight:'rgba(34,197,94,0.08)', borderColor:'rgba(34,197,94,0.3)', dificultad:'Fácil',
    pregunta:'La suma de los ángulos internos de un triángulo siempre es 180°.', correcta:'Verdadero',
    explicacion:'Verdadero. Sin importar el tipo de triángulo, la suma de sus tres ángulos internos siempre es 180°.' },
  { tipo:'vof', figura:'Círculo', emoji:'⭕', color:'#F97316', bgLight:'rgba(251,146,60,0.08)', borderColor:'rgba(251,146,60,0.3)', dificultad:'Fácil',
    pregunta:'El diámetro de un círculo es igual al radio.', correcta:'Falso',
    explicacion:'Falso. El diámetro es el doble del radio: d = 2r. El radio va del centro al borde, el diámetro atraviesa todo el círculo.' },
  { tipo:'vof', figura:'Cuadrado', emoji:'🟦', color:'#3B82F6', bgLight:'rgba(59,130,246,0.08)', borderColor:'rgba(59,130,246,0.3)', dificultad:'Medio',
    pregunta:'El cuadrado es un caso especial del rectángulo.', correcta:'Verdadero',
    explicacion:'Verdadero. El cuadrado es un rectángulo donde todos sus lados son iguales.' },
  { tipo:'vof', figura:'Paralelogramo', emoji:'🔹', color:'#0891b2', bgLight:'rgba(8,145,178,0.08)', borderColor:'rgba(8,145,178,0.3)', dificultad:'Medio',
    pregunta:'En un paralelogramo, la altura es el lado inclinado.', correcta:'Falso',
    explicacion:'Falso. La altura del paralelogramo es la distancia perpendicular entre las dos bases, NO el lado inclinado.' },
  { tipo:'vof', figura:'Rombo', emoji:'🔷', color:'#EF4444', bgLight:'rgba(239,68,68,0.08)', borderColor:'rgba(239,68,68,0.3)', dificultad:'Difícil',
    pregunta:'Las diagonales del rombo se cortan perpendicularmente y se bisectan mutuamente.', correcta:'Verdadero',
    explicacion:'Verdadero. Las diagonales del rombo forman ángulos rectos entre sí y cada una divide a la otra en dos partes iguales.' },
]

const preguntaActual = computed(() => preguntas.value[indice.value] || {})

const correctas = computed(() => preguntas.value.filter((p, i) => esRespuestaCorrecta(i)).length)

const esRespuestaCorrecta = (i) => {
  const p = preguntas.value[i]
  const r = respuestas.value[i]
  if (!p || r === null || r === undefined) return false
  if (p.tipo === 'calcular') return Math.abs(Number(r) - Number(p.correcta)) < 0.1
  return r === p.correcta
}

const nota = computed(() => +(correctas.value / preguntas.value.length * 5).toFixed(1))

const medalla = computed(() => {
  if (nota.value >= 4.5) return { emoji:'🏆', titulo:'¡Sobresaliente!',  color:'#F59E0B' }
  if (nota.value >= 4.0) return { emoji:'🥇', titulo:'¡Excelente!',      color:'#F97316' }
  if (nota.value >= 3.5) return { emoji:'🥈', titulo:'¡Muy bien!',       color:'#8B5CF6' }
  if (nota.value >= 3.0) return { emoji:'🥉', titulo:'¡Aprobado!',       color:'#3B82F6' }
  return                        { emoji:'📚', titulo:'Sigue practicando', color:'#EF4444' }
})

const rendimientoPorTipo = computed(() => {
  const tipos = {}
  preguntas.value.forEach((p, i) => {
    if (!tipos[p.tipo]) tipos[p.tipo] = { tipo: p.tipo, label: tipoLabel(p.tipo), emoji: tipoEmoji(p.tipo), total: 0, correctas: 0 }
    tipos[p.tipo].total++
    if (esRespuestaCorrecta(i)) tipos[p.tipo].correctas++
  })
  return Object.values(tipos).map(t => ({ ...t, porcentaje: Math.round(t.correctas / t.total * 100) }))
})

// ── Mezclar preguntas Y opciones de cada pregunta ────────
const mezclarBanco = (fuente) =>
  shuffle(fuente).map(p => ({
    ...p,
    opciones: p.opciones ? shuffle(p.opciones) : p.opciones,
  }))

const iniciarEvaluacion = () => {
  preguntas.value = mezclarBanco(banco).slice(0, 20)
  respuestas.value = new Array(preguntas.value.length).fill(null)
  indice.value = 0; puntos.value = 0; racha.value = 0
  respondida.value = false; respuestaSeleccionada.value = null; inputCalculo.value = ''
  tiempoTotal.value = 1800; estado.value = 'evaluando'
  clearInterval(timerTotal.value)
  timerTotal.value = setInterval(() => {
    tiempoTotal.value--
    if (tiempoTotal.value <= 0) { clearInterval(timerTotal.value); finalizarEvaluacion() }
  }, 1000)
  tiempoRespuesta.value = 0
  clearInterval(timerRespuesta.value)
  timerRespuesta.value = setInterval(() => { tiempoRespuesta.value++ }, 1000)
}

const responder = (op) => {
  if (respondida.value) return
  clearInterval(timerRespuesta.value)
  respuestaSeleccionada.value = op
  respondida.value = true
  respuestas.value[indice.value] = op
  const correcto = op === preguntaActual.value.correcta
  esCorrecta.value = correcto
  procesarPuntaje(correcto)
}

const responderCalculo = () => {
  if (respondida.value || !inputCalculo.value) return
  clearInterval(timerRespuesta.value)
  const val = Number(inputCalculo.value)
  const correcto = Math.abs(val - Number(preguntaActual.value.correcta)) < 0.1
  respuestaSeleccionada.value = inputCalculo.value
  respondida.value = true
  respuestas.value[indice.value] = val
  esCorrecta.value = correcto
  procesarPuntaje(correcto)
}

const procesarPuntaje = (correcto) => {
  if (correcto) {
    racha.value++
    let bonus = 10
    if (tiempoRespuesta.value < 5)  bonus += 5
    if (tiempoRespuesta.value < 10) bonus += 3
    if (racha.value >= 3) {
      bonusActual.value = racha.value * 2
      bonus += bonusActual.value
      mostrarBonus.value = true
      setTimeout(() => mostrarBonus.value = false, 2000)
    }
    puntos.value += bonus
  } else {
    racha.value = 0
  }
}

const siguiente = () => {
  if (indice.value < preguntas.value.length - 1) {
    indice.value++
    respondida.value = false
    respuestaSeleccionada.value = null
    inputCalculo.value = ''
    tiempoRespuesta.value = 0
    clearInterval(timerRespuesta.value)
    timerRespuesta.value = setInterval(() => { tiempoRespuesta.value++ }, 1000)
  } else {
    finalizarEvaluacion()
  }
}

const finalizarEvaluacion = () => {
  clearInterval(timerTotal.value)
  clearInterval(timerRespuesta.value)
  estado.value = 'resultado'
}

const reiniciar = () => {
  clearInterval(timerTotal.value)
  clearInterval(timerRespuesta.value)
  estado.value = 'inicio'
}

const soloFallidas = () => {
  const fallidas = preguntas.value.filter((p, i) => !esRespuestaCorrecta(i))
  // Mezcla las fallidas y sus opciones también
  preguntas.value = mezclarBanco(fallidas)
  respuestas.value = new Array(preguntas.value.length).fill(null)
  indice.value = 0; puntos.value = 0; racha.value = 0
  respondida.value = false; respuestaSeleccionada.value = null; inputCalculo.value = ''
  tiempoTotal.value = 1800; estado.value = 'evaluando'
  clearInterval(timerTotal.value)
  timerTotal.value = setInterval(() => {
    tiempoTotal.value--
    if (tiempoTotal.value <= 0) { clearInterval(timerTotal.value); finalizarEvaluacion() }
  }, 1000)
  tiempoRespuesta.value = 0
  clearInterval(timerRespuesta.value)
  timerRespuesta.value = setInterval(() => { tiempoRespuesta.value++ }, 1000)
}

const confettiStyle = (i) => ({
  left: (Math.random() * 100) + '%',
  animationDelay: (Math.random() * 3) + 's',
  animationDuration: (2 + Math.random() * 2) + 's',
  background: ['#378ADD','#F97316','#16a34a','#EC4899','#EF4444','#8B5CF6','#F59E0B'][i % 7],
})

onUnmounted(() => { clearInterval(timerTotal.value); clearInterval(timerRespuesta.value) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.eval-page { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:24px; }

.page-banner { background:linear-gradient(135deg,#0c1120 0%,#0d1f3c 50%,#0a1628 100%); border-radius:14px; padding:28px 32px; border:0.5px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; }
.page-titulo { font-size:22px; font-weight:700; color:#e8f0fe; margin:0 0 6px; letter-spacing:-0.3px; }
.page-desc   { font-size:13px; color:#4a6fa5; margin:0; line-height:1.6; }
.banner-stats { display:flex; gap:24px; flex-shrink:0; }
.banner-stat  { display:flex; flex-direction:column; align-items:center; }
.banner-stat__num   { font-size:24px; font-weight:700; color:#e8f0fe; }
.banner-stat__label { font-size:11px; color:#4a6fa5; }

.pantalla-inicio { display:flex; justify-content:center; }
.inicio-card { background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:40px; max-width:580px; width:100%; text-align:center; box-shadow:0 4px 20px rgba(0,0,0,0.06); display:flex; flex-direction:column; align-items:center; gap:16px; }
.inicio-emoji  { font-size:56px; }
.inicio-titulo { font-size:22px; font-weight:700; color:#1e293b; margin:0; }
.inicio-desc   { font-size:14px; color:#64748b; margin:0; line-height:1.6; }
.inicio-tipos  { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
.tipo-chip { display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; background:#f1f5f9; border:1px solid #e2e8f0; font-size:12px; font-weight:500; color:#475569; }
.inicio-reglas { display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%; text-align:left; }
.regla { display:flex; align-items:flex-start; gap:8px; background:#f8fafc; border-radius:10px; padding:10px 12px; }
.regla span { font-size:18px; flex-shrink:0; }
.regla p { font-size:12px; color:#475569; margin:0; line-height:1.4; }
.btn-comenzar { background:#378ADD; color:#fff; border:none; border-radius:12px; padding:14px 32px; font-size:15px; font-weight:700; cursor:pointer; transition:background 0.2s; width:100%; max-width:320px; }
.btn-comenzar:hover { background:#2a6ab5; }

.hud { display:flex; align-items:center; justify-content:space-between; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:12px 24px; box-shadow:0 1px 4px rgba(0,0,0,0.05); flex-wrap:wrap; gap:8px; }
.hud-item  { display:flex; flex-direction:column; align-items:center; gap:2px; }
.hud-label { font-size:10px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; }
.hud-valor { font-size:16px; font-weight:700; color:#1e293b; }
.hud-tipo  { font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; }

.progreso-wrapper { background:#e2e8f0; border-radius:4px; height:6px; overflow:hidden; }
.progreso-fill { height:100%; background:linear-gradient(90deg,#378ADD,#8B5CF6); border-radius:4px; transition:width 0.4s; }

.bonus-badge { background:linear-gradient(135deg,#f97316,#ec4899); color:#fff; font-size:14px; font-weight:700; padding:10px 20px; border-radius:20px; text-align:center; box-shadow:0 4px 12px rgba(249,115,22,0.3); }

.pregunta-card { background:#fff; border:1.5px solid; border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
.pregunta-header { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; }
.pregunta-figura { display:flex; align-items:center; gap:10px; }
.pregunta-emoji  { font-size:24px; }
.pregunta-figura-nombre { font-size:14px; font-weight:700; }
.pregunta-dificultad { font-size:11px; font-weight:600; padding:3px 12px; border-radius:20px; }
.pregunta-body  { padding:24px; display:flex; flex-direction:column; gap:16px; }
.pregunta-texto { font-size:17px; font-weight:600; color:#1e293b; margin:0; line-height:1.4; }

.opciones-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.opcion-btn { padding:12px 16px; border-radius:10px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:14px; font-weight:500; cursor:pointer; color:#334155; transition:all 0.15s; text-align:left; }
.opcion-btn:hover:not(:disabled) { border-color:#378ADD; background:rgba(56,138,221,0.06); }
.opcion-btn.correcta   { background:rgba(34,197,94,0.12);  border-color:#22c55e; color:#16a34a; font-weight:700; }
.opcion-btn.incorrecta { background:rgba(239,68,68,0.12);  border-color:#ef4444; color:#dc2626; font-weight:700; }

.completar-box { display:flex; flex-direction:column; gap:14px; }
.formula-display { display:flex; align-items:center; gap:4px; flex-wrap:wrap; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; padding:14px 20px; font-size:20px; font-weight:700; color:#1e293b; }
.formula-parte { color:#1e293b; }
.formula-blank { min-width:40px; border-bottom:2.5px solid #378ADD; padding:0 4px; color:#378ADD; display:inline-block; text-align:center; }
.completar-opciones { display:flex; gap:10px; flex-wrap:wrap; }
.completar-btn { padding:10px 24px; border-radius:10px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:16px; font-weight:700; cursor:pointer; color:#334155; transition:all 0.15s; }
.completar-btn:hover:not(:disabled) { border-color:#378ADD; background:rgba(56,138,221,0.06); }
.completar-btn.correcta   { background:rgba(34,197,94,0.12);  border-color:#22c55e; color:#16a34a; }
.completar-btn.incorrecta { background:rgba(239,68,68,0.12);  border-color:#ef4444; color:#dc2626; }

.calcular-box { display:flex; flex-direction:column; gap:12px; }
.calcular-datos { display:flex; flex-wrap:wrap; gap:8px; }
.dato-chip { background:#f1f5f9; border:1px solid #e2e8f0; border-radius:20px; padding:6px 14px; font-size:13px; font-weight:500; color:#334155; }
.calcular-input-row { display:flex; align-items:center; gap:10px; }
.calcular-label { font-size:16px; font-weight:700; color:#1e293b; }
.calcular-input { padding:10px 14px; border-radius:10px; border:1.5px solid #e2e8f0; font-size:16px; font-weight:600; color:#1e293b; outline:none; width:120px; transition:border 0.15s; }
.calcular-input:focus { border-color:#378ADD; }
.calcular-unidad { font-size:14px; color:#64748b; font-weight:500; }
.btn-calcular { background:#378ADD; color:#fff; border:none; border-radius:10px; padding:10px 24px; font-size:14px; font-weight:600; cursor:pointer; align-self:flex-start; transition:background 0.15s; }
.btn-calcular:hover { background:#2a6ab5; }
.calcular-resultado { padding:12px 16px; border-radius:10px; font-size:14px; font-weight:600; }
.calcular-resultado.correcto   { background:rgba(34,197,94,0.1);  color:#16a34a; border:1px solid rgba(34,197,94,0.3); }
.calcular-resultado.incorrecto { background:rgba(239,68,68,0.1);  color:#dc2626; border:1px solid rgba(239,68,68,0.3); }

.identificar-box { display:flex; flex-direction:column; gap:12px; }
.identificar-datos { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; display:flex; flex-direction:column; gap:6px; }
.identificar-area { font-size:16px; font-weight:700; color:#1e293b; margin-top:4px; }

.vof-box { display:flex; flex-direction:column; gap:12px; }
.vof-opciones { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.vof-btn { padding:20px; border-radius:12px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:16px; font-weight:700; cursor:pointer; transition:all 0.15s; }
.vof-btn--verdadero:hover:not(:disabled) { border-color:#22c55e; background:rgba(34,197,94,0.06); }
.vof-btn--falso:hover:not(:disabled)     { border-color:#ef4444; background:rgba(239,68,68,0.06); }
.vof-btn.correcta   { background:rgba(34,197,94,0.12);  border-color:#22c55e; color:#16a34a; }
.vof-btn.incorrecta { background:rgba(239,68,68,0.12);  border-color:#ef4444; color:#dc2626; }

.feedback { display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border-radius:10px; border:1px solid; }
.feedback.correcto   { background:rgba(34,197,94,0.08);  border-color:rgba(34,197,94,0.3); }
.feedback.incorrecto { background:rgba(239,68,68,0.08);  border-color:rgba(239,68,68,0.3); }
.feedback-icono { font-size:20px; flex-shrink:0; }
.feedback-titulo { font-size:14px; font-weight:700; color:#1e293b; margin:0 0 4px; }
.feedback-explicacion { font-size:13px; color:#475569; margin:0; line-height:1.5; }
.btn-siguiente { background:#1e293b; color:#fff; border:none; border-radius:10px; padding:12px 24px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s; align-self:flex-end; }
.btn-siguiente:hover { background:#0f172a; }

.pantalla-resultado { position:relative; }
.confeti-wrapper { position:fixed; inset:0; pointer-events:none; z-index:50; overflow:hidden; }
.confeti-particle { position:absolute; top:-10px; width:8px; height:8px; border-radius:2px; animation:caer linear infinite; }
@keyframes caer { 0%{top:-10px;transform:rotate(0deg)} 100%{top:100vh;transform:rotate(720deg)} }

.resultado-card { background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:36px; display:flex; flex-direction:column; align-items:center; gap:24px; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
.resultado-medalla { font-size:64px; }
.resultado-titulo  { font-size:24px; font-weight:700; margin:0; }
.resultado-nombre  { font-size:15px; color:#64748b; margin:0; }

.resultado-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; width:100%; }
.res-stat { display:flex; flex-direction:column; align-items:center; gap:4px; padding:16px; border-radius:12px; border:1px solid; }
.res-stat__num   { font-size:28px; font-weight:700; }
.res-stat__label { font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase; }

.rendimiento { width:100%; }
.rendimiento-titulo { font-size:15px; font-weight:700; color:#1e293b; margin:0 0 12px; }
.rendimiento-grid { display:flex; flex-direction:column; gap:10px; }
.rend-item { display:flex; flex-direction:column; gap:4px; }
.rend-item__header { display:flex; justify-content:space-between; font-size:13px; font-weight:500; color:#334155; }
.rend-barra { height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.rend-barra-fill { height:100%; border-radius:3px; transition:width 0.6s; }

.revision { width:100%; }
.revision-titulo { font-size:15px; font-weight:700; color:#1e293b; margin:0 0 14px; }
.revision-lista  { display:flex; flex-direction:column; gap:12px; }
.revision-item { display:flex; gap:14px; padding:16px; border-radius:12px; border:1px solid; }
.revision-item.correcto   { background:rgba(34,197,94,0.04);  border-color:rgba(34,197,94,0.2); }
.revision-item.incorrecto { background:rgba(239,68,68,0.04);  border-color:rgba(239,68,68,0.2); }
.revision-left { display:flex; flex-direction:column; align-items:center; gap:6px; flex-shrink:0; }
.revision-num  { width:28px; height:28px; border-radius:50%; color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; }
.revision-figura-tag { font-size:10px; font-weight:600; padding:2px 6px; border-radius:10px; white-space:nowrap; }
.revision-tipo-tag   { font-size:10px; font-weight:600; padding:2px 6px; border-radius:10px; white-space:nowrap; }
.revision-body { flex:1; display:flex; flex-direction:column; gap:6px; }
.revision-top-row { display:flex; justify-content:space-between; align-items:center; }
.revision-dificultad { font-size:11px; font-weight:600; }
.revision-estado { font-size:12px; font-weight:600; color:#64748b; }
.revision-pregunta { font-size:14px; font-weight:600; color:#1e293b; margin:0; line-height:1.4; }
.revision-respuestas { display:flex; flex-direction:column; gap:2px; }
.revision-tu       { font-size:12.5px; color:#475569; margin:0; }
.revision-correcta { font-size:12.5px; color:#475569; margin:0; }
.revision-retro { background:#f8fafc; border-radius:8px; padding:10px 12px; display:flex; flex-direction:column; gap:4px; border-left:3px solid #378ADD; }
.revision-retro-label { font-size:10px; font-weight:700; color:#378ADD; text-transform:uppercase; letter-spacing:0.5px; }
.revision-expl { font-size:12.5px; color:#334155; margin:0; line-height:1.5; }

.resultado-acciones { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; width:100%; }
.btn-secundario { background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; border-radius:12px; padding:14px 24px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s; }
.btn-secundario:hover { background:#e2e8f0; }

.fade-enter-active,.fade-leave-active { transition:opacity 0.3s; }
.fade-enter-from,.fade-leave-to { opacity:0; }
.slide-up-enter-active { transition:all 0.3s ease; }
.slide-up-enter-from   { opacity:0; transform:translateY(10px); }

@media(max-width:768px) {
  .hud { gap:12px; }
  .opciones-grid,.vof-opciones { grid-template-columns:1fr; }
  .resultado-stats { grid-template-columns:repeat(2,1fr); }
  .inicio-reglas { grid-template-columns:1fr; }
  .banner-stats { display:none; }
  .resultado-acciones { flex-direction:column; }
  .revision-item { flex-direction:column; }
  .btn-comenzar,.btn-secundario { max-width:100%; }
}
</style>