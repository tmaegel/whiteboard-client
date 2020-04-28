<template>
    <li class="card">
        <div v-on:click="toggleWorkoutCard" class="card-header collapsible">
            <h4>{{ workout.name }}</h4>
        </div>
        <div v-if="workout.active" class="card-content">
            <div class="card-body">
                <p v-html="getWorkoutDescription(workout.description)"></p>
                <p><small>{{ getFormatTimestamp(workout.datetime) }}</small></p>
            </div>
            <canvas></canvas>
            <ScoreList
                v-bind:workout="workout"
            />
        </div>
    </li>
</template>

<script>
import store from '../store.js';
import ScoreList from './ScoreList.vue';
import * as request from "../rest.js";
import * as timeHelper from "../time.js";

export default {
    name: 'WorkoutComponent',
    props: ['workout'],
    methods: {
        toggleWorkoutCard: function() {
            if(this.workout.active) {
                store.deactivateWorkout(this.workout.id)
            } else {
                store.activateWorkout(this.workout.id);
                request.restGetWorkoutScores(this.workout.id);
            }
        },
        getWorkoutDescription: function(text) {
            return text.toString().replace(new RegExp('\r?\n','g'), "<br />");
        },
        getFormatTimestamp: function(datetime) {
            return timeHelper.getFormatTimestamp(datetime);
        },
    },
    components: {
        ScoreList
    }
}
</script>

<style lang="css" scoped>
</style>
