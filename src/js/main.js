'use strict';

// CONSTANTS
const REST_SERVER = "https://localhost"
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

// Initialize view
fullResetView();
