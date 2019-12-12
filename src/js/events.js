'use strict';

/**
 * Event functions
 */

/**
 * Login
 */

// event function to handle the login mechanism
function handleLogin() {
    if (user.loggedIn == true && user.token != undefined && user.token != null) {
        console.log("handleLogin() :: INFO :: Login successful.");
        hideLoginModal();
        showDashboardView();
        window.removeEventListener("keypress", handleLoginByKey); // Removing if successfully logged in
    } else {
        console.log("handleLogin() :: ERROR :: Login failed.");
    }
}

// event function to handle the login mechanism by pressing the enter key
function handleLoginByKey(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        restUserLogin();
    }
}

/**
 * Workouts
 */
function addWorkoutDialog() {
    fullResetView();
    $("#add-workout-name").val("");
    $("#add-workout-description").val("");
    $("#workout-modal").find(".modal-title").text("New workout");
    showWorkoutModal();
}
function editWorkoutDialog() {
    console.log("editWorkoutDialog() :: INFO: Activate card 'edit workout'");

    let workout;
    let workoutId = getWorkoutIdFromDOM();
    console.log(workoutId);
    if (workoutId > 0) {
        workout = getArrayObjectById(workouts, workoutId);
    }

    if(workout == 0 || workout == -1 || workout == null || workout == undefined) {
        console.log("editWorkoutDialog() :: ERROR: No workout in array found");
    } else {
        $("#add-workout-name").val(workout.name);
        $("#add-workout-description").val(workout.description);
    }

    $("#workout-modal").find(".modal-title").text("Edit workout");
    showWorkoutModal();
}
function addWorkoutScoreDialog() {
    console.log("addWorkoutScoreDialog() :: INFO: Activate card 'add workout score'");

    let workoutId = getWorkoutIdFromDOM();
    if (workoutId > 0) {
        $("#add-score-value").val("");
        $("#add-score-datetime").val(getShortFormatTimestamp());
        $("#add-score-note").val("");
        $("#add-score-rx").prop("checked", false);

        $("#workout-score-modal").find(".modal-title").text("Add workout score");
        showWorkoutScoreModal();
        selScoreId = 0; // // set to 0 to identify its not a new score
    }
}
function searchWorkout() {
    console.log("searchWorkout() :: INFO: Searching workout");

    let search = document.getElementById("inp-search-workout").value;

    let workoutElements = document.querySelectorAll(".workout");
    workoutElements.forEach((element, index, workoutElements) => {
        element.style.display = "none";
    });

    let elements = getArrayObjectsByName(workouts, search);
    elements.forEach((element, index, elements) => {
        let workoutElement = document.getElementById("workout-id-" + element.id);
        workoutElement.style.display = "";
    });
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
            addNotification("error", "simpleRegex() :: ERROR: Found invalid characters.");
            return;
        }

        if(extendedRegex(workoutDescription) && !empty(workoutDescription)) {
            console.log("saveWorkout() :: DEBUG: extendedRegex() success");
            workoutDescription = stripString(workoutDescription);
        } else {
            addNotification("error", "extendedRegex() :: ERROR: Found invalid characters.");
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
        /*workouts.sort(compareById);
        var id; // new workout id
        if(workouts.length > 0) {
            id = workouts[workouts.length - 1].id + 1;
            console.log(id);
        } else {
            id = 1;
        }*/
        workout = new Workout(0, getTimestamp(), workoutName, workoutDescription); // id = 0
        restAddWorkout(workout);
    }

    console.log("saveWorkout() :: DEBUG: workout objext is " + JSON.stringify(workout));
    resetView();
}
function saveWorkoutScore() {
    console.log("saveWorkoutScore() :: INFO: Saving workout score");

    let workoutId = getWorkoutIdFromDOM();
    let score;
    let scoreId = selScoreId;
    let scoreValue = stripString($("#add-score-value").val());
    if(numRegex(scoreValue) || timestampRegex(scoreValue)) {
        console.log("saveWorkoutScore() :: DEBUG: scoreValue is " + scoreValue);
        console.log("saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        addNotification("error", "numRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreDatetime = stripString($("#add-score-datetime").val());
    let scoreDateTimeUnix = getTimestamp(scoreDatetime);
    if(scoreDateTimeUnix) {
        console.log("saveWorkoutScore() :: DEBUG: scoreDatetime is " + scoreDatetime + " (UTS:"+ scoreDateTimeUnix +")");
        console.log("saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        addNotification("error", "datetimeRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreNote = stripString($("#add-score-note").val());
    if(simpleRegex(scoreDatetime)) {
        console.log("saveWorkoutScore() :: DEBUG: scoreNote is " + scoreNote);
        console.log("saveWorkoutScore() :: DEBUG: simpleRegex() success");
    } else {
        addNotification("error", "simpleRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreRx;
    if($('#add-score-rx').is(":checked")) {
        console.log("saveWorkoutScore() :: DEBUG: scoreRx is true");
        scoreRx = true;
    } else {
        console.log("saveWorkoutScore() :: DEBUG: scoreRx is false");
        scoreRx = false;
    }

    /**
     * UPDATE
     */
    if(scoreId > 0) {
        console.log("saveWorkoutScore() :: DEBUG: Updating workout score");
        score = new Score(scoreId, workoutId, scoreValue, scoreRx, scoreDateTimeUnix, scoreNote); // id != -1 (update score)
        restUpdateWorkoutScore(score);
    /**
     * NEW
     */
    } else {
        console.log("saveWorkoutScore() :: DEBUG: Creating workout score");
        score = new Score(-1, workoutId, scoreValue, scoreRx, scoreDateTimeUnix, scoreNote); // id = -1 (new score)
        restAddWorkoutScore(score);
    }

    console.log("saveWorkoutScore() :: DEBUG: score objext is " + JSON.stringify(score));
    resetView();
}
