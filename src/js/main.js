'use strict';

// CONSTANTS
const REST_SERVER = "http://localhost"
const REST_PORT = "3000"

// other stuff
console.clear();

// Hide other views
$("#content").hide();
$("#dashboard-view").hide();
$("#workout-view").hide();
$("#movement-view").hide();
$("#equipment-view").hide();
$('#btn-group-new-workout').hide();

let debug = true;

// create static user
let user = null;

// create an array equipment
let equipment = [];
// create an array movements
let movements = [];
// create an array workouts
let workouts = [];

// Id of selected workout, otherwise it is 0
let selectedWorkoutId = 0;
// Id of selected workout score (edit mode), otherwise it is 0
let selectedScoreId = 0;

// Initialize view
fullResetView();
