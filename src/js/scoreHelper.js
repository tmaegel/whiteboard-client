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

export function resizeWorkoutScoreChart() {
    if(chart != null || chart != undefined) {
        chart.update();
        chart.draw();
    }
}

/**
 * Get the workout score id from DOM
 * @todo Umbenennen: isWorkoutScoreSelected?
 */
export function getWorkoutScoreIdFromDOM() {
    let elem = $(".score.select");
    if(elem[0]) {
        let id = $(elem).attr('id').replace("score-id-", "");
        if (id > 0) {
            logger.debug("scoreHelper.js :: getWorkoutScoreIdFromDOM() :: DEBUG: Get workout score id " + id);
            return id;
        } else {
            logger.error("scoreHelper.js :: getWorkoutScoreIdFromDOM() :: ERROR: Couldn't get workout score id");
            return -1;
        }
    } else {
        logger.log("scoreHelper.js :: getWorkoutScoreIdFromDOM() :: WARN: Couldn't find any closest object");
        return -1;
    }
}

export function addWorkoutScoresToView(workoutId) {
    $(".score-template").hide();
    let parentElement = $("#workout-id-"+workoutId);
    $(parentElement).find("[id^=score-id]").remove();
    let showScoreTemplate = $("#workout-id-"+workoutId).find(".score-template").clone();
    let index = arrayHelper.getArrayIndexById(request.workouts, workoutId);

    if(index != null) {
        if(request.workouts[index].score.length > 0) {
            logger.log("scoreHelper.js :: addWorkoutScoresToView() :: INFO: There are " + request.workouts[index].score.length + " scores available to display");
            for (var i in request.workouts[index].score) {

                let scoreId = request.workouts[index].score[i].id;
                let scoreValue = request.workouts[index].score[i].score;
                let scoreRx = request.workouts[index].score[i].rx;
                let scoreTimestamp = request.workouts[index].score[i].datetime;
                let scoreNote = request.workouts[index].score[i].note;

                // score mask to showing scores
                let showScoreTemplateTmp = $(showScoreTemplate).clone().first();
                $(showScoreTemplateTmp).removeClass("score-template");
                $(showScoreTemplateTmp).attr("id", "score-id-" + scoreId);
                $(showScoreTemplateTmp).addClass("score");
                $(showScoreTemplateTmp).find(".score-value").text(scoreValue);
                if(scoreRx == 1) {
                    logger.debug("scoreHelper.js :: addWorkoutScoresToView() :: DEBUG: scoreRx is true");
                    $(showScoreTemplateTmp).find(".score-rx").text("Rx");
                } else {
                    logger.debug("scoreHelper.js :: addWorkoutScoresToView() :: DEBUG: scoreRx is false");
                    $(showScoreTemplateTmp).find(".score-rx").text("");
                }
                $(showScoreTemplateTmp).find(".score-datetime").text(timeHelper.getShortFormatTimestamp(scoreTimestamp));
                $(showScoreTemplateTmp).find(".score-note").text(scoreNote);

                // Finally showing the score-mask
                $(showScoreTemplateTmp).appendTo("#workout-id-" + workoutId + " .scores");
                $(showScoreTemplateTmp).show();
            }
        } else {
            logger.log("scoreHelper.js :: addWorkoutScoresToView() :: INFO: There are no scores available to display");
        }
        // Drawing workout scores
        // add canvas to display the chart
        if(request.workouts[index].score.length > 0) {
            chart = new Chart(request.workouts[index].score);
            chart.init();
            chart.draw();
        }
    } else {
        logger.error("scoreHelper.js :: addWorkoutScoresToView() :: ERROR: No index found");
    }

    // set select status to score
    $(".score").on("click", function() {
        guiHelper.toggleCardItem(this);
    });
}

export function saveWorkoutScore() {
    logger.debug("scoreHelper.js :: saveWorkoutScore() :: DEBUG: Saving workout score");

    let workoutId = workoutHelper.getWorkoutIdFromDOM();
    let score;
    let scoreId = getWorkoutScoreIdFromDOM();
    let scoreValue = regexHelper.stripString($("#add-score-value").val());
    if(regexHelper.numRegex(scoreValue) || regexHelper.timestampRegex(scoreValue)) {
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
