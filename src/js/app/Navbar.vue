<template>
    <div id="navbar">
        <ul>
            <li v-for="tab in tabs"
                v-bind:key="tab"
                v-bind:class="{ active: share.state.app.currentView === tab }"
                v-on:click="activateTab(tab)">
                <svg v-bind:class="'icon icon-' + tab"><use v-bind:xlink:href="'#icon-' + tab"></use></svg><span class="mls"></span>
            </li>
        </ul>
    </div>
</template>

<script>
import store from '../store.js';
import * as request from "../rest.js";

export default {
    name: 'Navbar',
    data: function () {
        return {
            tabs: ["home", "workouts", "movements", "equipment"],
            share: store
        }
    },
    methods: {
        activateTab: function(tab) {
            this.share.state.app.currentView = tab;
            this.share.state.app.searchbar = false;
            switch(this.share.state.app.currentView) {
                case "home":
                    this.title = "Home"
                    break;
                case "workouts":
                    this.title = "Workouts";
                    this.share.showLoader();
                    request.restGetWorkouts();  // get all workout objects; get scores when clicking on the workout
                    this.share.showAllWorkouts(); // show all workouts
                    break;
                case "movements":
                    this.title = "Movements";
                    this.share.showLoader();
                    request.restGetMovements(); // get all movements objects
                    break;
                case "equipment":
                    this.title = "Equipment";
                    this.share.showLoader();
                    request.restGetEquipment(); // get all equipment objects
                    break;
            }
        }
    }
}
</script>

<style lang="css" scoped>
#navbar {
    width: 100%; /* Full-width */
    background-color: #eee; /* Dark-grey background */
    overflow: auto; /* Overflow due to float */
}
#navbar ul {
    background-color: #eee;
    list-style: none;
    text-align: center;
    padding: 0;
    margin: 0;
}
#navbar li {
    float: left; /* Float links side by side */
    text-align: center; /* Center-align text */
    width: 25%; /* Equal width (5 icons with 20% width each = 100%) */
    padding: 10px 0; /* Some top and bottom padding */
    font-size: 20px; /* Increased font size */
    cursor: pointer;
}
#navbar .active {
    border-bottom: 5px solid gray;
}
#navbar li:hover {
    border-bottom: 5px solid #ddd;
}
</style>
