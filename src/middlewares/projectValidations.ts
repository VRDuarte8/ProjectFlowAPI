const { body } = require('express-validator');
const User = require('../models/User');
const mongoose = require('mongoose');

const createValidation = () => {
  return [
    body('name').isString().withMessage('O nome do projeto é obrigatório!'),
    body('members')
      .optional()
      .isArray()
      .withMessage('O campo "members" deve ser um array!')
      .custom(async (members: string[] | undefined) => {
        if (!members || members.length === 0) return true;

        for (const id of members) {
          if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error(`ID de membro inválido: ${id}`);
          const foundUser = await User.findById(id);
          if (!foundUser) throw new Error(`O membro de ID ${id} não existe!`);
        }

        return true;
      }),
  ];
};

const updateProjectValidation = () => {
  return [
    body('members')
      .optional()
      .isArray()
      .withMessage('O campo "members" deve ser um array!')
      .custom(async (members: string[] | undefined) => {
        if (!members || members.length === 0) return true;

        for (const id of members) {
          if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error(`ID de membro inválido: ${id}`);
          const foundUser = await User.findById(id);
          if (!foundUser) throw new Error(`O membro de ID ${id} não existe!`);
        }

        return true;
      }),
  ]
}

module.exports = {
  createValidation,
  updateProjectValidation
};
