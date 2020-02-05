'use strict';

import * as request from "./rest.js";
import * as guiHelper from "./gui.js";
import * as notification from "./notification.js";

/**
 * EQUIPMENT
 */

/**
 * Init movements (add all movements to the view)
 */
export function initEquipmentOnView() {
    var equipmentTemplate = $(".equipment-template").clone();
    $(equipmentTemplate).removeClass("equipment-template");
    $(".equipment-template").hide();

    // Removing all equipment (refresh)
    $('#equipment-view').find("[id^=equipment-id]").remove();
    for (var equipment of request.equipment) {
        var template = $(equipmentTemplate).clone().first();
        $(template).attr("id", "equipment-id-"+equipment.id);
        $(template).find(".equipment-name").text(equipment.equipment);

        $(template).show();
        $(template).appendTo("#equipment-view ul");
    }
    guiHelper.hideLoader();
    guiHelper.showEquipmentView();
}
