const express = require('express');
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskbyProject,
  updateTask
} = require('../controllers/TaskController');

const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { createValidation, updateValidation } = require('../middlewares/taskValidation');

router.post('/create', authGuard, createValidation(), validate, createTask);
router.get('/', authGuard, getAllTasks)
router.get('/project/:id', authGuard, getTaskbyProject)
router.put('/:id', authGuard, updateValidation(), validate, updateTask)

module.exports = router;
