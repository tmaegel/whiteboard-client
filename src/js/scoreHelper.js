'use strict';

import { Chart } from "./Chart.js";

import store from './store.js';
import app from "./index.js";
import notification from "./notification.js";

import * as logger from "./logger.js";
import * as request from "./rest.js";
import * as timeHelper from "./time.js";
import * as regexHelper from "./regex.js";
import * as arrayHelper from "./array.js";
import * as workoutHelper from "./workoutHelper.js";

let chart;

export function resizeWorkoutScoreChart() {
    if(chart != null || chart != undefined) {
        chart.update();
        chart.draw();
    }
}

export function saveWorkoutScore() {
    logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: Saving workout score");

    let score = store.getScoreDialogObject();
    score.score = regexHelper.stripString(score.score);
    if(regexHelper.numRegex(score.score) || regexHelper.floatRegex(score.score) || regexHelper.timestampRegex(score.score)) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreValue is " + score.score);
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        notification.addNotification("error", "numRegex() :: ERROR: Found invalid characters.");
        return;
    }

    score.datetime = regexHelper.stripString(score.datetime);
    let scoreDateTimeUnix = timeHelper.getTimestamp(score.datetime);
    if(scoreDateTimeUnix) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreDatetime is " + score.datetime + " (UTS:"+ scoreDateTimeUnix +")");
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        notification.addNotification("error", "datetimeRegex() :: ERROR: Found invalid characters.");
        return;
    }

    score.note = regexHelper.stripString(score.note);
    if(regexHelper.simpleRegex(score.note)) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreNote is " + score.note);
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: simpleRegex() success");
    } else {
        notification.addNotification("error", "simpleRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreRx;
    if(score.rx) {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreRx is true");
        score.rx = 1;
    } else {
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: scoreRx is false");
        score.rx = 0;
    }

    let scoreObj;
    let workoutId = store.getActiveWorkoutId();
    let scoreId = store.getSelectedScoreId(workoutId);
    if(workoutId != -1) {
        /**
         * UPDATE
         */
        if(scoreId > 0) {
            logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: Updating workout score");
            scoreObj = {
                id: scoreId, // id > 0 (update score)
                workoutId: workoutId,
                score: score.score,
                rx: score.rx,
                datetime: scoreDateTimeUnix,
                note: score.note
            }
            request.restUpdateWorkoutScore(scoreObj);
        /**
         * NEW
         */
        } else {
            logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: Creating workout score");
            scoreObj = {
                id: 0, // id = 0 (new score)
                workoutId: workoutId,
                score: score.score,
                rx: score.rx,
                datetime: scoreDateTimeUnix,
                note: score.note
            }
            request.restAddWorkoutScore(scoreObj);
        }
        logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: score objext is " + JSON.stringify(scoreObj));
    } else {
        logger.error("scoreHelper.js :: saveWorkoutScore() :: ERROR: No workoutId could be determined");
    }
    store.hideLoader();
}
