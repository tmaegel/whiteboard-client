'use strict';

import * as config from './config.js';

/**
 * write error message to the console
 * @param {string} message text
 * @return {boolean} false if message is null/undefined
 */
export function error(message) {
  if (message === undefined) {
    return false;
  }
  console.error(message);
}

/**
 * write log message to the console
 * @param {string} message text
 * @return {boolean} false if message is null/undefined
 */
export function log(message) {
  if (message === undefined) {
    return false;
  }
  console.log(message);
}

/**
 * write debug message to the console
 * @param {string} message text
 * @return {boolean} false if message is null/undefined
 */
export function debug(message) {
  if (message === undefined) {
    return false;
  }

  if (config.DEBUG) {
    console.debug(message);
  }
}
