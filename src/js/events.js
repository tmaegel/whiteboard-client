'use strict';

/**
 * Event functions
 */

/**
 * Login
 */

// event function to handle the login mechanism
function handleLogin() {
    var hashedPassword = CryptoJS.SHA256($("#input-password").val()).toString();
    user = new User($("#input-username").val(), hashedPassword);
    restUserLogin();    // login user
    restUserValidate(); // validate user
   
    if (user.token != undefined || user.token != null) {
        console.log("handleLogin() :: INFO :: Login successful.");
        console.log(user.token);
        $('.loginModal').modal("hide");
        $("#content").show();
        $("#dashboard-view").show();
        window.removeEventListener("keypress", handleLoginByKey); // Removing if successfully logged in
    } else {
        console.log("handleLogin() :: ERROR :: Login failed.");
    }
}

// event function to handle the login mechanism by pressing the enter key
function handleLoginByKey(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        handleLogin();
    }
}

/**
 * Nav
 */

// event function to switch to the dashboard view
function switchToDashboardView() {
    console.log("switchToDashboardView() :: INFO: Switching to dashboard view");

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
}

// event function to switch to the workout view
function switchToWorkoutView() {
    console.log("switchToWorkoutView() :: INFO: Switching to workout view");

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
}

// event function to switch to the movement view
function switchToMovementView() {
    console.log("switchToMovementView() :: INFO: Switching to movement view");

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
}

// event function to switch to the equipment view
function switchToEquipmentView() {
    console.log("switchToEquipmentView() :: INFO: Switching to equipment view");

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
}

/**
 * Workouts
 */

function newWorkout() {
    console.log("newWorkout() :: INFO: Activate card 'new workout'");

    fullResetView();
    $("#add-workout-name").val("");
    $("#add-workout-description").val("");
    $(".workoutModal").find(".modal-title").text("New workout");
    $(".workoutModal").modal('show');
}

function saveWorkout() {
    console.log("saveWorkout() :: INFO: Saving workout...");

    let workout;
    let workoutId = getWorkoutIdFromDOM();
    let workoutName = $("#add-workout-name").val();
    let workoutDescription = $("#add-workout-description").val();

    if(workoutName != undefined && workoutDescription != undefined) {
        if(simpleRegex(workoutName) && !empty(workoutName)) {
            console.log("saveWorkout() :: DEBUG: simpleRegex() success");
            workoutName = stripString(workoutName);
        } else {
            addAlert("error", "simpleRegex() :: ERROR: Found invalid characters.", true);
            return;
        }

        if(extendedRegex(workoutDescription) && !empty(workoutDescription)) {
            console.log("saveWorkout() :: DEBUG: extendedRegex() success");
            workoutDescription = stripString(workoutDescription);
        } else {
            addAlert("error", "extendedRegex() :: ERROR: Found invalid characters.", true);
            return;
        }
    } else {
        console.log("saveWorkout() :: ERROR: workoutName or workoutDescription aren't defined");
    }

    /**
     * UPDATE
     */
    if(workoutId > 0) {
        console.log("saveWorkout() :: INFO: Updating workout");
        workout = new Workout(workoutId, getTimestamp(), workoutName, workoutDescription);
        restUpdateWorkout(workout);
    /**
     * NEW
     */
    } else {
        console.log("saveWorkout() :: INFO: Creating new workout");
        workouts.sort(compareById);
        workout = new Workout(workouts[workouts.length - 1].id + 1, getTimestamp(), workoutName, workoutDescription); // id = max workout id + 1
        restAddWorkout(workout);
    }

    console.log("saveWorkout() :: DEBUG: workout objext is " + JSON.stringify(workout));
    resetView();
}

function saveWorkoutScore() {
    console.log("saveWorkoutScore() :: INFO: Saving workout score");

    let workoutId = getWorkoutIdFromDOM();
    let score;
    let scoreId = getWorkoutScoreIdFromDOM(this);
    let scoreValue = stripString($("#add-score-value").val());
    console.log("saveWorkoutScore() ::  DEBUG: scoreValue is " + scoreValue);
    if(numRegex(scoreValue) || timestampRegex(scoreValue)) {
        console.log("saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        addAlert("error", "numRegex() :: ERROR: Found invalid characters.", true);
        return;
    }

    let scoreDatetime = stripString($("#add-score-datetime").val());
    let scoreDateTimeUnix = getTimestamp(scoreDatetime);
    console.log("saveWorkoutScore() :: DEBUG: scoreDatetime is " + scoreDatetime);
    if(numRegex(scoreDateTimeUnix)) {
        console.log("saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        addAlert("error", "datetimeRegex() :: ERROR: Found invalid characters.", true);
        return;
    }

    let scoreNote = stripString($("#add-score-note").val());
    console.log("saveWorkoutScore() :: DEBUG: scoreNote is " + scoreNote);
    if(simpleRegex(scoreDatetime)) {
        console.log("saveWorkoutScore() :: DEBUG: simpleRegex() success");
    } else {
        addAlert("error", "simpleRegex() :: ERROR: Found invalid characters.", true);
        return;
    }

    /**
     * UPDATE
     */
    if(scoreId > 0) {
        console.log("saveWorkoutScore() :: DEBUG: Updating workout score");
        score = new Score(scoreId, workoutId, scoreValue, scoreDateTimeUnix, scoreNote); // id != -1 (update score)
        restUpdateWorkoutScore(score);
    /**
     * NEW
     */
    } else {
        console.log("saveWorkoutScore() :: DEBUG: Creating workout score");
        score = new Score(-1, workoutId, scoreValue, scoreDateTimeUnix, scoreNote); // id = -1 (new score)
        restAddWorkoutScore(score);
    }

    console.log("saveWorkoutScore() :: DEBUG: score objext is " + JSON.stringify(score));
    resetView();
}