<template>
    <div>
        <div v-if="share.state.dialog.workout.seen && !share.state.user.logout" class="dialog">
             <div class="dialog-content">
                <h5>{{ getTitle }}</h5>
                <input v-model="share.state.dialog.workout.name" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validName }" type="text" placeholder="Workout name">
                <textarea v-model="share.state.dialog.workout.description" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validDescription }" rows="7" placeholder="Workout description">{{ share.state.dialog.workout.description }}</textarea>
             </div>
        </div>
        <DialogButton
            v-bind:valid="isValid"
        ></DialogButton>
    </div>
</template>

<script>
import store from '../store.js';
import DialogButton from './DialogButton.vue';
import * as regexHelper from "../regex.js";

export default {
    name: 'WorkoutDialog',
    data: function () {
        return {
            validName: true,
            validDescription: true,
            share: store
        }
    },
    computed: {
        getTitle: function() {
            if(this.share.state.dialog.workout.edit) {
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
            if(regexHelper.simpleRegex(this.share.state.dialog.workout.name) && !regexHelper.empty(this.share.state.dialog.workout.name)) {
                this.validName = true;
            } else {
                this.validName = false;
            }
            if(regexHelper.extendedRegex(this.share.state.dialog.workout.description) && !regexHelper.empty(this.share.state.dialog.workout.description)) {
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
