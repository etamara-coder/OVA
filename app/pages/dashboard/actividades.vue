<template>
  <div class="actividades-page">

    <!-- Banner -->
    <div class="page-banner">
      <div>
        <h1 class="page-titulo">Actividades</h1>
        <p class="page-desc">Pon a prueba tus conocimientos con estas actividades interactivas sobre áreas de figuras geométricas.</p>
      </div>
      <div class="banner-stats">
        <div class="banner-stat"><span class="banner-stat__num">6</span><span class="banner-stat__label">Actividades</span></div>
        <div class="banner-stat"><span class="banner-stat__num">🎯</span><span class="banner-stat__label">Interactivas</span></div>
      </div>
    </div>

    <!-- Grid de tarjetas -->
    <div class="actividades-grid">
      <div v-for="act in actividades" :key="act.id" class="act-card" @click="abrirActividad(act)">
        <div class="act-card__icono" :style="{ background: act.bgLight }">
          <span class="act-card__emoji">{{ act.emoji }}</span>
        </div>
        <div class="act-card__info">
          <div class="act-card__top">
            <span class="act-card__badge" :style="{ background: act.bgLight, color: act.color }">{{ act.tipo }}</span>
            <span class="act-card__dificultad">{{ act.dificultad }}</span>
          </div>
          <h3 class="act-card__nombre">{{ act.nombre }}</h3>
          <p class="act-card__desc">{{ act.desc }}</p>
          <div class="act-card__footer">
            <span class="act-card__btn" :style="{ background: act.color }">Iniciar actividad →</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal">

          <div class="modal__header" :style="{ background: actActiva?.bgLight }">
            <div class="modal__header-left">
              <span style="font-size:28px">{{ actActiva?.emoji }}</span>
              <div>
                <p class="modal__tipo">{{ actActiva?.tipo }}</p>
                <h2 class="modal__titulo">{{ actActiva?.nombre }}</h2>
              </div>
            </div>
            <button class="modal__cerrar" @click="cerrarModal">✕</button>
          </div>

          <div class="modal__body">

            <!-- ① Arrastrar y soltar -->
            <div v-if="actActiva?.id === 'arrastra'">
              <div class="drag-stats">
                <span>✅ Correctas: <strong>{{ dragCorrectas }}</strong></span>
                <span>🔁 Intentos: <strong>{{ dragIntentos }}</strong></span>
              </div>
              <div v-if="dragCompletado" class="completado-banner">
                <span>🎉</span>
                <p>¡Completaste la actividad en {{ dragIntentos }} intentos!</p>
                <button class="calc-btn" @click="reiniciarDrag">Intentar de nuevo</button>
              </div>
              <div v-else class="drag-contenedor">
                <div class="drag-col">
                  <p class="drag-col-titulo">Figuras</p>
                  <div v-for="figura in dragFigurasRestantes" :key="figura.id"
                    class="drag-item" :style="{ borderColor: figura.color, background: figura.bg }"
                    draggable="true" @dragstart="onDragStart(figura)">
                    <component :is="figura.svg" />
                    <span :style="{ color: figura.color, fontWeight: 600 }">{{ figura.nombre }}</span>
                  </div>
                  <div v-for="figura in dragFigurasUnidas" :key="'u'+figura.id" class="drag-item drag-item--unida">
                    <span style="font-size:22px;color:#16a34a">✓</span>
                    <span style="color:#16a34a;font-weight:600">{{ figura.nombre }}</span>
                  </div>
                </div>
                <div class="drag-col">
                  <p class="drag-col-titulo">Fórmulas</p>
                  <div v-for="formula in dragFormulas" :key="formula.id"
                    class="drop-zone"
                    :class="{ 'drop-zone--correcto': formula.estado==='correcto', 'drop-zone--incorrecto': formula.estado==='incorrecto', 'drop-zone--hover': formula.hover }"
                    @dragover.prevent="formula.hover = true"
                    @dragleave="formula.hover = false"
                    @drop="onDrop(formula)">
                    <span class="formula-texto">{{ formula.texto }}</span>
                    <span v-if="formula.estado==='correcto'" style="color:#16a34a;font-weight:700">✓</span>
                    <span v-if="formula.estado==='incorrecto'" style="color:#ef4444;font-weight:700">✗</span>
                  </div>
                </div>
              </div>
              <div v-if="dragSolucionFigura" class="solucion-panel">
                <div class="solucion-header">
                  <h3 class="solucion-titulo">📖 Solución — {{ dragSolucionFigura.nombre }}</h3>
                  <button class="btn-cerrar-sol" @click="dragSolucionFigura = null">✕</button>
                </div>
                <div v-for="(paso, i) in dragSolucionFigura.pasos" :key="i" class="paso">
                  <div class="paso-num" :style="{ background: dragSolucionFigura.color }">{{ i+1 }}</div>
                  <p class="paso-texto">{{ paso }}</p>
                </div>
                <div class="solucion-formula" :style="{ borderColor: dragSolucionFigura.color, background: dragSolucionFigura.bg }">
                  <span style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase">Fórmula correcta</span>
                  <span :style="{ color: dragSolucionFigura.color, fontSize:'20px', fontWeight:700 }">{{ dragSolucionFigura.formula }}</span>
                </div>
              </div>
            </div>

            <!-- ② Calculadora -->
            <div v-else-if="actActiva?.id === 'calculadora'">
              <p class="modal__instruccion">Selecciona una figura, ingresa sus medidas y calcula su área.</p>
              <div class="calc-figuras">
                <button v-for="f in calculadoraFiguras" :key="f.nombre"
                  class="calc-figura-btn" :class="{ activo: calcFigura === f.nombre }"
                  @click="seleccionarFigura(f)"
                  :style="calcFigura === f.nombre ? { background: '#378ADD', color: '#fff', borderColor: '#378ADD' } : {}">
                  {{ f.nombre }}
                </button>
              </div>
              <div v-if="calcFiguraObj" class="calc-inputs">
                <div v-for="campo in calcFiguraObj.campos" :key="campo.key" class="calc-input-group">
                  <label>{{ campo.label }}</label>
                  <input v-model.number="calcValores[campo.key]" type="number" min="0" placeholder="0" class="calc-input" />
                </div>
                <button class="calc-btn" @click="calcularArea">Calcular área</button>
                <div v-if="calcResultado !== null" class="calc-resultado">
                  <span>Área =</span>
                  <strong style="color:#378ADD;font-size:20px">{{ calcResultado }} cm²</strong>
                </div>
              </div>
            </div>

            <!-- ③ Quiz -->
            <div v-else-if="actActiva?.id === 'quiz'">
              <div v-if="!quizTerminado">
                <div class="quiz-header">
                  <span class="quiz-progreso">Pregunta {{ quizIndice + 1 }} de {{ quizPreguntas.length }}</span>
                  <span class="quiz-timer" :style="{ color: quizTiempo < 10 ? '#ef4444' : '#378ADD' }">⏱ {{ quizTiempo }}s</span>
                </div>
                <div class="quiz-barra"><div class="quiz-barra-fill" :style="{ width: (quizIndice / quizPreguntas.length * 100) + '%' }"></div></div>
                <p class="quiz-pregunta">{{ quizPreguntas[quizIndice].pregunta }}</p>
                <div class="quiz-opciones">
                  <button v-for="op in quizPreguntas[quizIndice].opciones" :key="op"
                    class="quiz-opcion"
                    :class="{ correcta: quizRespondida && op === quizPreguntas[quizIndice].correcta, incorrecta: quizRespondida && op === quizRespuesta && op !== quizPreguntas[quizIndice].correcta }"
                    :disabled="quizRespondida" @click="responderQuiz(op)">{{ op }}</button>
                </div>
                <p v-if="quizRespondida" class="quiz-feedback" :style="{ color: quizRespuesta === quizPreguntas[quizIndice].correcta ? '#16a34a' : '#ef4444' }">
                  {{ quizRespuesta === quizPreguntas[quizIndice].correcta ? '✅ ¡Correcto!' : '❌ La respuesta era: ' + quizPreguntas[quizIndice].correcta }}
                </p>
                <button v-if="quizRespondida" class="calc-btn" @click="siguientePregunta">{{ quizIndice < quizPreguntas.length - 1 ? 'Siguiente →' : 'Ver resultado' }}</button>
              </div>
              <div v-else class="quiz-resultado">
                <p class="quiz-resultado-emoji">{{ quizPuntaje >= 5 ? '🎉' : '📚' }}</p>
                <h3>{{ quizPuntaje >= 5 ? '¡Excelente!' : 'Sigue practicando' }}</h3>
                <p>Obtuviste <strong>{{ quizPuntaje }}</strong> de <strong>{{ quizPreguntas.length }}</strong> correctas.</p>
                <button class="calc-btn" @click="reiniciarQuiz">Intentar de nuevo</button>
              </div>
            </div>

            <!-- ④ Adivina -->
            <div v-else-if="actActiva?.id === 'adivina'">
              <p class="modal__instruccion">Con los datos dados, ¿a qué figura pertenece esa área?</p>
              <div v-if="!adivinaTerminado">
                <div class="adivina-datos">
                  <p v-for="d in adivinaActual.datos" :key="d">📌 {{ d }}</p>
                  <p class="adivina-area">Área = <strong>{{ adivinaActual.area }}</strong></p>
                </div>
                <div class="quiz-opciones" style="margin-top:12px">
                  <button v-for="op in adivinaActual.opciones" :key="op"
                    class="quiz-opcion"
                    :class="{ correcta: adivinaRespondida && op === adivinaActual.correcta, incorrecta: adivinaRespondida && op === adivinaRespuesta && op !== adivinaActual.correcta }"
                    :disabled="adivinaRespondida" @click="responderAdivina(op)">{{ op }}</button>
                </div>
                <p v-if="adivinaRespondida" class="quiz-feedback" :style="{ color: adivinaRespuesta === adivinaActual.correcta ? '#16a34a' : '#ef4444' }">
                  {{ adivinaRespuesta === adivinaActual.correcta ? '✅ ¡Correcto!' : '❌ Era: ' + adivinaActual.correcta }}
                </p>
                <button v-if="adivinaRespondida" class="calc-btn" style="margin-top:12px" @click="siguienteAdivina">{{ adivinaIndice < adivinaPreguntas.length - 1 ? 'Siguiente →' : 'Ver resultado' }}</button>
              </div>
              <div v-else class="quiz-resultado">
                <p class="quiz-resultado-emoji">{{ adivinaPuntaje >= 4 ? '🎉' : '📚' }}</p>
                <h3>{{ adivinaPuntaje >= 4 ? '¡Buen ojo!' : 'Sigue intentando' }}</h3>
                <p>Adivinaste <strong>{{ adivinaPuntaje }}</strong> de <strong>{{ adivinaPreguntas.length }}</strong>.</p>
                <button class="calc-btn" @click="reiniciarAdivina">Intentar de nuevo</button>
              </div>
            </div>

            <!-- ⑤ Carrera -->
            <div v-else-if="actActiva?.id === 'carrera'">
              <div v-if="!carreraIniciada && !carreraTerminada">
                <p class="modal__instruccion">Tienes 60 segundos para resolver la mayor cantidad de ejercicios posible. ¡Buena suerte!</p>
                <button class="calc-btn" @click="iniciarCarrera">¡Comenzar!</button>
              </div>
              <div v-else-if="carreraIniciada">
                <div class="quiz-header">
                  <span class="quiz-progreso">Correctas: {{ carreraCorrectas }}</span>
                  <span class="quiz-timer" :style="{ color: carreraTiempo < 15 ? '#ef4444' : '#378ADD' }">⏱ {{ carreraTiempo }}s</span>
                </div>
                <div class="quiz-barra"><div class="quiz-barra-fill" :style="{ width: (carreraTiempo/60*100)+'%', background: carreraTiempo<15?'#ef4444':'#378ADD' }"></div></div>
                <p class="quiz-pregunta">{{ carreraActual.pregunta }}</p>
                <div class="quiz-opciones">
                  <button v-for="op in carreraActual.opciones" :key="op"
                    class="quiz-opcion"
                    :class="{ correcta: carreraRespondida && op === carreraActual.correcta, incorrecta: carreraRespondida && op === carreraRespuesta && op !== carreraActual.correcta }"
                    :disabled="carreraRespondida" @click="responderCarrera(op)">{{ op }}</button>
                </div>
              </div>
              <div v-else class="quiz-resultado">
                <p class="quiz-resultado-emoji">{{ carreraCorrectas >= 5 ? '🏆' : carreraCorrectas >= 3 ? '🎯' : '📚' }}</p>
                <h3>{{ carreraCorrectas >= 5 ? '¡Campeón!' : carreraCorrectas >= 3 ? '¡Bien hecho!' : 'Sigue practicando' }}</h3>
                <p>Respondiste <strong>{{ carreraCorrectas }}</strong> correctos en 60 segundos.</p>
                <button class="calc-btn" @click="reiniciarCarrera">Jugar de nuevo</button>
              </div>
            </div>

            <!-- ⑥ Ruleta -->
            <div v-else-if="actActiva?.id === 'ruleta'">
              <p class="modal__instruccion">Gira la ruleta para obtener una figura aleatoria y calcula su área.</p>
              <div class="ruleta-box">
                <div class="ruleta" :class="{ girando: ruletaGirando }">
                  <span class="ruleta-emoji">{{ ruletaFigura ? ruletaFigura.emoji : '🎲' }}</span>
                </div>
                <button class="calc-btn" @click="girarRuleta" :disabled="ruletaGirando">{{ ruletaGirando ? 'Girando...' : 'Girar ruleta' }}</button>
              </div>
              <div v-if="ruletaFigura && !ruletaGirando" class="ruleta-ejercicio">
                <h4 style="margin:0 0 8px;color:#1e293b">{{ ruletaFigura.nombre }}</h4>
                <p class="modal__instruccion">{{ ruletaFigura.enunciado }}</p>
                <div class="quiz-opciones" style="margin-top:10px">
                  <button v-for="op in ruletaFigura.opciones" :key="op"
                    class="quiz-opcion"
                    :class="{ correcta: ruletaRespondida && op === ruletaFigura.correcta, incorrecta: ruletaRespondida && op === ruletaRespuesta && op !== ruletaFigura.correcta }"
                    :disabled="ruletaRespondida" @click="responderRuleta(op)">{{ op }}</button>
                </div>
                <p v-if="ruletaRespondida" class="quiz-feedback" :style="{ color: ruletaRespuesta === ruletaFigura.correcta ? '#16a34a' : '#ef4444' }">
                  {{ ruletaRespuesta === ruletaFigura.correcta ? '✅ ¡Correcto!' : '❌ La respuesta era: ' + ruletaFigura.correcta }}
                </p>
                <button v-if="ruletaRespondida" class="calc-btn" style="margin-top:10px" @click="girarRuleta">Girar de nuevo</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })
