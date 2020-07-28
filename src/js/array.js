'use strict';

import * as logger from './logger.js';

/**
 * ARRAY
 */

/**
 * Helper function to compare(sort) objects by id
 * @param {Object} object1
 * @param {Object} object2
 * @return {boolean}
 */
export function compareById(object1, object2) {
  if (object1 !== undefined && object2 !== undefined) {
    if (object1.hasOwnProperty('id') && object2.hasOwnProperty('id')) {
      if (object1.id < object2.id) {
        return -1;
      } else if (object1.id > object2.id) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  logger.error('array.js :: compareById() :: ERROR :: No valid variable \'id\' found to compare');
}

/**
  * Helper function to compare(sort) objects by datetime/timestamp
  * @param {Object} object1
  * @param {Object} object2
  * @return {boolean}
  */
export function compareByTimestamp(object1, object2) {
  if (object1 !== undefined && object2 !== undefined) {
    if (object1.hasOwnProperty('datetime') && object2.hasOwnProperty('datetime')) {
      if (object1.datetime < object2.datetime) {
        return -1;
      } else if (object1.datetime > object2.datetime) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  logger.error('array.js :: compareByTimestamp() :: ERROR :: No valid variable \'datetime\' found to compare');
}

/**
   * Helper function to compare(sort) objects by string
   * @param {Object} object1
   * @param {Object} object2
   * @return {boolean}
   */
export function compareByString(object1, object2) {
  if (object1 !== undefined && object2 !== undefined) {
    if (object1.hasOwnProperty('name') && object2.hasOwnProperty('name')) {
      return object1.name.localeCompare(object2.name);
    } else if (object1.movement != undefined || object2.movement != undefined) {
      return object1.movement.localeCompare(object2.movement);
    } else if (object1.equipment != undefined || object2.equipment != undefined) {
      return object1.equipment.localeCompare(object2.equipment);
    } else if (object1.score != undefined || object2.score != undefined) {
      return object1.score.localeCompare(object2.score);
    }
  }

  logger.error('array.js :: compareByString() :: ERROR :: No valid variable \'name\' found to compare');
}

/**
 * Search in array for object by id and return it
 * @param {Array} array
 * @param {integer} id
 * @return {Object} object with id
 */
export function getArrayObjectById(array, id) {
  if (array != undefined || id !== undefined) {
    for (const i in array) {
      if (id == array[i].id) {
        return array[i];
      }
    }
  }
}

/**
 * Search in array for object by id and return the index
 * @param {Array} array
 * @param {integer} id
 * @return {Object} index of the object with id
 */
export function getArrayIndexById(array, id) {
  if (array != undefined || id !== undefined) {
    for (let i = 0; i < array.length; i++) {
      if (parseInt(array[i].id) == id) {
        return i;
      }
    }
  }
}

/**
 * Returns all objects that contains the string
 * @param {Array} array
 * @param {string} search
 * @return {Array} list of all matched objects
 */
export function getArrayObjectsByName(array, search) {
  const arr = [];
  if (array != undefined || search !== undefined) {
    array.forEach((element, index, array) => {
      if (element.name.toLowerCase().includes(search.toLowerCase())) { // case insensitive
        arr.push(element);
      }
    });

    return arr;
  }
}
