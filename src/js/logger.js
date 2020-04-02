'use strict';

import * as config from "./config.js";

export function error(message) {
    if(message === undefined) {
        return false;
    }
    console.error(message);
}

export function log(message) {
    if(message === undefined) {
        return false;
    }
    console.log(message);
}

export function debug(message) {
    if(message === undefined) {
        return false;
    }

    if(config.DEBUG) {
        console.debug(message);
    }
}
