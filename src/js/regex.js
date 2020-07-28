'use strict';

/**
 * REGEX
 */

/**
 * Checks if value is empty or contains spaces only.
 * @param {string} value to check
 * @return {boolean} result of the regex check.
 */
export function empty(value) {
  if (value === undefined) {
    return false;
  }

  const regExp = /^[\n\t ]*$/g;

  return regExp.test(value);
}

/**
 * Simple regex check
 * [a-zA-Z_0-9ÄÜÖäüöß .,:&'-()/]
 * @param {string} value to check
 * @return {boolean} result of the regex check.
 */
export function simpleRegex(value) {
  if (value === undefined) {
    return false;
  }

  const regExp = /^[\wÄÜÖäüöß .,:&'"\-()/]*$/gm;

  return regExp.test(value);
}

/**
 * Extended regex check
 * [a-zA-Z_0-9ÄÜÖäüöß .,:;"#!?&@_-()%/*+]
 * @param {string} value to check
 * @return {boolean} result of the regex check.
 */
export function extendedRegex(value) {
  if (value === undefined) {
    return false;
  }

  const regExp = /^[\w\sÄÜÖäüöß.,:;"'!?&@_\-()%/*+]*$/g;

  return regExp.test(value);
}

/**
 * Checks if value contains numbers only.
 * e.g. 1234
 * @param {string} value to check
 * @return {boolean} result of the regex check.
 */
export function numRegex(value) {
  if (value === undefined) {
    return false;
  }

  const regExp = /^\d+$/gm;

  return regExp.test(value);
}

/**
 * Checks if value contains numbers or floating numbers only.
 * e.g. 123.45
 * @param {string} value to check
 * @return {boolean} result of the regex check.
 */
export function floatRegex(value) {
  if (value === undefined) {
    return false;
  }

  const regExp = /^[0-9]+[.]?[0-9]+$/gm;

  return regExp.test(value);
}

/**
 * Checks if value contains a datetime string with following format: dd.mm.YYY HH:MM
 * e.g. 17.5.2019 19:21
 * @param {string} value to check
 * @return {boolean} result of the regex check.
 */
export function datetimeRegex(value) {
  if (value === undefined) {
    return false;
  }

  const regExp = /^\d{1,2}.\d{1,2}.\d{4} \d{1,2}([:]\d{1,2}){1,2}$/gm;

  return regExp.test(value);
}

/**
 * Checks if value contains a timestamp string with following format: HH:MM:SS
 * e.g 19:21:23
 * @param {string} value to check
 * @return {boolean} result of the regex check.
 */
export function timestampRegex(value) {
  if (value === undefined) {
    return false;
  }

  const regExp = /^\d{1,2}(:\d{1,2}){1,2}$/gm;

  return regExp.test(value);
}

/**
 * Remove leading and tailing spaces/new lines/tabs
 * Strip multiple spaces, new lines, replace tabs, ...
 * @param {string} value to strip
 * @return {boolean} stripped value.
 */
export function stripString(value) {
  if (value === undefined) {
    return false;
  }

  let string = value;
  const regExpLeadingTailingSpaces = /^\s+|\s+$/g;
  string = string.replace(regExpLeadingTailingSpaces, '');

  // Dont allow multiple spaces
  const regExpMultipleSpaces = / {2,}/g;
  string = string.replace(regExpMultipleSpaces, ' ');

  // Allow only single or two new lines
  const regExpNewLines = /[\r\n]{2,}/g;
  string = string.replace(regExpNewLines, '\n\n');

  // Replace all tabs
  const regExpTabluar = /[\x0B\f\t]*/g;
  string = string.replace(regExpTabluar, '');

  return string;
}
