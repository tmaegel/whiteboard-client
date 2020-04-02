'use strict';

import Vue from 'vue';

import store from './store.js';

import * as logger from "./logger.js";
import * as cookie from "./cookie.js";
import * as request from "./rest.js";
import * as guiHelper from "./gui.js";
import * as arrayHelper from "./array.js";
import * as timeHelper from "./time.js";

let app;

window.addEventListener("load", init);

function init() {
    // other stuff
    logger.log("main :: init() :: INFO: Initializing");

    /**
     * Cookie
     */
    let session = cookie.readCookie("token");
    if(session != null) {
        store.setToken(session);
        request.restUserValidate();
    }

    /**
     * Login
     */
    window.addEventListener("keypress", guiHelper.handleLoginByKey);

    // Hide context menu
    document.addEventListener("click", function() {
        store.hideContextMenu();
    });

    // Listener to refresh the graph
    // window.addEventListener("resize", scoreHelper.resizeWorkoutScoreChart);
}
Vue.component('workout-component', {
    props: ['workoutIndex', 'workout'],
    methods: {
        toggleWorkoutCard: function() {
            logger.debug("index.js :: toggleWorkoutCard() :: triggered");
            let state = this.workout.active;
            for(let workout of store.state.workouts) {
                store.deactivateWorkout(workout.id);
            }
            if(!state) {
                store.activateWorkout(this.workout.id);
                request.restGetWorkoutScores(this.workout.id);
            }
        },
        getWorkoutDescription: function(text) {
            return text.toString().replace(new RegExp('\r?\n','g'), "<br />");
        },
        getFormatTimestamp: function(datetime) {
            return timeHelper.getFormatTimestamp(datetime);
        },
    },
    template: '<li class="card"> \
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
Vue.component('score-component', {
    props: ['scoreIndex', 'score', 'workoutIndex'],
    methods: {
        toggleScoreItem: function(workoutIndex, scoreIndex) {
            logger.debug("index.js :: toggleScoreItem() :: triggered");
            let state = store.state.workouts[this.workoutIndex].score[this.scoreIndex].selected;
            for(let index in store.state.workouts[this.workoutIndex].score) {
                store.unselectScore(this.workoutIndex, index);
            }
            if(!state) {
                store.selectScore(this.workoutIndex, this.scoreIndex);
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
Vue.component('movement-component', {
    props: ['movement'],
    template: '<li class="card movement"> \
        <div class="card-header"> \
            <h4>{{ movement.movement }}</h4> \
        </div> \
    </li>'
});
Vue.component('equipment-component', {
    props: ['equipment'],
    template: '<li class="card equipment"> \
        <div class="card-header"> \
            <h4>{{ equipment.equipment }}</h4> \
        </div> \
    </li>'
});

Vue.component("view-home", {
    template: '<div> \
        <ul> \
            <li> \
                <div class="card-header"> \
                    <h4></h4> \
                </div> \
            </li> \
        </ul> \
    </div>'
});
Vue.component("view-workouts", {
    computed: {
        workoutsSortByName: function() { // returns all visible workout cards in sort order
            return store.state.workouts.sort(arrayHelper.compareByString).filter(function(workout) {
                return workout.seen != false;
            });
        }
    },
    template: '<div> \
        <ul> \
            <li is="workout-component" \
                v-for="(workoutItem, workoutIndex) in workoutsSortByName" \
                v-bind:key="workoutItem.id" \
                v-bind:workout-index="workoutIndex" \
                v-bind:workout="workoutItem"></li> \
        </ul> \
    </div>'
});
Vue.component("view-movements", {
    computed: {
        movementsSortByName: function() {
            return store.state.movements.sort(arrayHelper.compareByString);
        }
    },
    template: '<div> \
        <ul> \
            <li is="movement-component" \
                v-for="movementItem in movementsSortByName" \
                v-bind:key="movementItem.id" \
                v-bind:movement="movementItem"></li> \
        </ul> \
    </div>'
});
Vue.component("view-equipment", {
    computed: {
        equipmentSortByName: function() {
            return store.state.equipment.sort(arrayHelper.compareByString);
        }
    },
    template: '<div> \
        <ul> \
            <li is="equipment-component" \
                v-for="equipmentItem in equipmentSortByName" \
                v-bind:key="equipmentItem.id" \
                v-bind:equipment="equipmentItem"></li> \
        </ul> \
    </div>'
});
Vue.component("view-loader", {
    template: '<div id="loader"> \
        <div id="spinner"></div> \
    </div>'
});
// Define a new component called dropdown-menu
Vue.component('dropdown-menu', {
    data: function () {
        return {
            share: store
        }
    },
    methods: {
        click: function(event) {
            this.share.toggleContextMenu();
            event.stopPropagation();
        }
    },
    template: '<div> \
        <div v-if="share.state.context.seen && !share.state.user.logout" id="dropdown-menu"> \
            <span v-if="share.state.context.newWorkout" v-on:click="share.showWorkoutDialog(false)" id="btn-new-workout" href="#">Add workout</span> \
            <span v-if="share.state.context.editWorkout" v-on:click="share.showWorkoutDialog(true)" id="btn-edit-workout" href="#">Edit workout</span> \
            <span v-if="share.state.context.newScore" v-on:click="share.showScoreDialog(false)" id="btn-new-score" href="#">Add score</span> \
            <span v-if="share.state.context.editScore" v-on:click="share.showScoreDialog(true)" id="btn-edit-score" href="#">Edit score</span> \
            </div> \
        <button v-if="!share.state.dialog.workout.seen && !share.state.dialog.score.seen && !share.state.user.logout" v-on:click="click" class="btn-overlay" style="bottom:20px;right: 20px;"> \
            <svg id="btn-menu-svg" class="icon icon-menu"><use xlink:href="#icon-menu"></use></svg><span class="mls"></span> \
        </button> \
    </div>'
});

let notification = Vue.component("notification", {
    data: function () {
        return {
            seen: false,
            message: "",
            currentType: "info"
        }
    },
    computed: {
        getNotificationType: function() {
            logger.debug("index.js :: getNotificationType() :: triggered with " + this.currentType.toLowerCase());
            return "notification-" + this.currentType.toLowerCase();
        }
    },
    methods: {
        show: function(type, value) {
            logger.debug("index.js :: show() :: triggered");
            this.message = value;
            switch(type) {
                case "ok":
                    this.currentType = "ok"
                    break;
                case "info":
                    this.currentType = "info"
                    break;
                case "warn":
                    this.currentType = "warn"
                    break;
                case "error":
                    this.currentType = "error"
                    break;
                default:
                    this.currentType = "info"
            }
            this.seen = true;
        },
        hide: function() {
            logger.debug("index.js :: hide() :: triggered");
            this.seen = false;
        }
    },
    template: '<div v-if="seen" class="notification" v-bind:class="getNotificationType">{{ message }}</div>'
});

export default app = new Vue({
    el: '#app',
    data: {
        title: "",
        currentView: "home",
        previousWiew: "home",
        tabs: ["home", "workouts", "movements", "equipment"],
        share: store
    },
    created: function () {
        if (this.debug) console.log("Instance created.");
    },
    mounted: function () {
        if (this.debug) console.log("Instance mounted.");
    },
    updated: function () {
        if (this.debug) console.log("Instance updated.");
    },
    components: {
        'notification': notification
    },
    computed: {
        getCurrentViewComponent: function() {
            logger.debug("index.js :: getCurrentViewComponent() :: triggered with " + this.currentView.toLowerCase());
            return "view-" + this.currentView.toLowerCase();
        },
        isInputValid: function() {
            let valid = (this.share.state.dialog.workout.validName &&
                        this.share.state.dialog.workout.validDescription &&
                        this.share.state.dialog.score.validScore &&
                        this.share.state.dialog.score.validDatetime &&
                        this.share.state.dialog.score.validNote);
            logger.debug("index.js :: isInputValid() :: triggered with result " + valid);
            return valid;
        },
        isDialogVisible: function() {
            let visible = (this.share.state.dialog.workout.seen || this.share.state.dialog.score.seen && !this.share.state.user.logout);
            logger.debug("index.js :: isDialogVisible() :: triggered with result " + visible);
            return visible;
        }
    },
    methods: {
        init: function() {
            logger.debug("index.js :: init() :: triggered");
            this.currentView = "home";
            this.setTitle("Home");
        },
        setTitle: function(title) {
            logger.debug("index.js :: setTitle() :: triggered with " + title);
            this.title = title;
        },
        activateTab: function(tab) {
            logger.debug("index.js :: activateTab() :: triggered with " + tab);
            this.currentView = tab;
            this.share.hideSearchBar();
            switch(this.currentView) {
                case "home":
                    this.setTitle("Home");
                    break;
                case "workouts":
                    this.setTitle("Workouts");
                    this.showLoader();
                    request.restGetWorkouts();  // get all workout objects; get scores when clicking on the workout
                    this.share.showAllWorkouts(); // show all workouts
                    break;
                case "movements":
                    this.setTitle("Movements");
                    this.showLoader();
                    request.restGetMovements(); // get all movements objects
                    break;
                case "equipment":
                    this.setTitle("Equipment");
                    this.showLoader();
                    request.restGetEquipment(); // get all equipment objects
                    break;
            }
        },
        showLoader: function() {
            logger.debug("index.js :: showLoader() :: triggered");
            this.previousWiew = this.currentView;
            this.currentView = "loader";
        },
        resetView: function() {
            logger.debug("index.js :: resetView() :: triggered");
            this.currentView = this.previousWiew;
            this.share.hideDialog();
        }
    }
});
