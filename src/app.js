require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('./configs/db');

const app = express();

// Configurações do CORS
const corsOptions = {
  origin: '*',
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};
app.use(cors(corsOptions));
app.options('*', cors()); // Habilita preflight para todas as rotas

// Configuração do cabeçalho CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Segurança
app.use(helmet());

// Requisições tipo urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do morgan
app.use(morgan('dev'));

// Rotas
app.use("/api", require('./routes/index'));

// Tratamento de erros

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});