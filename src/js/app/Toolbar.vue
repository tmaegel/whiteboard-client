<template>
    <div>
        <div id="titlebar">
            <h1 v-if="!share.state.app.searchbar">{{ title }}</h1>
            <Searchbar ref="searchbar"></Searchbar>
            <div id="toolbar">
                <span id="nav-searchbar" v-on:click="toggleSearchBar"><svg class="icon icon-search"><use xlink:href="#icon-search"></use></svg></span>
                <span id="nav-filter" v-on:click="toggleFilterMenu"><svg class="icon icon-cog"><use xlink:href="#icon-cog"></use></svg></span>
            </div>
        </div>
        <FilterMenu></FilterMenu>
    </div>
</template>

<script>
import store from '../store.js';
import FilterMenu from './FilterMenu.vue';
import Searchbar from './Searchbar.vue';

export default {
    name: 'Toolbar',
    props: ['title'],
    data: function () {
        return {
          share: store
        }
    },
    methods: {
        toggleSearchBar: function() {
            if(this.share.state.app.searchbar) { // hide searchbar
                this.value = "";
                this.share.hideSearchbar();
            } else { // show searchbar
                this.value = "";
                this.share.showSearchbar();
                setTimeout(() => { // focus the searchbar
                  this.$refs.searchbar.$el.focus();
                }, 10);
            }
        },
        toggleFilterMenu: function(event) {
            if(this.share.state.app.filterMenu) { // hide filter menu
                this.share.hideFilterMenu();
            } else { // show filter menu
                this.share.showFilterMenu();
            }
            event.stopPropagation();
        }
    },
    components: {
        FilterMenu,
        Searchbar
    }
}
</script>

<style lang="css" scoped>
#titlebar {
    height: 60px;
    width: 100%; /* Full-width */
    background-color: #eee; /* Dark-grey background */
    overflow: auto;
    vertical-align: middle;
}
#titlebar > h1 {
    font-size: 120% !important;
    font-weight: bold !important;
    margin: 15px;
    float:left;
}
#toolbar {
    float: right;
}
#nav-searchbar {
    display: inline-block;
    cursor: pointer;
    padding: 15px 20px;

}
#nav-filter {
    display: inline-block;
    cursor: pointer;
    padding: 15px 20px;
}
</style>
