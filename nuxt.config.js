module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'CloudBrowser',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'CloudBrowser'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
    ],
    script: [{
      src: 'https://code.jquery.com/jquery-3.3.1.slim.min.js',
      type: 'text/javascript',
    }],
  },
  srcDir: 'client/',
  modules: [
    'semantic-ui-vue/nuxt',
  ],
  css: [
    // SCSS file in the project
    '~/assets/css/main.scss',
  ],
  env: {
    WS_URL: process.env.WS_URL || 'http://localhost:3000',
  },
};
