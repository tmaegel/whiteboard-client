'use strict';

//import CryptoJS from 'crypt-js';
import sha256 from 'crypto-js/sha256';

import * as app from "./index.js";
import store from './store.js';
import notification from "./notification.js";

import * as logger from "./logger.js";
import * as arrayHelper from "./array.js";
import * as config from "./config.js";
import * as cookie from "./cookie.js";
import * as timeHelper from "./time.js";

import * as workoutHelper from "./workoutHelper.js";
import * as scoreHelper from "./scoreHelper.js";
import * as movementHelper from "./movementHelper.js";
import * as equipmentHelper from "./equipmentHelper.js";

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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/authentication/login",
        data: {
            name: store.getUserObject().name,
            password: sha256(store.getUserObject().password).toString()
        },
        async: false,
        success: function(data) {
            // store the token
            // @todo when expired the token?
            store.setToken(data.token);
            cookie.createCookie("token", store.getUserObject().token, 7);
            app.handleLogin();

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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/authentication/validate",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            store.login();
            app.handleLogin();

            logger.debug(JSON.stringify(data));
        },
        error: function(data) {
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/equipment",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            store.setEquipment(data);
            store.hideLoader();
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/movement",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            store.setMovements(data);
            store.hideLoader();
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/workout",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            store.setWorkouts(data);
            store.hideLoader();
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/workout/score/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(store.state.workouts, id);
            if(workoutIndex != null) {
                store.setScoresByIndex(data, workoutIndex);
            } else {
                logger.error("rest.js :: restGetWorkoutScores() :: GET /workout/score/ :: ERROR: Unable to update/add workout scores to array.");
            }
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/workout/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(store.state.workouts, id);
            if(workoutIndex != null) {
                store.setWorkoutByIndex(data, workoutIndex);
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/workout",
        data: workout,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            store.setWorkout(data);
            logger.log("rest.js :: restAddWorkout() :: POST /workout :: SUCCESS: Workout was created.");
            notification.addNotification("ok", "Success: Workout was created.");
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/workout/" + workout.id,
        data: workout,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(store.state.workouts, workout.id);
            if(workoutIndex != null) {
                store.setWorkoutByIndex(data, workoutIndex);
                logger.log("rest.js :: restUpdateWorkout() :: POST /workout/:workoutId :: SUCCESS: Workout was updated.");
                notification.addNotification("ok", "Success: Workout was updated.");
            } else {
                logger.error("rest.js :: restGetWorkoutById() :: GET /workout/:workoutId :: ERROR: Unable to update/add workout to array.");
            }
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/score",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            logger.log("rest.js :: restGetScores() :: GET /score :: SUCCESS: TODO");
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/score/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            logger.log("rest.js :: restGetScoreById() :: GET /score/:scoreId :: SUCCESS: TODO");
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/score",
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(store.state.workouts, score.workoutId);
            if(workoutIndex != null) {
                store.setScore(data, workoutIndex);
                logger.log("rest.js :: restAddWorkoutScore() :: POST /score :: SUCCESS: Workout score was created.");
                notification.addNotification("ok", "Success: Workout score was created.");
            } else {
                logger.error("rest.js :: restAddWorkoutScore() :: GET /workout/score/ :: ERROR: Unable to update/add workout score to array.");
            }
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/score/" + score.id,
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            let workoutIndex = arrayHelper.getArrayIndexById(store.state.workouts, score.workoutId);
            if(workoutIndex != null) {
                let scoreIndex = arrayHelper.getArrayIndexById(store.state.workouts[workoutIndex].score, score.id);
                if(scoreIndex != null) {
                    store.setScoreByIndex(data, workoutIndex, scoreIndex);
                    logger.log("rest.js :: restUpdateWorkoutScore() :: POST /score/:scoreId :: SUCCESS: Workout score was updated.");
                    notification.addNotification("ok", "Success: Workout score was updated.");
                } else {
                    logger.error("rest.js :: restUpdateWorkoutScore() :: GET /workout/score/ :: ERROR: Unable to update/add workout score to array.");
                }
            } else {
                logger.error("rest.js :: restUpdateWorkoutScore() :: GET /workout/score/ :: ERROR: Unable to update/add workout score to array.");
            }
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
