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
                li(v-if="currentUser"): router-link(to="/posters") Posters
                li.is-active: a(href="#") {{posterName}}
  
  section.section(v-if="poster && options && votes")
    .container
      .columns
        .column
          .field
            div: h4.title.is-4 Question
            p.is-size-5 {{posterQuestion}}
          
          .field
            div: h4.title.is-4 Answers
            ul.is-size-5
              li(v-for="option, index in filteredOptions")
                strong {{index + 1}}.
                span  {{option.text}}
          
          .field.actions(v-if="currentUser")
            div: h4.title.is-4 Actions
            .buttons
              button.button.is-link.is-medium(@click="printPoster")
                | Preview &amp; print
              button.button.is-danger.is-medium(@click="destroyPoster")
                | Archive Poster
        .column
          .poster-result(v-if="hasVotes")
            h2.result-title
              span Poster results
            .option(v-for="option, index in filteredOptions")
              label
                span.name {{option.text}}
                span.vote {{votesForOption(index)}}
                  |  – {{votesForOption(index) / totalVotes | percentage}}
              progress.progress.is-large.is-info(
                :value="votesForOption(index)",
                :max="totalVotes",
                :style="{ '--theme': '#' + poster.colour }"
              )
            p.has-text-right Last scanned {{ lastScan | dateAgo }}
          .message.is-warning.votes(v-else)
            .message-header
              p No votes ... yet
            .message-body
              p This poster's votes haven't been recorded yet.
              p To record votes, go up to a poster, dial the number on it and hold your phone up against the speaker.
              p Make sure you have registered your poster using the instructions on the back.
</template>

<script>
import { sharedClient } from '@/services/ApiService'
import SiteNav from '@/components/SiteNav'
import { SplashMessageBus } from '@/busses'
import {
  ROUTE_HOME,
  ROUTE_LIST_POSTERS,
  MUTATION_POSTERS,
  MUTATION_DELETE_POSTER
} from '@/const'

export default {
  components: { SiteNav },
  data: () => ({
    votes: null,
    options: null
  }),
  computed: {
    posterId() {
      return parseInt(this.$route.params.id, 10)
    },
    posterURI() {
      return `/posters/${this.posterId}`
    },
    poster() {
      return this.$store.getters.posterById(this.posterId)
    },
    posterName() {
      return this.poster ? this.poster.name : 'Poster ~'
    },
    posterQuestion() {
      return this.poster ? this.poster.question : '~'
    },
    filteredOptions() {
      return !this.options ? [] : this.options.filter(o => o.text)
    },
    totalVotes() {
      let reducer = (sum, option, index) => sum + this.votesForOption(index)
      return this.hasVotes ? this.filteredOptions.reduce(reducer, 0) : 0
    },
    hasVotes() {
      const validVotes = this.votes.length === this.options.length
      const hasValues = !this.votes.some(v => v.vote === 0)
      return this.votes && this.options && validVotes && hasValues
    },
    currentUser() {
      return this.$store.state.currentUser
    },
    lastScan() {
      return this.votes && this.votes[0].recorded_at
    }
  },
  mounted() {
    this.fetchPoster()
    this.fetchVotes()
  },
  methods: {
    async fetchPoster() {
      let { meta, data } = await sharedClient.get(this.posterURI)
      if (meta.success) {
        this.$store.commit(MUTATION_POSTERS, [data])
        this.options = data.options
      } else {
        SplashMessageBus.$emit('message', `Couldn't find poster`)
        this.$router.replace({
          name: this.currentUser ? ROUTE_LIST_POSTERS : ROUTE_HOME
        })
      }
    },
    async fetchVotes() {
      let { meta, data } = await sharedClient.get(`${this.posterURI}/votes`)
      if (meta.success) this.votes = data
    },
    votesForOption(index) {
      return this.votes && this.votes[index] ? this.votes[index].vote : '~'
    },
    printPoster() {
      // Open the poster pdf in a new tab
      let pdfWindow = window.open(this.poster.pdf_url)
      pdfWindow.focus()
    },
    async destroyPoster() {
      let msg = `Are you sure you want to delete this poster?`
      if (!confirm(msg)) return
      let { meta } = await sharedClient.delete(this.posterURI)
      if (meta.success) {
        SplashMessageBus.$emit('message', 'Poster removed')
        this.$store.commit(MUTATION_DELETE_POSTER, this.posterId)
        this.$router.push({ name: ROUTE_LIST_POSTERS })
      }
    }
  }
}
</script>

<style lang="sass">
.poster-result
  margin-top: 1em
  padding: 1em 2em 2em
  border: 2px dashed #dbdbdb
  border-radius: 1em
  position: relative
  .result-title
    text-align: center
    font-weight: 700
    position: relative
    top: -2.5em
    span
      font-size: 1.8rem
      background: #fff
      padding: 0 1rem
      max-width: 75%
  .option
    border-radius: 4px
    &:not(:last-child)
      margin-bottom: 1em
    label
      display: flex
      justify-content: space-between
      font-size: 1.2em
    .name
      font-weight: 700
    progress::-webkit-progress-value
      background-color: var(--theme)
    progress::-moz-progress-bar
      background-color: var(--theme)

.actions
  .buttons
    margin-top: 0.2em
</style>
