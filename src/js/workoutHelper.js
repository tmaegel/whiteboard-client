'use strict';

import store from './store.js';
import app from "./index.js";
import notification from "./notification.js";

import * as logger from "./logger.js";
import * as request from "./rest.js";
import * as timeHelper from "./time.js";
import * as regexHelper from "./regex.js";

export function saveWorkout() {
    logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: Saving workout...");

    let workout = store.getWorkoutDialogObject();
    if(workout.name != undefined && workout.description != undefined) {
        if(regexHelper.simpleRegex(workout.name) && !regexHelper.empty(workout.name)) {
            logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: simpleRegex() success");
            workout.name = regexHelper.stripString(workout.name);
        } else {
            notification.addNotification("error", "simpleRegex() :: ERROR: Found invalid characters.");
            return;
        }
        if(regexHelper.extendedRegex(workout.description) && !regexHelper.empty(workout.description)) {
            logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: extendedRegex() success");
            workout.description = regexHelper.stripString(workout.description);
        } else {
            notification.addNotification("error", "extendedRegex() :: ERROR: Found invalid characters.");
            return;
        }
    } else {
        logger.error("workoutHelper.js :: saveWorkout() :: ERROR: name or description of the workout aren't defined");
    }


    let workoutObj;
    let workoutId = store.getActiveWorkoutId();
    /**
     * UPDATE
     */
    if(workoutId > 0) {
        logger.debug("workoutHelper.js :: saveWorkout() :: INFO: Updating workout");
        workoutObj = {
            id: workoutId, // id > 0 (update workout)
            datetime: timeHelper.getTimestamp(),
            name: workout.name,
            description: workout.description
        }
        request.restUpdateWorkout(workoutObj);
    /**
     * NEW
     */
    } else {
        logger.debug("workoutHelper.js :: saveWorkout() :: INFO: Creating new workout");
        workoutObj = {
            id: 0, // id = 0 (add workout)
            datetime: timeHelper.getTimestamp(),
            name: workout.name,
            description: workout.description
        }
        request.restAddWorkout(workoutObj);
    }
    logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: workout objext is " + JSON.stringify(workoutObj));
    store.hideLoader();
}
