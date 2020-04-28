'use strict';

import Vue from 'vue';

import store from './store.js';
import Topbar from './app/Topbar.vue'
import HomeView from './app/HomeView.vue';
import WorkoutsView from './app/WorkoutsView.vue';
import MovementsView from './app/MovementsView.vue';
import EquipmentView from './app/EquipmentView.vue';
import LoaderView from './app/LoaderView.vue';
import ContextMenu from './app/ContextMenu.vue';
import NotificationComponent from './app/NotificationComponent.vue';
import LoginDialog from './app/LoginDialog.vue';
import WorkoutDialog from './app/WorkoutDialog.vue';
import ScoreDialog from './app/ScoreDialog.vue';

import * as logger from "./logger.js";
import * as cookie from "./cookie.js";
import * as request from "./rest.js";
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
    window.addEventListener("keypress", handleLoginByKey);

    // Hide context menu
    document.addEventListener("click", function(event) {
        store.hideContextMenu();
    });

    // Listener to refresh the graph
    // window.addEventListener("resize", scoreHelper.resizeWorkoutScoreChart);
}

// event function to handle the login mechanism
export function handleLogin() {
    if (store.state.user.logout == false && store.state.user.token != undefined && store.state.user.token != null) {
        logger.debug("index.js :: handleLogin() :: INFO :: Login successful.");
        window.removeEventListener("keypress", handleLoginByKey); // Removing if successfully logged in
    } else {
        logger.error("index.js :: handleLogin() :: ERROR :: Login failed.");
    }
}

// event function to handle the login mechanism by pressing the enter key
export function handleLoginByKey(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        request.restUserLogin();
    }
}

export default app = new Vue({
    el: '#app',
    data: {
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
        'topbar': Topbar,
        'context-menu': ContextMenu,
        'notification-component': NotificationComponent,
        'homeView': HomeView,
        'workoutsView': WorkoutsView,
        'movementsView': MovementsView,
        'equipmentView': EquipmentView,
        'loaderView': LoaderView,
        'login-dialog': LoginDialog,
        'workout-dialog': WorkoutDialog,
        'score-dialog': ScoreDialog,
    },
    computed: {
        getCurrentViewComponent: function() {
            logger.debug("index.js :: getCurrentViewComponent() :: triggered with " + this.share.state.app.currentView);
            return this.share.state.app.currentView + "View";
        }
    }
});
