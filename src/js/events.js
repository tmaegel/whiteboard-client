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
        $(".loginModal").modal("hide");
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
        restUserLogin();
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
    $('#inp-search-workout').val("");
    $('#inp-search-workout').hide();
    $('#btn-group-filter-workout').hide();
    $('#btn-group-ctl-workout').hide();
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
    $('#inp-search-workout').val("");
    $('#inp-search-workout').show();
    $('#btn-group-filter-workout').show();
    $('#btn-group-ctl-workout').show();
    $('#dashboard-view').hide();
    $('#movement-view').hide();
    $('#equipment-view').hide();
    $('#workout-view').show();
    
    restGetWorkouts();  // get all workout objects; get scores when clicking on the workout

    // Show all workouts
    let workoutElements = document.querySelectorAll(".workout");
    workoutElements.forEach((element, index, workoutElements) => {
        element.style.display = "";
    });
}

// event function to switch to the movement view
function switchToMovementView() {
    console.log("switchToMovementView() :: INFO: Switching to movement view");

    fullResetView();
    $("#nav-dashboard-view").children().removeClass("active");
    $("#nav-workout-view").children().removeClass("active");
    $("#nav-equipment-view").children().removeClass("active");
    $(this).children().addClass("active");
    $('#inp-search-workout').val("");
    $('#inp-search-workout').hide();
    $('#btn-group-filter-workout').hide();
    $('#btn-group-ctl-workout').hide();
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
    $('#inp-search-workout').val("");
    $('#inp-search-workout').hide();
    $('#btn-group-filter-workout').hide();
    $('#btn-group-ctl-workout').hide();
    $('#dashboard-view').hide();
    $('#workout-view').hide();
    $('#movement-view').hide();
    $('#equipment-view').show();
    
    restGetEquipment(); // get all equipment objects
}

/**
 * General
 */

// Event function to toggle (show/hide) the cards
function toggleCard(element) {
    var parentFirst = $(element).parent(".list-group-item :first");
    if($(parentFirst).hasClass("card-active") == true) {
        console.log("click() :: .card-clickable :: INFO: Deactivate current card");
        // Reset
        fullResetView();
    } else {
        console.log("addWorkoutToView() :: INFO: Activate new card");

        // Reset
        fullResetView();

        $(element).parent(".list-group-item").addClass("padding-0");
        $(element).parent(".list-group-item").addClass("card-active");
        $(element).parent(".list-group-item").find("canvas").attr("id", Config.CHART_ID); // add chart id to identify the element

        $(".card").hide();
        $(".card-title").show();

        $(element).next(".card").show();
        $(element).children(".card-title").hide();

        let workoutId = getWorkoutIdFromDOM();
        if (workoutId > 0) {
            restGetWorkoutScores(workoutId);
        }
    }
}

/**
 * Workouts
 */

function editWorkoutDialog() {
    console.log("editWorkoutDialog() :: INFO: Activate card 'edit workout'");

    let workout;
    let workoutId = getWorkoutIdFromDOM();
    if (workoutId > 0) {
        workout = getArrayObject("workout", workoutId);
    }

    if(workout == 0 || workout == -1 || workout == null || workout == undefined) {
        console.log("editWorkoutDialog() :: ERROR: No workout in array found");
    } else {
        $("#add-workout-name").val(workout.name);
        $("#add-workout-description").val(workout.description);
    }

    $(".workoutModal").find(".modal-title").text("Edit workout");
    $(".workoutModal").modal('show');
}

function addWorkoutScoreDialog() {
    console.log("addWorkoutScoreDialog() :: INFO: Activate card 'add workout score'");

    let workoutId = getWorkoutIdFromDOM();
    if (workoutId > 0) {
        $("#add-score-value").val("");
        $("#add-score-datetime").val(getShortFormatTimestamp());
        $("#add-score-note").val("");
        $(".workoutScoreModal").find(".modal-title").text("Add workout score");
        $(".workoutScoreModal").modal('show');
        $(".workoutScoreModal").attr("id", "0"); // added id 0 to identify its a new score
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
        var id; // new workout id
        if(workouts.length > 0) {
            id = workouts[workouts.length - 1].id + 1;
        } else {
            id = 1;
        }
        workout = new Workout(id, getTimestamp(), workoutName, workoutDescription); // id = max workout id + 1
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
