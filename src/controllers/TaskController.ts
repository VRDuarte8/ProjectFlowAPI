import type { Request, Response } from 'express';
import type { Types } from 'mongoose';

const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const mongoose = require('mongoose');

const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body;

    const reqUserId = req.user._id.toString();

    // Verify if project exists
    const projectData = await Project.findById(project);
    if (!projectData) {
      return res.status(404).json({ error: 'Projeto não encontrado!' });
    }

    // Verify if user is owner or member
    const isOwner = projectData.owner.equals(reqUserId);
    const isMember = projectData.member.some((m: Types.ObjectId) =>
      m.equals(reqUserId)
    );

    if (!isOwner && !isMember) {
      return res
        .status(203)
        .json({
          error:
            'Você não possui autorização para criar tarefas para este projeto!',
        });
    }

    const newTask = await Task.create({
      title,
      description,
      status: status.toUp,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      project,
      assignedTo: assignedTo || null,
    });

    return res.status(201).json(newTask)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao criar task!' });
  }
};

const getTask = async (req: Request, res: Response) => {};

const updateTask = async (req: Request, res: Response) => {};

const deleteTask = async (req: Request, res: Response) => {};

module.exports = {
  createTask,
};
