<template>
    <div>
        <div v-if="share.state.app.context && !share.state.user.logout" id="dropdown-menu">
            <span v-if="newWorkoutMenuItem" v-on:click="share.showWorkoutDialog(false)" id="btn-new-workout" href="#">Add workout</span>
            <span v-if="editWorkoutMenuItem" v-on:click="share.showWorkoutDialog(true)" id="btn-edit-workout" href="#">Edit workout</span>
            <span v-if="newScoreMenuItem" v-on:click="share.showScoreDialog(false)" id="btn-new-score" href="#">Add score</span>
            <span v-if="editScoreMenuItem" v-on:click="share.showScoreDialog(true)" id="btn-edit-score" href="#">Edit score</span>
            </div>
        <button v-if="!share.state.dialog.workout.seen && !share.state.dialog.score.seen && !share.state.user.logout" v-on:click="toggleContextMenu" id="btn-menu" class="btn-overlay">
            <svg id="btn-menu-svg" class="icon icon-menu"><use xlink:href="#icon-menu"></use></svg><span class="mls"></span>
        </button>
    </div>
</template>

<script>
import store from '../store.js';

export default {
    name: 'ContextMenu',
    data: function () {
        return {
            newWorkoutMenuItem: false,
            editWorkoutMenuItem: false,
            newScoreMenuItem: false,
            editScoreMenuItem: false,
            share: store
        }
    },
    methods: {
        toggleContextMenu: function(event) {
            if(this.share.state.app.context) {
                this.share.state.app.context = false;
            } else {
                this.share.state.app.context = true;
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
}
</script>

<style lang="css" scoped>
#btn-menu {
    bottom:20px;
    right: 20px;
}
#dropdown-menu {
    position: fixed;
    background-color: #eee;
    bottom: 74px;
    right: 90px;
    box-shadow: 0px 0px 6px 4px rgba(0,0,0,0.12);
    z-index: 1;
    border-radius: 5%;
}
#dropdown-menu span {
    cursor: pointer;
    color: gray;
    padding: 10px 16px;
    text-decoration: none;
    display: block;
}
#dropdown-menu span:hover {
    background-color: #ddd;
}
#dropdown-menu span:first-child:hover {
    border-top-right-radius: 5%;
    border-top-left-radius: 5%;
}
#dropdown-menu span:last-child:hover {
    border-bottom-right-radius: 5%;
    border-bottom-left-radius: 5%;
}
</style>
