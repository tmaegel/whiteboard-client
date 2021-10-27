<template>
  <div class="bar padding-default">
    <a class="bar-item font-medium" href="#">
      <i class="fa fa-arrow-circle-left"></i>
    </a>
    <a class="bar-item font-medium u-pull-right" href="#">
      <i class="fa fa-times-circle"></i>
    </a>
  </div>
</template>

<script>
export default { }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.bar {
  width:100%;
  box-sizing: border-box;
}
.bar-item {
  display: inline-block;
}
</style>
