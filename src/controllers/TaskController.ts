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
      project,
      assignedTo,
      dueDate,
    } = req.body;

    const reqUserId = req.user._id.toString();

    // Verify if project exists
    const projectData = await Project.findById(project);
    if (!projectData) {
      return res.status(404).json({ error: 'Projeto não encontrado!' });
    }

    // Verify if user is owner or member
    const isOwner = projectData.owner.equals(reqUserId);
    const isMember = projectData.members.some((m: Types.ObjectId) =>
      m.equals(reqUserId)
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error:
          'Você não possui autorização para criar tarefas para este projeto!',
      });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      project,
      assignedTo: assignedTo || null,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro de Criação: ', error);
    return res.status(500).json({ error: 'Erro interno ao criar task!' });
  }
};

const getAllTasks = async (req: Request, res: Response) => {
  try {
    const reqUserId = req.user._id.toString();

    const tasks = await Task.find({ assignedTo: reqUserId });
    if (tasks.length === 0) {
      return res.status(200).json({ message: 'Voce não possui tarefas!' });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao buscar tasks!' });
  }
};

const getTaskbyProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reqUserId = req.user._id.toString();
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'O projeto informado não existe!' });
    }

    const isOwner = project.owner.equals(reqUserId);
    const isMember = project.members.some((m: Types.ObjectId) =>
      m.equals(reqUserId)
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error:
          'Você não possui autorização para visualizar as tarefas deste projeto!',
      });
    }

    const tasks = await Task.find({ project: project._id });

    if (tasks.length === 0)
      return res
        .status(200)
        .json({ message: 'Este projeto não possui tarefas!' });

    return res.status(200).json(tasks);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro interno ao buscar tarefas do projeto informado!' });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } =
      req.body;

    const { id } = req.params;

    const reqUserId = req.user._id.toString();

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada!' });
    }

    const project = await Project.findById(task.project);

    if (
      !project.owner.equals(reqUserId) &&
      !task.assignedTo.equals(reqUserId)
    ) {
      return res.status(403).json({
        error: 'Você não possui autorização para atualizar esta tarefa!',
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.error('Erro de Update: ', error);
    return res
      .status(500)
      .json({ error: 'Erro interno ao atualizar a tarefa!' });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reqUserId = req.user._id.toString();

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada!' });
    }

    const project = await Project.findById(task.project);

    if (!project.owner.equals(reqUserId)) {
      return res.status(403).json({
        error: 'Você não possui autorização para deletar esta tarefa!',
      });
    }

    await task.deleteOne();

    return res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    console.error('Erro de Delete: ', error);
    return res.status(500).json({ error: 'Erro interno ao deletar a task!' });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskbyProject,
  updateTask,
  deleteTask
};
