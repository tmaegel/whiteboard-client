'use strict';

import { Workout } from "./Workout.js";

import * as logger from "./logger.js";
import * as request from "./rest.js";
import * as timeHelper from "./time.js";
import * as regexHelper from "./regex.js";
import * as guiHelper from "./gui.js";
import * as notification from "./notification.js";

export function hideWorkoutCards() {
    let workoutElements = document.querySelectorAll(".workout");
    workoutElements.forEach((element, index, workoutElements) => {
        element.style.display = "none";
    });
}
export function showWorkoutCards() {
    let workoutElements = document.querySelectorAll(".workout");
    workoutElements.forEach((element, index, workoutElements) => {
        element.style.display = "block";
    });
}

/**
 * Get the workout id from DOM
 * @todo Umbenennen: isWorkoutSelected?
 */
export function getWorkoutIdFromDOM() {
    let elem = $(".workout.active");
    if(elem[0]) {
        let id = $(elem).attr('id').replace("workout-id-", "");
        if (id > 0) {
            logger.debug("workoutHelper.js :: getWorkoutIdFromDOM() :: DEBUG: Get workout id " + id);
            return id;
        } else {
            logger.error("workoutHelper.js :: getWorkoutIdFromDOM() :: ERROR: Couldn't get workout id");
            return -1;
        }
    } else {
        logger.log("workoutHelper.js :: getWorkoutIdFromDOM() :: WARN: Couldn't find any closest object");
        return -1;
    }
}

/**
 * Init or added non-existing workouts on view
 */
export function initWorkoutsOnView() {
    $(".workout-template").hide();
    var workoutTemplate = $(".workout-template").clone();
    $(workoutTemplate).removeClass("workout-template");
    $(workoutTemplate).addClass("workout");

    // Init or add non-existing workouts
    for (var i in request.workouts) {
        var workoutElement = document.getElementById("workout-id-" + request.workouts[i].id);
        // If not exists then add it to the view (sorted alphabetically)
        if(!workoutElement) {
            var template = $(workoutTemplate).clone().first();
            $(template).attr("id", "workout-id-"+request.workouts[i].id);
            $(template).find(".workout-name").text(request.workouts[i].name);
            $(template).find(".workout-description").html(request.workouts[i].description.replace(new RegExp('\r?\n','g'), "<br />"));
            $(template).find(".workout-datetime").text("Last updated at " + timeHelper.getFormatTimestamp(request.workouts[i].datetime));

            // If there is a next element then add the current element before it
            if(i < request.workouts.length - 1) {
                var nextWorkoutElement = document.getElementById("workout-id-" + request.workouts[parseInt(i) + parseInt(1)].id);
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
        guiHelper.toggleCard(this);
    });

    guiHelper.hideLoader();
    guiHelper.showWorkoutView();
}

/**
 * Update workouts on view
 */
export function updateWorkoutsOnView() {
    // Update workouts
    for (let workout of request.workouts) {
        var element = document.getElementById("workout-id-" + workout.id);
        // If not exists then add it to the view (sorted alphabetically)
        if(element) {
            $(element).attr("id", "workout-id-"+workout.id);
            $(element).find(".workout-name").text(workout.name);
            $(element).find(".workout-description").html(workout.description.replace(new RegExp('\r?\n','g'), "<br />"));
            $(element).find(".workout-datetime").text("Last updated at " + timeHelper.getFormatTimestamp(workout.datetime));
        }
    }
}

export function saveWorkout() {
    logger.debug("workoutHelper.js :: saveWorkout() :: DEBUG: Saving workout...");

    let workout;
    let workoutId = getWorkoutIdFromDOM();
    let workoutName = $("#add-workout-name").val();
    let workoutDescription = $("#add-workout-description").val();

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
    guiHelper.hideAllDialogs();
}
