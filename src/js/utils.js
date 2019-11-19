'use strict';

var daysShort = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]; // days of week (short)
var daysLong = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]; // days of week (long)
var monthsShort = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]; // days of week

/**
 * Get timestamp in seconds since 01.01.1970
 * Now or optional an specific timestamp
 */
function getTimestamp(timestamp) {
    timestamp = timestamp || 0; // Optional parameter

    var now;
    if(timestamp == 0) {
        now = new Date();
    } else {
        now = new Date(Date.parse(timestamp));
        if(isNaN(now)) {
            console.log("getTimestamp() :: WARN: Couldn't parse timestamp to UNIX timestamp. Try it in a different way.");
            // @todo regex check before do this stuff
            var tmp = timestamp.split(" ");
            var date = tmp[0].split(".");
            var time = tmp[1].split(":");
            now = new Date(date[2], date[1]-1, date[0], time[0], time[1], 0); // year, month, day, hours, minutes, seconds
        }
    }

    if(isNaN(now)) {
        console.log("getTimestamp()() :: ERROR: Couldn't parse timestamp to UNIX timestamp.");
    }

    var datetime = Math.round(now.getTime()/1000);

    return datetime;
}

/**
 * Get timestamp with RFC2822 / IETF Syntax
 * e.g. 'Mon, 25 Dec 1995 13:30:00 GMT'
 */
function getIETFTimestamp(timestamp) {
    timestamp = timestamp || 0; // Optional parameter

    var now;
    if(timestamp == 0) {
        now = new Date();
    } else {
        now = new Date(timestamp*1000);
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
function getFormatTimestamp(timestamp) {
    timestamp = timestamp || 0; // Optional parameter

    var now;
    if(timestamp == 0) {
        now = new Date();
    } else {
        now = new Date(timestamp*1000);
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
function getShortFormatTimestamp(timestamp) {
    timestamp = timestamp || 0; // Optional parameter

    var now;
    if(timestamp == 0) {
        now = new Date();
    } else {
        now = new Date(timestamp*1000);
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
 * REGEX
 */

/**
 * Checks if value empty or contains spaces only
 */
function empty(value) {
    let regExp = /^ *$/g

    return regExp.test(value)
}

/**
 * Simple regex check
 * [a-zA-Z_0-9 .,:&'-()/]
 */
function simpleRegex(value) {
    let regExp = /^[\w .,:&'\-\(\)\/]*$/gm;

    return regExp.test(value)
}

/**
 * Extended regex check
 * [a-zA-Z_0-9 .,:;"#!?&@_-()%/*+]
 */
function extendedRegex(value) {
    let regExp = /^[\w\s.,:;"'!?&@\_\-\(\)\%\/\*+]*$/g;

    return regExp.test(value);
}

/**
 * Number regex check
 * e.g. 1234
 */
function numRegex(value) {
    let regExp = /^\d+$/gm;

    return regExp.test(value);
}

/**
 * Datetime regex check
 * e.g. 17.5.2019 19:21
 */
function datetimeRegex(value) {
    let regExp = /^\d{1,2}.\d{1,2}.\d{4}\ \d{1,2}([:]\d{1,2}){1,2}$/gm;

    return regExp.test(value);
}

/**
 * Timestamp regex check
 * e.g 19:21:23
 */
function timestampRegex(value) {
    let regExp = /^\d{1,2}(:\d{1,2}){1,2}$/gm;

    return regExp.test(value);
}

/**
 * Remove leading and tailing spaces/new lines/tabs
 * Strip multiple spaces, new lines, replace tabs, ...
 */
function stripString(value) {
    let string = value;
    let regExpLeadingTailingSpaces = /^\s+|\s+$/g;
    string = string.replace(regExpLeadingTailingSpaces, "");

    // Dont allow multiple spaces
    let regExpMultipleSpaces = / {2,}/g;
    string = string.replace(regExpMultipleSpaces, " ");

    // Allow only single or two new lines
    let regExpNewLines = /[\r\n]{2,}/g;
    string = string.replace(regExpNewLines, "\n\n");

    // Replace all tabs
    let regExpTabluar = /[\x0B\f\t]*/g;
    string = string.replace(regExpTabluar, "");

    console.log("/"+string+"/");

    return string;
}

/**
 * ARRAY
 */

/**
 * Sort by id
 */
function compareById(object1, object2) {
    if(object1.id != undefined || object2.id != undefined) {
        if(object1.id < object2.id) {
            return -1;
        } else if(object1.id > object2.id) {
            return 1;
        } else {
            return 0;
        }
    } else {
        console.log("compareById() :: ERROR :: No valid variable 'id' found to compare");
    }
}

/**
 * Sort by datetime/timestamp
 */
function compareByTimestamp(object1, object2) {
    if(object1.datetime != undefined || object2.datetime != undefined) {
        if(object1.datetime < object2.datetime) {
            return -1;
        } else if(object1.datetime > object2.datetime) {
            return 1;
        } else {
            return 0;
        }
    } else {
        console.log("compareByTimestamp() :: ERROR :: No valid variable 'datetime' found to compare");
    }
}

/**
 * Sort by string
 */
function compareByString(object1, object2) {
    if(object1.name != undefined || object2.name != undefined) {
        return object1.name.localeCompare(object2.name);
    } else if(object1.movement != undefined || object2.movement != undefined) {
        return object1.movement.localeCompare(object2.movement);
    } else if(object1.equipment != undefined || object2.equipment != undefined) {
        return object1.equipment.localeCompare(object2.equipment);
    } else if(object1.score != undefined || object2.score != undefined) {
        return object1.score.localeCompare(object2.score);
    } else {
        console.log("compareByString() :: ERROR :: No valid variable found to compare");
    }
}

/**
 * Concat score array of every workout
 */
function concatWorkoutScores() {
    let arr = [];
    for (var i in workouts) {
        if(i == 0) {
            arr = workouts[i].score;
        } else {
            arr.concat(workouts[i].score);
        }
    }

    return arr;
}

/**
 * Search in array for object by id and update (when exists) or add (when not exists) it
 * @return 0 if object added
 * @return 1 if object updated
 * @return -1 if wrong type specified
 */
function refreshArrayObject(type, object) {
    if (type == "workout") {
        for (var i in workouts) {
            if(object.id == workouts[i].id) {
                workouts[i] = object;
                return 1;
            }
        }
        workouts.push(object);
        return 0;
    } else {
        return -1;
    }
}

/**
 * Search in array for object by id and return it
 */
function getArrayObject(type, id) {
    if (type == "workout") {
        for (var i in workouts) {
            if(id == workouts[i].id) {
                return workouts[i];
            }
        }
        return 0;
    } else {
        return -1;
    }
}

/**
 * Returns all objects that do contain the string
 */
function getArrayObjectsByName(array, search) {
    let arr = [];
    array.forEach((element, index, array) => {
        if (element.name.toLowerCase().includes(search.toLowerCase())) { // case insensitive
            arr.push(element);
        }
    });

    return arr;
}
