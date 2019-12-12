'use strict';

/**
 * Show/Hide modals
 */
function showLoginModal() { document.getElementById("login-modal").style.display = "block"; }
function hideLoginModal() { document.getElementById("login-modal").style.display = "none"; }
function showWorkoutModal() { document.getElementById("workout-modal").style.display = "block"; }
function hideWorkoutModal() { document.getElementById("workout-modal").style.display = "none"; }
function showWorkoutScoreModal() { document.getElementById("workout-score-modal").style.display = "block"; }
function hideWorkoutScoreModal() { document.getElementById("workout-score-modal").style.display = "none"; }
/**
 * Show/Hide canvas
 */
function showChart() { document.getElementById(Config.CHART_ID).style.display = "block"; }
function hideChart() { document.getElementById(Config.CHART_ID).style.display = "none"; }
/**
 * Show/Hide searchbar
 */
function showSearchBar() {
    let container = document.getElementById("container");
    let searchbar = document.getElementById("searchbar");
    let searchbarInp = document.getElementById("inp-search-workout");
    searchbarInp.value = "";
    searchbar.style.display = "block";
    container.style.margin = "107px 0 0 0";
}
function hideSearchBar() {
    let container = document.getElementById("container");
    document.getElementById("searchbar").style.display = "none";
    container.style.margin = "50px 0 0 0";
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
function showNewWorkoutBtn() { document.getElementById("btn-new-workout").style.display = "block"; }
function hideNewWorkoutBtn() { document.getElementById("btn-new-workout").style.display = "none"; }
/**
 * Handle tabs
 */
function activateTab(tab) {
    // unset
    document.getElementById("nav-dashboard").classList.remove("active");
    document.getElementById("nav-workout").classList.remove("active");
    document.getElementById("nav-movement").classList.remove("active");
    document.getElementById("nav-equipment").classList.remove("active");
    document.getElementById('dashboard-view').style.display='none';
    document.getElementById('workout-view').style.display='none';
    document.getElementById('movement-view').style.display='none';
    document.getElementById('equipment-view').style.display='none';
    // set
    switch(tab) {
        case "dashboard":
            document.getElementById("dashboard-view").style.display='block';
            document.getElementById("nav-dashboard").classList.add("active");
            hideNewWorkoutBtn();
            break;
        case "workout":
            document.getElementById("workout-view").style.display='block';
            document.getElementById("nav-workout").classList.add("active");
            showNewWorkoutBtn();
            break;
        case "movement":
            document.getElementById("movement-view").style.display='block';
            document.getElementById("nav-movement").classList.add("active");
            hideNewWorkoutBtn();
            break;
        case "equipment":
            document.getElementById("equipment-view").style.display='block';
            document.getElementById("nav-equipment").classList.add("active");
            hideNewWorkoutBtn();
            break;
    }
}

/**
 * Toggle (show/hide) the cards
 */
function toggleCard(element) {
    var parentElement = element.parentElement;
    var contentSel = element.nextElementSibling;
    var state = contentSel.style.display;

    // Reset
    resetCards()

    if(state === "block") {
        contentSel.style.display = "none";
    } else {
        contentSel.style.display = "block";
        parentElement.classList.add("active");
        $(parentElement).find("canvas").attr("id", Config.CHART_ID); // add chart id to identify the element
        restGetWorkoutScores(getWorkoutIdFromDOM());
    }
}

/**
 * Close modals
 */
 let btnCancelWorkoutModal = document.getElementById("btn-cancel-workout-modal");
 btnCancelWorkoutModal.addEventListener("click", function() {
     hideWorkoutModal();
 });
 let btnCancelWorkoutScoreModal = document.getElementById("btn-cancel-workout-score-modal");
 btnCancelWorkoutScoreModal.addEventListener("click", function() {
     hideWorkoutScoreModal();
 });
