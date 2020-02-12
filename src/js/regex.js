'use strict';

/**
 * REGEX
 */

/**
 * Checks if value is empty or contains spaces only
 */
export function empty(value) {
    if(value === undefined) {
        return false;
    }

    let regExp = /^[\n\t ]*$/g;

    return regExp.test(value);
}

/**
 * Simple regex check
 * [a-zA-Z_0-9ÄÜÖäüöß .,:&'-()/]
 */
export function simpleRegex(value) {
    if(value === undefined) {
        return false;
    }

    let regExp = /^[\wÄÜÖäüöß .,:&'"\-()/]*$/gm;

    return regExp.test(value);
}

/**
 * Extended regex check
 * [a-zA-Z_0-9ÄÜÖäüöß .,:;"#!?&@_-()%/*+]
 */
export function extendedRegex(value) {
    if(value === undefined) {
        return false;
    }

    let regExp = /^[\w\sÄÜÖäüöß.,:;"'!?&@_\-()%/*+]*$/g;

    return regExp.test(value);
}

/**
 * Number regex check
 * e.g. 1234
 */
export function numRegex(value) {
    if(value === undefined) {
        return false;
    }

    let regExp = /^\d+$/gm;

    return regExp.test(value);
}

/**
 * Floating number regex check
 * e.g. 123.45
 */
export function floatRegex(value) {
    if(value === undefined) {
        return false;
    }

    let regExp = /^[0-9]+[.]?[0-9]+$/gm;

    return regExp.test(value);
}

/**
 * Datetime regex check (dd.mm.YYY HH:MM)
 * e.g. 17.5.2019 19:21
 */
export function datetimeRegex(value) {
    if(value === undefined) {
        return false;
    }

    let regExp = /^\d{1,2}.\d{1,2}.\d{4} \d{1,2}([:]\d{1,2}){1,2}$/gm;

    return regExp.test(value);
}

/**
 * Timestamp regex check
 * e.g 19:21:23
 */
export function timestampRegex(value) {
    if(value === undefined) {
        return false;
    }

    let regExp = /^\d{1,2}(:\d{1,2}){1,2}$/gm;

    return regExp.test(value);
}

/**
 * Remove leading and tailing spaces/new lines/tabs
 * Strip multiple spaces, new lines, replace tabs, ...
 */
export function stripString(value) {
    if(value === undefined) {
        return false;
    }

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

    return string;
}
