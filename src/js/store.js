'use strict';

import Vue from 'vue';

import * as logger from "./logger.js";
import * as arrayHelper from "./array.js";
import * as timeHelper from "./time.js";
import * as regexHelper from "./regex.js";
import * as workoutHelper from "./workoutHelper.js";
import * as scoreHelper from "./scoreHelper.js";

let timer, store;
export default store = {
    state: {
        user: {
            user: "",
            password: "",
            token: null,
            logout: true
        },
        search: {
            seen: false,
            value: ""
        },
        dialog: {
            workout: {
                seen: false,
                title: "",
                validName: true,
                validDescription: true,
                name: "",
                description: ""
            },
            score: {
                seen: false,
                title: "",
                validScore: true,
                validDatetime: true,
                validNote: true,
                score: "",
                datetime: "",
                note: "",
                rx: false
            }
        },
        context: {
            seen: false,
            newWorkout: false,
            editWorkout: false,
            newScore: false,
            editScore: false
        },
        equipment: [],
        movements: [],
        workouts: [],
    },
    /******************************
     * User specific / login dialog
     *******************************/
    login() {
        logger.debug("store.js :: login() :: triggered");
        this.state.user.logout = false;
    },
    logout() {
        logger.debug("store.js :: logout() :: triggered");
        this.state.user.logout = true;
    },
    setToken(value) {
        logger.debug("store.js :: setToken() :: triggered");
        this.state.user.token = value;
        this.login();
    },
    getUserObject() {
        logger.debug("store.js :: getUserObject() :: triggered");
        return this.state.user;
    },
    /******************************
     * Searchbar specific
     *******************************/
    showSearchBar() {
        logger.debug("store.js :: showSearchBar() :: triggered");
        this.state.search.seen = true;
    },
    hideSearchBar() {
        logger.debug("store.js :: hideSearchBar() :: triggered");
        this.resetSearchBar();
        this.showAllWorkouts();
        this.state.search.seen = false;
    },
    toggleSearchBar() {
        logger.debug("store.js :: toggleSearchBar() :: triggered");
        if(this.state.search.seen) {
            this.hideSearchBar();
        } else {
            this.showSearchBar();
        }
    },
    resetSearchBar() {
        this.state.search.value = "";
    },
    doSearch() {
        logger.debug("store.js :: doSearch() :: triggered with " + this.state.search.value);
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            for(let workoutIndex in this.state.workouts) {
                if (this.state.workouts[workoutIndex].name.toLowerCase().includes(this.state.search.value)) { // case insensitive
                    this.showWorkout(workoutIndex);
                } else {
                    this.hideWorkout(workoutIndex);
                }
            }
        }.bind(this), 1000);
    },
    /******************************
     * Dialog specific
     *******************************/
    applyDialog() {
        logger.debug("store.js :: applyDialog() :: triggered");
        let workoutId = this.getActiveWorkoutId();
        if(workoutId != -1) {
            if(this.state.dialog.workout.seen && !this.state.dialog.score.seen) {
                workoutHelper.saveWorkout();
            } else if(this.state.dialog.score.seen && !this.state.dialog.workout.seen) {
                scoreHelper.saveWorkoutScore();
            } else {
                logger.log("store.js :: applyDialog() :: ERROR: No action defined.");
            }
        } else {
            workoutHelper.saveWorkout();
        }
    },
    hideDialog() {
        logger.debug("store.js :: hideDialog() :: triggered");
        this.state.dialog.workout.seen = false;
        this.state.dialog.score.seen = false;
        this.state.dialog.workout.validName = true;
        this.state.dialog.workout.validDescription = true;
        this.state.dialog.score.validScore = true;
        this.state.dialog.score.validDatetime = true;
        this.state.dialog.score.validNote = true;
    },
    validateWorkoutInput() {
        logger.debug("store.js :: validateWorkoutInput() :: triggered");
        if(regexHelper.simpleRegex(this.state.dialog.workout.name)) {
            this.state.dialog.workout.validName = true;
        } else {
            logger.debug("store.js :: validateWorkoutInput() :: invalid input detected");
            this.state.dialog.workout.validName = false;
        }
        if(regexHelper.extendedRegex(this.state.dialog.workout.description)) {
            this.state.dialog.workout.validDescription = true;
        } else {
            this.state.dialog.workout.validDescription = false;
            logger.debug("store.js :: validateWorkoutInput() :: invalid input detected");
        }
    },
    validateScoreInput() {
        logger.debug("store.js :: validateScoreInput() :: triggered");
        if(regexHelper.numRegex(this.state.dialog.score.score) || regexHelper.floatRegex(this.state.dialog.score.score) || regexHelper.timestampRegex(this.state.dialog.score.score)) {
            this.state.dialog.score.validScore = true;
        } else {
            logger.debug("store.js :: validateScoreInput() :: invalid input detected");
            this.state.dialog.score.validScore = false;
        }
        if(regexHelper.datetimeRegex(this.state.dialog.score.datetime)) {
            this.state.dialog.score.validDatetime = true;
        } else {
            this.state.dialog.score.validDatetime = false;
            logger.debug("store.js :: validateScoreInput() :: invalid input detected");
        }
        if(regexHelper.simpleRegex(this.state.dialog.score.note)) {
            this.state.dialog.score.validNote = true;
        } else {
            this.state.dialog.score.validNote = false;
            logger.debug("store.js :: validateScoreInput() :: invalid input detected");
        }
    },
    showWorkoutDialog(edit) {
        logger.debug("store.js :: showWorkoutDialog() :: triggered");
        this.hideDialog();
        if(edit) { // edit workout dialog
            this.state.dialog.workout.title = "Edit workout";
            let workout = this.getActiveWorkout();
            if(workout == null || workout == undefined) {
                logger.error("store.js :: showWorkoutDialog() :: ERROR: No active workout found");
            } else {
                this.state.dialog.workout.name = workout.name;
                this.state.dialog.workout.description = workout.description;
            }
        } else { // add workout dialog
            this.state.dialog.workout.title = "Add workout";
            this.state.dialog.workout.name = "";
            this.state.dialog.workout.description =  "";
        }
        this.state.dialog.workout.seen = true;
    },
    getWorkoutDialogObject() {
        logger.debug("store.js :: getWorkoutDialogObject() :: triggered");
        let dialogWorkout = {
            name: this.state.dialog.workout.name,
            description: this.state.dialog.workout.description
        };
        return dialogWorkout;
    },
    showScoreDialog(edit) {
        logger.debug("store.js :: showScoreDialog() :: triggered");
        this.hideDialog();
        if(edit) { // edit workout dialog
            this.state.dialog.score.title = "Edit workout score";
            let workoutId = this.getActiveWorkoutId();
            if(workoutId != -1) {
                let score = this.getSelectedScore(workoutId);
                if(score == null || score == undefined) {
                    logger.error("store.js :: showScoreDialog() :: ERROR: No selected score found");
                } else {
                    this.state.dialog.score.score = score.score;
                    if(score.rx == 1) {
                        this.state.dialog.score.rx = true;
                    } else {
                        this.state.dialog.score.rx = false;
                    }
                    this.state.dialog.score.datetime = timeHelper.getShortFormatTimestamp(score.datetime);
                    this.state.dialog.score.note = score.note;
                }
            } else {
                logger.error("store.js :: showScoreDialog() :: ERROR: No active workout found");
            }
        } else { // add workout dialog
            this.state.dialog.score.title = "Add workout score";
            this.state.dialog.score.score = "";
            this.state.dialog.score.datetime = timeHelper.getShortFormatTimestamp();
            this.state.dialog.score.note = "";
            this.state.dialog.score.rx = false;
        }
        this.state.dialog.score.seen = true;
    },
    getScoreDialogObject() {
        logger.debug("store.js :: getScoreDialogObject() :: triggered");
        let dialogScore = {
            score: this.state.dialog.score.score,
            datetime: this.state.dialog.score.datetime,
            note: this.state.dialog.score.note,
            rx: this.state.dialog.score.rx
        };
        return dialogScore;
    },
    /******************************
     * Context menu specific
     *******************************/
    toggleContextMenu(event) {
        logger.debug("store.js :: toggleContextMenu() :: triggered");
        if(this.state.context.seen) {
            this.hideContextMenu();
        } else {
            this.showContextMenu();
        }
    },
    showContextMenu() {
        logger.debug("store.js :: showContextMenu() :: triggered");
        this.state.context.seen = true;
        this.state.context.newWorkout = false;
        this.state.context.editWorkout = false;
        this.state.context.newScore = false;
        this.state.context.editScore = false;
        // Enable/Disable buttons
        let workoutId = this.getActiveWorkoutId();
        if(workoutId != -1) { // edit workout is possible
            // Allow editing only if userId > 1
            // hide edit workout button, because its a main workout.
            let index = this.getActiveWorkoutIndex()
            if(this.state.workouts[index].userId > 1) {
                this.state.context.editWorkout = true
            }
            if(this.getSelectedScoreId(workoutId) != -1) { // edit workout score is possible
                this.state.context.editScore = true;
            } else { // new score is possible
                this.state.context.newScore = true;
            }
        } else { // new workout is possible only
            this.state.context.newWorkout = true;
        }
    },
    hideContextMenu() {
        logger.debug("store.js :: hideContextMenu() :: triggered");
        this.state.context.seen = false;
    },
    /******************************
     * Equipment specific
     *******************************/
    setEquipment(value) {
        logger.debug("store.js :: setEquipment() :: triggered with " + JSON.stringify(value));
        this.state.equipment = value;
    },
    /******************************
     * Movement specific
     *******************************/
    setMovements(value) {
        logger.debug("store.js :: setMovements() :: triggered with " + JSON.stringify(value));
        this.state.movements = value;
    },
    /******************************
     * Workout specific
     *******************************/
    setWorkouts(value) {
        logger.debug("store.js :: setWorkouts() :: triggered with " + JSON.stringify(value));
        this.state.workouts = value;
    },
    setWorkoutByIndex(value, workoutIndex) {
        logger.debug("store.js :: setWorkoutByIndex() :: triggered with " + JSON.stringify(value) + "(" + workoutIndex + ")");
        Vue.set(this.state.workouts, workoutIndex, value);
    },
    activateWorkout(workoutId) {
        //logger.debug("store.js :: activateWorkout() :: triggered with " + workoutId);
        let index = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
        Vue.set(this.state.workouts[index], 'active', true);
    },
    deactivateWorkout(workoutId) {
        //logger.debug("store.js :: deactivateWorkout() :: triggered with " + workoutIndex);
        let index = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
        Vue.set(this.state.workouts[index], 'active', false);
    },
    /**
     * Returns the id of active workout object.
     * If no workout is active returns -1
     * @returns {integer} id
     */
    getActiveWorkoutId() {
        logger.debug("store.js :: getActiveWorkoutId() :: triggered");
        for(let workout of this.state.workouts) {
            if(workout.active) {
                return workout.id;
            }
        }
        return -1
    },
    /**
     * Returns the active workout object.
     * If no workout is active returns null
     * @returns {integer} id
     */
    getActiveWorkout() {
        logger.debug("store.js :: getActiveWorkout() :: triggered");
        let id = this.getActiveWorkoutId();
        if(id != -1) {
            return arrayHelper.getArrayObjectById(store.state.workouts, id);
        }
        return null;
    },
    /**
     * Returns the array index of active workout object.
     * If no workout is active returns -1
     * @returns {integer} id
     */
    getActiveWorkoutIndex() {
        logger.debug("store.js :: getActiveWorkoutIndex() :: triggered");
        let id = this.getActiveWorkoutId();
        if(id != -1) {
            return arrayHelper.getArrayIndexById(store.state.workouts, id);
        }
        return -1;
    },
    hideWorkout(workoutIndex) {
        // logger.debug("store.js :: hideWorkout() :: triggered with " + workoutIndex);
        Vue.set(this.state.workouts[workoutIndex], 'seen', false);
    },
    showWorkout(workoutIndex) {
        //logger.debug("store.js :: showWorkout() :: triggered with " + workoutIndex);
        Vue.set(this.state.workouts[workoutIndex], 'seen', true);
    },
    hideAllWorkout() {
        logger.debug("store.js :: hideAllWorkout() :: triggered");
        for(let workoutIndex in this.state.workouts) {
            this.hideWorkout(workoutIndex);
        }
    },
    showAllWorkouts() {
        logger.debug("store.js :: showAllWorkout() :: triggered");
        for(let workoutIndex in this.state.workouts) {
            this.showWorkout(workoutIndex);
        }
    },
    /******************************
     * Score specific
     *******************************/
    /*setScores(value) {
        logger.debug("store.js :: setScores() :: triggered with " + value);
        this.state.scores = JSON.parse(value);
    },*/
    setScoresByIndex(value, workoutIndex) {
        logger.debug("store.js :: setScoresByIndex() :: triggered with " + JSON.stringify(value) + "(" + workoutIndex + ")");
        Vue.set(this.state.workouts[workoutIndex], 'score', value);
    },
    setScoreByIndex(value, workoutIndex, scoreIndex) {
        logger.debug("store.js :: setScoresByIndex() :: triggered with " + JSON.stringify(value) + "(" + workoutIndex + "," + scoreIndex + ")");
        Vue.set(this.state.workouts[workoutIndex].score, scoreIndex, value);
    },
    selectScore(workoutIndex, scoreIndex) {
        logger.debug("store.js :: selectScore() :: triggered with " + workoutIndex + "," + scoreIndex);
        Vue.set(this.state.workouts[workoutIndex].score[scoreIndex], 'selected', true);
    },
    unselectScore(workoutIndex, scoreIndex) {
        logger.debug("store.js :: unselectScore() :: triggered with " + workoutIndex + "," + scoreIndex);
        Vue.set(this.state.workouts[workoutIndex].score[scoreIndex], 'selected', false);
    },
    /**
     * If score item is selected returns the id of item
     * If not returns -1
     * @param {integer} workoutId of workout object
     * @returns {integer} id
     */
    getSelectedScoreId(workoutId) {
        logger.debug("store.js :: getSelectedScoreId() :: triggered with " + workoutId);
        if(workoutId >= 0) {
            let index = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
            if(this.state.workouts[index].score != null || this.state.workouts[index].score != undefined) {
                for(let score of this.state.workouts[index].score) {
                    if(score.selected) {
                        return score.id;
                    }
                }
            }
        }
        return -1;
    },
    /**
     * Returns the selected score object.
     * If no score is seclected returns null
     * @param {integer} workoutId of workout object
     * @returns {integer} id
     */
    getSelectedScore(workoutId) {
        logger.debug("store.js :: getSelectedScore() :: triggered with " + workoutId);
        if(workoutId >= 0) {
            let index = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
            if(this.state.workouts[index].score != null || this.state.workouts[index].score != undefined) {
                let id = this.getSelectedScoreId(workoutId);
                if(id != -1) {
                    return arrayHelper.getArrayObjectById(this.state.workouts[index].score, id);
                }
            }
        }
        return null;
    },
    /**
     * Returns the array index of selected score object.
     * If no score is selected returns -1
     * @param {integer} workoutId of workout object
     * @returns {integer} id
     */
    getSelectedScoreIndex(workoutId) {
        logger.debug("store.js :: getSelectedScoreIndex() :: triggered with " + workoutId);
        if(workoutId >= 0) {
            let index = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
            if(this.state.workouts[index].score != null || this.state.workouts[index].score != undefined) {
                let id = this.getSelectedScoreId(workoutId);
                if(id != -1) {
                    return arrayHelper.getArrayIndexById(this.state.scores, id);
                }
            }
        }
        return -1;
    }
};
