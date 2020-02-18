'use strict';

import { Chart } from "./Chart.js";
import { Score } from "./Score.js";

import * as logger from "./logger.js";
import * as request from "./rest.js";
import * as guiHelper from "./gui.js";
import * as timeHelper from "./time.js";
import * as regexHelper from "./regex.js";
import * as arrayHelper from "./array.js";
import * as notification from "./notification.js";
import * as workoutHelper from "./workoutHelper.js";

let chart;

/**
 * If score item is selected returns the id of item
 * If not returns -1
 * @returns {integer} id
 */
export function isScoreItemSelected(index) {
    if(index >= 0) {
        for(let score of request.app.workouts[index].score) {
            if(score.selected) {
                return score.id;
            }
        }
    }
    return -1;
}

export function resizeWorkoutScoreChart() {
    if(chart != null || chart != undefined) {
        chart.update();
        chart.draw();
    }
}

export function saveWorkoutScore() {
    logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: Saving workout score");

    let workoutId = workoutHelper.isWorkoutCardActive();
    let score;
    let scoreId = isScoreItemSelected(arrayHelper.getArrayIndexById(request.app.workouts, workoutId));
    let scoreValue = regexHelper.stripString($("#add-score-value").val());
    if(regexHelper.numRegex(scoreValue) || regexHelper.floatRegex(scoreValue) || regexHelper.timestampRegex(scoreValue)) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreValue is " + scoreValue);
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        notification.addNotification("error", "numRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreDatetime = regexHelper.stripString($("#add-score-datetime").val());
    let scoreDateTimeUnix = timeHelper.getTimestamp(scoreDatetime);
    if(scoreDateTimeUnix) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreDatetime is " + scoreDatetime + " (UTS:"+ scoreDateTimeUnix +")");
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        notification.addNotification("error", "datetimeRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreNote = regexHelper.stripString($("#add-score-note").val());
    if(regexHelper.simpleRegex(scoreDatetime)) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreNote is " + scoreNote);
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: simpleRegex() success");
    } else {
        notification.addNotification("error", "simpleRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreRx;
    if($('#add-score-rx').is(":checked")) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreRx is true");
        scoreRx = 1;
    } else {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreRx is false");
        scoreRx = 0;
    }

    /**
     * UPDATE
     */
    if(scoreId > 0) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: Updating workout score");
        score = new Score(scoreId, workoutId, scoreValue, scoreRx, scoreDateTimeUnix, scoreNote); // id > 0 (update score)
        request.restUpdateWorkoutScore(score);
    /**
     * NEW
     */
    } else {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: Creating workout score");
        score = new Score(0, workoutId, scoreValue, scoreRx, scoreDateTimeUnix, scoreNote); // id = 0 (new score)
        request.restAddWorkoutScore(score);
    }

    logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: score objext is " + JSON.stringify(score));
    guiHelper.hideAllDialogs();
}
