<template>
    <tr
        v-on:click="toggleScoreItem"
        v-bind:class="{ select: score.selected }" class="cursor">
        <td>{{ getRx() }}</td>
        <td>{{ score.score }}</td>
        <td>{{ getShortFormatTimestamp(score.datetime) }}</td>
        <td>{{ score.note }}</td>
     </tr>
</template>

<script>
import store from '../store.js';
import * as timeHelper from "../time.js";

export default {
    name: 'ScoreComponent',
    props: ['score', 'workoutId'],
    methods: {
        toggleScoreItem: function(workoutIndex, scoreIndex) {
            if(this.score.selected) {
                store.unselectScore(this.workoutId, this.score.id)
            } else {
                store.selectScore(this.workoutId, this.score.id);
            }
        },
        getShortFormatTimestamp: function(datetime) {
            return timeHelper.getShortFormatTimestamp(datetime);
        },
        getRx: function() {
            if(this.score.rx) {
                return "Rx";
            } else {
                return "";
            }
        }
    }
}
</script>

<style lang="css" scoped>
table td, table th {
  padding: 12px;
  display: table-cell;
  text-align: left;
  vertical-align: middle
}
table tr {
  border: 1px solid #eee;
}
/*table tr:last-child {
  border: 0;
}*/
</style>
