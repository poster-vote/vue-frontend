<template lang="pug">
.show-poster
  .hero.is-primary
    .hero-head
      site-nav
    .hero-body
      .container
        h1.title {{posterName}}
        h2.subtitle Question: {{posterQuestion}}
  
  section.toolbar
    .container
      .level
        .level-left
          .level-item
            nav.breadcrumb
              ul
                li: router-link(to="/") Home
                li: router-link(to="/posters") Posters
                li.is-active: router-link(to="/posters/add") {{posterName}}
</template>

<script>
import { sharedClient } from '@/services/ApiService'
import SiteNav from '@/components/SiteNav'
import { ROUTE_LIST_POSTERS, MUTATION_POSTERS } from '@/const'

export default {
  components: { SiteNav },
  computed: {
    posterId() {
      return parseInt(this.$route.params.id, 10)
    },
    poster() {
      return this.$store.getters.posterById(this.posterId)
    },
    posterName() {
      return this.poster ? this.poster.name : 'Poster ~'
    },
    posterQuestion() {
      return this.poster ? this.poster.question : '~'
    }
  },
  mounted() {
    this.fetchPoster()
  },
  methods: {
    async fetchPoster() {
      let { meta, data } = await sharedClient.get(`posters/${this.posterId}`)
      if (meta.success) {
        this.$store.commit(MUTATION_POSTERS, [data])
      } else {
        this.$router.replace({ name: ROUTE_LIST_POSTERS })
      }
    }
  }
}
</script>

<style lang="sass"></style>
