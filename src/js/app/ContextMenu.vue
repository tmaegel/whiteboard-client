<template>
    <div>
        <WorkoutDialog v-bind:edit="editWorkoutDialog"></WorkoutDialog>
        <ScoreDialog v-bind:edit="editScoreDialog"></ScoreDialog>
        <div v-if="share.state.app.contextMenu && !share.state.user.logout" class="dropdown-menu" id="context-menu">
            <span v-if="newWorkoutMenuItem" v-on:click="showDialog('workout', false)" id="btn-new-workout" href="#">Add workout</span>
            <span v-if="editWorkoutMenuItem" v-on:click="showDialog('workout', true)" id="btn-edit-workout" href="#">Edit workout</span>
            <span v-if="newScoreMenuItem" v-on:click="showDialog('score', false)" id="btn-new-score" href="#">Add score</span>
            <span v-if="editScoreMenuItem" v-on:click="showDialog('score', true)" id="btn-edit-score" href="#">Edit score</span>
        </div>
        <button v-if="!share.state.app.workoutDialog && !share.state.app.scoreDialog && !share.state.user.logout" v-on:click="toggleContextMenu" id="btn-menu" class="btn-overlay">
            <svg id="btn-menu-svg" class="icon icon-menu"><use xlink:href="#icon-menu"></use></svg><span class="mls"></span>
        </button>
    </div>
</template>

<script>
import store from '../store.js';
import WorkoutDialog from './WorkoutDialog.vue';
import ScoreDialog from './ScoreDialog.vue';
import * as logger from "../logger.js";

export default {
    name: 'ContextMenu',
    data: function () {
        return {
            editWorkoutDialog: false,
            editScoreDialog: false,
            newWorkoutMenuItem: false,
            editWorkoutMenuItem: false,
            newScoreMenuItem: false,
            editScoreMenuItem: false,
            share: store
        }
    },
    methods: {
        showDialog: function(type, edit) {
            logger.debug("ContextMenu.vue :: showDialog() :: triggered");
            switch(type) {
                case "workout":
                    this.share.state.app.workoutDialog = true;
                    this.editWorkoutDialog = edit;
                    break;
                case "score":
                    this.share.state.app.scoreDialog = true;
                    this.editScoreDialog = edit;
                    break;
                default:
                    logger.debug("ContextMenu.vue :: showDialog() :: No valid type");
            }
        },
        toggleContextMenu: function(event) {
            logger.debug("ContextMenu.vue :: toggleContextMenu() :: triggered");
            if(this.share.state.app.contextMenu) {
                this.share.state.app.contextMenu = false;
            } else {
                this.share.state.app.contextMenu = true;
                this.newWorkoutMenuItem = false;
                this.editWorkoutMenuItem = false;
                this.newScoreMenuItem = false;
                this.editScoreMenuItem = false;
                // Enable/Disable buttons
                let workoutId = this.share.getActiveWorkoutId();
                if(workoutId != -1) { // edit workout is possible
                    // Allow editing only if userId > 1
                    // hide edit workout button, because its a main workout.
                    let index = this.share.getActiveWorkoutIndex()
                    if(this.share.state.workouts[index].userId > 1) {
                        this.editWorkoutMenuItem = true
                    }
                    if(this.share.getSelectedScoreId(workoutId) != -1) { // edit workout score is possible
                        this.editScoreMenuItem = true;
                    } else { // new score is possible
                        this.newScoreMenuItem = true;
                    }
                } else { // new workout is possible only
                    this.newWorkoutMenuItem = true;
                }
            }
            event.stopPropagation();
        }
    },
    components: {
        WorkoutDialog,
        ScoreDialog
    }
}
</script>

<style lang="css" scoped>
#context-menu {
    bottom: 74px;
    right: 90px;
}
#btn-menu {
    bottom:20px;
    right: 20px;
}
</style>
