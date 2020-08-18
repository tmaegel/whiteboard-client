<template>
    <li class="card">
        <div v-on:click="toggleWorkoutCard" class="card-header collapsible">
            <h4>{{ workout.name }}</h4>
        </div>
        <div v-if="workout.active" class="card-content">
            <div class="card-body">
                <p v-html="getWorkoutDescription(workout.description)"></p>
                <p><small>{{ getFormatTimestamp(workout.datetime) }} updated</small></p>
                <div class="tags-container">
                    <TagComponent v-for="tag in workout.tags" :key="tag.tagId" v-bind:tagName="tag.tag" />
                </div>
            </div>
            <ScoreList
                v-bind:workout="workout"
            />
            <chart v-bind:chart-data="dataset" v-bind:options="options"></chart>
        </div>
    </li>
</template>

<script>
import store from '../store.js';
import ScoreList from './ScoreList.vue';
import TagComponent from './TagComponent.vue';
import chart from "../chart.js";
import * as arrayHelper from "../array.js";
import * as request from "../rest.js";
import * as timeHelper from "../time.js";

export default {
    name: 'WorkoutComponent',
    props: ['workout'],
    data: function () {
        return {
            dataset: null,
            options: { // Chart.js options
              layout: {
                padding: {
                  left: 0,
                  right: 0,
                  top: 10,
                  bottom: 0,
                },
              },
              tooltips: {
                cornerRadius: 0,
                backgroundColor: 'rgba(96, 96, 96, 0.25)',
                titleFontColor: 'gray',
                bodyFontColor: 'gray',
                footerFontColor: 'gray',
                borderWidth: 1,
                borderColor: 'rgba(96, 96, 96, 0.5)',
                displayColors: false,
                footerMarginTop: 0,
              },
              elements: {
                point: {
                  radius: 5,
                  hoverRadius: 6,
                  hitRadius: 1,
                  hoverBorderWidth: 2,
                  borderColor: 'rgba(12, 58, 95, 0.1)',
                  backgroundColor: 'rgba(12, 58, 95, 0.1)',
                },
                line: {
                  borderWidth: 3,
                  borderColor: 'rgba(12, 58, 95, 0.1)',
                  backgroundColor: 'rgba(12, 58, 95, 0.1)',
                },
              },
              scales: {
                yAxes: [{
                  display: false,
                  ticks: {
                    display: false,
                    beginAtZero: true,
                  },
                  gridLines: {
                    display: true,
                  },
                }],
                xAxes: [{
                  display: false,
                  ticks: {
                    display: false,
                    beginAtZero: true,
                  },
                  gridLines: {
                    display: false,
                  },
                }],
              },
              legend: {
                display: false,
              },
              showLine: true,
              responsive: true,
              maintainAspectRatio: false,
            },
        }
    },
    computed: {
        scoresSortByDatetime: function() { // returns all workout scores in sort by datetime
            return this.workout.scores.sort(arrayHelper.compareByTimestamp);
        },
    },
    methods: {
        toggleWorkoutCard: function() {
            if(this.workout.active) {
                store.deactivateWorkout(this.workout.id)
            } else {
                store.activateWorkout(this.workout.id);
                request.restGetWorkoutScores(this.workout.id);
                request.restGetWorkoutTags(this.workout.id);
                this.fillData();
            }
        },
        getWorkoutDescription: function(text) {
            return text.toString().replace(new RegExp('\r?\n','g'), "<br />");
        },
        getFormatTimestamp: function(datetime) {
            if(datetime === 0) {
                return "never";
            } else {
                return timeHelper.getFormatTimestamp(datetime);
            }
        },
        fillData() {
          this.dataset = {
            labels: this.scoresSortByDatetime.map((score) => score.datetime),
            datasets: [{
              data: this.scoresSortByDatetime.map((score) => score.score),
            }],
          };
        },
    },
    components: {
        ScoreList,
        TagComponent,
        chart,
    }
}
</script>

<style lang="css" scoped>
</style>
