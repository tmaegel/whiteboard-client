'use strict';

import Vue from 'vue';

import * as logger from "./logger.js";
import * as arrayHelper from "./array.js";
import * as timeHelper from "./time.js";
import * as regexHelper from "./regex.js";
import * as workoutHelper from "./workoutHelper.js";
import * as scoreHelper from "./scoreHelper.js";

let store;
export default store = {
    state: {
        app: {
            searchbar: false, // if true show searchbar
            context: false, // if true shoe context menu
            currentView: "home",
            previousWiew: "home"
        },
        user: {
            user: "",
            password: "",
            token: null,
            logout: true
        },
        dialog: {
            workout: {
                seen: false,
                edit: false,
                name: "",
                description: ""
            },
            score: {
                seen: false,
                edit: false,
                score: "",
                datetime: "",
                note: "",
                rx: false
            }
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
     * Gerneral
     *******************************/
    showLoader() {
        logger.debug("store.js :: showLoader() :: triggered");
        this.state.app.previousWiew = this.state.app.currentView;
        this.state.app.currentView = "loader";
    },
    hideLoader() {
        logger.debug("store.js :: hideLoader() :: triggered");
        this.state.app.currentView = this.state.app.previousWiew;
        this.hideDialog();
    },
    hideContextMenu() {
        logger.debug("store.js :: hideContextMenu() :: triggered");
        this.state.app.context = false;
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
        //this.state.dialog.workout.validName = true;
        //this.state.dialog.workout.validDescription = true;
        this.state.dialog.score.validScore = true;
        this.state.dialog.score.validDatetime = true;
        this.state.dialog.score.validNote = true;
    },
    showWorkoutDialog(edit) {
        logger.debug("store.js :: showWorkoutDialog() :: triggered");
        this.hideDialog();
        if(edit) { // edit workout dialog
            this.state.dialog.workout.edit = true;
            let workout = this.getActiveWorkout();
            if(workout == null || workout == undefined) {
                logger.error("store.js :: showWorkoutDialog() :: ERROR: No active workout found");
            } else {
                this.state.dialog.workout.name = workout.name;
                this.state.dialog.workout.description = workout.description;
            }
        } else { // add workout dialog
            this.state.dialog.workout.edit = false;
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
        if(edit) { // edit workout score dialog
            this.state.dialog.workout.edit= true;
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
            this.state.dialog.workout.edit = false;
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
     * Equipment specific
     *******************************/
    setEquipment(data) {
        logger.debug("store.js :: setEquipment() :: triggered with " + JSON.stringify(data));
        this.state.equipment = data;
    },
    /******************************
     * Movement specific
     *******************************/
    setMovements(data) {
        logger.debug("store.js :: setMovements() :: triggered with " + JSON.stringify(data));
        this.state.movements = data;
    },
    /******************************
     * Workout specific
     *******************************/
    setWorkouts(data) {
        logger.debug("store.js :: setWorkouts() :: triggered with " + JSON.stringify(data));
        // Initialize active property
        for(let workoutIndex in data) {
            data[workoutIndex].active = false;
            data[workoutIndex].score = [];
        }
        this.state.workouts = data;
    },
    setWorkout(data) {
        logger.debug("store.js :: setWorkout() :: triggered with " + JSON.stringify(data));
        data.active = false;
        data.score = [];
        this.state.workouts.push(data);
    },
    setWorkoutByIndex(data, workoutIndex) {
        logger.debug("store.js :: setWorkoutByIndex() :: triggered with " + JSON.stringify(data) + "(" + workoutIndex + ")");
        // Initialize active property
        data.active = false;
        data.score = [];
        Vue.set(this.state.workouts, workoutIndex, data);
    },
    activateWorkout(workoutId) {
        logger.debug("store.js :: activateWorkout() :: triggered with " + workoutId);
        this.state.workouts.map((workout) => {
            workout.id === workoutId ? workout.active = true : workout.active = false;
        });
    },
    deactivateWorkout(workoutId) {
        logger.debug("store.js :: deactivateWorkout() :: triggered with " + workoutId);
        this.state.workouts.map((workout) => {
            workout.active = false;
        });
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
    setScoresByIndex(data, workoutIndex) {
        logger.debug("store.js :: setScoresByIndex() :: triggered with " + JSON.stringify(data) + "(" + workoutIndex + ")");
        // Initialize selected property
        for(let scoreIndex in data) {
            data[scoreIndex].selected = false;
        }
        Vue.set(this.state.workouts[workoutIndex], 'score', data);
    },
    setScore(data, workoutIndex) {
        logger.debug("store.js :: setScore() :: triggered with " + JSON.stringify(data) + "(" + workoutIndex + ")");
        data.selected = false;
        this.state.workouts[workoutIndex].score.push(data);
    },
    setScoreByIndex(data, workoutIndex, scoreIndex) {
        logger.debug("store.js :: setScoresByIndex() :: triggered with " + JSON.stringify(data) + "(" + workoutIndex + "," + scoreIndex + ")");
        data.selected = false;
        Vue.set(this.state.workouts[workoutIndex].score, scoreIndex, data);
    },
    selectScore(workoutId, scoreId) {
        logger.debug("store.js :: selectScore() :: triggered with " + workoutId + "," + scoreId);
        this.state.workouts.map((workout) => {
            if(workout.id === workoutId) {
                workout.score.map((score) => {
                    score.id === scoreId ? score.selected = true : score.selected = false;
                });
            }
        });
    },
    unselectScore(workoutId, scoreId) {
        logger.debug("store.js :: unselectScore() :: triggered with " + workoutId + "," + scoreId);
        this.state.workouts.map((workout) => {
            if(workout.id === workoutId) {
                workout.score.map((score) => {
                    score.selected = false;
                });
            }
        });
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
