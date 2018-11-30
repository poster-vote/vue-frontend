/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { SplashMessageBus } from '@/busses'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      SplashMessageBus.$emit('message', {
        body: 'App is running in offline mode',
        type: 'info'
      })
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
