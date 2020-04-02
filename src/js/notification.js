'use strict';

import app from "./index.js";
import * as logger from "./logger.js";

let timer, notification;
export default notification = {
    addNotification(type, message, timeout = 5000) {
        logger.debug("notification.js :: addNotification() :: triggered");
        app.$refs.notification.show(type, message);
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            app.$refs.notification.hide();
        }, timeout);
    }
};
