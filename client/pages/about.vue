<template>
  <div>
    <p>Hi from {{ name }}</p>
    <nuxt-link to="/">Home page</nuxt-link>
    <sui-button animated @click="logout">
      <sui-button-content visible>Logout</sui-button-content>
      <sui-button-content hidden>
        <sui-icon name="right arrow" />
      </sui-button-content>
    </sui-button>
  </div>
</template>

<script>
  const Cookie = process.client ? require('js-cookie') : undefined;

  export default {
  middleware: 'authenticated',
  asyncData ({ isStatic, isServer }) {
    return {
      name: isStatic ? 'static' : (isServer ? 'server' : 'client')
    }
  },
  methods: {
    logout() {
      Cookie.remove('jwt');
      this.$store.commit('setJwt', null);
      this.$router.push('/');
    }
  }
}
</script>
