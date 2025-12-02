const express = require('express');
const router = express.Router();

const { createTask } = require('../controllers/TaskController');

const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { createValidation } = require('../middlewares/taskValidation');

router.post('/create', authGuard, createValidation(), validate, createTask);

module.exports = router;
