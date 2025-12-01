import type { Request, Response } from 'express';

const Project = require('../models/Project');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create Project
const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, members } = req.body;

    const owner = req.user._id;

    const newProject = await Project.create({
      name,
      description,
      owner,
      members: Array.isArray(members) ? members : [],
    });

    return res.status(201).json(newProject);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao criar o projeto!' });
  }
};

const getProject = async (req: Request, res: Response) => {};

const updateProject = async (req: Request, res: Response) => {};

const deleteProject = async (req: Request, res: Response) => {};

module.exports = { createProject };
