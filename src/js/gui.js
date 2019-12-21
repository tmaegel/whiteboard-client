'use strict';

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
    showBtnLogin();
    document.getElementById("login-dialog").style.display = "block";
    container.style.margin = "60px 0 200px 0";
}
export function hideLoginDialog() {
    let container = document.getElementById("container");
    hideBtnLogin();
    showNavBar();
    showToolBar();
    document.getElementById("login-dialog").style.display = "none";
    container.style.margin = "115px 0 200px 0";
}
export function showWorkoutDialog(edit) {
    edit = edit || false;

    let workout, workoutId;

    hideBtnNew();
    hideBtnEdit();
    showBtnOk();
    showBtnClose();
    hideWorkoutView();

    if(edit) { // edit workout dialog
        setTitle("Edit workout");
        workoutId = workoutHelper.getWorkoutIdFromDOM();
        if (workoutId > 0) {
            workout = arrayHelper.getArrayObjectById(request.workouts, workoutId);
        }
        if(workout == 0 || workout == -1 || workout == null || workout == undefined) {
            console.log("editWorkoutDialog() :: ERROR: No workout in array found");
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
    hideBtnOk();
    hideBtnClose();
    showBtnNew();
    showWorkoutView();
    setTitle("Workouts");
    if(isAnyCardActive()) {
        showBtnEdit();
    }
    document.getElementById("workout-dialog").style.display = "none";
}
export function showWorkoutScoreDialog(edit) {
    edit = edit || false;

    let workout, workoutId, score, scoreId, index;

    hideBtnNew();
    hideBtnEdit();
    showBtnOk();
    showBtnClose();
    hideWorkoutView();

    if(edit) { // edit workout dialog
        setTitle("Edit workout score");
        workoutId = workoutHelper.getWorkoutIdFromDOM();
        if (workoutId > 0) {
            workout = arrayHelper.getArrayObjectById(request.workouts, workoutId);
        }
        if(workout == 0 || workout == -1 || workout == null || workout == undefined) {
            console.log("editWorkoutDialog() :: ERROR: No workout in array found");
        } else {
            scoreId = scoreHelper.getWorkoutScoreIdFromDOM();
            if (scoreId > 0) {
                index = arrayHelper.getArrayIndexById(request.workouts, workoutId);
                console.log(JSON.stringify(request.workouts[index]));
                if(index != null) {
                    score = arrayHelper.getArrayObjectById(request.workouts[index].score, scoreId);
                }
            }
            if(score == 0 || score == -1 || score == null || score == undefined) {
                console.log("editWorkoutDialog() :: ERROR: No workout score in array found");
            } else {
                console.log(JSON.stringify(score));
                $("#add-score-value").val(score.score);
                if(score.rx == "true") {
                    $("#add-score-rx").prop("checked", true);
                } else {
                    $("#add-score-rx").prop("checked", false);
                }
                console.log(score.datetime);
                $("#add-score-datetime").val(timeHelper.getShortFormatTimestamp(score.datetime));
                $("#add-score-note").val(score.note);
            }
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
    hideBtnOk();
    hideBtnClose();
    showBtnNew();
    showWorkoutView();
    setTitle("Workouts");
    if(isAnyCardActive()) {
        showBtnEdit();
    }
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
    }
}
export function doSearch() {
    console.log("searchWorkout() :: INFO: Searching workout");

    let search = document.getElementById("searchbar").value;

    let workoutElements = document.querySelectorAll(".workout");
    workoutElements.forEach((element, index, workoutElements) => {
        element.style.display = "none";
    });

    let elements = arrayHelper.getArrayObjectsByName(request.workouts, search);
    elements.forEach((element, index, elements) => {
        let workoutElement = document.getElementById("workout-id-" + element.id);
        workoutElement.style.display = "";
    });
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
 * Show/Hide buttons
 */
export function showBtnLogin() { document.getElementById("btn-login").style.display = "block"; }
export function hideBtnLogin() { document.getElementById("btn-login").style.display = "none"; }
export function showBtnNew() { document.getElementById("btn-new").style.display = "block"; }
export function hideBtnNew() { document.getElementById("btn-new").style.display = "none"; }
export function showBtnEdit() { document.getElementById("btn-edit").style.display = "block"; }
export function hideBtnEdit() { document.getElementById("btn-edit").style.display = "none"; }
export function showBtnOk() { document.getElementById("btn-ok").style.display = "block"; }
export function hideBtnOk() { document.getElementById("btn-ok").style.display = "none"; }
export function showBtnClose() { document.getElementById("btn-close").style.display = "block"; }
export function hideBtnClose() { document.getElementById("btn-close").style.display = "none"; }
export function hideAllBtns() {
    hideBtnLogin();
    hideBtnNew();
    hideBtnEdit();
    hideBtnOk();
    hideBtnClose();
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
    showBtnNew();
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
    resetCards();
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

/**
 * Doing card stuff
 */
// Toggle (show/hide) cards
export function toggleCard(element) {
    var parentElement = element.parentElement;
    var contentSel = element.nextElementSibling;
    var state = contentSel.style.display;
    let workoutId = parentElement.id.replace("workout-id-", "");

    // Reset
    resetCards();

    if(state === "block") {
        contentSel.style.display = "none";
        hideBtnEdit();
    } else {
        contentSel.style.display = "block";
        parentElement.classList.add("active");
        $(parentElement).find("canvas").attr("id", config.CHART_ID); // add chart id to identify the element
        request.restGetWorkoutScores(workoutHelper.getWorkoutIdFromDOM());
        // Allow editing only if userId > 1
        let index = arrayHelper.getArrayIndexById(request.workouts, workoutId);
        if(index != null) {
            if(request.workouts[index].userId > 1) {
                showBtnEdit();
            } else {
                console.log("Hide edit workout button, because its a main workout.");
            }
        }
    }
}
// Toggle (select/unselect) cardItem
export function toggleCardItem(element) {
    if($(element).hasClass("select")) {
        $(".score").removeClass("select");
        hideBtnEdit();
    } else {
        $(".score").removeClass("select");
        $(element).addClass("select");
        showBtnEdit();
    }
}
export function isAnyCardItemActive() {
    let items = document.querySelectorAll(".score");
    for (var item of items) {
        if (item.classList.contains('select')) {
            console.log("Any item is active");
            return true;
        }
    }
    console.log("No item is active");
    return false;
}
// Hide and reset selected cards
export function resetCards() {
    let cardElements = document.querySelectorAll(".card");
    cardElements.forEach((card, index, cardElements) => {
        card.classList.remove("active");
    });
    let contentElements = document.querySelectorAll(".card-content");
    contentElements.forEach((content, index, contentElements) => {
        content.style.display = "none";
    });
}
export function isAnyCardActive() {
    let cards = document.querySelectorAll(".card");
    for (var card of cards) {
        if (card.classList.contains('active')) {
            console.log("Any card is active");
            return true;
        }
    }
    console.log("No card is active");
    return false;
}

// event function to handle the login mechanism
export function handleLogin() {
    if (main.user.loggedIn == true && main.user.token != undefined && main.user.token != null) {
        console.log("handleLogin() :: INFO :: Login successful.");
        hideLoginDialog();
        showDashboardView();
        window.removeEventListener("keypress", handleLoginByKey); // Removing if successfully logged in
    } else {
        console.log("handleLogin() :: ERROR :: Login failed.");
    }
}

// event function to handle the login mechanism by pressing the enter key
export function handleLoginByKey(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        request.restUserLogin();
    }
}
