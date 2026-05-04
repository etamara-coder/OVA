import { defineStore } from 'pinia'

export const useVentas = defineStore('ventas', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      ventas : []
    }
  },
    getters: {
     ventasall: (state) => state.ventas,
  },

  actions: {
  
    guardar(producto) {
      this.ventas.push(producto)
    },
  }
})
