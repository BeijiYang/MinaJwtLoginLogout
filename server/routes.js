const express = require('express')

const users = require('./api/users')
const hello = require('./api/hello')

const config = require('./config/config')

const router = express.Router()


router.get('/', hello.world)

//换取token
router.post('/login', users.login)

module.exports = router
