import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUsuarioStore = defineStore('usuario', () => {
  const nombre = ref('')

  const iniciales = computed(() => {
    if (!nombre.value) return 'GE'
    const partes = nombre.value.trim().split(' ').filter(p => p.length > 0)
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
    return (partes[0][0] + partes[1][0]).toUpperCase()
  })

  return { nombre, iniciales }
})