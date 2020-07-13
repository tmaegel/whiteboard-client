module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
    "jquery": true
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/essential',
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 11,
    'sourceType': 'module',
  },
  'plugins': [
    'vue',
  ],
  'rules': {
    "max-len": ["error", { "code": 120 }]
  },
};
