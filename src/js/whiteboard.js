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
        $('#loginModal').modal("hide");
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
    $("#loginModal").modal('hide');
    $("#workoutModal").modal('hide');
    $("#workoutScoreModal").modal('hide');
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
 * Initialize workouts (add all workouts to the view)
 */
function initializeWorkouts() {
    var workoutTemplate = $(".workout-template").clone();
    $(".workout-template").hide();

    // Removing all workouts (refresh)
    $('#workout-view').find("[id^=view-workout-id]").remove();
    for (var i in workouts) {
        addWorkoutToView(workouts[i]);
    }
}

function addWorkoutToView(workout) {
    var workoutTemplate = $(".workout-template").clone();

    var templateTmp = $(workoutTemplate).clone().first();
    $(templateTmp).removeClass("workout-template");
    $(templateTmp).attr("id", "view-workout-id-"+workout.id);
    $(templateTmp).find(".view-workout-name").text(workout.name);
    $(templateTmp).find(".view-workout-description").html(workout.description.replace(new RegExp('\r?\n','g'), "<br />"));
    $(templateTmp).find(".view-workout-datetime").text("Last updated at " + getFormatTimestamp(workout.datetime));

    /**
     * Setting up 'card hide and show mechanism'
     */
    $(templateTmp).find(".card-clickable").click(function() {
        console.log("addWorkoutToView() :: INFO: Detect click event");

        if($(this).parents(".list-group-item").hasClass("card-active") == true) {
            console.log("addWorkoutToView() :: INFO: Deactivate current card");

            // Reset
            fullResetView();

            $(".card").hide();
            $(".card-title").show();
        } else {
            console.log("addWorkoutToView() :: INFO: Activate new card");

            // Reset
            fullResetView();

            selectedWorkoutId = $(this).parents(".list-group-item").attr('id').replace("view-workout-id-", "");
            if (selectedWorkoutId > 0) {
                console.log("addWorkoutToView() :: ERROR: selectedWorkoutId is " + selectedWorkoutId);
                restGetWorkoutScores(selectedWorkoutId);
            } else {
                console.log("addWorkoutToView() :: ERROR: selectedWorkoutId isn't greater than zero.");
            }

            $(this).parents(".list-group-item").addClass("padding-0");
            $(this).parents(".list-group-item").addClass("card-active");

            $(".card").hide();
            $(".card-title").show();

            $(this).next(".card").show();
            $(this).children(".card-title").hide();
        }
    });

    /**
     * Set 'edit workout' button
     */
    $(templateTmp).find(".btn-edit-workout").click(function() {
        console.log("click() :: .btn-edit-workout :: INFO: Activate card 'edit workout'");

        let workout = getArrayObject("workout", selectedWorkoutId);
        if(workout == 0) {
            console.log("click() :: .btn-edit-workout :: ERROR: No workout in array found");
        } else if(workout == -1) {
            console.log("click() :: .btn-edit-workout :: ERROR: Wrong type to get object from array");
        } else {
            $("#add-workout-name").val(workout.name);
            $("#add-workout-description").val(workout.description);
        }

        $("#workoutModal").find(".modal-title").text("Edit workout");
        $("#workoutModal").modal('show');
    });

    /**
     * Set 'add workout score' button
     */
    $(templateTmp).find(".btn-add-workout-score").click(function() {
        console.log("click() :: .btn-add-workout-score :: INFO: Activate card 'add workout score'");

        if (selectedWorkoutId > 0) {
            $("#add-score-value").val("");
            $("#add-score-datetime").val(getIETFTimestamp());
            $("#add-score-note").val("");
            $("#workoutScoreModal").find(".modal-title").text("Add workout score");
            $("#workoutScoreModal").modal('show');
        } else {
            console.log("click() :: .btn-add-workout-score :: ERROR: selectedWorkoutId isn't greater than zero.");
        }
    });

    $(templateTmp).appendTo("#workout-view .list-group");
    $(templateTmp).show();
}

function addWorkoutScoresToView(workoutId) {
    let parentElement = $("#view-workout-id-"+workoutId);
    $(parentElement).find("[id^=view-score-id]").remove();
    let showScoreTemplate = $("#view-workout-id-"+workoutId).find(".score-template").clone();
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
            $(showScoreTemplateTmp).attr("id", "view-score-id-" + scoreId);
            $(showScoreTemplateTmp).find(".view-score-value").text(scoreValue);
            $(showScoreTemplateTmp).find(".view-score-datetime").text(getIETFTimestamp(scoreTimestamp));
            $(showScoreTemplateTmp).find(".view-score-note").text(scoreNote);


            /**
             * Set 'edit workout score' button
             */
            $(showScoreTemplateTmp).find(".btn-edit-workout-score").click(function() {
                console.log("click() :: btn-edit-workout-score :: INFO: Editing workout score");
                let scoreId = $(this).parent().parent().attr("id").replace("view-score-id-", "");
                console.log("click() :: btn-edit-workout-score :: INFO: scoreId is " + scoreId);

                selectedScoreId = scoreId
                $("#add-score-value").val(scoreValue);
                $("#add-score-datetime").val(getIETFTimestamp(scoreTimestamp));
                $("#add-score-note").val(scoreNote);
                $("#workoutScoreModal").find(".modal-title").text("Add workout score");
                $("#workoutScoreModal").modal('show');
            });

            // Finally showing the view-score-mask and edit-score-mask
            $(showScoreTemplateTmp).appendTo("#view-workout-id-" + workoutId + " .scores");
            $(showScoreTemplateTmp).show();
        }
    } else {
        console.log("addWorkoutScoresToView() :: INFO: There are no scores available to display");
    }

    $("#view-workout-id-"+workoutId).find(".score-template").hide();
}

function updateWorkoutOnView(workout) {
    $("#view-workout-id-"+workout.id).find(".view-workout-name").text(workout.name);
    $("#view-workout-id-"+workout.id).find(".view-workout-description").html(workout.description.replace(new RegExp('\r?\n','g'), "<br />"));
    $("#view-workout-id-"+workout.id).find(".view-workout-datetime").text("Last updated at " + getFormatTimestamp(workout.datetime));
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
