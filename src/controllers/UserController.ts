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
    token: generateToken(newUser._id)
  })
};

module.exports = {
  register
}
