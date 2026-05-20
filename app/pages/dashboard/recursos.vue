<template>
  <div class="recursos-page">

    <!-- Banner -->
    <div class="page-banner">
      <div>
        <h1 class="page-titulo">Recursos</h1>
        <p class="page-desc">Material complementario para profundizar tu conocimiento sobre áreas de figuras geométricas.</p>
      </div>
      <div class="banner-stats">
        <div class="banner-stat"><span class="banner-stat__num">{{ videos.length }}</span><span class="banner-stat__label">Videos</span></div>
        <div class="banner-stat"><span class="banner-stat__num">{{ articulos.length }}</span><span class="banner-stat__label">Artículos</span></div>
        <div class="banner-stat"><span class="banner-stat__num">📚</span><span class="banner-stat__label">Gratuito</span></div>
      </div>
    </div>

    <!-- Videos complementarios -->
    <div class="seccion">
      <h2 class="seccion__titulo">🎬 Videos complementarios</h2>
      <p class="seccion__desc">Videos adicionales para reforzar y ampliar lo aprendido en el contenido principal.</p>
      <div class="videos-grid">
        <div v-for="video in videos" :key="video.id" class="video-card" @click="abrirVideo(video)">
          <div class="video-card__thumb">
            <img :src="`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`" :alt="video.titulo" class="video-card__img" />
            <div class="video-card__overlay" :style="{ background: video.gradiente }"></div>
            <div class="video-card__play">
              <div class="video-card__play-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
            </div>
            <span class="video-card__badge-top" :style="{ background: video.color }">{{ video.categoria }}</span>
          </div>
          <div class="video-card__info">
            <h3 class="video-card__titulo">{{ video.titulo }}</h3>
            <p class="video-card__desc">{{ video.desc }}</p>
            <div class="video-card__footer">
              <span class="video-card__nivel" :style="{ color: video.color }">{{ video.nivel }}</span>
              <span class="video-card__ver" :style="{ color: video.color }">Ver video →</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Información complementaria -->
    <div class="seccion">
      <h2 class="seccion__titulo">📖 Información complementaria</h2>
      <p class="seccion__desc">Conceptos clave y contexto adicional sobre figuras geométricas y sus áreas.</p>
      <div class="info-grid">
        <div v-for="art in articulos" :key="art.titulo" class="info-card" :style="{ borderTopColor: art.color }">
          <div class="info-card__header">
            <span class="info-card__emoji">{{ art.emoji }}</span>
            <span class="info-card__tag" :style="{ color: art.color, background: art.bg }">{{ art.tag }}</span>
          </div>
          <h3 class="info-card__titulo">{{ art.titulo }}</h3>
          <p class="info-card__texto">{{ art.texto }}</p>
          <ul class="info-card__lista">
            <li v-for="punto in art.puntos" :key="punto" class="info-card__item">
              <span class="info-card__dot" :style="{ background: art.color }"></span>
              {{ punto }}
            </li>
          </ul>
          <div v-if="art.dato" class="info-card__dato" :style="{ background: art.bg, borderColor: art.color }">
            <span class="info-card__dato-label">💡 Dato curioso:</span>
            <span class="info-card__dato-texto">{{ art.dato }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <div class="seccion">
      <h2 class="seccion__titulo">💡 Tips para recordar las fórmulas</h2>
      <div class="tips-grid">
        <div v-for="tip in tips" :key="tip.titulo" class="tip-card" :style="{ borderColor: tip.color, background: tip.bg }">
          <div class="tip-card__icono">{{ tip.emoji }}</div>
          <div>
            <h4 class="tip-card__titulo" :style="{ color: tip.color }">{{ tip.titulo }}</h4>
            <p class="tip-card__texto">{{ tip.texto }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla resumen -->
    <div class="seccion">
      <h2 class="seccion__titulo">📋 Tabla resumen de fórmulas</h2>
      <div class="tabla-wrapper">
        <table class="tabla">
          <thead>
            <tr>
              <th>Figura</th>
              <th>Fórmula</th>
              <th>Variables</th>
              <th>Ejemplo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in tablaFormulas" :key="f.figura">
              <td><span class="tabla-badge" :style="{ background: f.bg, color: f.color }">{{ f.figura }}</span></td>
              <td><strong :style="{ color: f.color }">{{ f.formula }}</strong></td>
              <td class="tabla-vars">{{ f.variables }}</td>
              <td class="tabla-ejemplo">{{ f.ejemplo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
import { ref } from 'vue'

const videoActivo = ref(null)
const abrirVideo = (video) => { videoActivo.value = video }
const cerrarVideo = () => { videoActivo.value = null }

const videos = [
  {
    id: 'TZDgCnfDrIE',
    titulo: 'Área de todas las figuras geométricas',
    desc: 'Aprende fácil a calcular el área de triángulo, cuadrado, rectángulo, pentágono, hexágono y más figuras planas.',
    categoria: 'General',
    nivel: '📘 Introductorio',
    color: '#3B82F6',
    gradiente: 'linear-gradient(135deg, rgba(29,78,216,0.7), rgba(59,130,246,0.7))',
  },
  {
    id: 'PjQIWTKAy6o',
    titulo: 'Geometría básica explicada fácil',
    desc: 'Aprende puntos, líneas y figuras geométricas de manera clara y práctica con ejemplos del mundo real.',
    categoria: 'Geometría',
    nivel: '📘 Introductorio',
    color: '#8B5CF6',
    gradiente: 'linear-gradient(135deg, rgba(109,40,217,0.7), rgba(139,92,246,0.7))',
  },
  {
    id: '6KtGCnSHJPE',
    titulo: 'Geometría completa para niños',
    desc: 'Recopilación completa: ángulos, triángulos, circunferencias, polígonos y número Pi explicados paso a paso.',
    categoria: 'Completo',
    nivel: '🌍 Contextual',
    color: '#16a34a',
    gradiente: 'linear-gradient(135deg, rgba(21,128,61,0.7), rgba(34,197,94,0.7))',
  },
  {
    id: 'ey4VeciXRAU',
    titulo: 'Área de figuras compuestas',
    desc: 'Aprende a calcular el área de figuras compuestas combinando las fórmulas básicas. Ideal para resolver problemas complejos.',
    categoria: 'Avanzado',
    nivel: '📗 Intermedio',
    color: '#F97316',
    gradiente: 'linear-gradient(135deg, rgba(194,65,12,0.7), rgba(249,115,22,0.7))',
  },
  {
    id: '4JPwbTyuLFk',
    titulo: 'Área de cuerpos geométricos',
    desc: 'Del plano al espacio: cómo se relacionan las áreas de figuras planas con las superficies de cuerpos geométricos.',
    categoria: 'Aplicaciones',
    nivel: '🚀 Avanzado',
    color: '#EC4899',
    gradiente: 'linear-gradient(135deg, rgba(190,24,93,0.7), rgba(236,72,153,0.7))',
  },
  {
    id: 'Zbpf3WQw93E',
    titulo: 'Perímetro y área explicados',
    desc: 'Diferencias clave entre perímetro y área, con ejemplos prácticos y ejercicios resueltos paso a paso.',
    categoria: 'Conceptos',
    nivel: '📐 Práctico',
    color: '#0891b2',
    gradiente: 'linear-gradient(135deg, rgba(14,116,144,0.7), rgba(8,145,178,0.7))',
  },
]

const articulos = [
  {
    emoji: '🏛️',
    tag: 'Historia',
    titulo: 'Orígenes de la geometría',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.07)',
    texto: 'La geometría nació de necesidades prácticas. Los antiguos egipcios necesitaban redistribuir tierras después de las crecidas del Nilo, y los griegos la convirtieron en ciencia formal.',
    puntos: [
      'Tales de Mileto (600 a.C.) fue el primero en demostrar teoremas geométricos',
      'Euclides sistematizó la geometría en sus "Elementos" (300 a.C.)',
      'Los egipcios usaban figuras para calcular áreas de cultivos',
      'La palabra "geometría" viene del griego: geo (tierra) + metría (medida)',
    ],
    dato: 'El papiro de Rhind (1650 a.C.) es uno de los documentos matemáticos más antiguos y contiene fórmulas para calcular áreas de triángulos y trapecios.',
  },
  {
    emoji: '🌿',
    tag: 'Naturaleza',
    titulo: 'Figuras geométricas en la naturaleza',
    color: '#16a34a',
    bg: 'rgba(34,197,94,0.07)',
    texto: 'La naturaleza es el mejor geómetra. Las figuras que estudiamos en matemáticas aparecen constantemente en el mundo natural, optimizando espacio y recursos.',
    puntos: [
      'Los panales de abeja usan hexágonos: máximo espacio con mínima cera',
      'Las conchas de nautilo siguen una espiral logarítmica',
      'Los copos de nieve tienen simetría hexagonal perfecta',
      'Las flores a menudo tienen pétalos en números de Fibonacci',
    ],
    dato: 'El nido de avispas usa hexágonos que comparten paredes, ahorrando hasta un 40% de material respecto a otras formas.',
  },
  {
    emoji: '🏗️',
    tag: 'Aplicaciones',
    titulo: 'Áreas en arquitectura y construcción',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.07)',
    texto: 'Calcular áreas es una habilidad fundamental en construcción. Desde una habitación hasta un rascacielos, todo comienza con geometría y cálculo de superficies.',
    puntos: [
      'El área determina la cantidad de pintura, azulejos o piso necesario',
      'Los planos arquitectónicos están llenos de cálculos de área',
      'Los techos triangulares requieren calcular áreas para el material',
      'Los paisajistas usan áreas para determinar la cantidad de plantas',
    ],
    dato: 'Para calcular cuánta pintura comprar: (área de paredes - área de ventanas y puertas) ÷ rendimiento de la pintura por litro.',
  },
  {
    emoji: '🔢',
    tag: 'Conceptos clave',
    titulo: 'Área vs Perímetro: diferencias esenciales',
    color: '#0891b2',
    bg: 'rgba(8,145,178,0.07)',
    texto: 'Uno de los errores más comunes es confundir área y perímetro. Son conceptos completamente distintos que miden cosas diferentes de una misma figura.',
    puntos: [
      'Perímetro: la longitud del borde/contorno (se mide en cm, m, km)',
      'Área: la superficie interior (se mide en cm², m², km²)',
      'Dos figuras pueden tener el mismo perímetro pero diferente área',
      'Las unidades siempre van al cuadrado cuando hablamos de área',
    ],
    dato: 'Un rectángulo de 2×8 y uno de 4×4 tienen el mismo perímetro (20 cm), pero el cuadrado tiene mayor área (16 cm² vs 16 cm²). ¡Prueba con 1×9 vs 3×3!',
  },
  {
    emoji: '🎨',
    tag: 'Arte y Diseño',
    titulo: 'Geometría en el arte y diseño gráfico',
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.07)',
    texto: 'Los artistas y diseñadores usan principios geométricos constantemente. Desde el arte abstracto hasta el diseño de logos, la geometría da estructura y armonía visual.',
    puntos: [
      'El arte de Mondrian se basa completamente en rectángulos y cuadrados',
      'Los logos modernos usan círculos y polígonos para ser memorables',
      'La proporción áurea (φ ≈ 1.618) aparece en el diseño y naturaleza',
      'El op art juega con ilusiones ópticas usando figuras geométricas',
    ],
    dato: 'El Partenón de Atenas fue diseñado usando la proporción áurea, haciendo que sus rectángulos se perciban como perfectamente armónicos al ojo humano.',
  },
  {
    emoji: '💻',
    tag: 'Tecnología',
    titulo: 'Geometría en videojuegos y gráficos 3D',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.07)',
    texto: 'La industria de los videojuegos y el cine 3D depende completamente de la geometría. Cada personaje, escenario y efecto visual está construido con figuras geométricas.',
    puntos: [
      'Los modelos 3D están hechos de miles de triángulos (polígonos)',
      'Los motores gráficos calculan áreas para determinar la iluminación',
      'Las colisiones en videojuegos usan rectángulos y círculos invisibles',
      'El cálculo de sombras requiere geometría y trigonometría avanzada',
    ],
    dato: 'El personaje de Gollum en El Señor de los Anillos usó más de 50,000 polígonos para modelar su cara, cada uno calculado geométricamente.',
  },
]

