'use strict';

/**
 * Show/Hide modals
 */
function showLoginModal() { document.getElementById("login-modal").style.display = "block"; }
function hideLoginModal() { document.getElementById("login-modal").style.display = "none"; }
function showWorkoutModal() {
    hideBtnNew();
    hideBtnEdit();
    showBtnOk();
    showBtnClose();
    document.getElementById("workout-modal").style.display = "block";
}
function hideWorkoutModal() {
    hideBtnOk();
    hideBtnClose();
    showBtnNew();
    if(isAnyCardActive()) {
        showBtnEdit();
    }
    document.getElementById("workout-modal").style.display = "none";
}
function showWorkoutScoreModal() {
    hideBtnNew();
    hideBtnEdit();
    showBtnOk();
    showBtnClose();
    document.getElementById("workout-score-modal").style.display = "block";
}
function hideWorkoutScoreModal() {
    hideBtnOk();
    hideBtnClose();
    showBtnNew();
    if(isAnyCardActive()) {
        showBtnEdit();
    }
    document.getElementById("workout-score-modal").style.display = "none";
}
/**
 * Show/Hide canvas
 */
function showChart() { document.getElementById(Config.CHART_ID).style.display = "block"; }
function hideChart() { document.getElementById(Config.CHART_ID).style.display = "none"; }
/**
 * Show/Hide loader/spinner
 */
function showLoader() { document.getElementById("loader").style.display = "block"; }
function hideLoader() { document.getElementById("loader").style.display = "none"; }
/**
 * Show/Hide searchbar
 */
function showSearchBar() {
    let container = document.getElementById("container");
    let searchbar = document.getElementById("searchbar");
    let searchbarInp = document.getElementById("inp-search-workout");
    searchbarInp.value = "";
    searchbar.style.display = "block";
    container.style.margin = "107px 0 200px 0";
}
function hideSearchBar() {
    let container = document.getElementById("container");
    document.getElementById("searchbar").style.display = "none";
    container.style.margin = "50px 0 200px 0";
}
function toggleSearchBar() {
    var searchbar = document.getElementById("searchbar");
    var state = window.getComputedStyle(searchbar).display;
    if(state === "none") {
        showSearchBar();
    } else {
        hideSearchBar();
    }
}
/**
 * Show/Hide buttons
 */
function showBtnNew() { document.getElementById("btn-new").style.display = "block"; }
function hideBtnNew() { document.getElementById("btn-new").style.display = "none"; }
function showBtnEdit() { document.getElementById("btn-edit").style.display = "block"; }
function hideBtnEdit() { document.getElementById("btn-edit").style.display = "none"; }
function showBtnOk() { document.getElementById("btn-ok").style.display = "block"; }
function hideBtnOk() { document.getElementById("btn-ok").style.display = "none"; }
function showBtnClose() { document.getElementById("btn-close").style.display = "block"; }
function hideBtnClose() { document.getElementById("btn-close").style.display = "none"; }
function hideAllBtns() {
    hideBtnNew();
    hideBtnEdit();
    hideBtnOk();
    hideBtnClose();
}
/**
 * Show/Hide views
 */
function showDashboardView() { document.getElementById("dashboard-view").style.display = "block"; }
function hideDashboardView() { document.getElementById("dashboard-view").style.display = "none"; }
function showWorkoutView() { document.getElementById("workout-view").style.display = "block"; }
function hideWorkoutView() { document.getElementById("workout-view").style.display = "none"; }
function showMovementView() { document.getElementById("movement-view").style.display = "block"; }
function hideMovementView() { document.getElementById("movement-view").style.display = "none"; }
function showEquipmentView() { document.getElementById("equipment-view").style.display = "block"; }
function hideEquipmentView() { document.getElementById("equipment-view").style.display = "none"; }
function hideAllViews() {
    hideDashboardView();
    hideWorkoutView();
    hideMovementView();
    hideEquipmentView();
}

/**
 * Handle tabs
 */
function activateTab(tab) {
    // unset
    document.getElementById("nav-dashboard").classList.remove("active");
    document.getElementById("nav-workout").classList.remove("active");
    document.getElementById("nav-movement").classList.remove("active");
    document.getElementById("nav-equipment").classList.remove("active");
    hideAllViews();
    hideAllBtns();
    // set
    switch(tab) {
        case "dashboard":
            document.getElementById("nav-dashboard").classList.add("active");
            showDashboardView();
            break;
        case "workout":
            showLoader();
            document.getElementById("nav-workout").classList.add("active");
            showBtnNew();
            break;
        case "movement":
            showLoader();
            document.getElementById("nav-movement").classList.add("active");
            break;
        case "equipment":
            showLoader();
            document.getElementById("nav-equipment").classList.add("active");
            break;
    }
}

/**
 * Doing card stuff
 */
// Toggle /show/hide) cards
function toggleCard(element) {
    var parentElement = element.parentElement;
    var contentSel = element.nextElementSibling;
    var state = contentSel.style.display;
    let workoutId = parentElement.id.replace("workout-id-", "");

    // Reset
    resetCards()

    if(state === "block") {
        contentSel.style.display = "none";
        hideBtnEdit();
    } else {
        contentSel.style.display = "block";
        parentElement.classList.add("active");
        $(parentElement).find("canvas").attr("id", Config.CHART_ID); // add chart id to identify the element
        restGetWorkoutScores(getWorkoutIdFromDOM());
        // Allow editing only if userId > 1
        let index = getArrayIndexById(workouts, workoutId);
        if(index != null) {
            if(workouts[index].userId > 1) {
                showBtnEdit();
            } else {
                console.log("Hide edit workout button, because its a main workout.");
            }
        }
    }
}
// Hide and reset selected cards
function resetCards() {
    let cardElements = document.querySelectorAll(".card");
    cardElements.forEach((card, index, cardElements) => {
        card.classList.remove("active");
    });
    let contentElements = document.querySelectorAll(".card-content");
    contentElements.forEach((content, index, contentElements) => {
        content.style.display = "none";
    });
}
function isAnyCardActive() {
    let cardElements = document.querySelectorAll(".card");
    for (var card of cardElements) {
        if (card.classList.contains('active')) {
            console.log("Any card is active");
            return true;
        }
    }
    console.log("No card is active");
    return false;
}

/**
 * Reset the view
 */
function resetView() {
    hideLoginModal();
    hideWorkoutModal();
    hideWorkoutScoreModal();
    hideSearchBar();
}

/**
 * Full reset the view
 * Collaps menus etc, ...
 */
function fullResetView() {
    resetView();
    // Remove chart element
    $("#" + Config.CHART_ID).removeAttr("id");
    // reset cards
    resetCards();
    hideBtnEdit();
}
