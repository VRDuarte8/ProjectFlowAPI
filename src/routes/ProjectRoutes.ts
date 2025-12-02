const express = require('express');
const router = express.Router();

const {
  createProject,
  getProjectbyId,
  getProjects,
  updateProject,
  deleteProject
} = require('../controllers/ProjectController');

const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const {
  createValidation,
  updateProjectValidation,
} = require('../middlewares/projectValidations');

router.post('/create', authGuard, createValidation(), validate, createProject);
router.get('/', authGuard, getProjects);
router.get('/:id', authGuard, getProjectbyId);
router.put('/:id', authGuard, updateProjectValidation(), validate, updateProject);
router.delete('/:id', authGuard, deleteProject)

module.exports = router;
