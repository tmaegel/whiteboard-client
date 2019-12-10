'use strict';

function showNotificationOk() {
    let element = document.querySelector(".notification-ok");
    element.style.display = "block";
    setTimeout(() => { element.style.display = 'none'; }, 3000);
}
function showNotificationInfo() {
    let element = document.querySelector(".notification-info");
    element.style.display = "block";
    setTimeout(() => { element.style.display = 'none'; }, 3000);
}
function showNotificationWarn() {
    let element =  document.querySelector(".notification-warn");
    element.style.display = "block";
    setTimeout(() => { element.style.display = 'none'; }, 3000);
}
function showNotificationError() {
    let element =  document.querySelector(".notification-error");
    element.style.display = "block";
    setTimeout(() => { element.style.display = 'none'; }, 3000);
}
function hideNotificationOk() { document.querySelector(".notification-ok").style.display = "none"; }
function hideNotificationInfo() { document.querySelector(".notification-info").style.display = "none"; }
function hideNotificationWarn() { document.querySelector(".notification-warn").style.display = "none"; }
function hideNotificationError() { document.querySelector(".notification-error").style.display = "none"; }

function resetNotifications() {
    hideNotificationOk();
    hideNotificationInfo();
    hideNotificationWarn();
    hideNotificationError();
}

function addNotification(type, message) {
    resetNotifications();

    if(type == "ok") {
        document.querySelector(".notification-ok").innerHTML = message;
        showNotificationOk();
    } else if(type == "info") {
        document.querySelector(".notification-info").innerHTML = message;
        showNotificationInfo();
    } else if (type == "warn") {
        document.querySelector(".notification-warn").innerHTML = message;
        showNotificationWarn();
    } else if (type == "error") {
        document.querySelector(".notification-error").innerHTML = message;
        showNotificationError();
    } else {
        return 1;
    }

    return 0;
}
