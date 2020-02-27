'use strict';

import * as logger from "./logger.js";
import * as main from "./main.js";
import * as arrayHelper from "./array.js";
import * as config from "./config.js";
import * as cookie from "./cookie.js";
import * as guiHelper from "./gui.js";
import * as timeHelper from "./time.js";
import * as notification from "./notification.js";

import * as workoutHelper from "./workoutHelper.js";
import * as scoreHelper from "./scoreHelper.js";
import * as movementHelper from "./movementHelper.js";
import * as equipmentHelper from "./equipmentHelper.js";

let workoutComponent = Vue.component('workout-component', {
    props: ['workoutIndex', 'workout'],
    methods: {
        toggleWorkoutCard: function() {
            let state = this.workout.active;
            for(let index in app.workouts) {
                Vue.set(app.workouts[index], 'active', false);
            }
            if(!state) {
                Vue.set(app.workouts[this.workoutIndex], 'active', true);
                restGetWorkoutScores(this.workout.id);
            }
        },
        getWorkoutDescription: function(text) {
            return text.toString().replace(new RegExp('\r?\n','g'), "<br />");
        },
        getFormatTimestamp: function(datetime) {
            return timeHelper.getFormatTimestamp(datetime);
        },
    },
    template: '<li class="card workout"> \
        <div v-on:click="toggleWorkoutCard" class="card-header collapsible"> \
            <h4>{{ workout.name }}</h4> \
        </div> \
        <div v-if="workout.active" class="card-content"> \
            <div class="card-body"> \
                <p v-html="getWorkoutDescription(workout.description)"></p> \
                <p><small>{{ getFormatTimestamp(workout.datetime) }}</small></p> \
            </div> \
            <div> \
                <table> \
                    <tr is="score-component" \
                        v-for="(scoreItem, scoreIndex) in workout.score" \
                        v-bind:key="scoreItem.id" \
                        v-bind:score-index="scoreIndex" \
                        v-bind:score="scoreItem" \
                        v-bind:workout-index="workoutIndex" \
                    ></tr> \
                </table> \
            </div> \
        </div> \
    </li>'
});

let scoreComponent = Vue.component('score-component', {
    props: ['scoreIndex', 'score', 'workoutIndex'],
    methods: {
        toggleScoreItem: function(workoutIndex, scoreIndex) {
            let state = app.workouts[this.workoutIndex].score[this.scoreIndex].selected;
            for(let index in app.workouts[this.workoutIndex].score) {
                Vue.set(app.workouts[this.workoutIndex].score[index], 'selected', false);
            }
            if(!state) {
                Vue.set(app.workouts[this.workoutIndex].score[this.scoreIndex], 'selected', true);
            }
        },
        getShortFormatTimestamp: function(datetime) {
            return timeHelper.getShortFormatTimestamp(datetime);
        },
        getRx: function() {
            if(this.score.rx) {
                return "Rx";
            } else {
                return "";
            }
        }
    },
    template: '<tr \
        v-on:click="toggleScoreItem" \
        v-bind:class="{ select: score.selected }" class="cursor"> \
         <td>{{ getRx() }}</td> \
         <td>{{ score.score }}</td> \
         <td>{{ getShortFormatTimestamp(score.datetime) }}</td> \
         <td>{{ score.note }}</td> \
     </tr>'
});

let movementComponent = Vue.component('movement-component', {
    props: ['movement'],
    template: '<li class="card movement"> \
        <div class="card-header"> \
            <h4>{{ movement.movement }}</h4> \
        </div> \
    </li>'
});

let equipmentComponent = Vue.component('equipment-component', {
    props: ['equipment'],
    template: '<li class="card equipment"> \
        <div class="card-header"> \
            <h4>{{ equipment.equipment }}</h4> \
        </div> \
    </li>'
});

