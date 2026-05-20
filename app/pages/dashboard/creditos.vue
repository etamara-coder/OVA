<!-- app/pages/dashboard/creditos.vue -->
<template>
  <div class="creditos-page">

    <!-- Banner -->
    <div class="page-banner">
      <div>
        <h1 class="page-titulo">Créditos</h1>
        <p class="page-desc">
          Equipo de desarrollo de GeoÁrea · OVA de Figuras Geométricas ·
          Universidad de Córdoba, Programa de Informática · 2026
        </p>
      </div>
      <div class="banner-stats">
        <div class="banner-stat">
          <span class="banner-stat__num">{{ autores.length }}</span>
          <span class="banner-stat__label">Autores</span>
        </div>
        <div class="banner-stat">
          <span class="banner-stat__num">1</span>
          <span class="banner-stat__label">Docente</span>
        </div>
      </div>
    </div>

    <!-- Docente asesor -->
    <div class="seccion">
      <h2 class="seccion__titulo">👨‍🏫 Docente asesor</h2>
      <div class="docente-card">
        <div class="docente-card__avatar-wrap">
          <img
            :src="docente.foto"
            :alt="docente.nombre"
            class="docente-card__img"
            @error="onImgError($event, docente.iniciales)"
          />
        </div>
        <div class="docente-card__info">
          <span class="docente-card__rol">Docente · Asesor del proyecto</span>
          <h3 class="docente-card__nombre">{{ docente.nombre }}</h3>
          <p class="docente-card__cargo">{{ docente.cargo }}</p>
          <p class="docente-card__desc">{{ docente.desc }}</p>
          <div class="docente-card__tags">
            <span v-for="tag in docente.areas" :key="tag" class="tag tag--blue">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Equipo de desarrollo -->
    <div class="seccion">
      <h2 class="seccion__titulo">👩‍💻 Equipo de desarrollo</h2>
      <p class="seccion__desc">
        Estudiantes del Programa de Informática responsables del diseño,
        desarrollo e implementación de esta OVA.
      </p>
      <div class="autores-grid">
        <div v-for="autor in autores" :key="autor.nombre" class="autor-card">
          <div class="autor-card__avatar-wrap" :style="{ '--accent': autor.color }">
            <img
              :src="autor.foto"
              :alt="autor.nombre"
              class="autor-card__img"
              @error="onImgError($event, autor.iniciales)"
            />
          </div>
          <h3 class="autor-card__nombre">{{ autor.nombre }}</h3>
          <span class="autor-card__rol" :style="{ color: autor.color }">{{ autor.rol }}</span>
          <p class="autor-card__desc">{{ autor.desc }}</p>
          <div class="autor-card__tags">
            <span
              v-for="tag in autor.tags"
              :key="tag"
              class="tag"
              :style="{ background: autor.color + '18', color: autor.color }"
            >{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Institución -->
    <div class="seccion">
      <h2 class="seccion__titulo">🏛️ Institución</h2>
      <div class="inst-card">
        <div class="inst-card__logo">
          <svg width="56" height="56" viewBox="0 0 80 80">
            <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="#378ADD" />
            <polygon points="40,16 64,30 64,50 40,64 16,50 16,30" fill="#185FA5" />
            <polygon points="40,27 54,35 54,45 40,53 26,45 26,35" fill="#0C447C" />
          </svg>
        </div>
        <div>
          <h3 class="inst-card__nombre">Universidad de Córdoba</h3>
          <p class="inst-card__programa">Facultad de Ciencias Básicas e Ingeniería · Programa de Informática</p>
          <p class="inst-card__texto">
            GeoÁrea es un Objeto Virtual de Aprendizaje (OVA) desarrollado como
            proyecto académico para apoyar la enseñanza del cálculo de áreas de
            figuras geométricas en educación básica secundaria.
          </p>
          <div class="inst-card__meta">
            <span class="tag tag--blue">📅 2026</span>
            <span class="tag tag--green">📐 Geometría</span>
            <span class="tag tag--purple">💻 Informática</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tecnologías -->
    <div class="seccion">
      <h2 class="seccion__titulo">🛠️ Tecnologías utilizadas</h2>
      <div class="tech-grid">
        <div v-for="tech in tecnologias" :key="tech.nombre" class="tech-card">
          <span class="tech-card__emoji">{{ tech.emoji }}</span>
          <span class="tech-card__nombre">{{ tech.nombre }}</span>
          <span class="tech-card__desc">{{ tech.desc }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useUsuarioStore } from '~/stores/usuario'
import { onMounted } from 'vue'

const usuario = useUsuarioStore()
onMounted(() => usuario.marcarVisitada('/dashboard/creditos'))
definePageMeta({ layout: 'dashboard' })

/* ── Reemplaza los `foto` con rutas reales en /public/team/ ── */
const docente = {
  nombre:   'Ana Stella Chica Espitia',          // ← editar
  cargo:    'Docente de Informática · Universidad de Córdoba',
  foto:     '/team/docente.jpg',
  iniciales:'DO',
  desc:     'Docente asesor del proyecto GeoÁrea, responsable de orientar el proceso pedagógico y técnico del Objeto Virtual de Aprendizaje.',
}

const autores = [
  {
    nombre:   'Erik Elias Tamara Acosta',            // ← editar
    foto:     '/team/autor1.jpg',
    iniciales:'ET',
    color:    '#3B82F6',
   
  },
  {
    nombre:   'Juan Felipe Guzman Morales',            // ← editar
    foto:     '/team/autor2.jpg',
    iniciales:'JG',
    color:    '#8B5CF6',
   
  },
  {
    nombre:   'Jesus Andres Vasquez Torres',            // ← editar
    foto:     '/team/autor3.jpg',
    iniciales:'JV',
    color:    '#16a34a',
  
  },
  {
    nombre:   'Carlos Fidel Ramirez Payares',            // ← editar
    foto:     '/team/autor4.jpg',
    iniciales:'CR',
    color:    '#F97316',
    },
]

const tecnologias = [
  { emoji: '💚', nombre: 'Nuxt.js',     desc: 'Framework principal' },
  { emoji: '💜', nombre: 'Vuetify',     desc: 'Librería de componentes UI' },
  { emoji: '🟡', nombre: 'Pinia',       desc: 'Gestión de estado' },
  { emoji: '🔷', nombre: 'Vue 3',       desc: 'Composition API' },
  { emoji: '🎨', nombre: 'CSS Scoped',  desc: 'Estilos por componente' },
  { emoji: '▶️', nombre: 'YouTube API', desc: 'Videos embebidos' },
]

/**
 * Si la imagen falla, reemplaza el src por un SVG de iniciales generado
 * inline como data-URL para no depender de servicios externos.
 */
function onImgError(event, iniciales) {
  const colors = ['#3B82F6','#8B5CF6','#16a34a','#F97316','#EC4899','#0891b2']
  const color  = colors[iniciales.charCodeAt(0) % colors.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
    <rect width="120" height="120" fill="${color}22"/>
    <text x="60" y="68" text-anchor="middle" font-family="DM Sans,sans-serif"
      font-size="36" font-weight="700" fill="${color}">${iniciales}</text>
  </svg>`
  event.target.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.creditos-page { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:32px; }

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

/* Docente */
.docente-card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:28px; display:flex; gap:28px; align-items:flex-start; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
.docente-card__avatar-wrap { flex-shrink:0; }
.docente-card__img { width:110px; height:110px; border-radius:50%; object-fit:cover; border:3px solid #e2e8f0; background:#f1f5f9; display:block; }
.docente-card__info { flex:1; display:flex; flex-direction:column; gap:6px; }
.docente-card__rol  { font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; }
.docente-card__nombre { font-size:20px; font-weight:700; color:#0f172a; margin:0; }
.docente-card__cargo  { font-size:13px; color:#378ADD; font-weight:500; margin:0; }
.docente-card__desc   { font-size:13px; color:#475569; margin:0; line-height:1.6; }
.docente-card__tags   { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }

/* Autores grid */
.autores-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }

.autor-card { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:24px 20px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px; box-shadow:0 1px 4px rgba(0,0,0,0.05); transition:box-shadow 0.2s,transform 0.15s; }
.autor-card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.1); transform:translateY(-2px); }

.autor-card__avatar-wrap { position:relative; }
.autor-card__img { width:88px; height:88px; border-radius:50%; object-fit:cover; border:3px solid var(--accent, #e2e8f0); background:#f1f5f9; display:block; }

.autor-card__nombre { font-size:15px; font-weight:700; color:#0f172a; margin:0; line-height:1.3; }
.autor-card__rol    { font-size:12px; font-weight:600; }
.autor-card__desc   { font-size:12.5px; color:#64748b; margin:0; line-height:1.5; }
.autor-card__tags   { display:flex; flex-wrap:wrap; gap:5px; justify-content:center; }

/* Institución */
.inst-card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:28px; display:flex; gap:24px; align-items:flex-start; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
.inst-card__logo  { flex-shrink:0; padding-top:4px; }
.inst-card__nombre   { font-size:18px; font-weight:700; color:#0f172a; margin:0 0 4px; }
.inst-card__programa { font-size:13px; color:#378ADD; font-weight:500; margin:0 0 10px; }
.inst-card__texto    { font-size:13px; color:#475569; margin:0 0 12px; line-height:1.6; }
.inst-card__meta     { display:flex; flex-wrap:wrap; gap:8px; }

/* Tecnologías */
.tech-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:14px; }
.tech-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px 12px; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; transition:box-shadow 0.2s; }
.tech-card:hover { box-shadow:0 4px 12px rgba(0,0,0,0.08); }
.tech-card__emoji  { font-size:24px; }
.tech-card__nombre { font-size:13px; font-weight:700; color:#1e293b; }
.tech-card__desc   { font-size:11px; color:#94a3b8; }

/* Tags genéricos */
.tag { font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; }
.tag--blue   { background:rgba(59,130,246,0.1);  color:#3B82F6; }
.tag--green  { background:rgba(34,197,94,0.1);   color:#16a34a; }
.tag--purple { background:rgba(139,92,246,0.1);  color:#8B5CF6; }

/* Responsivo */
@media(max-width:1200px) { .tech-grid { grid-template-columns:repeat(3,1fr); } }
@media(max-width:1024px) { .autores-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:768px) {
  .autores-grid   { grid-template-columns:1fr; }
  .tech-grid      { grid-template-columns:repeat(2,1fr); }
  .docente-card   { flex-direction:column; align-items:center; text-align:center; }
  .inst-card      { flex-direction:column; }
  .page-banner    { flex-direction:column; gap:16px; }
  .banner-stats   { display:none; }
}
</style>