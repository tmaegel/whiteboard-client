<template>
    <div>
        <div v-if="share.state.dialog.score.seen && !share.state.user.logout" class="dialog">
            <div class="dialog-content">
                <h5>{{ getTitle }}</h5>
                <input v-model="share.state.dialog.score.score" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validScore }" type="text" placeholder="Score">
                <input v-model="share.state.dialog.score.datetime" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validDatetime }" type="text" placeholder="dd.mm.YYYY HH:MM">
                <textarea v-model="share.state.dialog.score.note" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validNote }" rows="3" placeholder="Note">{{ share.state.dialog.score.note }}</textarea>
                <label class="chbx-container">Rx
                    <input type="checkbox" v-model="share.state.dialog.score.rx">
                    <span class="checkmark"></span>
                </label>
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
    name: 'ScoreDialog',
    data: function () {
        return {
            validScore: true,
            validDatetime: true,
            validNote: true,
            share: store
        }
    },
    computed: {
        getTitle: function() {
            if(this.share.state.dialog.score.edit) {
                return "Edit workout score";
            } else {
                return "New workout score";
            }
        },
        isValid: function() {
            let valid = (this.validScore && this.validDatetime && this.validNote);
            return valid;
        }
    },
    methods: {
        validateInput() {
            if(regexHelper.numRegex(this.share.state.dialog.score.score) ||
               regexHelper.floatRegex(this.share.state.dialog.score.score) ||
               regexHelper.timestampRegex(this.share.state.dialog.score.score)) {
                this.validScore = true;
            } else {
                this.validScore = false;
            }
            if(regexHelper.datetimeRegex(this.share.state.dialog.score.datetime)) {
                this.validDatetime = true;
            } else {
                this.validDatetime = false;
            }
            if(regexHelper.simpleRegex(this.share.state.dialog.score.note)) {
                this.validNote = true;
            } else {
                this.validNote = false;
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
