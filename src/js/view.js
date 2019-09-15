'use strict';

/**
 * Modals
 */

$('#loginModal').modal({
    backdrop: "static",
    keyboard: false,
    show: true,
    focus: true
})

$('#workoutModal').modal({
    show: false,
    focus: true
})

$('#workoutScoreModal').modal({
    show: false,
    focus: true
})

/**
 * Login
 */

$(document).keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        console.log("keypress() :: #btn-login-user :: INFO: Login user");
        handleLogin();
    }
});

$("#btn-login-user" ).click(function() {
    console.log("click() :: #btn-login-user :: INFO: Login user");
    handleLogin();
});

/**
 * Nav
 */

$("#nav-dashboard-view" ).click(function() {
    console.log("click() :: #nav-dashboard-view :: INFO: Switch to dashboard view");
    selectedWorkoutId = 0;

    fullResetView();
    $("#nav-workout-view").children().removeClass("active");
    $("#nav-movement-view").children().removeClass("active");
    $("#nav-equipment-view").children().removeClass("active");
    $(this).children().addClass("active");
    $('#btn-group-new-workout').hide();
    $('#workout-view').hide();
    $('#movement-view').hide();
    $('#equipment-view').hide();
    $('#dashboard-view').show();
});

$("#nav-workout-view" ).click(function() {
    console.log("click() :: #nav-workout-view :: INFO: Switch to workout view");
    selectedWorkoutId = 0;

    fullResetView();
    $("#nav-dashboard-view").children().removeClass("active");
    $("#nav-movement-view").children().removeClass("active");
    $("#nav-equipment-view").children().removeClass("active");
    $(this).children().addClass("active");
    $('#btn-group-new-workout').show();
    $('#dashboard-view').hide();
    $('#movement-view').hide();
    $('#equipment-view').hide();
    $('#workout-view').show();
    
    restGetWorkouts();  // get all workout objects; get scores when clicking on the workout
});

$("#nav-movement-view" ).click(function() {
    console.log("click() :: #nav-movement-view :: INFO: Switch to movement view");
    selectedWorkoutId = 0;

    fullResetView();
    $("#nav-dashboard-view").children().removeClass("active");
    $("#nav-workout-view").children().removeClass("active");
    $("#nav-equipment-view").children().removeClass("active");
    $(this).children().addClass("active");
    $('#btn-group-new-workout').hide();
    $('#dashboard-view').hide();
    $('#workout-view').hide();
    $('#equipment-view').hide();
    $('#movement-view').show();

    restGetMovements(); // get all movements objects
});

$("#nav-equipment-view" ).click(function() {
    console.log("click() :: #nav-equipment-view :: INFO: Switch to equipment view");
    selectedWorkoutId = 0;

    fullResetView();
    $("#nav-dashboard-view").children().removeClass("active");
    $("#nav-workout-view").children().removeClass("active");
    $("#nav-movement-view").children().removeClass("active");
    $(this).children().addClass("active");
    $('#btn-group-new-workout').hide();
    $('#dashboard-view').hide();
    $('#workout-view').hide();
    $('#movement-view').hide();
    $('#equipment-view').show();
    
    restGetEquipment(); // get all equipment objects
});

/**
 * Workout
 */

$("#btn-new-workout").click(function() {
    console.log("click() :: #btn-new-workout :: INFO: Activate card 'new workout'");

    selectedWorkoutId = 0;
    resetView();
    $("#add-workout-name").val("");
    $("#add-workout-description").val("");
    $("#workoutModal").find(".modal-title").text("New workout");
    $("#workoutModal").modal('show');
});

