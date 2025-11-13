import type { Request, Response } from 'express';

const express = require('express');
const router = express();

router.use('/api/users', require('./UserRoutes'));

//test
router.get('/api', (req: Request, res: Response) => {
  res.send('API working');
});

module.exports = router;
