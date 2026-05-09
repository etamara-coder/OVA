<template>
  <div class="recursos-page">

    <div class="page-banner">
      <div>
        <h1 class="page-titulo">Recursos</h1>
        <p class="page-desc">Material de apoyo para reforzar tu aprendizaje sobre áreas de figuras geométricas.</p>
      </div>
      <div class="banner-stats">
        <div class="banner-stat"><span class="banner-stat__num">{{ videos.length }}</span><span class="banner-stat__label">Videos</span></div>
        <div class="banner-stat"><span class="banner-stat__num">📚</span><span class="banner-stat__label">Gratuito</span></div>
      </div>
    </div>

    <!-- Videos -->
    <div class="seccion">
      <h2 class="seccion__titulo">🎬 Videos educativos</h2>
      <p class="seccion__desc">Aprende con estos videos explicativos sobre figuras geométricas y cálculo de áreas.</p>
      <div class="videos-grid">
        <div v-for="video in videos" :key="video.id" class="video-card" @click="abrirVideo(video)">
          <div class="video-card__thumb" :style="{ background: video.gradiente }">
            <img
              :src="`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`"
              :alt="video.titulo"
              class="video-card__img"
            />
            <div class="video-card__play">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </div>
          <div class="video-card__info">
            <span class="video-card__badge" :style="{ background: video.bgBadge, color: video.color }">{{ video.categoria }}</span>
            <h3 class="video-card__titulo">{{ video.titulo }}</h3>
            <p class="video-card__desc">{{ video.desc }}</p>
            <div class="video-card__footer">
              <span class="video-card__canal">📺 {{ video.canal }}</span>
              <span class="video-card__ver" :style="{ color: video.color }">Ver video →</span>
            </div>
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
              <td>
                <span class="tabla-badge" :style="{ background: f.bg, color: f.color }">{{ f.figura }}</span>
              </td>
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
definePageMeta({ layout: 'dashboard' })
import { ref } from 'vue'

const videoActivo = ref(null)
const abrirVideo = (video) => { videoActivo.value = video }
const cerrarVideo = () => { videoActivo.value = null }

const videos = [
  {
    id: 'F_Hc1aOAYHw',
    titulo: 'Área de figuras geométricas',
    desc: 'Aprende a calcular el área de las principales figuras geométricas con explicaciones claras y ejemplos paso a paso.',
    canal: 'YouTube Educativo',
    categoria: 'General',
    color: '#3B82F6', bgBadge: 'rgba(59,130,246,0.12)',
    gradiente: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
  },
  {
    id: 'Z1iQg9N9MEI',
    titulo: 'Áreas y perímetros explicados',
    desc: 'Video completo sobre áreas y perímetros de figuras geométricas planas con ejemplos visuales y ejercicios resueltos.',
    canal: 'YouTube Educativo',
    categoria: 'Perímetros',
    color: '#8B5CF6', bgBadge: 'rgba(139,92,246,0.12)',
    gradiente: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
  },
  {
    id: '5CaxOkGvjks',
    titulo: 'Geometría para secundaria',
    desc: 'Explicación completa de geometría plana para estudiantes de secundaria con fórmulas y ejercicios prácticos.',
    canal: 'YouTube Educativo',
    categoria: 'Secundaria',
    color: '#16a34a', bgBadge: 'rgba(34,197,94,0.12)',
    gradiente: 'linear-gradient(135deg, #15803D, #22C55E)',
  },
  {
    id: 'TZDgCnfDrIE',
    titulo: 'Fórmulas de área fácil',
    desc: 'Repaso rápido y visual de todas las fórmulas de área. Ideal para repasar antes de un examen.',
    canal: 'YouTube Educativo',
    categoria: 'Repaso',
    color: '#F97316', bgBadge: 'rgba(249,115,22,0.12)',
    gradiente: 'linear-gradient(135deg, #C2410C, #F97316)',
  },
  {
    id: 'JM2cPKpJmrw',
    titulo: 'Ejercicios resueltos de áreas',
    desc: 'Colección de ejercicios resueltos paso a paso sobre cálculo de áreas de figuras geométricas.',
    canal: 'YouTube Educativo',
    categoria: 'Ejercicios',
    color: '#EC4899', bgBadge: 'rgba(236,72,153,0.12)',
    gradiente: 'linear-gradient(135deg, #BE185D, #EC4899)',
  },
]