const tips = [
  { emoji: '🟦', titulo: 'Cuadrado y Rectángulo', color: '#3B82F6', bg: 'rgba(59,130,246,0.06)', texto: 'Multiplica largo × ancho. El cuadrado es un rectángulo especial donde largo = ancho, por eso A = l².' },
  { emoji: '🔺', titulo: 'Triángulo',             color: '#16a34a', bg: 'rgba(34,197,94,0.06)',  texto: 'El triángulo es "la mitad de un rectángulo". Imagina que lo envuelves en uno y divides entre 2: A = (b × h) / 2.' },
  { emoji: '⭕', titulo: 'Círculo',               color: '#F97316', bg: 'rgba(249,115,22,0.06)', texto: 'Recuerda: π ≈ 3.1416. El radio va del centro al borde. Eleva el radio al cuadrado y multiplica por π.' },
  { emoji: '🔷', titulo: 'Rombo y Trapecio',      color: '#EC4899', bg: 'rgba(236,72,153,0.06)', texto: 'Ambos usan división entre 2. El rombo usa sus diagonales; el trapecio suma sus dos bases y multiplica por la altura.' },
  { emoji: '🔹', titulo: 'Paralelogramo',         color: '#0891b2', bg: 'rgba(8,145,178,0.06)',  texto: 'Igual que el rectángulo: base × altura. Pero la altura es perpendicular, NO el lado inclinado.' },
  { emoji: '⭐', titulo: 'Pentágono Regular',     color: '#7c3aed', bg: 'rgba(124,58,237,0.06)', texto: 'Usa el perímetro (5 × lado) y la apotema (distancia del centro al lado). A = (P × a) / 2.' },
]

