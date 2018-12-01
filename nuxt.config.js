module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "Nuxt Firebase Auth",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "An example of using Nuxt with Firebase to auth users without a server"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "/primer.css"
      }
    ]
  },
  /*
   ** Global CSS
   */
  css: [
    "~/assets/css/style.css",
    { src: "bulma/bulma.sass", lang: "sass" },
    { src: "font-awesome/scss/font-awesome.scss", lang: "scss" }
  ],
  /*
   ** Site Modules
   */
  modules: [["@nuxtjs/pwa", { icon: false }], "nuxt-material-design-icons"],
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#24292e" },
  /*
   ** Router config
   */
  router: {
    // middleware: 'check-auth'
    middleware: "authenticated"
  },
  plugins: [
    {
      src: "~/plugins/auth",
      ssr: false
    },
    {
      src: '~/plugins/vue-toggle',
      ssr: false,
    }


  ],
  /*
  ** Build configuration
  */
  build: {
    vendor: ["firebase", "firebase-auth", "vuexfire"],
    // put CSS in files instead of JS bundles
    extractCSS: true,
    postcss: {
      plugins: {
        "postcss-custom-properties": false
      }
    },
    /*
    ** Run ESLint on save
    */
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  }
};
