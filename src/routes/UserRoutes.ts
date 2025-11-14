const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/UserController');

const validate = require('../middlewares/handleValidation');
const {
  registerValidation,
  loginValidation,
} = require('../middlewares/userValidations');

router.post('/register', registerValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);

module.exports = router;
