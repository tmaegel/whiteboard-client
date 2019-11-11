'use strict';

/**
 * Reset the view
 */
function resetView() {
    $(".loginModal").modal('hide');
    $(".workoutModal").modal('hide');
    $(".workoutScoreModal").modal('hide');
}

/**
 * Full reset the view
 * Collaps menus etc, ...
 */
function fullResetView() {
    resetView();
    // Remove chart element
    $('#chart').removeAttr("id");
    // reset cards
    hideSelectedCards();
}

/**
 * Hide and reset selected cards
 */
function hideSelectedCards() {
    $(".list-group-item").removeClass("padding-0");
    $(".list-group-item").removeClass("card-active");
    $(".card").hide();
    $(".card-title").show();
}

/**
 * WORKOUTS
 */

/**
 * Get the workout id from DOM
 */
function getWorkoutIdFromDOM() {
    let elem = $(".workout.card-active");
    if(elem[0]) {
        let id = $(elem).attr('id').replace("workout-id-", "");
        if (id > 0) {
            console.log("getWorkoutIdFromDOM() :: INFO: Get workout id " + id);
            return id;
        } else {
            console.log("getWorkoutIdFromDOM() :: ERROR: Couldn't get workout id");
            return -1;
        }
    } else {
        console.log("getWorkoutIdFromDOM() :: WARN: Couldn't find any closest object");
        return -1
    }
}

/**
 * Initialize workouts (add all workouts to the view)
 */
function initializeWorkouts() {
    var workoutTemplate = $(".workout-template").clone();
    $(".workout-template").hide();

    // Removing all workouts (refresh)
    $('#workout-view').find("[id^=workout-id]").remove();
    for (var i in workouts) {
        addWorkoutToView(workouts[i]);
    }
}

function addWorkoutToView(workout) {
    var workoutTemplate = $(".workout-template").clone();

    var templateTmp = $(workoutTemplate).clone().first();
    $(templateTmp).removeClass("workout-template");
    $(templateTmp).addClass("workout");
    $(templateTmp).attr("id", "workout-id-"+workout.id);
    $(templateTmp).find(".workout-name").text(workout.name);
    $(templateTmp).find(".workout-description").html(workout.description.replace(new RegExp('\r?\n','g'), "<br />"));
    $(templateTmp).find(".workout-datetime").text("Last updated at " + getFormatTimestamp(workout.datetime));

    /**
     * Setting up 'card hide and show mechanism'
     */
    $(templateTmp).find(".card-clickable").click(function() {
        if($(this).parents(".list-group-item").hasClass("card-active") == true) {
            console.log("click() :: .card-clickable :: INFO: Deactivate current card");

            // Reset
            fullResetView();

            $(".card").hide();
            $(".card-title").show();
        } else {
            console.log("addWorkoutToView() :: INFO: Activate new card");

            // Reset
            fullResetView();

            $(this).parents(".list-group-item").addClass("padding-0");
            $(this).parents(".list-group-item").addClass("card-active");
            $(this).parents(".list-group-item").find("canvas").attr("id", "chart"); // add chart id to identify the element

            $(".card").hide();
            $(".card-title").show();

            $(this).next(".card").show();
            $(this).children(".card-title").hide();

            let workoutId = getWorkoutIdFromDOM();
            if (workoutId > 0) {
                restGetWorkoutScores(workoutId);
            }
        }
    });

    /**
     * Set 'edit workout' button
     * Allow editing only if user_id> 1
     */
    if(workout.user_id > 1) {
        $(templateTmp).find(".btn-edit-workout").click(function() {
            console.log("click() :: .btn-edit-workout :: INFO: Activate card 'edit workout'");

            let workout;
            let workoutId = getWorkoutIdFromDOM();
            if (workoutId > 0) {
                workout = getArrayObject("workout", workoutId);
            }

            if(workout == 0 || workout == -1 || workout == null || workout == undefined) {
                console.log("click() :: .btn-edit-workout :: ERROR: No workout in array found");
            } else {
                $("#add-workout-name").val(workout.name);
                $("#add-workout-description").val(workout.description);
            }

            $(".workoutModal").find(".modal-title").text("Edit workout");
            $(".workoutModal").modal('show');
        });
    } else {
        // @todo: If you are the admin, you can edit the data
        $(templateTmp).find(".btn-edit-workout").remove();
    }

    /**
     * Set 'add workout score' button
     */
    $(templateTmp).find(".btn-add-workout-score").click(function() {
        console.log("click() :: .btn-add-workout-score :: INFO: Activate card 'add workout score'");
        let workoutId = getWorkoutIdFromDOM();

        if (workoutId > 0) {
            $("#add-score-value").val("");
            $("#add-score-datetime").val(getShortFormatTimestamp());
            $("#add-score-note").val("");
            $(".workoutScoreModal").find(".modal-title").text("Add workout score");
            $(".workoutScoreModal").modal('show');
            $(".workoutScoreModal").attr("id", "0"); // added id 0 to identify its a new score
        }
    });

    $(templateTmp).appendTo("#workout-view .list-group");
    $(templateTmp).show();
}

function updateWorkoutOnView(workout) {
    $("#workout-id-"+workout.id).find(".workout-name").text(workout.name);
    $("#workout-id-"+workout.id).find(".workout-description").html(workout.description.replace(new RegExp('\r?\n','g'), "<br />"));
    $("#workout-id-"+workout.id).find(".workout-datetime").text("Last updated at " + getFormatTimestamp(workout.datetime));
}

