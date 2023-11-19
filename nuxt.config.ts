// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config"
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({

  css: ['vuetify/lib/styles/main.sass',        
        '@mdi/font/css/materialdesignicons.min.css',
        ],
  
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

},)