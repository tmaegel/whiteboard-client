<template>
  <div id="content-center">
    <form>
      <input id="username-input" class="u-full-width" v-model="username"
             type="text" placeholder="username" required>
      <input id="password-input" class="u-full-width" v-model="password"
             type="password" placeholder="password" required>
      <input class="button-primary u-pull-right" type="button" value="Login" @click="login">
    </form>
  </div>
</template>

<script>
/* import config from '@/config' */
import store from '@/store'
import { router } from '@/router'
import { RestAuth } from '@/rest'
import { User } from '@/models'
import { error } from '@/notification'

export default {
  data() {
    return {
      shared: store,
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      if(this.username && this.password) {
        console.debug('Logging in user.');
        let auth_rest = new RestAuth()
        auth_rest.login(this.username, this.password, (data) => {
          store.state.user = new User(data.user_id, data.name)
          store.state.user.set_token(data.token);
          router.push({ name: 'Home' })
        })
      } else {
        error('Missing username and password.')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/form.scss";

#content-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
form {
  margin: $pixel_small;
  max-width: 400px;
}
</style>
