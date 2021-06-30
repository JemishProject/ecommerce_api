const express = require('express')
const router = express.Router()
const UserActions = require('./users')

router.use('/user', UserActions)

module.exports = router