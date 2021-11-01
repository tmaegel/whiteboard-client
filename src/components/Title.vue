<template>
  <div class="padding-default">
    <h1 id="page-title" class="margin-0">
      {{ title }}
    </h1>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

#page-title {
  color: $fg_white_2;
}
</style>
