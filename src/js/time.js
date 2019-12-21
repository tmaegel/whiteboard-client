'use strict';

import * as regexHelper from "./regex.js";

var daysShort = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]; // days of week (short)
var daysLong = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]; // days of week (long)
var monthsShort = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]; // days of week

/**
 * Get timestamp in seconds since 01.01.1970
 * Now or optional an specific timestamp
 */
export function getTimestamp(timestamp) {
    timestamp = timestamp || 0; // Optional parameter

    var now;
    if(timestamp == 0) {
        now = new Date();
    } else {
        now = new Date(Date.parse(timestamp));
        if(isNaN(now)) {
            console.debug("getTimestamp() :: WARN: Couldn't parse timestamp to UNIX timestamp. Try it in a different way.");
            if(regexHelper.datetimeRegex(timestamp)) {
                console.debug("getTimestamp() :: INFO: Detect timestamp (YY.mm.dd HH:MM:SS)");
                var tmp = timestamp.split(" ");
                var date = tmp[0].split(".");
                var time = tmp[1].split(":");
                now = new Date(date[2], date[1]-1, date[0], time[0], time[1], 0); // year, month, day, hours, minutes, seconds
            } else {
                console.debug("getTimestamp() :: ERROR: Couldn't parse timestamp to UNIX timestamp.");
                return false;
            }
        }
    }

    if(isNaN(now)) {
        console.debug("getTimestamp() :: ERROR: Couldn't parse timestamp to UNIX timestamp.");
        return false;
    }

    var datetime = Math.round(now.getTime()/1000);

    return datetime;
}

/**
 * Get timestamp with RFC2822 / IETF Syntax
 * e.g. 'Mon, 25 Dec 1995 13:30:00 GMT'
 */
export function getIETFTimestamp(timestamp) {
    timestamp = timestamp || 0; // Optional parameter

    var now;
    if(timestamp == 0) {
        now = new Date();
    } else {
        if(regexHelper.numRegex(timestamp)) {
            now = new Date(timestamp*1000);
        } else {
            console.debug("getIETFTimestamp() :: ERROR: Couldn't parse timestamp to IETF timestamp.");
            return false;
        }
    }

    let day = now.getDate();
    day = day > 9 ? day : '0' + day;
    let hours = now.getHours();
    hours = hours > 9 ? hours : '0' + hours;
    let minutes = now.getMinutes();
    minutes = minutes > 9 ? minutes : '0' + minutes;
    let seconds = now.getSeconds();
    seconds = seconds > 9 ? seconds : '0' + seconds;

    // following format 'Mon, 25 Dec 1995 13:30:00'
    var datetime = daysShort[now.getDay()] + ", " + day + " " + monthsShort[now.getMonth()] + " " + now.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;

    return datetime;
}

/**
 * Get timestamp in specific format
 * Now or optional an specific timestamp
 */
export function getFormatTimestamp(timestamp) {
    timestamp = timestamp || 0; // Optional parameter

    var now;
    if(timestamp == 0) {
        now = new Date();
    } else {
        if(regexHelper.numRegex(timestamp)) {
            now = new Date(timestamp*1000);
        } else {
            console.log("getFormatTimestamp() :: ERROR: Couldn't format timestamp.");
            return false;
        }
    }

    let day = now.getDate();
    day = day > 9 ? day : '0' + day;
    let month = now.getMonth()+1;
    month = month > 9 ? month : '0' + month;
    let hours = now.getHours();
    hours = hours > 9 ? hours : '0' + hours;
    let minutes = now.getMinutes();
    minutes = minutes > 9 ? minutes : '0' + minutes;

    var datetime = daysLong[now.getDay()] + ", " + day + "." + month + "." + now.getFullYear() + " " + hours + ":" + minutes;

    return datetime;
}

/**
 * Get timestamp in specific format (short, without weekday)
 * Now or optional an specific timestamp
 */
export function getShortFormatTimestamp(timestamp) {
    timestamp = timestamp || 0; // Optional parameter

    var now;
    if(timestamp == 0) {
        now = new Date();
    } else {
        if(regexHelper.numRegex(timestamp)) {
            now = new Date(timestamp*1000);
        } else {
            console.log("getShortFormatTimestamp() :: ERROR: Couldn't format timestamp.");
            return false;
        }
    }

    let day = now.getDate();
    day = day > 9 ? day : '0' + day;
    let month = now.getMonth()+1;
    month = month > 9 ? month : '0' + month;
    let hours = now.getHours();
    hours = hours > 9 ? hours : '0' + hours;
    let minutes = now.getMinutes();
    minutes = minutes > 9 ? minutes : '0' + minutes;

    var datetime = day + "." + month + "." + now.getFullYear() + " " + hours + ":" + minutes;

    return datetime;
}

/**
 * Convert timestamp to seconds
 * Valid timestamp format is "HH:MM:SS"
 */
export function timestampToSeconds(timestamp) {
    if(regexHelper.numRegex(timestamp)) {
        console.log("timestampToSeconds() :: INFO: Value is already a number. There is nothing to do.");
        return parseInt(timestamp);
    } else if(regexHelper.timestampRegex(timestamp)) {
        console.log("timestampToSeconds() :: INFO: Detect timestamp (HH:MM:SS)");
        var time = timestamp.split(":");
        return (parseInt(time[0]*3600) + parseInt(time[1]*60) + parseInt(time[2]));
    } else {
        console.log("timestampToSeconds() :: ERROR: Couldn't parse timestamp to UNIX timestamp.");
        return false;
    }
}
