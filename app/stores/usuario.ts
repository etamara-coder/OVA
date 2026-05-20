import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useUsuarioStore = defineStore('usuario', () => {

  // ── Nombre ───────────────────────────────────────────
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

  // ── Secciones visitadas ──────────────────────────────
  const visitadas = ref<string[]>(
    typeof localStorage !== 'undefined'
      ? JSON.parse(localStorage.getItem('geo_visitadas') || '[]')
      : []
  )

  watch(visitadas, (val) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('geo_visitadas', JSON.stringify(val))
    }
  }, { deep: true })

  const marcarVisitada = (ruta: string) => {
    if (!visitadas.value.includes(ruta)) {
      visitadas.value.push(ruta)
    }
  }

  const ordenSecciones = [
    '/dashboard/contenido',
    '/dashboard/practica',
    '/dashboard/actividades',
    '/dashboard/evaluacion',
    '/dashboard/recursos',
    '/dashboard/creditos',
  ]

  const estaDesbloqueada = (ruta: string): boolean => {
    const idx = ordenSecciones.indexOf(ruta)
    if (idx < 0) return true
    if (idx === 0) return true
    const anterior = ordenSecciones[idx - 1]
    return visitadas.value.includes(anterior)
  }

  const resetearProgreso = () => {
    visitadas.value = []
    nombre.value = ''
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('geo_visitadas')
      localStorage.removeItem('geo_nombre')
    }
  }

  return { nombre, iniciales, visitadas, marcarVisitada, estaDesbloqueada, resetearProgreso }
})