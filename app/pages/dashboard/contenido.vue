<template>
  <div class="contenido-page">

    <!-- Banner -->
    <div class="page-banner">
      <div>
        <h1 class="page-titulo">Figuras Geométricas</h1>
        <p class="page-desc">Aprende las fórmulas, propiedades y aplicaciones de las principales figuras geométricas planas.</p>
      </div>
      <div class="banner-stats">
        <div class="banner-stat"><span class="banner-stat__num">8</span><span class="banner-stat__label">Figuras</span></div>
        <div class="banner-stat"><span class="banner-stat__num">📹</span><span class="banner-stat__label">Videos</span></div>
      </div>
    </div>

    <!-- Introducción -->
    <div class="intro-card">
      <div class="intro-card__icono">📐</div>
      <div>
        <h2 class="intro-card__titulo">¿Qué es el área de una figura?</h2>
        <p class="intro-card__texto">El <strong>área</strong> es la medida de la superficie que ocupa una figura geométrica plana. Se expresa en unidades cuadradas como cm², m² o km². Conocer el área es fundamental en construcción, diseño, ingeniería y la vida cotidiana.</p>
      </div>
    </div>

    <!-- Video principal -->
    <div class="seccion">
      <h2 class="seccion__titulo">🎬 Video introductorio</h2>
      <p class="seccion__desc">Antes de ver las figuras, mira este video que explica el concepto de área de forma clara y visual.</p>
      <div class="video-principal" @click="abrirVideo(videoIntro)">
        <div class="video-principal__thumb">
          <img :src="`https://img.youtube.com/vi/${videoIntro.id}/maxresdefault.jpg`" :alt="videoIntro.titulo" class="video-principal__img" />
          <div class="video-principal__play">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <div class="video-principal__overlay">
            <span class="video-principal__label">▶ Ver video</span>
          </div>
        </div>
        <div class="video-principal__info">
          <span class="video-badge">Introducción</span>
          <h3 class="video-principal__titulo">{{ videoIntro.titulo }}</h3>
          <p class="video-principal__desc">{{ videoIntro.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Tarjetas de figuras -->
    <div class="seccion">
      <h2 class="seccion__titulo">📚 Figuras geométricas</h2>
      <p class="seccion__desc">Haz clic en cada figura para ver su fórmula, propiedades, ejemplos y más información.</p>
      <div class="figuras-grid">
        <div
          v-for="figura in figuras"
          :key="figura.nombre"
          class="figura-card"
          @click="abrirModal(figura)"
        >
          <div class="figura-card__svg">
            <component :is="figura.svg" />
          </div>
          <div class="figura-card__info">
            <span class="figura-card__badge" :style="{ background: figura.bgLight, color: figura.color }">{{ figura.nombre }}</span>
            <p class="figura-card__def">{{ figura.def }}</p>
            <div class="formula-box" :style="{ borderColor: figura.borderColor, background: figura.bgLight }">
              <span class="formula-label">Fórmula</span>
              <span class="formula-text" :style="{ color: figura.color }">{{ figura.formula }}</span>
            </div>
            <div class="ver-mas"><span :style="{ color: figura.color }">Ver más →</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Videos complementarios -->
    <div class="seccion">
      <h2 class="seccion__titulo">🎥 Videos por tema</h2>
      <p class="seccion__desc">Videos específicos para reforzar cada concepto del contenido.</p>
      <div class="videos-grid">
        <div v-for="video in videosContenido" :key="video.id" class="video-card" @click="abrirVideo(video)">
          <div class="video-card__thumb">
            <img :src="`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`" :alt="video.titulo" class="video-card__img" />
            <div class="video-card__play">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div class="video-card__info">
            <span class="video-card__badge" :style="{ background: video.bgBadge, color: video.color }">{{ video.categoria }}</span>
            <h3 class="video-card__titulo">{{ video.titulo }}</h3>
            <p class="video-card__desc">{{ video.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal figura -->
    <Transition name="modal">
      <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal" v-if="figuraSeleccionada">
          <div class="modal__header" :style="{ background: figuraSeleccionada.bgLight, borderBottom: '1px solid ' + figuraSeleccionada.borderColor }">
            <div class="modal__header-left">
              <component :is="figuraSeleccionada.svg" />
              <div>
                <span class="modal__badge" :style="{ background: figuraSeleccionada.color + '22', color: figuraSeleccionada.color }">{{ figuraSeleccionada.nombre }}</span>
                <h2 class="modal__titulo">{{ figuraSeleccionada.nombre }}</h2>
              </div>
            </div>
            <button class="modal__cerrar" @click="cerrarModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal__body">
            <div class="modal__seccion">
              <h3 class="modal__seccion-titulo">📐 Fórmula</h3>
              <div class="modal__formula" :style="{ borderColor: figuraSeleccionada.borderColor, background: figuraSeleccionada.bgLight }">
                <span class="modal__formula-text" :style="{ color: figuraSeleccionada.color }">{{ figuraSeleccionada.formula }}</span>
              </div>
              <div class="modal__variables">
                <p v-for="v in figuraSeleccionada.variables" :key="v">• {{ v }}</p>
              </div>
            </div>
            <div class="modal__seccion">
              <h3 class="modal__seccion-titulo">📋 Propiedades</h3>
              <ul class="modal__lista">
                <li v-for="p in figuraSeleccionada.propiedades" :key="p">{{ p }}</li>
              </ul>
            </div>
            <div class="modal__seccion" v-if="figuraSeleccionada.tipos">
              <h3 class="modal__seccion-titulo">🔷 Tipos</h3>
              <div class="modal__tags">
                <span v-for="t in figuraSeleccionada.tipos" :key="t" class="modal__tag" :style="{ background: figuraSeleccionada.bgLight, color: figuraSeleccionada.color, border: '1px solid ' + figuraSeleccionada.borderColor }">{{ t }}</span>
              </div>
            </div>
            <div class="modal__seccion">
              <h3 class="modal__seccion-titulo">✏️ Ejemplo resuelto</h3>
              <div class="modal__ejemplo">
                <p class="modal__ejemplo-enunciado">{{ figuraSeleccionada.ejemplo.enunciado }}</p>
                <div class="modal__pasos">
                  <div v-for="(paso, i) in figuraSeleccionada.ejemplo.pasos" :key="i" class="modal__paso">
                    <div class="modal__paso-num" :style="{ background: figuraSeleccionada.color }">{{ i + 1 }}</div>
                    <p>{{ paso }}</p>
                  </div>
                </div>
                <div class="modal__resultado" :style="{ borderColor: figuraSeleccionada.borderColor, background: figuraSeleccionada.bgLight }">
                  <span>Resultado:</span>
                  <strong :style="{ color: figuraSeleccionada.color }">{{ figuraSeleccionada.ejemplo.resultado }}</strong>
                </div>
              </div>
            </div>
            <div class="modal__seccion">
              <h3 class="modal__seccion-titulo">💡 Curiosidades</h3>
              <ul class="modal__lista">
                <li v-for="c in figuraSeleccionada.curiosidades" :key="c">{{ c }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal video -->
    <Transition name="modal">
      <div v-if="videoActivo" class="modal-overlay" @click.self="cerrarVideo">
        <div class="modal-video">
          <div class="modal-video__header">
            <div>
              <p class="modal-video__categoria">{{ videoActivo.categoria }}</p>
              <h3 class="modal-video__titulo">{{ videoActivo.titulo }}</h3>
            </div>
            <button class="modal-video__cerrar" @click="cerrarVideo">✕</button>
          </div>
          <div class="modal-video__player">
            <iframe
              :src="`https://www.youtube.com/embed/${videoActivo.id}?autoplay=1&rel=0`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <p class="modal-video__desc">{{ videoActivo.desc }}</p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { useUsuarioStore } from '~/stores/usuario'
import { onMounted } from 'vue'
const usuario = useUsuarioStore()
onMounted(() => usuario.marcarVisitada('/dashboard/contenido')) // cambia la ruta según la página
definePageMeta({ layout: 'dashboard' })
import { ref, defineComponent, h } from 'vue'

const modalAbierto = ref(false)
const figuraSeleccionada = ref(null)
const videoActivo = ref(null)

const abrirModal = (figura) => { figuraSeleccionada.value = figura; modalAbierto.value = true }
const cerrarModal = () => { modalAbierto.value = false }
const abrirVideo = (video) => { videoActivo.value = video }
const cerrarVideo = () => { videoActivo.value = null }

const mkSvg = (nodos, w = 80, ht = 80) =>
  defineComponent({ render: () => h('svg', { width: w, height: ht, viewBox: `0 0 ${w} ${ht}` }, nodos) })

// ── Videos ────────────────────────────────────────────────────────────
const videoIntro = {
  id: 'TZDgCnfDrIE',
  titulo: 'Área de figuras geométricas — Explicación completa',
  desc: 'Repaso completo de las fórmulas de área de todas las figuras geométricas con ejemplos visuales paso a paso.',
  categoria: 'Introducción',
  color: '#3B82F6', bgBadge: 'rgba(59,130,246,0.12)',
}

const videosContenido = [
  {
    id: 'F_Hc1aOAYHw',
    titulo: 'Área de figuras geométricas básicas',
    desc: 'Aprende a calcular el área de cuadrado, rectángulo, triángulo y círculo con ejemplos claros.',
    categoria: 'Básico',
    color: '#3B82F6', bgBadge: 'rgba(59,130,246,0.12)',
  },
  {
    id: 'Z1iQg9N9MEI',
    titulo: 'Áreas y perímetros explicados',
    desc: 'Explicación completa de áreas y perímetros con ejercicios resueltos paso a paso.',
    categoria: 'Intermedio',
    color: '#8B5CF6', bgBadge: 'rgba(139,92,246,0.12)',
  },
  {
    id: '5CaxOkGvjks',
    titulo: 'Geometría para secundaria',
    desc: 'Todo sobre geometría plana para secundaria: fórmulas, propiedades y aplicaciones.',
    categoria: 'Secundaria',
    color: '#16a34a', bgBadge: 'rgba(34,197,94,0.12)',
  },
  {
    id: 'JM2cPKpJmrw',
    titulo: 'Ejercicios resueltos de áreas',
    desc: 'Practica con ejercicios resueltos de cálculo de áreas de diferentes figuras geométricas.',
    categoria: 'Ejercicios',
    color: '#EC4899', bgBadge: 'rgba(236,72,153,0.12)',
  },
]

// ── Figuras ───────────────────────────────────────────────────────────
const figuras = [
  {
    nombre: 'Cuadrado',
    color: '#3B82F6', bgLight: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.3)',
    def: 'Figura con cuatro lados iguales y cuatro ángulos rectos.',
    formula: 'A = l²', variables: ['l = longitud del lado'],
    svg: mkSvg([
      h('rect', { x:10, y:10, width:60, height:60, rx:4, fill:'rgba(59,130,246,0.2)', stroke:'#3B82F6', 'stroke-width':2 }),
      h('text', { x:40, y:44, 'text-anchor':'middle', 'font-size':11, fill:'#3B82F6', 'font-family':'DM Sans' }, 'l'),
    ]),
    propiedades: ['Todos sus lados son iguales.','Sus cuatro ángulos son rectos (90°).','Sus diagonales son iguales y se cortan perpendicularmente.','Es un caso especial del rectángulo.','El perímetro es P = 4l.'],
    tipos: ['Cuadrado unitario','Cuadrado mágico'],
    ejemplo: { enunciado:'Un piso cuadrado tiene un lado de 7 metros. ¿Cuál es su área?', pasos:['Identificar el dato: l = 7 m','Aplicar la fórmula: A = l²','Sustituir: A = 7²','Calcular: A = 49'], resultado:'A = 49 m²' },
    curiosidades: ['Los azulejos de baño son generalmente cuadrados para facilitar su instalación.','El cuadrado es la figura con mayor área para un perímetro dado entre los rectángulos.','En ajedrez, el tablero está formado por 64 cuadrados iguales.'],
  },
  {
    nombre: 'Rectángulo',
    color: '#8B5CF6', bgLight: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.3)',
    def: 'Figura con cuatro lados y cuatro ángulos rectos. Lados opuestos iguales.',
    formula: 'A = b × h', variables: ['b = base', 'h = altura'],
    svg: mkSvg([
      h('rect', { x:6, y:20, width:68, height:40, rx:4, fill:'rgba(139,92,246,0.2)', stroke:'#8B5CF6', 'stroke-width':2 }),
      h('text', { x:40, y:43, 'text-anchor':'middle', 'font-size':9, fill:'#8B5CF6', 'font-family':'DM Sans' }, 'b'),
    ]),
    propiedades: ['Los lados opuestos son paralelos e iguales.','Sus cuatro ángulos son rectos (90°).','Sus diagonales son iguales y se bisectan.','El perímetro es P = 2(b + h).'],
    tipos: ['Rectángulo áureo','Rectángulo cuadrado'],
    ejemplo: { enunciado:'Una cancha de fútbol mide 100 m de largo y 60 m de ancho. ¿Cuál es su área?', pasos:['Identificar los datos: b = 100 m, h = 60 m','Aplicar la fórmula: A = b × h','Sustituir: A = 100 × 60','Calcular: A = 6000'], resultado:'A = 6000 m²' },
    curiosidades: ['Las pantallas de TV son rectangulares en proporción 16:9.','El rectángulo áureo tiene una proporción especial usada en arte y arquitectura.','La mayoría de las hojas de papel (A4, carta) son rectangulares.'],
  },
  {
    nombre: 'Triángulo',
    color: '#16a34a', bgLight: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)',
    def: 'Figura con tres lados y tres ángulos. La suma de sus ángulos es 180°.',
    formula: 'A = (b × h) / 2', variables: ['b = base', 'h = altura'],
    svg: mkSvg([
      h('polygon', { points:'40,8 74,72 6,72', fill:'rgba(34,197,94,0.2)', stroke:'#22C55E', 'stroke-width':2 }),
      h('text', { x:40, y:68, 'text-anchor':'middle', 'font-size':9, fill:'#22C55E', 'font-family':'DM Sans' }, 'b'),
    ]),
    propiedades: ['La suma de sus tres ángulos internos es siempre 180°.','El lado más largo es siempre menor que la suma de los otros dos.','La altura es la distancia perpendicular de un vértice a la base.','El perímetro es P = a + b + c.'],
    tipos: ['Equilátero','Isósceles','Escaleno','Rectángulo','Obtusángulo','Acutángulo'],
    ejemplo: { enunciado:'Un triángulo tiene una base de 12 cm y una altura de 8 cm. ¿Cuál es su área?', pasos:['Identificar los datos: b = 12 cm, h = 8 cm','Aplicar la fórmula: A = (b × h) / 2','Sustituir: A = (12 × 8) / 2','Calcular: A = 96 / 2 = 48'], resultado:'A = 48 cm²' },
    curiosidades: ['Las pirámides de Egipto tienen caras triangulares.','El triángulo es la figura geométrica más rígida, por eso se usa en construcción.','La señalización vial usa triángulos para indicar advertencias.'],
  },
  {
    nombre: 'Círculo',
    color: '#F97316', bgLight: 'rgba(251,146,60,0.08)', borderColor: 'rgba(251,146,60,0.3)',
    def: 'Figura perfectamente redonda donde todos los puntos equidistan del centro.',
    formula: 'A = π × r²', variables: ['r = radio', 'π ≈ 3.1416'],
    svg: mkSvg([
      h('circle', { cx:40, cy:40, r:32, fill:'rgba(251,146,60,0.2)', stroke:'#F97316', 'stroke-width':2 }),
      h('line', { x1:40, y1:40, x2:72, y2:40, stroke:'#F97316', 'stroke-width':1.5, 'stroke-dasharray':3 }),
      h('text', { x:56, y:36, 'text-anchor':'middle', 'font-size':9, fill:'#F97316', 'font-family':'DM Sans' }, 'r'),
      h('circle', { cx:40, cy:40, r:2.5, fill:'#F97316' }),
    ]),
    propiedades: ['Todos los puntos de la circunferencia equidistan del centro.','El diámetro es el doble del radio: d = 2r.','La circunferencia (perímetro) es C = 2πr.','Es la figura con mayor área para un perímetro dado.'],
    tipos: ['Círculo unitario','Semicírculo','Sector circular','Corona circular'],
    ejemplo: { enunciado:'Una pizza circular tiene un radio de 15 cm. ¿Cuál es su área?', pasos:['Identificar el dato: r = 15 cm','Aplicar la fórmula: A = π × r²','Sustituir: A = 3.1416 × 15²','Calcular: A = 3.1416 × 225 = 706.86'], resultado:'A ≈ 706.86 cm²' },
    curiosidades: ['Las ruedas son circulares porque minimizan la fricción al rodar.','El número π es irracional — sus decimales nunca terminan ni se repiten.','Los ojos de los animales son aproximadamente circulares para captar luz en todas direcciones.'],
  },
  {
    nombre: 'Trapecio',
    color: '#EC4899', bgLight: 'rgba(236,72,153,0.08)', borderColor: 'rgba(236,72,153,0.3)',
    def: 'Cuadrilátero con un par de lados paralelos llamados bases.',
    formula: 'A = (B + b) × h / 2', variables: ['B = base mayor', 'b = base menor', 'h = altura'],
    svg: mkSvg([
      h('polygon', { points:'20,16 60,16 74,64 6,64', fill:'rgba(236,72,153,0.2)', stroke:'#EC4899', 'stroke-width':2 }),
      h('text', { x:40, y:13, 'text-anchor':'middle', 'font-size':9, fill:'#EC4899', 'font-family':'DM Sans' }, 'B'),
      h('text', { x:40, y:76, 'text-anchor':'middle', 'font-size':9, fill:'#EC4899', 'font-family':'DM Sans' }, 'b'),
    ]),
    propiedades: ['Solo un par de lados son paralelos (las bases).','Los lados no paralelos se llaman lados oblicuos.','La mediana mide (B + b) / 2.','El perímetro es la suma de sus cuatro lados.'],
    tipos: ['Trapecio rectángulo','Trapecio isósceles','Trapecio escaleno'],
    ejemplo: { enunciado:'Un trapecio tiene bases de 14 cm y 8 cm, y una altura de 6 cm. ¿Cuál es su área?', pasos:['Identificar los datos: B = 14 cm, b = 8 cm, h = 6 cm','Aplicar la fórmula: A = (B + b) × h / 2','Sustituir: A = (14 + 8) × 6 / 2','Calcular: A = 22 × 6 / 2 = 66'], resultado:'A = 66 cm²' },
    curiosidades: ['Los puentes en arco tienen secciones trapezoidales.','Muchas presas de agua tienen sección trapezoidal.','Las bolsas de papel suelen tener forma trapezoidal en su base.'],
  },
  {
    nombre: 'Rombo',
    color: '#EF4444', bgLight: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)',
    def: 'Cuadrilátero con cuatro lados iguales. Sus diagonales se cortan perpendicularmente.',
    formula: 'A = (d₁ × d₂) / 2', variables: ['d₁ = diagonal mayor', 'd₂ = diagonal menor'],
    svg: mkSvg([
      h('polygon', { points:'40,6 74,40 40,74 6,40', fill:'rgba(239,68,68,0.2)', stroke:'#EF4444', 'stroke-width':2 }),
      h('line', { x1:6, y1:40, x2:74, y2:40, stroke:'#EF4444', 'stroke-width':1, 'stroke-dasharray':3 }),
      h('line', { x1:40, y1:6, x2:40, y2:74, stroke:'#EF4444', 'stroke-width':1, 'stroke-dasharray':3 }),
    ]),
    propiedades: ['Sus cuatro lados son iguales.','Sus diagonales se cortan en ángulo recto.','Las diagonales se bisectan mutuamente.','Los ángulos opuestos son iguales.'],
    tipos: ['Rombo cuadrado','Rombo oblicuo'],
    ejemplo: { enunciado:'Un rombo tiene diagonales de 16 cm y 10 cm. ¿Cuál es su área?', pasos:['Identificar los datos: d₁ = 16 cm, d₂ = 10 cm','Aplicar la fórmula: A = (d₁ × d₂) / 2','Sustituir: A = (16 × 10) / 2','Calcular: A = 160 / 2 = 80'], resultado:'A = 80 cm²' },
    curiosidades: ['El símbolo del palo de diamantes en las cartas tiene forma de rombo.','Las señales de peligro en carreteras suelen ser rombos.','Los campos de béisbol tienen forma de rombo visto desde arriba.'],
  },
  {
    nombre: 'Paralelogramo',
    color: '#0891b2', bgLight: 'rgba(8,145,178,0.08)', borderColor: 'rgba(8,145,178,0.3)',
    def: 'Cuadrilátero con dos pares de lados paralelos e iguales.',
    formula: 'A = b × h', variables: ['b = base', 'h = altura perpendicular'],
    svg: mkSvg([
      h('polygon', { points:'18,64 26,16 62,16 54,64', fill:'rgba(8,145,178,0.2)', stroke:'#0891b2', 'stroke-width':2 }),
      h('text', { x:40, y:76, 'text-anchor':'middle', 'font-size':9, fill:'#0891b2', 'font-family':'DM Sans' }, 'b'),
    ]),
    propiedades: ['Los lados opuestos son paralelos e iguales.','Los ángulos opuestos son iguales.','La suma de ángulos adyacentes es 180°.','Las diagonales se bisectan mutuamente.'],
    tipos: ['Rectángulo','Rombo','Cuadrado','Romboide'],
    ejemplo: { enunciado:'Un paralelogramo tiene base 9 cm y altura 5 cm. ¿Cuál es su área?', pasos:['Identificar los datos: b = 9 cm, h = 5 cm','Aplicar la fórmula: A = b × h','Sustituir: A = 9 × 5','Calcular: A = 45'], resultado:'A = 45 cm²' },
    curiosidades: ['Los romboides aparecen en diseños de baldosas y mosaicos.','Las fuerzas en física se representan como paralelogramos.','Muchos cristales tienen estructuras con formas de paralelogramo.'],
  },
  {
    nombre: 'Pentágono Regular',
    color: '#7c3aed', bgLight: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.3)',
    def: 'Polígono de cinco lados y cinco ángulos iguales.',
    formula: 'A = (P × a) / 2', variables: ['P = perímetro (5 × lado)', 'a = apotema'],
    svg: mkSvg([
      h('polygon', { points:'40,5 75,28 62,68 18,68 5,28', fill:'rgba(124,58,237,0.2)', stroke:'#7c3aed', 'stroke-width':2 }),
      h('line', { x1:40, y1:40, x2:40, y2:68, stroke:'#7c3aed', 'stroke-width':1, 'stroke-dasharray':3 }),
    ]),
    propiedades: ['Tiene 5 lados y 5 ángulos iguales.','Cada ángulo interior mide 108°.','La suma de sus ángulos interiores es 540°.','Tiene 5 ejes de simetría.'],
    tipos: ['Pentágono regular','Pentágono irregular','Pentáculo (estrella de 5 puntas)'],
    ejemplo: { enunciado:'Un pentágono regular tiene lado 6 cm y apotema 4.13 cm. ¿Cuál es su área?', pasos:['Calcular el perímetro: P = 5 × 6 = 30 cm','Identificar la apotema: a = 4.13 cm','Aplicar la fórmula: A = (P × a) / 2','Calcular: A = (30 × 4.13) / 2 = 61.95'], resultado:'A ≈ 61.95 cm²' },
    curiosidades: ['El Pentágono de EE.UU. es el edificio de oficinas más grande del mundo con esa forma.','La estrella de cinco puntas se forma uniendo los vértices de un pentágono.','Las flores de muchas plantas tienen cinco pétalos con simetría pentagonal.'],
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.contenido-page { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:32px; }

/* Banner */
.page-banner { background:linear-gradient(135deg,#0c1120 0%,#0d1f3c 50%,#0a1628 100%); border-radius:14px; padding:28px 32px; border:0.5px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; }
.page-titulo { font-size:22px; font-weight:700; color:#e8f0fe; margin:0 0 6px; letter-spacing:-0.3px; }
.page-desc   { font-size:13px; color:#4a6fa5; margin:0; line-height:1.6; }
.banner-stats { display:flex; gap:24px; flex-shrink:0; }
.banner-stat  { display:flex; flex-direction:column; align-items:center; }
.banner-stat__num   { font-size:24px; font-weight:700; color:#e8f0fe; }
.banner-stat__label { font-size:11px; color:#4a6fa5; }

/* Intro */
.intro-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:24px; display:flex; gap:16px; align-items:flex-start; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.intro-card__icono { font-size:32px; flex-shrink:0; }
.intro-card__titulo { font-size:17px; font-weight:700; color:#0f1f3d; margin:0 0 8px; }
.intro-card__texto  { font-size:13px; color:#334155; margin:0; line-height:1.6; }

/* Sección */
.seccion { display:flex; flex-direction:column; gap:16px; }
.seccion__titulo { font-size:18px; font-weight:700; color:#0f1f3d; margin:0; }
.seccion__desc   { font-size:13px; color:#5a6e8a; margin:0; }

/* Video principal */
.video-principal { background:#fff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; cursor:pointer; display:flex; flex-direction:column; transition:box-shadow 0.2s,transform 0.15s; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.video-principal:hover { box-shadow:0 8px 24px rgba(0,0,0,0.1); transform:translateY(-2px); }
.video-principal__thumb { position:relative; height:200px; overflow:hidden; background:#0c1120; }
.video-principal__img   { width:100%; height:100%; object-fit:cover; }
.video-principal__play  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
.video-principal__play div, .video-principal__play { /* via wrapper */ }
.video-principal__overlay { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.35); transition:background 0.2s; }
.video-principal:hover .video-principal__overlay { background:rgba(0,0,0,0.5); }
.video-principal__label { color:#fff; font-size:16px; font-weight:600; }
.video-principal__info  { padding:20px 24px; }
.video-badge { font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; background:rgba(59,130,246,0.1); color:#3B82F6; }
.video-principal__titulo { font-size:17px; font-weight:700; color:#0f1f3d; margin:8px 0 6px; }
.video-principal__desc  { font-size:13px; color:#5a6e8a; margin:0; line-height:1.5; }

/* Grid figuras */
.figuras-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }

.figura-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:24px; display:flex; gap:20px; box-shadow:0 1px 4px rgba(0,0,0,0.05); transition:box-shadow 0.2s,transform 0.15s; cursor:pointer; }
.figura-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.1); transform:translateY(-2px); }
.figura-card__svg  { flex-shrink:0; display:flex; align-items:flex-start; padding-top:4px; }
.figura-card__info { flex:1; display:flex; flex-direction:column; gap:10px; }
.figura-card__badge { font-size:13px; font-weight:600; padding:3px 10px; border-radius:20px; width:fit-content; }
.figura-card__def   { font-size:13px; color:#334155; margin:0; line-height:1.5; }
.formula-box { display:flex; align-items:center; justify-content:space-between; border:1px solid; border-radius:8px; padding:8px 14px; }
.formula-label { font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
.formula-text  { font-size:16px; font-weight:700; }
.ver-mas { font-size:12px; font-weight:500; }

/* Videos grid */
.videos-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }

.video-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; cursor:pointer; transition:box-shadow 0.2s,transform 0.15s; display:flex; flex-direction:column; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.video-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.1); transform:translateY(-2px); }
.video-card__thumb { position:relative; height:120px; background:#0c1120; overflow:hidden; }
.video-card__img   { width:100%; height:100%; object-fit:cover; }
.video-card__play  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.4); }
.video-card__play div { width:40px; height:40px; border-radius:50%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; }
.video-card__info  { padding:14px; display:flex; flex-direction:column; gap:6px; flex:1; }
.video-card__badge { font-size:11px; font-weight:600; padding:2px 8px; border-radius:20px; width:fit-content; }
.video-card__titulo { font-size:14px; font-weight:600; color:#1e293b; margin:0; line-height:1.4; }
.video-card__desc   { font-size:12px; color:#64748b; margin:0; line-height:1.5; }

/* Modal figura */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; display:flex; align-items:center; justify-content:center; padding:24px; backdrop-filter:blur(4px); }
.modal { background:#fff; border-radius:18px; width:100%; max-width:620px; max-height:85vh; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,0.25); }
.modal__header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; flex-shrink:0; }
.modal__header-left { display:flex; align-items:center; gap:14px; }
.modal__badge  { font-size:11px; font-weight:600; padding:2px 8px; border-radius:20px; display:block; margin-bottom:4px; }
.modal__titulo { font-size:20px; font-weight:700; color:#1e293b; margin:0; }
.modal__cerrar { width:32px; height:32px; border-radius:8px; background:rgba(0,0,0,0.06); border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#64748b; transition:background 0.15s; }
.modal__cerrar:hover { background:rgba(0,0,0,0.12); }
.modal__body { padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:24px; }
.modal__seccion { display:flex; flex-direction:column; gap:10px; }
.modal__seccion-titulo { font-size:14px; font-weight:600; color:#1e293b; margin:0; }
.modal__formula { display:flex; align-items:center; justify-content:center; border:1.5px solid; border-radius:10px; padding:14px; }
.modal__formula-text { font-size:22px; font-weight:700; }
.modal__variables { display:flex; flex-direction:column; gap:4px; }
.modal__variables p { font-size:13px; color:#475569; margin:0; }
.modal__lista { margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px; }
.modal__lista li { font-size:13px; color:#334155; line-height:1.5; }
.modal__tags { display:flex; flex-wrap:wrap; gap:8px; }
.modal__tag  { font-size:12px; font-weight:500; padding:4px 12px; border-radius:20px; }
.modal__ejemplo { display:flex; flex-direction:column; gap:12px; }
.modal__ejemplo-enunciado { font-size:13px; color:#334155; margin:0; font-style:italic; line-height:1.5; }
.modal__pasos { display:flex; flex-direction:column; gap:8px; }
.modal__paso  { display:flex; align-items:flex-start; gap:10px; }
.modal__paso-num { width:22px; height:22px; border-radius:50%; color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
.modal__paso p { font-size:13px; color:#334155; margin:0; line-height:1.5; }
.modal__resultado { display:flex; align-items:center; justify-content:space-between; border:1.5px solid; border-radius:10px; padding:10px 16px; }
.modal__resultado span   { font-size:13px; color:#64748b; font-weight:500; }
.modal__resultado strong { font-size:16px; font-weight:700; }

/* Modal video */
.modal-video { background:#fff; border-radius:18px; width:100%; max-width:700px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.4); }
.modal-video__header { display:flex; align-items:flex-start; justify-content:space-between; padding:20px 24px 16px; }
.modal-video__categoria { font-size:11px; color:#94a3b8; font-weight:600; text-transform:uppercase; margin:0 0 4px; }
.modal-video__titulo    { font-size:18px; font-weight:700; color:#1e293b; margin:0; }
.modal-video__cerrar    { width:32px; height:32px; border-radius:8px; background:rgba(0,0,0,0.06); border:none; font-size:16px; cursor:pointer; color:#64748b; transition:background 0.15s; flex-shrink:0; }
.modal-video__cerrar:hover { background:rgba(0,0,0,0.12); }
.modal-video__player { position:relative; width:100%; padding-bottom:56.25%; background:#000; }
.modal-video__player iframe { position:absolute; inset:0; width:100%; height:100%; }
.modal-video__desc { padding:16px 24px; font-size:13px; color:#475569; margin:0; line-height:1.6; border-top:1px solid #f1f5f9; }

/* Transición */
.modal-enter-active,.modal-leave-active { transition:opacity 0.2s ease; }
.modal-enter-from,.modal-leave-to { opacity:0; }

/* Responsivo */
@media(max-width:768px) {
  .figuras-grid { grid-template-columns:1fr; }
  .videos-grid  { grid-template-columns:1fr; }
  .figura-card  { flex-direction:column; }
  .page-banner  { flex-direction:column; gap:16px; }
  .banner-stats { display:none; }
  .video-principal__thumb { height:160px; }
}
</style>