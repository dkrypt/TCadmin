module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2020': true
  },
  'extends': [
    'google'
  ],
  'parserOptions': {
    'ecmaVersion': 11
  },
  'rules': {
    'max-len': ['error', {'code': 150}],
    'comma-dangle': ['error', 'never'],
    'new-cap': ['error', {'capIsNew': false}]
  }
};
