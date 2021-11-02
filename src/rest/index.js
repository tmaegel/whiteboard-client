import config from '@/config'
import store from '@/store'
import { login_required } from '@/decorators'
import { error } from '@/notification'

class RestClient {

  /**
   * host: hostname of the rest api
   * port: port of the rest api
   * route: route of the rest api
   */
  constructor(host, port) {
    if(!host) {
      this.host = config.host;
    } else {
      this.host = host;
    }
    if(!port) {
      this.port = config.port;
    } else {
      this.port = port;
    }
    this.route;
    this.url;
    this.method; // current method: GET, POST, PUT or DELETE
    this.headers = { // Default headers
      'Content-Type': 'application/json',
    }
  }

  /*
   * method: Current method
   * valid_methods: Ppossible valid methods per request
   */
  setup(route, method, valid_methods = []) {
    if(!route || !method || !valid_methods) {
      throw 'ERROR: Missing arguments during setup';
    }
    if(valid_methods.indexOf(method) == -1) {
      throw 'ERROR: Invalid method';
    }
    this.method = method;
    console.debug('Configured method ' +  this.method);
    this.route = route.replace(/\/{2,}/, '/');
    this.url = this.host + ':' + this.port + this.route;
    console.debug('Configured url ' +  this.url);
  }

  get_request_obj() {
    let req = new XMLHttpRequest();
    req.open(this.method, this.url);
    for (const [key, value] of Object.entries(this.headers)) {
      req.setRequestHeader(key, value);
      console.debug('Configured ' +  key + ' header');
    }
    // Set to 'text' otherwise there will be no
    // responseText attribute in the response.
    req.responseType = 'text';
    return req;
  }

  add_header(key, value) {
    if(!key || !value) {
      throw 'ERROR: Invalid header';
    }
    this.headers[key] = value
  }

  add_auth_header(token) {
    if(!token) {
      throw 'ERROR: Invalid or empty token';
    }
    if('Authorization' in this.headers) {
      delete this.headers['Authorization'];
    }
    this.add_header('Authorization', 'Bearer ' + token);
  }

  request(payload, success, error) {
    let req = this.get_request_obj(); // Configure request
    console.debug('Request ' + this.method + ' ' + this.url)
    // Send the req.
    if(this.method == 'GET') {
      req.send();
    } else {
      if(!payload) {
        console.error('ERROR: Missing data in request object');
        return;
      }
      req.send(JSON.stringify(payload));
    }
    // Will be called after the response is received
    // even if HTTP status is like 400 or 500.
    req.onload = () => {
      if(req.status != 200) {
        console.error('Error during ' + this.route +
                      ' (' + req.status + ' ' + req.statusText + ')');
        let json_err = JSON.parse(req.responseText);
        if(error) {
          error(json_err);
        }
        return;
      }
      // Get response here.
      console.debug('Response ' + this.method + ' ' + this.url);
      let json_resp = JSON.parse(req.responseText);
      if(success) {
        success(json_resp);
      }
    };
    // Triggers if the req couldn't be made at all.
    // Handle non-HTTP error (e.g. network down) here.
    req.onerror = () => {
      console.error('Request failed with ' + this.route +
                    ' (probably network problems)');
    };
  }

}

class RestAuth extends RestClient {

  constructor() {
    super();
  }

  login(username, password, success) {
    let route = config.api.login
    this.setup(config.api.root + route['route'],
               'POST', route['valid'])
    this.request(
      {
        username: username,
        password: password
      },
      (data) => {
        success(data)
      },
      (json_err) => {
        error(json_err.message)
      }
    );
  }

}

class RestWorkout extends RestClient {

  constructor() {
    super();
  }

  @login_required
  list(success) {
    let route = config.api.workout_list
    this.setup(config.api.root + route['route'],
               'GET', route['valid'])
    this.add_auth_header(store.state.user.token);
    this.request(null,
      (data) => {
        success(data)
      },
      (json_err) => {
        error(json_err.message)
      }
    );
  }

  @login_required
  add() {

  }

}

export { RestClient, RestAuth, RestWorkout }
