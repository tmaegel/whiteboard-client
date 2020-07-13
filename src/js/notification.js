'use strict';

import * as logger from './logger.js';

let timer; let notification;
export default notification = {
  state: {
    seen: false,
    message: '',
    currentType: 'info',
  },
  addNotification(type, value, timeout = 5000) {
    logger.debug('notification.js :: addNotification() :: triggered with type=' + type + ' and value=' + value);
    this.showNotification(type, value);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      this.hideNotification();
    }.bind(this), timeout);
  },
  showNotification(type, value) {
    logger.debug('notification.js :: showNotification() :: triggered with type=' + type + ' and value=' + value);
    this.state.message = value;
    switch (type) {
      case 'ok':
        this.state.currentType = 'ok';
        break;
      case 'info':
        this.state.currentType = 'info';
        break;
      case 'warn':
        this.state.currentType = 'warn';
        break;
      case 'error':
        this.state.currentType = 'error';
        break;
      default:
        this.state.currentType = 'info';
    }
    this.state.seen = true;
  },
  hideNotification() {
    logger.debug('notification.js :: hideNotification() :: triggered');
    this.state.seen = false;
  },
};
