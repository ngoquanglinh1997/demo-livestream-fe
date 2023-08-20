require('dotenv').config()

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - fe',
    title: 'fe',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  server: {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT || '3000'),
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~/assets/style.scss', lang: 'scss' }
  ],
  modules: ['@nuxtjs/style-resources', 'nuxt-socket-io', '@nuxtjs/axios'],
  io: {
    // module options
    sockets: [{
      default: true,
      name: 'main',
      url: process.env.API_BASE_URL
    }]
  },
  styleResources: {
    scss: [
      '~/assets/style.scss'
    ]
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/axios.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  ssr: false,
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    BASE_URL: process.env.BASE_URL
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_BASE_URL
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
