// plugins/vuetify.ts
import '@mdi/font/css/materialdesignicons.css' // <-- ¡Agrega esta línea!
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi', // <-- Asegúrate de que MDI sea el set por defecto
    },
  })

  nuxtApp.vueApp.use(vuetify)
})