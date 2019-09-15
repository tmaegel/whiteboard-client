'use strict';

// Workout

class Workout {

    constructor(id, datetime, name, description) {
        this.id = id;                       /**< id */
        this.datetime = datetime;           /**< datetime */
        this.name = name;                   /**< name */
        this.description = description;     /**< description */
        this.score = new Array()            /**< scores */
    }

}
