<template>
  <input v-if="share.state.app.searchbar" v-model="value" v-on:keyup="doSearch()" type="text" placeholder="Search..."/>
</template>

<script>
import store from '../store.js';

export default {
    name: 'Searchbar',
    data: function () {
        return {
            timer: null,
            value: "",
            share: store
        }
    },
    methods: {
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
            }.bind(this), 500);
        },

    }
}
</script>

<style lang="css" scoped>
input {
    width: 75%; /* Full-width */
    font-size: 20px;
    border: 0 !important;
    background-color: #eee; /* Dark-grey background */
    margin: 15px;
    padding: 0 !important;
    float:left;
}
</style>
