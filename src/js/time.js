'use strict';

import * as logger from './logger.js';
import * as regexHelper from './regex.js';

const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // days of week (short)
const daysLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; // days of week (long)
const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // months

/**
 * Get timestamp in seconds since 01.01.1970
 * Now or optional an specific timestamp
 * @param {integer} timestamp different format possible. It's optional.
 * @return {integer} timestamp in unix time stamp format.
 */
export function getTimestamp(timestamp) {
  timestamp = timestamp || 0; // Optional parameter

  let now;
  if (timestamp == 0) {
    now = new Date();
  } else {
    now = new Date(Date.parse(timestamp));
    if (isNaN(now)) {
      logger.debug('time.js :: getTimestamp() :: WARN: Couldn\'t parse timestamp to UNIX timestamp.');
      if (regexHelper.datetimeRegex(timestamp)) {
        logger.debug('time.js :: getTimestamp() :: INFO: Detect timestamp (YY.mm.dd HH:MM:SS)');
        const tmp = timestamp.split(' ');
        const date = tmp[0].split('.');
        const time = tmp[1].split(':');
        now = new Date(date[2], date[1]-1, date[0], time[0], time[1], 0); // year, month, day, hours, minutes, seconds
      } else {
        logger.error('time.js :: getTimestamp() :: ERROR: Couldn\'t parse timestamp to UNIX timestamp.');
        return false;
      }
    }
  }

  if (isNaN(now)) {
    logger.error('time.js :: getTimestamp() :: ERROR: Couldn\'t parse timestamp to UNIX timestamp.');
    return false;
  }

  const datetime = Math.round(now.getTime()/1000);

  return datetime;
}

/**
 * Get timestamp with RFC2822 / IETF Syntax
 * e.g. 'Mon, 25 Dec 1995 13:30:00 GMT'
 * @param {integer} timestamp in unix time stamp format. It's optional.
 * @return {timestamp} timestamp with RFC2822 / IETF Syntax.
 */
export function getIETFTimestamp(timestamp) {
  timestamp = timestamp || 0; // Optional parameter

  let now;
  if (timestamp == 0) {
    now = new Date();
  } else {
    if (regexHelper.numRegex(timestamp)) {
      now = new Date(timestamp*1000);
    } else {
      logger.error('time.js :: getIETFTimestamp() :: ERROR: Couldn\'t parse timestamp to IETF timestamp.');
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
  const datetime = daysShort[now.getDay()] + ', ' + day + ' ' + monthsShort[now.getMonth()] + ' ' + now.getFullYear() +
    ' ' + hours + ':' + minutes + ':' + seconds;

  return datetime;
}

/**
 * Get timestamp in specific format (long, with weekday)
 * @param {integer} timestamp in unix time stamp format. It's optional.
 * @return {timestamp} timestamp with with specific format (e.g. Sunday, 01.12.1990 12:00)
 */
export function getFormatTimestamp(timestamp) {
  timestamp = timestamp || 0; // Optional parameter

  let now;
  if (timestamp == 0) {
    now = new Date();
  } else {
    if (regexHelper.numRegex(timestamp)) {
      now = new Date(timestamp*1000);
    } else {
      logger.error('time.js :: getFormatTimestamp() :: ERROR: Couldn\'t format timestamp.');
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

  const datetime = daysLong[now.getDay()] + ', ' + day + '.' + month + '.' + now.getFullYear() + ' ' +
    hours + ':' + minutes;

  return datetime;
}

/**
 * Get timestamp in specific format (short, without weekday)
 * @param {integer} timestamp in unix time stamp format. It's optional.
 * @return {timestamp} timestamp with with specific format (e.g. 01.12.1990 12:00)
 */
export function getShortFormatTimestamp(timestamp) {
  timestamp = timestamp || 0; // Optional parameter

  let now;
  if (timestamp == 0) {
    now = new Date();
  } else {
    if (regexHelper.numRegex(timestamp)) {
      now = new Date(timestamp*1000);
    } else {
      logger.error('time.js :: getShortFormatTimestamp() :: ERROR: Couldn\'t format timestamp.');
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

  const datetime = day + '.' + month + '.' + now.getFullYear() + ' ' + hours + ':' + minutes;

  return datetime;
}

/**
 * Convert timestamp to seconds
 * @param {string} timestamp in specific format. Valid timestamp format is 'HH:MM:SS'
 * @return {integer} timestamp in unix time stamp format.
 */
export function timestampToSeconds(timestamp) {
  if (regexHelper.numRegex(timestamp)) {
    logger.log('time.js :: timestampToSeconds() :: INFO: Value is already a number. There is nothing to do.');
    return parseInt(timestamp);
  } else if (regexHelper.timestampRegex(timestamp)) {
    const time = timestamp.split(':');
    if (time.length === 2) {
      logger.log('time.js :: timestampToSeconds() :: INFO: Detect timestamp (MM:SS)');
      return (parseInt(time[0]*60) + parseInt(time[1]));
    } else if (time.length === 3) {
      logger.log('time.js :: timestampToSeconds() :: INFO: Detect timestamp (HH:MM:SS)');
      return (parseInt(time[0]*3600) + parseInt(time[1]*60) + parseInt(time[2]));
    }
  }

  logger.error('time.js :: timestampToSeconds() :: ERROR: Couldn\'t parse timestamp to UNIX timestamp.');
  return false;
}
