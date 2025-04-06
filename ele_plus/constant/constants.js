module.exports = {
  StoreKeys: {
    COOKIES_KEY: 'cookies',
    OPTIONS_KEY: 'options',
  },
  API: {
    beta: {
      login: '',
      logout: '',
      checkLogin: '',
    },
    prod: {
      login: 'http://localhost:3000/login',
      logout: 'http://localhost:3000/logout',
      checkLogin: 'http://localhost:3000/userinfo',
    },
    projectM: {
      us: '',
      item: '',
      updateUS: '',
      updateItem: '',
    },
  },
}
