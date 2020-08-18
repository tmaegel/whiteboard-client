<template>
    <div>
        <div v-if="share.state.app.scoreDialog && !share.state.user.logout" class="dialog">
            <div class="dialog-content">
                <h5>{{ getTitle }}</h5>
                <input v-model="score" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validScore }" type="text" placeholder="Score">
                <input v-model="datetime" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validDatetime }" type="text" placeholder="dd.mm.YYYY HH:MM">
                <textarea v-model="note" v-on:keyup="validateInput()" v-bind:class="{ invalid: !validNote }" rows="3" placeholder="Note">{{ note }}</textarea>
                <label class="chbx-container">Rx
                    <input type="checkbox" v-model="rx">
                    <span class="checkmark"></span>
                </label>
            </div>
        </div>
        <DialogButton
            v-bind:dialogType="type"
            v-bind:valid="isValid"
            v-bind:object="{
                score: score,
                datetime: datetime,
                note: note,
                rx: rx
            }"
        ></DialogButton>
    </div>
</template>

<script>
import store from '../store.js';
import DialogButton from './DialogButton.vue';
import * as logger from "../logger.js";
import * as regexHelper from "../regex.js";
import * as timeHelper from "../time.js";

export default {
    name: 'ScoreDialog',
    props: ['edit'],
    data: function () {
        return {
            type: "score",
            score: "",
            datetime: "",
            note: "",
            rx: false,
            validScore: true,
            validDatetime: true,
            validNote: true,
            share: store
        }
    },
    watch: {
        'share.state.app.scoreDialog': function() {
            logger.debug("ScoreDialog.vue :: watch() scoreDialog :: triggered");
            if(this.share.state.app.scoreDialog) {
                logger.debug("ScoreDialog.vue :: watch() scoreDialog :: dialog becomes visible");
                if(this.edit) { // edit workout score dialog
                    let workoutId = this.share.getActiveWorkoutId();
                    if(workoutId != -1) {
                        let score = this.share.getSelectedScore(workoutId);
                        if(score == null || score == undefined) {
                            logger.error("ScoreDialog.vue :: watch() scoreDialog :: ERROR: No selected score found");
                        } else {
                            this.score = score.score;
                            if(score.rx == 1) {
                                this.rx = true;
                            } else {
                                this.rx = false;
                            }
                            this.datetime = timeHelper.getShortFormatTimestamp(score.datetime);
                            this.note = score.note;
                        }
                    } else {
                        logger.error("ScoreDialog.vue :: watch() scoreDialog :: ERROR: No active workout found");
                    }
                } else { // add workout dialog
                    this.score = "";
                    this.datetime = timeHelper.getShortFormatTimestamp();
                    this.note = "";
                    this.rx = false;
                }
            }
        }
    },
    computed: {
        getTitle: function() {
            if(this.edit) {
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
            if(regexHelper.numRegex(this.score) ||
               regexHelper.floatRegex(this.score) ||
               regexHelper.timestampRegex(this.score)) {
                this.validScore = true;
            } else {
                this.validScore = false;
            }
            if(regexHelper.datetimeRegex(this.datetime)) {
                this.validDatetime = true;
            } else {
                this.validDatetime = false;
            }
            if(regexHelper.extendedRegex(this.note)) {
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
