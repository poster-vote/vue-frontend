<template lang="pug">
.add-poster
  .hero.is-primary
    .hero-head
      site-nav
    .hero-body
      .container
        h1.title New Poster
        h2.subtitle Create a new poster on PosterVote
  
  section.toolbar
    .container
      .level
        .level-left
          .level-item
            nav.breadcrumb
              ul
                li: router-link(to="/") Home
                li: router-link(to="/posters") Posters
                li.is-active: router-link(to="/posters/add") Add Poster
  
  section.section(v-if="messages.length > 0")
    .container
      .message.is-danger
        .message-header Something went wrong
          button.delete(@click="resetMessages")
        .message-body
          ul
            li(v-for="message in messages") {{message}}
  
  section.section
    .container
      .columns
        .column
          .field
            label.label Name
            .control
              input.input(
                type="text",
                v-model="poster.name",
                placeholder="e.g. Lunch survey"
              )
          .field
            label.label Question ({{poster.question.length}}/{{questionLength}})
            .control
              textarea.textarea(
                :class="questionClasses",
                rows="3",
                type="text",
                v-model="poster.question",
                placeholder="e.g. What did you have for lunch today?"
              )
          .field
            label.label Colour
            .field.has-addons
              .control.is-expanded
                input.input(
                  type="color",
                  v-model="poster.colour"
                )
              .control
                button.button.is-link(@click="shuffleColour") Generate
          .field
            label.label Creator (optional)
            .control
              input.input(
                type="text",
                v-model="poster.owner",
                placeholder="e.g. Geoff Testington"
              )
          .field
            label.label Contact (optional)
            .control
              input.input(
                type="text",
                v-model="poster.contact",
                placeholder="e.g. geoff@newcastle.ac.uk"
              )
        .column
          label.label Options
          div
            .field.has-addons(v-for="option, i in poster.options")
              .control
                button.button.is-static(tabindex="-1") {{i + 1}}.
              .control.is-expanded
                input.input(
                  type="text",
                  :class="optionClasses(poster.options[i])"
                  v-model="poster.options[i]",
                  :placeholder="optionPlaceholder(i)"
                )
              .control
                button.button.is-static(tabindex="-1") {{poster.options[i].length}} / {{optionLength}}
          p.help These are the options people viewing your poster will have to pick from, you can leave some blank.
  
  section.section
    .container
      .buttons.is-centered
        router-link.button.is-text(to="/posters") Cancel
        button.button.is-success.is-medium(
          @click="submitPoster",
          :disabled="!canSubmit"
        ) Create
</template>

<script>
import Vue from 'vue'
import color from 'color'

import SiteNav from '@/components/SiteNav'
import { sharedClient } from '@/services/ApiService'
import { MUTATION_POSTERS, ROUTE_SHOW_POSTER } from '@/const'

const letters = ['A', 'B', 'C', 'D', 'E']

const optionLength = 30
const questionLength = 120

export default {
  components: { SiteNav },
  data() {
    return {
      messages: [],
      state: 'input',
      poster: {
        name: '',
        question: '',
        colour: this.randomColour(),
        owner: '',
        contact: '',
        options: ['', '', '', '', '']
      },
      questionLength,
      optionLength
    }
  },
  computed: {
    canSubmit() {
      const hasOptions = this.poster.options.filter(o => o !== '').length > 1
      const validOptions = this.poster.options.every(
        o => o.length <= optionLength
      )

      return (
        this.poster.name &&
        this.poster.question &&
        this.poster.colour &&
        hasOptions &&
        validOptions &&
        this.poster.question.length <= questionLength
      )
    },
    questionClasses() {
      return {
        'is-danger': this.poster.question.length > questionLength
      }
    }
  },
  methods: {
    optionClasses(o) {
      return {
        'is-danger': o.length > optionLength
      }
    },
    onOptionChange(i, e) {
      Vue.set(this.poster.options, i, e.target.value.slice(0, 30))
    },
    optionPlaceholder(i) {
      return `e.g. Option ${letters[i % letters.length]}`
    },
    randomColour() {
      const hue = Math.floor(Math.random() * 360)
      return color.hsl(hue, 99, 53).hex()
    },
    shuffleColour() {
      this.poster.colour = this.randomColour()
    },
    resetMessages() {
      this.messages = []
    },
    async submitPoster() {
      this.state = 'working'
      let { meta, data } = await sharedClient.post('posters', {
        ...this.poster
      })
      if (meta.success) {
        this.$store.commit(MUTATION_POSTERS, [data])
        const params = { id: data.id }
        this.$router.push({ name: ROUTE_SHOW_POSTER, params })
      } else {
        this.state = 'input'
        this.messages = meta.messages
      }
    }
  }
}
</script>

<style lang="sass"></style>
