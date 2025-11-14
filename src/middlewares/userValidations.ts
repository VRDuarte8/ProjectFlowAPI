const { body } = require('express-validator');

const registerValidation = () => {
  return [
    body('name')
      .isString()
      .withMessage('O nome é obrigatório!')
      .isLength({ min: 3 })
      .withMessage('O nome precisa ter no mínimo 3 caracteres!'),
    body('email')
      .isString()
      .withMessage('o e-mail é obrigatório')
      .isEmail()
      .withMessage('insira um e-mail válido!'),
    body('password')
      .isString()
      .withMessage('A senha é obrigatória')
      .isLength({ min: 5 })
      .withMessage('A senha precisa ter no mínimo 5 caracteres!'),
  ];
};

const loginValidation = () => {
  return [
    body('email')
      .isString()
      .withMessage('o e-mail é obrigatório')
      .isEmail()
      .withMessage('insira um e-mail válido!'),
    body('password').isString().withMessage('A senha é obrigatória'),
  ];
};

module.exports = {
  registerValidation,
  loginValidation,
};
