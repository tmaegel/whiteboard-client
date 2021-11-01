class User {

  constructor(user_id, name) {
    this.user_id = user_id;
    this.name = name;
    this.authenticated = false;
    this.token;
  }

  is_authenticated() {
    if(this.token && this.authenticated == true) {
      return true;
    } else {
      return false;
    }
  }

  set_token(token) {
    if(!token) {
      throw 'ERROR: Invalid or empty token';
    }
    this.token = token;
    this.authenticated = true;
  }

}

class Workout {

  constructor(workout_id, name, description, datetime) {
    this.workout_id = workout_id;
    this.name = name;
    this.description = description;
    this.datetime = datetime;
    // this.scores = [];
  }

}

class Score {

  constructor(score_id, workout_id, value, rx, note, datetime) {
    this.score_id = score_id;
    this.workout_id = workout_id;
    this.value = value;
    this.rx = rx;
    this.note = note;
    this.datetime = datetime;
  }

}

class Tag {

  constructor(tag_id, name) {
    this.tag_id = tag_id;
    this.name = name;
  }

}

class Equipment {

  constructor(equipment_id, name) {
    this.equipment_id = equipment_id;
    this.name = name;
  }

}

class Movement {


  constructor(movement_id, name, equipment_ids) {
    this.movement_id = movement_id;
    this.name = name;
    this.equipment_ids = equipment_ids;
  }

}

export { User, Workout, Score, Tag, Equipment, Movement }