import { ref, computed, defineComponent, h, onUnmounted } from 'vue'

const actividades = [
  { id: 'arrastra',    emoji: '🖱️', tipo: 'Arrastrar',  dificultad: '⭐ Básico',       nombre: 'Une Figura y Fórmula',     desc: 'Arrastra cada figura geométrica hacia su fórmula de área correcta.',            color: '#3B82F6', bgLight: 'rgba(59,130,246,0.1)'  },
  { id: 'calculadora', emoji: '🧮', tipo: 'Herramienta', dificultad: '⭐ Básico',       nombre: 'Calculadora de Área',      desc: 'Selecciona una figura, ingresa sus medidas y calcula su área paso a paso.',     color: '#8B5CF6', bgLight: 'rgba(139,92,246,0.1)' },
  { id: 'quiz',        emoji: '❓', tipo: 'Quiz',        dificultad: '⭐⭐ Intermedio',  nombre: 'Quiz de Fórmulas',         desc: 'Responde preguntas de selección múltiple con cronómetro de 20 segundos.',      color: '#F97316', bgLight: 'rgba(249,115,22,0.1)'  },
  { id: 'adivina',     emoji: '🔍', tipo: 'Desafío',     dificultad: '⭐⭐ Intermedio',  nombre: 'Adivina la Figura',        desc: 'Te damos el área y los datos. ¿Puedes identificar a qué figura pertenecen?',  color: '#EC4899', bgLight: 'rgba(236,72,153,0.1)' },
  { id: 'carrera',     emoji: '⏱️', tipo: 'Juego',       dificultad: '⭐⭐⭐ Avanzado', nombre: 'Carrera contra el Tiempo', desc: 'Responde la mayor cantidad de ejercicios correctos en 60 segundos.',           color: '#EF4444', bgLight: 'rgba(239,68,68,0.1)'   },
  { id: 'ruleta',      emoji: '🎯', tipo: 'Juego',       dificultad: '⭐⭐ Intermedio',  nombre: 'Ruleta de Figuras',        desc: 'Gira la ruleta, te asigna una figura aleatoria y debes calcular su área.',     color: '#16a34a', bgLight: 'rgba(34,197,94,0.1)'   },
]

