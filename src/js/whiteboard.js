'use strict';

/**
 * Handle login mechanism
 */
function handleLogin() {
    user = new User($("#input-username").val(), $("#input-password").val());
    restUserLogin();    // login user
    restUserValidate(); // validate user
   
    if (user.token != undefined || user.token != null) {
        console.log("handleLogin() :: INFO :: Login successful.");
        console.log(user.token);
        $('.loginModal').modal("hide");
        $("#content").show();
        $("#dashboard-view").show();
    } else {
        console.log("handleLogin() :: ERROR :: Login failed.");
    }
}

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
     */
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

/**
 * OTHER
 */

function chart() {
    var x  = [];
    for (var i in workouts[1].scores) {
        x.push(parseInt(workouts[1].scores[i].score));
    }
    console.log(JSON.stringify(x));

    var ctx = $("#2").find(".chart")[0].getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                // label: "label",
                fill: false, // how to fill the area under the line
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 3, // the width of the line in pixels
                data: x,
            }]
        },
        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 8,
            title: { // title namespace
                display: false, // is the title shown
            },
            legend: { // legend namespace
                display: false, // is the title shown
            },
            layout: { // layout namespace
                padding: {
                    left: 5,
                    right: 25,
                    top: 25,
                    bottom: 15
                }
            },
            tooltips: { // tooltips namespace
                enabled: true,
                displayColors: false,
                mode: 'point',
                cornerRadius: 0,
                xPadding: 10,
                yPadding: 10
            },
            scales: {
                xAxes: [{
                    display: true, // if true, show tick marks
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: true,
                        drawTicks: true,
                        tickMarkLength: 10
                    },
                    ticks: {
                        display: true
                    }
                }],
                yAxes: [{
                    display: true, // if true, show tick marks
                    scaleLabel: {
                        display: false,
                        labelString: 'Value'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: true
                    },
                    ticks: {
                        display: true,
                        tickMarkLength: 1,
                        //beginAtZero:true,
                        //stepSize: 100,
                        //min: 0,
                        //max: 100,
                        maxTicksLimit: 5
                    }
                }]
            }
        }
    });
}
