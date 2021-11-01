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
import config from '@/config'
import store from '@/store'
import { RestClient } from '@/rest'
import { User } from '@/models'
import { success, error } from '@/notification'

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
        let client = new RestClient();
        client.setup(config.api.root + config.api.login['route'],
                     'POST', config.api.login['valid'])
        client.request({ username: this.username, password: this.password },
          (data) => {
            success('Successfully logged in.')
            store.state.user = new User(data.user_id, data.name)
            store.state.user.set_token(data.token);
          },
          (json_err) => { error(json_err.message) }
        );
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
  width: 100vw;
  height: 100vh;
  /* centering inner content */
  display: flex;
  /* centering along main axis - x axis (horizontal) */
  justify-content: center;
  /* centering along cross axis - y axis (vertical) */
  align-items: center;
}
form {
 margin: $pixel_small;
  max-width: 400px;
}
</style>