const modalAbierto = ref(false)
const actActiva = ref(null)

const abrirActividad = (act) => {
  actActiva.value = act
  modalAbierto.value = true
  if (act.id === 'quiz') reiniciarQuiz()
  if (act.id === 'adivina') reiniciarAdivina()
  if (act.id === 'arrastra') reiniciarDrag()
}

const cerrarModal = () => {
  modalAbierto.value = false
  clearInterval(timerQuiz.value)
  clearInterval(timerCarrera.value)
}

// ── Arrastrar y soltar ───────────────────────────────────
const mkSvg = (nodos) =>
  defineComponent({ render: () => h('svg', { width: 48, height: 48, viewBox: '0 0 80 80' }, nodos) })

const pares = [
  { id: 'cuadrado',    nombre: 'Cuadrado',          color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  formula: 'A = l²',
    svg: mkSvg([h('rect',{x:10,y:10,width:60,height:60,rx:4,fill:'rgba(59,130,246,0.2)',stroke:'#3B82F6','stroke-width':2})]),
    pasos: ['El cuadrado tiene todos sus lados iguales de longitud l.','Multiplica el lado por sí mismo.','A = l × l = l²','Ejemplo: l=4 → A=16 cm²'] },
  { id: 'rectangulo',  nombre: 'Rectángulo',         color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', formula: 'A = b × h',
    svg: mkSvg([h('rect',{x:6,y:20,width:68,height:40,rx:4,fill:'rgba(139,92,246,0.2)',stroke:'#8B5CF6','stroke-width':2})]),
    pasos: ['Tiene base (b) y altura (h).','Multiplica base por altura.','A = b × h','Ejemplo: b=8, h=3 → A=24 cm²'] },
  { id: 'triangulo',   nombre: 'Triángulo',          color: '#16a34a', bg: 'rgba(34,197,94,0.08)',  formula: 'A = (b × h) / 2',
    svg: mkSvg([h('polygon',{points:'40,8 74,72 6,72',fill:'rgba(34,197,94,0.2)',stroke:'#22C55E','stroke-width':2})]),
    pasos: ['Tiene base (b) y altura (h) perpendicular.','Es la mitad de un rectángulo.','A = (b × h) / 2','Ejemplo: b=10, h=6 → A=30 cm²'] },
  { id: 'circulo',     nombre: 'Círculo',            color: '#F97316', bg: 'rgba(251,146,60,0.08)', formula: 'A = π × r²',
    svg: mkSvg([h('circle',{cx:40,cy:40,r:32,fill:'rgba(251,146,60,0.2)',stroke:'#F97316','stroke-width':2}),h('circle',{cx:40,cy:40,r:2.5,fill:'#F97316'})]),
    pasos: ['Tiene radio (r) del centro al borde.','π ≈ 3.1416','A = π × r²','Ejemplo: r=5 → A≈78.54 cm²'] },
  { id: 'trapecio',    nombre: 'Trapecio',           color: '#EC4899', bg: 'rgba(236,72,153,0.08)', formula: 'A = (B + b) × h / 2',
    svg: mkSvg([h('polygon',{points:'20,16 60,16 74,64 6,64',fill:'rgba(236,72,153,0.2)',stroke:'#EC4899','stroke-width':2})]),
    pasos: ['Bases B (mayor) y b (menor), altura h.','Suma las bases: B + b.','Multiplica por h y divide entre 2.','Ejemplo: B=10,b=6,h=4 → A=32 cm²'] },
  { id: 'rombo',       nombre: 'Rombo',              color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  formula: 'A = (d₁ × d₂) / 2',
    svg: mkSvg([h('polygon',{points:'40,6 74,40 40,74 6,40',fill:'rgba(239,68,68,0.2)',stroke:'#EF4444','stroke-width':2}),h('line',{x1:6,y1:40,x2:74,y2:40,stroke:'#EF4444','stroke-width':1,'stroke-dasharray':3}),h('line',{x1:40,y1:6,x2:40,y2:74,stroke:'#EF4444','stroke-width':1,'stroke-dasharray':3})]),
    pasos: ['Diagonales d₁ (mayor) y d₂ (menor).','Multiplica las diagonales.','Divide entre 2.','Ejemplo: d₁=12,d₂=8 → A=48 cm²'] },
  { id: 'paralelogramo', nombre: 'Paralelogramo',   color: '#0891b2', bg: 'rgba(8,145,178,0.08)',  formula: 'A = b × h',
    svg: mkSvg([h('polygon',{points:'18,64 26,16 62,16 54,64',fill:'rgba(8,145,178,0.2)',stroke:'#0891b2','stroke-width':2})]),
    pasos: ['Tiene base (b) y altura perpendicular (h).','La altura NO es el lado inclinado.','A = b × h','Ejemplo: b=9,h=5 → A=45 cm²'] },
  { id: 'pentagono',   nombre: 'Pentágono Regular',  color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', formula: 'A = (P × a) / 2',
    svg: mkSvg([h('polygon',{points:'40,5 75,28 62,68 18,68 5,28',fill:'rgba(124,58,237,0.2)',stroke:'#7c3aed','stroke-width':2}),h('line',{x1:40,y1:40,x2:40,y2:68,stroke:'#7c3aed','stroke-width':1,'stroke-dasharray':3})]),
    pasos: ['P = perímetro (5 × lado), a = apotema.','La apotema va del centro al punto medio de un lado.','A = (P × a) / 2','Ejemplo: l=6,a=4.13 → A≈62 cm²'] },
]

