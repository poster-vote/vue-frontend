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
      SplashMessageBus.$emit('message', {
        body: 'An update is available, please refresh',
        type: 'info'
      })
    },
    offline() {
      SplashMessageBus.$emit('message', {
        body: 'Running in offline mode',
        type: 'info'
      })
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
