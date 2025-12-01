const express = require('express');
const router = express.Router();

const { createProject } = require('../controllers/ProjectController');

const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { createValidation } = require('../middlewares/projectValidations');

router.post('/create', authGuard, createValidation(), validate, createProject);

module.exports = router;