const dragArrastrado = ref(null)
const dragCorrectas = ref(0)
const dragIntentos = ref(0)
const dragCompletado = ref(false)
const dragSolucionFigura = ref(null)
const dragFigurasUnidas = ref([])
const dragFormulas = ref([])

const dragFigurasRestantes = computed(() => pares.filter(p => !dragFigurasUnidas.value.find(u => u.id === p.id)))

const reiniciarDrag = () => {
  dragCorrectas.value = 0; dragIntentos.value = 0
  dragCompletado.value = false; dragSolucionFigura.value = null; dragFigurasUnidas.value = []
  dragFormulas.value = [...pares].sort(() => Math.random() - 0.5).map(p => ({ id: p.id, texto: p.formula, estado: null, hover: false }))
}

const onDragStart = (figura) => { dragArrastrado.value = figura }

const onDrop = (formula) => {
  formula.hover = false
  if (!dragArrastrado.value || formula.estado === 'correcto') return
  dragIntentos.value++
  if (dragArrastrado.value.id === formula.id) {
    formula.estado = 'correcto'; dragCorrectas.value++
    dragFigurasUnidas.value.push(dragArrastrado.value)
    if (dragFigurasUnidas.value.length === pares.length) dragCompletado.value = true
  } else {
    formula.estado = 'incorrecto'
    dragSolucionFigura.value = pares.find(p => p.id === dragArrastrado.value.id)
    setTimeout(() => { formula.estado = null }, 1500)
  }
  dragArrastrado.value = null
}

