'use strict';

// CONSTANTS
const REST_SERVER = "https://localhost"
const REST_PORT = "3000"
const CHART_ID = "chart"

let debug = true;

// create static user
let user = null;

// create an array equipment
let equipment = [];
// create an array movements
let movements = [];
// create an array workouts
let workouts = [];
// workout chart object
let workoutChart;

window.addEventListener("load", init);

function init() {
    // other stuff
    console.clear();
    console.log("main :: init() :: INFO: Initializing");
    // Hide other views
    $("#content").hide();
    $("#dashboard-view").hide();
    $("#workout-view").hide();
    $("#movement-view").hide();
    $("#equipment-view").hide();
    $('#inp-search-workout').hide();
    $('#btn-group-filter-workout').hide();
    $('#btn-group-ctl-workout').hide();
    // Initialize view
    fullResetView();

    /**
     * Modals
     */
    $('.loginModal').modal({
        backdrop: "static",
        keyboard: false,
        show: true,
        focus: true
    });

    $('.workoutModal').modal({
        show: false,
        focus: true
    });
    $(".workoutModal").hide();

    $('.workoutScoreModal').modal({
        show: false,
        focus: true
    });
    $(".workoutScoreModal").hide();

    /**
     * Login
     */
    let btnLogin = document.getElementById("btn-login-user");
    btnLogin.addEventListener("click", handleLogin);
    window.addEventListener("keypress", handleLoginByKey);

    /**
     * Nav
     */
    let tabDashboardView = document.getElementById("nav-dashboard-view");
    tabDashboardView.addEventListener("click", switchToDashboardView);
    let tabWorkoutView = document.getElementById("nav-workout-view");
    tabWorkoutView.addEventListener("click", switchToWorkoutView);
    let tabMovementView = document.getElementById("nav-movement-view");
    tabMovementView.addEventListener("click", switchToMovementView);
    let tabEquipmentView = document.getElementById("nav-equipment-view");
    tabEquipmentView.addEventListener("click", switchToEquipmentView);

    /**
     * Workout
     */
    let inpSearchWorkout = document.getElementById("inp-search-workout");
    inpSearchWorkout.addEventListener("keyup", searchWorkout);
    let btnNewWorkout = document.getElementById("btn-new-workout");
    btnNewWorkout.addEventListener("click", function() {
        console.log("click() :: #btn-new-workout :: INFO: Activate card 'new workout'");
        fullResetView();
        $("#add-workout-name").val("");
        $("#add-workout-description").val("");
        $(".workoutModal").find(".modal-title").text("New workout");
        $(".workoutModal").modal('show');
    });
    let btnSaveWorkout = document.getElementById("btn-save-workout");
    btnSaveWorkout.addEventListener("click", saveWorkout);
    let btnSaveWorkoutScore = document.getElementById("btn-save-workout-score");
    btnSaveWorkoutScore.addEventListener("click", saveWorkoutScore);

    // Listener to refresh the graph
	window.addEventListener("resize", function() {
        if(workoutChart != null || workoutChart != undefined) {
            workoutChart.update();
            workoutChart.draw();
        }
	});
}
