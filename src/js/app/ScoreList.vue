<template>
    <div>
        <table>
            <tr is="score-component"
                v-for="scoreItem in scoresSortByDatetime"
                v-bind:key="scoreItem.id"
                v-bind:score="scoreItem"
                v-bind:workout-id="workout.id"
            ></tr>
        </table>
    </div>
</template>

<script>
import store from '../store.js';
import ScoreComponent from './ScoreComponent.vue';
import * as arrayHelper from "../array.js";

export default {
    name: 'ScoreList',
    props: ['workout'],
    computed: {
        scoresSortByDatetime: function() { // returns all workout scores in sort by datetime
            return this.workout.scores.sort(arrayHelper.compareByTimestamp);
        }
    },
    components: {
        ScoreComponent
    }
}
</script>

<style lang="css" scoped>
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  display: table;
}
</style>
