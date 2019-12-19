'use strict';

/**
 * WORKOUTS
 */

/**
 * Get the workout id from DOM
 */
function getWorkoutIdFromDOM() {
    let elem = $(".workout.active");
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
        return -1;
    }
}

/**
 * Init or added non-existing workouts on view
 */
function initWorkoutsOnView() {
    $(".workout-template").hide();
    var workoutTemplate = $(".workout-template").clone();
    $(workoutTemplate).removeClass("workout-template");
    $(workoutTemplate).addClass("workout");

    // Init or add non-existing workouts
    for (var i in workouts) {
        var workoutElement = document.getElementById("workout-id-" + workouts[i].id);
        // If not exists then add it to the view (sorted alphabetically)
        if(!workoutElement) {
            var template = $(workoutTemplate).clone().first();
            $(template).attr("id", "workout-id-"+workouts[i].id);
            $(template).find(".workout-name").text(workouts[i].name);
            $(template).find(".workout-description").html(workouts[i].description.replace(new RegExp('\r?\n','g'), "<br />"));
            $(template).find(".workout-datetime").text("Last updated at " + getFormatTimestamp(workouts[i].datetime));

            // If there is a next element then add the current element before it
            if(i < workouts.length - 1) {
                var nextWorkoutElement = document.getElementById("workout-id-" + workouts[parseInt(i) + parseInt(1)].id);
                if(!nextWorkoutElement) {
                    $(".workout-template").before(template);
                } else {
                    $(nextWorkoutElement).before(template);
                }
            } else {
                $(".workout-template").before(template);
            }

            $(template).show();
        }
    }

    /**
     * Setting up card hide and show mechanism
     */
    // let crdWorkoutElements = document.querySelectorAll(".collapsiblee");
    // It’s important to note that document.querySelectorAll() does not return an array, but a NodeList object.
    // You can iterate it with forEach or for..of, or you can transform it to an array with Array.from() if you want.
    // for (var element of crdWorkoutElements) {
        // let handler = toggleCard.bind(null, element);
        // element.removeEventListener("click", handler); // Remove the old one
        // element.addEventListener("click", handler);
    //}
    $(".collapsible").off("click");
    $(".collapsible").on("click", function() {
        toggleCard(this);
    });

    hideLoader();
    showWorkoutView();
}

/**
 * Update workouts on view
 */
function updateWorkoutsOnView() {
    // Update workouts
    for (var i in workouts) {
        var element = document.getElementById("workout-id-" + workouts[i].id);
        // If not exists then add it to the view (sorted alphabetically)
        if(element) {
            $(element).attr("id", "workout-id-"+workouts[i].id);
            $(element).find(".workout-name").text(workouts[i].name);
            $(element).find(".workout-description").html(workouts[i].description.replace(new RegExp('\r?\n','g'), "<br />"));
            $(element).find(".workout-datetime").text("Last updated at " + getFormatTimestamp(workouts[i].datetime));
        }
    }
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
        // here gets the id via workoutScoreDialog
        console.log("getWorkoutScoreIdFromDOM() :: WARN: Couldn't find any closest object");
        id = 0;
    }

    if (id > 0) {
        console.log("getWorkoutScoreIdFromDOM() :: INFO: Get score id " + id);
    } else {
        console.log("getWorkoutScoreIdFromDOM() :: WARN: Couldn't get score id. Its a new score.");
    }

    return id;
}

function addWorkoutScoresToView(workoutId) {
    $(".score-template").hide();
    let parentElement = $("#workout-id-"+workoutId);
    $(parentElement).find("[id^=score-id]").remove();
    let showScoreTemplate = $("#workout-id-"+workoutId).find(".score-template").clone();
    let index = getArrayIndexById(workouts, workoutId);

    if(index != null) {
        if(workouts[index].score.length > 0) {
            console.log("addWorkoutScoresToView() :: INFO: There are " + workouts[index].score.length + " scores available to display");
            for (var i in workouts[index].score) {

                let scoreId = workouts[index].score[i].id;
                let scoreValue = workouts[index].score[i].score;
                let scoreRx = workouts[index].score[i].rx;
                let scoreTimestamp = workouts[index].score[i].datetime;
                let scoreNote = workouts[index].score[i].note;

                // score mask to showing scores
                let showScoreTemplateTmp = $(showScoreTemplate).clone().first();
                $(showScoreTemplateTmp).removeClass("score-template");
                $(showScoreTemplateTmp).addClass("score");
                $(showScoreTemplateTmp).attr("id", "score-id-" + scoreId);
                $(showScoreTemplateTmp).find(".score-value").text(scoreValue);
                if(scoreRx == "true") {
                    $(showScoreTemplateTmp).find(".score-rx").text("Rx");
                } else {
                    $(showScoreTemplateTmp).find(".score-rx").text("");
                }
                $(showScoreTemplateTmp).find(".score-datetime").text(getShortFormatTimestamp(scoreTimestamp));
                $(showScoreTemplateTmp).find(".score-note").text(scoreNote);

                /**
                 * Set 'edit workout score' button
                 */
                $(showScoreTemplateTmp).find(".btn-edit-workout-score").click(function() {
                    console.log("click() :: btn-edit-workout-score :: INFO: Editing workout score");
                    let scoreId = getWorkoutScoreIdFromDOM(this);

                    $("#add-score-value").val(scoreValue);
                    if(scoreRx == "true") {
                        $("#add-score-rx").prop("checked", true);
                    } else {
                        $("#add-score-rx").prop("checked", false);
                    }
                    $("#add-score-datetime").val(getShortFormatTimestamp(scoreTimestamp));
                    $("#add-score-note").val(scoreNote);
                    setTitle("Edit workout score");
                    showWorkoutScoreDialog();
                    selScoreId = scoreId; // set to scoreId to identify its not a new score
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
        if(workouts[index].score.length > 0) {
            workoutChart = new Chart(workouts[index].score);
            workoutChart.init();
            workoutChart.draw();
        }
    } else {
        console.log("addWorkoutScoresToView() :: ERR: No index found");
    }
}

/**
 * MOVEMENTS
 */

/**
 * Init movements (add all movements to the view)
 */
function initMovementsOnView() {
    var movementTemplate = $(".movement-template").clone();
    $(movementTemplate).removeClass("movement-template");
    $(".movement-template").hide();

    // Removing all movements (refresh)
    $('#movement-view').find("[id^=movement-id]").remove();
    for (var i in movements) {
        var template = $(movementTemplate).clone().first();
        $(template).attr("id", "movement-id-"+movements[i].id);
        $(template).find(".movement-name").text(movements[i].movement);

        $(template).show();
        $(template).appendTo("#movement-view ul");
    }
    hideLoader();
    showMovementView();
}

/**
 * EQUIPMENT
 */

/**
 * Init movements (add all movements to the view)
 */
function initEquipmentOnView() {
    var equipmentTemplate = $(".equipment-template").clone();
    $(equipmentTemplate).removeClass("equipment-template");
    $(".equipment-template").hide();

    // Removing all equipment (refresh)
    $('#equipment-view').find("[id^=equipment-id]").remove();
    for (var i in equipment) {
        var template = $(equipmentTemplate).clone().first();
        $(template).attr("id", "equipment-id-"+equipment[i].id);
        $(template).find(".equipment-name").text(equipment[i].equipment);

        $(template).show();
        $(template).appendTo("#equipment-view ul");
    }
    hideLoader();
    showEquipmentView();
}
