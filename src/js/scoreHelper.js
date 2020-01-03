'use strict';

import { Chart } from "./Chart.js";
import { Score } from "./Score.js";

import * as request from "./rest.js";
import * as guiHelper from "./gui.js";
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

/**
 * Get the workout score id from DOM
 * @todo Umbenennen: isWorkoutScoreSelected?
 */
export function getWorkoutScoreIdFromDOM() {
    let elem = $(".score.select");
    if(elem[0]) {
        let id = $(elem).attr('id').replace("score-id-", "");
        if (id > 0) {
            console.log("getWorkoutScoreIdFromDOM() :: INFO: Get workout score id " + id);
            return id;
        } else {
            console.log("getWorkoutScoreIdFromDOM() :: ERROR: Couldn't get workout score id");
            return -1;
        }
    } else {
        console.log("getWorkoutScoreIdFromDOM() :: WARN: Couldn't find any closest object");
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
            console.log("addWorkoutScoresToView() :: INFO: There are " + request.workouts[index].score.length + " scores available to display");
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
                if(scoreRx == "true") {
                    $(showScoreTemplateTmp).find(".score-rx").text("Rx");
                } else {
                    $(showScoreTemplateTmp).find(".score-rx").text("");
                }
                $(showScoreTemplateTmp).find(".score-datetime").text(timeHelper.getShortFormatTimestamp(scoreTimestamp));
                $(showScoreTemplateTmp).find(".score-note").text(scoreNote);

                // Finally showing the score-mask
                $(showScoreTemplateTmp).appendTo("#workout-id-" + workoutId + " .scores");
                $(showScoreTemplateTmp).show();
            }
        } else {
            console.log("addWorkoutScoresToView() :: INFO: There are no scores available to display");
        }
        // Drawing workout scores
        // add canvas to display the chart
        if(request.workouts[index].score.length > 0) {
            chart = new Chart(request.workouts[index].score);
            chart.init();
            chart.draw();
        }
    } else {
        console.log("addWorkoutScoresToView() :: ERR: No index found");
    }

    // set select status to score
    $(".score").on("click", function() {
        guiHelper.toggleCardItem(this);
    });
}

export function saveWorkoutScore() {
    console.log("saveWorkoutScore() :: INFO: Saving workout score");

    let workoutId = workoutHelper.getWorkoutIdFromDOM();
    let score;
    let scoreId = getWorkoutScoreIdFromDOM();
    let scoreValue = regexHelper.stripString($("#add-score-value").val());
    if(regexHelper.numRegex(scoreValue) || regexHelper.timestampRegex(scoreValue)) {
        console.log("saveWorkoutScore() :: DEBUG: scoreValue is " + scoreValue);
        console.log("saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        notification.addNotification("error", "numRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreDatetime = regexHelper.stripString($("#add-score-datetime").val());
    let scoreDateTimeUnix = timeHelper.getTimestamp(scoreDatetime);
    if(scoreDateTimeUnix) {
        console.log("saveWorkoutScore() :: DEBUG: scoreDatetime is " + scoreDatetime + " (UTS:"+ scoreDateTimeUnix +")");
        console.log("saveWorkoutScore() :: DEBUG: numRegex() success");
    } else {
        notification.addNotification("error", "datetimeRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreNote = regexHelper.stripString($("#add-score-note").val());
    if(regexHelper.simpleRegex(scoreDatetime)) {
        console.log("saveWorkoutScore() :: DEBUG: scoreNote is " + scoreNote);
        console.log("saveWorkoutScore() :: DEBUG: simpleRegex() success");
    } else {
        notification.addNotification("error", "simpleRegex() :: ERROR: Found invalid characters.");
        return;
    }

    let scoreRx;
    if($('#add-score-rx').is(":checked")) {
        console.log("saveWorkoutScore() :: DEBUG: scoreRx is true");
        scoreRx = true;
    } else {
        console.log("saveWorkoutScore() :: DEBUG: scoreRx is false");
        scoreRx = false;
    }

    /**
     * UPDATE
     */
    if(scoreId > 0) {
        console.log("saveWorkoutScore() :: DEBUG: Updating workout score");
        score = new Score(scoreId, workoutId, scoreValue, scoreRx, scoreDateTimeUnix, scoreNote); // id != -1 (update score)
        request.restUpdateWorkoutScore(score);
    /**
     * NEW
     */
    } else {
        console.log("saveWorkoutScore() :: DEBUG: Creating workout score");
        score = new Score(-1, workoutId, scoreValue, scoreRx, scoreDateTimeUnix, scoreNote); // id = -1 (new score)
        request.restAddWorkoutScore(score);
    }

    console.log("saveWorkoutScore() :: DEBUG: score objext is " + JSON.stringify(score));
    guiHelper.hideAllDialogs();
}
