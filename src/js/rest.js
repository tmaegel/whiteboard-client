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
 * tag
 */


/**
 * Ajax GET request /tag
 */
export function restGetTags() {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/tag",
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            store.setTags(data);
            restGetTagById(1);
            restGetTagById(2);
            store.hideLoader();
        },
        error: function(data) {
            logger.error("rest.js :: restGetTags() :: GET /tag :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetTags() :: GET /tag :: ERROR: Unknown error occurred.");
            } else {
                notification.addNotification("error", data.responseJSON.type + ": " + data.responseJSON.message);
            }
        }
    });
}

/**
 * Ajax GET request /tag/:tagId
 */
export function restGetTagById(id) {
    $.ajax({
        type: "GET",
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/tag/" + id,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.debug(JSON.stringify(data));
            store.setTagById(data, id);
        },
        error: function(data) {
            logger.error("rest.js :: restGetTagById() :: GET /tag/:tagId :: ERROR: Something went wrong.");
            logger.debug(JSON.stringify(data));

            if(data == null || data == undefined || data.responseJSON == null || data.responseJSON == undefined)  {
                logger.error("rest.js :: restGetTagById() :: GET /tag/:tagId :: ERROR: Unknown error occurred.");
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
            restGetTags();  // get all tag objects
            restGetScores();  // get all workout score objects; necessary to filter (last done, show only/no-completed workouts)
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
            store.setScoresByWorkoutId(data, id);
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
            store.setWorkoutById(data, id);
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
            logger.log("rest.js :: restAddWorkout() :: POST /workout :: SUCCESS: Workout was created.");
            logger.debug(JSON.stringify(data));
            store.addWorkout(data);
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
            logger.log("rest.js :: restUpdateWorkout() :: POST /workout/:workoutId :: SUCCESS: Workout was updated.");
            logger.debug(JSON.stringify(data));
            store.setWorkoutById(data, workout.id);
            notification.addNotification("ok", "Success: Workout was updated.");
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
            store.setScores(data);
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
            logger.log("rest.js :: restAddWorkoutScore() :: POST /score :: SUCCESS: Workout score was created.");
            logger.debug(JSON.stringify(data));
            store.addScore(data, score.workoutId);
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
        url: config.REST_SERVER + ":" + config.REST_PORT + config.REST_PATH + "/score/" + score.id,
        data: score,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", store.state.user.token);
        },
        success: function(data) {
            logger.log("rest.js :: restUpdateWorkoutScore() :: POST /score/:scoreId :: SUCCESS: Workout score was updated.");
            logger.debug(JSON.stringify(data));
            logger.debug(JSON.stringify(score));
            store.setScoreById(data, score.workoutId, score.id);
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
