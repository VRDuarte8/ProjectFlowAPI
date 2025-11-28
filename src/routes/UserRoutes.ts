const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
  getUserById,
} = require('../controllers/UserController');

const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const {
  registerValidation,
  loginValidation,
} = require('../middlewares/userValidations');

router.post('/register', registerValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);
router.get('/profile', authGuard, getCurrentUser);
router.get('/:id', getUserById)

module.exports = router;
