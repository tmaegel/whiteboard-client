'use strict';

import { User } from "./User.js";

import * as cookie from "./cookie.js";
import * as request from "./rest.js";
import * as guiHelper from "./gui.js";

import * as workoutHelper from "./workoutHelper.js";
import * as scoreHelper from "./scoreHelper.js";

// create an arrays
export var
    user = new User();

window.addEventListener("load", init);

function init() {
    // other stuff
    console.clear();
    console.log("main :: init() :: INFO: Initializing");
    // Initialize view
    guiHelper.hideAllDialogs();
    guiHelper.hideAllViews();
    guiHelper.hideAllBtns();

    /**
     * Cookie
     */
    let session = cookie.readCookie("token");
    if(session != null) {
        user.token = session;
        request.restUserValidate();
    } else {
        guiHelper.showLoginDialog();
    }

    /**
     * Login
     */
    let btnLogin = document.getElementById("btn-login");
    btnLogin.addEventListener("click", request.restUserLogin);
    window.addEventListener("keypress", guiHelper.handleLoginByKey);

    /**
     * Nav
     */
    let tabDashboardView = document.getElementById("nav-dashboard");
    tabDashboardView.addEventListener("click", function() {
        guiHelper.activateTab("dashboard");
    });
    let tabWorkoutView = document.getElementById("nav-workout");
    tabWorkoutView.addEventListener("click", function() {
        guiHelper.activateTab("workout");

        request.restGetWorkouts();  // get all workout objects; get scores when clicking on the workout

        // Show all workouts
        let workoutElements = document.querySelectorAll(".workout");
        workoutElements.forEach((element, index, workoutElements) => {
            element.style.display = "block";
        });
    });
    let tabMovementView = document.getElementById("nav-movement");
    tabMovementView.addEventListener("click", function() {
        guiHelper.activateTab("movement");

        request.restGetMovements(); // get all movements objects
    });
    let tabEquipmentView = document.getElementById("nav-equipment");
    tabEquipmentView.addEventListener("click", function() {
        guiHelper.activateTab("equipment");

        request.restGetEquipment(); // get all equipment objects
    });
    let tabSearchBar = document.getElementById("nav-searchbar");
    tabSearchBar.addEventListener("click", guiHelper.toggleSearchBar);

    /**
     * Workout
     */
    let inpSearchWorkout = document.getElementById("searchbar");
    inpSearchWorkout.addEventListener("keyup", guiHelper.doSearch);
    let btnNewWorkout = document.getElementById("btn-new-workout");
    btnNewWorkout.addEventListener("click", function() {
        guiHelper.showWorkoutDialog(false); // open add workout dialog
    });
    let btnEditWorkout = document.getElementById("btn-edit-workout");
    btnEditWorkout.addEventListener("click", function() {
        guiHelper.showWorkoutDialog(true); // open edit workout dialog
    });

    /**
     * Score
     */
    let btnNewScore = document.getElementById("btn-new-score");
    btnNewScore.addEventListener("click", function() {
        guiHelper.showWorkoutScoreDialog(false); // open add workout score dialog
    });
    let btnEditScore = document.getElementById("btn-edit-score");
    btnEditScore.addEventListener("click", function() {
        guiHelper.showWorkoutScoreDialog(true); // open edit workout score dialog
    });

    let btnOk = document.getElementById("btn-ok");
    btnOk.addEventListener("click", function() {
        let workoutId = guiHelper.isAnyCardActive();
        if(workoutId != -1) {
            if(document.getElementById("workout-dialog").style.display == "block") {
                workoutHelper.saveWorkout();
            } else if(document.getElementById("workout-score-dialog").style.display == "block") {
                scoreHelper.saveWorkoutScore();
            } else {
                console.log("click() :: btn-ok :: ERROR: No action defined.");
            }
        } else {
            workoutHelper.saveWorkout();
        }
    });

    let btnClose = document.getElementById("btn-close");
    btnClose.addEventListener("click", function() {
        guiHelper.hideWorkoutDialog();
        guiHelper.hideWorkoutScoreDialog();
    });

    let btnMenu = document.getElementById("btn-menu");
    btnMenu.addEventListener("click", function(event) {
        guiHelper.toggleBtnContextMenu();
        event.stopPropagation();
    });
    // Hide context menu
    document.addEventListener("click", function() {
        guiHelper.hideBtnContextMenu();
    });

    // Listener to refresh the graph
    window.addEventListener("resize", scoreHelper.resizeWorkoutScoreChart);
}
