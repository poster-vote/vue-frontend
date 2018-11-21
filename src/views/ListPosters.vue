<template lang="pug">
.posters
  .hero.is-primary
    .hero-head
      site-nav
    .hero-body
      .container
        h1.title Your posters
        h2.subtitle The poster's you've created and printed
  
  section.toolbar
    .container
      .level
        .level-left
          .level-item
            nav.breadcrumb
              ul
                li: router-link(to="/") Home
                li.is-active: a(href="/posters") Posters
        .level-right
          .level-item
            .buttons
              router-link.button.is-success(:to="addPosterRoute") Create poster
              button.button.is-danger(@click="logout") Logout
  
  section.section
    .container
      .columns.is-multiline
        .column.is-one-third(v-for="poster in posters")
          .poster-cell(:style="posterStyles(poster)")
            .poster-head
              span {{poster.name}}
              span  \#{{poster.code}}
            .poster-body {{poster.question}}
            .poster-foot
              .buttons.is-centered
                router-link.button.is-white.is-outlined(
                  :to="posterRoute(poster)"
                ) View Poster →
</template>

<script>
import { sharedClient } from '@/services/ApiService'
import SiteNav from '@/components/SiteNav'
import {
  MUTATION_POSTERS,
  MUTATION_CURRENT_USER,
  ROUTE_SHOW_POSTER,
  ROUTE_ADD_POSTER,
  ROUTE_HOME
} from '@/const'

export default {
  components: { SiteNav },
  computed: {
    posters() {
      return this.$store.state.posters
    },
    addPosterRoute() {
      return { name: ROUTE_ADD_POSTER }
    }
  },
  mounted() {
    this.fetchPosters()
  },
  methods: {
    async logout() {
      const message = 'Are you sure you want to logout?'
      if (!confirm(message)) return
      await sharedClient.delete('users')
      this.$store.commit(MUTATION_CURRENT_USER, null)
      this.$router.push({ name: ROUTE_HOME })
    },
    posterStyles(poster) {
      return { 'background-color': `#${poster.colour}` }
    },
    posterRoute(poster) {
      return { name: ROUTE_SHOW_POSTER, params: { id: poster.id } }
    },
    async fetchPosters() {
      let { data = [] } = await sharedClient.get('posters')
      this.$store.commit(MUTATION_POSTERS, data)
    }
  }
}
</script>

<style lang="sass">
.poster-cell
  overflow: hidden
  border-radius: 0.5em
  color: white
  border: 4px solid rgba(0,0,0,0)

  $poster-pad: 1rem

  .poster-head
    background-color: rgba(0,0,0,0.2)
    padding: 0 $poster-pad
    font-size: 1.3em
    font-weight: 600
    display: flex
    justify-content: space-between
    font-weight: 600
    border-radius: 0.2em
  .poster-body
    padding: 0.5rem $poster-pad
    height: 5em
    overflow: hidden
    text-overflow: ellipsis
    font-size: 1.2em
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
    font-weight: 400
  .poster-foot
    margin: 0 $poster-pad 1rem
</style>