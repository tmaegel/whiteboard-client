'use strict';

import Vue from 'vue';

import * as logger from './logger.js';
import * as arrayHelper from './array.js';

let store;
export default store = {
  state: {
    app: {
      title: 'Home',
      searchbar: false, // if true show searchbar
      filterMenu: false, // if true show filter menu
      sortAsc: true, // sort ascending/descending
      sortTypeIndex: 0, // sort by ... (look in FilterMenu.vue > sortType)
      showTypeIndex: 0, // show entries (look in FilterMenu.vue > showType)
      contextMenu: false, // if true show context menu
      workoutDialog: false, // if true show workout dialog
      scoreDialog: false, // if true show score dialog
      currentView: 'home',
      previousWiew: 'home',
    },
    user: {
      user: '',
      password: '',
      token: null,
      logout: true,
    },
    tags: [],
    equipment: [],
    movements: [],
    workouts: [],
  },
  /** *****************************
   * User specific / login dialog
   *******************************/
  login() {
    logger.debug('store.js :: login() :: triggered');
    this.state.user.logout = false;
  },
  logout() {
    logger.debug('store.js :: logout() :: triggered');
    this.state.user.logout = true;
  },
  setToken(value) {
    logger.debug('store.js :: setToken() :: triggered');
    this.state.user.token = value;
    this.login();
  },
  getUserObject() {
    logger.debug('store.js :: getUserObject() :: triggered');
    return this.state.user;
  },
  /** *****************************
   * Gerneral
   *******************************/
  getCurrentView() {
    logger.debug('store.js :: getCurrentView() :: triggered with ' + this.state.app.currentView);
    return this.state.app.currentView;
  },
  setCurrentView(value) {
    logger.debug('store.js :: setCurrentView() :: triggered with ' + value);
    this.state.app.currentView = value;
  },
  showLoader() {
    logger.debug('store.js :: showLoader() :: triggered');
    this.state.app.previousWiew = this.state.app.currentView;
    this.state.app.currentView = 'loader';
  },
  hideLoader() {
    logger.debug('store.js :: hideLoader() :: triggered');
    this.state.app.currentView = this.state.app.previousWiew;
    this.hideDialog();
  },
  hideContextMenu() {
    logger.debug('store.js :: hideContextMenu() :: triggered');
    this.state.app.contextMenu = false;
  },
  hideDialog() {
    logger.debug('store.js :: hideDialog() :: triggered');
    this.state.app.workoutDialog = false;
    this.state.app.scoreDialog = false;
  },
  showSearchbar() {
    logger.debug('store.js :: showSearchbar() :: triggered');
    this.state.app.searchbar = true;
  },
  hideSearchbar() {
    logger.debug('store.js :: hideSearchbar() :: triggered');
    this.state.app.searchbar = false;
  },
  showFilterMenu() {
    logger.debug('store.js :: showFilterMenu() :: triggered');
    this.state.app.filterMenu = true;
  },
  hideFilterMenu() {
    logger.debug('store.js :: hideFilterMenu() :: triggered');
    this.state.app.filterMenu = false;
  },
  /** ****************************
   * Tag specific
   *******************************/
  setTags(data) {
    logger.debug('store.js :: setTags() :: triggered with ' + JSON.stringify(data));
    this.state.tags = data;
  },
  setTagById(data, tagId) {
    logger.debug('store.js :: setTagById() :: triggered with ' + JSON.stringify(data) + '(' + tagId + ')');
    const tagIndex = arrayHelper.getArrayIndexById(this.state.tags, tagId);
    if (tagIndex != null) {
      Vue.set(this.state.tags, tagIndex, data);
    } else {
      logger.error('store.js :: setTagById() :: ERROR: Unable to update/add tag to array.');
    }
  },
  setTagsByWorkoutId(data, workoutId) {
    logger.debug('store.js :: setTagsByWorkoutId() :: triggered with ' + JSON.stringify(data) + '(' + workoutId + ')');
    const workoutIndex = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
    if (workoutIndex != null) {
      Vue.set(this.state.workouts[workoutIndex], 'tags', data);
    } else {
      logger.error('store.js :: setTagsByWorkoutId() :: ERROR: Unable to update/add workout scores to array.');
    }
  },
  /** *****************************
   * Equipment specific
   *******************************/
  setEquipment(data) {
    logger.debug('store.js :: setEquipment() :: triggered with ' + JSON.stringify(data));
    this.state.equipment = data;
  },
  /** ****************************
     * Movement specific
     *******************************/
  setMovements(data) {
    logger.debug('store.js :: setMovements() :: triggered with ' + JSON.stringify(data));
    this.state.movements = data;
  },
  /** *****************************
   * Workout specific
   *******************************/
  setWorkouts(data) {
    logger.debug('store.js :: setWorkouts() :: triggered with ' + JSON.stringify(data));
    // Initialize active property
    for (const workoutIndex in data) {
      data[workoutIndex].seen = true;
      data[workoutIndex].active = false;
      data[workoutIndex].scores = [];
      data[workoutIndex].tags = [];
    }
    this.state.workouts = data;
  },
  addWorkout(data) {
    logger.debug('store.js :: addWorkout() :: triggered with ' + JSON.stringify(data));
    data.seen = true;
    data.active = false;
    data.scores = [];
    data.tags = [];
    this.state.workouts.push(data);
  },
  setWorkoutById(data, workoutId) {
    logger.debug('store.js :: setWorkoutById() :: triggered with ' + JSON.stringify(data) + '(' + workoutId + ')');
    const workoutIndex = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
    if (workoutIndex != null) {
      // Initialize active property
      data.seen = true;
      data.active = false;
      data.scores = [];
      data.tags = [];
      Vue.set(this.state.workouts, workoutIndex, data);
    } else {
      logger.error('store.js :: setWorkoutById() :: ERROR: Unable to update/add workout to array.');
    }
  },
  activateWorkout(workoutId) {
    logger.debug('store.js :: activateWorkout() :: triggered with ' + workoutId);
    this.state.workouts.map((workout) => {
      workout.id === workoutId ? workout.active = true : workout.active = false;
    });
  },
  deactivateWorkout(workoutId) {
    logger.debug('store.js :: deactivateWorkout() :: triggered with ' + workoutId);
    this.state.workouts.map((workout) => {
      workout.active = false;
    });
  },
  /**
   * Returns the id of active workout object.
   * If no workout is active returns -1
   * @return {integer} id
   */
  getActiveWorkoutId() {
    logger.debug('store.js :: getActiveWorkoutId() :: triggered');
    for (const workout of this.state.workouts) {
      if (workout.active) {
        return workout.id;
      }
    }
    return -1;
  },
  /**
   * Returns the active workout object.
   * If no workout is active returns null
   * @return {integer} id
   */
  getActiveWorkout() {
    logger.debug('store.js :: getActiveWorkout() :: triggered');
    const id = this.getActiveWorkoutId();
    if (id != -1) {
      return arrayHelper.getArrayObjectById(store.state.workouts, id);
    }
    return null;
  },
  /**
   * Returns the array index of active workout object.
   * If no workout is active returns -1
   * @return {integer} id
   */
  getActiveWorkoutIndex() {
    logger.debug('store.js :: getActiveWorkoutIndex() :: triggered');
    const id = this.getActiveWorkoutId();
    if (id != -1) {
      return arrayHelper.getArrayIndexById(store.state.workouts, id);
    }
    return -1;
  },
  hideWorkout(workoutIndex) {
    // logger.debug("store.js :: hideWorkout() :: triggered with " + workoutIndex);
    this.state.workouts[workoutIndex].seen = false;
  },
  showWorkout(workoutIndex) {
    // logger.debug("store.js :: showWorkout() :: triggered with " + workoutIndex);
    this.state.workouts[workoutIndex].seen = true;
  },
  hideAllWorkout() {
    logger.debug('store.js :: hideAllWorkout() :: triggered');
    for (const workoutIndex in this.state.workouts) {
      this.hideWorkout(workoutIndex);
    }
  },
  showAllWorkouts() {
    logger.debug('store.js :: showAllWorkout() :: triggered');
    for (const workoutIndex in this.state.workouts) {
      this.showWorkout(workoutIndex);
    }
  },
  /** *****************************
   * Score specific
   *******************************/
  setScores(data) {
    logger.debug('store.js :: setScores() :: triggered with ' + JSON.stringify(data));
    for (const workoutIndex in this.state.workouts) {
      const result = data.filter(function(score) {
        return score.workoutId == this.state.workouts[workoutIndex].id;
      }, this);
      if (result.length > 0) {
        for (const scoreIndex in result) {
          result[scoreIndex].selected = false;
        }
        this.state.workouts[workoutIndex].scores = result;
      }
    }
  },
  setScoresByWorkoutId(data, workoutId) {
    logger.debug('store.js :: setScoresByWorkoutId() :: triggered with ' + JSON.stringify(data) + '(' + workoutId + ')');
    const workoutIndex = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
    if (workoutIndex != null) {
      // Initialize selected property
      for (const scoreIndex in data) {
        data[scoreIndex].selected = false;
      }
      Vue.set(this.state.workouts[workoutIndex], 'scores', data);
    } else {
      logger.error('store.js :: setScoresByWorkoutId() :: ERROR: Unable to update/add workout scores to array.');
    }
  },
  addScore(data, workoutId) {
    logger.debug('store.js :: setScoreByWorkoutId() :: triggered with ' + JSON.stringify(data) + '(' + workoutId + ')');
    const workoutIndex = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
    if (workoutIndex != null) {
      data.selected = false;
      this.state.workouts[workoutIndex].scores.push(data);
    } else {
      logger.error('store.js :: setScoreByWorkoutId() :: ERROR: Unable to update/add workout score to array.');
    }
  },
  setScoreById(data, workoutId, scoreId) {
    logger.debug('store.js :: setScoreById() :: triggered with ' + JSON.stringify(data) + '(' + workoutId + ',' + scoreId + ')');
    const workoutIndex = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
    if (workoutIndex != null) {
      const scoreIndex = arrayHelper.getArrayIndexById(this.state.workouts[workoutIndex].scores, scoreId);
      if (scoreIndex != null) {
        data.selected = false;
        Vue.set(this.state.workouts[workoutIndex].scores, scoreIndex, data);
      } else {
        logger.error('store.js :: setScoreById() ::ERROR: Unable to update/add workout score to array.');
      }
    } else {
      logger.error('store.js :: setScoreById() ::ERROR: Unable to update/add workout score to array.');
    }
  },
  selectScore(workoutId, scoreId) {
    logger.debug('store.js :: selectScore() :: triggered with ' + workoutId + ',' + scoreId);
    this.state.workouts.map((workout) => {
      if (workout.id === workoutId) {
        workout.scores.map((score) => {
          score.id === scoreId ? score.selected = true : score.selected = false;
        });
      }
    });
  },
  unselectScore(workoutId, scoreId) {
    logger.debug('store.js :: unselectScore() :: triggered with ' + workoutId + ',' + scoreId);
    this.state.workouts.map((workout) => {
      if (workout.id === workoutId) {
        workout.scores.map((score) => {
          score.selected = false;
        });
      }
    });
  },
  /**
   * If score item is selected returns the id of item
   * If not returns -1
   * @param {integer} workoutId of workout object
   * @return {integer} id
   */
  getSelectedScoreId(workoutId) {
    logger.debug('store.js :: getSelectedScoreId() :: triggered with ' + workoutId);
    if (workoutId >= 0) {
      const index = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
      if (this.state.workouts[index].scores != null || this.state.workouts[index].scores != undefined) {
        for (const score of this.state.workouts[index].scores) {
          if (score.selected) {
            return score.id;
          }
        }
      }
    }
    return -1;
  },
  /**
   * Returns the selected score object.
   * If no score is seclected returns null
   * @param {integer} workoutId of workout object
   * @return {integer} id
   */
  getSelectedScore(workoutId) {
    logger.debug('store.js :: getSelectedScore() :: triggered with ' + workoutId);
    if (workoutId >= 0) {
      const index = arrayHelper.getArrayIndexById(this.state.workouts, workoutId);
      if (this.state.workouts[index].scores != null || this.state.workouts[index].scores != undefined) {
        const id = this.getSelectedScoreId(workoutId);
        if (id != -1) {
          return arrayHelper.getArrayObjectById(this.state.workouts[index].scores, id);
        }
      }
    }
    return null;
  },
};
