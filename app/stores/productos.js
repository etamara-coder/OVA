import { defineStore } from 'pinia'

export const useStore = defineStore('productos', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      productos : [
        {
            nombre : "MT09 Y-AMT",
            precio : 86000000,
            imagen : "https://www.incolmotos-yamaha.com.co/wp-content/uploads/2018/03/mt09_blue.png"
        },
        {
            nombre : "TRACER 09 GT Y-AMT",
            precio : 83000000,
            imagen : "https://www.incolmotos-yamaha.com.co/wp-content/uploads/2019/03/tracer_gris_cat.png"
        },
         {
            nombre : "MT09 Y-AMT",
            precio : 86000000,
            imagen : "https://www.incolmotos-yamaha.com.co/wp-content/uploads/2018/03/mt09_blue.png"
        },
        {
            nombre : "TRACER 09 GT Y-AMT",
            precio : 83000000,
            imagen : "https://www.incolmotos-yamaha.com.co/wp-content/uploads/2019/03/tracer_gris_cat.png"
        },
         {
            nombre : "MT09 Y-AMT",
            precio : 86000000,
            imagen : "https://www.incolmotos-yamaha.com.co/wp-content/uploads/2018/03/mt09_blue.png"
        },
        {
            nombre : "TRACER 09 GT Y-AMT",
            precio : 83000000,
            imagen : "https://www.incolmotos-yamaha.com.co/wp-content/uploads/2019/03/tracer_gris_cat.png"
        },
         {
            nombre : "MT09 Y-AMT",
            precio : 86000000,
            imagen : "https://www.incolmotos-yamaha.com.co/wp-content/uploads/2018/03/mt09_blue.png"
        },
        {
            nombre : "TRACER 09 GT Y-AMT",
            precio : 83000000,
            imagen : "https://www.incolmotos-yamaha.com.co/wp-content/uploads/2019/03/tracer_gris_cat.png"
        }
      ]
    }
  },
    getters: {
     productosall: (state) => state.productos,
  },
})