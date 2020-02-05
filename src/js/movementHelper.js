'use strict';

import * as request from "./rest.js";
import * as guiHelper from "./gui.js";

/**
 * MOVEMENTS
 */

/**
 * Init movements (add all movements to the view)
 */
export function initMovementsOnView() {
    var movementTemplate = $(".movement-template").clone();
    $(movementTemplate).removeClass("movement-template");
    $(".movement-template").hide();

    // Removing all movements (refresh)
    $('#movement-view').find("[id^=movement-id]").remove();
    for (let movement of request.movements) {
        var template = $(movementTemplate).clone().first();
        $(template).attr("id", "movement-id-"+movement.id);
        $(template).find(".movement-name").text(movement.movement);

        $(template).show();
        $(template).appendTo("#movement-view ul");
    }
    guiHelper.hideLoader();
    guiHelper.showMovementView();
}
