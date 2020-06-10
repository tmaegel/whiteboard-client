<template>
    <div>
        <ul>
            <li is="workout-component"
                v-for="(workoutItem, workoutIndex) in filterWorkouts"
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
        filterWorkouts: function() { // returns all visible workout cards in sort order / filter
            switch(this.share.state.app.showTypeIndex) {
                case 0: // type: "all workouts"
                    return this.sortWorkouts();
                    break;
                case 1: // type: "completed workouts"
                    return this.sortWorkouts().filter(function(workout) {
                        return workout.score.length > 0;
                    });
                    break;
                case 2: // type: "non-completed workouts"
                    return this.sortWorkouts().filter(function(workout) {
                        return workout.score.length === 0;
                    });
                    break;
                default:
                    return this.sortWorkouts();
            }
        }
    },
    methods: {
        sortWorkouts: function() {
            let result;
            switch(this.share.state.app.sortTypeIndex) {
                case 0: // type: "alphabetical
                    result = store.state.workouts.sort(arrayHelper.compareByString);
                    break;
                case 1: // type: "last updated"
                    result = store.state.workouts.sort(arrayHelper.compareByTimestamp);
                    break;
                default:
                    result = store.state.workouts.sort(arrayHelper.compareByString);
            }
            // ascending/descending
            if(this.share.state.app.sortAsc) {
                return result.filter(function(workout) {
                    return workout.seen != false;
                });
            } else {
                return result.reverse().filter(function(workout) {
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