// ── Calculadora ──────────────────────────────────────────
const calculadoraFiguras = [
  { nombre: 'Cuadrado',          campos: [{ key:'l',  label:'Lado (l)' }],                                                                            formula: v => +(v.l**2).toFixed(2) },
  { nombre: 'Rectángulo',        campos: [{ key:'b',  label:'Base (b)' },{ key:'h', label:'Altura (h)' }],                                            formula: v => +(v.b*v.h).toFixed(2) },
  { nombre: 'Triángulo',         campos: [{ key:'b',  label:'Base (b)' },{ key:'h', label:'Altura (h)' }],                                            formula: v => +((v.b*v.h)/2).toFixed(2) },
  { nombre: 'Círculo',           campos: [{ key:'r',  label:'Radio (r)' }],                                                                           formula: v => +(Math.PI*v.r**2).toFixed(2) },
  { nombre: 'Trapecio',          campos: [{ key:'B',  label:'Base mayor (B)' },{ key:'b', label:'Base menor (b)' },{ key:'h', label:'Altura (h)' }],  formula: v => +((v.B+v.b)*v.h/2).toFixed(2) },
  { nombre: 'Rombo',             campos: [{ key:'d1', label:'Diagonal mayor (d₁)' },{ key:'d2', label:'Diagonal menor (d₂)' }],                       formula: v => +((v.d1*v.d2)/2).toFixed(2) },
  { nombre: 'Paralelogramo',     campos: [{ key:'b',  label:'Base (b)' },{ key:'h', label:'Altura (h)' }],                                            formula: v => +(v.b*v.h).toFixed(2) },
  { nombre: 'Pentágono Regular', campos: [{ key:'l',  label:'Lado (l)' },{ key:'a', label:'Apotema (a)' }],                                           formula: v => +((5*v.l*v.a)/2).toFixed(2) },
]
const calcFigura = ref(null)
const calcFiguraObj = ref(null)
const calcValores = ref({})
const calcResultado = ref(null)
const seleccionarFigura = (f) => { calcFigura.value = f.nombre; calcFiguraObj.value = f; calcValores.value = {}; calcResultado.value = null }
const calcularArea = () => { if (calcFiguraObj.value) calcResultado.value = calcFiguraObj.value.formula(calcValores.value) }

// ── Quiz ─────────────────────────────────────────────────
const quizPreguntas = [
  { pregunta: '¿Cuál es el área de un cuadrado con lado 6 cm?',                        opciones: ['24 cm²','36 cm²','12 cm²','30 cm²'],        correcta: '36 cm²' },
  { pregunta: '¿Cuál es el área de un triángulo con base 10 cm y altura 4 cm?',        opciones: ['40 cm²','14 cm²','20 cm²','8 cm²'],         correcta: '20 cm²' },
  { pregunta: '¿Cuál es la fórmula del área del círculo?',                              opciones: ['A = 2πr','A = πr²','A = πd','A = r²'],      correcta: 'A = πr²' },
  { pregunta: '¿Cuál es el área de un rectángulo de 8 cm × 5 cm?',                     opciones: ['13 cm²','26 cm²','40 cm²','45 cm²'],        correcta: '40 cm²' },
  { pregunta: '¿Cuál es el área de un rombo con diagonales 12 cm y 8 cm?',             opciones: ['48 cm²','96 cm²','20 cm²','24 cm²'],        correcta: '48 cm²' },
  { pregunta: '¿Cuál es el área de un paralelogramo con base 7 cm y altura 4 cm?',     opciones: ['11 cm²','28 cm²','14 cm²','22 cm²'],        correcta: '28 cm²' },
  { pregunta: '¿Cuál es la fórmula del área del pentágono regular?',                    opciones: ['A = 5l','A = (P×a)/2','A = l²','A = Pa'],   correcta: 'A = (P×a)/2' },
]
const quizIndice = ref(0); const quizRespuesta = ref(null); const quizRespondida = ref(false)
const quizPuntaje = ref(0); const quizTerminado = ref(false); const quizTiempo = ref(20)
const timerQuiz = ref(null)

const reiniciarQuiz = () => {
  quizIndice.value=0; quizRespuesta.value=null; quizRespondida.value=false
  quizPuntaje.value=0; quizTerminado.value=false; quizTiempo.value=20
  clearInterval(timerQuiz.value)
  timerQuiz.value = setInterval(() => {
    if (quizRespondida.value) return
    quizTiempo.value--
    if (quizTiempo.value <= 0) { quizRespondida.value=true; quizRespuesta.value=null }
  }, 1000)
}
const responderQuiz = (op) => { if (quizRespondida.value) return; quizRespuesta.value=op; quizRespondida.value=true; if (op===quizPreguntas[quizIndice.value].correcta) quizPuntaje.value++ }
const siguientePregunta = () => {
  if (quizIndice.value < quizPreguntas.length-1) { quizIndice.value++; quizRespondida.value=false; quizRespuesta.value=null; quizTiempo.value=20 }
  else { quizTerminado.value=true; clearInterval(timerQuiz.value) }
}

