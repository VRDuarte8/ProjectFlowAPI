import type { Request, Response } from 'express';

const express = require('express');
const router = express.Router();

router.use('/api/users', require('./UserRoutes'));
router.use('/api/projects', require('./ProjectRoutes'));
router.use('/api/tasks', require('./TaskRoutes'));

//test
router.get('/api', (req: Request, res: Response) => {
  res.send('API working');
});

module.exports = router;
