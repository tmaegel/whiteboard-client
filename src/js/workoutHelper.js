'use strict';

import { Workout } from "./Workout.js";

import * as logger from "./logger.js";
import * as request from "./rest.js";
import * as timeHelper from "./time.js";
import * as regexHelper from "./regex.js";
import * as guiHelper from "./gui.js";
import * as notification from "./notification.js";

/**
 * If workout card element is active returns the id of card element.
 * If not returns -1
 * @returns {integer} id
 */
export function isWorkoutCardActive() {
    for(let workout of request.app.workouts) {
        if(workout.active) {
            return workout.id
        }
    }

    return -1
}

export function saveWorkout() {
    logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: Saving workout...");

    let workout;
    let workoutId = isWorkoutCardActive();
    let workoutName = request.app.$refs.dialogWorkout.getName();
    let workoutDescription = request.app.$refs.dialogWorkout.getDescription();

    if(workoutName != undefined && workoutDescription != undefined) {
        if(regexHelper.simpleRegex(workoutName) && !regexHelper.empty(workoutName)) {
            logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: simpleRegex() success");
            workoutName = regexHelper.stripString(workoutName);
        } else {
            notification.addNotification("error", "simpleRegex() :: ERROR: Found invalid characters.");
            return;
        }

        if(regexHelper.extendedRegex(workoutDescription) && !regexHelper.empty(workoutDescription)) {
            logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: extendedRegex() success");
            workoutDescription = regexHelper.stripString(workoutDescription);
        } else {
            notification.addNotification("error", "extendedRegex() :: ERROR: Found invalid characters.");
            return;
        }
    } else {
        logger.error("workoutHelper.js :: saveWorkout() :: ERROR: workoutName or workoutDescription aren't defined");
    }

    /**
     * UPDATE
     */
    if(workoutId > 0) {
        logger.debug("workoutHelper.js :: saveWorkout() :: INFO: Updating workout");
        workout = new Workout(workoutId, timeHelper.getTimestamp(), workoutName, workoutDescription);
        request.restUpdateWorkout(workout);
    /**
     * NEW
     */
    } else {
        logger.debug("workoutHelper.js :: saveWorkout() :: INFO: Creating new workout");
        /*workouts.sort(compareById);
        var id; // new workout id
        if(workouts.length > 0) {
            id = workouts[workouts.length - 1].id + 1;
            logger.debug(id);
        } else {
            id = 1;
        }*/
        workout = new Workout(0, timeHelper.getTimestamp(), workoutName, workoutDescription); // id = 0
        request.restAddWorkout(workout);
    }

    logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: workout objext is " + JSON.stringify(workout));
    request.app.hideAllDialogs();
    request.app.showWorkoutView();
}