// ── Adivina ──────────────────────────────────────────────
const adivinaPreguntas = [
  { datos: ['l = 9 cm'],                          area: '81 cm²',     opciones: ['Cuadrado','Rectángulo','Rombo','Trapecio'],          correcta: 'Cuadrado' },
  { datos: ['b = 6 cm','h = 4 cm'],              area: '12 cm²',     opciones: ['Rectángulo','Triángulo','Trapecio','Cuadrado'],       correcta: 'Triángulo' },
  { datos: ['d₁ = 10 cm','d₂ = 6 cm'],          area: '30 cm²',     opciones: ['Triángulo','Cuadrado','Rombo','Círculo'],             correcta: 'Rombo' },
  { datos: ['r = 7 cm'],                          area: '153.94 cm²', opciones: ['Cuadrado','Círculo','Trapecio','Rectángulo'],         correcta: 'Círculo' },
  { datos: ['B = 12 cm','b = 8 cm','h = 5 cm'], area: '50 cm²',     opciones: ['Rectángulo','Rombo','Trapecio','Triángulo'],          correcta: 'Trapecio' },
  { datos: ['b = 9 cm','h = 5 cm'],              area: '45 cm²',     opciones: ['Triángulo','Paralelogramo','Trapecio','Rombo'],       correcta: 'Paralelogramo' },
  { datos: ['l = 6 cm','a = 4.13 cm'],           area: '61.95 cm²',  opciones: ['Hexágono','Cuadrado','Pentágono Regular','Triángulo'],correcta: 'Pentágono Regular' },
]
const adivinaIndice = ref(0); const adivinaRespuesta = ref(null); const adivinaRespondida = ref(false)
const adivinaPuntaje = ref(0); const adivinaTerminado = ref(false)
const adivinaActual = computed(() => adivinaPreguntas[adivinaIndice.value])
const responderAdivina = (op) => { if (adivinaRespondida.value) return; adivinaRespuesta.value=op; adivinaRespondida.value=true; if (op===adivinaActual.value.correcta) adivinaPuntaje.value++ }
const siguienteAdivina = () => { if (adivinaIndice.value<adivinaPreguntas.length-1) { adivinaIndice.value++; adivinaRespondida.value=false; adivinaRespuesta.value=null } else adivinaTerminado.value=true }
const reiniciarAdivina = () => { adivinaIndice.value=0; adivinaRespuesta.value=null; adivinaRespondida.value=false; adivinaPuntaje.value=0; adivinaTerminado.value=false }

// ── Carrera ──────────────────────────────────────────────
const carreraEjercicios = [
  { pregunta:'Cuadrado, l = 5 cm. ¿Área?',               opciones:['20 cm²','25 cm²','10 cm²','15 cm²'],  correcta:'25 cm²' },
  { pregunta:'Rectángulo, b = 7, h = 3. ¿Área?',         opciones:['21 cm²','10 cm²','14 cm²','42 cm²'],  correcta:'21 cm²' },
  { pregunta:'Triángulo, b = 8, h = 6. ¿Área?',          opciones:['48 cm²','14 cm²','24 cm²','16 cm²'],  correcta:'24 cm²' },
  { pregunta:'Rombo, d₁=10, d₂=4. ¿Área?',              opciones:['40 cm²','20 cm²','14 cm²','28 cm²'],  correcta:'20 cm²' },
  { pregunta:'Paralelogramo, b=6, h=4. ¿Área?',          opciones:['10 cm²','24 cm²','12 cm²','48 cm²'],  correcta:'24 cm²' },
  { pregunta:'Pentágono, l=5, a=3.44. ¿Área aproximada?',opciones:['43 cm²','86 cm²','17.2 cm²','34 cm²'],correcta:'43 cm²' },
  { pregunta:'Cuadrado, l = 9 cm. ¿Área?',               opciones:['18 cm²','36 cm²','81 cm²','72 cm²'],  correcta:'81 cm²' },
  { pregunta:'Rectángulo, b=10, h=4. ¿Área?',            opciones:['14 cm²','40 cm²','20 cm²','28 cm²'],  correcta:'40 cm²' },
  { pregunta:'Triángulo, b=12, h=5. ¿Área?',             opciones:['60 cm²','17 cm²','30 cm²','24 cm²'],  correcta:'30 cm²' },
  { pregunta:'Rombo, d₁=14, d₂=6. ¿Área?',              opciones:['42 cm²','84 cm²','20 cm²','48 cm²'],  correcta:'42 cm²' },
]
const carreraIniciada = ref(false); const carreraTerminada = ref(false)
const carreraCorrectas = ref(0); const carreraTiempo = ref(60)
const carreraIndice = ref(0); const carreraRespuesta = ref(null); const carreraRespondida = ref(false)
const timerCarrera = ref(null)
const carreraActual = computed(() => carreraEjercicios[carreraIndice.value % carreraEjercicios.length])
const iniciarCarrera = () => {
  carreraIniciada.value=true; carreraTerminada.value=false; carreraCorrectas.value=0
  carreraTiempo.value=60; carreraIndice.value=0; carreraRespondida.value=false
  timerCarrera.value = setInterval(() => {
    carreraTiempo.value--
    if (carreraTiempo.value<=0) { clearInterval(timerCarrera.value); carreraIniciada.value=false; carreraTerminada.value=true }
  },1000)
}
const responderCarrera = (op) => {
  if (carreraRespondida.value) return
  carreraRespuesta.value=op; carreraRespondida.value=true
  if (op===carreraActual.value.correcta) carreraCorrectas.value++
  setTimeout(()=>{ carreraIndice.value++; carreraRespondida.value=false; carreraRespuesta.value=null },600)
}
const reiniciarCarrera = () => { carreraIniciada.value=false; carreraTerminada.value=false }

