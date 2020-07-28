'use strict';

import Vue from 'vue';

import store from './store.js';
import App from './app/App.vue';
import * as logger from './logger.js';
import * as cookie from './cookie.js';
import * as request from './rest.js';

window.addEventListener('load', init);

/**
 * Entry point
 */
function init() {
  // other stuff
  logger.log('main :: init() :: INFO: Initializing');

  /**
   * Cookie
   */
  const session = cookie.readCookie('token');
  if (session != null) {
    store.setToken(session);
    request.restUserValidate();
  }

  /**
   * Login
   */
  window.addEventListener('keypress', handleLoginByKey);

  // Hide context menu
  document.addEventListener('click', function(event) {
    store.hideContextMenu();
    store.hideFilterMenu();
  });
}

/**
 * event function to handle the login mechanism
 */
export function handleLogin() {
  if (store.state.user.logout == false && store.state.user.token != undefined && store.state.user.token != null) {
    logger.debug('index.js :: handleLogin() :: INFO :: Login successful.');
    // Removing if successfully logged in
    window.removeEventListener('keypress', handleLoginByKey);
  } else {
    logger.error('index.js :: handleLogin() :: ERROR :: Login failed.');
  }
}

/**
 * event function to handle the login mechanism by pressing the enter key
 * @param {Event} event by pressing the enter key
 */
export function handleLoginByKey(event) {
  const keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode == '13') {
    request.restUserLogin();
  }
}

new Vue({
  el: '#app',
  render: (h) => h(App),
});
