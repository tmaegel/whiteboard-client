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
    setTitle("Login");
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
export function showWorkoutDialog(edit) {
    let workout, workoutId;

    request.app.$refs.btnMenu.hide();
    request.app.$refs.btnOk.show();
    request.app.$refs.btnClose.show();
    hideWorkoutView();

    if(edit) { // edit workout dialog
        setTitle("Edit workout");
        workoutId = workoutHelper.isWorkoutCardActive();
        if (workoutId > 0) {
            workout = arrayHelper.getArrayObjectById(request.app.workouts, workoutId);
        }
        if(workout == 0 || workout == -1 || workout == null || workout == undefined) {
            logger.error("gui.js :: editWorkoutDialog() :: ERROR: No workout in array found");
        } else {
            $("#add-workout-name").val(workout.name);
            $("#add-workout-description").val(workout.description);
        }
    } else { // add workout dialog
        setTitle("Add workout");
        $("#add-workout-name").val("");
        $("#add-workout-description").val("");
    }

    document.getElementById("workout-dialog").style.display = "block";
}
export function hideWorkoutDialog() {
    request.app.$refs.btnOk.hide();
    request.app.$refs.btnClose.hide();
    request.app.$refs.btnMenu.show();
    showWorkoutView();
    setTitle("Workouts");
    document.getElementById("workout-dialog").style.display = "none";
}
export function showWorkoutScoreDialog(edit) {
    let workout, workoutId, score, scoreId, index;

    request.app.$refs.btnMenu.hide();
    request.app.$refs.btnOk.show();
    request.app.$refs.btnClose.show();
    hideWorkoutView();

    if(edit) { // edit workout dialog
        setTitle("Edit workout score");
        workoutId = workoutHelper.isWorkoutCardActive();
        console.log(workoutId);
        if (workoutId > 0) {
            console.log(workoutId);
            let workoutIndex = arrayHelper.getArrayIndexById(request.app.workouts, workoutId);
            console.log(workoutIndex);
            if(workoutIndex != null) {
                scoreId = scoreHelper.isScoreItemSelected(workoutIndex)
                if (scoreId > 0) {
                    score = arrayHelper.getArrayObjectById(request.app.workouts[workoutIndex].score, scoreId);
                }
                if(score == 0 || score == -1 || score == null || score == undefined) {
                    logger.error("gui.js :: editWorkoutDialog() :: ERROR: No workout score in array found");
                } else {
                    $("#add-score-value").val(score.score);
                    if(score.rx == 1) {
                        $("#add-score-rx").prop("checked", true);
                    } else {
                        $("#add-score-rx").prop("checked", false);
                    }
                    $("#add-score-datetime").val(timeHelper.getShortFormatTimestamp(score.datetime));
                    $("#add-score-note").val(score.note);
                }
            } else {
                logger.error("gui.js :: editWorkoutDialog() :: ERROR: No workout found in array");
            }
        } else {
            logger.error("gui.js :: editWorkoutDialog() :: ERROR: No workout active to edit");
        }
    } else { // add workout dialog
        setTitle("Add workout score");
        $("#add-score-value").val("");
        $("#add-score-datetime").val(timeHelper.getShortFormatTimestamp());
        $("#add-score-note").val("");
        $("#add-score-rx").prop("checked", false);

    }

    document.getElementById("workout-score-dialog").style.display = "block";
}
export function hideWorkoutScoreDialog() {
    request.app.$refs.btnOk.hide();
    request.app.$refs.btnClose.hide();
    request.app.$refs.btnMenu.show();
    showWorkoutView();
    setTitle("Workouts");
    document.getElementById("workout-score-dialog").style.display = "none";
}
export function hideAllDialogs() {
    hideLoginDialog();
    hideWorkoutDialog();
    hideWorkoutScoreDialog();
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
    hideAllDialogs();
    hideAllViews();
    hideAllBtns();
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
 * Hide buttons
 */
export function hideAllBtns() {
    request.app.$refs.btnLogin.hide();
    request.app.$refs.btnOk.hide();
    request.app.$refs.btnClose.hide();
    request.app.$refs.btnMenu.hide();
}

/**
 * Show/Hide views
 */
export function showDashboardView() {
    setTitle("Dashboard");
    hideToolBar();
    hideSearchBar();
    document.getElementById("dashboard-view").style.display = "block";
}
export function hideDashboardView() { document.getElementById("dashboard-view").style.display = "none"; }
export function showWorkoutView() {
    setTitle("Workouts");
    request.app.$refs.btnMenu.show();
    showToolBar();
    hideSearchBar();
    document.getElementById("workout-view").style.display = "block";
}
export function hideWorkoutView() { document.getElementById("workout-view").style.display = "none"; }
export function showMovementView() {
    setTitle("Movements");
    hideToolBar();
    hideSearchBar();
    document.getElementById("movement-view").style.display = "block";
}
export function hideMovementView() { document.getElementById("movement-view").style.display = "none"; }
export function showEquipmentView() {
    setTitle("Equipment");
    hideToolBar();
    hideSearchBar();
    document.getElementById("equipment-view").style.display = "block";
}
export function hideEquipmentView() { document.getElementById("equipment-view").style.display = "none"; }
export function hideAllViews() {
    hideDashboardView();
    hideWorkoutView();
    hideMovementView();
    hideEquipmentView();
}

/**
 * Set title
 */
export function setTitle(title) {
    document.getElementById("page-title").innerHTML = title;
}

/**
 * Handle tabs
 */
export function activateTab(tab) {
    // unset
    document.getElementById("nav-dashboard").classList.remove("active");
    document.getElementById("nav-workout").classList.remove("active");
    document.getElementById("nav-movement").classList.remove("active");
    document.getElementById("nav-equipment").classList.remove("active");
    hideAllDialogs();
    hideAllViews();
    hideAllBtns();
    // set
    switch(tab) {
        case "dashboard":
            document.getElementById("nav-dashboard").classList.add("active");
            showDashboardView();
            break;
        case "workout":
            showLoader();
            document.getElementById("nav-workout").classList.add("active");
            request.app.$refs.dropdownMenu.hide();
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
        showDashboardView();
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
