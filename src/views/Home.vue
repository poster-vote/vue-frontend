<template lang="pug">
.home
  .hero.is-primary
    .hero-head
      site-nav
    .hero-body
      centered-box.has-text-centered(v-if="user")
        h2.title.is-5.has-text-dark Welcome back!
        .buttons.is-centered
          router-link.button.is-link.is-medium(to="/posters") My posters →
      centered-box(v-else-if="state === 'checking'")
        .control.is-loading
          p.is-size-4.has-text-grey-light Checking login
      centered-box(v-else-if="state === 'sent'")
        .notification.is-success
          button.delete(@click="state = 'input'")
          | We've sent an email to #[strong {{email}}]',
          | check your email for a login link
      centered-box(v-else)
        label.label(for="emailInput") Login using your email
        .field.has-addons.is-marginless
          .control.is-expanded
            input.input#emailInput(
              type="email",
              v-model="email",
              @keyup.enter="submitLogin"
              placeholder="rob@example.com",
              autofocus
            )
          .control
            button.button.is-success(
              :disabled="!canSubmit",
              @click="submitLogin"
            ) Login!
        p.help We'll send you a login code and store a cookie so we can remember it
  
  section.section
    .container.has-text-centered
      h1.title.is-1 PosterVote
      h2.subtitle Embedded voting inside printed posters
  
  section.section
    .container
      .columns
        .column.is-two-fifths
          .placeholder.image.is-16by9
            span 1.
        .column.is-three-fifths.has-vertical-content
          p.is-size-4 Quickly create and print posters that asks your questions
      
      .columns.is-reversed-desktop
        .column.is-two-fifths
          .placeholder.image.is-16by9
            span 2.
        .column.is-three-fifths.has-vertical-content
          p.is-size-4 Attach a PosterVote so people can press the buttons on the poster
      
      .columns
        .column.is-two-fifths
          .placeholder.image.is-16by9 
            span 3.
        .column.is-three-fifths.has-vertical-content
          p.is-size-4 Upload votes by playing the poster's sound down the phone.
      
      .columns.is-reversed-desktop
        .column.is-two-fifths
          .placeholder.image.is-16by9 
            span 4.
        .column.is-three-fifths.has-vertical-content
          p.is-size-4 Votes automatically appear on the website so you can review your engagement
</template>

<script>
import { sharedClient } from '@/services/ApiService'
import { MUTATION_CURRENT_USER } from '@/const'
import { isEmail } from '@/utils'
import SiteNav from '@/components/SiteNav'
import CenteredBox from '@/components/CenteredBox'

export default {
  components: {
    SiteNav,
    CenteredBox
  },
  data: () => ({
    state: 'checking',
    email: ''
  }),
  computed: {
    user() {
      return this.$store.state.currentUser
    },
    canSubmit() {
      return isEmail(this.email) && this.state === 'input'
    }
  },
  mounted() {
    this.checkLogin()
  },
  methods: {
    async checkLogin() {
      let { data } = await sharedClient.get('users')
      if (data) {
        this.$store.commit(MUTATION_CURRENT_USER, data)
      } else {
        this.state = 'input'
      }
    },
    async submitLogin() {
      let { meta } = await sharedClient.post('users', {
        email: this.email
      })

      this.state = meta.success ? 'sent' : 'input'
    },
    resetForm() {
      this.state = 'input'
    }
  }
}
</script>
