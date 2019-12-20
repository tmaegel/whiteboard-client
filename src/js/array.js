'use strict';

/**
 * ARRAY
 */

/**
 * Sort by id
 */
export function compareById(object1, object2) {
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
export function compareByTimestamp(object1, object2) {
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
export function compareByString(object1, object2) {
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
export function concatWorkoutScores(array) {
    let arr = [];
    if (array != null) {
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
    if (array != null) {
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
    if (array != null) {
        for (var i in array) {
            if(id == array[i].id) {
                return array[i];
            }
        }
        return null;
    } else {
        return null;
    }
}

/**
 * Gets the index of object by the id
 */
export function getArrayIndexById(array, id) {
    if (array != null) {
        for(var i = 0; i < array.length; i++) {
            if (parseInt(array[i].id) == id) {
                return i;
            }
        }
        return null;
    } else {
        return null;
    }
}

/**
 * Returns all objects that do contain the string
 */
export function getArrayObjectsByName(array, search) {
    let arr = [];
    array.forEach((element, index, array) => {
        if (element.name.toLowerCase().includes(search.toLowerCase())) { // case insensitive
            arr.push(element);
        }
    });

    return arr;
}
