'use strict';

import * as logger from "./logger.js";
import * as main from "./main.js";
import * as request from "./rest.js";
import * as config from "./config.js";

import * as timeHelper from "./time.js";
import * as arrayHelper from "./array.js";
import * as workoutHelper from "./workoutHelper.js";
import * as scoreHelper from "./scoreHelper.js";

/**
 * Show/Hide dialogs
 */
export function showLoginDialog() {
    let container = document.getElementById("container");
    hideNavBar();
    hideToolBar();
    hideSearchBar();
    request.app.setTitle("Login");
    request.app.$refs.btnLogin.show();
    document.getElementById("login-dialog").style.display = "block";
    container.style.margin = "60px 0 200px 0";
}
export function hideLoginDialog() {
    let container = document.getElementById("container");
    showNavBar();
    showToolBar();
    request.app.$refs.btnLogin.hide();
    document.getElementById("login-dialog").style.display = "none";
    container.style.margin = "115px 0 200px 0";
}

/**
 * Show/Hide canvas
 */
export function showChart() { document.getElementById(config.CHART_ID).style.display = "block"; }
export function hideChart() { document.getElementById(config.CHART_ID).style.display = "none"; }
/**
 * Show/Hide loader/spinner
 */
export function showLoader() {
    request.app.hideAllDialogs();
    request.app.hideAllViews();
    request.app.hideAllBtns();
    document.getElementById("loader").style.display = "block";
}
export function hideLoader() { document.getElementById("loader").style.display = "none"; }
/**
 * Show/Hide searchbar
 */
export function showSearchBar() {
    let searchbar = document.getElementById("searchbar");
    searchbar.value = "";
    searchbar.style.display = "block";
    searchbar.focus();
    hidePageTitle();
}
export function hideSearchBar() {
    document.getElementById("searchbar").style.display = "none";
    showPageTitle();
}
export function toggleSearchBar() {
    var searchbar = document.getElementById("searchbar");
    var state = window.getComputedStyle(searchbar).display;
    if(state === "none") {
        showSearchBar();
    } else {
        hideSearchBar();
        workoutHelper.showWorkoutCards();
    }
}
export function doSearch() {
    logger.debug("gui.js :: searchWorkout() :: INFO: Searching workout");
    let search = document.getElementById("searchbar").value;
    for(let workoutIndex in request.app.workouts) {
        if (request.app.workouts[workoutIndex].name.toLowerCase().includes(search.toLowerCase())) { // case insensitive
            request.app.showWorkout(workoutIndex);
        } else {
            request.app.hideWorkout(workoutIndex);
        }
    }
}

/**
 * Show/Hide titlebar
 */
export function hideTitleBar() { document.getElementById("titlebar").style.display = "none"; }
export function showTitleBar() { document.getElementById("titlebar").style.display = "block"; }

/**
 * Show/Hide navbar
 */
export function hideNavBar() { document.getElementById("navbar").style.display = "none"; }
export function showNavBar() { document.getElementById("navbar").style.display = "block"; }
/**
 * Show/Hide pageTitle
 */
export function hidePageTitle() { document.getElementById("page-title").style.display = "none"; }
export function showPageTitle() { document.getElementById("page-title").style.display = "block"; }
/**
 * Show/Hide toolbar
 */
export function hideToolBar() { document.getElementById("toolbar").style.display = "none"; }
export function showToolBar() { document.getElementById("toolbar").style.display = "block"; }

/**
 * Handle tabs
 */
export function activateTab(tab) {
    // unset
    document.getElementById("nav-dashboard").classList.remove("active");
    document.getElementById("nav-workout").classList.remove("active");
    document.getElementById("nav-movement").classList.remove("active");
    document.getElementById("nav-equipment").classList.remove("active");
    // set
    switch(tab) {
        case "dashboard":
            document.getElementById("nav-dashboard").classList.add("active");
            break;
        case "workout":
            showLoader();
            document.getElementById("nav-workout").classList.add("active");
            break;
        case "movement":
            showLoader();
            document.getElementById("nav-movement").classList.add("active");
            break;
        case "equipment":
            showLoader();
            document.getElementById("nav-equipment").classList.add("active");
            break;
    }
}

// event function to handle the login mechanism
export function handleLogin() {
    if (main.user.loggedIn == true && main.user.token != undefined && main.user.token != null) {
        logger.debug("gui.js :: handleLogin() :: INFO :: Login successful.");
        hideLoginDialog();
        request.app.showDashboardView();
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
