import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useUsuarioStore = defineStore('usuario', () => {

  // ── Nombre (persiste en localStorage) ───────────────
  const nombre = ref(
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('geo_nombre') || ''
      : ''
  )

  watch(nombre, (val) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('geo_nombre', val)
    }
  })

  const iniciales = computed(() => {
    if (!nombre.value) return 'GE'
    const partes = nombre.value.trim().split(' ').filter(p => p.length > 0)
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
    return (partes[0][0] + partes[1][0]).toUpperCase()
  })

  // ── Secciones visitadas (NO persiste, se resetea al recargar) ──
  const visitadas = ref<string[]>([])

  const marcarVisitada = (ruta: string) => {
    if (!visitadas.value.includes(ruta)) {
      visitadas.value.push(ruta)
    }
  }

  // Recursos y Créditos no están aquí → siempre desbloqueados
  const ordenSecciones = [
    '/dashboard/contenido',
    '/dashboard/practica',
    '/dashboard/actividades',
    '/dashboard/evaluacion',
  ]

  const estaDesbloqueada = (ruta: string): boolean => {
    const idx = ordenSecciones.indexOf(ruta)
    if (idx < 0) return true  // rutas fuera del orden → siempre libre
    if (idx === 0) return true // primera sección → siempre libre
    const anterior = ordenSecciones[idx - 1]
    return visitadas.value.includes(anterior)
  }

  const resetearProgreso = () => {
    visitadas.value = []
    nombre.value = ''
    if (import.meta.client) {
      localStorage.removeItem('geo_nombre')
    }
  }

  return { nombre, iniciales, visitadas, marcarVisitada, estaDesbloqueada, resetearProgreso }
})