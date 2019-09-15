'use strict';

// User

class User {

    constructor(name, password, token = null) {
        this.name = name;                   /**< name */
        this.password = password;           /**< password */
        this.token = token;                 /**< jwt */
    }

}
