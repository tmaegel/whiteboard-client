'use strict';

import * as config from './config.js';

/**
 * Create cookie
 * @param {string} name of the cookie
 * @param {string} value of the cookie
 * @param {integer} days until the cookie expires
 */
export function createCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = 'expires=' + date.toGMTString();
  }
  document.cookie = name + '=' + value + ';domain=' + config.DOMAIN + ';' + expires + ';path=/';
}

/**
 * Search for cookies by name
 * @param {string} name of the cookie
 * @return {string} the cookie
 */
export function readCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

/**
 * Delete cookies with name
 * @param {string} name of the cookie
 */
export function deleteCookie(name) {
  createCookie(name, '', -1);
}
