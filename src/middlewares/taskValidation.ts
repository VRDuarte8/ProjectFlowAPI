import type { Request } from 'express';
import type { Types } from 'mongoose';

const { body } = require('express-validator');
const User = require('../models/User');
const Project = require('../models/Project');
const mongoose = require('mongoose');

const createValidation = () => {
  return [
    body('title').notEmpty().withMessage('O título é obrigatório'),
    body('status')
      .optional()
      .customSanitizer((value: string) => value.toUpperCase())
      .isIn(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'])
      .withMessage(
        'Status inválido! Use "PENDENTE", "EM_ANDAMENTO" ou "CONCLUIDA"'
      ),
    body('priority')
      .optional()
      .customSanitizer((value: string) => value.toUpperCase())
      .isIn(['BAIXA', 'MEDIA', 'ALTA'])
      .withMessage('Prioridade inválida! Use "BAIXA", "MEDIA" ou "ALTA"'),
    body('project').custom(async (projectId: string) => {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('O ID do projeto é inválido!');
      }
      const foundProject = await Project.findById(projectId);
      if (!foundProject) throw new Error('O projeto informado não existe!');

      return true;
    }),
    body('assignedTo')
      .optional()
      .custom(async (userId: string, { req }: { req: Request }) => {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('O ID do usuário atribuído é inválido!');
        }
        const foundUser = await User.findById(userId);
        if (!foundUser) throw new Error('O usuário atribuído não existe!');

        const projectId = req.body.project;
        const foundProject = await Project.findById(projectId);

        if (!foundProject) return true;

        const isOwner = foundProject.owner.equals(userId);
        const isMember = foundProject.members.some((m: Types.ObjectId) =>
          m.equals(userId)
        );

        if (!isOwner && !isMember) {
          throw new Error('O usuário atribuído não pertence ao projeto!');
        }

        return true;
      }),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('A data deve estar em formato válido (YYYY-MM-DD)!'),
  ];
};

const updateValidation = () => {
  return [
    body('status')
      .optional()
      .customSanitizer((value: string) => value.toUpperCase())
      .isIn(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'])
      .withMessage(
        'Status inválido! Use "PENDENTE", "EM_ANDAMENTO" ou "CONCLUIDA"'
      ),
    body('priority')
      .optional()
      .customSanitizer((value: string) => value.toUpperCase())
      .isIn(['BAIXA', 'MEDIA', 'ALTA'])
      .withMessage('Prioridade inválida! Use "BAIXA", "MEDIA" ou "ALTA"'),
    body('assignedTo')
      .optional()
      .custom(async (userId: string, { req }: { req: Request }) => {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('O ID do usuário atribuído é inválido!');
        }
        const foundUser = await User.findById(userId);
        if (!foundUser) throw new Error('O usuário atribuído não existe!');

        const projectId = req.body.project;
        const foundProject = await Project.findById(projectId);

        if (!foundProject) return true;

        const isOwner = foundProject.owner.equals(userId);
        const isMember = foundProject.members.some((m: Types.ObjectId) =>
          m.equals(userId)
        );

        if (!isOwner && !isMember) {
          throw new Error('O usuário atribuído não pertence ao projeto!');
        }

        return true;
      }),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('A data deve estar em formato válido (YYYY-MM-DD)!'),
  ];
};

module.exports = {
  createValidation,
  updateValidation
};
