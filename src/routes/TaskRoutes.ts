const express = require('express');
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskbyProject,
} = require('../controllers/TaskController');

const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { createValidation } = require('../middlewares/taskValidation');

router.post('/create', authGuard, createValidation(), validate, createTask);
router.get('/', authGuard, getAllTasks)
router.get('/project/:id', authGuard, getTaskbyProject)

module.exports = router;
