import type { Request, Response } from 'express';

const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
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
    console.error('Erro de Criação: ', error);
    return res.status(500).json({ error: 'Erro interno ao criar o projeto!' });
  }
};

// Get unique Project
const getProjectbyId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ errors: ['Projeto não encontrado"'] });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ errors: ['Projeto não encontrado!'] });
    return;
  }
};

// Get all Projects
const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!projects || projects.length === 0) {
      return res
        .status(200)
        .json({ message: 'Você não está participando de nenhum projetos' });
    }

    return res.status(200).json({ projects });
  } catch (error) {
    return res.status(404).json({ errors: ['Projetos não encontrados!'] });
  }
};

// Update Project
const updateProject = async (req: Request, res: Response) => {
  try {
    const { name, description, members } = req.body;

    const { id } = req.params;

    const reqUserId = req.user._id.toString();

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado!' });
    }

    if (!project.owner.equals(reqUserId)) {
      return res.status(403).json({
        error: 'Você não possui autorização para realizar esta ação!',
      });
    }

    if (name) {
      project.name = name;
    }

    if (description) {
      project.description = description;
    }

    if (members) {
      project.members = members;
    }

    await project.save();

    return res.status(200).json(project);
  } catch (error) {
    console.error('Erro de Update: ', error);
    return res
      .status(500)
      .json({ error: 'Erro interno ao atualizar o projeto!' });
  }
};

// Delete Project
const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reqUserId = req.user._id.toString();

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado!' });
    }

    if (!project.owner.equals(reqUserId)) {
      return res.status(403).json({
        error: 'Você não possui autorização para realizar esta ação!',
      });
    }

    await project.deleteOne();

    return res.status(200).json({ message: 'Projeto deletado com sucesso!' });
  } catch (error) {
    console.error('Erro de Delete: ', error);
    return res
      .status(500)
      .json({ error: 'Erro interno ao deletar o projeto!' });
  }
};

// Report
const getProjectReport = async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const today = new Date();

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: 'ID do projeto inválido!' });
  }

  try {
    const tasks = await Task.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      {
        $facet: {
          total: [{ $count: 'value' }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          overdue: [
            {
              $match: { dueDate: { $lt: today }, status: { $ne: 'CONCLUIDA' } },
            },
            { $count: 'value' },
          ],
          contributors: [
            { $match: { assignedTo: { $ne: null } } },
            {
              $group: {
                _id: '$assignedTo',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    res.json({ report: tasks[0] });
  } catch (error) {
    res.status(404).json({ errors: ['Erro interno ao gerar relatório!'] });
    return;
  }
};

module.exports = {
  createProject,
  getProjectbyId,
  getProjects,
  updateProject,
  deleteProject,
  getProjectReport,
};
