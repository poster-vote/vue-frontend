import Vue from 'vue'

Vue.filter('percentage', v => {
  return (v * 100).toFixed(1) + '%'
})
