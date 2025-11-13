import type { Request, Response } from 'express';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

require('./config/db')

app.get('/api/health', (req: Request, res: Response) =>
  res.json({ ok: true })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
