const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
  getUserById,
  update,
  deleteUser,
} = require('../controllers/UserController');

const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const {
  registerValidation,
  loginValidation,
  userUpdateValidation,
} = require('../middlewares/userValidations');

router.post('/register', registerValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);
router.get('/profile', authGuard, getCurrentUser);
router.put('/', authGuard, userUpdateValidation(), validate, update);
router.get('/:id', getUserById);
router.delete('/:id', authGuard, deleteUser);

module.exports = router;
