<template>
    <div id="topbar">
        <Searchbar v-bind:title="title"></Searchbar>
        <Navbar></Navbar>
    </div>
</template>

<script>
import store from '../store.js';
import Searchbar from './Searchbar.vue';
import Navbar from './Navbar.vue';

export default {
    name: 'Topbar',
    data: function () {
        return {
            title: "Home"
        }
    },
    components: {
        Searchbar,
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
