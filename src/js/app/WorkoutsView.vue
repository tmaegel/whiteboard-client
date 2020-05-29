<template>
    <div>
        <ul>
            <li is="workout-component"
                v-for="(workoutItem, workoutIndex) in workoutsSortByName"
                v-bind:key="workoutItem.id"
                v-bind:workout="workoutItem"></li>
        </ul>
    </div>
</template>

<script>
import store from '../store.js';
import WorkoutComponent from './WorkoutComponent.vue';
import * as arrayHelper from "../array.js";

export default {
    name: 'WorkoutsView',
    data: function () {
        return {
            share: store
        }
    },
    computed: {
        workoutsSortByName: function() { // returns all visible workout cards in sort order
            if(this.share.state.app.sortAsc) {
                return store.state.workouts.sort(arrayHelper.compareByString).filter(function(workout) {
                    return workout.seen != false;
                });
            } else {
                return store.state.workouts.sort(arrayHelper.compareByString).reverse().filter(function(workout) {
                    return workout.seen != false;
                });
            }
        }
    },
    components: {
        WorkoutComponent
    }
}
</script>

<style lang="css" scoped>
</style>
