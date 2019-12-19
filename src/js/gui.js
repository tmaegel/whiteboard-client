'use strict';

/**
 * Show/Hide dialogs
 */
function showLoginDialog() {
    let container = document.getElementById("container");
    hideNavBar();
    hideToolBar();
    hideSearchBar();
    setTitle("Login");
    showBtnLogin();
    document.getElementById("login-dialog").style.display = "block";
    container.style.margin = "57px 0 200px 0";
}
function hideLoginDialog() {
    let container = document.getElementById("container");
    hideBtnLogin();
    setTitle("Dashboard");
    showNavBar();
    showToolBar();
    document.getElementById("login-dialog").style.display = "none";
    container.style.margin = "113px 0 200px 0";
}
function showWorkoutDialog() {
    hideBtnNew();
    hideBtnEdit();
    showBtnOk();
    showBtnClose();
    hideWorkoutView();
    document.getElementById("workout-dialog").style.display = "block";
}
function hideWorkoutDialog() {
    hideBtnOk();
    hideBtnClose();
    showBtnNew();
    showWorkoutView();
    setTitle("Workouts");
    if(isAnyCardActive()) {
        showBtnEdit();
    }
    document.getElementById("workout-dialog").style.display = "none";
}
function showWorkoutScoreDialog() {
    hideBtnNew();
    hideBtnEdit();
    showBtnOk();
    showBtnClose();
    hideWorkoutView();
    document.getElementById("workout-score-dialog").style.display = "block";
}
function hideWorkoutScoreDialog() {
    hideBtnOk();
    hideBtnClose();
    showBtnNew();
    showWorkoutView();
    setTitle("Workouts");
    if(isAnyCardActive()) {
        showBtnEdit();
    }
    document.getElementById("workout-score-dialog").style.display = "none";
}
function hideAllDialogs() {
    hideWorkoutDialog();
    hideWorkoutScoreDialog();
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
    let searchbar = document.getElementById("searchbar");
    searchbar.value = "";
    searchbar.style.display = "block";
    searchbar.focus();
    hidePageTitle();
}
function hideSearchBar() {
    document.getElementById("searchbar").style.display = "none";
    showPageTitle();
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
 * Show/Hide titlebar
 */
function hideTitleBar() { document.getElementById("titlebar").style.display = "none"; }
function showTitleBar() { document.getElementById("titlebar").style.display = "block"; }

/**
 * Show/Hide navbar
 */
function hideNavBar() { document.getElementById("navbar").style.display = "none"; }
function showNavBar() { document.getElementById("navbar").style.display = "block"; }
/**
 * Show/Hide pageTitle
 */
function hidePageTitle() { document.getElementById("page-title").style.display = "none"; }
function showPageTitle() { document.getElementById("page-title").style.display = "block"; }
/**
 * Show/Hide toolbar
 */
function hideToolBar() { document.getElementById("toolbar").style.display = "none"; }
function showToolBar() { document.getElementById("toolbar").style.display = "block"; }

/**
 * Show/Hide buttons
 */
function showBtnLogin() { document.getElementById("btn-login").style.display = "block"; }
function hideBtnLogin() { document.getElementById("btn-login").style.display = "none"; }
function showBtnNew() { document.getElementById("btn-new").style.display = "block"; }
function hideBtnNew() { document.getElementById("btn-new").style.display = "none"; }
function showBtnEdit() { document.getElementById("btn-edit").style.display = "block"; }
function hideBtnEdit() { document.getElementById("btn-edit").style.display = "none"; }
function showBtnOk() { document.getElementById("btn-ok").style.display = "block"; }
function hideBtnOk() { document.getElementById("btn-ok").style.display = "none"; }
function showBtnClose() { document.getElementById("btn-close").style.display = "block"; }
function hideBtnClose() { document.getElementById("btn-close").style.display = "none"; }
function hideAllBtns() {
    hideBtnLogin();
    hideBtnNew();
    hideBtnEdit();
    hideBtnOk();
    hideBtnClose();
}
/**
 * Show/Hide views
 */
function showDashboardView() {
    setTitle("Dashboard");
    hideToolBar();
    hideSearchBar();
    document.getElementById("dashboard-view").style.display = "block";
}
function hideDashboardView() { document.getElementById("dashboard-view").style.display = "none"; }
function showWorkoutView() {
    setTitle("Workouts");
    showBtnNew();
    showToolBar();
    hideSearchBar();
    document.getElementById("workout-view").style.display = "block";
}
function hideWorkoutView() { document.getElementById("workout-view").style.display = "none"; }
function showMovementView() {
    setTitle("Movements");
    hideToolBar();
    hideSearchBar();
    document.getElementById("movement-view").style.display = "block";
}
function hideMovementView() { document.getElementById("movement-view").style.display = "none"; }
function showEquipmentView() {
    setTitle("Equipment");
    hideToolBar();
    hideSearchBar();
    document.getElementById("equipment-view").style.display = "block";
}
function hideEquipmentView() { document.getElementById("equipment-view").style.display = "none"; }
function hideAllViews() {
    hideDashboardView();
    hideWorkoutView();
    hideMovementView();
    hideEquipmentView();
}

/**
 * Set title
 */
function setTitle(title) {
    document.getElementById("page-title").innerHTML = title;
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
            showWorkoutView();
            break;
        case "movement":
            showLoader();
            document.getElementById("nav-movement").classList.add("active");
            showMovementView();
            break;
        case "equipment":
            showLoader();
            document.getElementById("nav-equipment").classList.add("active");
            showEquipmentView();
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
    resetCards();

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
