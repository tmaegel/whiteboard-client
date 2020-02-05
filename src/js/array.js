'use strict';

import * as logger from "./logger.js";

/**
 * ARRAY
 */

/**
 * Sort by id
 */
export function compareById(object1, object2) {
    if(object1 !== undefined && object2 !== undefined) {
        if(object1.hasOwnProperty('id') && object2.hasOwnProperty('id')) {
            if(object1.id < object2.id) {
                return -1;
            } else if(object1.id > object2.id) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    logger.error("array.js :: compareById() :: ERROR :: No valid variable 'id' found to compare");
}

/**
 * Sort by datetime/timestamp
 */
export function compareByTimestamp(object1, object2) {
    if(object1 !== undefined && object2 !== undefined) {
        if(object1.hasOwnProperty('datetime') && object2.hasOwnProperty('datetime')) {
            if(object1.datetime < object2.datetime) {
                return -1;
            } else if(object1.datetime > object2.datetime) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    logger.error("array.js :: compareByTimestamp() :: ERROR :: No valid variable 'datetime' found to compare");
}

/**
 * Sort by string
 */
export function compareByString(object1, object2) {
    if(object1 !== undefined && object2 !== undefined) {
        if(object1.hasOwnProperty('name') && object2.hasOwnProperty('name')) {
            return object1.name.localeCompare(object2.name);
        } else if(object1.movement != undefined || object2.movement != undefined) {
            return object1.movement.localeCompare(object2.movement);
        } else if(object1.equipment != undefined || object2.equipment != undefined) {
            return object1.equipment.localeCompare(object2.equipment);
        } else if(object1.score != undefined || object2.score != undefined) {
            return object1.score.localeCompare(object2.score);
        }
    }

    logger.error("array.js :: compareByString() :: ERROR :: No valid variable 'name' found to compare");
}

/**
 * Concat score array of every workout
 */
export function concatWorkoutScores(array) {
    let arr = [];
    if (array !== undefined) {
        for (var i in array) {
            if(i == 0) {
                arr = array[i].score;
            } else {
                arr.concat(array[i].score);
            }
        }
    } else {
        return -1;
    }

    return arr;
}

/**
 * Search in array for object by id and update (when exists) or add (when not exists) it
 * @return 0 if object added
 * @return 1 if object updated
 * @return -1 if wrong type specified
 */
export function refreshArrayObject(array, object) {
    if (array != undefined || object !== undefined) {
        for (var i in array) {
            if(object.id == array[i].id) {
                array[i] = object;
                return 1;
            }
        }
        array.push(object);
        return 0;
    } else {
        return -1;
    }
}

/**
 * Search in array for object by id and return it
 */
export function getArrayObjectById(array, id) {
    if (array != undefined || id !== undefined) {
        for (var i in array) {
            if(id == array[i].id) {
                return array[i];
            }
        }
    }
}

/**
 * Gets the index of object by the id
 */
export function getArrayIndexById(array, id) {
    if (array != undefined || id !== undefined) {
        for(var i = 0; i < array.length; i++) {
            if (parseInt(array[i].id) == id) {
                return i;
            }
        }
    }
}

/**
 * Returns all objects that contains the string
 */
export function getArrayObjectsByName(array, search) {
    let arr = [];
    if (array != undefined || search !== undefined) {
        array.forEach((element, index, array) => {
            if (element.name.toLowerCase().includes(search.toLowerCase())) { // case insensitive
                arr.push(element);
            }
        });

        return arr;
    }
}
