const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const porta = 3000;

// Configurando o express para lidar com POSTs
app.use(express.urlencoded({ extended: true }));

// Configurando o banco de dados (esta em rede)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'apisql'
});

// Conectando-se ao banco de dados
db.connect((err) => {
  if (err) {
    console.log(`Erro ao conectar-se ao banco de dados: ${err.message}`);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados');
  }
});


// Criando a rota para inserir dados no banco de dados
app.post('/cliente/gravar', (req, res) => {
  const { nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, tipo_cliente_id } = req.body;
  
  const sql = 'INSERT INTO cliente (nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, tipo_cliente_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [nome, telefone, email, logradouro, numero, complemento, bairro, cidade, uf, cep, tipo_cliente_id], (err, result) => {
    if (err) {
      console.log(`Erro ao inserir dados no banco de dados: ${err.message}`);
      res.status(500).send('Erro interno do servidor');
    } else {
      console.log(`Dados inseridos com sucesso. ID do novo cliente: ${result.insertId}`);
      res.status(200).send(`Dados inseridos com sucesso. ID do novo cliente: ${result.insertId}`);
    }
  });
});


// Criando a rota para buscar dados no banco de dados com base no e-mail ou no ID do cliente
app.get('/cliente/:chave/:valor', (req, res) => {
  const { chave, valor } = req.params;
  let sql;

  if (chave === "id") {
    sql = `SELECT * FROM cliente WHERE id = ?`;
  } else if (chave === "email") {
    sql = `SELECT * FROM cliente WHERE email = ?`;
  } else {
    return res.status(400).send('Chave inválida');
  }

  db.query(sql, [valor], (err, result) => {
    if (err) {
      console.log(`Erro ao buscar dados no banco de dados: ${err.message}`);
      return res.status(500).send('Erro interno do servidor');
    }
    console.log(`Dados encontrados: ${JSON.stringify(result)}`);
    return res.status(200).send(result);
  });
});



// Criando a rota para buscar os tipos de clientes no banco de dados
app.get('/tipo_cliente', (req, res) => {
  const sql = 'SELECT * FROM tipo_cliente';
  return db.query(sql, (err, result) => {
    if (err) {
      console.log(`Erro ao buscar tipos de clientes no banco de dados: ${err.message}`);
      return res.status(500).send('Erro interno do servidor');
    } else {
      console.log(`Tipos de clientes encontrados: ${JSON.stringify(result)}`);
      return res.status(200).send(result);
    }
  });
});


// Iniciando o servidor
app.listen(porta, () => {
  console.log(`Servidor ouvindo na porta ${porta}`);
});``