<template>
    <div id="titlebar">
        <h1 v-if="!share.state.app.searchbar">{{ title }}</h1>
        <input v-if="share.state.app.searchbar" v-model="value" v-on:keyup="doSearch()" id="searchbar" type="text" placeholder="Search...">
        <div id="toolbar">
            <span id="nav-filter"><svg class="icon icon-cog"><use xlink:href="#icon-cog"></use></svg><span class="mls"></span></span>
            <span id="nav-searchbar" v-on:click="toggleSearchBar()"><svg class="icon icon-search"><use xlink:href="#icon-search"></use></svg><span class="mls"></span></span>
        </div>
    </div>
</template>

<script>
import store from '../store.js';

export default {
    name: 'Titlebar',
    props: ['title'],
    data: function () {
        return {
            timer: null,
            value: "",
            share: store
        }
    },
    methods: {
        toggleSearchBar: function() {
            if(this.share.state.app.searchbar) { // hide searchbar
                this.value = "";
                this.share.hideSearchbar();
                this.share.showAllWorkouts();
            } else { // show searchbar
                this.value = "";
                this.share.showSearchbar();
                this.share.showAllWorkouts();
            }
        },
        doSearch: function() {
            if(this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(function() {
                for(let workoutIndex in this.share.state.workouts) {
                    if (this.share.state.workouts[workoutIndex].name.toLowerCase().includes(this.value)) { // case insensitive
                        this.share.showWorkout(workoutIndex);
                    } else {
                        this.share.hideWorkout(workoutIndex);
                    }
                }
            }.bind(this), 1000);
        },
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
#searchbar {
    width: 60%; /* Full-width */
    font-size: 20px;
    border: 0 !important;
    background-color: #eee; /* Dark-grey background */
    margin: 15px;
    padding: 0 !important;
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
