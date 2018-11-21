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
  
  section.section(v-if="poster")
    .container
      .columns
        .column.is-two-fifths
          div
            h3.title.is-3 {{posterQuestion}}
          ul.is-size-4
            li(v-for="option, index in poster.options")
              strong {{index + 1}}.
              span  {{option.text}}
        .column
</template>

<script>
import { sharedClient } from '@/services/ApiService'
import SiteNav from '@/components/SiteNav'
import { ROUTE_LIST_POSTERS, MUTATION_POSTERS } from '@/const'

export default {
  components: { SiteNav },
  data: () => ({
    votes: null
  }),
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
    this.fetchVotes()
  },
  methods: {
    async fetchPoster() {
      let { meta, data } = await sharedClient.get(`posters/${this.posterId}`)
      if (meta.success) {
        this.$store.commit(MUTATION_POSTERS, [data])
      } else {
        this.$router.replace({ name: ROUTE_LIST_POSTERS })
      }
    },
    async fetchVotes() {
      let { meta, data } = await sharedClient.get(
        `posters/${this.posterId}/votes`
      )
      console.log(meta)
      console.log(data)
    }
  }
}
</script>

<style lang="sass"></style>