// Define a new component called dialog-workout
let dialogWorkout = Vue.component('dialog-workout', {
    data: function () {
        return {
            seen: false,
            name: "",
            description: ""
        }
    },
    methods: {
        hide: function() { this.seen = false; },
        show: function() { this.seen = true; },
        open: function(edit) {
            let workout, workoutId;

            app.hideAllBtns();
            app.hideAllDialogs();
            app.hideAllViews();

            app.$refs.btnOk.show();
            app.$refs.btnClose.show();

            if(edit) { // edit workout dialog
                app.setTitle("Edit workout");
                workoutId = workoutHelper.isWorkoutCardActive();
                if (workoutId > 0) {
                    workout = arrayHelper.getArrayObjectById(app.workouts, workoutId);
                }
                if(workout == 0 || workout == -1 || workout == null || workout == undefined) {
                    logger.error("request.js :: dialogWorkout :: open() :: ERROR: No workout in array found");
                } else {
                    this.name = workout.name;
                    this.description = workout.description;
                }
            } else { // add workout dialog
                app.setTitle("Add workout");
                this.name = "";
                this.description =  "";
            }
            this.show();
        },
        getName: function() {
            return this.name;
        },
        getDescription: function() {
            return this.description;
        }
    },
    template: '<div v-if="seen" class="dialog"> \
        <input type="text" placeholder="Workout name" v-model="name"> \
        <textarea rows="5" placeholder="Workout description" v-model="description">{{ description }}</textarea> \
    </div>'
});

