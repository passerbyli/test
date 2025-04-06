const http = require('http')
const fs = require('fs')
const { setValueByPath, getUserDataProperty } = require('./storeUtil')
const consoleUtil = require('./consoleLogUtil')
const myAxios = require('./myAxios')
const constants = require('../../constant/constants')

async function login(username, password, role) {
  return myAxios
    .post(constants.API.prod.login, {
      username,
      password,
    })
    .then((response) => {
      let data = response.data
      if (response.status !== 200) {
        return false
      } else {
        consoleUtil.log('登录成功')
        setValueByPath('auth', {
          username: username,
          password: password,
          role: role,
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
}

async function getUserInfo() {
  let cookieStr = getUserDataProperty('auth')
  return myAxios
    .get(constants.API.prod.checkLogin, {
      headers: {
        Cookie: cookieStr.cookies,
      },
      tag: 'xxajiso',
    })
    .then((response) => {
      response.data.data.role = cookieStr.role
      return response.data
    })
    .catch((err) => {
      return {
        type: 'error',
        message: err?.response?.data,
      }
    })
}

function fetchPageAndGetCookie(username, password) {
  const options = {
    hostname: 'localhost', // 修改为目标网站的主机名
    port: 3000,
    path: '/login', // 修改为目标网页的路径
    method: 'POST',
    headers: {},
    data: {
      username: username,
      password: password,
    },
  }

  const req = http.request(options, (res) => {
    let cookies = []

    // 获取所有的 Set-Cookie 头
    if (res.headers['set-cookie']) {
      cookies = res.headers['set-cookie']
    }

    res.on('data', (chunk) => {
      console.log(`Body: ${chunk}`)
    })

    res.on('end', () => {
      console.log('No more data in response.')
      console.log('Cookies:', cookies)

      // 将 cookies 写入文件
      fs.writeFile('cookies.txt', cookies.join('\n'), (err) => {
        if (err) {
          console.error('Error writing cookies to file:', err)
        } else {
          console.log('Cookies saved to cookies.txt')
        }
      })
    })
  })

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`)
  })

  req.end()
}

async function getMessage() {
  let cookieStr = getUserDataProperty('prod.cookies')
  return myAxios
    .get('http://localhost:3000/messages', {
      headers: {
        Cookie: cookieStr,
      },
      tag: 'xxajiso',
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      consoleUtil.error('getMessage:', err?.response?.data)
      return {
        type: 'error',
        message: err?.response?.data,
      }
    })
}

module.exports = {
  getUserInfo,
  getMessage,
  fetchPageAndGetCookie,
  login,
}
