import { reactive } from 'vue'
import { User } from '@/models'

const store = {
  state: reactive({
    user: new User(),
  }),
}

export default store
