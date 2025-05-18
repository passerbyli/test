const express = require('express')
const session = require('express-session')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.use(
  session({
    secret: 'your_secret_key', // 用于加密session
    resave: false, // 每次请求是否强制保存session
    saveUninitialized: true, // 是否保存未初始化的session
    cookie: { maxAge: 5 * 1000 }, // session有效时间：1小时
  })
)

// 读取 JSON 文件
function readJsonFile(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

// 写入 JSON 文件
function writeJsonFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

// 登录接口
app.post('/login', (req, res) => {
  const { username, password } = req.body
  const users = readJsonFile('./users.json')
  const user = users.find((u) => u.username === username && u.password === password)
  console.log(username, password)
  if (user) {
    req.session.user = { username } // 保存登录信息到session
    console.log('login ok------')
    res.json({
      message: '登录成功',
      data: {
        user: {
          username,
        },
      },
    })
  } else {
    res.status(401).json({ message: '用户名或密码错误' })
  }
})

// 注销接口
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: '注销失败' })
    } else {
      console.log('logout ok------')
      res.json({ message: '注销成功' })
    }
  })
})

// 注册接口
app.post('/register', (req, res) => {
  const { username, password } = req.body
  const users = readJsonFile('./users.json')

  if (users.some((u) => u.username === username)) {
    res.status(400).json({ message: '用户名已存在' })
  } else {
    users.push({ username, password })
    writeJsonFile('./users.json', users)
    res.json({ message: '注册成功' })
  }
})

// 认证中间件
function authenticateSession(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.status(401).json({ message: '未登录，请先登录' })
  }
}

// userinfo
app.get('/userinfo', authenticateSession, (req, res) => {
  let userinfo = readJsonFile('./userinfo.json')
  userinfo.data.username = userinfo.data.username + Math.floor(Math.random() * 100)
  console.log('userinfo', userinfo)
  res.json(userinfo)
})

// 信息列表接口（需认证）
app.get('/messages', authenticateSession, (req, res) => {
  const messages = readJsonFile('./messages.json')
  res.json(messages)
})

// 信息明细接口（需认证）
app.get('/messages/:id', authenticateSession, (req, res) => {
  const messages = readJsonFile('./messages.json')
  const message = messages.find((m) => m.id === parseInt(req.params.id))

  if (message) {
    res.json(message)
  } else {
    res.status(404).json({ message: '信息未找到' })
  }
})

app.get('/version', (req, res) => {
  res.json({
    version: '1.1.0',
    url: 'https://www.bilibili.com/',
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行：http://localhost:${PORT}`)
})