// ── Ruleta ───────────────────────────────────────────────
const ruletaOpciones = [
  { nombre:'Cuadrado',          emoji:'🟦', enunciado:'Un cuadrado tiene lado 8 cm. ¿Cuál es su área?',                       opciones:['64 cm²','32 cm²','16 cm²','48 cm²'],          correcta:'64 cm²'    },
  { nombre:'Triángulo',         emoji:'🔺', enunciado:'Triángulo con base 10 cm y altura 7 cm. ¿Área?',                       opciones:['35 cm²','70 cm²','17 cm²','28 cm²'],          correcta:'35 cm²'    },
  { nombre:'Círculo',           emoji:'⭕', enunciado:'Círculo con radio 4 cm. ¿Área aproximada?',                            opciones:['50.27 cm²','25.13 cm²','12.57 cm²','78.54 cm²'],correcta:'50.27 cm²'},
  { nombre:'Rombo',             emoji:'🔷', enunciado:'Rombo con diagonales 16 cm y 10 cm. ¿Área?',                          opciones:['80 cm²','160 cm²','26 cm²','40 cm²'],         correcta:'80 cm²'    },
  { nombre:'Rectángulo',        emoji:'🟩', enunciado:'Rectángulo de 9 cm de base y 5 cm de altura. ¿Área?',                 opciones:['14 cm²','28 cm²','45 cm²','40 cm²'],          correcta:'45 cm²'    },
  { nombre:'Paralelogramo',     emoji:'🔹', enunciado:'Paralelogramo con base 8 cm y altura 3 cm. ¿Área?',                   opciones:['11 cm²','24 cm²','48 cm²','16 cm²'],          correcta:'24 cm²'    },
  { nombre:'Pentágono Regular', emoji:'⭐', enunciado:'Pentágono regular con lado 4 cm y apotema 2.75 cm. ¿Área aproximada?',opciones:['27.5 cm²','55 cm²','11 cm²','22 cm²'],        correcta:'27.5 cm²'  },
]
const ruletaFigura = ref(null); const ruletaGirando = ref(false)
const ruletaRespuesta = ref(null); const ruletaRespondida = ref(false)
const girarRuleta = () => {
  ruletaGirando.value=true; ruletaFigura.value=null; ruletaRespuesta.value=null; ruletaRespondida.value=false
  setTimeout(()=>{ ruletaFigura.value=ruletaOpciones[Math.floor(Math.random()*ruletaOpciones.length)]; ruletaGirando.value=false },1500)
}
const responderRuleta = (op) => { if (ruletaRespondida.value) return; ruletaRespuesta.value=op; ruletaRespondida.value=true }