$("#btn-save-workout").click(function() {
    console.log("click() :: #btn-save-workout :: INFO: Saving workout...");

    let workout;
    let workoutName = $("#add-workout-name").val();
    let workoutDescription = $("#add-workout-description").val();

    /*if(workoutName != undefined && workoutDescription != undefined) {
        if(simpleRegex(workoutName)) {
            console.log("click() :: #btn-save-workout :: DEBUG: simpleRegex() success");
            workoutName = stripString(workoutName);
        } else {
            addAlert("error", "simpleRegex() :: ERROR: Found invalid characters.", true);
            return;
        }

        if(extendedRegex(workoutDescription)) {
            console.log("click() :: #btn-save-workout :: DEBUG: extendedRegex() success");
            workoutDescription = stripString(workoutDescription);
        } else {
            addAlert("error", "extendedRegex() :: ERROR: Found invalid characters.", true);
            return;
        }
    } else {
        console.log("click() :: #btn-save-workout :: ERROR: workoutName or workoutDescription aren't defined");
    }*/

    console.log("click() :: #btn-save-workout :: DEBUG: selectedWorkoutId is " + selectedWorkoutId);

    /**
     * UPDATE
     */
    if(selectedWorkoutId > 0) {
        console.log("click() :: #btn-save-workout :: INFO: Updating workout");
        workout = new Workout(selectedWorkoutId, getTimestamp(), workoutName, workoutDescription);
        restUpdateWorkout(workout);
    /**
     * NEW
     */
    } else {
        console.log("click() :: #btn-save-workout :: INFO: Creating new workout");
        workouts.sort(compareById);
        workout = new Workout(workouts[workouts.length - 1].id + 1, getTimestamp(), workoutName, workoutDescription); // id = max workout id + 1
        restAddWorkout(workout);
    }

    console.log("click() :: #btn-save-workout :: DEBUG: workout objext is " + JSON.stringify(workout));
    resetView();
});

$("#btn-save-workout-score").click(function() {
    console.log("click() :: .btn-save-workout-score :: INFO: Saving workout score");

    let score;
    let scoreValue = stripString($("#add-score-value").val());
    console.log("click() :: #btn-save-workout-score :: DEBUG: scoreValue is " + scoreValue);
    if(numRegex(scoreValue)) {
        console.log("click() :: #btn-save-workout-score :: DEBUG: numRegex() success");
    } else {
        addAlert("error", "numRegex() :: ERROR: Found invalid characters.", true);
        return;
    }

    let scoreDatetime = stripString($("#add-score-datetime").val());
    let scoreDateTimeUnix = getTimestamp(scoreDatetime);
    console.log("click() :: #btn-save-workout-score :: DEBUG: scoreDatetime is " + scoreDatetime);
    if(numRegex(scoreDateTimeUnix)) {
        console.log("click() :: #btn-save-workout-score :: DEBUG: numRegex() success");
    } else {
        addAlert("error", "datetimeRegex() :: ERROR: Found invalid characters.", true);
        return;
    }

    let scoreNote = stripString($("#add-score-note").val());
    console.log("click() :: #btn-save-workout-score :: DEBUG: scoreNote is " + scoreNote);
    if(simpleRegex(scoreDatetime)) {
        console.log("click() :: #btn-save-workout-score :: DEBUG: simpleRegex() success");
    } else {
        addAlert("error", "simpleRegex() :: ERROR: Found invalid characters.", true);
        return;
    }

    /**
     * UPDATE
     */
    if(selectedScoreId > 0) {
        console.log("click() :: #btn-save-workout-score :: DEBUG: Updating workout score");
        score = new Score(selectedScoreId, selectedWorkoutId, scoreValue, scoreDateTimeUnix, scoreNote); // id != -1 (update score)
        restUpdateWorkoutScore(score);
    /**
     * NEW
     */
    } else {
        console.log("click() :: #btn-save-workout-score :: DEBUG: Creating workout score");
        score = new Score(-1, selectedWorkoutId, scoreValue, scoreDateTimeUnix, scoreNote); // id = -1 (new score)
        restAddWorkoutScore(score);
    }

    console.log("click() :: #btn-save-workout-score :: DEBUG: score objext is " + JSON.stringify(score));
    resetView();
});