// Define a new component called dialog-workout-score
let dialogWorkoutScore = Vue.component('dialog-workout-score', {
    data: function () {
        return {
            seen: false,
            score: "",
            datetime: "",
            note: "",
            rx: false,
        }
    },
    methods: {
        hide: function() { this.seen = false; },
        show: function() { this.seen = true; },
        open: function(edit) {
            let workout, workoutId, score, scoreId, index;

            app.hideAllBtns();
            app.hideAllDialogs();
            app.hideAllViews();

            app.$refs.btnOk.show();
            app.$refs.btnClose.show();

            if(edit) { // edit workout dialog
                app.setTitle("Edit workout score");
                workoutId = workoutHelper.isWorkoutCardActive();
                console.log(workoutId);
                if (workoutId > 0) {
                    console.log(workoutId);
                    let workoutIndex = arrayHelper.getArrayIndexById(app.workouts, workoutId);
                    console.log(workoutIndex);
                    if(workoutIndex != null) {
                        scoreId = scoreHelper.isScoreItemSelected(workoutIndex)
                        if (scoreId > 0) {
                            score = arrayHelper.getArrayObjectById(app.workouts[workoutIndex].score, scoreId);
                        }
                        if(score == 0 || score == -1 || score == null || score == undefined) {
                            logger.error("request.js :: dialogWorkoutScore :: open() :: ERROR: No workout score in array found");
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
                        logger.error("request.js :: dialogWorkoutScore :: open() :: ERROR: No workout found in array");
                    }
                } else {
                    logger.error("request.js :: dialogWorkoutScore :: open() :: ERROR: No workout active to edit");
                }
            } else { // add workout dialog
                app.setTitle("Add workout score");
                this.score = "";
                this.datetime = timeHelper.getShortFormatTimestamp();
                this.note = "";
                this.rx = false;
            }
            this.show();
        },
        getScore: function() {
            return this.score;
        },
        getDatetime: function() {
            return this.datetime;
        },
        getNote: function() {
            return this.note;
        },
        getRx: function() {
            return this.rx;
        }
    },
    template: '<div v-if="seen" class="dialog"> \
        <input type="text" placeholder="Score" v-model="score"> \
        <input type="text" placeholder="dd.mm.YYYY HH:MM" v-model="datetime"> \
        <textarea rows="3" placeholder="Note" v-model="note">{{ note }}</textarea> \
        <label class="chbx-container">Rx \
            <input type="checkbox" v-model="rx"> \
            <span class="checkmark"></span> \
        </label> \
    </div>'
});

// Define a new component called btn-login
let btnLogin = Vue.component('btn-login', {
    data: function () {
        return {
            seen: false
        }
    },
    methods: {
        hide: function() { this.seen = false; },
        show: function() { this.seen = true; },
        toggle: function() { this.seen = !this.seen; },
        click: function() {
            console.log("click btn-login");
            restUserLogin();
        }
    },
    template: '<button v-if="seen" v-on:click="click" class="btn-overlay" style="bottom:20px;right:20px;"> \
        <svg class="icon icon-checkmark"><use xlink:href="#icon-checkmark"></use></svg><span class="mls"></span> \
    </button>'
});

// Define a new component called btn-menu
let btnMenu = Vue.component('btn-menu', {
    data: function () {
        return {
            seen: false
        }
    },
    methods: {
        hide: function() { this.seen = false; },
        show: function() { this.seen = true; },
        toggle: function() { this.seen = !this.seen; },
        click: function(event) {
            app.$refs.dropdownMenu.toggle();
            event.stopPropagation();
        }
    },
    template: '<button v-if="seen" v-on:click="click" class="btn-overlay" style="bottom:20px;right: 20px;"> \
        <svg id="btn-menu-svg" class="icon icon-menu"><use xlink:href="#icon-menu"></use></svg><span class="mls"></span> \
    </button>'
});

// Define a new component called btn-ok
let btnOk = Vue.component('btn-ok', {
    data: function () {
        return {
            seen: false
        }
    },
    methods: {
        hide: function() { this.seen = false; },
        show: function() { this.seen = true; },
        toggle: function() { this.seen = !this.seen; },
        click: function() {
            let workoutId = workoutHelper.isWorkoutCardActive();
            if(workoutId != -1) {
                if(app.$refs.dialogWorkout.seen && !app.$refs.dialogWorkoutScore.seen) {
                    workoutHelper.saveWorkout();
                } else if(app.$refs.dialogWorkoutScore.seen && !app.$refs.dialogWorkout.seen) {
                    scoreHelper.saveWorkoutScore();
                } else {
                    logger.log("main :: init() :: btn-ok :: ERROR: No action defined.");
                }
            } else {
                workoutHelper.saveWorkout();
            }
        }
    },
    template: '<button v-if="seen" v-on:click="click" class="btn-overlay" style="bottom:20px;right:20px;"> \
        <svg class="icon icon-checkmark"><use xlink:href="#icon-checkmark"></use></svg><span class="mls"></span> \
    </button>'
});

// Define a new component called btn-close
let btnClose = Vue.component('btn-close', {
    data: function () {
        return {
            seen: false
        }
    },
    methods: {
        hide: function() { this.seen = false; },
        show: function() { this.seen = true; },
        toggle: function() { this.seen = !this.seen; },
        click: function() {
            app.hideAllDialogs();
            app.showWorkoutView(); // @todo: Show view depends on active tab
        }
    },
    template: '<button v-if="seen" v-on:click="click" class="btn-overlay" style="bottom:90px;right:20px;"> \
        <svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg><span class="mls"></span> \
    </button>'
});

// Define a new component called dropdown-menu
let dropdownMenu = Vue.component('dropdown-menu', {
    data: function () {
        return {
            seen: false,
            seenNewWorkout: false,
            seenEditWorkout: false,
            seenNewScore: false,
            seenEditScore: false,
        }
    },
    methods: {
        hide: function() {
            this.seen = false;
        },
        show: function() {
            this.hideMenuItems();
            // Enable/Disable buttons
            let workoutId = workoutHelper.isWorkoutCardActive();
            if(workoutId != -1) {
                // edit workout is possible
                // Allow editing only if userId > 1
                let index = arrayHelper.getArrayIndexById(app.workouts, workoutId);
                if(index != null) {
                    if(app.workouts[index].userId > 1) {
                        this.seenEditWorkout = true
                    } else {
                        logger.debug("rest.js :: dropdownMenu - show() :: INFO: Hide edit workout button, because its a main workout.");
                    }
                    if(scoreHelper.isScoreItemSelected(index) != -1) {
                        // edit workout score is possible
                        this.seenEditScore = true;
                    } else {
                        // new score is possible
                        this.seenNewScore = true;
                    }
                }
            } else {
                // new workout is possible only
                this.seenNewWorkout = true;
            }
            this.seen = true;
        },
        toggle: function() {
            if(this.seen) {
                this.hide();
            } else {
                this.show();
            }
        },
        hideMenuItems: function() {
            this.seenNewWorkout = false;
            this.seenEditWorkout = false;
            this.seenNewScore = false;
            this.seenEditScore = false;
        },
        newWorkout: function() {
            app.$refs.dialogWorkout.open(false);
        },
        editWorkout: function() {
            app.$refs.dialogWorkout.open(true); // open edit workout dialog
        },
        newScore: function() {
            app.$refs.dialogWorkoutScore.open(false); // open add workout score dialog
        },
        editScore: function() {
            app.$refs.dialogWorkoutScore.open(true); // open edit workout score dialog
        }
    },
    template: '<div v-if="seen" id="dropdown-menu"> \
        <span v-if="seenNewWorkout" v-on:click="newWorkout" id="btn-new-workout" href="#">Add workout</span> \
        <span v-if="seenEditWorkout" v-on:click="editWorkout" id="btn-edit-workout" href="#">Edit workout</span> \
        <span v-if="seenNewScore" v-on:click="newScore" id="btn-new-score" href="#">Add score</span> \
        <span v-if="seenEditScore" v-on:click="editScore" id="btn-edit-score" href="#">Edit score</span> \
    </div>'
});

export let app = new Vue({
    el: '#app',
    data: {
        title: "none",
        seenDashboard: false,
        seenWorkout: false,
        seenMovement: false,
        seenEquipment: false,
        equipment: [],
        movements: [],
        workouts: []
    },
    components: {
        'btn-login': btnLogin,
        'btn-ok': btnOk,
        'btn-close': btnClose,
        'btn-menu': btnMenu,
        'dropdown-menu': dropdownMenu,
        'dialog-workout': dialogWorkout,
        'dialog-workout-score': dialogWorkoutScore
    },
    computed: {
        equipmentSortByName: function() {
            return this.equipment.sort(arrayHelper.compareByString);
        },
        movementsSortByName: function() {
            return this.movements.sort(arrayHelper.compareByString);
        },
        workoutsSortByName: function() { // returns all visible workout cards in sort order
            return this.workouts.sort(arrayHelper.compareByString).filter(function(workout) {
                return workout.seen != false;
            });
        },
        scoresSortByDatetime: function(workoutIndex) {
            if(this.workouts[workoutIndex].score)  {
                return this.workouts[workoutIndex].score.sort(arrayHelper.compareByTimestamp);
            } else {
                return null;
            }
        }
    },
    methods: {
        /**
         * Set title
         */
        setTitle: function(title) {
            this.title = title;
        },
        /**
         * Show/Hide workout
         */
        hideWorkout: function(workoutIndex) {
            Vue.set(this.workouts[workoutIndex], 'seen', false);
        },
        showWorkout: function(workoutIndex) {
            Vue.set(this.workouts[workoutIndex], 'seen', true);
        },
        hideAllWorkout: function() {
            for(let workoutIndex in this.workouts) {
                this.hideWorkout(workoutIndex);
            }
        },
        showAllWorkout: function() {
            for(let workoutIndex in this.workouts) {
                this.showWorkout(workoutIndex);
            }
        },
        /**
         * Show/Hide views
         */
        hideAllViews: function() {
            this.seenDashboard = false;
            this.seenWorkout = false;
            this.seenMovement = false;
            this.seenEquipment = false;
            // hideToolBar();
            // hideSearchBar();
        },
        showDashboardView: function() {
            this.setTitle("Dashboard");
            this.hideAllBtns();
            this.hideAllDialogs();
            this.hideAllViews();
            this.seenDashboard = true;
        },
        hideDashboardView: function() {
            this.seenDashboard = false;
        },
        showWorkoutView: function() {
            this.setTitle("Workouts");
            this.hideAllBtns();
            this.hideAllDialogs();
            this.hideAllViews();
            this.showAllWorkout(); // show all workouts
            this.showMenuBtn();
            this.seenWorkout = true;
        },
        hideWorkoutView: function() {
            this.seenWorkout = false;
        },
        showMovementView: function() {
            this.setTitle("Movements");
            this.hideAllBtns();
            this.hideAllDialogs();
            this.hideAllViews();
            this.seenMovement = true;
        },
        hideMovementView: function() {
            this.seenMovement = false;
        },
        showEquipmentView: function() {
            this.setTitle("Equipment");
            this.hideAllBtns();
            this.hideAllDialogs();
            this.hideAllViews();
            this.seenEquipment = true;
        },
        hideEquipmentView: function() {
            this.seenEquipment = false;
        },
        /**
         * Show/hide dialogs
         */
        hideAllDialogs: function()  {
            app.$refs.dialogWorkout.hide();
            app.$refs.dialogWorkoutScore.hide();
        },
        /**
         * Show/hide buttons
         */
        hideAllBtns: function() {
            app.$refs.btnLogin.hide();
            app.$refs.btnOk.hide();
            app.$refs.btnClose.hide();
            app.$refs.btnMenu.hide();
        },
        showMenuBtn: function() {
            this.hideAllBtns();
            app.$refs.btnMenu.show();
        }
    }
});

export let workouts = [];

/**
 * Ajax reuests
 * authentication
 */

/**
 * Ajax POST request /authentication/login
 * synchronious ajax call
 */
export function restUserLogin() {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/authentication/login",
        data: {
            name: $("#input-username").val(),
            password: CryptoJS.SHA256($("#input-password").val()).toString()
        },
        async: false,
        success: function(data) {
            // store the token
            // @todo when expired the token?
            main.user.token = data.token;
            main.user.loggedIn = true;
            cookie.createCookie("token", main.user.token, 7);
            guiHelper.handleLogin();

            logger.debug(JSON.stringify(data));
        },
        error: function(data) {
            logger.error("rest.js :: restUserLogin() :: POST /authentication/login :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restUserLogin() :: POST /authentication/login :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /authentication/validate
 */
export function restUserValidate() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/authentication/validate",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            main.user.loggedIn = true;
            guiHelper.handleLogin();

            logger.debug(JSON.stringify(data));
        },
        error: function(data) {
            guiHelper.showLoginDialog();
            logger.error("rest.js :: restUserValidate() :: POST /authentication/validate :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restUserLogin() :: POST /authentication/login :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax reuests
 * equipment
 */


/**
 * Ajax GET request /equipment
 */
export function restGetEquipment() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/equipment",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            app.equipment = data;
            guiHelper.hideLoader();
        },
        error: function(data) {
            logger.error("rest.js :: restGetEquipment() :: GET /equipment :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetEquipment() :: GET /equipment :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax reuests
 * movement
 */

/**
 * Ajax GET request /movement
 */
export function restGetMovements() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/movement",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            app.movements = data;
            guiHelper.hideLoader();
        },
        error: function(data) {
            logger.error("rest.js :: restGetMovements() :: GET /movement :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetMovements() :: GET /movement :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax reuests
 * workout
 */

/**
 * Ajax GET request /workout
 */
export function restGetWorkouts() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            app.workouts = data;
            guiHelper.hideLoader();
        },
        error: function(data) {
            logger.error("rest.js :: restGetWorkouts() :: GET /workout :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetWorkouts() :: GET /workout :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /workout/score/:workoutId
 */
export function restGetWorkoutScores(id) {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout/score/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(app.workouts, id);
            if(workoutIndex != null) {
                Vue.set(app.workouts[workoutIndex], 'score', data);
            } else {
                logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/ :: ERROR: Unable to update/add workout scores to array.");
            }
        },
        error: function(data) {
            logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/:workoutId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /workout/:workoutId
 */
export function restGetWorkoutById(id) {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(app.workouts, id);
            if(workoutIndex != null) {
                Vue.set(app.workouts, workoutIndex, data)
            } else {
                logger.error("rest.js :: restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Unable to update/add workout to array.");
            }
        },
        error: function(data) {
            logger.error("rest.js :: restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /workout
 * Add new workout
 */
export function restAddWorkout(workout) {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout",
        data: workout,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            app.workouts.push(data);
            logger.log("rest.js :: restAddWorkout() :: POST /workout :: SUCCESS: Workout was created.");
            notification.addNotification("ok", "Success: Workout was created.", true);
        },
        error: function(data) {
            logger.error("rest.js :: restAddWorkout() :: POST /workout :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restAddWorkout() :: POST /workout :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /workout/id
 * Updating workout
 */
export function restUpdateWorkout(workout) {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout/" + workout.id,
        data: workout,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(app.workouts, workout.id);
            if(workoutIndex != null) {
                Vue.set(app.workouts, workoutIndex, data);
                logger.log("rest.js :: restUpdateWorkout() :: POST /workout/:workoutId :: SUCCESS: Workout was updated.");
                notification.addNotification("ok", "Success: Workout was updated.", true);
            } else {
                logger.error("rest.js :: restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Unable to update/add workout to array.");
            }
        },
        error: function(data) {
            logger.error("rest.js :: restUpdateWorkout() :: POST /workout/:workoutId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restUpdateWorkout() :: POST /workout/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax reuests
 * score
 */

/**
 * Ajax GET request /score
 */
export function restGetScores() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/score",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            logger.log("rest.js :: restGetScores() :: GET /score :: SUCCESS: TODO");
        },
        error: function(data) {
            logger.error("rest.js :: restGetScores() :: GET /score :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetScores() :: GET /score :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /score/:scoreId
 */
export function restGetScoreById(id) {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/score/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            logger.log("rest.js :: restGetScoreById() :: GET /score/:scoreId :: SUCCESS: TODO");
        },
        error: function(data) {
            logger.error("rest.js :: restGetScoreById() :: GET /score/:scoreId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetScoreById() :: GET /score/:scoreId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /score
 * Save new workout score
 */
export function restAddWorkoutScore(score) {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/score",
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(app.workouts, score.workoutId);
            if(workoutIndex != null) {
                app.workouts[workoutIndex].score.push(data);
                logger.log("rest.js :: restAddWorkoutScore() :: POST /score :: SUCCESS: Workout score was created.");
                notification.addNotification("ok", "Success: Workout score was created.");
            } else {
                logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/ :: ERROR: Unable to update/add workout score to array.");
            }
        },
        error: function(data) {
            logger.error("rest.js :: restAddWorkoutScore() :: POST /score :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restAddWorkoutScore() :: POST /score :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /score/id
 * Updating workout score
 */
export function restUpdateWorkoutScore(score) {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/score/" + score.id,
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(app.workouts, score.workoutId);
            if(workoutIndex != null) {
                let scoreIndex = arrayHelper.getArrayIndexById(app.workouts[workoutIndex].score, score.id);
                if(scoreIndex != null) {
                    Vue.set(app.workouts[workoutIndex].score, scoreIndex, data);
                    logger.log("rest.js :: restUpdateWorkoutScore() :: POST /score/:scoreId :: SUCCESS: Workout score was updated.");
                    notification.addNotification("ok", "Success: Workout score was updated.");
                } else {
                    logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/ :: ERROR: Unable to update/add workout score to array.");
                }
            } else {
                logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/ :: ERROR: Unable to update/add workout score to array.");
            }
        },
        error: function(data) {
            logger.error("rest.js :: restUpdateWorkoutScore() :: POST /score/:scoreId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restUpdateWorkoutScore() :: POST /score/:scoreId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}