onUnmounted(() => { clearInterval(timerQuiz.value); clearInterval(timerCarrera.value) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.actividades-page { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:28px; }

/* Banner */
.page-banner { background:linear-gradient(135deg,#0c1120 0%,#0d1f3c 50%,#0a1628 100%); border-radius:14px; padding:28px 32px; border:0.5px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; }
.page-titulo  { font-size:22px; font-weight:700; color:#e8f0fe; margin:0 0 6px; letter-spacing:-0.3px; }
.page-desc    { font-size:13px; color:#4a6fa5; margin:0; line-height:1.6; }
.banner-stats { display:flex; gap:24px; flex-shrink:0; }
.banner-stat  { display:flex; flex-direction:column; align-items:center; }
.banner-stat__num   { font-size:24px; font-weight:700; color:#e8f0fe; }
.banner-stat__label { font-size:11px; color:#4a6fa5; }

/* Grid */
.actividades-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }

/* Tarjeta */
.act-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; display:flex; gap:16px; cursor:pointer; transition:box-shadow 0.2s,transform 0.15s; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.act-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.1); transform:translateY(-2px); }
.act-card__icono { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.act-card__emoji { font-size:26px; }
.act-card__info  { flex:1; display:flex; flex-direction:column; gap:6px; }
.act-card__top   { display:flex; align-items:center; justify-content:space-between; }
.act-card__badge { font-size:11px; font-weight:600; padding:2px 8px; border-radius:20px; }
.act-card__dificultad { font-size:11px; color:#94a3b8; }
.act-card__nombre { font-size:15px; font-weight:600; color:#1e293b; margin:0; }
.act-card__desc   { font-size:12.5px; color:#64748b; margin:0; line-height:1.5; }
.act-card__footer { margin-top:4px; }
.act-card__btn    { display:inline-block; font-size:12px; font-weight:600; color:#fff; padding:5px 12px; border-radius:8px; }

/* Modal */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; display:flex; align-items:center; justify-content:center; padding:24px; backdrop-filter:blur(4px); }
.modal { background:#fff; border-radius:18px; width:100%; max-width:600px; max-height:88vh; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,0.25); }
.modal__header { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; flex-shrink:0; border-bottom:1px solid #e2e8f0; }
.modal__header-left { display:flex; align-items:center; gap:12px; }
.modal__tipo   { font-size:11px; color:#94a3b8; font-weight:600; text-transform:uppercase; margin:0; }
.modal__titulo { font-size:18px; font-weight:700; color:#1e293b; margin:0; }
.modal__cerrar { width:32px; height:32px; border-radius:8px; background:rgba(0,0,0,0.06); border:none; font-size:16px; cursor:pointer; color:#64748b; transition:background 0.15s; }
.modal__cerrar:hover { background:rgba(0,0,0,0.12); }
.modal__body { padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:14px; }
.modal__instruccion { font-size:13.5px; color:#475569; margin:0; line-height:1.6; }

/* Drag */
.drag-stats { display:flex; gap:16px; font-size:13px; color:#475569; padding:10px 14px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0; }
.drag-contenedor { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:4px; }
.drag-col { display:flex; flex-direction:column; gap:8px; }
.drag-col-titulo { font-size:12px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin:0; }
.drag-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; border:1.5px solid; cursor:grab; transition:transform 0.15s,box-shadow 0.15s; background:#fff; user-select:none; }
.drag-item:active { cursor:grabbing; transform:scale(1.02); }
.drag-item:hover  { box-shadow:0 4px 12px rgba(0,0,0,0.08); }
.drag-item--unida { border-color:rgba(34,197,94,0.3)!important; background:rgba(34,197,94,0.05)!important; cursor:default; opacity:0.6; }
.drop-zone { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-radius:10px; border:2px dashed #cbd5e1; background:#f8fafc; min-height:54px; transition:border-color 0.15s,background 0.15s; }
.drop-zone--hover     { border-color:#378ADD; background:rgba(56,138,221,0.06); }
.drop-zone--correcto  { border-color:#16a34a!important; background:rgba(34,197,94,0.08)!important; border-style:solid!important; }
.drop-zone--incorrecto{ border-color:#EF4444!important; background:rgba(239,68,68,0.08)!important; border-style:solid!important; }
.formula-texto { font-size:15px; font-weight:700; color:#1e293b; }
.completado-banner { background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.3); border-radius:12px; padding:16px 20px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.completado-banner p { font-size:13px; color:#16a34a; font-weight:500; margin:0; flex:1; }

/* Solución */
.solucion-panel { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:10px; }
.solucion-header { display:flex; justify-content:space-between; align-items:center; }
.solucion-titulo { font-size:14px; font-weight:600; color:#1e293b; margin:0; }
.btn-cerrar-sol { background:#e2e8f0; border:none; border-radius:6px; width:26px; height:26px; font-size:12px; color:#64748b; cursor:pointer; }
.paso { display:flex; align-items:flex-start; gap:10px; }
.paso-num { width:22px; height:22px; border-radius:50%; color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.paso-texto { font-size:13px; color:#334155; margin:0; line-height:1.5; padding-top:2px; }
.solucion-formula { display:flex; align-items:center; justify-content:space-between; border:1.5px solid; border-radius:10px; padding:10px 16px; }

/* Quiz */
.quiz-header   { display:flex; justify-content:space-between; align-items:center; }
.quiz-progreso { font-size:13px; color:#64748b; font-weight:500; }
.quiz-timer    { font-size:14px; font-weight:700; }
.quiz-barra    { height:4px; background:#e2e8f0; border-radius:2px; overflow:hidden; margin:8px 0; }
.quiz-barra-fill { height:100%; background:#378ADD; border-radius:2px; transition:width 0.3s; }
.quiz-pregunta { font-size:15px; font-weight:600; color:#1e293b; margin:12px 0; line-height:1.4; }
.quiz-opciones { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.quiz-opcion   { padding:10px 12px; border-radius:10px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:13px; font-weight:500; cursor:pointer; color:#334155; transition:all 0.15s; text-align:left; }
.quiz-opcion:hover:not(:disabled) { border-color:#378ADD; background:rgba(56,138,221,0.06); }
.quiz-opcion.correcta  { background:rgba(34,197,94,0.1);  border-color:#22c55e; color:#16a34a; }
.quiz-opcion.incorrecta{ background:rgba(239,68,68,0.1);  border-color:#ef4444; color:#dc2626; }
.quiz-feedback { font-size:13px; font-weight:600; margin:8px 0 0; }
.quiz-resultado { text-align:center; padding:16px 0; display:flex; flex-direction:column; align-items:center; gap:8px; }
.quiz-resultado-emoji { font-size:48px; margin:0; }
.quiz-resultado h3 { font-size:18px; font-weight:700; color:#1e293b; margin:0; }
.quiz-resultado p  { font-size:14px; color:#475569; margin:0; }

/* Adivina */
.adivina-datos { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; display:flex; flex-direction:column; gap:4px; }
.adivina-datos p { font-size:13px; color:#334155; margin:0; }
.adivina-area { font-size:15px; font-weight:700; color:#1e293b; margin-top:6px!important; }

/* Calculadora */
.calc-figuras { display:flex; flex-wrap:wrap; gap:8px; }
.calc-figura-btn { padding:6px 14px; border-radius:20px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:13px; font-weight:500; cursor:pointer; color:#475569; transition:all 0.15s; }
.calc-figura-btn:hover { border-color:#378ADD; color:#378ADD; }
.calc-inputs { display:flex; flex-direction:column; gap:12px; margin-top:8px; }
.calc-input-group { display:flex; flex-direction:column; gap:4px; }
.calc-input-group label { font-size:12px; font-weight:600; color:#475569; }
.calc-input { padding:9px 12px; border-radius:8px; border:1.5px solid #e2e8f0; font-size:14px; color:#1e293b; outline:none; transition:border 0.15s; }
.calc-input:focus { border-color:#378ADD; }
.calc-btn { padding:10px 20px; border-radius:10px; background:#378ADD; color:#fff; border:none; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s; margin-top:4px; }
.calc-btn:hover { background:#2a6ab5; }
.calc-btn:disabled { background:#94a3b8; cursor:not-allowed; }
.calc-resultado { display:flex; align-items:center; justify-content:space-between; background:rgba(56,138,221,0.08); border:1.5px solid rgba(56,138,221,0.3); border-radius:10px; padding:12px 16px; font-size:14px; color:#475569; font-weight:500; }

/* Ruleta */
.ruleta-box { display:flex; flex-direction:column; align-items:center; gap:16px; padding:8px 0; }
.ruleta { width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg,#0c1120,#0d1f3c); border:3px solid #378ADD; display:flex; align-items:center; justify-content:center; font-size:40px; box-shadow:0 4px 16px rgba(56,138,221,0.3); }
.ruleta.girando { animation:girar 1.5s ease-out; }
@keyframes girar { 0%{transform:rotate(0)} 100%{transform:rotate(1080deg)} }
.ruleta-ejercicio { display:flex; flex-direction:column; gap:10px; width:100%; }

/* Transición */
.modal-enter-active,.modal-leave-active { transition:opacity 0.2s ease; }
.modal-enter-from,.modal-leave-to { opacity:0; }

/* Responsive */
@media(max-width:768px) {
  .actividades-grid { grid-template-columns:1fr; }
  .quiz-opciones { grid-template-columns:1fr; }
  .drag-contenedor { grid-template-columns:1fr; }
  .banner-stats { display:none; }
}
</style>