const tips = [
  { emoji: '🟦', titulo: 'Cuadrado y Rectángulo', color: '#3B82F6', bg: 'rgba(59,130,246,0.06)', texto: 'Multiplica largo × ancho. El cuadrado es un rectángulo especial donde largo = ancho, por eso A = l².' },
  { emoji: '🔺', titulo: 'Triángulo', color: '#16a34a', bg: 'rgba(34,197,94,0.06)', texto: 'El triángulo es "la mitad de un rectángulo". Imagina que lo envuelves en uno y divides entre 2: A = (b × h) / 2.' },
  { emoji: '⭕', titulo: 'Círculo', color: '#F97316', bg: 'rgba(249,115,22,0.06)', texto: 'Recuerda: π ≈ 3.1416. El radio va del centro al borde. Eleva el radio al cuadrado y multiplica por π.' },
  { emoji: '🔷', titulo: 'Rombo y Trapecio', color: '#EC4899', bg: 'rgba(236,72,153,0.06)', texto: 'Ambos usan división entre 2. El rombo usa sus diagonales; el trapecio suma sus dos bases y multiplica por la altura.' },
  { emoji: '🔹', titulo: 'Paralelogramo', color: '#0891b2', bg: 'rgba(8,145,178,0.06)', texto: 'Igual que el rectángulo: base × altura. Pero la altura es perpendicular, NO el lado inclinado.' },
  { emoji: '⭐', titulo: 'Pentágono Regular', color: '#7c3aed', bg: 'rgba(124,58,237,0.06)', texto: 'Usa el perímetro (5 × lado) y la apotema (distancia del centro al lado). A = (P × a) / 2.' },
]

const tablaFormulas = [
  { figura: 'Cuadrado',         formula: 'A = l²',              variables: 'l = lado',                          ejemplo: 'l=5 → A=25 cm²',          color: '#3B82F6', bg: 'rgba(59,130,246,0.1)'  },
  { figura: 'Rectángulo',       formula: 'A = b × h',           variables: 'b = base, h = altura',              ejemplo: 'b=8, h=4 → A=32 cm²',      color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  { figura: 'Triángulo',        formula: 'A = (b × h) / 2',     variables: 'b = base, h = altura',              ejemplo: 'b=10, h=6 → A=30 cm²',     color: '#16a34a', bg: 'rgba(34,197,94,0.1)'  },
  { figura: 'Círculo',          formula: 'A = π × r²',          variables: 'r = radio, π ≈ 3.1416',            ejemplo: 'r=5 → A≈78.54 cm²',        color: '#F97316', bg: 'rgba(249,115,22,0.1)'  },
  { figura: 'Trapecio',         formula: 'A = (B+b) × h / 2',   variables: 'B = base mayor, b = base menor, h = altura', ejemplo: 'B=10,b=6,h=4 → A=32 cm²', color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
  { figura: 'Rombo',            formula: 'A = (d₁ × d₂) / 2',  variables: 'd₁ = diagonal mayor, d₂ = diagonal menor',   ejemplo: 'd₁=12,d₂=8 → A=48 cm²',  color: '#EF4444', bg: 'rgba(239,68,68,0.1)'  },
  { figura: 'Paralelogramo',    formula: 'A = b × h',           variables: 'b = base, h = altura perpendicular', ejemplo: 'b=9, h=5 → A=45 cm²',      color: '#0891b2', bg: 'rgba(8,145,178,0.1)'  },
  { figura: 'Pentágono Regular',formula: 'A = (P × a) / 2',     variables: 'P = perímetro, a = apotema',         ejemplo: 'l=6,a=4.13 → A≈62 cm²',   color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
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

/* Videos grid */
.videos-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }

.video-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; cursor:pointer; transition:box-shadow 0.2s,transform 0.15s; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.video-card:hover { box-shadow:0 8px 24px rgba(0,0,0,0.12); transform:translateY(-3px); }

.video-card__thumb { position:relative; height:140px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.video-card__img   { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.video-card__play  { position:relative; z-index:2; width:52px; height:52px; border-radius:50%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); transition:transform 0.15s; }
.video-card:hover .video-card__play { transform:scale(1.1); }

.video-card__info  { padding:16px; display:flex; flex-direction:column; gap:8px; }
.video-card__badge { font-size:11px; font-weight:600; padding:2px 8px; border-radius:20px; width:fit-content; }
.video-card__titulo { font-size:14px; font-weight:600; color:#1e293b; margin:0; line-height:1.4; }
.video-card__desc   { font-size:12px; color:#64748b; margin:0; line-height:1.5; }
.video-card__footer { display:flex; align-items:center; justify-content:space-between; margin-top:4px; }
.video-card__canal  { font-size:11px; color:#94a3b8; }
.video-card__ver    { font-size:12px; font-weight:600; }

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
@media(max-width:1024px) {
  .videos-grid { grid-template-columns:repeat(2,1fr); }
  .tips-grid   { grid-template-columns:repeat(2,1fr); }
}

@media(max-width:768px) {
  .videos-grid { grid-template-columns:1fr; }
  .tips-grid   { grid-template-columns:1fr; }
  .page-banner { flex-direction:column; gap:16px; }
  .banner-stats { display:none; }
}
</style>