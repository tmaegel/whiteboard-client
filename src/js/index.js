'use strict';

import Vue from 'vue';

import store from './store.js';
import App from './app/App.vue'
import * as logger from "./logger.js";
import * as cookie from "./cookie.js";
import * as request from "./rest.js";
import * as arrayHelper from "./array.js";

window.addEventListener("load", init);

function init() {
    // other stuff
    logger.log("main :: init() :: INFO: Initializing");

    /**
     * Cookie
     */
    let session = cookie.readCookie("token");
    if(session != null) {
        store.setToken(session);
        request.restUserValidate();
    }

    /**
     * Login
     */
    window.addEventListener("keypress", handleLoginByKey);

    // Hide context menu
    document.addEventListener("click", function(event) {
        store.hideContextMenu();
    });

    // Listener to refresh the graph
    // window.addEventListener("resize", scoreHelper.resizeWorkoutScoreChart);
}

// event function to handle the login mechanism
export function handleLogin() {
    if (store.state.user.logout == false && store.state.user.token != undefined && store.state.user.token != null) {
        logger.debug("index.js :: handleLogin() :: INFO :: Login successful.");
        window.removeEventListener("keypress", handleLoginByKey); // Removing if successfully logged in
    } else {
        logger.error("index.js :: handleLogin() :: ERROR :: Login failed.");
    }
}

// event function to handle the login mechanism by pressing the enter key
export function handleLoginByKey(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        request.restUserLogin();
    }
}

new Vue({
    el: '#app',
    render: h => h(App),
});
