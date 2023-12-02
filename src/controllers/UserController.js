const User = require('../models')

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Rota para registro de um novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password, permission } = req.body;

  try {
    // Verifica se o nome de usuário ou e-mail já existem no banco de dados
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });

    if (existingUser) {
      return res.status(400).json({ error: 'Nome de usuário ou e-mail já em uso' });
    }

    // Verifica se a permissão fornecida é válida
    if (permission && !User.schema.path('permission').enumValues.includes(permission)) {
      return res.status(400).json({ error: 'Permissão inválida' });
    }

    // Cria um hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria um novo usuário no banco de dados
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      permission: permission || 'beta', // Se não especificado, assume 'beta'
    });

    await newUser.save(); // Salva o usuário no banco de dados

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;