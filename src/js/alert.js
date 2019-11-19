'use strict';

function resetAllAlerts() {
    $('.alert').remove();
}

function resetLastAlerts() {
    $('.alert').last().remove();
}

function addAlert(type, message, hideable) {
    console.log("sad");
    hideable = hideable || false; // Optional parameter
    let notificationInModal = false;
    let notification;
    let modal;

    resetAllAlerts();

    var button = ""
    if(hideable) {
        button = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    }

    let modals = document.querySelectorAll(".modal");
    modals.forEach((element, index, modals) => {
        console.log(element.style.display);
        if(element.style.display != "none") {
            notificationInModal = true;
            modal = element;
            return false;
        }
    });

    if(type == "success") {
        notification = '<div class="alert alert-success rounded-0 border-0 margin-0" role="alert">' + message + '' + button + '</div>';
    } else if(type == "info") {
        notification = '<div class="alert alert-info rounded-0 border-0 margin-0" role="alert">' + message + '' + button + '</div>';
    } else if (type == "warning") {
        notification = '<div class="alert alert-warning rounded-0 border-0 margin-0" role="alert">' + message + '' + button + '</div>';
    } else if (type == "error") {
        notification = '<div class="alert alert-danger rounded-0 border-0 margin-0" role="alert">' + message + '' + button + '</div>';
    } else {
        return 1;
    }

    if(notificationInModal) {
        $(modal).find(".modal-header").after(notification);
    } else {
        $("#navbar-primary").after(notification);
    }

    return 0;
}
