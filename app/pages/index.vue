<template>
  <v-container fluid class="bienvenida pa-0">

    <div v-for="f in figuras" :key="f.clase" :class="['figura', f.clase]">
      <v-card
        rounded="xl" width="160" height="160"
        class="d-flex flex-column align-center justify-center ga-3 pa-3"
        elevation="0"
        :style="{ background: f.bg, border: '1px solid ' + f.borde }"
      >
        <component :is="f.svg" />
        <span class="text-caption font-weight-medium" :style="{ color: f.texto }">
          {{ f.formula }}
        </span>
      </v-card>
    </div>

    <v-row justify="center" align="center" class="fill-height ma-0" style="min-height:100vh">
      <v-col cols="12" sm="8" md="5" class="d-flex flex-column align-center text-center ga-4">

        <div class="logo-wrapper">
          <svg width="88" height="88" viewBox="0 0 80 80">
            <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="#60A5FA" />
            <polygon points="40,16 64,30 64,50 40,64 16,50 16,30" fill="#3B82F6" />
            <polygon points="40,27 54,35 54,45 40,53 26,45 26,35" fill="#1D4ED8" />
          </svg>
        </div>

        <span class="text-overline etiqueta" style="letter-spacing:4px !important;">
          OVA · MATEMÁTICAS
        </span>

        <h1 class="titulo">GeoÁrea</h1>

        <p class="text-body-1 subtitulo">
          Domina el cálculo del área<br>de las figuras geométricas
        </p>

        <div class="d-flex ga-2 flex-wrap justify-center">
          <v-chip color="blue-lighten-2" variant="tonal" size="small">Grados 6° – 8°</v-chip>
          <v-chip color="green-lighten-2" variant="tonal" size="small">Secundaria básica</v-chip>
        </div>

        <!-- Campo de nombre -->
        <div class="nombre-box">
          <label class="nombre-label">¿Cómo te llamas?</label>
          <input
            v-model="usuario.nombre"
            type="text"
            class="nombre-input"
            placeholder="Escribe tu nombre..."
            maxlength="40"
          />
        </div>

        <v-btn
          :to="usuario.nombre.trim() ? '/dashboard' : undefined"
          :disabled="!usuario.nombre.trim()"
          color="blue"
          size="large"
          rounded="lg"
          class="px-12 mt-2"
          elevation="2"
        >
          ¡Comenzar!
        </v-btn>

        <span class="text-caption footer-txt">
          Universidad de Córdoba · Programa de Informática · 2026
        </span>

      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { defineComponent, h } from 'vue'
import { useUsuarioStore } from '~/stores/usuario'

const usuario = useUsuarioStore()

const mkSvg = (nodos, w = 60, ht = 60) =>
  defineComponent({ render: () => h('svg', { width: w, height: ht, viewBox: `0 0 ${w} ${ht}` }, nodos) })

const figuras = [
  {
    clase: 'figura--tl', formula: 'A = l²',
    bg: 'rgba(59,130,246,0.15)', borde: 'rgba(59,130,246,0.35)', texto: '#93C5FD',
    svg: mkSvg([h('rect', { x: 6, y: 6, width: 36, height: 36, rx: 4, fill: '#3B82F6' })]),
  },
  {
    clase: 'figura--tr', formula: 'A = πr²',
    bg: 'rgba(251,146,60,0.15)', borde: 'rgba(251,146,60,0.35)', texto: '#FCA773',
    svg: mkSvg([h('circle', { cx: 24, cy: 24, r: 18, fill: '#F97316' })]),
  },
  {
    clase: 'figura--ml', formula: 'A = b × h',
    bg: 'rgba(139,92,246,0.15)', borde: 'rgba(139,92,246,0.35)', texto: '#C4B5FD',
    svg: mkSvg([h('rect', { x: 2, y: 14, width: 44, height: 22, rx: 3, fill: '#8B5CF6' })]),
  },
  {
    clase: 'figura--mr', formula: '(B+b)h / 2',
    bg: 'rgba(236,72,153,0.15)', borde: 'rgba(236,72,153,0.35)', texto: '#F9A8D4',
    svg: mkSvg([h('polygon', { points: '10,42 38,42 36,6 12,6', fill: '#EC4899' })]),
  },
  {
    clase: 'figura--bl', formula: 'b × h / 2',
    bg: 'rgba(34,197,94,0.15)', borde: 'rgba(34,197,94,0.35)', texto: '#86EFAC',
    svg: mkSvg([h('polygon', { points: '24,4 44,44 4,44', fill: '#22C55E' })]),
  },
  {
    clase: 'figura--br', formula: 'd₁ × d₂ / 2',
    bg: 'rgba(239,68,68,0.15)', borde: 'rgba(239,68,68,0.35)', texto: '#FCA5A5',
    svg: mkSvg([h('polygon', { points: '24,4 44,24 24,44 4,24', fill: '#EF4444' })]),
  },
]
</script>

<style scoped>
.bienvenida {
  position: relative;
  min-height: 100vh;
  background-color: #0c1120;
  overflow: hidden;
}

.bienvenida::before {
  content: '';
  position: absolute;
  top: 30%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.figura { position: absolute; }
.figura--tl { top: 36px;  left: 36px;  animation: flotar-a 3.5s ease-in-out infinite; }
.figura--tr { top: 36px;  right: 36px; animation: flotar-b 4.0s ease-in-out infinite 0.8s; }
.figura--ml { top: calc(50% - 65px); left: 36px;  animation: flotar-a 3.2s ease-in-out infinite 2s; }
.figura--mr { top: calc(50% - 65px); right: 36px; animation: flotar-b 3.6s ease-in-out infinite 1.7s; }
.figura--bl { bottom: 36px; left: 36px;  animation: flotar-c 3.8s ease-in-out infinite 1.3s; }
.figura--br { bottom: 36px; right: 36px; animation: flotar-b 4.2s ease-in-out infinite 0.4s; }

.logo-wrapper { animation: girar 14s linear infinite; }

.etiqueta { color: #4B6CB7 !important; }
.titulo {
  font-size: 56px;
  font-weight: 600;
  color: #F0F6FF;
  letter-spacing: -2px;
  line-height: 1;
  margin: 0;
}
.subtitulo { color: #6B84A8 !important; }
.footer-txt { color: #2D4066 !important; }

/* Campo nombre */
.nombre-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 320px;
  align-items: center;
}

.nombre-label {
  font-size: 13px;
  color: #4a6fa5;
  text-align: left;
}

.nombre-input {
  background: rgba(255, 255, 255, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  color: #e8f0fe;
  outline: none;
  transition: border 0.2s;
  width: 100%;
}

.nombre-input::placeholder { color: #2d4a6e; }

.nombre-input:focus {
  border-color: rgba(56, 138, 221, 0.6);
  background: rgba(56, 138, 221, 0.06);
}

@keyframes flotar-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes flotar-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)}  }
@keyframes flotar-c { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
@keyframes girar    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

@media (max-width: 768px) {
  .figura--ml, .figura--mr { display: none; }
  .figura--tl { top: 16px; left: 16px; }
  .figura--tr { top: 16px; right: 16px; }
  .figura--bl { bottom: 16px; left: 16px; }
  .figura--br { bottom: 16px; right: 16px; }
  .titulo { font-size: 40px; }
}
</style>