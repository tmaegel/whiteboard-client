<template>
    <div>
         <button v-if="valid && isVisible" v-on:click="apply()" class="btn-overlay" id="btn-ok">
             <svg class="icon icon-checkmark"><use xlink:href="#icon-checkmark"></use></svg><span class="mls"></span>
         </button>
         <button v-if="isVisible" v-on:click="share.hideDialog()" class="btn-overlay" id="btn-cancel">
             <svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg><span class="mls"></span>
         </button>
    </div>
</template>

<script>
import store from '../store.js';
import * as logger from "../logger.js";
import * as workoutHelper from "../workoutHelper.js";
import * as scoreHelper from "../scoreHelper.js";

export default {
    name: 'DialogButton',
    props: ['dialogType', 'valid', 'object'],
    data: function () {
        return {
            share: store
        }
    },
    computed: {
        isVisible: function() {
            if(this.dialogType === "workout") {
                return (this.share.state.app.workoutDialog && !this.share.state.user.logout);
            } else if(this.dialogType === "score") {
                return (this.share.state.app.scoreDialog && !this.share.state.user.logout);
            } else {
                return false;
            }
            return visible;
        }
    },
    methods: {
        apply: function() {
            logger.debug("DialogButton.vue :: apply() :: triggered with type: " + this.dialogType);
            let workoutId = this.share.getActiveWorkoutId();
            if(workoutId != -1) {
                if(this.share.state.app.workoutDialog && !this.share.state.app.scoreDialog) {
                    workoutHelper.saveWorkout(this.object);
                } else if(this.share.state.app.scoreDialog && !this.share.state.app.workoutDialog) {
                    scoreHelper.saveWorkoutScore(this.object);
                } else {
                    logger.log("DialogButton.vue :: apply() :: ERROR: No action defined.");
                }
            } else {
                workoutHelper.saveWorkout(this.object);
            }
        }
    }
}
</script>

<style lang="css" scoped>
#btn-ok {
    bottom:90px;
    right: 20px;
}
#btn-cancel {
    bottom:20px;
    right: 20px;
}
</style>
