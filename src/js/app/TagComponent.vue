<template>
    <span class="tag"><small>{{ tagName }}</small></span>
</template>

<script>
import store from '../store.js';

export default {
    name: 'TagComponent',
    props: ['tagName'],
}
</script>

<style lang="css" scoped>
.tag {
    color: gray;
    background-color: #f6f6f6;
    border: 2px solid #ddd;
    padding: 5px;
    margin-right: 5px;
}
</style>
