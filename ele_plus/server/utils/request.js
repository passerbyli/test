const http = require('http')
const fs = require('fs')
const { setValueByPath, getUserDataProperty } = require('./storeUtil')
const consoleUtil = require('./consoleLogUtil')
const myAxios = require('./myAxios')
const constants = require('../../constant/constants')

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
  let cookieStr = getUserDataProperty('auth.cookies')
  console.log('djaiosdjaiojdasoi', cookieStr)
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
      consoleUtil.error('============getMessage:', err?.response?.data)
      return {
        type: 'error',
        message: err?.response?.data,
      }
    })
}

async function queryKg(params) {
  console.log(params)
  let cookieStr = getUserDataProperty('auth.cookies')

  url = 'http://127.0.0.1:8081/test/g6/resolve'
  return myAxios
    .post(
      `${url}`,
      {
        tableId: params.name,
        level: parseInt(params.level),
        direction: params.direction,
        closed: params.closed,
        nodeFilter: {
          // layer: ['ods', 'ads'],
          layer: ['dim'],
        },
        relFilter: {
          // sqlName: ['sql_10', 'sql_debug'],
        },
      },
      {
        headers: {
          Cookie: cookieStr,
        },
        tag: 'xxajiso',
      },
    )
    .then((response) => {
      console.log(response)
      return response.data
    })
    .catch((err) => {
      consoleUtil.error('============getMessage:', err?.response?.data)
      return {
        type: 'error',
        message: err?.response?.data,
      }
    })
}

module.exports = {
  queryKg,
  getUserInfo,
  getMessage,
  fetchPageAndGetCookie,
}
