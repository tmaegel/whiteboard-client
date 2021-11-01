<template>
  <div class="bar bar-fix-bottom">
      <ul class="nav">
        <li v-for="route in visible_routes" :key="route.name" class="nav-item" :class="{ active: is_route(route.path) }">
          <router-link :to="route.path">
            <i :class="route.icon"></i>
          </router-link>
        </li>
      </ul>
  </div>
</template>

<script>
import store from '@/store'
import { routes } from '@/router'

export default {
  data() {
    return {
      shared: store.state,
      routes: routes,
    }
  },
  computed: {
    visible_routes() {
      return this.routes.filter(function(route) {
          return route.visible == true;
      });
    },
    current_route() {
      return this.$route.path;
    },
  },
  methods: {
    is_route(endpoint) {
      if(endpoint == this.current_route) {
        return true;
      } else {
        return false;
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.bar {
  width:100%;
  box-sizing: border-box;
  background-color: $bg_gray_2;
}
.bar-fix-bottom {
  position:fixed;
  bottom: 0px;
}
.nav {
  margin: 0 !important;
  padding: 0 !important;
  text-align: center;
}
.nav li {
  list-style-type: none;
  display: inline-block;
  margin: 0;
  padding: $pixel_medium $pixel_large;
  font-size: $font_size_huge;
}
.nav-item {
  border-top: 3px solid $bg_gray_2;
}
.nav-item.active {
  border-top: 3px solid $fg_white_2;
}
</style>
