const config = {
  host: 'http://127.0.0.1',
  port: 5000,
  api: {
    root: '/rest/v1/',
    login: {
      'valid': ['POST'],
      'route': '/auth/login',
    },
    workout_list: {
      'valid': ['GET', 'POST'],
      'route': '/workout',
    },
    workout: {
      'valid': ['GET', 'PUT', 'DELETE'],
      'route': '',
    },
    score: {
      'valid': [],
      'route': '',
    },
    tag: {
      'valid': [],
      'route': '',
    },
    equipment: {
      'valid': [],
      'route': '',
    },
    movement: {
      'valid': [],
      'route': '',
    },
  }
}

export default config