/**
 * SCORES
 */

/**
 * Get the workout score id from DOM
 */
function getWorkoutScoreIdFromDOM(elem) {
    let obj = $(elem).closest(".score");
    let id;
    if(obj[0]) {
        id = $(obj).attr('id').replace("score-id-", "");
    } else {
        // here gets the id via workoutScoreModal
        console.log("getWorkoutScoreIdFromDOM() :: WARN: Couldn't find any closest object");
        id = $(".workoutScoreModal").attr("id");
    }

    if (id > 0) {
        console.log("getWorkoutScoreIdFromDOM() :: INFO: Get score id " + id);
        return id;
    } else {
        console.log("getWorkoutScoreIdFromDOM() :: ERROR: Couldn't get score id");
        return -1;
    }
}

function addWorkoutScoresToView(workoutId) {
    let parentElement = $("#workout-id-"+workoutId);
    $(parentElement).find("[id^=score-id]").remove();
    let showScoreTemplate = $("#workout-id-"+workoutId).find(".score-template").clone();
    if(workouts[workoutId - 1].score.length > 0) {
        console.log("addWorkoutScoresToView() :: INFO: There are " + workouts[workoutId - 1].score.length + " scores available to display");
        for (var i in workouts[workoutId - 1].score) {

            let scoreId = workouts[workoutId - 1].score[i].id;
            let scoreValue = workouts[workoutId - 1].score[i].score;
            let scoreTimestamp = workouts[workoutId - 1].score[i].datetime;
            let scoreNote = workouts[workoutId - 1].score[i].note;

            // score mask to showing scores
            let showScoreTemplateTmp = $(showScoreTemplate).clone().first();
            $(showScoreTemplateTmp).removeClass("score-template");
            $(showScoreTemplateTmp).addClass("score");
            $(showScoreTemplateTmp).attr("id", "score-id-" + scoreId);
            $(showScoreTemplateTmp).find(".score-value").text(scoreValue);
            $(showScoreTemplateTmp).find(".score-datetime").text(getShortFormatTimestamp(scoreTimestamp));
            $(showScoreTemplateTmp).find(".score-note").text(scoreNote);

            /**
             * Set 'edit workout score' button
             */
            $(showScoreTemplateTmp).find(".btn-edit-workout-score").click(function() {
                console.log("click() :: btn-edit-workout-score :: INFO: Editing workout score");
                let scoreId = getWorkoutScoreIdFromDOM(this);

                $("#add-score-value").val(scoreValue);
                $("#add-score-datetime").val(getShortFormatTimestamp(scoreTimestamp));
                $("#add-score-note").val(scoreNote);
                $(".workoutScoreModal").find(".modal-title").text("Add workout score");
                $(".workoutScoreModal").modal('show');
                $(".workoutScoreModal").attr("id", scoreId); // added id to identify its not a new score
            });

            // Finally showing the score-mask
            $(showScoreTemplateTmp).appendTo("#workout-id-" + workoutId + " .scores");
            $(showScoreTemplateTmp).show();
        }
    } else {
        console.log("addWorkoutScoresToView() :: INFO: There are no scores available to display");
    }

    // Drawing workout scores
    // add canvas to display the chart
    if(workouts[workoutId - 1].score.length > 0) {
        workoutChart = new Chart(workouts[workoutId - 1].score);
        workoutChart.init();
        workoutChart.draw();
    }
    $("#workout-id-"+workoutId).find(".score-template").hide();
}

/**
 * MOVEMENTS
 */

/**
 * Initialize movements (add all movements to the view)
 */
function initializeMovements() {
    var movementTemplate = $(".movement-template").clone();
    $(".movement-template").hide();

    // Removing all movements (refresh)
    $('#movement-view').find("[id^=movement-id]").remove();
    for (var i in movements) {
        addMovementToView(movements[i]);
    }
}

/*
 * Adding movement to view
 */
function addMovementToView(movement) {
    var movementTemplate = $(".movement-template").clone();

    var templateTmp = $(movementTemplate).clone().first();
    $(templateTmp).removeClass("movement-template");
    $(templateTmp).attr("id", "movement-id-"+movement.id);
    $(templateTmp).find(".movement-name").text(movement.movement);

    $(templateTmp).show();
    $(templateTmp).appendTo("#movement-view .list-group");
}

/**
 * EQUIPMENT
 */

/**
 * Initialize movements (add all movements to the view)
 */
function initializeEquipment() {
    var equipmentTemplate = $(".equipment-template").clone();
    $(".equipment-template").hide();

    // Removing all equipment (refresh)
    $('#equipment-view').find("[id^=equipment-id]").remove();
    for (var i in equipment) {
        addEquipmentToView(equipment[i]);
    }
}

/*
 * Adding equipment to view
 */
function addEquipmentToView(equipment) {
    var movementTemplate = $(".equipment-template").clone();

    var templateTmp = $(movementTemplate).clone().first();
    $(templateTmp).removeClass("equipment-template");
    $(templateTmp).attr("id", "equipment-id-"+equipment.id);
    $(templateTmp).find(".equipment-name").text(equipment.equipment);

    $(templateTmp).show();
    $(templateTmp).appendTo("#equipment-view .list-group");
}
