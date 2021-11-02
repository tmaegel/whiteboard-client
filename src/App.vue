<template>
  <div id="wrapper">
    <notifications position="top center" classes="notification" width="100%" max="3" />
    <Topbar v-show="shared.state.user.authenticated" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Bottombar v-show="shared.state.user.authenticated" />
  </div>
</template>

<script>
import Topbar from '@/components/Topbar.vue'
import Bottombar from '@/components/Bottombar.vue'
import store from '@/store'

export default {
  data() {
    return {
      shared: store,
    }
  },
  created() {
  },
  components: {
    Topbar,
    Bottombar,
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";

* {
  color: $fg_white_2;
  font-family: Menlo, 'Bitstream Vera Sans Mono',
                      'DejaVu Sans Mono', 'Monaco',
                      'Consolas', sans-serif;
}
body {
  margin: 0;
  background-color: $bg_gray_1;
  font-size: $font_size_medium;
}
#app {
  margin: 0;
  padding: 0;
}
#wrapper {
  margin: 0;
  padding: 0;
}
#content {
  padding: $pixel_medium $pixel_large;
}
a:link {
  text-decoration: none;
  color: $fg_white_2;
}
a:visited {
  text-decoration: none;
  color: $fg_white_2;
}
a:hover {
  text-decoration: none;
  color: $fg_white_2;
}
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}
.fade-enter-active {
  transition-delay: .25s;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
table {
  margin: 0;
}
table th, table td,
table th:first-child, table td:first-child,
table th:last-child, table td:last-child {
  border-color: $gray_0;
  padding: $pixel_medium $pixel_large;
}
.card {
  margin: 0;
  padding: $pixel_medium $pixel_large;
  border-top: 1px solid $gray_0;
}
/* notification */
.notification {
  margin: $pixel_small $pixel_small 0 $pixel_small;
  padding: $pixel_small;
  color: $fg_white_0;
  font-size: $font_size_tiny;
  border: 0;
  border-radius: 4px;
  /* style for title line */
  .notification-title {}
  /* style for content */
  .notification-content {}
  &.info {
    background: $blue_light;
    border: 0;
  }
  &.success {
    background: $green_light;
    border: 0;
  }
  &.warn {
    background: $yellow_light;
    border: 0;
  }
  &.error {
    background: $red_light;
    border: 0;
  }
}
</style>
