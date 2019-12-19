'use strict';

/**
 * Ajax reuests
 * authentication
 */

/**
 * Ajax POST request /authentication/login
 * synchronious ajax call
 */
function restUserLogin() {
    $.ajax({
        type: "POST",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/authentication/login",
        data: {
            name: $("#input-username").val(),
            password: CryptoJS.SHA256($("#input-password").val()).toString()
        },
        async: false,
        success: function(data) {
            // store the token
            // @todo when expired the token?
            user.token = data.token;
            user.loggedIn = true;
            createCookie("token", user.token, 7);
            handleLogin();

            if(debug) {
                console.log(JSON.stringify(data));
            }
        },
        error: function(data) {
            if(debug) {
                console.log("restUserLogin() :: POST /authentication/login :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restUserLogin() :: POST /authentication/login :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /authentication/validate
 */
function restUserValidate() {
    $.ajax({
        type: "GET",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/authentication/validate",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            user.loggedIn = true;
            handleLogin();

            if(debug) {
                console.log(JSON.stringify(data));
            }
        },
        error: function(data) {
            showLoginDialog();
            if(debug) {
                console.log("restUserValidate() :: POST /authentication/validate :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restUserLogin() :: POST /authentication/login :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax reuests
 * equipment
 */


/**
 * Ajax GET request /equipment
 */
function restGetEquipment() {
    $.ajax({
        type: "GET",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/equipment",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            equipment = JSON.parse(data);
            equipment.sort(compareByString);

            if(debug) {
                console.log(JSON.stringify(equipment));
            }

            initEquipmentOnView();
        },
        error: function(data) {
            if(debug) {
                console.log("restGetEquipment() :: GET /equipment :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restGetEquipment() :: GET /equipment :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax reuests
 * movement
 */

/**
 * Ajax GET request /movement
 */
function restGetMovements() {
    $.ajax({
        type: "GET",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/movement",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            movements = JSON.parse(data);
            movements.sort(compareByString);

            if(debug) {
                console.log(JSON.stringify(movements));
            }

            initMovementsOnView();
        },
        error: function(data) {
            if(debug) {
                console.log("restGetMovements() :: GET /movement :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restGetMovements() :: GET /movement :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax reuests
 * workout
 */

/**
 * Ajax GET request /workout
 */
function restGetWorkouts() {
    $.ajax({
        type: "GET",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/workout",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            workouts = JSON.parse(data);
            workouts.sort(compareByString);

            if(debug) {
                console.log(JSON.stringify(workouts));
            }

            initWorkoutsOnView();
            resetNotifications();
        },
        error: function(data) {
            if(debug) {
                console.log("restGetWorkouts() :: GET /workout :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restGetWorkouts() :: GET /workout :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /workout/score/:workoutId
 */
function restGetWorkoutScores(id) {
    $.ajax({
        type: "GET",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/workout/score/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            let index = getArrayIndexById(workouts, id);
            if(index != null) {
                workouts[index].score = JSON.parse(data);
                workouts[index].score.sort(compareByTimestamp).reverse();

                if(debug) {
                    console.log(JSON.stringify(workouts[index].score));
                }
            }

            addWorkoutScoresToView(id);
        },
        error: function(data) {
            if(debug) {
                console.log("restGetWorkoutScores() :: GET /workout/score/:workoutId :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restGetWorkoutScores() :: GET /workout/score/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /workout/:workoutId
 */
function restGetWorkoutById(id) {
    $.ajax({
        type: "GET",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/workout/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            let retWorkout = JSON.parse(data);
            if(debug) {
                console.log(JSON.stringify(retWorkout));
            }

            var ret = refreshArrayObject(workouts, retWorkout);
            workouts.sort(compareByString);
            if(ret == 0) { // workout was added
                initWorkoutsOnView();
            } else if(ret == 1)  { // workout was updated
                updateWorkoutsOnView();
            } else {
                console.log("restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Unable to update/add workout to array.");
            }
        },
        error: function(data) {
            if(debug) {
                console.log("restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /workout
 * Add new workout
 */
function restAddWorkout(workout) {
    $.ajax({
        type: "POST",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/workout",
        data: workout,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            console.log(JSON.stringify(data));
            let retWorkout = JSON.parse(data);
            if(debug) {
                console.log("restAddWorkout() :: POST /workout :: SUCCESS: Workout was created.");
                console.log(JSON.stringify(retWorkout));
            }

            // Getting fresh state of workout and update the view
            restGetWorkoutById(retWorkout.id);

            addNotification("ok", "Success: Workout was created.", true);
        },
        error: function(data) {
            if(debug) {
                console.log("restAddWorkout() :: POST /workout :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restAddWorkout() :: POST /workout :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /workout/id
 * Updating workout
 */
function restUpdateWorkout(workout) {
    $.ajax({
        type: "POST",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/workout/" + workout.id,
        data: workout,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            if(debug) {
                console.log("restUpdateWorkout() :: POST /workout/:workoutId :: SUCCESS: Workout was updated.");
                console.log(JSON.stringify(data));
            }

            // Getting fresh state of workout and update the view
            restGetWorkoutById(workout.id);

            addNotification("ok", "Success: Workout was updated.", true);
        },
        error: function(data) {
            if(debug) {
                console.log("restUpdateWorkout() :: POST /workout/:workoutId :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restUpdateWorkout() :: POST /workout/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax reuests
 * score
 */

/**
 * Ajax GET request /score
 */
function restGetScores() {
    $.ajax({
        type: "GET",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/score",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            scores = JSON.parse(data);
            scores.sort(compareByTimestamp).reverse();

            if(debug) {
                console.log(JSON.stringify(scores));
            }
        },
        error: function(data) {
            if(debug) {
                console.log("restGetScores() :: GET /score :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restGetScores() :: GET /score :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /score/:scoreId
 */
function restGetScoreById(id) {
    $.ajax({
        type: "GET",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/score/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            let retScore = JSON.parse(data);
            // workouts[id].score = JSON.parse(data);

            if(debug) {
                console.log(JSON.stringify(retScore));
            }
        },
        error: function(data) {
            if(debug) {
                console.log("restGetScoreById() :: GET /score/:scoreId :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restGetScoreById() :: GET /score/:scoreId :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /score
 * Save new workout score
 */
function restAddWorkoutScore(score) {
    $.ajax({
        type: "POST",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/score",
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            let retScore = JSON.parse(data);
            if(debug) {
                console.log("restAddWorkoutScore() :: POST /score :: SUCCESS: Workout score was created.");
                console.log(JSON.stringify(retScore));
            }

            // Getting fresh state of workout scores and update tehe view
            restGetWorkoutScores(retScore.workoutId);

            addNotification("ok", "Success: Workout score was created.");
        },
        error: function(data) {
            if(debug) {
                console.log("restAddWorkoutScore() :: POST /score :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restAddWorkoutScore() :: POST /score :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /score/id
 * Updating workout score
 */
function restUpdateWorkoutScore(score) {
    $.ajax({
        type: "POST",
        url: Config.REST_SERVER + ":" + Config.REST_PORT + "/score/" + score.id,
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", user.token);
        },
        success: function(data) {
            if(debug) {
                console.log("restUpdateWorkoutScore() :: POST /score/:scoreId :: SUCCESS: Workout score was updated.");
                console.log(JSON.stringify(data));
            }
            console.log("Success");

            // Getting fresh state of workout scores and update tehe view
            restGetWorkoutScores(score.workoutId);

            addNotification("ok", "Success: Workout score was updated.");
        },
        error: function(data) {
            if(debug) {
                console.log("restUpdateWorkoutScore() :: POST /score/:scoreId :: ERROR: Something went wrong.");
                console.log(JSON.stringify(data));
            }

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                console.log("restUpdateWorkoutScore() :: POST /score/:scoreId :: ERROR: Unknown error occurred.");
            } else {
                addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}
