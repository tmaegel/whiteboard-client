'use strict';

function resetAllAlerts() {
    $('.alert').remove();
}

function resetLastAlerts() {
    $('.alert').last().remove();
}

function addAlert(type, message, hideable) {
    hideable = hideable || false; // Optional parameter

    resetAllAlerts();

    var button = ""
    if(hideable) {
        button = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    }

    if(type == "success") {
        $("#navbar-primary").after('<div class="alert alert-success rounded-0 border-0 margin-0" role="alert">' + message + '' + button + '</div>');
    } else if(type == "info") {
        $("#navbar-primary").after('<div class="alert alert-info rounded-0 border-0 margin-0" role="alert">' + message + '' + button + '</div>');
    } else if (type == "warning") {
        $("#navbar-primary").after('<div class="alert alert-warning rounded-0 border-0 margin-0" role="alert">' + message + '' + button + '</div>');
    } else if (type == "error") {
        $("#navbar-primary").after('<div class="alert alert-danger rounded-0 border-0 margin-0" role="alert">' + message + '' + button + '</div>');
    } else {
        return 1;
    }

    return 0;
}
