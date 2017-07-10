const express = require('express')
const config = require('./config/config')

const users = require('./api/users')
const hello = require('./api/hello')

const router = express.Router()

router.get('/', hello.world)

//检测token是否过期
router.post('/auth',users.checkToken)
//换取token
router.post('/login', users.login)

module.exports = router
