'use strict';

import * as logger from "./logger.js";
import * as main from "./main.js";
import * as arrayHelper from "./array.js";
import * as config from "./config.js";
import * as cookie from "./cookie.js";
import * as guiHelper from "./gui.js";
import * as notification from "./notification.js";

import * as workoutHelper from "./workoutHelper.js";
import * as scoreHelper from "./scoreHelper.js";
import * as movementHelper from "./movementHelper.js";
import * as equipmentHelper from "./equipmentHelper.js";

export let
    equipment = [],
    movements = [],
    workouts = [];

/**
 * Ajax reuests
 * authentication
 */

/**
 * Ajax POST request /authentication/login
 * synchronious ajax call
 */
export function restUserLogin() {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/authentication/login",
        data: {
            name: $("#input-username").val(),
            password: CryptoJS.SHA256($("#input-password").val()).toString()
        },
        async: false,
        success: function(data) {
            // store the token
            // @todo when expired the token?
            main.user.token = data.token;
            main.user.loggedIn = true;
            cookie.createCookie("token", main.user.token, 7);
            guiHelper.handleLogin();

            logger.debug(JSON.stringify(data));
        },
        error: function(data) {
            logger.error("rest.js :: restUserLogin() :: POST /authentication/login :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restUserLogin() :: POST /authentication/login :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /authentication/validate
 */
export function restUserValidate() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/authentication/validate",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            main.user.loggedIn = true;
            guiHelper.handleLogin();

            logger.debug(JSON.stringify(data));
        },
        error: function(data) {
            guiHelper.showLoginDialog();
            logger.error("rest.js :: restUserValidate() :: POST /authentication/validate :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restUserLogin() :: POST /authentication/login :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
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
export function restGetEquipment() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/equipment",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            equipment = JSON.parse(data);
            equipment.sort(arrayHelper.compareByString);

            logger.debug(JSON.stringify(equipment));

            equipmentHelper.initEquipmentOnView();
        },
        error: function(data) {
            logger.error("rest.js :: restGetEquipment() :: GET /equipment :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetEquipment() :: GET /equipment :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
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
export function restGetMovements() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/movement",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            movements = JSON.parse(data);
            movements.sort(arrayHelper.compareByString);

            logger.debug(JSON.stringify(movements));

            movementHelper.initMovementsOnView();
        },
        error: function(data) {
            logger.error("rest.js :: restGetMovements() :: GET /movement :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetMovements() :: GET /movement :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
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
export function restGetWorkouts() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            workouts = JSON.parse(data);
            workouts.sort(arrayHelper.compareByString);

            logger.debug(JSON.stringify(workouts));

            workoutHelper.initWorkoutsOnView();
            notification.resetNotifications();
        },
        error: function(data) {
            logger.error("rest.js :: restGetWorkouts() :: GET /workout :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetWorkouts() :: GET /workout :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /workout/score/:workoutId
 */
export function restGetWorkoutScores(id) {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout/score/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            let index = arrayHelper.getArrayIndexById(workouts, id);
            if(index != null) {
                workouts[index].score = JSON.parse(data);
                workouts[index].score.sort(arrayHelper.compareByTimestamp).reverse();

                logger.debug(JSON.stringify(workouts[index].score));
            }

            scoreHelper.addWorkoutScoresToView(id);
        },
        error: function(data) {
            logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/:workoutId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /workout/:workoutId
 */
export function restGetWorkoutById(id) {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            let retWorkout = JSON.parse(data);
            logger.debug(JSON.stringify(retWorkout));

            var ret = arrayHelper.refreshArrayObject(workouts, retWorkout);
            workouts.sort(arrayHelper.compareByString);
            if(ret == 0) { // workout was added
                workoutHelper.initWorkoutsOnView();
            } else if(ret == 1)  { // workout was updated
                workoutHelper.updateWorkoutsOnView();
            } else {
                logger.error("rest.js :: restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Unable to update/add workout to array.");
            }
        },
        error: function(data) {
            logger.error("rest.js :: restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /workout
 * Add new workout
 */
export function restAddWorkout(workout) {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout",
        data: workout,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            let retWorkout = JSON.parse(data);
            logger.log("rest.js :: restAddWorkout() :: POST /workout :: SUCCESS: Workout was created.");
            logger.debug(JSON.stringify(retWorkout));

            // Getting fresh state of workout and update the view
            restGetWorkoutById(retWorkout.id);

            notification.addNotification("ok", "Success: Workout was created.", true);
        },
        error: function(data) {
            logger.error("rest.js :: restAddWorkout() :: POST /workout :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restAddWorkout() :: POST /workout :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /workout/id
 * Updating workout
 */
export function restUpdateWorkout(workout) {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/workout/" + workout.id,
        data: workout,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.log("rest.js :: restUpdateWorkout() :: POST /workout/:workoutId :: SUCCESS: Workout was updated.");
            logger.debug(JSON.stringify(data));

            // Getting fresh state of workout and update the view
            restGetWorkoutById(workout.id);

            notification.addNotification("ok", "Success: Workout was updated.", true);
        },
        error: function(data) {
            logger.error("rest.js :: restUpdateWorkout() :: POST /workout/:workoutId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restUpdateWorkout() :: POST /workout/:workoutId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
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
export function restGetScores() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/score",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            scores = JSON.parse(data);
            scores.sort(arrayHelper.compareByTimestamp).reverse();

            logger.debug(JSON.stringify(scores));
        },
        error: function(data) {
            logger.error("rest.js :: restGetScores() :: GET /score :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetScores() :: GET /score :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /score/:scoreId
 */
export function restGetScoreById(id) {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/score/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            let retScore = JSON.parse(data);
            // workouts[id].score = JSON.parse(data);

            logger.debug(JSON.stringify(retScore));
        },
        error: function(data) {
            logger.error("rest.js :: restGetScoreById() :: GET /score/:scoreId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetScoreById() :: GET /score/:scoreId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /score
 * Save new workout score
 */
export function restAddWorkoutScore(score) {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/score",
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            let retScore = JSON.parse(data);
            logger.log("rest.js :: restAddWorkoutScore() :: POST /score :: SUCCESS: Workout score was created.");
            logger.debug(JSON.stringify(retScore));

            // Getting fresh state of workout scores and update tehe view
            restGetWorkoutScores(retScore.workoutId);

            notification.addNotification("ok", "Success: Workout score was created.");
        },
        error: function(data) {
            logger.error("rest.js :: restAddWorkoutScore() :: POST /score :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restAddWorkoutScore() :: POST /score :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax POST request /score/id
 * Updating workout score
 */
export function restUpdateWorkoutScore(score) {
    $.ajax({
        type: "POST",
        url: config.REST_SERVER + ":" + config.REST_PORT + "/score/" + score.id,
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", main.user.token);
        },
        success: function(data) {
            logger.log("rest.js :: restUpdateWorkoutScore() :: POST /score/:scoreId :: SUCCESS: Workout score was updated.");
            logger.debug(JSON.stringify(data));

            // Getting fresh state of workout scores and update tehe view
            restGetWorkoutScores(score.workoutId);

            notification.addNotification("ok", "Success: Workout score was updated.");
        },
        error: function(data) {
            logger.error("rest.js :: restUpdateWorkoutScore() :: POST /score/:scoreId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restUpdateWorkoutScore() :: POST /score/:scoreId :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}
