const express = require('express');
const router = express();

const {register} = require('../controllers/UserController')

router.post('/register', register)

module.exports = router