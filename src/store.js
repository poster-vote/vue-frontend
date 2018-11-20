import Vue from 'vue'
import Vuex from 'vuex'

import { MUTATION_POSTERS, MUTATION_CURRENT_USER } from '@/const'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posters: [],
    currentUser: null
  },
  mutations: {
    [MUTATION_POSTERS](state, posters) {
      state.posters = mergeByKey(state.posters, posters)
    },
    [MUTATION_CURRENT_USER](state, user) {
      state.currentUser = user
    }
  },
  actions: {},
  getters: {
    posterById: state => id => {
      return state.posters.find(poster => poster.id === id)
    }
  }
})

/** Returns a shallow copy of setB merged into setA by comparing element.id */
export function mergeByKey(targetArray, toInsert, key = 'id') {
  let output = Array.from(targetArray)
  toInsert.forEach(value => {
    let index = output.findIndex(existing => existing[key] === value[key])
    if (index === -1) output.push(value)
    else output[index] = value
  })
  return output
}
