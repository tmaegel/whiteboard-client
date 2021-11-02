<template>
  <ul class="card-list">
    <li v-for="(entry, index) in entries" :key="index">
      {{ entry.name }}
    </li>
  </ul>
</template>

<script>
export default {
  props: ['entries']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

ul.card-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid $gray_0;
}
.card-list li {
  margin: 0;
  padding: $pixel_medium $pixel_large;
  list-style-type: none;
  border-bottom: 1px solid $gray_0;
  cursor: pointer;
  color: $fg_white_2;
}
</style>
