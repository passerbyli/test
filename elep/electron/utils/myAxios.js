const fs = require('fs')
const path = require('path')
const axios = require('axios')
const https = require('https')

const myAxios = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  timeout: 10000,
})

module.exports = myAxios
