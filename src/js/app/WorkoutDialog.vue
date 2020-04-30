<template>
    <div>
        <div v-if="share.state.app.workoutDialog && !share.state.user.logout" class="dialog">
             <div class="dialog-content">
                <h5>{{ getTitle }}</h5>
                <input v-model="name" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validName }" type="text" placeholder="Workout name">
                <textarea v-model="description" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validDescription }" rows="7" placeholder="Workout description">{{ description }}</textarea>
             </div>
        </div>
        <DialogButton
            v-bind:dialogType="type"
            v-bind:valid="isValid"
            v-bind:object="{
                name: name,
                description: description
            }"
        ></DialogButton>
    </div>
</template>

<script>
import store from '../store.js';
import DialogButton from './DialogButton.vue';
import * as logger from "../logger.js";
import * as regexHelper from "../regex.js";

export default {
    name: 'WorkoutDialog',
    props: ['edit'],
    data: function () {
        return {
            type: "workout",
            name: "",
            description: "",
            validName: true,
            validDescription: true,
            share: store
        }
    },
    watch: {
        'share.state.app.workoutDialog': function() {
            logger.debug("WorkoutDialog.vue :: watch() workoutDialog :: triggered");
            if(this.share.state.app.workoutDialog) {
                logger.debug("WorkoutDialog.vue :: watch() workoutDialog :: dialog becomes visible");
                if(this.edit) { // edit workout mode
                    let workout = this.share.getActiveWorkout();
                    if(workout == null || workout == undefined) {
                        logger.error("WorkoutDialog.vue :: watch - workoutDialog :: ERROR: No active workout found");
                    } else {
                        this.name = workout.name;
                        this.description = workout.description;
                    }
                } else { // add workout mod
                    this.name = "";
                    this.description =  "";
                }
            }
        }
    },
    computed: {
        getTitle: function() {
            if(this.edit) {
                return "Edit workout";
            } else {
                return "New workout";
            }
        },
        isValid: function() {
            let valid = (this.validName && this.validDescription);
            return valid;
        }
    },
    methods: {
        validateInput() {
            if(regexHelper.simpleRegex(this.name) && !regexHelper.empty(this.name)) {
                this.validName = true;
            } else {
                this.validName = false;
            }
            if(regexHelper.extendedRegex(this.description) && !regexHelper.empty(this.description)) {
                this.validDescription = true;
            } else {
                this.validDescription = false;
            }
        },
    },
    components: {
        DialogButton
    }
}
</script>

<style lang="css" scoped>
</style>
