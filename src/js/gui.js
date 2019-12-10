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
    let searchbar = document.getElementById("searchbar");
    searchbar.value = "";
    searchbar.style.display = "block";
}
function hideSearchBar() { document.getElementById("searchbar").style.display = "none"; }
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
 * Handle tabs
 */
function activateTab(tab) {
    // unset
    document.getElementById("nav-dashboard").classList.remove("active");
    document.getElementById("nav-workout").classList.remove("active");
    document.getElementById("nav-movement").classList.remove("active");
    document.getElementById("nav-movement").classList.remove("active");
    document.getElementById('dashboard-view').style.display='none';
    document.getElementById('workout-view').style.display='none';
    document.getElementById('movement-view').style.display='none';
    document.getElementById('equipment-view').style.display='none';
    // set
    switch(tab) {
        case "dashboard":
            document.getElementById("dashboard-view").style.display='block';
            document.getElementById("nav-dashboard").classList.add("active");
            break;
        case "workout":
            document.getElementById("workout-view").style.display='block';
            document.getElementById("nav-workout").classList.add("active");
            break;
        case "movement":
            document.getElementById("movement-view").style.display='block';
            document.getElementById("nav-movement").classList.add("active");
            break;
        case "equipment":
            document.getElementById("equipment-view").style.display='block';
            document.getElementById("nav-movement").classList.add("active");
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
