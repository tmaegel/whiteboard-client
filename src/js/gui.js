'use strict';

import app from "./index.js";
import store from './store.js';

import * as logger from "./logger.js";
import * as request from "./rest.js";
import * as config from "./config.js";

import * as timeHelper from "./time.js";
import * as arrayHelper from "./array.js";

/**
 * Show/Hide canvas
 */
export function showChart() { document.getElementById(config.CHART_ID).style.display = "block"; }
export function hideChart() { document.getElementById(config.CHART_ID).style.display = "none"; }

export function doSearch() {
    logger.debug("gui.js :: searchWorkout() :: INFO: Searching workout");
    let search = document.getElementById("searchbar").value;
    for(let workoutIndex in store.state.workouts) {
        if (store.state.workouts[workoutIndex].name.toLowerCase().includes(search.toLowerCase())) { // case insensitive
            app.showWorkout(workoutIndex);
        } else {
            app.hideWorkout(workoutIndex);
        }
    }
}

/**
 * Show/Hide navbar
 */
export function hideNavBar() { document.getElementById("navbar").style.display = "none"; }
export function showNavBar() { document.getElementById("navbar").style.display = "block"; }
/**
 * Show/Hide pageTitle
 */
//export function hidePageTitle() { document.getElementById("page-title").style.display = "none"; }
//export function showPageTitle() { document.getElementById("page-title").style.display = "block"; }
/**
 * Show/Hide toolbar
 */
export function hideToolBar() { document.getElementById("toolbar").style.display = "none"; }
export function showToolBar() { document.getElementById("toolbar").style.display = "block"; }

// event function to handle the login mechanism
export function handleLogin() {
    if (store.state.user.logout == false && store.state.user.token != undefined && store.state.user.token != null) {
        logger.debug("gui.js :: handleLogin() :: INFO :: Login successful.");
        app.init();
        window.removeEventListener("keypress", handleLoginByKey); // Removing if successfully logged in
    } else {
        logger.error("gui.js :: handleLogin() :: ERROR :: Login failed.");
    }
}

// event function to handle the login mechanism by pressing the enter key
export function handleLoginByKey(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        request.restUserLogin();
    }
}
