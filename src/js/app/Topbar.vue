<template>
    <div id="topbar">
        <Toolbar v-bind:title="title"></Toolbar>
        <Navbar></Navbar>
    </div>
</template>

<script>
import store from '../store.js';
import Toolbar from './Toolbar.vue';
import Navbar from './Navbar.vue';

export default {
    name: 'Topbar',
    data: function () {
        return {
            title: "Home"
        }
    },
    components: {
        Toolbar,
        Navbar
    }
}
</script>

<style lang="css" scoped>
#topbar {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1; /* Sit on top */
    color: gray;
    background-color: #eee;
    box-shadow: 0 1px 13px rgba(0,0,0,0.24);
}
</style>
