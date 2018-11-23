<template>
  <router-view />
</template>

<script>
import { sharedClient } from '@/services/ApiService'
import { MUTATION_CURRENT_USER } from '@/const'

export default {
  mounted() {
    this.checkLogin()
  },
  methods: {
    async checkLogin() {
      let { data } = await sharedClient.get('users')
      this.$store.commit(MUTATION_CURRENT_USER, data.usr || null)
    }
  }
}
</script>

<style lang="sass">
@import "~bulma/bulma"
@import "~@/assets/sass/styles"
</style>
