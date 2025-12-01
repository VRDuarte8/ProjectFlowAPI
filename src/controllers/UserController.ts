import type { Request, Response } from 'express';

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
};

// Register
const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(422).json({ erros: ['E-mail já cadastrado!'] });
      return;
    }

    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
    });

    // If created sucessfully, return the token
    if (!newUser) {
      res.status(422).json({
        errors: ['Houve um erro, tente novamente mais tarde!'],
      });
      return;
    }

    res.status(201).json({
      _id: newUser._id,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao criar usuário!' });
  }
};

// Login
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ errors: ['Usuário não encotrado!'] });
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      res.status(422).json({ errors: ['Senha inválida!'] });
      return;
    }

    res.status(200).json({ _id: user._id, token: generateToken(user._id) });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao realizar o login!' });
  }
};

// Get logged user
const getCurrentUser = async (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).json(user);
};

// Get user by id
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({ errors: ['Usuário não encontrado"'] });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ['Usuário não encontrado!'] });
    return;
  }
};

// Update user
const update = async (req: Request, res: Response) => {
  try {
    const { name, password, role } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id).select('-password');

    if (name) {
      user.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro interno ao atualizar o usuário!' });
  }
};

// Delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reqUserId = req.user._id.toString();

    const user = await User.findById(id);

    if (reqUserId !== user._id.toString()) {
      res
        .status(403)
        .json({
          error: 'Você não possui autorização para realizar esta ação!',
        });
      return;
    }

    await user.deleteOne();

    return res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro interno ao deletar o usuário!' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getUserById,
  update,
  deleteUser,
};
