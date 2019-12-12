'use strict';

// Config
var Config = Config || {
    REST_SERVER: "https://localhost",
    REST_PORT: "3000",
    DOMAIN: "localhost",
    CHART_ID: "chart"
};

let debug = true;

// create static user
let user = new User();

// create an array equipment
let equipment = [];
// create an array movements
let movements = [];
// create an array workouts
let workouts = [];
// workout chart object
let workoutChart;

// @todo
let selScoreId = 0;

window.addEventListener("load", init);

function init() {
    // other stuff
    console.clear();
    console.log("main :: init() :: INFO: Initializing");
    // Initialize view
    fullResetView();

    /**
     * Cookie
     */
    let cookie = readCookie("token");
    if(cookie != null) {
        user.token = cookie;
        restUserValidate();
    } else {
        document.getElementById('login-modal').style.display='block';
    }

    /**
     * Login
     */
    let btnLogin = document.getElementById("btn-login-user");
    btnLogin.addEventListener("click", restUserLogin);
    window.addEventListener("keypress", handleLoginByKey);

    /**
     * Nav
     */
    let tabDashboardView = document.getElementById("nav-dashboard");
    tabDashboardView.addEventListener("click", function() {
        fullResetView();
        activateTab("dashboard");
    });
    let tabWorkoutView = document.getElementById("nav-workout");
    tabWorkoutView.addEventListener("click", function() {
        fullResetView();
        activateTab("workout");

        restGetWorkouts();  // get all workout objects; get scores when clicking on the workout

        // Show all workouts
        let workoutElements = document.querySelectorAll(".workout");
        workoutElements.forEach((element, index, workoutElements) => {
            element.style.display = "block";
        });
    });
    let tabMovementView = document.getElementById("nav-movement");
    tabMovementView.addEventListener("click", function() {
        fullResetView();
        activateTab("movement");

        restGetMovements(); // get all movements objects
    });
    let tabEquipmentView = document.getElementById("nav-equipment");
    tabEquipmentView.addEventListener("click", function() {
        fullResetView();
        activateTab("equipment");

        restGetEquipment(); // get all equipment objects
    });
    let tabSearchBar = document.getElementById("nav-searchbar");
    tabSearchBar.addEventListener("click", toggleSearchBar);

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
        $("#workout-modal").find(".modal-title").text("New workout");
        showWorkoutModal();
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
