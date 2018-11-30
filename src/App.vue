<template lang="pug">
#app
  router-view
  splash-messages
</template>

<script>
import { sharedClient } from '@/services/ApiService'
import { MUTATION_CURRENT_USER } from '@/const'
import { SplashMessageBus } from '@/busses'
import SplashMessages from '@/components/SplashMessages'

export default {
  components: { SplashMessages },
  mounted() {
    this.checkLogin()
  },
  methods: {
    async checkLogin() {
      if (this.$store.state.currentUser) {
        return SplashMessageBus.$emit('message', 'Logged in')
      }
      let { data } = await sharedClient.get('users')
      this.$store.commit(MUTATION_CURRENT_USER, data.usr || null)
      if (data.usr) {
        SplashMessageBus.$emit('message', 'Logged in')
      }
    }
  }
}
</script>

<style lang="sass">
@import "~bulma/bulma"
@import "~@/assets/sass/styles"
</style>
