import { reactive } from 'vue'

const store = {
  state: reactive({
    currentRoute: window.location.pathname,
  }),
}

export default store