const tablaFormulas = [
  { figura: 'Cuadrado',          formula: 'A = l²',             variables: 'l = lado',                                    ejemplo: 'l=5 → A=25 cm²',          color: '#3B82F6', bg: 'rgba(59,130,246,0.1)'  },
  { figura: 'Rectángulo',        formula: 'A = b × h',          variables: 'b = base, h = altura',                        ejemplo: 'b=8, h=4 → A=32 cm²',      color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  { figura: 'Triángulo',         formula: 'A = (b × h) / 2',    variables: 'b = base, h = altura',                        ejemplo: 'b=10, h=6 → A=30 cm²',     color: '#16a34a', bg: 'rgba(34,197,94,0.1)'  },
  { figura: 'Círculo',           formula: 'A = π × r²',         variables: 'r = radio, π ≈ 3.1416',                      ejemplo: 'r=5 → A≈78.54 cm²',        color: '#F97316', bg: 'rgba(249,115,22,0.1)'  },
  { figura: 'Trapecio',          formula: 'A = (B+b) × h / 2',  variables: 'B = base mayor, b = base menor, h = altura',  ejemplo: 'B=10,b=6,h=4 → A=32 cm²',  color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
  { figura: 'Rombo',             formula: 'A = (d₁ × d₂) / 2', variables: 'd₁ = diagonal mayor, d₂ = diagonal menor',    ejemplo: 'd₁=12,d₂=8 → A=48 cm²',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)'  },
  { figura: 'Paralelogramo',     formula: 'A = b × h',          variables: 'b = base, h = altura perpendicular',          ejemplo: 'b=9, h=5 → A=45 cm²',      color: '#0891b2', bg: 'rgba(8,145,178,0.1)'  },
  { figura: 'Pentágono Regular', formula: 'A = (P × a) / 2',    variables: 'P = perímetro, a = apotema',                  ejemplo: 'l=6,a=4.13 → A≈62 cm²',   color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.recursos-page { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:32px; }

/* Banner */
.page-banner { background:linear-gradient(135deg,#0c1120 0%,#0d1f3c 50%,#0a1628 100%); border-radius:14px; padding:28px 32px; border:0.5px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; }
.page-titulo { font-size:22px; font-weight:700; color:#e8f0fe; margin:0 0 6px; letter-spacing:-0.3px; }
.page-desc   { font-size:13px; color:#4a6fa5; margin:0; line-height:1.6; }
.banner-stats { display:flex; gap:24px; flex-shrink:0; }
.banner-stat  { display:flex; flex-direction:column; align-items:center; }
.banner-stat__num   { font-size:24px; font-weight:700; color:#e8f0fe; }
.banner-stat__label { font-size:11px; color:#4a6fa5; }

/* Sección */
.seccion { display:flex; flex-direction:column; gap:16px; }
.seccion__titulo { font-size:18px; font-weight:700; color:#0f1f3d; margin:0; }
.seccion__desc   { font-size:13px; color:#5a6e8a; margin:0; }

/* Videos */
.videos-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.video-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; cursor:pointer; transition:box-shadow 0.2s,transform 0.15s; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.video-card:hover { box-shadow:0 8px 24px rgba(0,0,0,0.12); transform:translateY(-3px); }
.video-card__thumb { position:relative; height:140px; overflow:hidden; }
.video-card__img   { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.video-card__overlay { position:absolute; inset:0; opacity:0.4; transition:opacity 0.2s; }
.video-card:hover .video-card__overlay { opacity:0.55; }
.video-card__play { position:absolute; inset:0; z-index:2; display:flex; align-items:center; justify-content:center; }
.video-card__play-circle { width:52px; height:52px; border-radius:50%; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); transition:transform 0.15s; }
.video-card:hover .video-card__play-circle { transform:scale(1.12); }
.video-card__badge-top { position:absolute; top:10px; left:10px; z-index:3; font-size:10px; font-weight:700; color:#fff; padding:3px 8px; border-radius:20px; }
.video-card__info  { padding:14px 16px; display:flex; flex-direction:column; gap:7px; }
.video-card__titulo { font-size:13.5px; font-weight:700; color:#1e293b; margin:0; line-height:1.4; }
.video-card__desc   { font-size:12px; color:#64748b; margin:0; line-height:1.5; }
.video-card__footer { display:flex; align-items:center; justify-content:space-between; margin-top:2px; }
.video-card__nivel  { font-size:11px; font-weight:500; }
.video-card__ver    { font-size:12px; font-weight:700; }

/* Info / artículos */
.info-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.info-card { background:#fff; border:1px solid #e2e8f0; border-top:3px solid; border-radius:12px; padding:20px; display:flex; flex-direction:column; gap:12px; transition:box-shadow 0.2s; }
.info-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.08); }
.info-card__header { display:flex; align-items:center; justify-content:space-between; }
.info-card__emoji  { font-size:28px; }
.info-card__tag    { font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; letter-spacing:0.4px; text-transform:uppercase; }
.info-card__titulo { font-size:14px; font-weight:700; color:#0f172a; margin:0; line-height:1.35; }
.info-card__texto  { font-size:12.5px; color:#475569; margin:0; line-height:1.6; }
.info-card__lista  { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; }
.info-card__item   { font-size:12px; color:#334155; display:flex; align-items:flex-start; gap:8px; line-height:1.5; }
.info-card__dot    { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:5px; }
.info-card__dato   { padding:10px 12px; border-radius:8px; border:1px solid; display:flex; flex-direction:column; gap:3px; }
.info-card__dato-label { font-size:11px; font-weight:700; color:#334155; }
.info-card__dato-texto { font-size:12px; color:#475569; line-height:1.5; }

/* Tips */
.tips-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.tip-card { display:flex; align-items:flex-start; gap:12px; padding:16px; border-radius:12px; border:1px solid; }
.tip-card__icono  { font-size:24px; flex-shrink:0; }
.tip-card__titulo { font-size:13px; font-weight:700; margin:0 0 4px; }
.tip-card__texto  { font-size:12.5px; color:#334155; margin:0; line-height:1.5; }

/* Tabla */
.tabla-wrapper { overflow-x:auto; border-radius:12px; border:1px solid #e2e8f0; }
.tabla { width:100%; border-collapse:collapse; background:#fff; font-size:13px; }
.tabla thead tr { background:#f8fafc; }
.tabla th { padding:12px 16px; text-align:left; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #e2e8f0; }
.tabla td { padding:12px 16px; border-bottom:1px solid #f1f5f9; color:#334155; vertical-align:middle; }
.tabla tr:last-child td { border-bottom:none; }
.tabla tr:hover td { background:#f8fafc; }
.tabla-badge { font-size:12px; font-weight:600; padding:3px 10px; border-radius:20px; white-space:nowrap; }
.tabla-vars  { font-size:12px; color:#64748b; max-width:200px; }
.tabla-ejemplo { font-size:12px; color:#475569; font-family:monospace; }

/* Modal video */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:100; display:flex; align-items:center; justify-content:center; padding:24px; backdrop-filter:blur(4px); }
.modal-video { background:#fff; border-radius:18px; width:100%; max-width:700px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.4); }
.modal-video__header { display:flex; align-items:flex-start; justify-content:space-between; padding:20px 24px 16px; }
.modal-video__categoria { font-size:11px; color:#94a3b8; font-weight:600; text-transform:uppercase; margin:0 0 4px; }
.modal-video__titulo    { font-size:18px; font-weight:700; color:#1e293b; margin:0; }
.modal-video__cerrar    { width:32px; height:32px; border-radius:8px; background:rgba(0,0,0,0.06); border:none; font-size:16px; cursor:pointer; color:#64748b; flex-shrink:0; transition:background 0.15s; }
.modal-video__cerrar:hover { background:rgba(0,0,0,0.12); }
.modal-video__player { position:relative; width:100%; padding-bottom:56.25%; background:#000; }
.modal-video__player iframe { position:absolute; inset:0; width:100%; height:100%; }
.modal-video__desc { padding:16px 24px; font-size:13px; color:#475569; margin:0; line-height:1.6; border-top:1px solid #f1f5f9; }

/* Transición */
.modal-enter-active,.modal-leave-active { transition:opacity 0.2s ease; }
.modal-enter-from,.modal-leave-to { opacity:0; }

/* Responsivo */
@media(max-width:1200px) { .info-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:1024px) {
  .videos-grid { grid-template-columns:repeat(2,1fr); }
  .tips-grid   { grid-template-columns:repeat(2,1fr); }
  .info-grid   { grid-template-columns:repeat(2,1fr); }
}
@media(max-width:768px) {
  .videos-grid,.tips-grid,.info-grid { grid-template-columns:1fr; }
  .page-banner { flex-direction:column; gap:16px; }
  .banner-stats { display:none; }
}
</style>