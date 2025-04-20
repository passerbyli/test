const myAxios = require('../utils/myAxios')
const constants = require('../../constant/constants')
const consoleUtil = require('../utils/consoleLogUtil')
module.exports = {
  async loginHeader(params) {
    return myAxios
      .post(constants.API.prod.login, {
        username: params.username,
        password: params.password,
      })
      .then((response) => {
        let data = response.data
        if (response.status !== 200) {
          return false
        } else {
          consoleUtil.log('登录成功')
          setValueByPath('auth', {
            username: params.username,
            password: params.password,
            role: params.role,
            cookies: response.headers['set-cookie'],
            isLogin: true,
            exception: false,
          })
        }
        return data
      })
      .catch((err) => {
        if (err.response) {
          return {
            type: 'error',
            message: err.response,
          }
        } else {
          return {
            type: 'error',
            message: err.code,
          }
        }
      })
  },
}
