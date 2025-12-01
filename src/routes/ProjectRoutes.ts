const express = require('express');
const router = express.Router();

const { createProject, getProjectbyId, getProjects } = require('../controllers/ProjectController');

const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { createValidation } = require('../middlewares/projectValidations');

router.post('/create', authGuard, createValidation(), validate, createProject);
router.get('/', authGuard, getProjects)
router.get('/:id', authGuard, getProjectbyId)

module.exports = router;
