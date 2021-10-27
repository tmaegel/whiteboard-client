<template>
  <Topbar />
  <div id="wrapper">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <Bottombar />
</template>

<script>
import Topbar from '@/components/Topbar.vue'
import Bottombar from '@/components/Bottombar.vue'

export default {
  components: {
    Topbar,
    Bottombar,
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";

* {
  color: $color_white_1;
  font-family: Menlo, 'Bitstream Vera Sans Mono',
                      'DejaVu Sans Mono', 'Monaco',
                      'Consolas', sans-serif;
}

body {
  margin: 0;
  background-color: $color_gray_1;
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
  color: $color_white_1;
}

a:visited {
  text-decoration: none;
  color: $color_white_1;
}

a:hover {
  text-decoration: none;
  color: $color_white_1;
}

table {
  margin: 0;
}

table th, table td,
table th:first-child, table td:first-child,
table th:last-child, table td:last-child {
  border-color: $color_gray_3;
  padding: $pixel_medium $pixel_large;
}

/*
 * Card
 */
.card {
  margin: 0;
  padding: $pixel_medium $pixel_large;
  border-top: 1px solid $color_gray_2;
}
</style>
